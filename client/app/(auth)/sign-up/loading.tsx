/**
 * Sign-up route skeleton — mirrors the sign-up form structure for a
 * zero-layout-shift loading experience.
 */
export default function SignUpLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        fontFamily: "Manrope, system-ui, sans-serif",
      }}
      aria-label="Loading sign-up form"
    >
      {/* Heading skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div
          style={{
            height: "32px",
            width: "80%",
            borderRadius: "6px",
            background: "#EEECE6",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: "16px",
            width: "55%",
            borderRadius: "6px",
            background: "#EEECE6",
            animation: "pulse 1.5s ease-in-out infinite 0.1s",
          }}
        />
      </div>

      {/* OAuth skeletons × 3 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              height: "40px",
              borderRadius: "6px",
              border: "1px solid #DDE2DE",
              background: "#F7F6F1",
              animation: `pulse 1.5s ease-in-out infinite ${i * 0.07}s`,
            }}
          />
        ))}
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ flex: 1, height: "1px", background: "#DDE2DE" }} />
        <div
          style={{
            height: "12px",
            width: "140px",
            borderRadius: "6px",
            background: "#EEECE6",
          }}
        />
        <div style={{ flex: 1, height: "1px", background: "#DDE2DE" }} />
      </div>

      {/* Email + Password skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                height: "14px",
                width: "100px",
                borderRadius: "4px",
                background: "#EEECE6",
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`,
              }}
            />
            <div
              style={{
                height: "40px",
                borderRadius: "6px",
                border: "1px solid #DDE2DE",
                background: "#F7F6F1",
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.1 + 0.05}s`,
              }}
            />
          </div>
        ))}

        {/* Submit skeleton */}
        <div
          style={{
            height: "40px",
            borderRadius: "6px",
            background: "#DDE2DE",
            marginTop: "4px",
            animation: "pulse 1.5s ease-in-out infinite 0.2s",
          }}
        />
      </div>

      {/* Footer skeletons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        {[140, 200, 220].map((w, i) => (
          <div
            key={i}
            style={{
              height: "12px",
              width: `${w}px`,
              borderRadius: "4px",
              background: "#EEECE6",
              animation: `pulse 1.5s ease-in-out infinite ${0.25 + i * 0.05}s`,
            }}
          />
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
