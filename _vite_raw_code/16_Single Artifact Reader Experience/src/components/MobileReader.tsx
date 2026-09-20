import { useState } from "react";

export default function MobileReader() {
  const [activeSheet, setActiveSheet] = useState<"none" | "intelligence" | "notes">("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        background: "#F7F6F1",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        borderRadius: "12px",
        position: "relative",
        boxShadow: "0 20px 60px rgba(23,32,29,0.3)",
      }}
    >
      {/* Mobile Top Bar */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #DDE2DE",
          padding: "0 16px",
          height: "52px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <button
          style={{
            padding: "7px 10px",
            background: "transparent",
            border: "1px solid #DDE2DE",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            color: "#66716C",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <span
          style={{
            flex: 1,
            fontSize: "13px",
            fontWeight: 600,
            color: "#17201D",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Attention Is All You Need
        </span>
        <button
          onClick={() => setIsSaved(!isSaved)}
          style={{
            padding: "7px 8px",
            background: isSaved ? "#173F35" : "transparent",
            border: "1px solid",
            borderColor: isSaved ? "#173F35" : "#DDE2DE",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "15px",
            color: isSaved ? "#DCEBE4" : "#66716C",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {isSaved ? "★" : "☆"}
        </button>
        <button
          style={{
            padding: "7px 8px",
            background: "transparent",
            border: "1px solid #DDE2DE",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            color: "#66716C",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ⋯
        </button>
      </div>

      {/* Page controls strip */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #DDE2DE",
          padding: "0 16px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          style={{ ...mobileNavBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
        >
          ‹
        </button>
        <span style={{ fontSize: "12px", color: "#66716C", fontWeight: 500 }}>
          {currentPage} / 42
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(42, currentPage + 1))}
          style={{ ...mobileNavBtn, opacity: currentPage === 42 ? 0.4 : 1 }}
        >
          ›
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "12px", color: "#66716C" }}>NeurIPS 2024</span>
      </div>

      {/* Main Reading Area */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 20px 120px" }}>
        {/* Title area */}
        <div style={{ marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #DDE2DE" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#66716C", marginBottom: "10px" }}>
            Full Paper · NeurIPS 2024
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "20px",
              lineHeight: 1.35,
              color: "#17201D",
              marginBottom: "12px",
            }}
          >
            Attention Is All You Need: Revisiting Transformer Architectures for Long-Context Reasoning
          </h1>
          <p style={{ fontSize: "12px", color: "#66716C", lineHeight: 1.6, marginBottom: "10px" }}>
            Vaswani, A., Shazeer, N., Parmar, N., et al.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", color: "#285C4D", fontWeight: 600 }}>10.48550/arXiv.2024.17823</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#285C4D", marginBottom: "10px" }}>
            Abstract
          </h2>
          <p style={{ fontSize: "14px", lineHeight: 1.75, color: "#17201D" }}>
            The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.
          </p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#285C4D", marginBottom: "10px" }}>
            1. Introduction
          </h2>
          <p style={{ fontSize: "14px", lineHeight: 1.75, color: "#17201D" }}>
            Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation.
            <br /><br />
            In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.
          </p>
        </div>

        <div
          style={{
            height: "100px",
            background: "#FFFFFF",
            border: "1px dashed #DDE2DE",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#66716C" }}>Figure 1 — Transformer Architecture</span>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FFFFFF",
          borderTop: "1px solid #DDE2DE",
          display: "flex",
          flexShrink: 0,
        }}
      >
        {[
          { id: "intelligence" as const, label: "Intelligence", icon: "◎" },
          { id: "notes" as const, label: "Notes", icon: "✎" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSheet(activeSheet === tab.id ? "none" : tab.id)}
            style={{
              flex: 1,
              padding: "12px 8px",
              background: activeSheet === tab.id ? "#173F35" : "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              transition: "background 0.15s",
            }}
          >
            <span style={{ fontSize: "18px", color: activeSheet === tab.id ? "#DCEBE4" : "#66716C" }}>
              {tab.icon}
            </span>
            <span style={{ fontSize: "10px", fontWeight: 600, color: activeSheet === tab.id ? "#DCEBE4" : "#66716C", letterSpacing: "0.04em" }}>
              {tab.label}
            </span>
          </button>
        ))}
        <button
          style={{
            flex: 1,
            padding: "12px 8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
          }}
        >
          <span style={{ fontSize: "18px", color: "#66716C" }}>↗</span>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "#66716C", letterSpacing: "0.04em" }}>Share</span>
        </button>
      </div>

      {/* Bottom Sheet — Intelligence */}
      {activeSheet === "intelligence" && (
        <div
          style={{
            position: "absolute",
            bottom: "72px",
            left: 0,
            right: 0,
            height: "460px",
            background: "#FFFFFF",
            borderTop: "1px solid #DDE2DE",
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 -4px 24px rgba(23,32,29,0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 0 0", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "36px", height: "4px", background: "#DDE2DE", borderRadius: "2px" }} />
          </div>
          <div style={{ padding: "12px 20px 8px", borderBottom: "1px solid #DDE2DE" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#17201D" }}>Research Intelligence</div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
            {/* Quick actions */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
              {["Summarize", "Key findings", "Methods", "Limitations", "Gaps"].map((a) => (
                <button
                  key={a}
                  onClick={() => setShowResponse(true)}
                  style={{
                    padding: "6px 12px",
                    background: "#F7F6F1",
                    border: "1px solid #DDE2DE",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#17201D",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask about this paper..."
                style={{
                  width: "100%",
                  padding: "10px 52px 10px 12px",
                  fontSize: "13px",
                  background: "#F7F6F1",
                  border: "1px solid #DDE2DE",
                  borderRadius: "8px",
                  color: "#17201D",
                  outline: "none",
                  fontFamily: "var(--font-sans)",
                }}
              />
              <button
                onClick={() => setShowResponse(true)}
                style={{
                  position: "absolute",
                  right: "6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "5px 10px",
                  background: "#173F35",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#DCEBE4",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Ask
              </button>
            </div>

            {/* Response */}
            {showResponse && (
              <div style={{ borderTop: "1px solid #DDE2DE", paddingTop: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#285C4D", marginBottom: "8px" }}>
                  Response
                </div>
                <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#17201D", marginBottom: "12px" }}>
                  The Transformer replaces recurrent layers entirely with self-attention, enabling parallel computation. Multi-head attention allows the model to jointly attend to information from different subspaces — achieving BLEU improvements of 2+ points on EN-DE translation.
                </p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["Abstract", "p. 3–4", "p. 7"].map((p) => (
                    <span key={p} style={{ padding: "3px 8px", background: "#DCEBE4", borderRadius: "4px", fontSize: "11px", fontWeight: 600, color: "#173F35" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Sheet — Notes */}
      {activeSheet === "notes" && (
        <div
          style={{
            position: "absolute",
            bottom: "72px",
            left: 0,
            right: 0,
            height: "420px",
            background: "#FFFFFF",
            borderTop: "1px solid #DDE2DE",
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 -4px 24px rgba(23,32,29,0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 0 0", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "36px", height: "4px", background: "#DDE2DE", borderRadius: "2px" }} />
          </div>
          <div style={{ padding: "12px 20px 8px", borderBottom: "1px solid #DDE2DE" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#17201D" }}>Notes</div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
            {/* New note input */}
            <textarea
              placeholder="Write a note about this paper..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "13px",
                background: "#F7F6F1",
                border: "1px solid #DDE2DE",
                borderRadius: "8px",
                color: "#17201D",
                outline: "none",
                resize: "none",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.5,
                marginBottom: "12px",
              }}
            />
            <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
              {["Key Takeaway", "Question", "Action"].map((t) => (
                <button
                  key={t}
                  style={{
                    padding: "5px 10px",
                    background: "transparent",
                    border: "1px solid #DDE2DE",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#66716C",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {t}
                </button>
              ))}
              <button
                style={{
                  marginLeft: "auto",
                  padding: "5px 14px",
                  background: "#173F35",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#DCEBE4",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Add
              </button>
            </div>

            {/* Existing notes */}
            <div style={{ borderTop: "1px solid #DDE2DE", paddingTop: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#66716C", marginBottom: "10px" }}>
                2 Notes
              </div>
              {[
                { type: "key-takeaway", text: "Self-attention allows O(1) path length between any two positions.", page: "p. 4", border: "#285C4D" },
                { type: "research-question", text: "How does positional encoding scale beyond training sequence length?", page: "p. 5", border: "#8B7A35" },
              ].map((note, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: `3px solid ${note.border}`,
                    padding: "8px 10px",
                    marginBottom: "8px",
                    background: "#F7F6F1",
                    borderRadius: "0 5px 5px 0",
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: 700, color: note.border, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    {note.type.replace("-", " ")} · {note.page}
                  </div>
                  <p style={{ fontSize: "13px", color: "#17201D", lineHeight: 1.5 }}>{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const mobileNavBtn: React.CSSProperties = {
  padding: "4px 8px",
  background: "transparent",
  border: "1px solid #DDE2DE",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  color: "#66716C",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "28px",
  minHeight: "28px",
};
