import https from "node:https";

const CRYPTO_IDS = [
  "bitcoin", "ethereum", "solana", "binancecoin", "ripple",
  "cardano", "avalanche-2", "dogecoin", "polkadot", "chainlink",
  "litecoin", "matic-network", "uniswap", "cosmos",
];

const STOCK_TICKERS = ["NVDA", "NFLX", "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "AMD", "DIS", "KO", "JPM"];

// Yahoo Finance futures: gold, silver, platinum, palladium (price in USD per troy oz)
const METAL_FUTURES: Record<string, string> = { "GC=F": "gold", "SI=F": "silver", "PL=F": "platinum", "PA=F": "palladium" };
const TROY_OZ_TO_GRAMS = 31.1035;

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

async function fetchCryptoPrices(): Promise<Record<string, { price: number; change24h: number }>> {
  const ids = CRYPTO_IDS.join(",");
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const data = await res.json() as Record<string, Record<string, number>>;
  return Object.fromEntries(
    Object.entries(data).map(([id, v]) => [id, { price: v.usd, change24h: v.usd_24h_change ?? 0 }])
  );
}

async function fetchNasdaqQuote(ticker: string): Promise<{ price: number; change1d: number }> {
  const raw = await fetch(
    `https://api.nasdaq.com/api/quote/${encodeURIComponent(ticker)}/info?assetclass=stocks`,
    { headers: { "User-Agent": UA, Accept: "application/json" } },
  );
  if (!raw.ok) throw new Error(`Nasdaq ${ticker} ${raw.status}`);
  const json = await raw.json() as Record<string, Record<string, Record<string, string>>>;
  const primary = json?.data?.primaryData;
  if (!primary) throw new Error(`Nasdaq ${ticker} no data`);
  const price = parseFloat(primary.lastSalePrice?.replace(/[^0-9.]/g, "") ?? "0");
  const pct = parseFloat(primary.percentageChange?.replace(/[^0-9.\-]/g, "") ?? "0");
  const change1d = primary.deltaIndicator === "down" ? -Math.abs(pct) : Math.abs(pct);
  return { price, change1d };
}

async function fetchYahooMetal(symbol: string): Promise<number | null> {
  try {
    const encoded = encodeURIComponent(symbol);
    const raw = await nodeGet(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=5d`,
      { Accept: "application/json", Referer: "https://finance.yahoo.com/" },
    );
    const json = JSON.parse(raw) as Record<string, Record<string, Array<Record<string, unknown>>>>;
    const meta = json?.chart?.result?.[0]?.meta as Record<string, unknown>;
    const price = meta?.regularMarketPrice as number;
    return price ?? null;
  } catch {
    return null;
  }
}

async function fetchStocks(): Promise<Record<string, { price: number; change1d: number }>> {
  const settled = await Promise.allSettled(
    STOCK_TICKERS.map((t) => fetchNasdaqQuote(t).then((v) => [t, v] as const))
  );
  return Object.fromEntries(
    settled.filter((r): r is PromiseFulfilledResult<readonly [string, { price: number; change1d: number }]> => r.status === "fulfilled")
      .map((r) => r.value)
  );
}

async function fetchMetals(): Promise<Record<string, number>> {
  const settled = await Promise.allSettled(
    Object.entries(METAL_FUTURES).map(async ([sym, name]) => {
      const pricePerOz = await fetchYahooMetal(sym);
      if (!pricePerOz) return null;
      return [name, pricePerOz / TROY_OZ_TO_GRAMS] as const;
    })
  );
  return Object.fromEntries(
    settled
      .filter((r): r is PromiseFulfilledResult<readonly [string, number]> => r.status === "fulfilled" && r.value !== null)
      .map((r) => r.value!)
  );
}

// Short-lived in-memory cache, shared across requests handled by the same
// serverless instance. Many clients polling every 60s would otherwise each
// trigger fresh upstream calls and quickly exhaust CoinGecko's free-tier rate
// limit. A 30s TTL keeps prices fresh while collapsing bursts into one fetch.
type PricesPayload = {
  crypto: Record<string, { price: number; change24h: number }>;
  stocks: Record<string, { price: number; change1d: number }>;
  metals: Record<string, number>;
  timestamp: number;
};
const CACHE_TTL = 30_000;
let cached: { payload: PricesPayload; exp: number } | null = null;
let inflight: Promise<PricesPayload> | null = null;

async function buildPayload(): Promise<PricesPayload> {
  const [cryptoRes, stocksRes, metalsRes] = await Promise.allSettled([
    fetchCryptoPrices(),
    fetchStocks(),
    fetchMetals(),
  ]);

  return {
    crypto: cryptoRes.status === "fulfilled" ? cryptoRes.value : {},
    stocks: stocksRes.status === "fulfilled" ? stocksRes.value : {},
    metals: metalsRes.status === "fulfilled" ? metalsRes.value : {},
    timestamp: Date.now(),
  };
}

export async function GET() {
  if (cached && Date.now() < cached.exp) {
    return Response.json(cached.payload);
  }
  // Collapse concurrent requests into a single upstream fetch.
  if (!inflight) {
    inflight = buildPayload()
      .then((payload) => {
        cached = { payload, exp: Date.now() + CACHE_TTL };
        return payload;
      })
      .finally(() => { inflight = null; });
  }
  const payload = await inflight;
  return Response.json(payload, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" },
  });
}
