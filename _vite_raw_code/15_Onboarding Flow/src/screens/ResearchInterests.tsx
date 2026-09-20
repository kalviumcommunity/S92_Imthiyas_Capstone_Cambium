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

const ALL_INTERESTS = [
  "Scientific ML",
  "Computational Biology",
  "Machine Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics",
  "Bioinformatics",
  "Medical Imaging",
  "Human-Computer Interaction",
  "Data Science",
  "Quantum Computing",
  "Systems Biology",
  "Computational Neuroscience",
  "Climate Modeling",
  "Materials Informatics",
];

export default function ResearchInterests({ isMobile, setupData, updateSetup, onBack, onContinue, onSkip }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(setupData.interests);

  const filtered = ALL_INTERESTS.filter((i) =>
    i.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (interest: string) => {
    const next = selected.includes(interest)
      ? selected.filter((i) => i !== interest)
      : [...selected, interest];
    setSelected(next);
    updateSetup({ interests: next });
  };

  return (
    <>
      <SetupShell isMobile={isMobile}>
        <PageTitle subtitle="Select the broad areas that define your research. These help Cambium surface relevant literature, collaborators, and tools.">
          What are you exploring?
        </PageTitle>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
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
            placeholder="Search interests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        </div>

        {/* Selected count */}
        {selected.length > 0 && (
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                backgroundColor: "#173F35",
                color: "white",
                borderRadius: "100px",
                padding: "2px 10px",
                fontFamily: "Manrope",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {selected.length} selected
            </div>
            <button
              onClick={() => { setSelected([]); updateSetup({ interests: [] }); }}
              style={{
                fontFamily: "Manrope",
                fontSize: "11px",
                color: "#66716C",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Chips grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          {filtered.map((interest) => {
            const isSelected = selected.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggle(interest)}
                style={{
                  fontFamily: "Manrope",
                  fontSize: "13px",
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? "#173F35" : "#17201D",
                  backgroundColor: isSelected ? "#DCEBE4" : "#FFFFFF",
                  border: `1.5px solid ${isSelected ? "#285C4D" : "#DDE2DE"}`,
                  borderRadius: "100px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  minHeight: "36px",
                  transition: "all 0.12s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {interest}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ fontFamily: "Manrope", fontSize: "14px", color: "#66716C", padding: "16px 0" }}>
              No interests found for "{search}"
            </div>
          )}
        </div>

        {/* Selected summary */}
        {selected.length > 0 && (
          <div
            style={{
              backgroundColor: "#F7F6F1",
              border: "1px solid #DDE2DE",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
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
              Your selection
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {selected.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#173F35",
                    backgroundColor: "#DCEBE4",
                    borderRadius: "100px",
                    padding: "4px 10px",
                  }}
                >
                  {s}
                </span>
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
