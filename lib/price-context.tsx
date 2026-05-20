"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

export type LivePrices = {
  crypto: Record<string, { price: number; change24h: number }>;
  stocks: Record<string, { price: number; change1d: number }>;
  metals: Record<string, number>; // USD per gram
  lastUpdated: Date | null;
  isLoading: boolean;
};

const defaultPrices: LivePrices = {
  crypto: {},
  stocks: {},
  metals: {},
  lastUpdated: null,
  isLoading: true,
};

const PriceContext = createContext<LivePrices>(defaultPrices);

export function usePrices() {
  return useContext(PriceContext);
}

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<LivePrices>(defaultPrices);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh() {
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) return;
      const json = await res.json();
      setPrices({
        crypto: json.crypto ?? {},
        stocks: json.stocks ?? {},
        metals: json.metals ?? {},
        lastUpdated: new Date(),
        isLoading: false,
      });
    } catch {
      setPrices((prev) => ({ ...prev, isLoading: false }));
    }
  }

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, 60_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return <PriceContext.Provider value={prices}>{children}</PriceContext.Provider>;
}
