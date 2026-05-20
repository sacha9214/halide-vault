"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VaultGrain } from "@/components/ui/vault-grain";
import { VaultNavbar, type Tab, TABS } from "@/components/ui/vault-navbar";
import { VaultHero } from "@/components/ui/vault-hero";
import { VaultCrypto } from "@/components/ui/vault-crypto";
import { VaultCS2 } from "@/components/ui/vault-cs2";
import { VaultGold } from "@/components/ui/vault-gold";
import { VaultPokemon } from "@/components/ui/vault-pokemon";
import { VaultAI } from "@/components/ui/vault-ai";
import { VaultStocks } from "@/components/ui/vault-stocks";
import { VaultFind } from "@/components/ui/vault-find";
import { VaultPnL } from "@/components/ui/vault-pnl";

const sections: Record<Tab, React.ReactNode> = {
  Crypto: <VaultCrypto />,
  Stocks: <VaultStocks />,
  CS2: <VaultCS2 />,
  Commodities: <VaultGold />,
  "Pokémon": <VaultPokemon />,
  AI: <VaultAI />,
  Find: <VaultFind />,
  PnL: <VaultPnL />,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Crypto");
  const dirRef = useRef(0);

  const handleTabChange = (tab: Tab) => {
    const prev = TABS.indexOf(activeTab);
    const next = TABS.indexOf(tab);
    dirRef.current = next > prev ? 1 : -1;
    setActiveTab(tab);
  };

  const dir = dirRef.current;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#e0e0e0" }}
    >
      <VaultGrain />
      <VaultNavbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem", overflow: "hidden" }}>
        <VaultHero />

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={activeTab}
            custom={dir}
            initial={{ opacity: 0, x: dir * 32, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -24, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
          >
            {sections[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          textAlign: "center",
          padding: "2.5rem 2rem",
          fontFamily: "monospace",
          fontSize: "0.6rem",
          color: "rgba(224,224,224,0.18)",
          letterSpacing: "0.18em",
        }}
      >
        VAULT · LAST UPDATED{" "}
        {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }).toUpperCase()}
        {" "}· ALL VALUES ARE ESTIMATES
      </motion.footer>
    </motion.div>
  );
}
