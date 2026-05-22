import https from "node:https";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

function nodeGet(url: string, headers: Record<string, string> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": UA, ...headers } }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
    req.on("error", reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error("timeout")); });
  });
}

async function searchCrypto(q: string) {
  try {
    const searchRes = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json() as {
      coins: Array<{ id: string; name: string; symbol: string; market_cap_rank: number | null }>;
    };
    const topCoins = (searchData.coins ?? []).slice(0, 6);
    if (topCoins.length === 0) return [];

    const ids = topCoins.map(c => c.id).join(",");
    const priceRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { headers: { Accept: "application/json" } }
    );
    const priceData = priceRes.ok
      ? await priceRes.json() as Record<string, { usd: number; usd_24h_change: number }>
      : {};

    return topCoins.map(c => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      category: "crypto" as const,
      coingeckoId: c.id,
      price: priceData[c.id]?.usd ?? null,
      change1d: priceData[c.id]?.usd_24h_change ?? null,
    }));
  } catch {
    return [];
  }
}

async function searchStocks(q: string) {
  try {
    const searchRaw = await nodeGet(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`,
      { Accept: "application/json", Referer: "https://finance.yahoo.com/" }
    );
    const searchData = JSON.parse(searchRaw) as {
      quotes?: Array<{ symbol: string; shortname?: string; longname?: string; quoteType?: string }>;
    };
    const equities = (searchData.quotes ?? [])
      .filter(item => item.quoteType === "EQUITY")
      .slice(0, 6);
    if (equities.length === 0) return [];

    // Yahoo's v7/finance/quote endpoint now requires a crumb+cookie and returns 401
    // for anonymous requests. The v8/finance/chart endpoint still works without auth
    // and exposes the current price + previous close in its `meta` block, so we fetch
    // each symbol's chart in parallel and derive the quote from there.
    const priceMap: Record<string, { price: number; change1d: number }> = {};
    const quoteResults = await Promise.allSettled(
      equities.map(async (e) => {
        const raw = await nodeGet(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(e.symbol)}?interval=1d&range=2d`,
          { Accept: "application/json", Referer: "https://finance.yahoo.com/" }
        );
        const meta = (JSON.parse(raw) as {
          chart?: { result?: Array<{ meta?: { regularMarketPrice?: number; chartPreviousClose?: number; previousClose?: number } }> };
        })?.chart?.result?.[0]?.meta;
        const price = meta?.regularMarketPrice;
        if (typeof price !== "number") return null;
        const prevClose = meta?.chartPreviousClose ?? meta?.previousClose;
        const change1d = typeof prevClose === "number" && prevClose > 0
          ? ((price - prevClose) / prevClose) * 100
          : 0;
        return [e.symbol, { price, change1d }] as const;
      })
    );
    for (const r of quoteResults) {
      if (r.status === "fulfilled" && r.value) priceMap[r.value[0]] = r.value[1];
    }

    return equities.map(e => ({
      id: `stock-${e.symbol}`,
      name: e.longname ?? e.shortname ?? e.symbol,
      symbol: e.symbol,
      category: "stock" as const,
      ticker: e.symbol,
      price: priceMap[e.symbol]?.price ?? null,
      change1d: priceMap[e.symbol]?.change1d ?? null,
    }));
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (!q) return Response.json({ crypto: [], stocks: [] });

  const [cryptoRes, stocksRes] = await Promise.allSettled([
    searchCrypto(q),
    searchStocks(q),
  ]);

  return Response.json({
    crypto: cryptoRes.status === "fulfilled" ? cryptoRes.value : [],
    stocks: stocksRes.status === "fulfilled" ? stocksRes.value : [],
  });
}
