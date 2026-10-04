import React from "react";

export type LegalTabType = "terms" | "privacy" | "disclaimer";

export function LegalWatermarks({ tab }: { tab: LegalTabType }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {tab === "terms" && (
        <>
          {/* Scales of Justice - Top Right */}
          <svg
            className="absolute -top-16 -right-20 w-[520px] h-[520px] opacity-[0.028] text-[#202920] transform rotate-6 transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v18M6 8l6-3 6 3" />
            <path d="M3 13l3-5 3 5a3 3 0 0 1-6 0z" />
            <path d="M15 13l3-5 3 5a3 3 0 0 1-6 0z" />
            <path d="M4 21h16" />
          </svg>

          {/* Legal Scroll / Charter - Mid Left */}
          <svg
            className="absolute top-[38%] -left-28 w-[460px] h-[460px] opacity-[0.025] text-[#3E6248] transform -rotate-12 transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2h8a2 2 0 0 1 2 2v14a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h2" />
            <path d="M18 18a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2" />
            <path d="M7 8h8M7 12h8M7 16h4" />
          </svg>

          {/* Grant Award Ribbon / Funder Seal - Lower Right */}
          <svg
            className="absolute top-[68%] -right-24 w-[480px] h-[480px] opacity-[0.026] text-[#202920] transform rotate-12 transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            <circle cx="12" cy="8" r="3" strokeWidth="0.8" strokeDasharray="1 1" />
          </svg>

          {/* Research Connection Graph Nodes - Bottom Left */}
          <svg
            className="absolute -bottom-24 left-[10%] w-[420px] h-[420px] opacity-[0.022] text-[#3E6248] transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="18" r="3" />
            <circle cx="12" cy="12" r="2" />
            <path d="M8.5 7.5l7 7M15.5 7.5l-7 7M6 9v6M18 9v6M9 6h6M9 18h6" />
          </svg>
        </>
      )}

      {tab === "privacy" && (
        <>
          {/* Privacy Security Shield - Top Right */}
          <svg
            className="absolute -top-16 -right-20 w-[540px] h-[540px] opacity-[0.028] text-[#3E6248] transform rotate-3 transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4M12 16h.01" strokeWidth="1.5" />
          </svg>

          {/* Keyhole / Vault Safeguard - Mid Left */}
          <svg
            className="absolute top-[35%] -left-28 w-[450px] h-[450px] opacity-[0.025] text-[#202920] transform -rotate-6 transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1.5" />
            <path d="M12 17.5v2" />
          </svg>

          {/* Distributed Data & Connection Nodes - Lower Right */}
          <svg
            className="absolute top-[65%] -right-24 w-[480px] h-[480px] opacity-[0.025] text-[#3E6248] transform rotate-8 transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="5" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <circle cx="8" cy="19" r="2" />
            <circle cx="16" cy="19" r="2" />
            <path d="M12 7v10M5.5 13.5l8 4M18.5 13.5l-8 4M6.8 11l8.4-4.8M17.2 11l-8.4-4.8" />
          </svg>

          {/* Grant & Consent Ribbon - Bottom Left */}
          <svg
            className="absolute -bottom-20 left-[6%] w-[420px] h-[420px] opacity-[0.022] text-[#202920] transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </>
      )}

      {tab === "disclaimer" && (
        <>
          {/* AI Neural Constellation & Sparks - Top Right */}
          <svg
            className="absolute -top-16 -right-20 w-[540px] h-[540px] opacity-[0.028] text-[#3E6248] transform rotate-12 transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l2.4 7.6H22l-6.5 4.7 2.5 7.7L12 17.3 6 22l2.5-7.7L2 9.6h7.6L12 2z" />
            <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
          </svg>

          {/* Research Discovery Compass - Mid Left */}
          <svg
            className="absolute top-[35%] -left-28 w-[460px] h-[460px] opacity-[0.025] text-[#202920] transform -rotate-15 transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>

          {/* DNA Helix / Scientific Inquiry - Lower Right */}
          <svg
            className="absolute top-[65%] -right-24 w-[480px] h-[480px] opacity-[0.026] text-[#3E6248] transform rotate-6 transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 15c6.667-6 13.333 0 20-6M2 9c6.667 6 13.333 0 20 6" />
            <path d="M9 7v10M15 7v10M5 11v2M19 11v2" />
          </svg>

          {/* Grant & Opportunity Verification Shield - Bottom Left */}
          <svg
            className="absolute -bottom-24 left-[8%] w-[420px] h-[420px] opacity-[0.023] text-[#202920] transition-opacity duration-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <circle cx="12" cy="11" r="3" />
            <path d="M12 14v3" />
          </svg>
        </>
      )}
    </div>
  );
}
