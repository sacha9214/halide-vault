import { NextRequest, NextResponse } from "next/server";
import * as https from "node:https";

interface ChartPoint { time: string; value: number; volume?: number; }

const CACHE = new Map<string, { data: ChartPoint[]; exp: number }>();
const TTL = 5 * 60 * 1000;

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HalideVault/1.0)",
        "Accept": "application/json",
      },
    }, (res) => {
      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
        } else {
          resolve(data);
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json([], { status: 400 });

  const cached = CACHE.get(id);
  if (cached && Date.now() < cached.exp) return NextResponse.json(cached.data);

  try {
    const raw = await httpsGet(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=30&interval=daily`
    );
    const json = JSON.parse(raw);

    const prices = json.prices as [number, number][];
    const vols = json.total_volumes as [number, number][];

    if (!prices?.length) return NextResponse.json([], { status: 502 });

    const seen = new Set<string>();
    const data: ChartPoint[] = prices
      .map(([ts, price]: [number, number], i: number) => ({
        time: new Date(ts).toISOString().slice(0, 10),
        value: price,
        volume: vols[i]?.[1] ?? 0,
      }))
      .filter((d: { time: string }) => {
        if (seen.has(d.time)) return false;
        seen.add(d.time);
        return true;
      });

    if (data.length === 0) return NextResponse.json([], { status: 502 });

    CACHE.set(id, { data, exp: Date.now() + TTL });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json([], { status: 502 });
  }
}
