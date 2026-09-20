import { useState } from "react";

function CollabHubEmpty() {
  return (
    <div
      className="flex flex-col items-center text-center gap-6 bg-white rounded-lg border p-12 w-full"
      style={{ borderColor: "#DDE2DE", maxWidth: 500 }}
    >
      <div className="icon-float">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 80, height: 80, backgroundColor: "#DCEBE4" }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Network nodes */}
            <circle cx="20" cy="13" r="5" fill="#173F35" />
            <circle cx="9" cy="28" r="4" fill="#173F35" opacity="0.7" />
            <circle cx="31" cy="28" r="4" fill="#173F35" opacity="0.7" />
            <line x1="20" y1="18" x2="9" y2="24" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <line x1="20" y1="18" x2="31" y2="24" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <line x1="9" y1="28" x2="31" y2="28" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.3" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3
          className="text-xl font-semibold leading-snug"
          style={{ fontFamily: "'Source Serif 4', serif", color: "#17201D" }}
        >
          No connections yet.
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "'Manrope', sans-serif", color: "#66716C", maxWidth: 340 }}
        >
          Your academic network starts here. Find peers sharing your research
          interests or invite your existing lab members.
        </p>
      </div>

      <button
        className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
        style={{ backgroundColor: "#173F35", fontFamily: "'Manrope', sans-serif" }}
      >
        Find Collaborators
      </button>
    </div>
  );
}

function WorkspaceEmpty() {
  return (
    <div
      className="flex flex-col items-center text-center gap-6 bg-white rounded-lg border p-12 w-full"
      style={{ borderColor: "#DDE2DE", maxWidth: 500 }}
    >
      <div className="icon-float">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 80, height: 80, backgroundColor: "#DCEBE4" }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Open folder */}
            <path
              d="M5 14C5 12.9 5.9 12 7 12H16L19 15H33C34.1 15 35 15.9 35 17V30C35 31.1 34.1 32 33 32H7C5.9 32 5 31.1 5 30V14Z"
              fill="#173F35"
              opacity="0.15"
            />
            <path
              d="M5 18C5 16.9 5.9 16 7 16H33C34.1 16 35 16.9 35 18V30C35 31.1 34.1 32 33 32H7C5.9 32 5 31.1 5 30V18Z"
              fill="#173F35"
              opacity="0.25"
            />
            {/* Document inside */}
            <rect x="15" y="12" width="14" height="18" rx="1.5" fill="white" stroke="#173F35" strokeWidth="1.2" />
            <line x1="18" y1="17" x2="26" y2="17" stroke="#173F35" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            <line x1="18" y1="20" x2="26" y2="20" stroke="#173F35" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            <line x1="18" y1="23" x2="23" y2="23" stroke="#173F35" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3
          className="text-xl font-semibold leading-snug"
          style={{ fontFamily: "'Source Serif 4', serif", color: "#17201D" }}
        >
          Your workspace is empty.
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "'Manrope', sans-serif", color: "#66716C", maxWidth: 340 }}
        >
          Upload your first PDF, connect a dataset, or start a new literature
          review.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        <button
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
          style={{ backgroundColor: "#173F35", fontFamily: "'Manrope', sans-serif" }}
        >
          Upload Research
        </button>
        <button
          className="px-6 py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-[#F7F6F1] active:bg-[#DCEBE4]"
          style={{
            borderColor: "#DDE2DE",
            color: "#173F35",
            fontFamily: "'Manrope', sans-serif",
            backgroundColor: "transparent",
          }}
        >
          Browse Templates
        </button>
      </div>
    </div>
  );
}

type Tab = "collab" | "workspace";

export default function App() {
  const [active, setActive] = useState<Tab>("collab");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 py-16"
      style={{ backgroundColor: "#F7F6F1" }}
    >
      {/* Tab switcher */}
      <div
        className="flex rounded-lg border overflow-hidden text-sm font-semibold"
        style={{ borderColor: "#DDE2DE", fontFamily: "'Manrope', sans-serif" }}
      >
        {(
          [
            { id: "collab", label: "Collaboration Hub" },
            { id: "workspace", label: "Workspace" },
          ] as { id: Tab; label: string }[]
        ).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="px-5 py-2 transition-colors"
            style={{
              backgroundColor: active === id ? "#173F35" : "white",
              color: active === id ? "white" : "#66716C",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* State card */}
      {active === "collab" ? <CollabHubEmpty /> : <WorkspaceEmpty />}
    </div>
  );
}
