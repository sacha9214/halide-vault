"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pokemonCardsCatalog, pokemonFiguresCatalog, type PokemonCard, type PokemonFigure } from "@/lib/mock-data";
import { DetailModal, type ModalData } from "@/components/ui/vault-detail-modal";
import { EmptyState } from "@/components/ui/vault-empty";
import { VaultViewToggle, type ViewMode } from "@/components/ui/vault-view-toggle";
import { VaultAddModal, type AddModalItem } from "@/components/ui/vault-add-modal";
import { useAuth } from "@/lib/auth-context";

const ACCENT = "#facc15";

const rarityColors: Record<PokemonCard["rarity"], string> = {
  Common: "#888", Uncommon: "#67b941", Rare: "#4b69ff",
  Holo: "#f5c542", EX: "#d32ce6", GX: "#eb4b4b", VMAX: "#f97316",
};

const rarityGlow: Record<PokemonCard["rarity"], string> = {
  Common: "#88888822", Uncommon: "#67b94122", Rare: "#4b69ff22",
  Holo: "#f5c54233", EX: "#d32ce622", GX: "#eb4b4b22", VMAX: "#f9731622",
};

const POKEMON_EMOJI: Record<string, string> = {
  Charizard: "🔥", Pikachu: "⚡", Mewtwo: "🔮", Blastoise: "💧",
  Venusaur: "🌿", Gengar: "👻", Rayquaza: "🐲", Lugia: "🌊",
  Umbreon: "🌙", Mew: "✨", Eevee: "🦊",
};
const getEmoji = (name: string) => POKEMON_EMOJI[name] || "⭐";

const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function PokemonCardItem({ card, onClick }: { card: PokemonCard; onClick: () => void }) {
  const rColor = rarityColors[card.rarity];
  const rGlow = rarityGlow[card.rarity];

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5, boxShadow: `0 0 0 1px ${ACCENT}55, 0 8px 32px ${ACCENT}22` }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      style={{
        background: "linear-gradient(145deg, #141414, #0f0f0f)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10, overflow: "hidden", cursor: "pointer",
      }}
    >
      <div
        style={{
          height: 160,
          background: `linear-gradient(160deg, ${rGlow} 0%, #0a0a0a 70%)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${rColor}18 0%, transparent 60%)` }} />
        <span style={{ fontSize: "2.5rem" }}>{getEmoji(card.name)}</span>
        <span style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.7rem", fontWeight: 700, color: `${rColor}dd`, letterSpacing: "0.08em" }}>
          {card.name}
        </span>
      </div>

      <div style={{ padding: "1rem 1.1rem" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.4)" }}>{card.set}</div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: rColor, border: `1px solid ${rColor}44`, padding: "0.2rem 0.5rem", borderRadius: 3, letterSpacing: "0.05em" }}>
              {card.rarity}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.55)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.2rem 0.5rem", borderRadius: 3 }}>
              {card.condition}
            </span>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>EST. VALUE</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 700, color: ACCENT, marginTop: 3 }}>
              {fmtShort(card.value)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PokemonFigureItem({ figure, onClick }: { figure: PokemonFigure; onClick: () => void }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5, boxShadow: `0 0 0 1px ${ACCENT}55, 0 8px 32px ${ACCENT}22` }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      style={{
        background: "linear-gradient(145deg, #141414, #0f0f0f)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10, overflow: "hidden", cursor: "pointer",
      }}
    >
      <div style={{
        height: 160,
        background: "linear-gradient(135deg, #1a100a 0%, #0a0a0a 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{ fontSize: "3rem" }}>{getEmoji(figure.name)}</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.4)", letterSpacing: "0.1em" }}>
          FIGURE · {figure.size}
        </span>
      </div>

      <div style={{ padding: "1rem 1.1rem" }}>
        <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.65rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.05em", marginBottom: 4 }}>
          {figure.name}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.4)", marginBottom: "0.85rem" }}>
          {figure.condition}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em" }}>EST. VALUE</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 700, color: ACCENT, marginTop: 3 }}>
              {fmtShort(figure.value)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type SubTab = "Cards" | "Figures";

export function VaultPokemon() {
  const [subTab, setSubTab] = useState<SubTab>("Cards");
  const [selected, setSelected] = useState<ModalData | null>(null);
  const [view, setView] = useState<ViewMode>("browse");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const { portfolio, updatePortfolio } = useAuth();
  const portfolioCards = portfolio?.pokemonCards ?? [];
  const portfolioFigures = portfolio?.pokemonFigures ?? [];
  const pokemonTotal = portfolioCards.reduce((s, c) => s + c.value, 0) + portfolioFigures.reduce((s, f) => s + f.value, 0);

  const allCards = view === "browse" ? pokemonCardsCatalog : portfolioCards;
  const allFigures = view === "browse" ? pokemonFiguresCatalog : portfolioFigures;
  const q = query.trim().toLowerCase();
  const cards = q
    ? allCards.filter((c) => c.name.toLowerCase().includes(q) || c.set.toLowerCase().includes(q) || c.rarity.toLowerCase().includes(q))
    : allCards;
  const figures = q
    ? allFigures.filter((f) => f.name.toLowerCase().includes(q))
    : allFigures;

  const addItems: AddModalItem[] = subTab === "Cards"
    ? pokemonCardsCatalog.map(c => ({
        id: c.id, name: c.name,
        subtitle: `${c.set} · ${c.rarity} · ${c.condition}`,
        price: fmtShort(c.value),
        color: rarityColors[c.rarity],
      }))
    : pokemonFiguresCatalog.map(f => ({
        id: f.id, name: f.name,
        subtitle: `${f.size} · ${f.condition}`,
        price: fmtShort(f.value),
        color: ACCENT,
      }));

  function handleAdd(id: string, qty: number) {
    if (subTab === "Cards") {
      const template = pokemonCardsCatalog.find(c => c.id === id);
      if (!template) return;
      const copies = Array.from({ length: Math.max(1, Math.floor(qty)) }, (_, i) => ({
        ...template,
        id: `${template.id}-${Date.now()}-${i}`,
      }));
      updatePortfolio({ ...portfolio!, pokemonCards: [...portfolioCards, ...copies] });
    } else {
      const template = pokemonFiguresCatalog.find(f => f.id === id);
      if (!template) return;
      const copies = Array.from({ length: Math.max(1, Math.floor(qty)) }, (_, i) => ({
        ...template,
        id: `${template.id}-${Date.now()}-${i}`,
      }));
      updatePortfolio({ ...portfolio!, pokemonFigures: [...portfolioFigures, ...copies] });
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
              POKÉMON COLLECTION
            </h2>
          </div>
          <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.3)", paddingLeft: "1rem" }}>
            {cards.length} CARDS · {figures.length} FIGURES
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.3)", letterSpacing: "0.1em", marginBottom: 4 }}>
            TOTAL VALUE
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "1.3rem", fontWeight: 700, color: ACCENT }}>
            {fmtShort(pokemonTotal)}
          </div>
        </div>
      </div>

      <VaultViewToggle mode={view} onChange={setView} query={query} onQueryChange={setQuery} onAdd={() => setAddOpen(true)} />

      <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
        {(["Cards", "Figures"] as SubTab[]).map((t) => (
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
          {subTab === "Cards" && cards.length === 0 ? (
            <EmptyState label={q ? `NO RESULTS FOR "${query.toUpperCase()}"` : "NO CARDS YET"} />
          ) : subTab === "Figures" && figures.length === 0 ? (
            <EmptyState label={q ? `NO RESULTS FOR "${query.toUpperCase()}"` : "NO FIGURES YET"} />
          ) : (
            <motion.div
              key={`${view}-${subTab}`}
              variants={container}
              initial="hidden"
              animate="show"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}
            >
              {subTab === "Cards"
                ? cards.map((c) => (
                    <PokemonCardItem key={c.id} card={c} onClick={() => setSelected({ kind: "pokemon-card", card: c })} />
                  ))
                : figures.map((f) => (
                    <PokemonFigureItem key={f.id} figure={f} onClick={() => setSelected({ kind: "pokemon-figure", figure: f })} />
                  ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <DetailModal data={selected} onClose={() => setSelected(null)} />
      <VaultAddModal
        open={addOpen} onClose={() => setAddOpen(false)}
        title={subTab === "Cards" ? "POKÉMON CARDS" : "POKÉMON FIGURES"}
        items={addItems}
        quantityLabel="QTY"
        quantityStep={1} quantityMin={1}
        onAdd={handleAdd}
      />
    </section>
  );
}
