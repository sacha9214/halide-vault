"use client";

export function VaultGrain() {
  return (
    <>
      <svg style={{ position: "fixed", width: 0, height: 0, top: 0, left: 0 }}>
        <filter id="vault-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        style={{
          position: "fixed",
          inset: 0,
          filter: "url(#vault-grain-filter)",
          opacity: 0.07,
          pointerEvents: "none",
          zIndex: 999,
        }}
      />
    </>
  );
}
