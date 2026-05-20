export function EmptyState({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        border: "1px dashed rgba(255,255,255,0.08)",
        borderRadius: 10,
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "1px dashed rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "1.1rem", opacity: 0.3 }}>+</span>
      </div>
      <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.15em", margin: 0 }}>
        {label}
      </p>
    </div>
  );
}
