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

type OrcidState = "idle" | "connecting" | "connected" | "error";

export default function ConnectORCID({ isMobile, setupData, updateSetup, onBack, onContinue, onSkip }: Props) {
  const [orcidState, setOrcidState] = useState<OrcidState>(
    setupData.orcidConnected ? "connected" : "idle"
  );

  const handleConnect = () => {
    setOrcidState("connecting");
    setTimeout(() => {
      setOrcidState("connected");
      updateSetup({
        orcidConnected: true,
        orcidName: "Dr. Sarah Chen",
        orcidId: "0000-0002-1234-5678",
        publications: [
          { id: "p1", title: "Federated Learning for Clinical Decision Support", authors: "Chen S., Park J., Williams M.", year: 2024, venue: "Nature Machine Intelligence", selected: true, imported: false, source: "orcid" },
          { id: "p2", title: "Self-Supervised Representations in Medical Imaging", authors: "Chen S., Kumar A.", year: 2023, venue: "NeurIPS 2023", selected: true, imported: false, source: "orcid" },
          { id: "p3", title: "Graph Neural Networks for Drug Interaction Prediction", authors: "Chen S., Liu R., Park J.", year: 2023, venue: "Bioinformatics", selected: true, imported: false, source: "orcid" },
          { id: "p4", title: "Explainability Methods in Clinical AI Systems", authors: "Chen S., Thompson K.", year: 2022, venue: "JAMIA", selected: false, imported: false, source: "orcid" },
          { id: "p5", title: "Scalable Attention Mechanisms for Genomic Sequences", authors: "Chen S., Li H., Park J.", year: 2022, venue: "ICML 2022", selected: false, imported: false, source: "orcid" },
        ],
      });
    }, 1800);
  };

  const handleDisconnect = () => {
    setOrcidState("idle");
    updateSetup({ orcidConnected: false, orcidName: "", orcidId: "", publications: [] });
  };

  return (
    <>
      <SetupShell isMobile={isMobile}>
        <PageTitle
          subtitle="ORCID is a free, unique identifier for researchers. Connecting it brings your academic profile and publication history into Cambium automatically."
        >
          Connect your academic identity.
        </PageTitle>

        {/* ORCID Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: `1.5px solid ${orcidState === "connected" ? "#285C4D" : "#DDE2DE"}`,
            borderRadius: "12px",
            padding: "28px",
            marginBottom: "24px",
            transition: "border-color 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "#A6CE39",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: "13px", color: "white", letterSpacing: "-0.02em" }}>
                iD
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Manrope", fontSize: "16px", fontWeight: 700, color: "#17201D", marginBottom: "4px" }}>
                ORCID
              </div>
              <div style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C", lineHeight: "1.5" }}>
                Open Researcher and Contributor ID
              </div>
            </div>
            {orcidState === "connected" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#DCEBE4",
                  borderRadius: "100px",
                  padding: "5px 10px",
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#285C4D" }} />
                <span style={{ fontFamily: "Manrope", fontSize: "11px", fontWeight: 600, color: "#285C4D" }}>Connected</span>
              </div>
            )}
          </div>

          {orcidState === "idle" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                {["Import your publication list automatically", "Verify your academic affiliations", "Link your research identity across platforms"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#DCEBE4" />
                      <path d="M4 7l2 2 4-4" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleConnect}
                style={{
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "white",
                  backgroundColor: "#173F35",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  cursor: "pointer",
                  width: "100%",
                  minHeight: "44px",
                }}
              >
                Connect ORCID
              </button>
            </>
          )}

          {orcidState === "connecting" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: "12px" }}>
              <ConnectingSpinner />
              <span style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C" }}>
                Connecting to ORCID…
              </span>
            </div>
          )}

          {orcidState === "connected" && (
            <div>
              <div
                style={{
                  backgroundColor: "#F7F6F1",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600, color: "#17201D", marginBottom: "2px" }}>
                  {setupData.orcidName}
                </div>
                <div style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C", fontVariantNumeric: "tabular-nums" }}>
                  {setupData.orcidId}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#DCEBE4",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8l4 4 8-8" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily: "Manrope", fontSize: "13px", color: "#173F35", fontWeight: 500 }}>
                  {setupData.publications.length} publications found and ready to import
                </span>
              </div>
              <button
                onClick={handleDisconnect}
                style={{
                  fontFamily: "Manrope",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#66716C",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                }}
              >
                Disconnect ORCID
              </button>
            </div>
          )}

          {orcidState === "error" && (
            <div>
              <div
                style={{
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontFamily: "Manrope", fontSize: "13px", color: "#991B1B", fontWeight: 500 }}>
                  Connection failed. Please try again.
                </div>
              </div>
              <button
                onClick={handleConnect}
                style={{
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "white",
                  backgroundColor: "#173F35",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  cursor: "pointer",
                  width: "100%",
                  minHeight: "44px",
                }}
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* Manual option */}
        <div style={{ borderTop: "1px solid #DDE2DE", paddingTop: "20px" }}>
          <p style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C", margin: "0", lineHeight: "1.6" }}>
            Don't have an ORCID? You can{" "}
            <a href="#" style={{ color: "#173F35", fontWeight: 500, textUnderlineOffset: "2px" }}>
              create one for free
            </a>{" "}
            at orcid.org, or skip this step and add publications manually later.
          </p>
        </div>
      </SetupShell>

      <BottomNav
        isMobile={isMobile}
        onBack={onBack}
        onContinue={onContinue}
        onSkip={onSkip}
        showSkip
        skipLabel="Skip for now"
        continueLabel={orcidState === "connected" ? "Continue" : "Continue without ORCID"}
      />
    </>
  );
}

function ConnectingSpinner() {
  return (
    <div
      style={{
        width: "32px",
        height: "32px",
        border: "2.5px solid #DDE2DE",
        borderTopColor: "#173F35",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
