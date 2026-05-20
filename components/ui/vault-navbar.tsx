"use client";

import { motion } from "framer-motion";
import { metalSpotPerGram } from "@/lib/mock-data";
import { VaultPreferences } from "@/components/ui/vault-preferences";
import { useAuth } from "@/lib/auth-context";
import { usePrices } from "@/lib/price-context";

export type Tab = "Crypto" | "Stocks" | "CS2" | "Commodities" | "Pokémon" | "AI" | "Find" | "PnL";
export const TABS: Tab[] = ["Crypto", "Stocks", "CS2", "Commodities", "Pokémon", "AI", "Find", "PnL"];

const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

interface VaultNavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function VaultNavbar({ activeTab, onTabChange }: VaultNavbarProps) {
  const { portfolio } = useAuth();
  const { crypto: liveCrypto, stocks: liveStocks, metals: liveMetals } = usePrices();

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
        {/* Logo — left */}
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

        {/* Tabs — true center */}
        <div style={{ display: "flex", gap: 0 }}>
          {TABS.map((tab) => (
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
