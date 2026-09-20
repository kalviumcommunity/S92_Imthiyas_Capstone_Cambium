import { useState } from "react";
import SetupShell, { BottomNav, PageTitle } from "../components/SetupShell";
import { SetupData } from "../App";

interface Props {
  isMobile: boolean;
  setupData: SetupData;
  updateSetup: (patch: Partial<SetupData>) => void;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}

const SUGGESTED_TOPICS = [
  "Federated Learning",
  "Foundation Models",
  "Medical Imaging AI",
  "Self-Supervised Learning",
  "Graph Neural Networks",
  "Clinical AI",
  "Explainable AI",
  "Diffusion Models",
  "Contrastive Learning",
  "Multimodal Learning",
  "Neural Architecture Search",
  "Privacy-Preserving ML",
  "Causal Inference",
  "Genomic Foundation Models",
  "Protein Structure Prediction",
  "Transfer Learning",
  "Reinforcement Learning from Feedback",
  "Sparse Transformers",
];

export default function ResearchTopics({ isMobile, setupData, updateSetup, onBack, onContinue, onSkip }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(setupData.topics);
  const [customInput, setCustomInput] = useState("");

  const filtered = SUGGESTED_TOPICS.filter(
    (t) =>
      t.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(t)
  );

  const toggle = (topic: string) => {
    const next = selected.includes(topic)
      ? selected.filter((t) => t !== topic)
      : [...selected, topic];
    setSelected(next);
    updateSetup({ topics: next });
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (val && !selected.includes(val)) {
      const next = [...selected, val];
      setSelected(next);
      updateSetup({ topics: next });
      setCustomInput("");
    }
  };

  return (
    <>
      <SetupShell isMobile={isMobile}>
        <PageTitle subtitle="Choose the specific topics that matter to your work. Recommendations are suggestions — only what you select will be added.">
          Choose topics that matter to your work.
        </PageTitle>

        {/* Search / Add */}
        <div style={{ position: "relative", marginBottom: "8px" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="7" cy="7" r="4.5" stroke="#66716C" strokeWidth="1.5" />
            <path d="M10.5 10.5l2.5 2.5" stroke="#66716C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search or add a topic…"
            value={search || customInput}
            onChange={(e) => {
              const v = e.target.value;
              setSearch(v);
              setCustomInput(v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") addCustom();
            }}
            style={{
              width: "100%",
              fontFamily: "Manrope",
              fontSize: "14px",
              color: "#17201D",
              backgroundColor: "#FFFFFF",
              border: "1.5px solid #DDE2DE",
              borderRadius: "8px",
              padding: "11px 14px 11px 40px",
              outline: "none",
              boxSizing: "border-box",
              minHeight: "44px",
            }}
          />
          {customInput.trim() && (
            <button
              onClick={addCustom}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "Manrope",
                fontSize: "12px",
                fontWeight: 600,
                color: "#173F35",
                backgroundColor: "#DCEBE4",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          )}
        </div>
        <p style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C", margin: "0 0 20px 0" }}>
          Press Enter or click Add to include a custom topic.
        </p>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontFamily: "Manrope",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#66716C",
                marginBottom: "10px",
              }}
            >
              Selected ({selected.length})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {selected.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggle(topic)}
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#173F35",
                    backgroundColor: "#DCEBE4",
                    border: "1.5px solid #285C4D",
                    borderRadius: "100px",
                    padding: "7px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    minHeight: "36px",
                  }}
                >
                  {topic}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M9 3L3 9M3 3l6 6" stroke="#285C4D" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {filtered.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: "Manrope",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#66716C",
                marginBottom: "10px",
              }}
            >
              Suggestions — not automatically selected
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {filtered.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggle(topic)}
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#17201D",
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #DDE2DE",
                    borderRadius: "100px",
                    padding: "7px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    minHeight: "36px",
                    transition: "all 0.1s ease",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v8M2 6h8" stroke="#66716C" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </SetupShell>

      <BottomNav
        isMobile={isMobile}
        onBack={onBack}
        onContinue={onContinue}
        onSkip={onSkip}
        showSkip
        skipLabel="Skip for now"
        continueLabel="Continue"
        continueDisabled={selected.length === 0}
      />
    </>
  );
}
