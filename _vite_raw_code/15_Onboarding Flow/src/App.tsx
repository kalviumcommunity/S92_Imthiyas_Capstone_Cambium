import { useState, ReactElement } from "react";
import SetupWelcome from "./screens/SetupWelcome";
import ConnectORCID from "./screens/ConnectORCID";
import ResearchInterests from "./screens/ResearchInterests";
import ResearchTopics from "./screens/ResearchTopics";
import ImportPublications from "./screens/ImportPublications";
import ReviewContext from "./screens/ReviewContext";
import SetupComplete from "./screens/SetupComplete";
import HomeScreen from "./screens/HomeScreen";
import ExitConfirmModal from "./components/ExitConfirmModal";

export type SetupData = {
  orcidConnected: boolean;
  orcidName: string;
  orcidId: string;
  interests: string[];
  topics: string[];
  publications: Publication[];
};

export type Publication = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  selected: boolean;
  imported: boolean;
  source: "orcid" | "manual";
};

type Screen =
  | "welcome"
  | "orcid"
  | "interests"
  | "topics"
  | "publications"
  | "review"
  | "complete"
  | "home";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isMobile] = useState(() => window.innerWidth < 768);
  const [setupData, setSetupData] = useState<SetupData>({
    orcidConnected: false,
    orcidName: "",
    orcidId: "",
    interests: [],
    topics: [],
    publications: [],
  });

  const steps: Screen[] = [
    "welcome",
    "orcid",
    "interests",
    "topics",
    "publications",
    "review",
    "complete",
  ];
  const currentStep = steps.indexOf(screen);

  const goTo = (s: Screen) => setScreen(s);
  const goHome = () => setScreen("home");

  const updateSetup = (patch: Partial<SetupData>) =>
    setSetupData((prev) => ({ ...prev, ...patch }));

  if (screen === "home") {
    return <HomeScreen setupData={setupData} />;
  }

  const screenMap: Record<string, ReactElement> = {
    welcome: (
      <SetupWelcome
        isMobile={isMobile}
        onStart={() => goTo("orcid")}
        onSkip={() => setShowExitConfirm(true)}
      />
    ),
    orcid: (
      <ConnectORCID
        isMobile={isMobile}
        setupData={setupData}
        updateSetup={updateSetup}
        onBack={() => goTo("welcome")}
        onContinue={() => goTo("interests")}
        onSkip={() => goTo("interests")}
      />
    ),
    interests: (
      <ResearchInterests
        isMobile={isMobile}
        setupData={setupData}
        updateSetup={updateSetup}
        onBack={() => goTo("orcid")}
        onContinue={() => goTo("topics")}
        onSkip={() => setShowExitConfirm(true)}
      />
    ),
    topics: (
      <ResearchTopics
        isMobile={isMobile}
        setupData={setupData}
        updateSetup={updateSetup}
        onBack={() => goTo("interests")}
        onContinue={() => goTo("publications")}
        onSkip={() => setShowExitConfirm(true)}
      />
    ),
    publications: (
      <ImportPublications
        isMobile={isMobile}
        setupData={setupData}
        updateSetup={updateSetup}
        onBack={() => goTo("topics")}
        onContinue={() => goTo("review")}
        onSkip={() => goTo("review")}
      />
    ),
    review: (
      <ReviewContext
        isMobile={isMobile}
        setupData={setupData}
        updateSetup={updateSetup}
        onBack={() => goTo("publications")}
        onContinue={() => goTo("complete")}
        onEdit={(step: string) => goTo(step as Screen)}
      />
    ),
    complete: (
      <SetupComplete
        isMobile={isMobile}
        setupData={setupData}
        onGoHome={goHome}
        onEdit={() => goTo("review")}
      />
    ),
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F6F1" }}>
      {screen !== "welcome" && screen !== "complete" && (
        <StepIndicator
          steps={["ORCID", "Interests", "Topics", "Publications", "Review"]}
          current={currentStep - 1}
          isMobile={isMobile}
        />
      )}
      {screenMap[screen]}
      {showExitConfirm && (
        <ExitConfirmModal
          onConfirm={goHome}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}
    </div>
  );
}

function StepIndicator({
  steps,
  current,
  isMobile,
}: {
  steps: string[];
  current: number;
  isMobile: boolean;
}) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-10"
      style={{
        backgroundColor: "#F7F6F1",
        borderBottom: "1px solid #DDE2DE",
      }}
    >
      <div
        style={{
          maxWidth: isMobile ? "100%" : "820px",
          margin: "0 auto",
          padding: isMobile ? "12px 20px" : "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <CambiumLogo size={20} />
          {!isMobile && (
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
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "4px" : "8px" }}>
          {steps.map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: isMobile ? "4px" : "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                  style={{
                    width: isMobile ? "20px" : "24px",
                    height: isMobile ? "20px" : "24px",
                    borderRadius: "50%",
                    backgroundColor: i < current ? "#173F35" : i === current ? "#173F35" : "transparent",
                    border: i < current ? "none" : i === current ? "none" : "1.5px solid #DDE2DE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  {i < current ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span
                      style={{
                        fontFamily: "Manrope",
                        fontSize: isMobile ? "9px" : "10px",
                        fontWeight: 700,
                        color: i === current ? "white" : "#66716C",
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>
                {!isMobile && (
                  <span
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "11px",
                      fontWeight: i === current ? 600 : 400,
                      color: i <= current ? "#173F35" : "#66716C",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {step}
                  </span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: isMobile ? "12px" : "20px",
                    height: "1px",
                    backgroundColor: i < current ? "#173F35" : "#DDE2DE",
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CambiumLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="#173F35" />
      <path
        d="M8 20C8 14.477 12.477 10 18 10"
        stroke="#DCEBE4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="10" r="2" fill="#DCEBE4" />
      <path
        d="M14 20C14 17.239 16.239 15 19 15"
        stroke="#DCEBE4"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
