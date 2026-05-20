"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import { cs2SkinsCatalog, cs2CasesCatalog, type CS2Skin, type CS2Case } from "@/lib/mock-data";
import { DetailModal, type ModalData } from "@/components/ui/vault-detail-modal";
import { EmptyState } from "@/components/ui/vault-empty";
import { VaultViewToggle, type ViewMode } from "@/components/ui/vault-view-toggle";
import { VaultAddModal, type AddModalItem } from "@/components/ui/vault-add-modal";
import { useAuth } from "@/lib/auth-context";

const ACCENT = "#f97316";

const rarityColors: Record<CS2Skin["rarity"], string> = {
  Consumer: "#b0c3d9", Industrial: "#5e98d9", "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff", Classified: "#d32ce6", Covert: "#eb4b4b", Knife: "#e4ae39",
};

const wearLabels: Record<CS2Skin["wear"], string> = {
  FN: "Factory New", MW: "Minimal Wear", FT: "Field-Tested", WW: "Well-Worn", BS: "Battle-Scarred",
};

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);
const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const container = { hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function SkinCard({ skin, onClick }: { skin: CS2Skin; onClick: () => void }) {
  const rColor = rarityColors[skin.rarity];
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5, boxShadow: `0 0 0 1px ${ACCENT}55, 0 8px 32px ${ACCENT}22` }}
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
      <div style={{ height: 3, background: `linear-gradient(90deg, ${rColor}, ${rColor}66)` }} />
      <div
        style={{
          height: 120,
          background: `linear-gradient(135deg, ${rColor}15 0%, #0a0a0a 60%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${rColor}20 0%, transparent 65%)` }} />
        <span style={{
          fontFamily: "var(--font-syncopate)", fontSize: "0.9rem", fontWeight: 700,
          color: `${rColor}cc`, letterSpacing: "0.08em", textAlign: "center",
          padding: "0 1rem", lineHeight: 1.3,
        }}>
          {skin.weaponName}
        </span>
      </div>

      <div style={{ padding: "1rem 1.1rem" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.65rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.06em" }}>
            {skin.skinName}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.4)", marginTop: 3 }}>
            {skin.weaponName}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.85rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: rColor, border: `1px solid ${rColor}44`, padding: "0.2rem 0.5rem", borderRadius: 3, letterSpacing: "0.06em" }}>
            {skin.rarity}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.55)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.2rem 0.5rem", borderRadius: 3, letterSpacing: "0.06em" }}>
            {skin.wear} · {wearLabels[skin.wear]}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>FLOAT</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(224,224,224,0.7)", marginTop: 2 }}>
              {skin.float.toFixed(3)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>MARKET</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: 700, color: ACCENT, marginTop: 2 }}>
              {fmt(skin.price)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CaseCard({ cs2case, onClick }: { cs2case: CS2Case; onClick: () => void }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5, boxShadow: `0 0 0 1px ${ACCENT}55, 0 8px 32px ${ACCENT}22` }}
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
      <div style={{
        height: 120,
        background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <Package size={36} color="rgba(224,224,224,0.25)" />
      </div>

      <div style={{ padding: "1rem 1.1rem" }}>
        <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.62rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.05em", marginBottom: 4 }}>
          {cs2case.name}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.75rem", marginTop: "0.75rem", display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>QTY</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#e0e0e0", marginTop: 3, fontWeight: 700 }}>×{cs2case.quantity}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>TOTAL</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: 700, color: ACCENT, marginTop: 3 }}>
              {fmt(cs2case.quantity * cs2case.price)}
            </div>
          </div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.3)", marginTop: 2 }}>
          {fmt(cs2case.price)} each
        </div>
      </div>
    </motion.div>
  );
}

type SubTab = "Skins" | "Cases";

export function VaultCS2() {
  const [subTab, setSubTab] = useState<SubTab>("Skins");
  const [selected, setSelected] = useState<ModalData | null>(null);
  const [view, setView] = useState<ViewMode>("browse");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const { portfolio, updatePortfolio } = useAuth();
  const portfolioSkins = portfolio?.cs2Skins ?? [];
  const portfolioCases = portfolio?.cs2Cases ?? [];
  const cs2Total = portfolioSkins.reduce((s, sk) => s + sk.price, 0) + portfolioCases.reduce((s, c) => s + c.quantity * c.price, 0);

  const allSkins = view === "browse" ? cs2SkinsCatalog : portfolioSkins;
  const allCases = view === "browse" ? cs2CasesCatalog : portfolioCases;
  const q = query.trim().toLowerCase();
  const skins = q
    ? allSkins.filter((s) => s.weaponName.toLowerCase().includes(q) || s.skinName.toLowerCase().includes(q) || s.rarity.toLowerCase().includes(q))
    : allSkins;
  const cases = q
    ? allCases.filter((c) => c.name.toLowerCase().includes(q))
    : allCases;

  const addItems: AddModalItem[] = subTab === "Skins"
    ? cs2SkinsCatalog.map(s => ({
        id: s.id, name: s.skinName,
        subtitle: `${s.weaponName} · ${s.rarity} · ${s.wear}`,
        price: fmt(s.price),
        color: rarityColors[s.rarity],
      }))
    : cs2CasesCatalog.map(c => ({
        id: c.id, name: c.name,
        subtitle: "Case",
        price: fmt(c.price),
        color: ACCENT,
      }));

  function handleAdd(id: string, qty: number) {
    if (subTab === "Skins") {
      const template = cs2SkinsCatalog.find(s => s.id === id);
      if (!template) return;
      const copies = Array.from({ length: Math.max(1, Math.floor(qty)) }, (_, i) => ({
        ...template,
        id: `${template.id}-${Date.now()}-${i}`,
      }));
      updatePortfolio({ ...portfolio!, cs2Skins: [...portfolioSkins, ...copies] });
    } else {
      const template = cs2CasesCatalog.find(c => c.id === id);
      if (!template) return;
      const current = portfolioCases.find(c => c.id === id);
      const updated = current
        ? portfolioCases.map(c => c.id === id ? { ...c, quantity: c.quantity + qty } : c)
        : [...portfolioCases, { ...template, quantity: qty }];
      updatePortfolio({ ...portfolio!, cs2Cases: updated });
    }
    setView("portfolio");
  }

  return (
    <section style={{ paddingBottom: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: 4 }}>
            <div style={{ width: 3, height: 20, borderRadius: 2, background: ACCENT }} />
            <h2 style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.75rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.15em" }}>
              CS2 INVENTORY
            </h2>
          </div>
          <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.3)", paddingLeft: "1rem" }}>
            {skins.length} SKINS · {cases.length} CASES
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em", marginBottom: 4 }}>
            TOTAL VALUE
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "1.3rem", fontWeight: 700, color: ACCENT }}>
            {fmtShort(cs2Total)}
          </div>
        </div>
      </div>

      <VaultViewToggle mode={view} onChange={setView} query={query} onQueryChange={setQuery} onAdd={() => setAddOpen(true)} />

      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
        {(["Skins", "Cases"] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            style={{
              padding: "0.4rem 1rem",
              fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.1em",
              background: subTab === t ? `${ACCENT}22` : "transparent",
              border: subTab === t ? `1px solid ${ACCENT}66` : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
              color: subTab === t ? ACCENT : "rgba(224,224,224,0.4)",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {subTab === "Skins" && skins.length === 0 ? (
            <EmptyState label={q ? `NO RESULTS FOR "${query.toUpperCase()}"` : "NO SKINS YET"} />
          ) : subTab === "Cases" && cases.length === 0 ? (
            <EmptyState label={q ? `NO RESULTS FOR "${query.toUpperCase()}"` : "NO CASES YET"} />
          ) : (
            <motion.div
              key={`${view}-${subTab}`}
              variants={container}
              initial="hidden"
              animate="show"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}
            >
              {subTab === "Skins"
                ? skins.map((s) => (
                    <SkinCard key={s.id} skin={s} onClick={() => setSelected({ kind: "cs2skin", skin: s })} />
                  ))
                : cases.map((c) => (
                    <CaseCard key={c.id} cs2case={c} onClick={() => setSelected({ kind: "cs2case", cs2case: c })} />
                  ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <DetailModal data={selected} onClose={() => setSelected(null)} />
      <VaultAddModal
        open={addOpen} onClose={() => setAddOpen(false)}
        title={subTab === "Skins" ? "CS2 SKINS" : "CS2 CASES"}
        items={addItems}
        quantityLabel={subTab === "Skins" ? "QTY" : "QTY"}
        quantityStep={1} quantityMin={1}
        onAdd={handleAdd}
      />
    </section>
  );
}
