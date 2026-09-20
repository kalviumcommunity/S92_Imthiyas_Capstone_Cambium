import { useState } from "react";
import DesktopReader from "./components/DesktopReader";
import MobileReader from "./components/MobileReader";

type Frame =
  | "default"
  | "intelligence"
  | "notes"
  | "selection"
  | "saved"
  | "error";

const frames: { id: Frame; label: string }[] = [
  { id: "default", label: "1 · Default" },
  { id: "intelligence", label: "2 · AI Intelligence Open" },
  { id: "notes", label: "3 · Notes Open" },
  { id: "selection", label: "4 · Text Selection" },
  { id: "saved", label: "5 · Saved State" },
  { id: "error", label: "6 · Error / Unavailable" },
];

export default function App() {
  const [activeFrame, setActiveFrame] = useState<Frame>("default");
  const [showMobile, setShowMobile] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#17201D",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Frame Navigator */}
      <div
        style={{
          background: "#17201D",
          borderBottom: "1px solid #2a3530",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            color: "#66716C",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginRight: "8px",
          }}
        >
          Cambium · Screen 16
        </span>
        {frames.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setActiveFrame(f.id);
              setShowMobile(false);
            }}
            style={{
              padding: "5px 14px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
              border: "1px solid",
              cursor: "pointer",
              transition: "all 0.15s",
              background:
                activeFrame === f.id && !showMobile
                  ? "#173F35"
                  : "transparent",
              borderColor:
                activeFrame === f.id && !showMobile ? "#285C4D" : "#2a3530",
              color:
                activeFrame === f.id && !showMobile ? "#DCEBE4" : "#66716C",
            }}
          >
            {f.label}
          </button>
        ))}
        <div style={{ width: "1px", height: "20px", background: "#2a3530", margin: "0 4px" }} />
        <button
          onClick={() => setShowMobile(true)}
          style={{
            padding: "5px 14px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,
            border: "1px solid",
            cursor: "pointer",
            transition: "all 0.15s",
            background: showMobile ? "#173F35" : "transparent",
            borderColor: showMobile ? "#285C4D" : "#2a3530",
            color: showMobile ? "#DCEBE4" : "#66716C",
          }}
        >
          7 · Mobile 390px
        </button>
      </div>

      {/* Frame Canvas */}
      {showMobile ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 24px",
            background: "#17201D",
            minHeight: "calc(100vh - 57px)",
          }}
        >
          <div style={{ width: "390px" }}>
            <MobileReader />
          </div>
        </div>
      ) : (
        <div
          style={{
            minHeight: "calc(100vh - 57px)",
            background: "#F7F6F1",
          }}
        >
          <DesktopReader frame={activeFrame} />
        </div>
      )}
    </div>
  );
}
