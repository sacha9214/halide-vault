"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { goldCatalog, metalSpotPerGram, metalColors, type GoldItem } from "@/lib/mock-data";
import { DetailModal, type ModalData } from "@/components/ui/vault-detail-modal";
import { EmptyState } from "@/components/ui/vault-empty";
import { VaultViewToggle, type ViewMode } from "@/components/ui/vault-view-toggle";
import { VaultAddModal, type AddModalItem } from "@/components/ui/vault-add-modal";
import { usePrices } from "@/lib/price-context";
import { useAuth } from "@/lib/auth-context";

const ACCENT = "#f5c542";

const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
const fmt2 = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);

const metalGradients: Record<string, string> = {
  gold: "linear-gradient(135deg, #f5c542 0%, #c8960c 40%, #f5c542 70%, #a07000 100%)",
  silver: "linear-gradient(135deg, #e8e8e8 0%, #a0a0a0 40%, #e8e8e8 70%, #686868 100%)",
  platinum: "linear-gradient(135deg, #f0f0f8 0%, #b8b8cc 40%, #f0f0f8 70%, #8888a0 100%)",
  palladium: "linear-gradient(135deg, #e0d8cc 0%, #a8a098 40%, #e0d8cc 70%, #787068 100%)",
};

const metalGlows: Record<string, string> = {
  gold: "#f5c54255",
  silver: "#c0c0c055",
  platinum: "#e0e0f055",
  palladium: "#d4c9bc55",
};

const metalSymbols: Record<string, string> = {
  gold: "Au", silver: "Ag", platinum: "Pt", palladium: "Pd",
};

const metalTextColors: Record<string, string> = {
  gold: "#7a5000", silver: "#404040", platinum: "#404060", palladium: "#504840",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function MetalCard({ gold, spotPrices, onClick }: { gold: GoldItem; spotPrices: Record<string, number>; onClick: () => void }) {
  const spot = spotPrices[gold.metal] || metalSpotPerGram[gold.metal] || 65.32;
  const mColor = metalColors[gold.metal] || ACCENT;
  const gradient = metalGradients[gold.metal] || metalGradients.gold;
  const glow = metalGlows[gold.metal] || metalGlows.gold;
  const symbol = metalSymbols[gold.metal] || "Au";
  const textColor = metalTextColors[gold.metal] || "#7a5000";
  const unitValue = gold.weightGrams * spot;
  const totalValue = gold.quantity * unitValue;

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5, boxShadow: `0 0 0 1px ${mColor}55, 0 8px 32px ${mColor}22` }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      style={{
        background: "linear-gradient(145deg, #141414, #0f0f0f)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${mColor}, ${mColor}55)` }} />

      <div
        style={{
          height: 130, position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #1a1408 0%, #0a0a0a 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${mColor}18 0%, transparent 65%)` }} />
        {gold.type === "bar" ? (
          <div style={{
            width: 90, height: 55, background: gradient, borderRadius: 4,
            boxShadow: `0 4px 20px ${glow}, inset 0 1px 0 rgba(255,255,255,0.4)`,
            display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
          }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: textColor, letterSpacing: "0.12em", fontWeight: 700 }}>
              {symbol}
            </span>
          </div>
        ) : (
          <div style={{
            width: 70, height: 70, borderRadius: "50%", background: gradient,
            boxShadow: `0 4px 20px ${glow}, inset 0 1px 0 rgba(255,255,255,0.4)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: textColor, letterSpacing: "0.08em", fontWeight: 700 }}>
              {symbol}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "1rem 1.1rem" }}>
        <div style={{ marginBottom: "0.85rem" }}>
          <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.62rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.05em" }}>
            {gold.name}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: mColor, border: `1px solid ${mColor}40`, padding: "0.2rem 0.5rem", borderRadius: 3 }}>
              {gold.weightGrams}g
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.2rem 0.5rem", borderRadius: 3 }}>
              {gold.purity}% pure
            </span>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.85rem", display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>QTY · UNIT</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#e0e0e0", marginTop: 3 }}>
              ×{gold.quantity} · {fmt2(unitValue)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>TOTAL</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: 700, color: mColor, marginTop: 3 }}>
              {fmtShort(totalValue)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function VaultGold() {
  const [selected, setSelected] = useState<ModalData | null>(null);
  const [view, setView] = useState<ViewMode>("browse");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const { metals: liveMetals, lastUpdated } = usePrices();
  const { portfolio, updatePortfolio } = useAuth();
  const portfolioAssets = portfolio?.goldItems ?? [];
  const spotPrices = { ...metalSpotPerGram, ...liveMetals };
  const goldTotal = portfolioAssets.reduce((s, g) => s + g.quantity * g.weightGrams * (spotPrices[g.metal] || metalSpotPerGram[g.metal] || 65.32), 0);

  const allItems = view === "browse" ? goldCatalog : portfolioAssets;
  const q = query.trim().toLowerCase();
  const items = q
    ? allItems.filter((g) => g.name.toLowerCase().includes(q) || g.metal.toLowerCase().includes(q))
    : allItems;
  const totalGrams = portfolioAssets.filter(g => g.metal === "gold").reduce((s, g) => s + g.quantity * g.weightGrams, 0);

  const addItems: AddModalItem[] = goldCatalog.map(g => ({
    id: g.id,
    name: g.name,
    subtitle: `${g.type} · ${g.weightGrams}g · ${g.purity}% pure`,
    price: fmt2(g.weightGrams * (spotPrices[g.metal] || metalSpotPerGram[g.metal] || 65.32)),
    color: metalColors[g.metal] || ACCENT,
  }));

  function handleAdd(id: string, qty: number) {
    const template = goldCatalog.find(g => g.id === id);
    if (!template) return;
    const current = portfolioAssets.find(g => g.id === id);
    const updated = current
      ? portfolioAssets.map(g => g.id === id ? { ...g, quantity: g.quantity + qty } : g)
      : [...portfolioAssets, { ...template, quantity: qty }];
    updatePortfolio({ ...portfolio!, goldItems: updated });
    setView("portfolio");
  }

  return (
    <section style={{ paddingBottom: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: 4 }}>
            <div style={{ width: 3, height: 20, borderRadius: 2, background: ACCENT }} />
            <h2 style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.75rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.15em" }}>
              PRECIOUS METALS
            </h2>
          </div>
          <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.3)", paddingLeft: "1rem" }}>
            {items.length} ITEMS · {totalGrams.toFixed(1)}g GOLD
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em", marginBottom: 4 }}>
            TOTAL VALUE
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "1.3rem", fontWeight: 700, color: ACCENT }}>
            {fmtShort(goldTotal)}
          </div>
        </div>
      </div>

      <VaultViewToggle mode={view} onChange={setView} query={query} onQueryChange={setQuery} onAdd={() => setAddOpen(true)} />

      {/* Spot price ticker — all metals */}
      <div style={{
        display: "flex", gap: "1.5rem", padding: "0.75rem 1.25rem",
        background: `${ACCENT}0a`, border: `1px solid ${ACCENT}22`,
        borderRadius: 8, marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center",
      }}>
        {Object.keys(metalSpotPerGram).map((metal) => (
          <div key={metal}>
            <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.12em" }}>
              {metal.toUpperCase()} /G{" "}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: metalColors[metal] || ACCENT, fontWeight: 700 }}>
              ${(spotPrices[metal] ?? metalSpotPerGram[metal]).toFixed(2)}
            </span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {lastUpdated ? (
            <>
              <motion.div
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }}
              />
              <span style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "#22c55e", letterSpacing: "0.1em" }}>LIVE</span>
            </>
          ) : (
            <span style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.1em" }}>LOADING…</span>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState label={q ? `NO RESULTS FOR "${query.toUpperCase()}"` : "NO COMMODITIES YET"} />
      ) : (
        <motion.div
          key={view}
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}
        >
          {items.map((g) => (
            <MetalCard key={g.id} gold={g} spotPrices={spotPrices} onClick={() => setSelected({ kind: "gold", item: g })} />
          ))}
        </motion.div>
      )}

      <DetailModal data={selected} onClose={() => setSelected(null)} />
      <VaultAddModal open={addOpen} onClose={() => setAddOpen(false)} title="METALS" items={addItems} quantityLabel="QTY" quantityStep={1} quantityMin={1} onAdd={handleAdd} />
    </section>
  );
}
