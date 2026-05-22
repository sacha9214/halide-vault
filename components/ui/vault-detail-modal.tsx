"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import type { CryptoAsset, CS2Skin, CS2Case, GoldItem, PokemonCard, PokemonFigure, StockAsset } from "@/lib/mock-data";
import { metalSpotPerGram, metalColors } from "@/lib/mock-data";
import { TradingChart, type ChartPoint } from "@/components/ui/trading-chart";
import { usePrices } from "@/lib/price-context";

export type ModalData =
  | { kind: "crypto"; asset: CryptoAsset }
  | { kind: "stock"; stock: StockAsset }
  | { kind: "cs2skin"; skin: CS2Skin }
  | { kind: "cs2case"; cs2case: CS2Case }
  | { kind: "gold"; item: GoldItem }
  | { kind: "pokemon-card"; card: PokemonCard }
  | { kind: "pokemon-figure"; figure: PokemonFigure };

// Deterministic seeded RNG (xorshift32)
function rng(seed: number) {
  let s = (Math.abs(Math.floor(seed)) >>> 0) || 2463534242;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

// String → stable numeric seed
function hashStr(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

// Geometric Brownian Motion chart anchored to endPrice at the last day
function buildChartData(seed: number, endPrice: number, days = 30, volatility = 0.035, baseVolume = 0): ChartPoint[] {
  const rand = rng(seed);

  // Random overall trend direction so charts aren't all upward
  const drift = (rand() - 0.5) * 0.006;

  // Generate log-returns forward (use sum-of-3 uniforms ≈ normal)
  const logReturns: number[] = [];
  for (let i = 0; i < days - 1; i++) {
    const shock = (rand() + rand() + rand() - 1.5) * volatility * 2.45;
    logReturns.push(drift + shock);
  }

  // Build cumulative log prices; shift so last = 0 → last price = endPrice
  let cum = 0;
  const cums = [0, ...logReturns.map(r => { cum += r; return cum; })];
  const lastCum = cums[cums.length - 1];

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return cums.map((c, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const vol = baseVolume > 0 ? baseVolume * (0.4 + rand() * 1.2) : undefined;
    return {
      time: d.toISOString().slice(0, 10),
      value: Math.max(endPrice * Math.exp(c - lastCum), 0.000001),
      volume: vol,
    };
  });
}

const fmt2 = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);
const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
const fmtPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

const cs2RarityColors: Record<CS2Skin["rarity"], string> = {
  Consumer: "#b0c3d9", Industrial: "#5e98d9", "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff", Classified: "#d32ce6", Covert: "#eb4b4b", Knife: "#e4ae39",
};
const cs2WearLabels: Record<CS2Skin["wear"], string> = {
  FN: "Factory New", MW: "Minimal Wear", FT: "Field-Tested", WW: "Well-Worn", BS: "Battle-Scarred",
};
const pkRarityColors: Record<PokemonCard["rarity"], string> = {
  Common: "#888", Uncommon: "#67b941", Rare: "#4b69ff",
  Holo: "#f5c542", EX: "#d32ce6", GX: "#eb4b4b", VMAX: "#f97316",
};

interface StatItem { label: string; value: string; accent?: string }

interface ModalContent {
  color: string;
  title: string;
  subtitle: string;
  currentLabel: string;
  currentValue: string;
  change30d: number;
  coingeckoId?: string;
  yahooSymbol?: string;
  staticData?: ChartPoint[];
  stats: StatItem[];
}

function buildContent(data: ModalData, overridePrice?: number): ModalContent {
  switch (data.kind) {
    case "crypto": {
      const { asset } = data;
      const seed = hashStr(asset.name + asset.ticker);
      const fallback = buildChartData(seed, asset.price, 30, 0.05, asset.price * 1e8);
      const change30d = ((fallback[fallback.length - 1].value - fallback[0].value) / fallback[0].value) * 100;
      return {
        color: asset.color,
        title: asset.name,
        subtitle: `${asset.ticker} · CRYPTOCURRENCY`,
        currentLabel: "CURRENT PRICE",
        currentValue: fmt2(asset.price),
        change30d,
        coingeckoId: asset.coingeckoId,
        staticData: fallback,
        stats: [
          { label: "HELD", value: `${asset.amount} ${asset.ticker}` },
          { label: "VALUE", value: fmtShort(asset.amount * asset.price), accent: asset.color },
          { label: "24H CHANGE", value: fmtPct(asset.change24h), accent: asset.change24h >= 0 ? "#22c55e" : "#ef4444" },
          { label: "30D CHANGE (est)", value: fmtPct(change30d), accent: change30d >= 0 ? "#22c55e" : "#ef4444" },
          { label: "30D HIGH (est)", value: fmt2(Math.max(...fallback.map(d => d.value))) },
          { label: "30D LOW (est)", value: fmt2(Math.min(...fallback.map(d => d.value))) },
        ],
      };
    }
    case "cs2skin": {
      const { skin } = data;
      const price = overridePrice ?? skin.price;
      const rColor = cs2RarityColors[skin.rarity];
      const seed = hashStr(skin.weaponName + skin.skinName + skin.wear);
      const staticData = buildChartData(seed, price, 30, 0.03);
      const change30d = ((staticData[staticData.length - 1].value - staticData[0].value) / staticData[0].value) * 100;
      return {
        color: rColor,
        title: skin.skinName,
        subtitle: `${skin.weaponName} · ${skin.rarity.toUpperCase()}`,
        currentLabel: "STEAM MARKET",
        currentValue: fmt2(price),
        change30d,
        staticData,
        stats: [
          { label: "WEAPON", value: skin.weaponName },
          { label: "RARITY", value: skin.rarity, accent: rColor },
          { label: "WEAR", value: cs2WearLabels[skin.wear] },
          { label: "FLOAT", value: skin.float.toFixed(4) },
          { label: "30D CHANGE", value: fmtPct(change30d), accent: change30d >= 0 ? "#22c55e" : "#ef4444" },
          { label: "MARKET", value: fmt2(price), accent: "#f97316" },
        ],
      };
    }
    case "cs2case": {
      const { cs2case } = data;
      const seed = hashStr(cs2case.name);
      const staticData = buildChartData(seed, cs2case.price, 30, 0.04);
      const change30d = ((staticData[staticData.length - 1].value - staticData[0].value) / staticData[0].value) * 100;
      return {
        color: "#f97316",
        title: cs2case.name,
        subtitle: "CS2 · CASE",
        currentLabel: "UNIT PRICE",
        currentValue: fmt2(cs2case.price),
        change30d,
        staticData,
        stats: [
          { label: "QUANTITY", value: `×${cs2case.quantity}` },
          { label: "UNIT PRICE", value: fmt2(cs2case.price) },
          { label: "TOTAL VALUE", value: fmt2(cs2case.quantity * cs2case.price), accent: "#f97316" },
          { label: "30D CHANGE", value: fmtPct(change30d), accent: change30d >= 0 ? "#22c55e" : "#ef4444" },
        ],
      };
    }
    case "gold": {
      const metalFutures: Record<string, string> = {
        gold: "GC=F", silver: "SI=F", platinum: "PL=F", palladium: "PA=F",
      };
      const { item } = data;
      const spot = metalSpotPerGram[item.metal] || 65.32;
      const mColor = metalColors[item.metal] || "#f5c542";
      const seed = hashStr(item.name + item.metal + String(item.weightGrams));
      const staticData = buildChartData(seed, spot, 30, 0.012);
      const change30d = ((staticData[staticData.length - 1].value - staticData[0].value) / staticData[0].value) * 100;
      return {
        color: mColor,
        title: item.name,
        subtitle: `${item.metal.toUpperCase()} · ${item.type.toUpperCase()} · SPOT /G`,
        currentLabel: "SPOT / GRAM",
        currentValue: fmt2(spot),
        change30d,
        yahooSymbol: metalFutures[item.metal],
        staticData,
        stats: [
          { label: "METAL", value: item.metal.charAt(0).toUpperCase() + item.metal.slice(1) },
          { label: "WEIGHT", value: `${item.weightGrams}g` },
          { label: "PURITY", value: `${item.purity}%` },
          { label: "QUANTITY", value: `×${item.quantity}` },
          { label: "UNIT VALUE", value: fmt2(item.weightGrams * spot) },
          { label: "TOTAL VALUE", value: fmtShort(item.quantity * item.weightGrams * spot), accent: mColor },
        ],
      };
    }
    case "pokemon-card": {
      const { card } = data;
      const rColor = pkRarityColors[card.rarity];
      const seed = hashStr(card.name + card.set + card.rarity);
      const staticData = buildChartData(seed, card.value, 30, 0.015);
      const change30d = ((staticData[staticData.length - 1].value - staticData[0].value) / staticData[0].value) * 100;
      return {
        color: rColor,
        title: card.name,
        subtitle: `${card.set.toUpperCase()} · ${card.rarity.toUpperCase()}`,
        currentLabel: "EST. VALUE",
        currentValue: fmtShort(card.value),
        change30d,
        staticData,
        stats: [
          { label: "SET", value: card.set },
          { label: "RARITY", value: card.rarity, accent: rColor },
          { label: "CONDITION", value: card.condition },
          { label: "VALUE", value: fmtShort(card.value), accent: "#facc15" },
          { label: "30D CHANGE", value: fmtPct(change30d), accent: change30d >= 0 ? "#22c55e" : "#ef4444" },
        ],
      };
    }
    case "pokemon-figure": {
      const { figure } = data;
      const seed = hashStr(figure.name + figure.size + figure.condition);
      const staticData = buildChartData(seed, figure.value, 30, 0.015);
      const change30d = ((staticData[staticData.length - 1].value - staticData[0].value) / staticData[0].value) * 100;
      return {
        color: "#facc15",
        title: figure.name,
        subtitle: `FIGURE · ${figure.size}`,
        currentLabel: "EST. VALUE",
        currentValue: fmtShort(figure.value),
        change30d,
        staticData,
        stats: [
          { label: "SIZE", value: figure.size },
          { label: "CONDITION", value: figure.condition },
          { label: "VALUE", value: fmtShort(figure.value), accent: "#facc15" },
          { label: "30D CHANGE", value: fmtPct(change30d), accent: change30d >= 0 ? "#22c55e" : "#ef4444" },
        ],
      };
    }
    case "stock": {
      const { stock } = data;
      const seed = hashStr(stock.name + stock.ticker);
      const staticData = buildChartData(seed, stock.price, 30, 0.025, stock.price * 2e6);
      const change30d = ((staticData[staticData.length - 1].value - staticData[0].value) / staticData[0].value) * 100;
      const value = stock.shares * stock.price;
      return {
        color: stock.color,
        title: stock.name,
        subtitle: `${stock.ticker} · ${stock.sector.toUpperCase()}`,
        currentLabel: "SHARE PRICE",
        currentValue: fmt2(stock.price),
        change30d,
        yahooSymbol: stock.ticker,
        staticData,
        stats: [
          { label: "TICKER", value: stock.ticker, accent: stock.color },
          { label: "SECTOR", value: stock.sector },
          { label: "SHARES", value: stock.shares > 0 ? String(stock.shares) : "—" },
          { label: "VALUE", value: value > 0 ? fmtShort(value) : "—", accent: stock.shares > 0 ? "#38bdf8" : undefined },
          { label: "1D CHANGE", value: fmtPct(stock.change1d), accent: stock.change1d >= 0 ? "#22c55e" : "#ef4444" },
          { label: "30D CHANGE (est)", value: fmtPct(change30d), accent: change30d >= 0 ? "#22c55e" : "#ef4444" },
          { label: "30D HIGH (est)", value: fmt2(Math.max(...staticData.map(d => d.value))) },
          { label: "30D LOW (est)", value: fmt2(Math.min(...staticData.map(d => d.value))) },
        ],
      };
    }
  }
}

function Stat({ label, value, accent }: StatItem) {
  return (
    <div>
      <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.13em", marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: accent || "#e0e0e0", fontWeight: accent ? 700 : 400 }}>
        {value}
      </div>
    </div>
  );
}

function modalKey(data: ModalData | null): string {
  if (!data) return "closed";
  switch (data.kind) {
    case "crypto":   return `crypto-${data.asset.coingeckoId}`;
    case "stock":    return `stock-${data.stock.ticker}`;
    case "cs2skin":  return `cs2skin-${data.skin.weaponName}-${data.skin.skinName}-${data.skin.wear}`;
    case "cs2case":  return `cs2case-${data.cs2case.name}`;
    case "gold":     return `gold-${data.item.name}`;
    case "pokemon-card":   return `pkcard-${data.card.name}`;
    case "pokemon-figure": return `pkfig-${data.figure.name}`;
  }
}

export function DetailModal({ data, onClose }: { data: ModalData | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [steamPrice, setSteamPrice] = useState<number | null>(null);
  const { crypto: liveCrypto, stocks: liveStocks } = usePrices();

  // Live price from context — immediate, no chart needed
  const contextPrice = (() => {
    if (!data) return null;
    if (data.kind === "crypto") return liveCrypto[data.asset.coingeckoId]?.price ?? null;
    if (data.kind === "stock") return liveStocks[data.stock.ticker]?.price ?? null;
    return null;
  })();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    setLivePrice(null);
    setSteamPrice(null);
    if (!data || data.kind !== "cs2skin") return;
    const { skin } = data;
    const wearLabel = cs2WearLabels[skin.wear];
    const prefix = skin.rarity === "Knife" ? "★ " : "";
    const hashName = `${prefix}${skin.weaponName} | ${skin.skinName} (${wearLabel})`;
    fetch(`/api/cs2prices?name=${encodeURIComponent(hashName)}`)
      .then(r => r.json())
      .then(result => { if (typeof result[hashName] === "number") setSteamPrice(result[hashName]); })
      .catch(() => {});
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [data, onClose]);

  const content = data ? buildContent(data, steamPrice ?? undefined) : null;

  const modal = (
    <AnimatePresence>
      {data && content && (
        <motion.div
          key={modalKey(data)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0e0e0e",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 14,
              width: "100%",
              maxWidth: 720,
              maxHeight: "92vh",
              overflowY: "auto",
              padding: "1.5rem",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "0.56rem", letterSpacing: "0.16em", color: "rgba(224,224,224,0.32)", marginBottom: 6 }}>
                  {content.subtitle}
                </div>
                <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "1.05rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.04em" }}>
                  {content.title}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 6, padding: "0.4rem", cursor: "pointer",
                  color: "rgba(224,224,224,0.55)", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginLeft: "1rem",
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Price row */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "0.54rem", color: "rgba(224,224,224,0.32)", letterSpacing: "0.12em", marginBottom: 5 }}>
                  {content.currentLabel}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "1.9rem", fontWeight: 700, color: content.color, lineHeight: 1 }}>
                  {livePrice !== null && (content.coingeckoId || content.yahooSymbol)
                    ? fmt2(livePrice)
                    : contextPrice !== null
                    ? fmt2(contextPrice)
                    : content.currentValue}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, paddingBottom: "0.2rem" }}>
                {content.change30d >= 0
                  ? <TrendingUp size={12} color="#22c55e" />
                  : <TrendingDown size={12} color="#ef4444" />}
                <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: content.change30d >= 0 ? "#22c55e" : "#ef4444" }}>
                  {fmtPct(content.change30d)} 30d
                </span>
                {(content.coingeckoId || content.yahooSymbol || steamPrice !== null) && (
                  <span style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.22)", marginLeft: 8, letterSpacing: "0.1em" }}>
                    LIVE
                  </span>
                )}
              </div>
            </div>

            {/* Interactive chart */}
            <div style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "0.75rem",
              marginBottom: "1.25rem",
              overflow: "hidden",
            }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.14em", marginBottom: "0.5rem" }}>
                {content.coingeckoId || content.yahooSymbol
                ? "30D PRICE · LIVE · SCROLL TO ZOOM"
                : steamPrice !== null
                ? "30D ESTIMATE · LIVE ENDPOINT · SCROLL TO ZOOM"
                : "30D PRICE ESTIMATE · SCROLL TO ZOOM"}
              </div>
              <TradingChart
                key={content.title + content.subtitle}
                coingeckoId={content.coingeckoId}
                yahooSymbol={content.yahooSymbol}
                staticData={content.staticData}
                color={content.color}
                height={260}
                onPriceLoad={setLivePrice}
              />
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.1rem 1rem" }}>
              {content.stats.map(s => <Stat key={s.label} {...s} />)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
