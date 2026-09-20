interface ExitConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExitConfirmModal({ onConfirm, onCancel }: ExitConfirmModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(23, 32, 29, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "20px",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "440px",
          width: "100%",
          boxShadow: "0 4px 40px rgba(23, 32, 29, 0.12)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            backgroundColor: "#DCEBE4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v7M9 12.5v.5" stroke="#173F35" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2
          style={{
            fontFamily: "Manrope",
            fontSize: "18px",
            fontWeight: 700,
            color: "#17201D",
            margin: "0 0 10px 0",
          }}
        >
          Exit setup?
        </h2>
        <p
          style={{
            fontFamily: "Manrope",
            fontSize: "14px",
            color: "#66716C",
            margin: "0 0 28px 0",
            lineHeight: "1.6",
          }}
        >
          You can complete your research profile later from account settings. Your selections so far won't be saved.
        </p>
        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
          <button
            onClick={onConfirm}
            style={{
              fontFamily: "Manrope",
              fontSize: "14px",
              fontWeight: 600,
              color: "white",
              backgroundColor: "#173F35",
              border: "none",
              borderRadius: "8px",
              padding: "13px 24px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Exit to Home
          </button>
          <button
            onClick={onCancel}
            style={{
              fontFamily: "Manrope",
              fontSize: "14px",
              fontWeight: 500,
              color: "#17201D",
              backgroundColor: "transparent",
              border: "1.5px solid #DDE2DE",
              borderRadius: "8px",
              padding: "12px 24px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Continue setup
          </button>
        </div>
      </div>
    </div>
  );
}
