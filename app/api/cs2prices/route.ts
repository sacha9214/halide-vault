import * as https from "node:https";

const CACHE = new Map<string, { price: number; exp: number }>();
const TTL = 5 * 60 * 1000;

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
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

async function fetchSteamPrice(hashName: string): Promise<number | null> {
  const cached = CACHE.get(hashName);
  if (cached && Date.now() < cached.exp) return cached.price;

  const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encodeURIComponent(hashName)}`;

  try {
    const body = await httpsGet(url);
    const json = JSON.parse(body);
    if (!json.success) return null;

    const priceStr: string = json.lowest_price || json.median_price;
    if (!priceStr) return null;

    const price = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    if (isNaN(price) || price <= 0) return null;

    CACHE.set(hashName, { price, exp: Date.now() + TTL });
    return price;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const names = searchParams.getAll("name");

  if (names.length === 0) return Response.json({});

  const results: Record<string, number | null> = {};

  for (let i = 0; i < names.length; i++) {
    results[names[i]] = await fetchSteamPrice(names[i]);
    if (i < names.length - 1) {
      await new Promise((r) => setTimeout(r, 350));
    }
  }

  return Response.json(results);
}
