"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, AlertTriangle, Zap,
  ShieldAlert, BarChart2, Activity, Target, Eye,
  Flame, Snowflake, Radio, RefreshCw, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { usePrices, LivePrices } from "@/lib/price-context";
import { useAuth } from "@/lib/auth-context";
import { cryptoCatalog, metalSpotPerGram } from "@/lib/mock-data";

const ACCENT = "#a78bfa";

const fmt$ = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
const fmtPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function computePulse(prices: LivePrices) {
  const cv = Object.values(prices.crypto);
  const sv = Object.values(prices.stocks);
  const avgC = cv.length ? cv.reduce((s, v) => s + v.change24h, 0) / cv.length : 0;
  const avgS = sv.length ? sv.reduce((s, v) => s + v.change1d, 0) / sv.length : 0;
  const score = Math.max(0, Math.min(100, 50 + avgC * 8 * 0.65 + avgS * 8 * 0.35));

  let label = "NEUTRAL";
  let color = "#94a3b8";
  if (score < 20) { label = "EXTREME FEAR"; color = "#ef4444"; }
  else if (score < 38) { label = "FEAR"; color = "#f97316"; }
  else if (score < 62) { label = "NEUTRAL"; color = "#94a3b8"; }
  else if (score < 80) { label = "GREED"; color = "#22c55e"; }
  else { label = "EXTREME GREED"; color = "#4ade80"; }

  return { score, label, color, avgC, avgS };
}

function PulseGauge({ score, color, label }: { score: number; color: string; label: string }) {
  const cx = 100, cy = 88, r = 68;
  const pt = (s: number) => {
    const a = Math.PI - (s / 100) * Math.PI;
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  };
  const arcSeg = (s1: number, s2: number) => {
    const p1 = pt(s1), p2 = pt(s2);
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 0 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  };
  const segments = [
    { s1: 0, s2: 20, c: "#ef4444" }, { s1: 20, s2: 40, c: "#f97316" },
    { s1: 40, s2: 60, c: "#94a3b8" }, { s1: 60, s2: 80, c: "#86efac" },
    { s1: 80, s2: 100, c: "#22c55e" },
  ];
  const needle = pt(score);
  const needleInner = { x: cx + 12 * Math.cos(Math.PI - (score / 100) * Math.PI), y: cy - 12 * Math.sin(Math.PI - (score / 100) * Math.PI) };
  return (
    <svg width={200} height={106} viewBox="0 0 200 106" style={{ overflow: "visible" }}>
      {segments.map(seg => (
        <path key={seg.s1} d={arcSeg(seg.s1, seg.s2)} fill="none" stroke={seg.c} strokeWidth={10} opacity={0.18} strokeLinecap="butt" />
      ))}
      <path d={arcSeg(0, score)} fill="none" stroke={color} strokeWidth={10} opacity={0.85} strokeLinecap="round" />
      <line x1={needleInner.x} y1={needleInner.y} x2={needle.x} y2={needle.y} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill={color} />
      <circle cx={cx} cy={cy} r={3} fill="#0a0a0a" />
      <text x={cx} y={cy - 16} textAnchor="middle" fill={color} fontSize={26} fontWeight={700} fontFamily="monospace">{Math.round(score)}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={color} fontSize={7} fontFamily="monospace" letterSpacing={2}>{label}</text>
      <text x={14} y={cy + 8} textAnchor="middle" fill="rgba(224,224,224,0.2)" fontSize={7} fontFamily="monospace">FEAR</text>
      <text x={186} y={cy + 8} textAnchor="middle" fill="rgba(224,224,224,0.2)" fontSize={7} fontFamily="monospace">GREED</text>
    </svg>
  );
}

function ScoreRing({ score, color, label }: { score: number; color: string; label: string }) {
  const r = 26, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={66} height={66}>
        <circle cx={33} cy={33} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
        <circle cx={33} cy={33} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 33 33)" style={{ transition: "stroke-dasharray 1.2s ease" }} />
        <text x={33} y={38} textAnchor="middle" fill={color} fontSize={12} fontWeight={700} fontFamily="monospace">{score}</text>
      </svg>
      <span style={{ fontFamily: "monospace", fontSize: "0.57rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.1em" }}>{label}</span>
    </div>
  );
}

function buildInsights(prices: LivePrices, totals: { crypto: number; stocks: number; gold: number; cs2: number; pokemon: number; grand: number }) {
  type Insight = { type: string; title: string; body: string; color: string; conf: number; Icon: React.ElementType };
  const out: Insight[] = [];
  const { crypto: cryptoTotal, stocks: stockTotal, grand: grandTotal } = totals;

  const cv = Object.entries(prices.crypto);
  const sv = Object.entries(prices.stocks);

  if (cv.length > 0) {
    const sorted = [...cv].sort((a, b) => b[1].change24h - a[1].change24h);
    const [topId, topVal] = sorted[0];
    const [, worstVal] = sorted[sorted.length - 1];
    const avg = sorted.reduce((s, [, v]) => s + v.change24h, 0) / sorted.length;
    const topName = cryptoCatalog.find(c => c.coingeckoId === topId)?.name ?? topId.toUpperCase();

    if (topVal.change24h > 2.5) {
      out.push({
        type: "OPPORTUNITY", title: `${topName} Surging`, conf: Math.min(93, 62 + topVal.change24h * 3),
        body: `${topName} is up ${fmtPct(topVal.change24h)} in the last 24h with strong buy-side momentum. Consider adding to your watchlist or increasing allocation.`,
        color: "#22c55e", Icon: TrendingUp,
      });
    }
    if (avg < -1.2) {
      out.push({
        type: "RISK ALERT", title: "Crypto Under Pressure", conf: Math.min(89, 60 + Math.abs(avg) * 5),
        body: `Average crypto is ${fmtPct(avg)} today. Worst mover at ${fmtPct(worstVal.change24h)}. Consider hedging exposure with commodities or reducing volatile positions.`,
        color: "#ef4444", Icon: ShieldAlert,
      });
    }
    if (topVal.change24h > 0.5 && worstVal.change24h < -0.5 && sorted.length > 3) {
      out.push({
        type: "ROTATION", title: "Sector Rotation Active", conf: 76,
        body: `Divergence detected across crypto assets. Selective positioning may outperform broad index exposure right now.`,
        color: ACCENT, Icon: Activity,
      });
    }
  } else {
    const top = [...cryptoCatalog].sort((a, b) => b.change24h - a.change24h)[0];
    out.push({
      type: "TREND", title: `${top.name} Leading Today`, conf: 61,
      body: `${top.ticker} is showing ${fmtPct(top.change24h)} movement. Market data is based on most recent available prices.`,
      color: "#22c55e", Icon: TrendingUp,
    });
  }

  if (sv.length > 0) {
    const sorted = [...sv].sort((a, b) => b[1].change1d - a[1].change1d);
    const [topTicker, topStock] = sorted[0];
    const avg = sorted.reduce((s, [, v]) => s + v.change1d, 0) / sorted.length;
    if (topStock.change1d > 1.5) {
      out.push({
        type: "MOMENTUM", title: `${topTicker} Outperforming`, conf: Math.min(84, 56 + topStock.change1d * 5),
        body: `${topTicker} is up ${fmtPct(topStock.change1d)} today. Equity basket average: ${fmtPct(avg)}. Tech/growth rotation may be underway.`,
        color: "#38bdf8", Icon: Zap,
      });
    }
  }

  if (grandTotal > 0) {
    const cPct = (cryptoTotal / grandTotal) * 100;
    const sPct = (stockTotal / grandTotal) * 100;
    if (cPct > 60) {
      out.push({
        type: "REBALANCE", title: "Concentration Risk", conf: 82,
        body: `Crypto is ${cPct.toFixed(0)}% of your portfolio. Target 40–50% for optimal risk-adjusted returns — consider shifting some into equities or commodities.`,
        color: "#f97316", Icon: Target,
      });
    } else if (sPct > 70) {
      out.push({
        type: "REBALANCE", title: "Equity Heavy", conf: 78,
        body: `Stocks represent ${sPct.toFixed(0)}% of your portfolio. Adding crypto or commodities could improve diversification and reduce correlated risk.`,
        color: "#f97316", Icon: Target,
      });
    }
  }

  return out.slice(0, 4);
}

function buildOpportunities(prices: LivePrices) {
  const liveList = cryptoCatalog.map(a => {
    const live = prices.crypto[a.coingeckoId];
    return { ...a, change24h: live ? live.change24h : a.change24h, price: live ? live.price : a.price };
  });
  return [...liveList].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
}

function buildScenarios(totals: { crypto: number; stocks: number; gold: number; cs2: number; pokemon: number; grand: number }) {
  const { crypto: cryptoTotal, stocks: stockTotal, gold: goldTotal, cs2: cs2Total, pokemon: pokemonTotal, grand: grandTotal } = totals;
  const base = grandTotal > 0 ? grandTotal : 12500;
  const safe = grandTotal > 0 ? grandTotal : 1;
  const cW = cryptoTotal / safe, sW = stockTotal / safe, gW = goldTotal / safe;
  const cs2W = cs2Total / safe, pkW = pokemonTotal / safe;

  return [
    {
      name: "BULL RUN", Icon: Flame, color: "#22c55e",
      desc: "BTC +40% · Stocks +20% · Gold +5%",
      pct: cW * 40 + sW * 20 + gW * 5,
      usd: base * (cW * 0.4 + sW * 0.2 + gW * 0.05),
    },
    {
      name: "BEAR MARKET", Icon: Snowflake, color: "#ef4444",
      desc: "Crypto −35% · Stocks −25% · Gold +12%",
      pct: cW * -35 + sW * -25 + gW * 12,
      usd: base * (cW * -0.35 + sW * -0.25 + gW * 0.12),
    },
    {
      name: "SAFE HAVEN", Icon: ShieldAlert, color: "#f5c542",
      desc: "Gold +25% · Crypto −12% · CS2 flat",
      pct: gW * 25 + cW * -12 + cs2W * 0 + pkW * 0,
      usd: base * (gW * 0.25 + cW * -0.12),
    },
  ];
}

export function VaultAI() {
  const prices = usePrices();
  const { portfolio } = useAuth();

  const cryptoTotal = useMemo(() => (portfolio?.cryptoAssets ?? []).reduce((s, a) => {
    const lp = prices.crypto[a.coingeckoId];
    return s + a.amount * (lp?.price ?? a.price);
  }, 0), [portfolio, prices.crypto]);

  const stockTotal = useMemo(() => (portfolio?.stockAssets ?? []).reduce((s, a) => {
    const lp = prices.stocks[a.ticker];
    return s + a.shares * (lp?.price ?? a.price);
  }, 0), [portfolio, prices.stocks]);

  const goldTotal = useMemo(() => {
    const spotPrices = { ...metalSpotPerGram, ...prices.metals };
    return (portfolio?.goldItems ?? []).reduce((s, g) => {
      const spot = spotPrices[g.metal] || metalSpotPerGram[g.metal] || 65.32;
      return s + g.quantity * g.weightGrams * spot;
    }, 0);
  }, [portfolio, prices.metals]);

  const cs2Total = useMemo(() =>
    (portfolio?.cs2Skins ?? []).reduce((s, sk) => s + sk.price, 0) +
    (portfolio?.cs2Cases ?? []).reduce((s, c) => s + c.quantity * c.price, 0),
    [portfolio]);

  const pokemonTotal = useMemo(() =>
    (portfolio?.pokemonCards ?? []).reduce((s, c) => s + c.value, 0) +
    (portfolio?.pokemonFigures ?? []).reduce((s, f) => s + f.value, 0),
    [portfolio]);

  const grandTotal = cryptoTotal + stockTotal + goldTotal + cs2Total + pokemonTotal;
  const isEmpty = grandTotal === 0;

  const totals = useMemo(
    () => ({ crypto: cryptoTotal, stocks: stockTotal, gold: goldTotal, cs2: cs2Total, pokemon: pokemonTotal, grand: grandTotal }),
    [cryptoTotal, stockTotal, goldTotal, cs2Total, pokemonTotal, grandTotal]
  );

  const safe = grandTotal > 0 ? grandTotal : 1;
  const allocs = [
    { label: "Crypto",      value: cryptoTotal,  color: "#22d3ee", pct: (cryptoTotal / safe) * 100,  target: 40 },
    { label: "Stocks",      value: stockTotal,   color: "#38bdf8", pct: (stockTotal / safe) * 100,   target: 30 },
    { label: "CS2",         value: cs2Total,     color: "#f97316", pct: (cs2Total / safe) * 100,     target: 10 },
    { label: "Commodities", value: goldTotal,    color: "#f5c542", pct: (goldTotal / safe) * 100,    target: 15 },
    { label: "Pokémon",     value: pokemonTotal, color: "#facc15", pct: (pokemonTotal / safe) * 100, target: 5  },
  ];

  const pulse = useMemo(() => computePulse(prices), [prices]);
  const insights = useMemo(() => buildInsights(prices, totals), [prices, totals]);
  const opportunities = useMemo(() => buildOpportunities(prices), [prices]);
  const scenarios = useMemo(() => buildScenarios(totals), [totals]);

  const riskScore = Math.round(60 + (pulse.avgC < 0 ? Math.min(20, Math.abs(pulse.avgC) * 4) : -Math.min(10, pulse.avgC * 2)));
  const momentumScore = Math.round(Math.max(10, Math.min(95, 50 + pulse.avgC * 6)));
  const diversScore = isEmpty ? 0 : Math.round((allocs.filter(a => a.pct > 5).length / allocs.length) * 100);

  return (
    <section style={{ paddingBottom: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: 4 }}>
            <div style={{ width: 3, height: 20, borderRadius: 2, background: ACCENT }} />
            <h2 style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.75rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.15em" }}>
              AI INTELLIGENCE
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "1rem" }}>
            {prices.isLoading ? (
              <RefreshCw size={9} color="rgba(224,224,224,0.3)" style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Radio size={9} color="#22c55e" />
            )}
            <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.3)" }}>
              {prices.isLoading ? "FETCHING LIVE DATA…" : `LIVE · ${prices.lastUpdated ? prices.lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "CONNECTED"}`}
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em", marginBottom: 4 }}>
            PORTFOLIO TOTAL
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "1.3rem", fontWeight: 700, color: ACCENT }}>
            {fmt$(grandTotal)}
          </div>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {isEmpty && (
          <motion.div variants={fadeUp} style={{
            display: "flex", gap: "0.75rem", alignItems: "center",
            padding: "1rem 1.25rem",
            background: "rgba(167,139,250,0.05)",
            border: "1px solid rgba(167,139,250,0.15)",
            borderRadius: 8,
          }}>
            <BarChart2 size={14} color={ACCENT} style={{ flexShrink: 0 }} />
            <p style={{ fontFamily: "monospace", fontSize: "0.63rem", color: "rgba(224,224,224,0.45)", lineHeight: 1.6, margin: 0 }}>
              Add assets to your portfolio to unlock personalized analysis. Market intelligence below uses live catalog data.
            </p>
          </motion.div>
        )}

        {/* Market Pulse */}
        <motion.div variants={fadeUp} style={{ background: "linear-gradient(145deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.5rem" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>MARKET PULSE</div>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
              <PulseGauge score={pulse.score} color={pulse.color} label={pulse.label} />
            </div>
            <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {[
                { label: "CRYPTO TREND", val: pulse.avgC, color: "#22d3ee" },
                { label: "EQUITY TREND", val: pulse.avgS, color: "#38bdf8" },
                { label: "MARKET SCORE", val: ((pulse.score - 50) / 50) * 5, color: pulse.color },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.57rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.08em" }}>{row.label}</span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.62rem", fontWeight: 700, color: row.val >= 0 ? "#22c55e" : "#ef4444" }}>{fmtPct(row.val)}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.abs((row.val / 5) * 100))}%` }}
                      transition={{ duration: 0.9, ease: EASE }}
                      style={{ height: "100%", background: row.val >= 0 ? "#22c55e" : "#ef4444", borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Portfolio Health */}
        <motion.div variants={fadeUp} style={{ background: "linear-gradient(145deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.5rem" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>PORTFOLIO HEALTH</div>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            <ScoreRing score={riskScore} color="#ef4444" label="RISK" />
            <ScoreRing score={diversScore} color={ACCENT} label="DIVERSIF." />
            <ScoreRing score={momentumScore} color="#22c55e" label="MOMENTUM" />
          </div>
          <div style={{ marginTop: "1.25rem", padding: "0.75rem", background: "rgba(167,139,250,0.06)", borderRadius: 6, border: "1px solid rgba(167,139,250,0.12)" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <ShieldAlert size={13} color={ACCENT} style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ fontFamily: "monospace", fontSize: "0.63rem", color: "rgba(224,224,224,0.55)", lineHeight: 1.6, margin: 0 }}>
                {isEmpty
                  ? "Build your portfolio to receive a personalized health analysis and score breakdown."
                  : `Risk score ${riskScore}/100 — ${riskScore > 65 ? "portfolio skews volatile. Consider defensive diversification." : "risk profile is balanced. Maintain current distribution."}`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={fadeUp} style={{ background: "linear-gradient(145deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.5rem" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>AI INSIGHT FEED</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {insights.length === 0 ? (
              <p style={{ fontFamily: "monospace", fontSize: "0.63rem", color: "rgba(224,224,224,0.3)", margin: 0 }}>Fetching market signals…</p>
            ) : insights.map((ins, i) => {
              const Icon = ins.Icon;
              return (
                <div key={i} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", padding: "0.9rem 1rem", background: `${ins.color}08`, border: `1px solid ${ins.color}1f`, borderRadius: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: `${ins.color}14`, border: `1px solid ${ins.color}2a`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={12} color={ins.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: "0.5rem" }}>
                      <span style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.6rem", fontWeight: 700, color: ins.color, letterSpacing: "0.1em" }}>{ins.type} · {ins.title}</span>
                      <span style={{ fontFamily: "monospace", fontSize: "0.55rem", flexShrink: 0, padding: "1px 6px", borderRadius: 3, background: `${ins.color}18`, color: ins.color }}>{Math.round(ins.conf)}% confidence</span>
                    </div>
                    <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.5)", lineHeight: 1.65, margin: 0 }}>{ins.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Opportunity Scanner */}
        <motion.div variants={fadeUp} style={{ background: "linear-gradient(145deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.5rem", position: "relative", overflow: "hidden" }}>
          <motion.div animate={{ top: ["10%", "90%", "10%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}30, transparent)`, pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.12em" }}>OPPORTUNITY SCANNER</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Eye size={9} color={ACCENT} />
              <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(167,139,250,0.5)" }}>TOP MOVERS</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {opportunities.map((opp, i) => {
              const isUp = opp.change24h >= 0;
              const barW = Math.min(100, Math.abs(opp.change24h) * 12);
              return (
                <div key={opp.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", background: isUp ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)", border: `1px solid ${isUp ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"}`, borderRadius: 6 }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.2)", width: 14, textAlign: "right" }}>{i + 1}</span>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: opp.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.6rem", fontWeight: 700, color: opp.color, letterSpacing: "0.08em", width: 42 }}>{opp.ticker}</span>
                  <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${barW}%` }} transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                      style={{ height: "100%", background: isUp ? "#22c55e" : "#ef4444", borderRadius: 2 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, width: 56, justifyContent: "flex-end" }}>
                    {isUp ? <ArrowUpRight size={10} color="#22c55e" /> : <ArrowDownRight size={10} color="#ef4444" />}
                    <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 700, color: isUp ? "#22c55e" : "#ef4444" }}>{fmtPct(opp.change24h)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Scenario Simulator */}
        <motion.div variants={fadeUp} style={{ background: "linear-gradient(145deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.12em" }}>SCENARIO SIMULATOR</div>
            {isEmpty && <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.25)" }}>based on $12,500 model</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {scenarios.map((sc) => {
              const Icon = sc.Icon;
              const isPos = sc.pct >= 0;
              return (
                <div key={sc.name} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.85rem 1rem", background: `${sc.color}07`, border: `1px solid ${sc.color}1a`, borderRadius: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, flexShrink: 0, background: `${sc.color}12`, border: `1px solid ${sc.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={13} color={sc.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.6rem", fontWeight: 700, color: sc.color, letterSpacing: "0.08em", marginBottom: 3 }}>{sc.name}</div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)" }}>{sc.desc}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700, color: isPos ? "#22c55e" : "#ef4444" }}>{isPos ? "+" : ""}{sc.pct.toFixed(1)}%</div>
                    <div style={{ fontFamily: "monospace", fontSize: "0.57rem", color: "rgba(224,224,224,0.3)" }}>{isPos ? "+" : ""}{fmt$(sc.usd)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Allocation Breakdown */}
        <motion.div variants={fadeUp} style={{ background: "linear-gradient(145deg, #141414, #0f0f0f)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.5rem" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>ALLOCATION vs TARGET</div>
          <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2, marginBottom: "1.25rem" }}>
            {allocs.map(a => (
              <motion.div key={a.label} initial={{ width: 0 }} animate={{ width: `${a.pct || (100 / allocs.length)}%` }}
                transition={{ duration: 0.8, ease: EASE }}
                style={{ background: a.color, borderRadius: 4, opacity: a.pct === 0 ? 0.15 : 1 }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {allocs.map(a => {
              const delta = a.pct - a.target;
              return (
                <div key={a.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.45)", width: 90 }}>{a.label}</span>
                  <div style={{ flex: 1, display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <div style={{ height: 3, flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${a.pct || 0}%`, background: a.color, borderRadius: 2 }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: a.color, fontWeight: 700, width: 36, textAlign: "right" }}>{a.pct.toFixed(1)}%</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.57rem", width: 30, textAlign: "right", color: Math.abs(delta) < 3 ? "rgba(224,224,224,0.2)" : delta > 0 ? "#f97316" : "#22c55e" }}>
                    {delta === 0 ? "—" : `${delta > 0 ? "+" : ""}${delta.toFixed(0)}%`}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.18)", width: 24 }}>/{a.target}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", padding: "0 0.25rem" }}>
          <AlertTriangle size={11} color="rgba(224,224,224,0.18)" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.18)", lineHeight: 1.65, margin: 0 }}>
            AI signals are generated from live market data and your portfolio composition. Scenarios are projections only. Not financial advice.
          </p>
        </motion.div>

      </motion.div>
    </section>
  );
}
