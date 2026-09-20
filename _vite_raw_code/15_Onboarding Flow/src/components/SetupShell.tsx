import { ReactNode } from "react";

interface SetupShellProps {
  children: ReactNode;
  isMobile: boolean;
  hasTopBar?: boolean;
  fullHeight?: boolean;
}

export default function SetupShell({ children, isMobile, hasTopBar = true, fullHeight = false }: SetupShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: hasTopBar ? (isMobile ? "57px" : "65px") : "0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: fullHeight ? "1" : undefined,
          maxWidth: isMobile ? "100%" : "820px",
          width: "100%",
          margin: "0 auto",
          padding: isMobile ? "32px 20px 100px" : "64px 40px 120px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface BottomNavProps {
  onBack?: () => void;
  onContinue?: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  continueDisabled?: boolean;
  isMobile: boolean;
  showSkip?: boolean;
}

export function BottomNav({
  onBack,
  onContinue,
  onSkip,
  continueLabel = "Continue",
  backLabel = "Back",
  skipLabel = "Skip for now",
  continueDisabled = false,
  isMobile,
  showSkip = false,
}: BottomNavProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#F7F6F1",
        borderTop: "1px solid #DDE2DE",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: isMobile ? "100%" : "820px",
          margin: "0 auto",
          padding: isMobile ? "16px 20px" : "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                fontFamily: "Manrope",
                fontSize: "14px",
                fontWeight: 500,
                color: "#66716C",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px 0",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "44px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="#66716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {backLabel}
            </button>
          )}
          {showSkip && onSkip && (
            <button
              onClick={onSkip}
              style={{
                fontFamily: "Manrope",
                fontSize: "13px",
                fontWeight: 400,
                color: "#66716C",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px 0",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                minHeight: "44px",
              }}
            >
              {skipLabel}
            </button>
          )}
        </div>
        {onContinue && (
          <button
            onClick={onContinue}
            disabled={continueDisabled}
            style={{
              fontFamily: "Manrope",
              fontSize: "14px",
              fontWeight: 600,
              color: continueDisabled ? "#66716C" : "white",
              backgroundColor: continueDisabled ? "#DDE2DE" : "#173F35",
              border: "none",
              borderRadius: "8px",
              padding: isMobile ? "12px 28px" : "12px 32px",
              cursor: continueDisabled ? "not-allowed" : "pointer",
              minHeight: "44px",
              transition: "all 0.15s ease",
              letterSpacing: "0.01em",
              flex: isMobile ? "1" : undefined,
              maxWidth: isMobile ? undefined : "200px",
            }}
          >
            {continueLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "Manrope",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#66716C",
        marginBottom: "16px",
      }}
    >
      {children}
    </div>
  );
}

export function PageTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h1
        style={{
          fontFamily: "Manrope",
          fontSize: "28px",
          fontWeight: 700,
          color: "#17201D",
          margin: "0 0 10px 0",
          lineHeight: "1.2",
          letterSpacing: "-0.02em",
        }}
      >
        {children}
      </h1>
      {subtitle && (
        <p
          style={{
            fontFamily: "Manrope",
            fontSize: "15px",
            fontWeight: 400,
            color: "#66716C",
            margin: 0,
            lineHeight: "1.6",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
