"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Plus, Check, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { CryptoAsset, StockAsset } from "@/lib/mock-data";

type LookupResult = {
  id: string;
  name: string;
  symbol: string;
  category: "crypto" | "stock";
  coingeckoId?: string;
  ticker?: string;
  price: number | null;
  change1d: number | null;
};

const ACCENT = "#60a5fa";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

interface VaultFindModalProps {
  open: boolean;
  onClose: () => void;
}

export function VaultFindModal({ open, onClose }: VaultFindModalProps) {
  const { portfolio, updatePortfolio } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ crypto: LookupResult[]; stocks: LookupResult[] }>({ crypto: [], stocks: [] });
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [added, setAdded] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) {
      setQuery(""); setResults({ crypto: [], stocks: [] }); setExpanded(null); setAdded(null);
      setTimeout(() => searchRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults({ crypto: [], stocks: [] }); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/lookup?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults({ crypto: [], stocks: [] });
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [query]);

  function handleAdd(item: LookupResult) {
    const raw = quantities[item.id] ?? "0";
    const qty = parseFloat(raw);
    if (isNaN(qty) || qty < 0) return;

    if (item.category === "crypto") {
      const cryptoAssets = portfolio?.cryptoAssets ?? [];
      const existing = cryptoAssets.find(a => a.id === item.id);
      const asset: CryptoAsset = {
        id: item.id,
        name: item.name,
        ticker: item.symbol,
        amount: (existing?.amount ?? 0) + qty,
        price: item.price ?? existing?.price ?? 0,
        change24h: item.change1d ?? 0,
        sparkline: existing?.sparkline ?? [],
        color: existing?.color ?? "#60a5fa",
        coingeckoId: item.coingeckoId ?? item.id,
      };
      const updated = existing
        ? cryptoAssets.map(a => a.id === item.id ? asset : a)
        : [...cryptoAssets, asset];
      updatePortfolio({ ...portfolio!, cryptoAssets: updated });
    } else {
      const stockAssets = portfolio?.stockAssets ?? [];
      const existing = stockAssets.find(a => a.id === item.id);
      const asset: StockAsset = {
        id: item.id,
        name: item.name,
        ticker: item.symbol,
        shares: (existing?.shares ?? 0) + qty,
        price: item.price ?? existing?.price ?? 0,
        change1d: item.change1d ?? 0,
        sparkline: existing?.sparkline ?? [],
        color: existing?.color ?? "#60a5fa",
        sector: "Other",
      };
      const updated = existing
        ? stockAssets.map(a => a.id === item.id ? asset : a)
        : [...stockAssets, asset];
      updatePortfolio({ ...portfolio!, stockAssets: updated });
    }

    setAdded(item.id);
    setTimeout(() => {
      setAdded(null);
      setExpanded(null);
      setQuantities(prev => { const n = { ...prev }; delete n[item.id]; return n; });
      onClose();
    }, 1000);
  }

  const allResults = [...results.crypto, ...results.stocks];

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="find-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 400,
            background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0e0e0e",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 14,
              width: "100%", maxWidth: 540,
              maxHeight: "88vh",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "1.25rem 1.5rem 1rem",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.14em", marginBottom: 4 }}>
                  ASSET DISCOVERY
                </div>
                <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.8rem", fontWeight: 700, color: ACCENT, letterSpacing: "0.08em" }}>
                  FIND
                </div>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                <X size={16} color="rgba(224,224,224,0.4)" />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: "0.85rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
              <Search size={12} color="rgba(224,224,224,0.3)" style={{ position: "absolute", left: "calc(1.5rem + 10px)", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input
                ref={searchRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setExpanded(null); }}
                placeholder="SEARCH ANY CRYPTO OR STOCK..."
                style={{
                  width: "100%", padding: "0.5rem 1rem 0.5rem 2.2rem",
                  fontFamily: "monospace", fontSize: "0.63rem", letterSpacing: "0.08em",
                  background: "rgba(255,255,255,0.04)", border: `1px solid ${ACCENT}30`,
                  borderRadius: 6, color: "rgba(224,224,224,0.85)", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = `${ACCENT}60`; }}
                onBlur={e => { e.target.style.borderColor = `${ACCENT}30`; }}
              />
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
              {!query.trim() && (
                <div style={{ padding: "2.5rem 1.5rem", textAlign: "center", fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.12em", lineHeight: 2 }}>
                  TYPE TO SEARCH ANY ASSET<br />NOT LISTED IN THE MAIN TABS
                </div>
              )}

              {loading && (
                <div style={{ padding: "2rem", textAlign: "center", fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.12em" }}>
                  SEARCHING...
                </div>
              )}

              {!loading && query && allResults.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.25)" }}>
                  NO RESULTS
                </div>
              )}

              {!loading && results.crypto.length > 0 && (
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: "0.5rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.18em", padding: "0.5rem 1.5rem 0.3rem" }}>
                    CRYPTO
                  </div>
                  {results.crypto.map(item => <ResultRow key={item.id} item={item} expanded={expanded} setExpanded={setExpanded} quantities={quantities} setQuantities={setQuantities} added={added} onAdd={handleAdd} />)}
                </div>
              )}

              {!loading && results.stocks.length > 0 && (
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: "0.5rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.18em", padding: "0.5rem 1.5rem 0.3rem" }}>
                    STOCKS
                  </div>
                  {results.stocks.map(item => <ResultRow key={item.id} item={item} expanded={expanded} setExpanded={setExpanded} quantities={quantities} setQuantities={setQuantities} added={added} onAdd={handleAdd} />)}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}

function ResultRow({
  item, expanded, setExpanded, quantities, setQuantities, added, onAdd,
}: {
  item: LookupResult;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  quantities: Record<string, string>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  added: string | null;
  onAdd: (item: LookupResult) => void;
}) {
  const isExpanded = expanded === item.id;
  const isAdded = added === item.id;
  const positive = (item.change1d ?? 0) >= 0;

  return (
    <div>
      <div
        onClick={() => setExpanded(isExpanded ? null : item.id)}
        style={{
          display: "flex", alignItems: "center", gap: "0.85rem",
          padding: "0.7rem 1.5rem",
          cursor: "pointer",
          background: isExpanded ? `${ACCENT}08` : "transparent",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
        onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "monospace", fontSize: "0.56rem", fontWeight: 700, color: ACCENT,
        }}>
          {item.symbol.slice(0, 2)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.6rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.08em" }}>
              {item.symbol}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.57rem", color: "rgba(224,224,224,0.35)" }}>
              {item.name}
            </span>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.25)", marginTop: 2, letterSpacing: "0.08em" }}>
            {item.category.toUpperCase()}
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {item.price !== null ? (
            <>
              <div style={{ fontFamily: "monospace", fontSize: "0.68rem", fontWeight: 700, color: "#e0e0e0" }}>
                {fmt(item.price)}
              </div>
              {item.change1d !== null && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 2 }}>
                  {positive ? <TrendingUp size={9} color="#22c55e" /> : <TrendingDown size={9} color="#ef4444" />}
                  <span style={{ fontFamily: "monospace", fontSize: "0.52rem", color: positive ? "#22c55e" : "#ef4444" }}>
                    {positive ? "+" : ""}{item.change1d.toFixed(2)}%
                  </span>
                </div>
              )}
            </>
          ) : (
            <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.2)" }}>—</span>
          )}
        </div>

        <div style={{
          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
          background: isExpanded ? `${ACCENT}25` : "rgba(255,255,255,0.05)",
          border: `1px solid ${isExpanded ? `${ACCENT}50` : "rgba(255,255,255,0.1)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}>
          <Plus size={10} color={isExpanded ? ACCENT : "rgba(224,224,224,0.4)"} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.6rem 1.5rem 0.85rem calc(1.5rem + 32px + 0.85rem)",
              background: `${ACCENT}05`,
              borderBottom: `1px solid ${ACCENT}15`,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.57rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.1em", flexShrink: 0 }}>
                {item.category === "stock" ? "SHARES" : "AMOUNT"}
              </div>
              <input
                type="number"
                min={0}
                step={item.category === "stock" ? 1 : 0.0001}
                value={quantities[item.id] ?? "0"}
                onChange={e => setQuantities(prev => ({ ...prev, [item.id]: e.target.value }))}
                onClick={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
                style={{
                  width: 100, padding: "0.35rem 0.6rem",
                  fontFamily: "monospace", fontSize: "0.72rem", fontWeight: 700,
                  background: "rgba(255,255,255,0.05)", border: `1px solid ${ACCENT}40`,
                  borderRadius: 4, color: "#e0e0e0", outline: "none",
                  textAlign: "right",
                  MozAppearance: "textfield",
                } as React.CSSProperties}
              />
              <motion.button
                onClick={e => { e.stopPropagation(); onAdd(item); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.35rem 1rem",
                  fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.08em",
                  background: isAdded ? "rgba(34,197,94,0.15)" : `${ACCENT}20`,
                  border: `1px solid ${isAdded ? "rgba(34,197,94,0.4)" : `${ACCENT}50`}`,
                  borderRadius: 4,
                  color: isAdded ? "#22c55e" : ACCENT,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {isAdded ? <><Check size={11} /> ADDED</> : <><Plus size={11} /> ADD</>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
