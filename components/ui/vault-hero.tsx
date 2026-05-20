"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { metalSpotPerGram } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { usePrices } from "@/lib/price-context";

const fmtShort = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

function AnimatedCounter({ target, duration = 1600 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <>{fmtShort(count)}</>;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { type: "spring", stiffness: 260, damping: 28, delay },
});

export function VaultHero() {
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

  const categories = [
    { label: "CRYPTO", value: cryptoTotal, color: "#22d3ee" },
    { label: "STOCKS", value: stockTotal, color: "#38bdf8" },
    { label: "CS2", value: cs2Total, color: "#f97316" },
    { label: "COMMODITIES", value: goldTotal, color: "#f5c542" },
    { label: "POKÉMON", value: pokemonTotal, color: "#facc15" },
  ];

  return (
    <section
      style={{
        paddingTop: "9rem",
        paddingBottom: "4rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        marginBottom: "3rem",
      }}
    >
      <motion.p
        {...fadeUp(0.1)}
        style={{
          fontFamily: "monospace",
          fontSize: "0.65rem",
          color: "rgba(224,224,224,0.35)",
          letterSpacing: "0.25em",
          marginBottom: "1.25rem",
        }}
      >
        TOTAL NET WORTH
      </motion.p>

      <motion.h1
        {...fadeUp(0.2)}
        style={{
          fontFamily: "var(--font-syncopate)",
          fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
          fontWeight: 700,
          color: "#e0e0e0",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginBottom: "0.75rem",
        }}
      >
        <AnimatedCounter target={grandTotal} />
      </motion.h1>

      <motion.p
        {...fadeUp(0.3)}
        style={{
          fontFamily: "monospace",
          fontSize: "0.7rem",
          color: "rgba(224,224,224,0.25)",
          letterSpacing: "0.3em",
          marginBottom: "3rem",
        }}
      >
        YOUR PERSONAL ASSET TRACKER
      </motion.p>

      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.4 + i * 0.07 }}
            whileHover={{ scale: 1.06, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.45rem 1rem",
              border: `1px solid ${cat.color}30`,
              borderRadius: 4,
              background: `${cat.color}0d`,
              cursor: "default",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ delay: 0.7 + i * 0.07, duration: 0.35, ease: "easeInOut" }}
              style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: cat.color, flexShrink: 0 }}
            />
            <span style={{ fontFamily: "monospace", fontSize: "0.6rem", color: cat.color, letterSpacing: "0.12em" }}>
              {cat.label}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#e0e0e0", fontWeight: 700 }}>
              {fmtShort(cat.value)}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
