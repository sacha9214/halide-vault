"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Check, X, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cryptoCatalog, stockCatalog, type CryptoAsset, type StockAsset } from "@/lib/mock-data";

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

type FindAsset = {
  id: string;
  name: string;
  symbol: string;
  category: "crypto" | "stock";
  amount: number;
  price: number;
  change1d?: number;
};

const ACCENT = "#60a5fa";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const cryptoCatalogIds = new Set(cryptoCatalog.map(a => a.id));
const stockCatalogIds = new Set(stockCatalog.map(a => a.id));

export function VaultFind() {
  const { portfolio, updatePortfolio } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ crypto: LookupResult[]; stocks: LookupResult[] }>({ crypto: [], stocks: [] });
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [added, setAdded] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Assets added via FIND = those not in the static catalogs
  const findCryptos: FindAsset[] = (portfolio?.cryptoAssets ?? [])
    .filter(a => !cryptoCatalogIds.has(a.id))
    .map(a => ({ id: a.id, name: a.name, symbol: a.ticker, category: "crypto", amount: a.amount, price: a.price, change1d: a.change24h }));

  const findStocks: FindAsset[] = (portfolio?.stockAssets ?? [])
    .filter(a => !stockCatalogIds.has(a.id))
    .map(a => ({ id: a.id, name: a.name, symbol: a.ticker, category: "stock", amount: a.shares, price: a.price, change1d: a.change1d }));

  const findAssets = [...findCryptos, ...findStocks];
  const findTotal = findAssets.reduce((s, a) => s + a.amount * a.price, 0);

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
    }, 420);
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
    }, 1000);
  }

  function handleRemove(asset: FindAsset) {
    if (asset.category === "crypto") {
      updatePortfolio({ ...portfolio!, cryptoAssets: (portfolio?.cryptoAssets ?? []).filter(a => a.id !== asset.id) });
    } else {
      updatePortfolio({ ...portfolio!, stockAssets: (portfolio?.stockAssets ?? []).filter(a => a.id !== asset.id) });
    }
  }

  const allResults = [...results.crypto, ...results.stocks];
  const hasResults = allResults.length > 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.18em", marginBottom: 6 }}>
            ASSET DISCOVERY
          </div>
          <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "1.1rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.08em" }}>
            FIND
          </div>
        </div>
        {findAssets.length > 0 && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.14em", marginBottom: 4 }}>
              CUSTOM TOTAL
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 700, color: ACCENT }}>
              {fmtShort(findTotal)}
            </div>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: "2rem" }}>
        <Search
          size={14}
          color="rgba(224,224,224,0.3)"
          style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="SEARCH ANY CRYPTO OR STOCK..."
          autoFocus
          style={{
            width: "100%",
            padding: "0.85rem 3rem 0.85rem 2.8rem",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${query ? `${ACCENT}50` : "rgba(255,255,255,0.09)"}`,
            borderRadius: 8,
            color: "rgba(224,224,224,0.9)",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={e => { e.target.style.borderColor = `${ACCENT}60`; }}
          onBlur={e => { e.target.style.borderColor = query ? `${ACCENT}50` : "rgba(255,255,255,0.09)"; }}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults({ crypto: [], stocks: [] }); }}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
          >
            <X size={13} color="rgba(224,224,224,0.35)" />
          </button>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.14em" }}>
          SEARCHING...
        </div>
      )}

      {!loading && query && !hasResults && (
        <div style={{ textAlign: "center", padding: "2rem", fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.14em" }}>
          NO RESULTS FOR &ldquo;{query.toUpperCase()}&rdquo;
        </div>
      )}

      {!loading && hasResults && (
        <div style={{ marginBottom: "3rem" }}>
          {results.crypto.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.28)", letterSpacing: "0.18em", marginBottom: "0.65rem", paddingLeft: 2 }}>
                CRYPTO
              </div>
              <ResultsList items={results.crypto} expanded={expanded} setExpanded={setExpanded} quantities={quantities} setQuantities={setQuantities} added={added} onAdd={handleAdd} />
            </div>
          )}
          {results.stocks.length > 0 && (
            <div>
              <div style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.28)", letterSpacing: "0.18em", marginBottom: "0.65rem", paddingLeft: 2 }}>
                STOCKS
              </div>
              <ResultsList items={results.stocks} expanded={expanded} setExpanded={setExpanded} quantities={quantities} setQuantities={setQuantities} added={added} onAdd={handleAdd} />
            </div>
          )}
        </div>
      )}

      {!query && findAssets.length === 0 && (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          border: "1px dashed rgba(255,255,255,0.07)",
          borderRadius: 12,
          marginBottom: "2rem",
        }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.14em", lineHeight: 2 }}>
            SEARCH FOR ANY CRYPTO OR STOCK<br />
            NOT LISTED IN THE OTHER TABS<br />
            AND ADD IT TO YOUR PORTFOLIO
          </div>
        </div>
      )}

      {findAssets.length > 0 && (
        <div>
          <div style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.28)", letterSpacing: "0.18em", marginBottom: "0.75rem" }}>
            IN YOUR PORTFOLIO
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
            {findAssets.map((asset, i) => (
              <div
                key={asset.id}
                style={{
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  padding: "0.85rem 1.25rem",
                  borderBottom: i < findAssets.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                  background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "monospace", fontSize: "0.56rem", fontWeight: 700, color: ACCENT,
                }}>
                  {asset.symbol.slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.6rem", fontWeight: 700, color: "#e0e0e0" }}>
                      {asset.symbol}
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: "0.57rem", color: "rgba(224,224,224,0.35)" }}>
                      {asset.name}
                    </span>
                    <span style={{
                      fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: "0.1em",
                      padding: "1px 5px", borderRadius: 3,
                      background: asset.category === "crypto" ? "rgba(251,191,36,0.1)" : "rgba(34,197,94,0.1)",
                      color: asset.category === "crypto" ? "#fbbf24" : "#22c55e",
                      border: `1px solid ${asset.category === "crypto" ? "rgba(251,191,36,0.2)" : "rgba(34,197,94,0.2)"}`,
                    }}>
                      {asset.category.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "0.56rem", color: "rgba(224,224,224,0.3)", marginTop: 2 }}>
                    {asset.amount === 0
                      ? <span style={{ color: "#60a5fa", fontSize: "0.5rem", letterSpacing: "0.1em" }}>WATCHING · {fmt(asset.price)}</span>
                      : `${asset.amount} ${asset.category === "stock" ? "shares" : "units"} · ${fmt(asset.price)} each`}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "monospace", fontSize: "0.72rem", fontWeight: 700, color: "#e0e0e0" }}>
                    {fmt(asset.amount * asset.price)}
                  </div>
                  {asset.change1d !== undefined && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 2 }}>
                      {(asset.change1d ?? 0) >= 0 ? <TrendingUp size={10} color="#22c55e" /> : <TrendingDown size={10} color="#ef4444" />}
                      <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: (asset.change1d ?? 0) >= 0 ? "#22c55e" : "#ef4444" }}>
                        {(asset.change1d ?? 0) >= 0 ? "+" : ""}{(asset.change1d ?? 0).toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(asset)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexShrink: 0, opacity: 0.4, transition: "opacity 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}
                >
                  <X size={13} color="rgba(224,224,224,0.6)" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsList({
  items, expanded, setExpanded, quantities, setQuantities, added, onAdd,
}: {
  items: LookupResult[];
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  quantities: Record<string, string>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  added: string | null;
  onAdd: (item: LookupResult) => void;
}) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
      {items.map((item, i) => {
        const isExpanded = expanded === item.id;
        const isAdded = added === item.id;
        const positive = (item.change1d ?? 0) >= 0;
        return (
          <div key={item.id} style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div
              onClick={() => setExpanded(isExpanded ? null : item.id)}
              style={{
                display: "flex", alignItems: "center", gap: "0.85rem",
                padding: "0.75rem 1.25rem",
                cursor: "pointer",
                background: isExpanded ? `${ACCENT}08` : "rgba(255,255,255,0.015)",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)"; }}
              onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)"; }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "monospace", fontSize: "0.56rem", fontWeight: 700, color: ACCENT,
              }}>
                {item.symbol.slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.6rem", fontWeight: 700, color: "#e0e0e0" }}>
                    {item.symbol}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.57rem", color: "rgba(224,224,224,0.4)" }}>
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
                    <div style={{ fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700, color: "#e0e0e0" }}>
                      {fmt(item.price)}
                    </div>
                    {item.change1d !== null && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 2 }}>
                        {positive ? <TrendingUp size={10} color="#22c55e" /> : <TrendingDown size={10} color="#ef4444" />}
                        <span style={{ fontFamily: "monospace", fontSize: "0.55rem", color: positive ? "#22c55e" : "#ef4444" }}>
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
                    padding: "0.6rem 1.25rem 0.85rem calc(1.25rem + 34px + 0.85rem)",
                    background: `${ACCENT}05`,
                    borderTop: `1px solid ${ACCENT}15`,
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
      })}
    </div>
  );
}
