import { CambiumLogo } from "../App";
import { SetupData } from "../App";

interface Props {
  isMobile: boolean;
  setupData: SetupData;
  onGoHome: () => void;
  onEdit: () => void;
}

export default function SetupComplete({ isMobile, setupData, onGoHome, onEdit }: Props) {
  const importedPubs = setupData.publications.filter((p) => p.imported);

  const summaryItems = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="2.5" stroke="#173F35" strokeWidth="1.5" />
          <path d="M3 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      label: "Academic Identity",
      value: setupData.orcidConnected ? setupData.orcidName : "Not connected",
      empty: !setupData.orcidConnected,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M3 5h7M3 11h9" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      label: "Research Interests",
      value: setupData.interests.length > 0
        ? setupData.interests.slice(0, 3).join(", ") + (setupData.interests.length > 3 ? ` +${setupData.interests.length - 3} more` : "")
        : "None selected",
      empty: setupData.interests.length === 0,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="#173F35" strokeWidth="1.5" />
          <path d="M8 5v3l2 2" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label: "Research Topics",
      value: setupData.topics.length > 0
        ? setupData.topics.slice(0, 3).join(", ") + (setupData.topics.length > 3 ? ` +${setupData.topics.length - 3} more` : "")
        : "None selected",
      empty: setupData.topics.length === 0,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="1" width="12" height="14" rx="2" stroke="#173F35" strokeWidth="1.5" />
          <path d="M5 5h6M5 8h6M5 11h3" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      label: "Publications",
      value: importedPubs.length > 0
        ? `${importedPubs.length} publication${importedPubs.length !== 1 ? "s" : ""} imported`
        : "None imported",
      empty: importedPubs.length === 0,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F6F1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: isMobile ? "16px 20px" : "20px 40px",
          borderBottom: "1px solid #DDE2DE",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <CambiumLogo size={24} />
        <span
          style={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.08em",
            color: "#173F35",
            textTransform: "uppercase",
          }}
        >
          Cambium
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "40px 20px" : "80px 40px",
        }}
      >
        <div style={{ maxWidth: "560px", width: "100%" }}>
          {/* Success mark */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "#173F35",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "28px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l5 5L20 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: "Manrope",
              fontSize: isMobile ? "26px" : "32px",
              fontWeight: 800,
              color: "#17201D",
              margin: "0 0 12px 0",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            Your research world is ready.
          </h1>
          <p
            style={{
              fontFamily: "Manrope",
              fontSize: "15px",
              fontWeight: 400,
              color: "#66716C",
              margin: "0 0 36px 0",
              lineHeight: "1.65",
            }}
          >
            Cambium has been personalized with your research context. Explore your workspace, discover relevant literature, and collaborate with your community.
          </p>

          {/* Summary card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #DDE2DE",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #DDE2DE",
                backgroundColor: "#F7F6F1",
              }}
            >
              <span style={{ fontFamily: "Manrope", fontSize: "11px", fontWeight: 700, color: "#66716C", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Research context summary
              </span>
            </div>
            {summaryItems.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "14px 20px",
                  borderBottom: i < summaryItems.length - 1 ? "1px solid #DDE2DE" : "none",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: item.empty ? "#F7F6F1" : "#DCEBE4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Manrope", fontSize: "11px", fontWeight: 700, color: "#66716C", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "2px" }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "13px",
                      fontWeight: item.empty ? 400 : 500,
                      color: item.empty ? "#66716C" : "#17201D",
                      fontStyle: item.empty ? "italic" : "normal",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "10px",
              alignItems: isMobile ? "stretch" : "center",
            }}
          >
            <button
              onClick={onGoHome}
              style={{
                fontFamily: "Manrope",
                fontSize: "15px",
                fontWeight: 600,
                color: "white",
                backgroundColor: "#173F35",
                border: "none",
                borderRadius: "8px",
                padding: "14px 36px",
                cursor: "pointer",
                minHeight: "48px",
                letterSpacing: "0.01em",
              }}
            >
              Go to Home
            </button>
            <button
              onClick={onEdit}
              style={{
                fontFamily: "Manrope",
                fontSize: "14px",
                fontWeight: 500,
                color: "#66716C",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "14px 16px",
                minHeight: "48px",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              Edit research context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
