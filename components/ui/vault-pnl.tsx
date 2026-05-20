"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { usePrices } from "@/lib/price-context";
import { metalSpotPerGram } from "@/lib/mock-data";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);
const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

type SortKey = "value" | "pnl" | "pnlPct" | "change1d";

type Row = {
  id: string;
  name: string;
  ticker: string;
  category: string;
  color: string;
  qty: number;
  costBasis: number | null;
  currentValue: number;
  pnl: number | null;
  pnlPct: number | null;
  change1d: number | null;
};

export function VaultPnL() {
  const { portfolio } = useAuth();
  const { crypto: liveCrypto, stocks: liveStocks, metals: liveMetals } = usePrices();
  const [sort, setSort] = useState<SortKey>("value");
  const spotPrices = { ...metalSpotPerGram, ...liveMetals };

  const rows = useMemo<Row[]>(() => {
    const result: Row[] = [];

    for (const a of portfolio?.cryptoAssets ?? []) {
      if (a.amount <= 0) continue;
      const lp = liveCrypto[a.coingeckoId];
      const currentPrice = lp?.price ?? a.price;
      const costBasis = a.price * a.amount;
      const currentValue = currentPrice * a.amount;
      result.push({
        id: a.id, name: a.name, ticker: a.ticker, category: "CRYPTO", color: a.color,
        qty: a.amount, costBasis, currentValue,
        pnl: currentValue - costBasis,
        pnlPct: costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0,
        change1d: lp?.change24h ?? a.change24h ?? null,
      });
    }

    for (const a of portfolio?.stockAssets ?? []) {
      if (a.shares <= 0) continue;
      const lp = liveStocks[a.ticker];
      const currentPrice = lp?.price ?? a.price;
      const costBasis = a.price * a.shares;
      const currentValue = currentPrice * a.shares;
      result.push({
        id: a.id, name: a.name, ticker: a.ticker, category: "STOCK", color: a.color,
        qty: a.shares, costBasis, currentValue,
        pnl: currentValue - costBasis,
        pnlPct: costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0,
        change1d: lp?.change1d ?? a.change1d ?? null,
      });
    }

    for (const g of portfolio?.goldItems ?? []) {
      if (g.quantity <= 0) continue;
      const spot = spotPrices[g.metal] || 65.32;
      const currentValue = g.quantity * g.weightGrams * spot;
      result.push({
        id: g.id, name: g.name, ticker: g.metal.toUpperCase(), category: "COMMODITY", color: "#f5c542",
        qty: g.quantity, costBasis: null, currentValue, pnl: null, pnlPct: null, change1d: null,
      });
    }

    for (const sk of portfolio?.cs2Skins ?? []) {
      result.push({
        id: sk.id, name: `${sk.weaponName} | ${sk.skinName}`, ticker: sk.wear, category: "CS2", color: "#a78bfa",
        qty: 1, costBasis: null, currentValue: sk.price, pnl: null, pnlPct: null, change1d: null,
      });
    }
    for (const c of portfolio?.cs2Cases ?? []) {
      if (c.quantity <= 0) continue;
      result.push({
        id: c.id, name: c.name, ticker: "CASE", category: "CS2", color: "#a78bfa",
        qty: c.quantity, costBasis: null, currentValue: c.quantity * c.price, pnl: null, pnlPct: null, change1d: null,
      });
    }

    for (const c of portfolio?.pokemonCards ?? []) {
      result.push({
        id: c.id, name: c.name, ticker: c.rarity.toUpperCase(), category: "POKÉMON", color: "#facc15",
        qty: 1, costBasis: null, currentValue: c.value, pnl: null, pnlPct: null, change1d: null,
      });
    }
    for (const f of portfolio?.pokemonFigures ?? []) {
      result.push({
        id: f.id, name: f.name, ticker: "FIGURE", category: "POKÉMON", color: "#facc15",
        qty: 1, costBasis: null, currentValue: f.value, pnl: null, pnlPct: null, change1d: null,
      });
    }

    return result.sort((a, b) => {
      if (sort === "pnl") return (b.pnl ?? 0) - (a.pnl ?? 0);
      if (sort === "pnlPct") return (b.pnlPct ?? 0) - (a.pnlPct ?? 0);
      if (sort === "change1d") return (b.change1d ?? 0) - (a.change1d ?? 0);
      return b.currentValue - a.currentValue;
    });
  }, [portfolio, liveCrypto, liveStocks, spotPrices, sort]);

  const totalCurrentValue = rows.reduce((s, r) => s + r.currentValue, 0);
  const tracked = rows.filter(r => r.costBasis !== null);
  const totalCostBasis = tracked.reduce((s, r) => s + (r.costBasis ?? 0), 0);
  const totalPnL = tracked.reduce((s, r) => s + (r.pnl ?? 0), 0);
  const totalPnLPct = totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;
  const today1d = rows.reduce((s, r) => s + (r.change1d !== null ? r.currentValue * (r.change1d / 100) : 0), 0);

  const isEmpty = rows.length === 0;

  if (isEmpty) {
    return (
      <div style={{ paddingBottom: "4rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.18em", marginBottom: 6 }}>PERFORMANCE</div>
          <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "1.1rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.08em" }}>P&L</div>
        </div>
        <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 12 }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.14em", lineHeight: 2 }}>
            ADD ASSETS TO YOUR PORTFOLIO<br />TO TRACK PERFORMANCE
          </div>
        </div>
      </div>
    );
  }

  const pnlColor = totalPnL >= 0 ? "#22c55e" : "#ef4444";
  const todayColor = today1d >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div style={{ paddingBottom: "4rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.18em", marginBottom: 6 }}>PERFORMANCE</div>
          <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "1.1rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.08em" }}>P&L</div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          {
            label: "UNREALIZED P&L",
            value: tracked.length > 0 ? (
              <span style={{ color: pnlColor }}>
                {totalPnL >= 0 ? "+" : ""}{fmt(totalPnL)}
              </span>
            ) : <span style={{ color: "rgba(224,224,224,0.3)" }}>—</span>,
            sub: tracked.length > 0 ? (
              <span style={{ color: pnlColor, fontFamily: "monospace", fontSize: "0.62rem" }}>
                {totalPnLPct >= 0 ? "+" : ""}{totalPnLPct.toFixed(2)}%
              </span>
            ) : null,
          },
          {
            label: "TOTAL INVESTED",
            value: <span style={{ color: "#e0e0e0" }}>{totalCostBasis > 0 ? fmtShort(totalCostBasis) : "—"}</span>,
            sub: <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.3)" }}>{tracked.length} tracked</span>,
          },
          {
            label: "CURRENT VALUE",
            value: <span style={{ color: "#e0e0e0" }}>{fmtShort(totalCurrentValue)}</span>,
            sub: <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.3)" }}>{rows.length} assets</span>,
          },
          {
            label: "TODAY",
            value: <span style={{ color: todayColor }}>{today1d >= 0 ? "+" : ""}{fmt(today1d)}</span>,
            sub: null,
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 28 }}
            style={{
              padding: "1.1rem 1.25rem",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.14em", marginBottom: 8 }}>
              {card.label}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
              {card.value}
            </div>
            {card.sub && <div>{card.sub}</div>}
          </motion.div>
        ))}
      </div>

      {/* Sort controls */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1rem", flexWrap: "wrap" }}>
        {([["value", "BY VALUE"], ["pnl", "BY P&L $"], ["pnlPct", "BY P&L %"], ["change1d", "BY TODAY"]] as [SortKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            style={{
              padding: "0.3rem 0.75rem",
              fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: "0.08em",
              background: sort === key ? "rgba(224,224,224,0.08)" : "transparent",
              border: sort === key ? "1px solid rgba(224,224,224,0.2)" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 4,
              color: sort === key ? "rgba(224,224,224,0.9)" : "rgba(224,224,224,0.3)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
          padding: "0.6rem 1.25rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}>
          {["ASSET", "INVESTED", "VALUE", "P&L", "RETURN", "24H"].map(h => (
            <div key={h} style={{ fontFamily: "monospace", fontSize: "0.5rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.12em", textAlign: h === "ASSET" ? "left" : "right" }}>
              {h}
            </div>
          ))}
        </div>

        {rows.map((row, i) => {
          const gain = (row.pnl ?? 0) > 0;
          const loss = (row.pnl ?? 0) < 0;
          const rowPnLColor = gain ? "#22c55e" : loss ? "#ef4444" : "rgba(224,224,224,0.4)";
          const c1dPos = (row.change1d ?? 0) >= 0;

          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                padding: "0.75rem 1.25rem",
                borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                alignItems: "center",
              }}
            >
              {/* Asset */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: `${row.color}18`, border: `1px solid ${row.color}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "monospace", fontSize: "0.5rem", fontWeight: 700, color: row.color,
                }}>
                  {row.ticker.slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.58rem", fontWeight: 700, color: "#e0e0e0" }}>
                    {row.ticker}
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.3)", marginTop: 1 }}>
                    <span style={{
                      padding: "1px 4px", borderRadius: 2,
                      background: `${row.color}15`, color: row.color,
                      fontSize: "0.46rem", letterSpacing: "0.08em",
                    }}>{row.category}</span>
                  </div>
                </div>
              </div>

              {/* Invested */}
              <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(224,224,224,0.5)" }}>
                {row.costBasis !== null ? fmt(row.costBasis) : <span style={{ color: "rgba(224,224,224,0.2)" }}>—</span>}
              </div>

              {/* Current value */}
              <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.68rem", fontWeight: 700, color: "#e0e0e0" }}>
                {fmt(row.currentValue)}
              </div>

              {/* P&L $ */}
              <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 700, color: rowPnLColor }}>
                {row.pnl !== null
                  ? <>{row.pnl >= 0 ? "+" : ""}{fmt(row.pnl)}</>
                  : <span style={{ color: "rgba(224,224,224,0.2)" }}>—</span>}
              </div>

              {/* P&L % */}
              <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.65rem", color: rowPnLColor, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                {row.pnlPct !== null ? (
                  <>
                    {gain ? <TrendingUp size={10} /> : loss ? <TrendingDown size={10} /> : <Minus size={10} />}
                    {row.pnlPct >= 0 ? "+" : ""}{row.pnlPct.toFixed(2)}%
                  </>
                ) : <span style={{ color: "rgba(224,224,224,0.2)" }}>—</span>}
              </div>

              {/* 24h */}
              <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: "0.62rem", color: row.change1d !== null ? (c1dPos ? "#22c55e" : "#ef4444") : "rgba(224,224,224,0.2)" }}>
                {row.change1d !== null
                  ? <>{c1dPos ? "+" : ""}{row.change1d.toFixed(2)}%</>
                  : "—"}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ marginTop: "1rem", fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.18)", letterSpacing: "0.1em", textAlign: "center" }}>
        P&L BASED ON PRICE AT TIME OF PURCHASE · UNREALIZED ONLY
      </div>
    </div>
  );
}
