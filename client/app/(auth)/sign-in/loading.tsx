/**
 * Sign-in route skeleton — shown by Next.js during the Suspense boundary
 * while the page chunk + auth state hydrate.
 */
export default function SignInLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        fontFamily: "Manrope, system-ui, sans-serif",
      }}
      aria-label="Loading sign-in form"
    >
      {/* Heading skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div
          style={{
            height: "32px",
            width: "75%",
            borderRadius: "6px",
            background: "#EEECE6",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: "16px",
            width: "50%",
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

      {/* Divider skeleton */}
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

      {/* Footer skeleton */}
      <div
        style={{
          height: "14px",
          width: "180px",
          borderRadius: "4px",
          background: "#EEECE6",
          margin: "0 auto",
          animation: "pulse 1.5s ease-in-out infinite 0.25s",
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
