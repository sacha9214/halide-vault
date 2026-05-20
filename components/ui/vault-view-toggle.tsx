"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Plus, Telescope } from "lucide-react";
import { VaultFindModal } from "@/components/ui/vault-find-modal";

export type ViewMode = "portfolio" | "browse";

interface VaultViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  query: string;
  onQueryChange: (q: string) => void;
  onAdd?: () => void;
}

export function VaultViewToggle({ mode, onChange, query, onQueryChange, onAdd }: VaultViewToggleProps) {
  const [findOpen, setFindOpen] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
      {(["portfolio", "browse"] as ViewMode[]).map((m) => (
        <motion.button
          key={m}
          onClick={() => onChange(m)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{
            padding: "0.4rem 1rem",
            fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.1em",
            background: mode === m ? "rgba(224,224,224,0.08)" : "transparent",
            border: mode === m ? "1px solid rgba(224,224,224,0.2)" : "1px solid rgba(255,255,255,0.06)",
            borderRadius: 4,
            color: mode === m ? "rgba(224,224,224,0.9)" : "rgba(224,224,224,0.3)",
            cursor: "pointer",
            transition: "color 0.18s, background 0.18s, border-color 0.18s",
            whiteSpace: "nowrap",
          }}
        >
          {m === "portfolio" ? "MY PORTFOLIO" : "BROWSE"}
        </motion.button>
      ))}

      {onAdd && (
        <motion.button
          onClick={onAdd}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{
            display: "flex", alignItems: "center", gap: "0.35rem",
            padding: "0.4rem 1rem",
            fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.1em",
            background: "rgba(167,139,250,0.1)",
            border: "1px solid rgba(167,139,250,0.4)",
            borderRadius: 4,
            color: "#a78bfa",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={11} />
          ADD
        </motion.button>
      )}

      <div style={{ flex: 1, minWidth: 100, maxWidth: 280, position: "relative" }}>
        <Search
          size={11}
          color="rgba(224,224,224,0.3)"
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="SEARCH..."
          style={{
            width: "100%",
            padding: "0.4rem 2rem 0.4rem 2rem",
            fontFamily: "monospace",
            fontSize: "0.63rem",
            letterSpacing: "0.08em",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 4,
            color: "rgba(224,224,224,0.85)",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex",
            }}
          >
            <X size={11} color="rgba(224,224,224,0.35)" />
          </button>
        )}
      </div>

      <motion.button
        onClick={() => setFindOpen(true)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        style={{
          display: "flex", alignItems: "center", gap: "0.35rem",
          padding: "0.4rem 0.85rem",
          fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.1em",
          background: "rgba(96,165,250,0.08)",
          border: "1px solid rgba(96,165,250,0.35)",
          borderRadius: 4,
          color: "#60a5fa",
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        <Telescope size={11} />
        FIND
      </motion.button>

      <VaultFindModal open={findOpen} onClose={() => setFindOpen(false)} />
    </div>
  );
}
