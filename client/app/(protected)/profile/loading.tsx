/**
 * /app/profile loading skeleton — 3-column shimmer matching the full profile builder layout.
 * Renders instantly as a pure server component with inline styles.
 */
export default function ProfileLoading() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "#F6F4EF",
      }}
      aria-label="Loading profile builder"
    >
      {/* Left rail skeleton — 240px */}
      <div
        style={{
          width: "240px",
          flexShrink: 0,
          background: "#F2F0EB",
          borderRight: "1px solid #DEDAD2",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Logo block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ height: "16px", width: "80px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "10px", width: "140px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite 0.05s" }} />
        </div>

        {/* Strength bar skeleton */}
        <div style={{ padding: "16px", background: "#FFFFFF", border: "1px solid #DEDAD2", borderRadius: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ height: "11px", width: "80px", borderRadius: "3px", background: "#EEECE6", animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ height: "11px", width: "28px", borderRadius: "3px", background: "#EEECE6", animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
          <div style={{ height: "4px", background: "#DEDAD2", borderRadius: "999px" }}>
            <div style={{ height: "100%", width: "55%", background: "#C6DDB9", borderRadius: "999px" }} />
          </div>
        </div>

        {/* Step nav skeletons */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px", borderRadius: "3px",
              background: i === 0 ? "#FFFFFF" : "transparent",
              border: i === 0 ? "1px solid #DEDAD2" : "1px solid transparent",
              animation: `pulse 1.5s ease-in-out infinite ${i * 0.06}s`,
            }}
          >
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: i === 0 ? "#1A1A18" : "#DEDAD2", flexShrink: 0 }} />
            <div style={{ height: "13px", width: `${60 + i * 8}px`, borderRadius: "3px", background: "#EEECE6" }} />
          </div>
        ))}
      </div>

      {/* Center content skeleton — flex-1 */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: "40px 40px 32px", borderBottom: "1px solid #DEDAD2", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ height: "11px", width: "120px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "34px", width: "320px", borderRadius: "4px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite 0.05s" }} />
          <div style={{ height: "15px", width: "440px", borderRadius: "3px", background: "#EEECE6", animation: "pulse 1.5s ease-in-out infinite 0.1s" }} />
        </div>

        {/* Step body */}
        <div style={{ flex: 1, padding: "32px 40px", display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Step header */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ height: "11px", width: "160px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ height: "26px", width: "240px", borderRadius: "4px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite 0.05s" }} />
            <div style={{ height: "14px", width: "200px", borderRadius: "3px", background: "#EEECE6", animation: "pulse 1.5s ease-in-out infinite 0.1s" }} />
          </div>

          {/* Photo row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "#DEDAD2", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
              <div style={{ height: "32px", width: "110px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: "12px", width: "180px", borderRadius: "3px", background: "#EEECE6", animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>

          {/* Fields */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ height: "11px", width: "80px", borderRadius: "3px", background: "#DEDAD2", animation: `pulse 1.5s ease-in-out infinite ${i * 0.07}s` }} />
              <div style={{ height: "40px", borderRadius: "4px", border: "1px solid #DEDAD2", background: "#F7F6F1", animation: `pulse 1.5s ease-in-out infinite ${i * 0.07 + 0.04}s` }} />
            </div>
          ))}
        </div>

        {/* Bottom action bar skeleton */}
        <div
          style={{
            padding: "20px 40px",
            borderTop: "1px solid #DEDAD2",
            background: "#F6F4EF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ height: "36px", width: "80px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ height: "36px", width: "140px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite 0.05s" }} />
            <div style={{ height: "36px", width: "100px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite 0.1s" }} />
          </div>
        </div>
      </main>

      {/* Right preview skeleton — 340px */}
      <div
        style={{
          width: "340px",
          flexShrink: 0,
          background: "#F2F0EB",
          borderLeft: "1px solid #DEDAD2",
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Preview header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingBottom: "16px", borderBottom: "1px solid #DEDAD2" }}>
          <div style={{ height: "10px", width: "70px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "11px", width: "120px", borderRadius: "3px", background: "#EEECE6", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>

        {/* Profile card */}
        <div style={{ background: "#FFFFFF", border: "1px solid #DEDAD2", borderRadius: "4px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "18px", width: "100px", borderRadius: "3px", background: "#DEDAD2", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "12px", width: "140px", borderRadius: "3px", background: "#EEECE6", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: "12px", width: "110px", borderRadius: "3px", background: "#EEECE6", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>

        {/* Cards */}
        {[100, 80, 120].map((w, i) => (
          <div key={i} style={{ background: "#FFFFFF", border: "1px solid #DEDAD2", borderRadius: "4px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ height: "10px", width: `${w}px`, borderRadius: "3px", background: "#DEDAD2", animation: `pulse 1.5s ease-in-out infinite ${i * 0.07}s` }} />
            <div style={{ height: "36px", borderRadius: "3px", background: "#EEECE6", animation: `pulse 1.5s ease-in-out infinite ${i * 0.07 + 0.05}s` }} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
