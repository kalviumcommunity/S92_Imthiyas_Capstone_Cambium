import { useEffect, useState } from "react";

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="#66716C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 7.5l3 3 6-6" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const invoices = [
  { date: "Sep 1, 2026", amount: "$20.00", plan: "Cambium Pro", id: "INV-2026-09" },
  { date: "Aug 1, 2026", amount: "$20.00", plan: "Cambium Pro", id: "INV-2026-08" },
  { date: "Jul 1, 2026", amount: "$20.00", plan: "Cambium Pro", id: "INV-2026-07" },
];

const freeTierFeatures = [
  "100 AI requests / month",
  "Basic literature search",
  "Up to 3 projects",
  "Community support",
  "Standard compute",
];

const proTierFeatures = [
  "10,000 AI Intelligence Credits",
  "Advanced synthesis & analysis",
  "Unlimited projects",
  "Priority support",
  "High-performance compute",
  "API access & integrations",
  "Custom export formats",
];

export default function App() {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(85), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F7F6F1", fontFamily: "'Manrope', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Page Header */}
        <div className="mb-8 pb-6" style={{ borderBottom: "1px solid #DDE2DE" }}>
          <h1
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "1.875rem",
              fontWeight: 600,
              color: "#17201D",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Billing &amp; Usage
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#66716C", marginTop: "0.375rem" }}>
            Manage your subscription, monitor AI usage, and review past invoices.
          </p>
        </div>

        {/* Section 1: Plan + AI Usage */}
        <div className="grid grid-cols-1 gap-5 mb-8" style={{ gridTemplateColumns: "1fr 1fr" }}>

          {/* Current Plan Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #DDE2DE",
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#66716C", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Current Plan
                </p>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#17201D", marginTop: "0.25rem" }}>
                  Cambium Pro
                </h2>
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: "#DCEBE4",
                  color: "#173F35",
                  padding: "0.25rem 0.625rem",
                  borderRadius: "999px",
                }}
              >
                Active
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-5">
              <span style={{ fontSize: "2rem", fontWeight: 800, color: "#17201D", lineHeight: 1 }}>$20</span>
              <span style={{ fontSize: "0.875rem", color: "#66716C" }}>/month</span>
            </div>

            <div style={{ borderTop: "1px solid #DDE2DE", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div className="flex justify-between">
                <span style={{ fontSize: "0.8125rem", color: "#66716C" }}>Billing cycle</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#17201D" }}>Monthly</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: "0.8125rem", color: "#66716C" }}>Next renewal</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#17201D" }}>Oct 1, 2026</span>
              </div>
            </div>

            <button
              style={{
                marginTop: "1.25rem",
                width: "100%",
                padding: "0.5625rem 1rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#173F35",
                backgroundColor: "transparent",
                border: "1px solid #173F35",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
                fontFamily: "'Manrope', sans-serif",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#DCEBE4")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Manage Plan
            </button>
          </div>

          {/* AI Credits Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #DDE2DE",
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <div className="flex items-start justify-between mb-1">
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#66716C", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                AI Intelligence Credits
              </p>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#173F35" }}>85%</span>
            </div>

            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#17201D", marginBottom: "1.25rem" }}>
              Compute Usage
            </h2>

            {/* Progress Bar */}
            <div style={{ marginBottom: "0.625rem" }}>
              <div
                style={{
                  height: "8px",
                  backgroundColor: "#DDE2DE",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${barWidth}%`,
                    backgroundColor: "#173F35",
                    borderRadius: "999px",
                    transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>
            </div>

            <p style={{ fontSize: "0.8125rem", color: "#66716C", marginBottom: "1.5rem" }}>
              <span style={{ fontWeight: 700, color: "#17201D" }}>8,450</span> / 10,000 tokens used this cycle
            </p>

            <div style={{ borderTop: "1px solid #DDE2DE", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div className="flex justify-between">
                <span style={{ fontSize: "0.8125rem", color: "#66716C" }}>Remaining</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#17201D" }}>1,550 tokens</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: "0.8125rem", color: "#66716C" }}>Cycle resets</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#17201D" }}>Oct 1, 2026</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: "0.8125rem", color: "#66716C" }}>Avg. daily usage</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#17201D" }}>281 tokens</span>
              </div>
            </div>

            <button
              style={{
                marginTop: "1.25rem",
                width: "100%",
                padding: "0.5625rem 1rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#173F35",
                backgroundColor: "transparent",
                border: "1px solid #DDE2DE",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "border-color 0.15s ease, background-color 0.15s ease",
                fontFamily: "'Manrope', sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#173F35";
                e.currentTarget.style.backgroundColor = "#F7F6F1";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#DDE2DE";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Purchase Add-on Credits
            </button>
          </div>
        </div>

        {/* Section 2: Subscription Tiers */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#17201D" }}>Subscription Plans</h3>
            <span style={{ fontSize: "0.75rem", color: "#66716C" }}>All plans billed monthly</span>
          </div>

          <div className="flex gap-6">
            {/* Free Tier */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                border: "1px solid #DDE2DE",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <div className="mb-4">
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#66716C", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Free Researcher
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#17201D" }}>$0</span>
                  <span style={{ fontSize: "0.875rem", color: "#66716C" }}>/month</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#66716C", marginTop: "0.375rem" }}>
                  Essential tools for individual researchers.
                </p>
              </div>

              <div style={{ borderTop: "1px solid #DDE2DE", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {freeTierFeatures.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span style={{ flexShrink: 0, color: "#66716C" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="#66716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span style={{ fontSize: "0.8125rem", color: "#66716C" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled
                style={{
                  width: "100%",
                  padding: "0.5625rem 1rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#66716C",
                  backgroundColor: "#F7F6F1",
                  border: "1px solid #DDE2DE",
                  borderRadius: "8px",
                  cursor: "not-allowed",
                  opacity: 0.7,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                Current Plan
              </button>
            </div>

            {/* Pro Tier — Emphasized */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                border: "2px solid #173F35",
                borderRadius: "12px",
                padding: "1.5rem",
                position: "relative",
              }}
            >
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "-1px",
                  right: "1.25rem",
                  backgroundColor: "#173F35",
                  color: "#FFFFFF",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "0.25rem 0.625rem",
                  borderRadius: "0 0 6px 6px",
                }}
              >
                Recommended
              </div>

              <div className="mb-4">
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#173F35", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Cambium Pro
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#17201D" }}>$20</span>
                  <span style={{ fontSize: "0.875rem", color: "#66716C" }}>/month</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "#66716C", marginTop: "0.375rem" }}>
                  Full AI power for serious research teams.
                </p>
              </div>

              <div style={{ borderTop: "1px solid #DDE2DE", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {proTierFeatures.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span style={{ flexShrink: 0 }}>
                        <CheckIcon />
                      </span>
                      <span style={{ fontSize: "0.8125rem", color: "#17201D", fontWeight: 500 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "0.5625rem 1rem",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  backgroundColor: "#173F35",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "opacity 0.15s ease",
                  fontFamily: "'Manrope', sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Billing History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#17201D" }}>Invoices</h3>
            <button
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#173F35",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              View all
            </button>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #DDE2DE",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 1fr 80px",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#F7F6F1",
                borderBottom: "1px solid #DDE2DE",
              }}
            >
              {["Date", "Amount", "Plan", ""].map((col, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: "#66716C",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    textAlign: i === 3 ? "right" : "left",
                  }}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            {invoices.map((inv, idx) => (
              <div
                key={inv.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 1fr 80px",
                  padding: "0.875rem 1.5rem",
                  borderBottom: idx < invoices.length - 1 ? "1px solid #DDE2DE" : "none",
                  alignItems: "center",
                  transition: "background-color 0.12s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F7F6F1")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <span style={{ fontSize: "0.875rem", color: "#17201D" }}>{inv.date}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#17201D" }}>{inv.amount}</span>
                <span style={{ fontSize: "0.875rem", color: "#66716C" }}>{inv.plan}</span>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#66716C",
                      background: "none",
                      border: "1px solid #DDE2DE",
                      borderRadius: "6px",
                      padding: "0.3125rem 0.625rem",
                      cursor: "pointer",
                      transition: "border-color 0.12s, color 0.12s",
                      fontFamily: "'Manrope', sans-serif",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "#173F35";
                      e.currentTarget.style.color = "#173F35";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "#DDE2DE";
                      e.currentTarget.style.color = "#66716C";
                    }}
                  >
                    <DownloadIcon />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
