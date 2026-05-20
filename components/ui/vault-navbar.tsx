"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { metalSpotPerGram } from "@/lib/mock-data";
import { VaultPreferences } from "@/components/ui/vault-preferences";
import { useAuth } from "@/lib/auth-context";
import { usePrices } from "@/lib/price-context";

export type Tab = "Crypto" | "Stocks" | "CS2" | "Commodities" | "Pokémon" | "AI" | "Find" | "PnL";
export const TABS: Tab[] = ["Crypto", "Stocks", "CS2", "Commodities", "Pokémon", "AI", "Find", "PnL"];

const ASSET_TABS: Tab[] = ["Crypto", "Stocks", "CS2", "Commodities", "Pokémon"];
const OTHER_TABS: Tab[] = ["AI", "Find", "PnL"];

const ASSET_COLORS: Record<string, string> = {
  Crypto:      "#f7931a",
  Stocks:      "#38bdf8",
  CS2:         "#f97316",
  Commodities: "#f5c542",
  "Pokémon":   "#facc15",
};

const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

interface VaultNavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function VaultNavbar({ activeTab, onTabChange }: VaultNavbarProps) {
  const { portfolio } = useAuth();
  const { crypto: liveCrypto, stocks: liveStocks, metals: liveMetals } = usePrices();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const spotPrices = { ...metalSpotPerGram, ...liveMetals };

  const cryptoTotal = (portfolio?.cryptoAssets ?? []).reduce((s, a) => {
    const lp = liveCrypto[a.coingeckoId];
    return s + a.amount * (lp?.price ?? a.price);
  }, 0);
  const stockTotal = (portfolio?.stockAssets ?? []).reduce((s, a) => {
    const lp = liveStocks[a.ticker];
    return s + a.shares * (lp?.price ?? a.price);
  }, 0);
  const goldTotal = (portfolio?.goldItems ?? []).reduce((s, g) => {
    const spot = spotPrices[g.metal] || metalSpotPerGram[g.metal] || 65.32;
    return s + g.quantity * g.weightGrams * spot;
  }, 0);
  const cs2Total = (portfolio?.cs2Skins ?? []).reduce((s, sk) => s + sk.price, 0)
    + (portfolio?.cs2Cases ?? []).reduce((s, c) => s + c.quantity * c.price, 0);
  const pokemonTotal = (portfolio?.pokemonCards ?? []).reduce((s, c) => s + c.value, 0)
    + (portfolio?.pokemonFigures ?? []).reduce((s, f) => s + f.value, 0);
  const grandTotal = cryptoTotal + stockTotal + goldTotal + cs2Total + pokemonTotal;

  const assetActive = ASSET_TABS.includes(activeTab);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        backgroundColor: "rgba(10,10,10,0.88)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 2rem",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          height: 64,
        }}
      >
        {/* Logo */}
        <span
          style={{
            fontFamily: "var(--font-syncopate)",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#e0e0e0",
            letterSpacing: "0.25em",
          }}
        >
          VAULT
        </span>

        {/* Center tabs */}
        <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
          {/* ASSETS dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <motion.button
              onClick={() => setDropdownOpen(v => !v)}
              whileTap={{ scale: 0.94 }}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.5rem 1.1rem",
                fontFamily: "var(--font-syncopate)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: assetActive ? "#e0e0e0" : dropdownOpen ? "rgba(224,224,224,0.7)" : "rgba(224,224,224,0.35)",
                background: "none",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {assetActive ? activeTab.toUpperCase() : "ASSETS"}
              <motion.span
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <ChevronDown size={11} />
              </motion.span>

              {assetActive && (
                <motion.div
                  layoutId="vault-tab-indicator"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "15%",
                    right: "15%",
                    height: 2,
                    borderRadius: 2,
                    background: "linear-gradient(90deg, transparent, #e0e0e0, transparent)",
                  }}
                  transition={{ type: "spring", stiffness: 480, damping: 32 }}
                />
              )}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
                    overflow: "hidden",
                    minWidth: 180,
                    zIndex: 200,
                  }}
                >
                  {ASSET_TABS.map((tab, i) => {
                    const isActive = activeTab === tab;
                    const color = ASSET_COLORS[tab];
                    return (
                      <motion.button
                        key={tab}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => { onTabChange(tab); setDropdownOpen(false); }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.7rem 1rem",
                          background: isActive ? `${color}14` : "transparent",
                          border: "none",
                          borderBottom: i < ASSET_TABS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isActive ? `${color}20` : "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isActive ? `${color}14` : "transparent"; }}
                      >
                        <span style={{
                          width: 7, height: 7, borderRadius: "50%",
                          background: isActive ? color : "rgba(255,255,255,0.2)",
                          flexShrink: 0,
                          boxShadow: isActive ? `0 0 6px ${color}` : "none",
                          transition: "all 0.2s",
                        }} />
                        <span style={{
                          fontFamily: "var(--font-syncopate)",
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          color: isActive ? color : "rgba(224,224,224,0.55)",
                        }}>
                          {tab.toUpperCase()}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)", margin: "0 0.25rem" }} />

          {/* Other tabs */}
          {OTHER_TABS.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => onTabChange(tab)}
              whileHover={{ color: "rgba(224,224,224,0.85)" }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{
                position: "relative",
                padding: "0.5rem 1.1rem",
                fontFamily: "var(--font-syncopate)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: activeTab === tab ? "#e0e0e0" : "rgba(224,224,224,0.35)",
                background: "none",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {tab.toUpperCase()}
              {activeTab === tab && (
                <motion.div
                  layoutId="vault-tab-indicator"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "15%",
                    right: "15%",
                    height: 2,
                    borderRadius: 2,
                    background: "linear-gradient(90deg, transparent, #e0e0e0, transparent)",
                  }}
                  transition={{ type: "spring", stiffness: 480, damping: 32 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Right — net worth + preferences */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1.25rem" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.6rem",
                color: "rgba(224,224,224,0.35)",
                letterSpacing: "0.12em",
                marginBottom: 2,
              }}
            >
              NET WORTH
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#f5c542",
              }}
            >
              {fmtShort(grandTotal)}
            </div>
          </div>
          <VaultPreferences />
        </div>
      </div>
    </nav>
  );
}
