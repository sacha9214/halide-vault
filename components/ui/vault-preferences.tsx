"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function VaultPreferences() {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ rotate: 60, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: open ? "rgba(224,224,224,0.8)" : "rgba(224,224,224,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0.3rem",
          transition: "color 0.2s",
        }}
        aria-label="Preferences"
      >
        <Settings size={17} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              right: 0,
              width: 220,
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              overflow: "hidden",
              zIndex: 200,
            }}
          >
            {/* Header */}
            <div style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontFamily: "monospace", fontSize: "0.58rem",
              color: "rgba(224,224,224,0.3)", letterSpacing: "0.15em",
            }}>
              PREFERENCES
            </div>

            {/* Account section */}
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{
                fontFamily: "monospace", fontSize: "0.55rem",
                color: "rgba(224,224,224,0.25)", letterSpacing: "0.12em", marginBottom: "0.6rem",
              }}>
                ACCOUNT
              </div>

              {user ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
                    ) : (
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <User size={14} color="rgba(224,224,224,0.4)" />
                      </div>
                    )}
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#e0e0e0", fontWeight: 700 }}>
                        {user.displayName || "User"}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.35)", marginTop: 1 }}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => { signOutUser(); setOpen(false); }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem", width: "100%",
                      fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.08em",
                      color: "#ef4444", background: "rgba(239,68,68,0.06)",
                      border: "1px solid rgba(239,68,68,0.15)", borderRadius: 6,
                      padding: "0.45rem 0.75rem", cursor: "pointer",
                    }}
                  >
                    <LogOut size={12} />
                    SIGN OUT
                  </motion.button>
                </>
              ) : (
                <>
                  <p style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.35)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                    Sign in to save your portfolio across devices.
                  </p>
                  <motion.button
                    onClick={() => { signInWithGoogle(); setOpen(false); }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.6rem", width: "100%",
                      fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.08em",
                      color: "#e0e0e0", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6,
                      padding: "0.45rem 0.75rem", cursor: "pointer",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    SIGN IN WITH GOOGLE
                  </motion.button>
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "0.6rem 1rem" }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.15)", letterSpacing: "0.1em" }}>
                VAULT · v0.1
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
