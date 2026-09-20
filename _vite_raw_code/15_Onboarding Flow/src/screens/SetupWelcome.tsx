import { CambiumLogo } from "../App";

interface Props {
  isMobile: boolean;
  onStart: () => void;
  onSkip: () => void;
}

export default function SetupWelcome({ isMobile, onStart, onSkip }: Props) {
  const steps = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="6" r="3" stroke="#173F35" strokeWidth="1.5" />
          <path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      label: "Academic identity",
      desc: "Connect your ORCID profile",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 9h12M3 5h8M3 13h10" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      label: "Research focus",
      desc: "Select interests and topics",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="3" y="2" width="12" height="14" rx="2" stroke="#173F35" strokeWidth="1.5" />
          <path d="M6 6h6M6 9h6M6 12h3" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      label: "Publications",
      desc: "Import your research output",
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

      {/* Main content */}
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
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#DCEBE4",
              borderRadius: "100px",
              padding: "5px 12px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#173F35",
              }}
            />
            <span
              style={{
                fontFamily: "Manrope",
                fontSize: "11px",
                fontWeight: 700,
                color: "#173F35",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Research Setup
            </span>
          </div>

          <h1
            style={{
              fontFamily: "Manrope",
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: 800,
              color: "#17201D",
              margin: "0 0 14px 0",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            Build your research
            <br />
            starting point.
          </h1>
          <p
            style={{
              fontFamily: "Manrope",
              fontSize: "16px",
              fontWeight: 400,
              color: "#66716C",
              margin: "0 0 40px 0",
              lineHeight: "1.65",
              maxWidth: "440px",
            }}
          >
            Connect your academic identity, choose what you research, and bring
            your publications into Cambium.
          </p>

          {/* Step cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "40px",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DDE2DE",
                  borderRadius: "10px",
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "#DCEBE4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#17201D",
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#66716C",
                      marginTop: "2px",
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "1.5px solid #DDE2DE",
                    flexShrink: 0,
                  }}
                />
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
              onClick={onStart}
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
                flex: isMobile ? undefined : undefined,
              }}
            >
              Start setup
            </button>
            <button
              onClick={onSkip}
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
              Skip for now
            </button>
          </div>

          <p
            style={{
              fontFamily: "Manrope",
              fontSize: "12px",
              color: "#66716C",
              marginTop: "20px",
              lineHeight: "1.5",
            }}
          >
            You can always complete or update your research profile later in account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
