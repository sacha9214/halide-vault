import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { CryptoAsset, StockAsset, CS2Skin, CS2Case, GoldItem, PokemonCard, PokemonFigure } from "./mock-data";

export interface CustomAsset {
  id: string;
  name: string;
  symbol: string;
  category: "crypto" | "stock";
  coingeckoId?: string;
  ticker?: string;
  amount: number;
  price: number;
  change1d?: number;
}

export interface PortfolioData {
  cryptoAssets: CryptoAsset[];
  stockAssets: StockAsset[];
  cs2Skins: CS2Skin[];
  cs2Cases: CS2Case[];
  goldItems: GoldItem[];
  pokemonCards: PokemonCard[];
  pokemonFigures: PokemonFigure[];
  customAssets: CustomAsset[];
}

const emptyPortfolio: PortfolioData = {
  cryptoAssets: [],
  stockAssets: [],
  cs2Skins: [],
  cs2Cases: [],
  goldItems: [],
  pokemonCards: [],
  pokemonFigures: [],
  customAssets: [],
};

export async function loadPortfolio(uid: string): Promise<PortfolioData> {
  const ref = doc(db, "portfolios", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return emptyPortfolio;
  return { ...emptyPortfolio, ...snap.data() } as PortfolioData;
}

export async function savePortfolio(uid: string, data: PortfolioData): Promise<void> {
  if (!db) { console.error("Firestore not initialized"); return; }
  try {
    const ref = doc(db, "portfolios", uid);
    await setDoc(ref, data);
  } catch (e) {
    console.error("savePortfolio failed:", e);
  }
}
