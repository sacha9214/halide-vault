export interface StockAsset {
  id: string; name: string; ticker: string; shares: number; price: number;
  change1d: number; sparkline: number[]; color: string; sector: string;
}
export interface CryptoAsset {
  id: string; name: string; ticker: string; amount: number; price: number;
  change24h: number; sparkline: number[]; color: string; coingeckoId: string;
}
export interface CS2Skin {
  id: string; weaponName: string; skinName: string;
  wear: "FN" | "MW" | "FT" | "WW" | "BS"; float: number;
  rarity: "Consumer" | "Industrial" | "Mil-Spec" | "Restricted" | "Classified" | "Covert" | "Knife";
  price: number;
}
export interface CS2Case { id: string; name: string; quantity: number; price: number; }
export interface GoldItem {
  id: string; type: "bar" | "coin"; metal: "gold" | "silver" | "platinum" | "palladium";
  name: string; weightGrams: number; purity: number; quantity: number;
}
export interface PokemonCard {
  id: string; name: string; set: string; condition: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Holo" | "EX" | "GX" | "VMAX"; value: number;
}
export interface PokemonFigure { id: string; name: string; size: string; condition: string; value: number; }

// ── Empty portfolio arrays ────────────────────────────────────────────────────
export const cryptoAssets: CryptoAsset[] = [];
export const cs2Skins: CS2Skin[] = [];
export const cs2Cases: CS2Case[] = [];
export const goldItems: GoldItem[] = [];
export const pokemonCards: PokemonCard[] = [];
export const pokemonFigures: PokemonFigure[] = [];
export const stockAssets: StockAsset[] = [];

// ── Helpers (inline sparkline shorthand) ─────────────────────────────────────
const sp = (p: number, d: number): number[] => {
  const f = d >= 0 ? [0.91,0.93,0.95,0.97,0.98,0.99,1] : [1.09,1.07,1.05,1.03,1.02,1.01,1];
  return f.map(x => parseFloat((p * x).toPrecision(4)));
};

// ── Crypto Catalog (100 assets) ───────────────────────────────────────────────
export const cryptoCatalog: CryptoAsset[] = [
  // ── Top 10 ──
  { id:"btc", name:"Bitcoin", ticker:"BTC", amount:0, price:76400, change24h:0.23, sparkline:sp(76400,0.23), color:"#f7931a", coingeckoId:"bitcoin" },
  { id:"eth", name:"Ethereum", ticker:"ETH", amount:0, price:2107, change24h:0.05, sparkline:sp(2107,0.05), color:"#627eea", coingeckoId:"ethereum" },
  { id:"usdt", name:"Tether", ticker:"USDT", amount:0, price:1.00, change24h:0.01, sparkline:[1,1,1,1,1,1,1], color:"#26a17b", coingeckoId:"tether" },
  { id:"bnb", name:"BNB", ticker:"BNB", amount:0, price:638, change24h:0.14, sparkline:sp(638,0.14), color:"#f0b90b", coingeckoId:"binancecoin" },
  { id:"sol", name:"Solana", ticker:"SOL", amount:0, price:84.2, change24h:-0.17, sparkline:sp(84.2,-0.17), color:"#9945ff", coingeckoId:"solana" },
  { id:"xrp", name:"XRP", ticker:"XRP", amount:0, price:1.36, change24h:-1.05, sparkline:sp(1.36,-1.05), color:"#346aa9", coingeckoId:"ripple" },
  { id:"usdc", name:"USD Coin", ticker:"USDC", amount:0, price:1.00, change24h:0.00, sparkline:[1,1,1,1,1,1,1], color:"#2775ca", coingeckoId:"usd-coin" },
  { id:"ada", name:"Cardano", ticker:"ADA", amount:0, price:0.248, change24h:0.04, sparkline:sp(0.248,0.04), color:"#0d6efd", coingeckoId:"cardano" },
  { id:"doge", name:"Dogecoin", ticker:"DOGE", amount:0, price:0.103, change24h:-0.37, sparkline:sp(0.103,-0.37), color:"#c2a633", coingeckoId:"dogecoin" },
  { id:"trx", name:"TRON", ticker:"TRX", amount:0, price:0.248, change24h:0.50, sparkline:sp(0.248,0.50), color:"#ef0027", coingeckoId:"tron" },
  // ── 11–20 ──
  { id:"ton", name:"Toncoin", ticker:"TON", amount:0, price:3.15, change24h:0.80, sparkline:sp(3.15,0.80), color:"#0088cc", coingeckoId:"the-open-network" },
  { id:"link", name:"Chainlink", ticker:"LINK", amount:0, price:9.48, change24h:0.65, sparkline:sp(9.48,0.65), color:"#2a5ada", coingeckoId:"chainlink" },
  { id:"avax", name:"Avalanche", ticker:"AVAX", amount:0, price:9.09, change24h:0.10, sparkline:sp(9.09,0.10), color:"#e84142", coingeckoId:"avalanche-2" },
  { id:"shib", name:"Shiba Inu", ticker:"SHIB", amount:0, price:0.00000880, change24h:-0.50, sparkline:sp(0.0000088,-0.50), color:"#ff6b00", coingeckoId:"shiba-inu" },
  { id:"xlm", name:"Stellar", ticker:"XLM", amount:0, price:0.245, change24h:0.30, sparkline:sp(0.245,0.30), color:"#14b6e7", coingeckoId:"stellar" },
  { id:"dot", name:"Polkadot", ticker:"DOT", amount:0, price:1.23, change24h:0.00, sparkline:sp(1.23,0.00), color:"#e6007a", coingeckoId:"polkadot" },
  { id:"hbar", name:"Hedera", ticker:"HBAR", amount:0, price:0.148, change24h:0.60, sparkline:sp(0.148,0.60), color:"#3a3a3a", coingeckoId:"hedera-hashgraph" },
  { id:"uni", name:"Uniswap", ticker:"UNI", amount:0, price:3.45, change24h:1.98, sparkline:sp(3.45,1.98), color:"#ff007a", coingeckoId:"uniswap" },
  { id:"ltc", name:"Litecoin", ticker:"LTC", amount:0, price:53.8, change24h:0.59, sparkline:sp(53.8,0.59), color:"#bfbbbb", coingeckoId:"litecoin" },
  { id:"near", name:"NEAR Protocol", ticker:"NEAR", amount:0, price:2.05, change24h:0.80, sparkline:sp(2.05,0.80), color:"#00c1de", coingeckoId:"near" },
  // ── 21–30 ──
  { id:"atom", name:"Cosmos", ticker:"ATOM", amount:0, price:2.04, change24h:0.98, sparkline:sp(2.04,0.98), color:"#6f4e7c", coingeckoId:"cosmos" },
  { id:"apt", name:"Aptos", ticker:"APT", amount:0, price:4.32, change24h:1.20, sparkline:sp(4.32,1.20), color:"#00b4d8", coingeckoId:"aptos" },
  { id:"icp", name:"Internet Computer", ticker:"ICP", amount:0, price:5.12, change24h:0.40, sparkline:sp(5.12,0.40), color:"#29abe2", coingeckoId:"internet-computer" },
  { id:"op", name:"Optimism", ticker:"OP", amount:0, price:0.58, change24h:1.10, sparkline:sp(0.58,1.10), color:"#ff0420", coingeckoId:"optimism" },
  { id:"arb", name:"Arbitrum", ticker:"ARB", amount:0, price:0.31, change24h:0.90, sparkline:sp(0.31,0.90), color:"#12aaff", coingeckoId:"arbitrum" },
  { id:"matic", name:"Polygon", ticker:"MATIC", amount:0, price:0.245, change24h:0.00, sparkline:sp(0.245,0.00), color:"#8247e5", coingeckoId:"matic-network" },
  { id:"fil", name:"Filecoin", ticker:"FIL", amount:0, price:2.18, change24h:0.50, sparkline:sp(2.18,0.50), color:"#42c1ca", coingeckoId:"filecoin" },
  { id:"sui", name:"Sui", ticker:"SUI", amount:0, price:1.85, change24h:1.40, sparkline:sp(1.85,1.40), color:"#4ca3ff", coingeckoId:"sui" },
  { id:"inj", name:"Injective", ticker:"INJ", amount:0, price:7.42, change24h:1.80, sparkline:sp(7.42,1.80), color:"#00a3ff", coingeckoId:"injective-protocol" },
  { id:"xmr", name:"Monero", ticker:"XMR", amount:0, price:288, change24h:0.30, sparkline:sp(288,0.30), color:"#ff6600", coingeckoId:"monero" },
  // ── 31–40 ──
  { id:"aave", name:"Aave", ticker:"AAVE", amount:0, price:95, change24h:0.70, sparkline:sp(95,0.70), color:"#b6509e", coingeckoId:"aave" },
  { id:"mkr", name:"Maker", ticker:"MKR", amount:0, price:1250, change24h:0.50, sparkline:sp(1250,0.50), color:"#1aab9b", coingeckoId:"maker" },
  { id:"algo", name:"Algorand", ticker:"ALGO", amount:0, price:0.118, change24h:0.40, sparkline:sp(0.118,0.40), color:"#454545", coingeckoId:"algorand" },
  { id:"vet", name:"VeChain", ticker:"VET", amount:0, price:0.0185, change24h:0.60, sparkline:sp(0.0185,0.60), color:"#15bdff", coingeckoId:"vechain" },
  { id:"grt", name:"The Graph", ticker:"GRT", amount:0, price:0.082, change24h:0.50, sparkline:sp(0.082,0.50), color:"#6747ed", coingeckoId:"the-graph" },
  { id:"sand", name:"The Sandbox", ticker:"SAND", amount:0, price:0.188, change24h:-0.30, sparkline:sp(0.188,-0.30), color:"#00adef", coingeckoId:"the-sandbox" },
  { id:"mana", name:"Decentraland", ticker:"MANA", amount:0, price:0.232, change24h:-0.20, sparkline:sp(0.232,-0.20), color:"#ff2d55", coingeckoId:"decentraland" },
  { id:"axs", name:"Axie Infinity", ticker:"AXS", amount:0, price:2.88, change24h:0.80, sparkline:sp(2.88,0.80), color:"#0055d5", coingeckoId:"axie-infinity" },
  { id:"theta", name:"Theta Network", ticker:"THETA", amount:0, price:0.72, change24h:0.40, sparkline:sp(0.72,0.40), color:"#2ab8e6", coingeckoId:"theta-token" },
  { id:"eos", name:"EOS", ticker:"EOS", amount:0, price:0.51, change24h:0.20, sparkline:sp(0.51,0.20), color:"#636363", coingeckoId:"eos" },
  // ── 41–50 ──
  { id:"bch", name:"Bitcoin Cash", ticker:"BCH", amount:0, price:268, change24h:0.60, sparkline:sp(268,0.60), color:"#8dc351", coingeckoId:"bitcoin-cash" },
  { id:"stx", name:"Stacks", ticker:"STX", amount:0, price:0.62, change24h:0.90, sparkline:sp(0.62,0.90), color:"#5546ff", coingeckoId:"stacks" },
  { id:"crv", name:"Curve DAO", ticker:"CRV", amount:0, price:0.315, change24h:0.50, sparkline:sp(0.315,0.50), color:"#d9002c", coingeckoId:"curve-dao-token" },
  { id:"hnt", name:"Helium", ticker:"HNT", amount:0, price:3.28, change24h:0.70, sparkline:sp(3.28,0.70), color:"#474dff", coingeckoId:"helium" },
  { id:"rune", name:"THORChain", ticker:"RUNE", amount:0, price:1.28, change24h:1.10, sparkline:sp(1.28,1.10), color:"#33ff99", coingeckoId:"thorchain" },
  { id:"enj", name:"Enjin Coin", ticker:"ENJ", amount:0, price:0.048, change24h:0.30, sparkline:sp(0.048,0.30), color:"#624dbf", coingeckoId:"enjincoin" },
  { id:"ocean", name:"Ocean Protocol", ticker:"OCEAN", amount:0, price:0.275, change24h:0.80, sparkline:sp(0.275,0.80), color:"#141414", coingeckoId:"ocean-protocol" },
  { id:"chz", name:"Chiliz", ticker:"CHZ", amount:0, price:0.042, change24h:0.40, sparkline:sp(0.042,0.40), color:"#cd0124", coingeckoId:"chiliz" },
  { id:"lrc", name:"Loopring", ticker:"LRC", amount:0, price:0.088, change24h:0.60, sparkline:sp(0.088,0.60), color:"#1c42ff", coingeckoId:"loopring" },
  { id:"comp", name:"Compound", ticker:"COMP", amount:0, price:38.5, change24h:0.70, sparkline:sp(38.5,0.70), color:"#00d395", coingeckoId:"compound-governance-token" },
  // ── 51–60 ──
  { id:"snx", name:"Synthetix", ticker:"SNX", amount:0, price:0.58, change24h:0.50, sparkline:sp(0.58,0.50), color:"#00d1ff", coingeckoId:"havven" },
  { id:"yfi", name:"yearn.finance", ticker:"YFI", amount:0, price:3850, change24h:0.80, sparkline:sp(3850,0.80), color:"#006ae3", coingeckoId:"yearn-finance" },
  { id:"sushi", name:"SushiSwap", ticker:"SUSHI", amount:0, price:0.52, change24h:1.10, sparkline:sp(0.52,1.10), color:"#fa52a0", coingeckoId:"sushi" },
  { id:"inch", name:"1inch", ticker:"1INCH", amount:0, price:0.178, change24h:0.90, sparkline:sp(0.178,0.90), color:"#2d5ef6", coingeckoId:"1inch" },
  { id:"bal", name:"Balancer", ticker:"BAL", amount:0, price:1.18, change24h:0.60, sparkline:sp(1.18,0.60), color:"#1e1e1e", coingeckoId:"balancer" },
  { id:"dydx", name:"dYdX", ticker:"DYDX", amount:0, price:0.485, change24h:1.20, sparkline:sp(0.485,1.20), color:"#6966ff", coingeckoId:"dydx" },
  { id:"gmx", name:"GMX", ticker:"GMX", amount:0, price:14.8, change24h:0.90, sparkline:sp(14.8,0.90), color:"#03d1cf", coingeckoId:"gmx" },
  { id:"kava", name:"Kava", ticker:"KAVA", amount:0, price:0.298, change24h:0.50, sparkline:sp(0.298,0.50), color:"#ff433e", coingeckoId:"kava" },
  { id:"ksm", name:"Kusama", ticker:"KSM", amount:0, price:14.8, change24h:0.40, sparkline:sp(14.8,0.40), color:"#e8026d", coingeckoId:"kusama" },
  { id:"flow", name:"Flow", ticker:"FLOW", amount:0, price:0.38, change24h:0.70, sparkline:sp(0.38,0.70), color:"#00ef8b", coingeckoId:"flow" },
  // ── 61–70 ──
  { id:"rose", name:"Oasis Network", ticker:"ROSE", amount:0, price:0.035, change24h:0.50, sparkline:sp(0.035,0.50), color:"#0192f6", coingeckoId:"oasis-network" },
  { id:"bat", name:"Basic Attention Token", ticker:"BAT", amount:0, price:0.128, change24h:0.40, sparkline:sp(0.128,0.40), color:"#ff5000", coingeckoId:"basic-attention-token" },
  { id:"xtz", name:"Tezos", ticker:"XTZ", amount:0, price:0.485, change24h:0.30, sparkline:sp(0.485,0.30), color:"#2c7df7", coingeckoId:"tezos" },
  { id:"qtum", name:"Qtum", ticker:"QTUM", amount:0, price:1.82, change24h:0.60, sparkline:sp(1.82,0.60), color:"#2895d8", coingeckoId:"qtum" },
  { id:"zec", name:"Zcash", ticker:"ZEC", amount:0, price:22.5, change24h:0.40, sparkline:sp(22.5,0.40), color:"#f4b728", coingeckoId:"zcash" },
  { id:"neo", name:"NEO", ticker:"NEO", amount:0, price:5.62, change24h:0.50, sparkline:sp(5.62,0.50), color:"#58bf00", coingeckoId:"neo" },
  { id:"pendle", name:"Pendle", ticker:"PENDLE", amount:0, price:2.18, change24h:1.50, sparkline:sp(2.18,1.50), color:"#44f4d4", coingeckoId:"pendle" },
  { id:"sei", name:"Sei", ticker:"SEI", amount:0, price:0.158, change24h:0.80, sparkline:sp(0.158,0.80), color:"#9d3bff", coingeckoId:"sei-network" },
  { id:"tia", name:"Celestia", ticker:"TIA", amount:0, price:2.48, change24h:1.20, sparkline:sp(2.48,1.20), color:"#7b2bf9", coingeckoId:"celestia" },
  { id:"wif", name:"dogwifhat", ticker:"WIF", amount:0, price:0.415, change24h:2.10, sparkline:sp(0.415,2.10), color:"#c77dff", coingeckoId:"dogwifcoin" },
  // ── 71–80 ──
  { id:"pepe", name:"Pepe", ticker:"PEPE", amount:0, price:0.0000065, change24h:-0.80, sparkline:sp(0.0000065,-0.80), color:"#00b300", coingeckoId:"pepe" },
  { id:"bonk", name:"Bonk", ticker:"BONK", amount:0, price:0.0000098, change24h:1.30, sparkline:sp(0.0000098,1.30), color:"#ff9900", coingeckoId:"bonk" },
  { id:"floki", name:"Floki", ticker:"FLOKI", amount:0, price:0.0000385, change24h:0.90, sparkline:sp(0.0000385,0.90), color:"#ff8c00", coingeckoId:"floki" },
  { id:"gala", name:"Gala", ticker:"GALA", amount:0, price:0.0128, change24h:0.70, sparkline:sp(0.0128,0.70), color:"#00d4ff", coingeckoId:"gala" },
  { id:"imx", name:"Immutable", ticker:"IMX", amount:0, price:0.425, change24h:1.00, sparkline:sp(0.425,1.00), color:"#17b2e7", coingeckoId:"immutable-x" },
  { id:"pyth", name:"Pyth Network", ticker:"PYTH", amount:0, price:0.085, change24h:0.80, sparkline:sp(0.085,0.80), color:"#e6dafe", coingeckoId:"pyth-network" },
  { id:"egld", name:"MultiversX", ticker:"EGLD", amount:0, price:15.8, change24h:0.60, sparkline:sp(15.8,0.60), color:"#23f7dd", coingeckoId:"elrond-erd-2" },
  { id:"ldo", name:"Lido DAO", ticker:"LDO", amount:0, price:0.585, change24h:0.90, sparkline:sp(0.585,0.90), color:"#00a3ff", coingeckoId:"lido-dao" },
  { id:"osmo", name:"Osmosis", ticker:"OSMO", amount:0, price:0.285, change24h:0.70, sparkline:sp(0.285,0.70), color:"#5c087d", coingeckoId:"osmosis" },
  { id:"mina", name:"Mina", ticker:"MINA", amount:0, price:0.298, change24h:0.50, sparkline:sp(0.298,0.50), color:"#fd4d97", coingeckoId:"mina-protocol" },
  // ── 81–90 ──
  { id:"blur", name:"Blur", ticker:"BLUR", amount:0, price:0.088, change24h:1.20, sparkline:sp(0.088,1.20), color:"#ff6900", coingeckoId:"blur" },
  { id:"dash", name:"Dash", ticker:"DASH", amount:0, price:18.2, change24h:0.30, sparkline:sp(18.2,0.30), color:"#008ce7", coingeckoId:"dash" },
  { id:"iota", name:"IOTA", ticker:"IOTA", amount:0, price:0.148, change24h:0.40, sparkline:sp(0.148,0.40), color:"#242424", coingeckoId:"iota" },
  { id:"waves", name:"Waves", ticker:"WAVES", amount:0, price:0.785, change24h:0.50, sparkline:sp(0.785,0.50), color:"#0155ff", coingeckoId:"waves" },
  { id:"zil", name:"Zilliqa", ticker:"ZIL", amount:0, price:0.0082, change24h:0.40, sparkline:sp(0.0082,0.40), color:"#29ccc4", coingeckoId:"zilliqa" },
  { id:"rvn", name:"Ravencoin", ticker:"RVN", amount:0, price:0.0105, change24h:0.30, sparkline:sp(0.0105,0.30), color:"#384182", coingeckoId:"ravencoin" },
  { id:"jup", name:"Jupiter", ticker:"JUP", amount:0, price:0.315, change24h:1.40, sparkline:sp(0.315,1.40), color:"#3cc8c8", coingeckoId:"jupiter-exchange-solana" },
  { id:"jto", name:"Jito", ticker:"JTO", amount:0, price:1.52, change24h:0.80, sparkline:sp(1.52,0.80), color:"#3ec8c8", coingeckoId:"jito-governance-token" },
  { id:"axl", name:"Axelar", ticker:"AXL", amount:0, price:0.285, change24h:0.70, sparkline:sp(0.285,0.70), color:"#009cff", coingeckoId:"axelar" },
  { id:"wbtc", name:"Wrapped Bitcoin", ticker:"WBTC", amount:0, price:76400, change24h:0.22, sparkline:sp(76400,0.22), color:"#f7931a", coingeckoId:"wrapped-bitcoin" },
  // ── 91–100 ──
  { id:"dai", name:"Dai", ticker:"DAI", amount:0, price:1.00, change24h:0.00, sparkline:[1,1,1,1,1,1,1], color:"#f5ac37", coingeckoId:"dai" },
  { id:"fxs", name:"Frax Share", ticker:"FXS", amount:0, price:1.28, change24h:0.60, sparkline:sp(1.28,0.60), color:"#2e1f64", coingeckoId:"frax-share" },
  { id:"cvx", name:"Convex Finance", ticker:"CVX", amount:0, price:1.88, change24h:0.70, sparkline:sp(1.88,0.70), color:"#3a3a5c", coingeckoId:"convex-finance" },
  { id:"rndr", name:"Render", ticker:"RNDR", amount:0, price:2.85, change24h:1.10, sparkline:sp(2.85,1.10), color:"#c23b22", coingeckoId:"render-token" },
  { id:"tao", name:"Bittensor", ticker:"TAO", amount:0, price:285, change24h:1.50, sparkline:sp(285,1.50), color:"#9acd32", coingeckoId:"bittensor" },
  { id:"strk", name:"StarkNet", ticker:"STRK", amount:0, price:0.085, change24h:0.80, sparkline:sp(0.085,0.80), color:"#ec796b", coingeckoId:"starknet" },
  { id:"wld", name:"Worldcoin", ticker:"WLD", amount:0, price:0.98, change24h:0.90, sparkline:sp(0.98,0.90), color:"#000000", coingeckoId:"worldcoin-wld" },
  { id:"fet", name:"Fetch.ai", ticker:"FET", amount:0, price:0.62, change24h:1.20, sparkline:sp(0.62,1.20), color:"#5b85c2", coingeckoId:"fetch-ai" },
  { id:"akt", name:"Akash Network", ticker:"AKT", amount:0, price:1.45, change24h:0.80, sparkline:sp(1.45,0.80), color:"#ff414c", coingeckoId:"akash-network" },
  { id:"mantle", name:"Mantle", ticker:"MNT", amount:0, price:0.62, change24h:0.60, sparkline:sp(0.62,0.60), color:"#000000", coingeckoId:"mantle" },
];

// ── Stock Catalog (100 stocks) ────────────────────────────────────────────────
export const stockCatalog: StockAsset[] = [
  // ── Technology ──
  { id:"nvda", name:"Nvidia", ticker:"NVDA", shares:0, price:220.65, change1d:-0.78, sparkline:sp(220.65,-0.78), color:"#76b900", sector:"Semiconductors" },
  { id:"aapl", name:"Apple", ticker:"AAPL", shares:0, price:296.95, change1d:-0.30, sparkline:sp(296.95,-0.30), color:"#a2aaad", sector:"Technology" },
  { id:"msft", name:"Microsoft", ticker:"MSFT", shares:0, price:418.54, change1d:-1.18, sparkline:sp(418.54,-1.18), color:"#00a4ef", sector:"Technology" },
  { id:"googl", name:"Alphabet", ticker:"GOOGL", shares:0, price:386.51, change1d:-2.63, sparkline:sp(386.51,-2.63), color:"#4285f4", sector:"Technology" },
  { id:"meta", name:"Meta", ticker:"META", shares:0, price:602.73, change1d:-1.39, sparkline:sp(602.73,-1.39), color:"#0082fb", sector:"Technology" },
  { id:"amd", name:"AMD", ticker:"AMD", shares:0, price:409.44, change1d:-2.74, sparkline:sp(409.44,-2.74), color:"#ed1c24", sector:"Semiconductors" },
  { id:"amzn", name:"Amazon", ticker:"AMZN", shares:0, price:256.05, change1d:-3.33, sparkline:sp(256.05,-3.33), color:"#ff9900", sector:"E-Commerce" },
  { id:"tsla", name:"Tesla", ticker:"TSLA", shares:0, price:397.47, change1d:-3.05, sparkline:sp(397.47,-3.05), color:"#cc0000", sector:"Automotive" },
  { id:"avgo", name:"Broadcom", ticker:"AVGO", shares:0, price:215, change1d:0.40, sparkline:sp(215,0.40), color:"#cc0000", sector:"Semiconductors" },
  { id:"intc", name:"Intel", ticker:"INTC", shares:0, price:22.4, change1d:-1.20, sparkline:sp(22.4,-1.20), color:"#0068b5", sector:"Semiconductors" },
  { id:"qcom", name:"Qualcomm", ticker:"QCOM", shares:0, price:168, change1d:0.60, sparkline:sp(168,0.60), color:"#3253dc", sector:"Semiconductors" },
  { id:"mu", name:"Micron", ticker:"MU", shares:0, price:95, change1d:0.80, sparkline:sp(95,0.80), color:"#0067b1", sector:"Semiconductors" },
  { id:"amat", name:"Applied Materials", ticker:"AMAT", shares:0, price:188, change1d:0.50, sparkline:sp(188,0.50), color:"#28527a", sector:"Semiconductors" },
  { id:"arm", name:"Arm Holdings", ticker:"ARM", shares:0, price:145, change1d:1.20, sparkline:sp(145,1.20), color:"#0091bd", sector:"Semiconductors" },
  { id:"crm", name:"Salesforce", ticker:"CRM", shares:0, price:290, change1d:0.70, sparkline:sp(290,0.70), color:"#009edb", sector:"Technology" },
  { id:"orcl", name:"Oracle", ticker:"ORCL", shares:0, price:185, change1d:0.50, sparkline:sp(185,0.50), color:"#f80000", sector:"Technology" },
  { id:"adbe", name:"Adobe", ticker:"ADBE", shares:0, price:380, change1d:-0.40, sparkline:sp(380,-0.40), color:"#ff0000", sector:"Technology" },
  { id:"now", name:"ServiceNow", ticker:"NOW", shares:0, price:855, change1d:0.90, sparkline:sp(855,0.90), color:"#81b5a1", sector:"Technology" },
  { id:"snow", name:"Snowflake", ticker:"SNOW", shares:0, price:145, change1d:1.10, sparkline:sp(145,1.10), color:"#29b5e8", sector:"Technology" },
  { id:"pltr", name:"Palantir", ticker:"PLTR", shares:0, price:85, change1d:2.10, sparkline:sp(85,2.10), color:"#7b68ee", sector:"Technology" },
  { id:"net", name:"Cloudflare", ticker:"NET", shares:0, price:115, change1d:0.80, sparkline:sp(115,0.80), color:"#f48120", sector:"Technology" },
  { id:"ddog", name:"Datadog", ticker:"DDOG", shares:0, price:115, change1d:0.60, sparkline:sp(115,0.60), color:"#632ca6", sector:"Technology" },
  { id:"zs", name:"Zscaler", ticker:"ZS", shares:0, price:210, change1d:0.50, sparkline:sp(210,0.50), color:"#00bce4", sector:"Technology" },
  { id:"crwd", name:"CrowdStrike", ticker:"CRWD", shares:0, price:425, change1d:1.20, sparkline:sp(425,1.20), color:"#e01f27", sector:"Technology" },
  { id:"panw", name:"Palo Alto Networks", ticker:"PANW", shares:0, price:185, change1d:0.80, sparkline:sp(185,0.80), color:"#fa582d", sector:"Technology" },
  { id:"uber", name:"Uber", ticker:"UBER", shares:0, price:82, change1d:0.40, sparkline:sp(82,0.40), color:"#000000", sector:"Technology" },
  { id:"shop", name:"Shopify", ticker:"SHOP", shares:0, price:115, change1d:0.60, sparkline:sp(115,0.60), color:"#96bf48", sector:"E-Commerce" },
  { id:"se", name:"Sea Limited", ticker:"SE", shares:0, price:35, change1d:0.90, sparkline:sp(35,0.90), color:"#ff5722", sector:"E-Commerce" },
  { id:"meli", name:"MercadoLibre", ticker:"MELI", shares:0, price:2100, change1d:0.70, sparkline:sp(2100,0.70), color:"#ffe600", sector:"E-Commerce" },
  { id:"baba", name:"Alibaba", ticker:"BABA", shares:0, price:125, change1d:0.50, sparkline:sp(125,0.50), color:"#ff6000", sector:"E-Commerce" },
  // ── Finance ──
  { id:"jpm", name:"JPMorgan", ticker:"JPM", shares:0, price:297.68, change1d:-1.01, sparkline:sp(297.68,-1.01), color:"#005a8e", sector:"Finance" },
  { id:"v", name:"Visa", ticker:"V", shares:0, price:385, change1d:0.30, sparkline:sp(385,0.30), color:"#1a1f71", sector:"Finance" },
  { id:"ma", name:"Mastercard", ticker:"MA", shares:0, price:570, change1d:0.40, sparkline:sp(570,0.40), color:"#eb001b", sector:"Finance" },
  { id:"bac", name:"Bank of America", ticker:"BAC", shares:0, price:50, change1d:-0.80, sparkline:sp(50,-0.80), color:"#e31837", sector:"Finance" },
  { id:"gs", name:"Goldman Sachs", ticker:"GS", shares:0, price:680, change1d:-0.60, sparkline:sp(680,-0.60), color:"#0080aa", sector:"Finance" },
  { id:"ms", name:"Morgan Stanley", ticker:"MS", shares:0, price:128, change1d:-0.50, sparkline:sp(128,-0.50), color:"#002b5c", sector:"Finance" },
  { id:"wfc", name:"Wells Fargo", ticker:"WFC", shares:0, price:75, change1d:-0.70, sparkline:sp(75,-0.70), color:"#d71e28", sector:"Finance" },
  { id:"blk", name:"BlackRock", ticker:"BLK", shares:0, price:985, change1d:0.20, sparkline:sp(985,0.20), color:"#000000", sector:"Finance" },
  { id:"axp", name:"American Express", ticker:"AXP", shares:0, price:298, change1d:0.30, sparkline:sp(298,0.30), color:"#007bc1", sector:"Finance" },
  { id:"pypl", name:"PayPal", ticker:"PYPL", shares:0, price:65, change1d:-0.50, sparkline:sp(65,-0.50), color:"#003087", sector:"Finance" },
  { id:"coin", name:"Coinbase", ticker:"COIN", shares:0, price:210, change1d:1.80, sparkline:sp(210,1.80), color:"#0052ff", sector:"Finance" },
  { id:"schw", name:"Charles Schwab", ticker:"SCHW", shares:0, price:82, change1d:0.20, sparkline:sp(82,0.20), color:"#00a0df", sector:"Finance" },
  // ── Entertainment & Media ──
  { id:"nflx", name:"Netflix", ticker:"NFLX", shares:0, price:89.72, change1d:0.07, sparkline:sp(89.72,0.07), color:"#e50914", sector:"Entertainment" },
  { id:"dis", name:"Disney", ticker:"DIS", shares:0, price:102.42, change1d:-1.43, sparkline:sp(102.42,-1.43), color:"#006e99", sector:"Entertainment" },
  { id:"cmcsa", name:"Comcast", ticker:"CMCSA", shares:0, price:38, change1d:-0.50, sparkline:sp(38,-0.50), color:"#ce1126", sector:"Media" },
  { id:"spot", name:"Spotify", ticker:"SPOT", shares:0, price:388, change1d:0.60, sparkline:sp(388,0.60), color:"#1db954", sector:"Entertainment" },
  { id:"rblx", name:"Roblox", ticker:"RBLX", shares:0, price:45, change1d:0.80, sparkline:sp(45,0.80), color:"#e8423e", sector:"Entertainment" },
  { id:"ttwo", name:"Take-Two Interactive", ticker:"TTWO", shares:0, price:185, change1d:0.40, sparkline:sp(185,0.40), color:"#003087", sector:"Entertainment" },
  // ── Telecom ──
  { id:"t", name:"AT&T", ticker:"T", shares:0, price:22, change1d:0.10, sparkline:sp(22,0.10), color:"#00a8e0", sector:"Telecom" },
  { id:"vz", name:"Verizon", ticker:"VZ", shares:0, price:41, change1d:0.20, sparkline:sp(41,0.20), color:"#cd040b", sector:"Telecom" },
  // ── Consumer ──
  { id:"wmt", name:"Walmart", ticker:"WMT", shares:0, price:108, change1d:0.30, sparkline:sp(108,0.30), color:"#007dc6", sector:"Consumer" },
  { id:"cost", name:"Costco", ticker:"COST", shares:0, price:985, change1d:0.50, sparkline:sp(985,0.50), color:"#e31837", sector:"Consumer" },
  { id:"hd", name:"Home Depot", ticker:"HD", shares:0, price:392, change1d:0.40, sparkline:sp(392,0.40), color:"#f96302", sector:"Consumer" },
  { id:"mcd", name:"McDonald's", ticker:"MCD", shares:0, price:310, change1d:0.20, sparkline:sp(310,0.20), color:"#ffc72c", sector:"Consumer" },
  { id:"sbux", name:"Starbucks", ticker:"SBUX", shares:0, price:88, change1d:-0.30, sparkline:sp(88,-0.30), color:"#00704a", sector:"Consumer" },
  { id:"nke", name:"Nike", ticker:"NKE", shares:0, price:58, change1d:-0.60, sparkline:sp(58,-0.60), color:"#ff6600", sector:"Consumer" },
  { id:"ko", name:"Coca-Cola", ticker:"KO", shares:0, price:82.11, change1d:1.12, sparkline:sp(82.11,1.12), color:"#f40009", sector:"Consumer" },
  { id:"pep", name:"PepsiCo", ticker:"PEP", shares:0, price:148, change1d:0.20, sparkline:sp(148,0.20), color:"#004b93", sector:"Consumer" },
  { id:"cmg", name:"Chipotle", ticker:"CMG", shares:0, price:52, change1d:0.40, sparkline:sp(52,0.40), color:"#a81612", sector:"Consumer" },
  { id:"low", name:"Lowe's", ticker:"LOW", shares:0, price:248, change1d:0.30, sparkline:sp(248,0.30), color:"#004990", sector:"Consumer" },
  // ── Healthcare ──
  { id:"lly", name:"Eli Lilly", ticker:"LLY", shares:0, price:795, change1d:0.40, sparkline:sp(795,0.40), color:"#d51f26", sector:"Healthcare" },
  { id:"unh", name:"UnitedHealth", ticker:"UNH", shares:0, price:385, change1d:0.30, sparkline:sp(385,0.30), color:"#002677", sector:"Healthcare" },
  { id:"jnj", name:"Johnson & Johnson", ticker:"JNJ", shares:0, price:155, change1d:0.10, sparkline:sp(155,0.10), color:"#d50032", sector:"Healthcare" },
  { id:"abbv", name:"AbbVie", ticker:"ABBV", shares:0, price:198, change1d:0.20, sparkline:sp(198,0.20), color:"#071d49", sector:"Healthcare" },
  { id:"pfe", name:"Pfizer", ticker:"PFE", shares:0, price:27, change1d:-0.40, sparkline:sp(27,-0.40), color:"#0093c8", sector:"Healthcare" },
  { id:"mrk", name:"Merck", ticker:"MRK", shares:0, price:96, change1d:0.10, sparkline:sp(96,0.10), color:"#00857c", sector:"Healthcare" },
  { id:"amgn", name:"Amgen", ticker:"AMGN", shares:0, price:288, change1d:0.20, sparkline:sp(288,0.20), color:"#004986", sector:"Healthcare" },
  { id:"gild", name:"Gilead Sciences", ticker:"GILD", shares:0, price:115, change1d:0.30, sparkline:sp(115,0.30), color:"#e8291c", sector:"Healthcare" },
  { id:"regn", name:"Regeneron", ticker:"REGN", shares:0, price:815, change1d:0.40, sparkline:sp(815,0.40), color:"#00338d", sector:"Healthcare" },
  { id:"biib", name:"Biogen", ticker:"BIIB", shares:0, price:158, change1d:-0.20, sparkline:sp(158,-0.20), color:"#cc0000", sector:"Healthcare" },
  // ── Industrial / Aerospace ──
  { id:"cat", name:"Caterpillar", ticker:"CAT", shares:0, price:358, change1d:0.30, sparkline:sp(358,0.30), color:"#ffcd11", sector:"Industrial" },
  { id:"de", name:"John Deere", ticker:"DE", shares:0, price:488, change1d:0.20, sparkline:sp(488,0.20), color:"#367c2b", sector:"Industrial" },
  { id:"ge", name:"GE Aerospace", ticker:"GE", shares:0, price:186, change1d:0.50, sparkline:sp(186,0.50), color:"#003087", sector:"Industrial" },
  { id:"hon", name:"Honeywell", ticker:"HON", shares:0, price:222, change1d:0.20, sparkline:sp(222,0.20), color:"#f60004", sector:"Industrial" },
  { id:"ba", name:"Boeing", ticker:"BA", shares:0, price:178, change1d:-0.80, sparkline:sp(178,-0.80), color:"#1d428a", sector:"Aerospace" },
  { id:"rtx", name:"RTX Corporation", ticker:"RTX", shares:0, price:128, change1d:0.30, sparkline:sp(128,0.30), color:"#00205b", sector:"Aerospace" },
  { id:"lmt", name:"Lockheed Martin", ticker:"LMT", shares:0, price:482, change1d:0.20, sparkline:sp(482,0.20), color:"#0059b3", sector:"Aerospace" },
  // ── Energy ──
  { id:"xom", name:"ExxonMobil", ticker:"XOM", shares:0, price:112, change1d:0.40, sparkline:sp(112,0.40), color:"#dd0015", sector:"Energy" },
  { id:"cvx", name:"Chevron", ticker:"CVX", shares:0, price:158, change1d:0.30, sparkline:sp(158,0.30), color:"#0052a5", sector:"Energy" },
  { id:"cop", name:"ConocoPhillips", ticker:"COP", shares:0, price:102, change1d:0.50, sparkline:sp(102,0.50), color:"#e3000f", sector:"Energy" },
  // ── TSM ──
  { id:"tsm", name:"TSMC", ticker:"TSM", shares:0, price:185, change1d:1.10, sparkline:sp(185,1.10), color:"#0073bb", sector:"Semiconductors" },
  // ── More Technology ──
  { id:"intu", name:"Intuit", ticker:"INTU", shares:0, price:595, change1d:0.40, sparkline:sp(595,0.40), color:"#2091f9", sector:"Technology" },
  { id:"adsk", name:"Autodesk", ticker:"ADSK", shares:0, price:275, change1d:0.30, sparkline:sp(275,0.30), color:"#0696d7", sector:"Technology" },
  { id:"abnb", name:"Airbnb", ticker:"ABNB", shares:0, price:145, change1d:0.50, sparkline:sp(145,0.50), color:"#ff5a5f", sector:"Technology" },
  { id:"bkng", name:"Booking Holdings", ticker:"BKNG", shares:0, price:4850, change1d:0.60, sparkline:sp(4850,0.60), color:"#003580", sector:"Technology" },
  { id:"dash", name:"DoorDash", ticker:"DASH", shares:0, price:185, change1d:0.70, sparkline:sp(185,0.70), color:"#ff3008", sector:"Technology" },
  // ── More Finance ──
  { id:"spgi", name:"S&P Global", ticker:"SPGI", shares:0, price:485, change1d:0.30, sparkline:sp(485,0.30), color:"#d4202b", sector:"Finance" },
  { id:"cme", name:"CME Group", ticker:"CME", shares:0, price:225, change1d:0.20, sparkline:sp(225,0.20), color:"#002b5b", sector:"Finance" },
  { id:"ndaq", name:"Nasdaq Inc", ticker:"NDAQ", shares:0, price:82, change1d:0.40, sparkline:sp(82,0.40), color:"#0044cc", sector:"Finance" },
  { id:"c", name:"Citigroup", ticker:"C", shares:0, price:72, change1d:-0.30, sparkline:sp(72,-0.30), color:"#003b8e", sector:"Finance" },
  // ── More Healthcare ──
  { id:"tmo", name:"Thermo Fisher", ticker:"TMO", shares:0, price:495, change1d:0.20, sparkline:sp(495,0.20), color:"#006b54", sector:"Healthcare" },
  { id:"cvs", name:"CVS Health", ticker:"CVS", shares:0, price:60, change1d:-0.20, sparkline:sp(60,-0.20), color:"#cc0000", sector:"Healthcare" },
  { id:"mdt", name:"Medtronic", ticker:"MDT", shares:0, price:85, change1d:0.10, sparkline:sp(85,0.10), color:"#0057b8", sector:"Healthcare" },
  // ── More Industrial ──
  { id:"mmm", name:"3M", ticker:"MMM", shares:0, price:148, change1d:0.20, sparkline:sp(148,0.20), color:"#ff0000", sector:"Industrial" },
  { id:"emr", name:"Emerson Electric", ticker:"EMR", shares:0, price:122, change1d:0.30, sparkline:sp(122,0.30), color:"#002060", sector:"Industrial" },
  // ── More Energy ──
  { id:"slb", name:"SLB", ticker:"SLB", shares:0, price:42, change1d:0.40, sparkline:sp(42,0.40), color:"#00adef", sector:"Energy" },
  { id:"nee", name:"NextEra Energy", ticker:"NEE", shares:0, price:72, change1d:0.20, sparkline:sp(72,0.20), color:"#0072ce", sector:"Energy" },
  // ── More Consumer ──
  { id:"tgt", name:"Target", ticker:"TGT", shares:0, price:95, change1d:-0.40, sparkline:sp(95,-0.40), color:"#cc0000", sector:"Consumer" },
  { id:"lulu", name:"Lululemon", ticker:"LULU", shares:0, price:245, change1d:0.50, sparkline:sp(245,0.50), color:"#b3d4e0", sector:"Consumer" },
  // ── REITs ──
  { id:"amt", name:"American Tower", ticker:"AMT", shares:0, price:185, change1d:0.10, sparkline:sp(185,0.10), color:"#0066a1", sector:"Real Estate" },
];

// ── CS2 Skin Catalog (100 skins) ──────────────────────────────────────────────
export const cs2SkinsCatalog: CS2Skin[] = [
  // ── Knives (27) ──
  { id:"karambit-fade", weaponName:"Karambit", skinName:"Fade", wear:"FN", float:0.008, rarity:"Knife", price:2180 },
  { id:"karambit-doppler-p2", weaponName:"Karambit", skinName:"Doppler Phase 2", wear:"FN", float:0.012, rarity:"Knife", price:1250 },
  { id:"karambit-tiger-tooth", weaponName:"Karambit", skinName:"Tiger Tooth", wear:"FN", float:0.015, rarity:"Knife", price:980 },
  { id:"karambit-marble-fade", weaponName:"Karambit", skinName:"Marble Fade", wear:"FN", float:0.010, rarity:"Knife", price:1450 },
  { id:"karambit-crimson-web", weaponName:"Karambit", skinName:"Crimson Web", wear:"MW", float:0.085, rarity:"Knife", price:720 },
  { id:"butterfly-fade", weaponName:"Butterfly Knife", skinName:"Fade", wear:"FN", float:0.009, rarity:"Knife", price:2950 },
  { id:"butterfly-doppler-p4", weaponName:"Butterfly Knife", skinName:"Doppler Phase 4", wear:"FN", float:0.014, rarity:"Knife", price:2200 },
  { id:"butterfly-tiger-tooth", weaponName:"Butterfly Knife", skinName:"Tiger Tooth", wear:"FN", float:0.016, rarity:"Knife", price:1680 },
  { id:"butterfly-marble-fade", weaponName:"Butterfly Knife", skinName:"Marble Fade", wear:"FN", float:0.011, rarity:"Knife", price:2100 },
  { id:"m9-fade", weaponName:"M9 Bayonet", skinName:"Fade", wear:"FN", float:0.007, rarity:"Knife", price:980 },
  { id:"m9-doppler-p3", weaponName:"M9 Bayonet", skinName:"Doppler Phase 3", wear:"FN", float:0.013, rarity:"Knife", price:780 },
  { id:"m9-tiger-tooth", weaponName:"M9 Bayonet", skinName:"Tiger Tooth", wear:"FN", float:0.016, rarity:"Knife", price:620 },
  { id:"bayonet-fade", weaponName:"Bayonet", skinName:"Fade", wear:"FN", float:0.006, rarity:"Knife", price:640 },
  { id:"bayonet-doppler-p2", weaponName:"Bayonet", skinName:"Doppler Phase 2", wear:"FN", float:0.011, rarity:"Knife", price:520 },
  { id:"flip-fade", weaponName:"Flip Knife", skinName:"Fade", wear:"FN", float:0.009, rarity:"Knife", price:580 },
  { id:"flip-doppler-p1", weaponName:"Flip Knife", skinName:"Doppler Phase 1", wear:"FN", float:0.014, rarity:"Knife", price:430 },
  { id:"huntsman-fade", weaponName:"Huntsman Knife", skinName:"Fade", wear:"FN", float:0.010, rarity:"Knife", price:520 },
  { id:"huntsman-doppler-p2", weaponName:"Huntsman Knife", skinName:"Doppler Phase 2", wear:"FN", float:0.015, rarity:"Knife", price:420 },
  { id:"shadow-daggers-fade", weaponName:"Shadow Daggers", skinName:"Fade", wear:"FN", float:0.018, rarity:"Knife", price:135 },
  { id:"bowie-fade", weaponName:"Bowie Knife", skinName:"Fade", wear:"FN", float:0.009, rarity:"Knife", price:450 },
  { id:"falchion-fade", weaponName:"Falchion Knife", skinName:"Fade", wear:"FN", float:0.010, rarity:"Knife", price:320 },
  { id:"stiletto-fade", weaponName:"Stiletto Knife", skinName:"Fade", wear:"FN", float:0.012, rarity:"Knife", price:480 },
  { id:"talon-fade", weaponName:"Talon Knife", skinName:"Fade", wear:"FN", float:0.008, rarity:"Knife", price:620 },
  { id:"skeleton-crimson-web", weaponName:"Skeleton Knife", skinName:"Crimson Web", wear:"FN", float:0.022, rarity:"Knife", price:1200 },
  { id:"paracord-doppler-p2", weaponName:"Paracord Knife", skinName:"Doppler Phase 2", wear:"FN", float:0.015, rarity:"Knife", price:520 },
  { id:"ursus-doppler-p4", weaponName:"Ursus Knife", skinName:"Doppler Phase 4", wear:"FN", float:0.016, rarity:"Knife", price:580 },
  { id:"navaja-fade", weaponName:"Navaja Knife", skinName:"Fade", wear:"FN", float:0.011, rarity:"Knife", price:195 },
  // ── Gloves (3) ──
  { id:"gloves-pandoras-box", weaponName:"Sport Gloves", skinName:"Pandora's Box", wear:"FT", float:0.225, rarity:"Knife", price:3200 },
  { id:"gloves-vice", weaponName:"Sport Gloves", skinName:"Vice", wear:"FN", float:0.040, rarity:"Knife", price:2800 },
  { id:"gloves-bronzed", weaponName:"Moto Gloves", skinName:"Bronzed", wear:"FN", float:0.030, rarity:"Knife", price:650 },
  // ── AK-47 (10) ──
  { id:"ak47-fire-serpent", weaponName:"AK-47", skinName:"Fire Serpent", wear:"FT", float:0.180, rarity:"Covert", price:1380 },
  { id:"ak47-wild-lotus", weaponName:"AK-47", skinName:"Wild Lotus", wear:"FN", float:0.045, rarity:"Covert", price:820 },
  { id:"ak47-case-hardened", weaponName:"AK-47", skinName:"Case Hardened", wear:"FN", float:0.045, rarity:"Classified", price:680 },
  { id:"ak47-vulcan", weaponName:"AK-47", skinName:"Vulcan", wear:"FN", float:0.028, rarity:"Covert", price:380 },
  { id:"ak47-empress", weaponName:"AK-47", skinName:"The Empress", wear:"FN", float:0.035, rarity:"Covert", price:165 },
  { id:"ak47-neon-revolution", weaponName:"AK-47", skinName:"Neon Revolution", wear:"FN", float:0.040, rarity:"Covert", price:95 },
  { id:"ak47-bloodsport", weaponName:"AK-47", skinName:"Bloodsport", wear:"FN", float:0.032, rarity:"Covert", price:72 },
  { id:"ak47-asiimov", weaponName:"AK-47", skinName:"Asiimov", wear:"FT", float:0.195, rarity:"Covert", price:145 },
  { id:"ak47-fuel-injector", weaponName:"AK-47", skinName:"Fuel Injector", wear:"FN", float:0.025, rarity:"Covert", price:95 },
  { id:"ak47-redline", weaponName:"AK-47", skinName:"Redline", wear:"FT", float:0.234, rarity:"Classified", price:25.40 },
  // ── M4A4 (6) ──
  { id:"m4a4-howl", weaponName:"M4A4", skinName:"Howl", wear:"MW", float:0.112, rarity:"Covert", price:4200 },
  { id:"m4a4-asiimov", weaponName:"M4A4", skinName:"Asiimov", wear:"FN", float:0.028, rarity:"Covert", price:185 },
  { id:"m4a4-neo-noir", weaponName:"M4A4", skinName:"Neo-Noir", wear:"FN", float:0.038, rarity:"Covert", price:145 },
  { id:"m4a4-poseidon", weaponName:"M4A4", skinName:"Poseidon", wear:"FN", float:0.042, rarity:"Covert", price:120 },
  { id:"m4a4-emperor", weaponName:"M4A4", skinName:"The Emperor", wear:"FN", float:0.033, rarity:"Covert", price:95 },
  { id:"m4a4-desolate-space", weaponName:"M4A4", skinName:"Desolate Space", wear:"FN", float:0.044, rarity:"Covert", price:85 },
  // ── M4A1-S (6) ──
  { id:"m4a1s-hyper-beast", weaponName:"M4A1-S", skinName:"Hyper Beast", wear:"FN", float:0.023, rarity:"Covert", price:210 },
  { id:"m4a1s-printstream", weaponName:"M4A1-S", skinName:"Printstream", wear:"FN", float:0.015, rarity:"Covert", price:115 },
  { id:"m4a1s-hot-rod", weaponName:"M4A1-S", skinName:"Hot Rod", wear:"FN", float:0.010, rarity:"Classified", price:320 },
  { id:"m4a1s-player-two", weaponName:"M4A1-S", skinName:"Player Two", wear:"FN", float:0.022, rarity:"Covert", price:95 },
  { id:"m4a1s-nightmare", weaponName:"M4A1-S", skinName:"Nightmare", wear:"FN", float:0.025, rarity:"Classified", price:48 },
  { id:"m4a1s-icarus-fell", weaponName:"M4A1-S", skinName:"Icarus Fell", wear:"FN", float:0.018, rarity:"Classified", price:38 },
  // ── AWP (8) ──
  { id:"awp-dragon-lore", weaponName:"AWP", skinName:"Dragon Lore", wear:"FT", float:0.187, rarity:"Covert", price:9800 },
  { id:"awp-medusa", weaponName:"AWP", skinName:"Medusa", wear:"FN", float:0.032, rarity:"Covert", price:1150 },
  { id:"awp-lightning-strike", weaponName:"AWP", skinName:"Lightning Strike", wear:"FN", float:0.018, rarity:"Covert", price:450 },
  { id:"awp-fade", weaponName:"AWP", skinName:"Fade", wear:"FN", float:0.014, rarity:"Classified", price:385 },
  { id:"awp-desert-hydra", weaponName:"AWP", skinName:"Desert Hydra", wear:"FN", float:0.028, rarity:"Covert", price:185 },
  { id:"awp-printstream", weaponName:"AWP", skinName:"Printstream", wear:"FN", float:0.012, rarity:"Covert", price:125 },
  { id:"awp-neo-noir", weaponName:"AWP", skinName:"Neo-Noir", wear:"FN", float:0.036, rarity:"Covert", price:95 },
  { id:"awp-asiimov", weaponName:"AWP", skinName:"Asiimov", wear:"FT", float:0.205, rarity:"Covert", price:72 },
  // ── Pistols (12) ──
  { id:"glock-fade", weaponName:"Glock-18", skinName:"Fade", wear:"FN", float:0.018, rarity:"Restricted", price:340 },
  { id:"glock-twilight-galaxy", weaponName:"Glock-18", skinName:"Twilight Galaxy", wear:"FN", float:0.023, rarity:"Classified", price:48 },
  { id:"glock-water-elemental", weaponName:"Glock-18", skinName:"Water Elemental", wear:"FN", float:0.025, rarity:"Restricted", price:22 },
  { id:"usps-kill-confirmed", weaponName:"USP-S", skinName:"Kill Confirmed", wear:"FN", float:0.018, rarity:"Covert", price:185 },
  { id:"usps-orion", weaponName:"USP-S", skinName:"Orion", wear:"FN", float:0.022, rarity:"Classified", price:95 },
  { id:"usps-printstream", weaponName:"USP-S", skinName:"Printstream", wear:"FN", float:0.014, rarity:"Covert", price:72 },
  { id:"deagle-blaze", weaponName:"Desert Eagle", skinName:"Blaze", wear:"FN", float:0.012, rarity:"Classified", price:265 },
  { id:"deagle-printstream", weaponName:"Desert Eagle", skinName:"Printstream", wear:"FN", float:0.016, rarity:"Covert", price:88 },
  { id:"deagle-kumicho-dragon", weaponName:"Desert Eagle", skinName:"Kumicho Dragon", wear:"FN", float:0.022, rarity:"Covert", price:95 },
  { id:"deagle-conspiracy", weaponName:"Desert Eagle", skinName:"Conspiracy", wear:"FN", float:0.020, rarity:"Classified", price:38 },
  { id:"fiveseveN-hyper-beast", weaponName:"Five-SeveN", skinName:"Hyper Beast", wear:"FN", float:0.028, rarity:"Covert", price:42 },
  { id:"cz75-tigris", weaponName:"CZ75-Auto", skinName:"Tigris", wear:"FN", float:0.020, rarity:"Classified", price:18 },
  // ── Rifles: Sniper (4) ──
  { id:"ssg08-dragonfire", weaponName:"SSG 08", skinName:"Dragonfire", wear:"FN", float:0.028, rarity:"Covert", price:98 },
  { id:"ssg08-blood-water", weaponName:"SSG 08", skinName:"Blood in the Water", wear:"FN", float:0.024, rarity:"Classified", price:52 },
  { id:"scar20-bloodsport", weaponName:"SCAR-20", skinName:"Bloodsport", wear:"FN", float:0.028, rarity:"Classified", price:22 },
  { id:"g3sg1-demeter", weaponName:"G3SG1", skinName:"Demeter", wear:"FN", float:0.020, rarity:"Classified", price:18 },
  // ── Rifles: Assault (8) ──
  { id:"sg553-integrale", weaponName:"SG 553", skinName:"Integrale", wear:"FN", float:0.025, rarity:"Covert", price:32 },
  { id:"aug-chameleon", weaponName:"AUG", skinName:"Chameleon", wear:"FN", float:0.030, rarity:"Classified", price:45 },
  { id:"famas-commemoration", weaponName:"FAMAS", skinName:"Commemoration", wear:"FN", float:0.025, rarity:"Covert", price:82 },
  { id:"galil-cerberus", weaponName:"Galil AR", skinName:"Cerberus", wear:"FN", float:0.032, rarity:"Covert", price:35 },
  { id:"galil-kami", weaponName:"Galil AR", skinName:"Kami", wear:"FN", float:0.028, rarity:"Classified", price:22 },
  { id:"famas-roll-cage", weaponName:"FAMAS", skinName:"Roll Cage", wear:"FN", float:0.022, rarity:"Classified", price:28 },
  { id:"aug-stymphalian", weaponName:"AUG", skinName:"Stymphalian", wear:"FN", float:0.026, rarity:"Covert", price:58 },
  { id:"sg553-cyrex", weaponName:"SG 553", skinName:"Cyrex", wear:"FN", float:0.018, rarity:"Classified", price:28 },
  // ── SMGs (6) ──
  { id:"mp9-wild-lily", weaponName:"MP9", skinName:"Wild Lily", wear:"FN", float:0.022, rarity:"Covert", price:45 },
  { id:"mp9-hypnotic", weaponName:"MP9", skinName:"Hypnotic", wear:"FN", float:0.018, rarity:"Classified", price:65 },
  { id:"p90-death-by-kitty", weaponName:"P90", skinName:"Death by Kitty", wear:"FN", float:0.030, rarity:"Covert", price:52 },
  { id:"p90-asiimov", weaponName:"P90", skinName:"Asiimov", wear:"FN", float:0.025, rarity:"Classified", price:38 },
  { id:"mac10-neon-rider", weaponName:"MAC-10", skinName:"Neon Rider", wear:"FN", float:0.028, rarity:"Covert", price:48 },
  { id:"ump-momentum", weaponName:"UMP-45", skinName:"Momentum", wear:"FN", float:0.020, rarity:"Classified", price:15 },
  // ── Heavy (4) ──
  { id:"nova-hyper-beast", weaponName:"Nova", skinName:"Hyper Beast", wear:"FN", float:0.032, rarity:"Covert", price:35 },
  { id:"mag7-praetorian", weaponName:"MAG-7", skinName:"Praetorian", wear:"FN", float:0.025, rarity:"Covert", price:28 },
  { id:"xm1014-tranquility", weaponName:"XM1014", skinName:"Tranquility", wear:"FN", float:0.022, rarity:"Classified", price:18 },
  { id:"negev-lionfish", weaponName:"Negev", skinName:"Lionfish", wear:"FN", float:0.025, rarity:"Classified", price:12 },
  // ── Additional Knives ──
  { id:"karambit-lore", weaponName:"Karambit", skinName:"Lore", wear:"FN", float:0.020, rarity:"Knife", price:1850 },
  { id:"butterfly-lore", weaponName:"Butterfly Knife", skinName:"Lore", wear:"FN", float:0.018, rarity:"Knife", price:2400 },
  { id:"m9-marble-fade", weaponName:"M9 Bayonet", skinName:"Marble Fade", wear:"FN", float:0.012, rarity:"Knife", price:850 },
  // ── Additional Rifles ──
  { id:"m4a4-spider-lily", weaponName:"M4A4", skinName:"Spider Lily", wear:"FN", float:0.015, rarity:"Covert", price:350 },
  { id:"mp7-fade", weaponName:"MP7", skinName:"Fade", wear:"FN", float:0.015, rarity:"Classified", price:185 },
  { id:"m249-system-lock", weaponName:"M249", skinName:"System Lock", wear:"FN", float:0.022, rarity:"Classified", price:22 },
];

// ── CS2 Cases Catalog (20 cases) ─────────────────────────────────────────────
export const cs2CasesCatalog: CS2Case[] = [
  { id:"clutch-case", name:"Clutch Case", quantity:1, price:8.50 },
  { id:"dreams-nightmares", name:"Dreams & Nightmares Case", quantity:1, price:15.20 },
  { id:"operation-broken-fang", name:"Operation Broken Fang Case", quantity:1, price:4.20 },
  { id:"snakebite-case", name:"Snakebite Case", quantity:1, price:3.85 },
  { id:"prisma-2-case", name:"Prisma 2 Case", quantity:1, price:6.50 },
  { id:"recoil-case", name:"Recoil Case", quantity:1, price:2.80 },
  { id:"revolution-case", name:"Revolution Case", quantity:1, price:3.20 },
  { id:"kilowatt-case", name:"Kilowatt Case", quantity:1, price:4.80 },
  { id:"gallery-case", name:"Gallery Case", quantity:1, price:5.60 },
  { id:"fracture-case", name:"Fracture Case", quantity:1, price:2.40 },
  { id:"horizon-case", name:"Horizon Case", quantity:1, price:3.10 },
  { id:"spectrum-2-case", name:"Spectrum 2 Case", quantity:1, price:4.20 },
  { id:"spectrum-case", name:"Spectrum Case", quantity:1, price:3.60 },
  { id:"danger-zone-case", name:"Danger Zone Case", quantity:1, price:2.90 },
  { id:"cs20-case", name:"CS20 Case", quantity:1, price:3.40 },
  { id:"prisma-case", name:"Prisma Case", quantity:1, price:2.60 },
  { id:"phoenix-case", name:"Phoenix Case", quantity:1, price:2.20 },
  { id:"chroma-3-case", name:"Chroma 3 Case", quantity:1, price:1.95 },
  { id:"gamma-2-case", name:"Gamma 2 Case", quantity:1, price:2.10 },
  { id:"shadow-case", name:"Shadow Case", quantity:1, price:1.85 },
];

// ── Commodities Catalog (50 items) ────────────────────────────────────────────
export const goldCatalog: GoldItem[] = [
  // ── Gold Bars ──
  { id:"gold-bar-0.5g", type:"bar", metal:"gold", name:"0.5g Gold Bar", weightGrams:0.5, purity:99.9, quantity:1 },
  { id:"gold-bar-1g", type:"bar", metal:"gold", name:"1g Gold Bar", weightGrams:1, purity:99.9, quantity:1 },
  { id:"gold-bar-2g", type:"bar", metal:"gold", name:"2g Gold Bar", weightGrams:2, purity:99.9, quantity:1 },
  { id:"gold-bar-2.5g", type:"bar", metal:"gold", name:"2.5g Gold Bar", weightGrams:2.5, purity:99.9, quantity:1 },
  { id:"gold-bar-5g", type:"bar", metal:"gold", name:"5g Gold Bar", weightGrams:5, purity:99.9, quantity:1 },
  { id:"gold-bar-10g", type:"bar", metal:"gold", name:"10g Gold Bar", weightGrams:10, purity:99.9, quantity:1 },
  { id:"gold-bar-20g", type:"bar", metal:"gold", name:"20g Gold Bar", weightGrams:20, purity:99.9, quantity:1 },
  { id:"gold-bar-31g", type:"bar", metal:"gold", name:"1oz Gold Bar (31.1g)", weightGrams:31.1035, purity:99.9, quantity:1 },
  { id:"gold-bar-50g", type:"bar", metal:"gold", name:"50g Gold Bar", weightGrams:50, purity:99.9, quantity:1 },
  { id:"gold-bar-100g", type:"bar", metal:"gold", name:"100g Gold Bar", weightGrams:100, purity:99.9, quantity:1 },
  { id:"gold-bar-250g", type:"bar", metal:"gold", name:"250g Gold Bar", weightGrams:250, purity:99.9, quantity:1 },
  { id:"gold-bar-500g", type:"bar", metal:"gold", name:"500g Gold Bar", weightGrams:500, purity:99.9, quantity:1 },
  { id:"gold-bar-1kg", type:"bar", metal:"gold", name:"1kg Gold Bar", weightGrams:1000, purity:99.9, quantity:1 },
  // ── Gold Coins ──
  { id:"maple-leaf-gold", type:"coin", metal:"gold", name:"Canadian Maple Leaf 1oz", weightGrams:31.1035, purity:99.99, quantity:1 },
  { id:"american-eagle-gold", type:"coin", metal:"gold", name:"American Eagle 1oz", weightGrams:31.1035, purity:91.67, quantity:1 },
  { id:"krugerrand-gold", type:"coin", metal:"gold", name:"South African Krugerrand 1oz", weightGrams:31.1035, purity:91.67, quantity:1 },
  { id:"britannia-gold", type:"coin", metal:"gold", name:"Britannia 1oz", weightGrams:31.1035, purity:99.99, quantity:1 },
  { id:"panda-gold", type:"coin", metal:"gold", name:"Chinese Panda 1oz", weightGrams:31.1035, purity:99.9, quantity:1 },
  { id:"philharmonic-gold", type:"coin", metal:"gold", name:"Vienna Philharmonic 1oz", weightGrams:31.1035, purity:99.99, quantity:1 },
  { id:"buffalo-gold", type:"coin", metal:"gold", name:"American Buffalo 1oz", weightGrams:31.1035, purity:99.99, quantity:1 },
  { id:"kangaroo-gold", type:"coin", metal:"gold", name:"Australian Kangaroo 1oz", weightGrams:31.1035, purity:99.99, quantity:1 },
  { id:"sovereign-gold", type:"coin", metal:"gold", name:"British Sovereign (7.32g)", weightGrams:7.3224, purity:91.67, quantity:1 },
  { id:"libertad-gold", type:"coin", metal:"gold", name:"Mexican Libertad 1oz", weightGrams:31.1035, purity:99.9, quantity:1 },
  // ── Silver Bars ──
  { id:"silver-bar-1g", type:"bar", metal:"silver", name:"1g Silver Bar", weightGrams:1, purity:99.9, quantity:1 },
  { id:"silver-bar-10g", type:"bar", metal:"silver", name:"10g Silver Bar", weightGrams:10, purity:99.9, quantity:1 },
  { id:"silver-bar-31g", type:"bar", metal:"silver", name:"1oz Silver Bar", weightGrams:31.1035, purity:99.9, quantity:1 },
  { id:"silver-bar-100g", type:"bar", metal:"silver", name:"100g Silver Bar", weightGrams:100, purity:99.9, quantity:1 },
  { id:"silver-bar-250g", type:"bar", metal:"silver", name:"250g Silver Bar", weightGrams:250, purity:99.9, quantity:1 },
  { id:"silver-bar-500g", type:"bar", metal:"silver", name:"500g Silver Bar", weightGrams:500, purity:99.9, quantity:1 },
  { id:"silver-bar-1kg", type:"bar", metal:"silver", name:"1kg Silver Bar", weightGrams:1000, purity:99.9, quantity:1 },
  { id:"silver-bar-5kg", type:"bar", metal:"silver", name:"5kg Silver Bar", weightGrams:5000, purity:99.9, quantity:1 },
  // ── Silver Coins ──
  { id:"silver-eagle", type:"coin", metal:"silver", name:"American Silver Eagle 1oz", weightGrams:31.1035, purity:99.9, quantity:1 },
  { id:"maple-leaf-silver", type:"coin", metal:"silver", name:"Canadian Maple Leaf 1oz", weightGrams:31.1035, purity:99.99, quantity:1 },
  { id:"britannia-silver", type:"coin", metal:"silver", name:"Britannia Silver 1oz", weightGrams:31.1035, purity:99.9, quantity:1 },
  { id:"philharmonic-silver", type:"coin", metal:"silver", name:"Vienna Philharmonic Silver 1oz", weightGrams:31.1035, purity:99.9, quantity:1 },
  { id:"kookaburra-silver", type:"coin", metal:"silver", name:"Australian Kookaburra 1oz", weightGrams:31.1035, purity:99.9, quantity:1 },
  { id:"libertad-silver", type:"coin", metal:"silver", name:"Mexican Libertad Silver 1oz", weightGrams:31.1035, purity:99.9, quantity:1 },
  { id:"morgan-dollar", type:"coin", metal:"silver", name:"Morgan Silver Dollar (26.7g)", weightGrams:26.73, purity:90.0, quantity:1 },
  { id:"peace-dollar", type:"coin", metal:"silver", name:"Peace Silver Dollar (26.7g)", weightGrams:26.73, purity:90.0, quantity:1 },
  // ── Platinum ──
  { id:"platinum-bar-1g", type:"bar", metal:"platinum", name:"1g Platinum Bar", weightGrams:1, purity:99.95, quantity:1 },
  { id:"platinum-bar-5g", type:"bar", metal:"platinum", name:"5g Platinum Bar", weightGrams:5, purity:99.95, quantity:1 },
  { id:"platinum-bar-10g", type:"bar", metal:"platinum", name:"10g Platinum Bar", weightGrams:10, purity:99.95, quantity:1 },
  { id:"platinum-bar-31g", type:"bar", metal:"platinum", name:"1oz Platinum Bar", weightGrams:31.1035, purity:99.95, quantity:1 },
  { id:"platinum-bar-50g", type:"bar", metal:"platinum", name:"50g Platinum Bar", weightGrams:50, purity:99.95, quantity:1 },
  { id:"platinum-bar-100g", type:"bar", metal:"platinum", name:"100g Platinum Bar", weightGrams:100, purity:99.95, quantity:1 },
  { id:"maple-leaf-platinum", type:"coin", metal:"platinum", name:"Canadian Maple Leaf Platinum 1oz", weightGrams:31.1035, purity:99.95, quantity:1 },
  { id:"american-eagle-platinum", type:"coin", metal:"platinum", name:"American Eagle Platinum 1oz", weightGrams:31.1035, purity:99.95, quantity:1 },
  // ── Palladium ──
  { id:"palladium-bar-1g", type:"bar", metal:"palladium", name:"1g Palladium Bar", weightGrams:1, purity:99.95, quantity:1 },
  { id:"palladium-bar-5g", type:"bar", metal:"palladium", name:"5g Palladium Bar", weightGrams:5, purity:99.95, quantity:1 },
  { id:"palladium-bar-31g", type:"bar", metal:"palladium", name:"1oz Palladium Bar", weightGrams:31.1035, purity:99.95, quantity:1 },
  { id:"maple-leaf-palladium", type:"coin", metal:"palladium", name:"Canadian Maple Leaf Palladium 1oz", weightGrams:31.1035, purity:99.95, quantity:1 },
];

// ── Pokémon Cards Catalog (75 cards) ─────────────────────────────────────────
export const pokemonCardsCatalog: PokemonCard[] = [
  // ── Base Set Holos ──
  { id:"charizard-base-psa8", name:"Charizard", set:"Base Set", condition:"PSA 8", rarity:"Holo", value:475 },
  { id:"blastoise-base-psa8", name:"Blastoise", set:"Base Set", condition:"PSA 8", rarity:"Holo", value:175 },
  { id:"venusaur-base-psa8", name:"Venusaur", set:"Base Set", condition:"PSA 8", rarity:"Holo", value:145 },
  { id:"mewtwo-base-psa9", name:"Mewtwo", set:"Base Set", condition:"PSA 9", rarity:"Holo", value:295 },
  { id:"gyarados-base-psa8", name:"Gyarados", set:"Base Set", condition:"PSA 8", rarity:"Holo", value:88 },
  { id:"raichu-base-psa8", name:"Raichu", set:"Base Set", condition:"PSA 8", rarity:"Holo", value:265 },
  { id:"ninetales-base-nm", name:"Ninetales", set:"Base Set", condition:"NM", rarity:"Holo", value:58 },
  { id:"alakazam-base-nm", name:"Alakazam", set:"Base Set", condition:"NM", rarity:"Holo", value:48 },
  { id:"machamp-base-nm", name:"Machamp", set:"Base Set", condition:"1st Ed NM", rarity:"Holo", value:65 },
  { id:"clefairy-base-nm", name:"Clefairy", set:"Base Set", condition:"NM", rarity:"Holo", value:38 },
  // ── Neo Genesis & Gold ──
  { id:"lugia-neo-psa9", name:"Lugia", set:"Neo Genesis", condition:"PSA 9", rarity:"Holo", value:1200 },
  { id:"ho-oh-neo-psa8", name:"Ho-Oh", set:"Neo Revelation", condition:"PSA 8", rarity:"Holo", value:380 },
  { id:"espeon-neo-psa9", name:"Espeon", set:"Neo Discovery", condition:"PSA 9", rarity:"Holo", value:195 },
  { id:"umbreon-neo-psa8", name:"Umbreon", set:"Neo Discovery", condition:"PSA 8", rarity:"Holo", value:320 },
  { id:"ampharos-neo-psa8", name:"Ampharos", set:"Neo Genesis", condition:"PSA 8", rarity:"Holo", value:85 },
  // ── Fossil & Jungle ──
  { id:"gengar-fossil-psa8", name:"Gengar", set:"Fossil", condition:"PSA 8", rarity:"Holo", value:95 },
  { id:"lapras-fossil-psa8", name:"Lapras", set:"Fossil", condition:"PSA 8", rarity:"Holo", value:45 },
  { id:"cloyster-fossil-nm", name:"Cloyster", set:"Fossil", condition:"NM", rarity:"Holo", value:22 },
  { id:"vaporeon-jungle-psa8", name:"Vaporeon", set:"Jungle", condition:"PSA 8", rarity:"Holo", value:65 },
  { id:"jolteon-jungle-psa8", name:"Jolteon", set:"Jungle", condition:"PSA 8", rarity:"Holo", value:82 },
  { id:"flareon-jungle-psa8", name:"Flareon", set:"Jungle", condition:"PSA 8", rarity:"Holo", value:78 },
  { id:"scyther-jungle-psa8", name:"Scyther", set:"Jungle", condition:"PSA 8", rarity:"Holo", value:42 },
  // ── EX era ──
  { id:"mewtwo-ex-next-dest", name:"Mewtwo-EX", set:"Next Destinies", condition:"NM", rarity:"EX", value:125 },
  { id:"rayquaza-ex-dragon", name:"Rayquaza-EX", set:"Dragon Vault", condition:"NM", rarity:"EX", value:75 },
  { id:"darkrai-ex-dark-explorers", name:"Darkrai-EX", set:"Dark Explorers", condition:"NM", rarity:"EX", value:48 },
  { id:"charizard-ex-fire-red", name:"Charizard-EX", set:"FireRed & LeafGreen", condition:"PSA 8", rarity:"EX", value:285 },
  { id:"lugia-ex-unseen-forces", name:"Lugia-EX", set:"Unseen Forces", condition:"NM", rarity:"EX", value:165 },
  { id:"groudon-ex-ruby-sapphire", name:"Groudon-EX", set:"Ruby & Sapphire", condition:"NM", rarity:"EX", value:55 },
  { id:"kyogre-ex-ruby-sapphire", name:"Kyogre-EX", set:"Ruby & Sapphire", condition:"NM", rarity:"EX", value:55 },
  // ── GX era ──
  { id:"umbreon-gx-sm-promos", name:"Umbreon-GX", set:"SM Promos", condition:"NM", rarity:"GX", value:90 },
  { id:"espeon-gx-sm-promos", name:"Espeon-GX", set:"SM Promos", condition:"NM", rarity:"GX", value:75 },
  { id:"charizard-gx-hiddenfates", name:"Charizard-GX", set:"Hidden Fates", condition:"NM", rarity:"GX", value:145 },
  { id:"pikachu-gx-sm-promos", name:"Pikachu-GX", set:"SM Promos", condition:"NM", rarity:"GX", value:65 },
  { id:"mewtwo-gx-shiny-vault", name:"Mewtwo-GX", set:"Shiny Vault", condition:"NM", rarity:"GX", value:85 },
  { id:"gardevoir-gx-burning-shadows", name:"Gardevoir-GX", set:"Burning Shadows", condition:"NM", rarity:"GX", value:38 },
  { id:"zoroark-gx-shiny-vault", name:"Zoroark-GX", set:"Shiny Vault", condition:"NM", rarity:"GX", value:72 },
  // ── VMAX era ──
  { id:"charizard-vmax-champions-path", name:"Charizard VMAX", set:"Champion's Path", condition:"NM", rarity:"VMAX", value:220 },
  { id:"pikachu-vmax-vivid-voltage", name:"Pikachu VMAX", set:"Vivid Voltage", condition:"NM", rarity:"VMAX", value:45 },
  { id:"rayquaza-vmax-evolving-skies", name:"Rayquaza VMAX", set:"Evolving Skies", condition:"NM", rarity:"VMAX", value:110 },
  { id:"umbreon-vmax-evolving-skies", name:"Umbreon VMAX", set:"Evolving Skies", condition:"NM", rarity:"VMAX", value:165 },
  { id:"espeon-vmax-evolving-skies", name:"Espeon VMAX", set:"Evolving Skies", condition:"NM", rarity:"VMAX", value:65 },
  { id:"glaceon-vmax-evolving-skies", name:"Glaceon VMAX", set:"Evolving Skies", condition:"NM", rarity:"VMAX", value:40 },
  { id:"sylveon-vmax-evolving-skies", name:"Sylveon VMAX", set:"Evolving Skies", condition:"NM", rarity:"VMAX", value:35 },
  { id:"jolteon-vmax-evolving-skies", name:"Jolteon VMAX", set:"Evolving Skies", condition:"NM", rarity:"VMAX", value:48 },
  { id:"calyrex-vmax-chilling-reign", name:"Ice Rider Calyrex VMAX", set:"Chilling Reign", condition:"NM", rarity:"VMAX", value:55 },
  { id:"gengar-vmax-fusion-strike", name:"Gengar VMAX", set:"Fusion Strike", condition:"NM", rarity:"VMAX", value:32 },
  // ── TAG TEAM ──
  { id:"reshiram-charizard-unbroken-bonds", name:"Reshiram & Charizard-GX", set:"Unbroken Bonds", condition:"NM", rarity:"GX", value:75 },
  { id:"pikachu-zekrom-team-up", name:"Pikachu & Zekrom-GX", set:"Team Up", condition:"NM", rarity:"GX", value:55 },
  { id:"mewtwo-mew-cosmic-eclipse", name:"Mewtwo & Mew-GX", set:"Cosmic Eclipse", condition:"NM", rarity:"GX", value:65 },
  // ── Sword & Shield VSTAR ──
  { id:"charizard-vstar-brilliant-stars", name:"Charizard VSTAR", set:"Brilliant Stars", condition:"NM", rarity:"VMAX", value:75 },
  { id:"arceus-vstar-brilliant-stars", name:"Arceus VSTAR", set:"Brilliant Stars", condition:"NM", rarity:"VMAX", value:38 },
  { id:"mewtwo-vstar-pokemon-go", name:"Mewtwo VSTAR", set:"Pokémon GO", condition:"NM", rarity:"VMAX", value:30 },
  { id:"dialga-vstar-astral-radiance", name:"Origin Dialga VSTAR", set:"Astral Radiance", condition:"NM", rarity:"VMAX", value:35 },
  { id:"palkia-vstar-astral-radiance", name:"Origin Palkia VSTAR", set:"Astral Radiance", condition:"NM", rarity:"VMAX", value:32 },
  // ── Scarlet & Violet ──
  { id:"mew-151-ex-151", name:"Mew ex", set:"151", condition:"NM", rarity:"EX", value:28 },
  { id:"charizard-ex-151", name:"Charizard ex", set:"151", condition:"NM", rarity:"EX", value:48 },
  { id:"pikachu-ex-151", name:"Pikachu ex", set:"151", condition:"NM", rarity:"EX", value:22 },
  { id:"lugia-ex-silver-tempest", name:"Lugia ex", set:"Silver Tempest", condition:"NM", rarity:"EX", value:42 },
  { id:"giratina-ex-lost-origin", name:"Giratina ex", set:"Lost Origin", condition:"NM", rarity:"EX", value:32 },
  { id:"miraidon-ex-scarlet-violet", name:"Miraidon ex", set:"Scarlet & Violet Base", condition:"NM", rarity:"EX", value:25 },
  { id:"koraidon-ex-scarlet-violet", name:"Koraidon ex", set:"Scarlet & Violet Base", condition:"NM", rarity:"EX", value:22 },
  { id:"charizard-ex-obsidian-flames", name:"Charizard ex (Full Art)", set:"Obsidian Flames", condition:"NM", rarity:"EX", value:48 },
  { id:"eevee-evolving-skies-nm", name:"Eevee", set:"Evolving Skies", condition:"NM", rarity:"Rare", value:12 },
  // ── Special ──
  { id:"ancient-mew-promo", name:"Ancient Mew", set:"WB Movie Promo", condition:"NM", rarity:"Holo", value:15 },
  { id:"tropical-mega-battle", name:"Tropical Mega Battle", set:"Promo", condition:"NM", rarity:"Holo", value:12000 },
  { id:"no3-trainer", name:"No. 3 Trainer", set:"Japanese Promo", condition:"NM", rarity:"Holo", value:95000 },
  { id:"pikachu-gold-star-pop5", name:"Pikachu Gold Star", set:"POP Series 5", condition:"PSA 8", rarity:"Holo", value:480 },
  { id:"umbreon-gold-star-pop5", name:"Umbreon Gold Star", set:"POP Series 5", condition:"PSA 9", rarity:"Holo", value:4200 },
  { id:"espeon-gold-star-pop5", name:"Espeon Gold Star", set:"POP Series 5", condition:"PSA 9", rarity:"Holo", value:3800 },
  { id:"charizard-shiny-hidden-fates", name:"Charizard (Shiny)", set:"Hidden Fates Shiny Vault", condition:"NM", rarity:"Holo", value:88 },
  // ── More Base Set ──
  { id:"pikachu-base-shadowless", name:"Pikachu (Yellow Cheeks)", set:"Base Set Shadowless", condition:"PSA 8", rarity:"Holo", value:320 },
  { id:"charizard-base-1st-psa9", name:"Charizard 1st Edition", set:"Base Set 1st Ed", condition:"PSA 9", rarity:"Holo", value:295000 },
  { id:"blastoise-base-1st-psa8", name:"Blastoise 1st Edition", set:"Base Set 1st Ed", condition:"PSA 8", rarity:"Holo", value:2800 },
  { id:"venusaur-base-1st-psa8", name:"Venusaur 1st Edition", set:"Base Set 1st Ed", condition:"PSA 8", rarity:"Holo", value:1850 },
  { id:"zapdos-base-psa8", name:"Zapdos", set:"Base Set", condition:"PSA 8", rarity:"Holo", value:88 },
  { id:"moltres-base-psa8", name:"Moltres", set:"Base Set", condition:"PSA 8", rarity:"Holo", value:72 },
  { id:"articuno-base-psa8", name:"Articuno", set:"Base Set", condition:"PSA 8", rarity:"Holo", value:95 },
  // ── More Neo ──
  { id:"celebi-neo-destiny", name:"Celebi", set:"Neo Destiny", condition:"PSA 8", rarity:"Holo", value:185 },
  { id:"suicune-neo-revelation", name:"Suicune", set:"Neo Revelation", condition:"PSA 8", rarity:"Holo", value:145 },
  { id:"entei-neo-revelation", name:"Entei", set:"Neo Revelation", condition:"PSA 8", rarity:"Holo", value:98 },
  { id:"raikou-neo-revelation", name:"Raikou", set:"Neo Revelation", condition:"PSA 8", rarity:"Holo", value:92 },
  // ── More EX Era ──
  { id:"mew-ex-legend-maker", name:"Mew-EX", set:"Legend Maker", condition:"NM", rarity:"EX", value:65 },
  { id:"deoxys-ex-sandstorm", name:"Deoxys-EX", set:"Sandstorm", condition:"NM", rarity:"EX", value:42 },
  { id:"pikachu-ex-sandstorm", name:"Pikachu-EX", set:"Sandstorm", condition:"NM", rarity:"EX", value:95 },
  { id:"blastoise-ex-fireredleafgreen", name:"Blastoise-EX", set:"FireRed & LeafGreen", condition:"NM", rarity:"EX", value:55 },
  // ── More GX ──
  { id:"eevee-gx-hiddenfates", name:"Eevee-GX", set:"Hidden Fates", condition:"NM", rarity:"GX", value:45 },
  { id:"sylveon-gx-guardians-rising", name:"Sylveon-GX", set:"Guardians Rising", condition:"NM", rarity:"GX", value:35 },
  { id:"tapu-lele-gx-guardians-rising", name:"Tapu Lele-GX", set:"Guardians Rising", condition:"NM", rarity:"GX", value:48 },
  { id:"golden-charizard-gx-burning-shadows", name:"Charizard-GX (Gold)", set:"Burning Shadows", condition:"NM", rarity:"GX", value:285 },
  { id:"zygarde-gx-forbidden-light", name:"Zygarde-GX", set:"Forbidden Light", condition:"NM", rarity:"GX", value:28 },
  // ── More VMAX ──
  { id:"mew-vmax-fusion-strike", name:"Mew VMAX", set:"Fusion Strike", condition:"NM", rarity:"VMAX", value:38 },
  { id:"leafeon-vmax-evolving-skies", name:"Leafeon VMAX", set:"Evolving Skies", condition:"NM", rarity:"VMAX", value:35 },
  { id:"flareon-vmax-evolving-skies", name:"Flareon VMAX", set:"Evolving Skies", condition:"NM", rarity:"VMAX", value:30 },
  { id:"eevee-vmax-evolving-skies", name:"Eevee VMAX", set:"Evolving Skies", condition:"NM", rarity:"VMAX", value:32 },
  { id:"lugia-vstar-silver-tempest", name:"Lugia VSTAR", set:"Silver Tempest", condition:"NM", rarity:"VMAX", value:58 },
  // ── More Scarlet & Violet ──
  { id:"tyranitar-ex-paldea", name:"Tyranitar ex", set:"Paldea Evolved", condition:"NM", rarity:"EX", value:22 },
  { id:"gengar-ex-paldea", name:"Gengar ex", set:"Paldea Evolved", condition:"NM", rarity:"EX", value:18 },
  { id:"arcanine-ex-obs-flames", name:"Arcanine ex", set:"Obsidian Flames", condition:"NM", rarity:"EX", value:15 },
  { id:"ninetales-ex-paradox-rift", name:"Ninetales ex", set:"Paradox Rift", condition:"NM", rarity:"EX", value:14 },
  { id:"iron-valiant-ex-paradox-rift", name:"Iron Valiant ex", set:"Paradox Rift", condition:"NM", rarity:"EX", value:22 },
];

// ── Pokémon Figures Catalog (25 figures) ─────────────────────────────────────
export const pokemonFiguresCatalog: PokemonFigure[] = [
  { id:"charizard-nendoroid", name:"Charizard", size:'6"', condition:"Mint in Box", value:185 },
  { id:"pikachu-nendoroid", name:"Pikachu", size:'4"', condition:"Mint in Box", value:65 },
  { id:"mewtwo-kotobukiya", name:"Mewtwo", size:'10"', condition:"Mint in Box", value:320 },
  { id:"eevee-figure-mib", name:"Eevee", size:'3"', condition:"Mint in Box", value:35 },
  { id:"gengar-funko", name:"Gengar", size:'4"', condition:"Mint in Box", value:48 },
  { id:"lugia-figure-mib", name:"Lugia", size:'8"', condition:"Mint in Box", value:145 },
  { id:"snorlax-funko-super", name:"Snorlax", size:'10"', condition:"Mint in Box", value:95 },
  { id:"bulbasaur-figure-tomy", name:"Bulbasaur", size:'2"', condition:"Good", value:18 },
  { id:"squirtle-figure-tomy", name:"Squirtle", size:'2"', condition:"Good", value:18 },
  { id:"charmander-figure-tomy", name:"Charmander", size:'2"', condition:"Good", value:22 },
  { id:"pikachu-wap-1998", name:"Pikachu", size:'2"', condition:"Mint in Box", value:45 },
  { id:"gyarados-figure-6inch", name:"Gyarados", size:'6"', condition:"Very Good", value:85 },
  { id:"dragonite-figure", name:"Dragonite", size:'5"', condition:"Mint in Box", value:75 },
  { id:"umbreon-figure", name:"Umbreon", size:'4"', condition:"Mint in Box", value:88 },
  { id:"espeon-figure", name:"Espeon", size:'4"', condition:"Mint in Box", value:82 },
  { id:"lucario-figure", name:"Lucario", size:'5"', condition:"Mint in Box", value:55 },
  { id:"garchomp-figure", name:"Garchomp", size:'6"', condition:"Mint in Box", value:65 },
  { id:"mew-figure-waps", name:"Mew", size:'3"', condition:"Mint in Box", value:52 },
  { id:"rayquaza-figure", name:"Rayquaza", size:'12"', condition:"Mint in Box", value:125 },
  { id:"legendary-birds-set", name:"Articuno/Zapdos/Moltres Set", size:'3×3"', condition:"Mint in Box", value:95 },
  { id:"raichu-figure", name:"Raichu", size:'3"', condition:"Very Good", value:28 },
  { id:"meowth-happy-meal", name:"Meowth", size:'2"', condition:"Good", value:12 },
  { id:"ho-oh-figure", name:"Ho-Oh", size:'5"', condition:"Mint in Box", value:72 },
  { id:"celebi-figure", name:"Celebi", size:'2"', condition:"Mint in Box", value:38 },
  { id:"charizard-bandai-scale", name:"Charizard (Scale)", size:'8"', condition:"Mint in Box", value:245 },
];

// ── Metal spot prices (USD per gram) ─────────────────────────────────────────
export const metalSpotPerGram: Record<string, number> = {
  gold: 146.00,
  silver: 2.42,
  platinum: 63.77,
  palladium: 46.01,
};
export const metalColors: Record<string, string> = {
  gold: "#f5c542", silver: "#c0c0c0", platinum: "#e8e8f5", palladium: "#d4c9bc",
};
export const goldSpotPerGram = metalSpotPerGram.gold;
export const goldSpotPerOz = 4541.50;

// ── Totals ────────────────────────────────────────────────────────────────────
export const cryptoTotal = cryptoAssets.reduce((s, a) => s + a.amount * a.price, 0);
export const cs2Total = cs2Skins.reduce((s, a) => s + a.price, 0) + cs2Cases.reduce((s, a) => s + a.quantity * a.price, 0);
export const goldTotal = goldItems.reduce((s, g) => s + g.quantity * g.weightGrams * (metalSpotPerGram[g.metal] || goldSpotPerGram), 0);
export const pokemonTotal = pokemonCards.reduce((s, c) => s + c.value, 0) + pokemonFigures.reduce((s, f) => s + f.value, 0);
export const stockTotal = stockAssets.reduce((s, a) => s + a.shares * a.price, 0);
export const grandTotal = cryptoTotal + cs2Total + goldTotal + pokemonTotal + stockTotal;
