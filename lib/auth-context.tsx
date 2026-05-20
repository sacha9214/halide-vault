"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { loadPortfolio, savePortfolio, type PortfolioData } from "./firestore";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  portfolio: PortfolioData | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updatePortfolio: (data: PortfolioData) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

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

const LS_KEY = "halide_portfolio";

function lsSave(data: PortfolioData) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}

function lsLoad(): PortfolioData | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...emptyPortfolio, ...JSON.parse(raw) } : null;
  } catch { return null; }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);

  useEffect(() => {
    if (!auth) {
      const local = lsLoad();
      setPortfolio(local ?? emptyPortfolio);
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Show local data immediately while Firestore loads
        const local = lsLoad();
        if (local) setPortfolio(local);

        try {
          const data = await loadPortfolio(u.uid);
          const hasFirestoreData = Object.values(data).some((arr) => (arr as unknown[]).length > 0);
          if (hasFirestoreData) {
            setPortfolio(data);
            lsSave(data);
          } else if (local) {
            // Firestore empty but we have local data — sync it up
            setPortfolio(local);
            await savePortfolio(u.uid, local);
          } else {
            setPortfolio(emptyPortfolio);
          }
        } catch {
          setPortfolio(local ?? emptyPortfolio);
        }
      } else {
        setPortfolio(emptyPortfolio);
      }
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = async () => {
    if (auth) await signInWithPopup(auth, googleProvider);
  };

  const signOutUser = async () => {
    if (auth) await signOut(auth);
    localStorage.removeItem(LS_KEY);
    setPortfolio(emptyPortfolio);
  };

  const updatePortfolio = async (data: PortfolioData) => {
    setPortfolio(data);
    lsSave(data);
    if (user) savePortfolio(user.uid, data).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, loading, portfolio, signInWithGoogle, signOutUser, updatePortfolio }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
