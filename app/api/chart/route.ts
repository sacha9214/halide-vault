import { NextRequest, NextResponse } from "next/server";
import * as https from "node:https";

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, {
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
    }).on("error", reject);
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  try {
    const raw = await httpsGet(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=30&interval=daily`
    );
    const json = JSON.parse(raw);

    const prices = json.prices as [number, number][];
    const vols = json.total_volumes as [number, number][];

    const seen = new Set<string>();
    const data = prices
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

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300" },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
