"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Plus, Check } from "lucide-react";

export interface AddModalItem {
  id: string;
  ticker?: string;
  name: string;
  subtitle: string;
  price: string;
  color: string;
}

interface VaultAddModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: AddModalItem[];
  quantityLabel: string;
  quantityStep?: number;
  quantityMin?: number;
  onAdd: (id: string, quantity: number) => void;
}

export function VaultAddModal({
  open, onClose, title, items, quantityLabel, quantityStep = 1, quantityMin = 0.000001, onAdd,
}: VaultAddModalProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [added, setAdded] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) {
      setQuery(""); setExpanded(null); setAdded(null);
      setTimeout(() => searchRef.current?.focus(), 120);
    }
  }, [open]);

  const filtered = query.trim()
    ? items.filter(i =>
        i.name.toLowerCase().includes(query.toLowerCase()) ||
        i.ticker?.toLowerCase().includes(query.toLowerCase()) ||
        i.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  function handleAdd(item: AddModalItem) {
    const raw = quantities[item.id] ?? "1";
    const qty = parseFloat(raw);
    if (!qty || qty <= 0) return;
    onAdd(item.id, qty);
    setAdded(item.id);
    setTimeout(() => {
      setAdded(null);
      setExpanded(null);
      setQuantities(prev => { const n = { ...prev }; delete n[item.id]; return n; });
      onClose();
    }, 1000);
  }

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="add-modal-overlay"
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
                  ADD TO PORTFOLIO
                </div>
                <div style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.8rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.08em" }}>
                  {title}
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
                placeholder={`SEARCH ${title}...`}
                style={{
                  width: "100%", padding: "0.5rem 1rem 0.5rem 2.2rem",
                  fontFamily: "monospace", fontSize: "0.63rem", letterSpacing: "0.08em",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 6, color: "rgba(224,224,224,0.85)", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(167,139,250,0.4)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
              />
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.25)" }}>
                  NO RESULTS
                </div>
              ) : filtered.map(item => {
                const isExpanded = expanded === item.id;
                const isAdded = added === item.id;
                return (
                  <div key={item.id}>
                    {/* Item row */}
                    <div
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.85rem",
                        padding: "0.7rem 1.5rem",
                        cursor: "pointer",
                        background: isExpanded ? "rgba(167,139,250,0.05)" : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                      onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: `${item.color}18`, border: `1px solid ${item.color}35`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "monospace", fontSize: "0.58rem", fontWeight: 700, color: item.color,
                      }}>
                        {(item.ticker ?? item.name).slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                          <span style={{ fontFamily: "var(--font-syncopate)", fontSize: "0.6rem", fontWeight: 700, color: "#e0e0e0", letterSpacing: "0.08em" }}>
                            {item.ticker ?? item.name}
                          </span>
                          {item.ticker && (
                            <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.35)" }}>
                              {item.name}
                            </span>
                          )}
                        </div>
                        <div style={{ fontFamily: "monospace", fontSize: "0.56rem", color: "rgba(224,224,224,0.3)", marginTop: 2 }}>
                          {item.subtitle}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: item.color, fontWeight: 700 }}>
                          {item.price}
                        </span>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                          background: isExpanded ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${isExpanded ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.1)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}>
                          <Plus size={10} color={isExpanded ? "#a78bfa" : "rgba(224,224,224,0.4)"} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded input */}
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
                            background: "rgba(167,139,250,0.04)",
                            borderBottom: "1px solid rgba(167,139,250,0.1)",
                          }}>
                            <div style={{ fontFamily: "monospace", fontSize: "0.57rem", color: "rgba(224,224,224,0.35)", letterSpacing: "0.1em", flexShrink: 0 }}>
                              {quantityLabel}
                            </div>
                            <input
                              type="number"
                              min={quantityMin}
                              step={quantityStep}
                              value={quantities[item.id] ?? "1"}
                              onChange={e => setQuantities(prev => ({ ...prev, [item.id]: e.target.value }))}
                              onClick={e => e.stopPropagation()}
                              onFocus={e => e.stopPropagation()}
                              style={{
                                width: 100, padding: "0.35rem 0.6rem",
                                fontFamily: "monospace", fontSize: "0.72rem", fontWeight: 700,
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(167,139,250,0.3)",
                                borderRadius: 4, color: "#e0e0e0", outline: "none",
                                textAlign: "right",
                                MozAppearance: "textfield",
                              } as React.CSSProperties}
                            />
                            <motion.button
                              onClick={e => { e.stopPropagation(); handleAdd(item); }}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              style={{
                                display: "flex", alignItems: "center", gap: "0.35rem",
                                padding: "0.35rem 1rem",
                                fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.08em",
                                background: isAdded ? "rgba(34,197,94,0.15)" : "rgba(167,139,250,0.15)",
                                border: `1px solid ${isAdded ? "rgba(34,197,94,0.4)" : "rgba(167,139,250,0.4)"}`,
                                borderRadius: 4,
                                color: isAdded ? "#22c55e" : "#a78bfa",
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
