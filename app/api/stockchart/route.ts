import * as https from "node:https";

interface ChartPoint { time: string; value: number; volume?: number; }

const CACHE = new Map<string, { data: ChartPoint[]; exp: number }>();
const TTL = 10 * 60 * 1000;

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = (searchParams.get("ticker") ?? "").trim().toUpperCase();
  if (!ticker) return Response.json([], { status: 400 });

  const cached = CACHE.get(ticker);
  if (cached && Date.now() < cached.exp) return Response.json(cached.data);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1mo`;
    const body = await httpsGet(url);
    const json = JSON.parse(body);

    const result = json?.chart?.result?.[0];
    if (!result) return Response.json([], { status: 502 });

    const timestamps: number[] = result.timestamp ?? [];
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];
    const volumes: number[] = result.indicators?.quote?.[0]?.volume ?? [];

    const seen = new Set<string>();
    const data: ChartPoint[] = timestamps
      .map((ts, i) => ({
        time: new Date(ts * 1000).toISOString().slice(0, 10),
        value: closes[i] ?? 0,
        volume: volumes[i] ?? 0,
      }))
      .filter((d) => {
        if (d.value <= 0 || seen.has(d.time)) return false;
        seen.add(d.time);
        return true;
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    if (data.length === 0) return Response.json([], { status: 502 });

    CACHE.set(ticker, { data, exp: Date.now() + TTL });
    return Response.json(data);
  } catch {
    return Response.json([], { status: 502 });
  }
}
