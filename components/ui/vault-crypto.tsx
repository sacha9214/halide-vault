"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cryptoCatalog, type CryptoAsset } from "@/lib/mock-data";
import { DetailModal, type ModalData } from "@/components/ui/vault-detail-modal";
import { EmptyState } from "@/components/ui/vault-empty";
import { VaultViewToggle, type ViewMode } from "@/components/ui/vault-view-toggle";
import { VaultAddModal, type AddModalItem } from "@/components/ui/vault-add-modal";
import { usePrices } from "@/lib/price-context";
import { useAuth } from "@/lib/auth-context";

const ACCENT = "#22d3ee";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);
const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 30;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - 4 - ((v - min) / range) * (h - 8)}`)
    .join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } } };
const card = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 280, damping: 26, mass: 0.8 } },
};

function CryptoCard({ asset, onClick }: { asset: CryptoAsset; onClick: () => void }) {
  const value = asset.amount * asset.price;
  const isUp = asset.change24h >= 0;

  return (
    <motion.div
      variants={card}
      whileHover={{ y: -6, scale: 1.02, boxShadow: `0 0 0 1px ${ACCENT}55, 0 12px 40px ${ACCENT}25` }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: "linear-gradient(145deg, #141414, #0f0f0f)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        padding: "1.25rem",
        cursor: "pointer",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: `${asset.color}18`, border: `1px solid ${asset.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.7rem", fontWeight: 700, color: asset.color,
              fontFamily: "monospace", letterSpacing: "0.05em",
            }}
          >
            {asset.ticker.slice(0, 2)}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.65rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.08em" }}>
              {asset.ticker}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.38)", marginTop: 2 }}>
              {asset.name}
            </div>
          </div>
        </div>
        <Sparkline data={asset.sparkline} color={asset.color} />
      </div>

      <div style={{ marginBottom: "0.9rem" }}>
        <div style={{ fontFamily: "monospace", fontSize: "1.05rem", fontWeight: 700, color: "#e0e0e0" }}>
          {fmt(asset.price)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
          {isUp ? <TrendingUp size={11} color="#22c55e" /> : <TrendingDown size={11} color="#ef4444" />}
          <span style={{ fontFamily: "monospace", fontSize: "0.68rem", color: isUp ? "#22c55e" : "#ef4444" }}>
            {isUp ? "+" : ""}{asset.change24h.toFixed(2)}% 24h
          </span>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.85rem", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>HELD</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#e0e0e0", marginTop: 3 }}>
            {asset.amount} {asset.ticker}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>VALUE</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: ACCENT, marginTop: 3, fontWeight: 700 }}>
            {fmtShort(value)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const fmt2 = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);

export function VaultCrypto() {
  const [selected, setSelected] = useState<ModalData | null>(null);
  const [view, setView] = useState<ViewMode>("browse");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const { crypto: liveCrypto, lastUpdated } = usePrices();
  const { portfolio, updatePortfolio } = useAuth();
  const portfolioAssets = (portfolio?.cryptoAssets ?? []).filter(a => a.amount > 0);
  const cryptoTotal = portfolioAssets.reduce((s, a) => s + a.amount * a.price, 0);

  const catalogIds = new Set(cryptoCatalog.map(a => a.id));
  const allCryptoAssets = portfolio?.cryptoAssets ?? [];
  const findAssets = allCryptoAssets.filter(a => !catalogIds.has(a.id));
  const browseList = findAssets.length > 0 ? [...cryptoCatalog, ...findAssets] : cryptoCatalog;
  const rawAssets = view === "browse" ? browseList : portfolioAssets;
  const allAssets = rawAssets.map((a) => {
    const lp = liveCrypto[a.coingeckoId];
    return lp ? { ...a, price: lp.price, change24h: lp.change24h } : a;
  });
  const q = query.trim().toLowerCase();
  const assets = q
    ? allAssets.filter((a) => a.name.toLowerCase().includes(q) || a.ticker.toLowerCase().includes(q))
    : allAssets;

  const addItems: AddModalItem[] = cryptoCatalog.map(a => {
    const lp = liveCrypto[a.coingeckoId];
    const price = lp ? lp.price : a.price;
    return { id: a.id, ticker: a.ticker, name: a.name, subtitle: a.coingeckoId, price: fmt2(price), color: a.color };
  });

  function handleAdd(id: string, amount: number) {
    const template = cryptoCatalog.find(a => a.id === id);
    if (!template) return;
    const lp = liveCrypto[template.coingeckoId];
    const all = portfolio?.cryptoAssets ?? [];
    const current = all.find(a => a.id === id);
    const updated = current
      ? all.map(a => a.id === id ? { ...a, amount: a.amount + amount } : a)
      : [...all, { ...template, amount, price: lp?.price ?? template.price, change24h: lp?.change24h ?? template.change24h }];
    updatePortfolio({ ...portfolio!, cryptoAssets: updated });
    setView("portfolio");
  }

  return (
    <section style={{ paddingBottom: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: 4 }}>
            <div style={{ width: 3, height: 20, borderRadius: 2, background: ACCENT }} />
            <h2 style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.75rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.15em" }}>
              CRYPTO PORTFOLIO
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingLeft: "1rem" }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.3)", margin: 0 }}>
              {assets.length} ASSETS
            </p>
            {lastUpdated && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <motion.div
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }}
                />
                <span style={{ fontFamily: "monospace", fontSize: "0.52rem", color: "#22c55e", letterSpacing: "0.1em" }}>LIVE</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em", marginBottom: 4 }}>
            TOTAL VALUE
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "1.3rem", fontWeight: 700, color: ACCENT }}>
            {fmtShort(cryptoTotal)}
          </div>
        </div>
      </div>

      <VaultViewToggle mode={view} onChange={setView} query={query} onQueryChange={setQuery} onAdd={() => setAddOpen(true)} />

      {assets.length === 0 ? (
        <EmptyState label={q ? `NO RESULTS FOR "${query.toUpperCase()}"` : "NO CRYPTO ASSETS YET"} />
      ) : (
        <motion.div
          key={view}
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}
        >
          {assets.map((asset) => (
            <CryptoCard key={asset.id} asset={asset} onClick={() => setSelected({ kind: "crypto", asset })} />
          ))}
        </motion.div>
      )}

      <DetailModal data={selected} onClose={() => setSelected(null)} />
      <VaultAddModal open={addOpen} onClose={() => setAddOpen(false)} title="CRYPTO" items={addItems} quantityLabel="AMOUNT" quantityStep={0.0001} quantityMin={0.0001} onAdd={handleAdd} />
    </section>
  );
}
