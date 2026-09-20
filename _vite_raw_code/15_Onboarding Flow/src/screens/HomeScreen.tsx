import { useState, ReactElement } from "react";
import { CambiumLogo, SetupData } from "../App";

interface Props {
  setupData: SetupData;
}

export default function HomeScreen({ setupData }: Props) {
  const [activeNav, setActiveNav] = useState("Home");
  const importedPubs = setupData.publications.filter((p) => p.imported);

  const nav = ["Home", "Library", "Collaborate", "Insights", "Settings"];

  const recentPapers = [
    {
      title: "Scaling Laws for Neural Language Models in Scientific Domains",
      authors: "Hoffmann N., Borgeaud S., Mensch A.",
      venue: "ICLR 2025",
      year: 2025,
      tags: ["Foundation Models", "Scientific ML"],
    },
    {
      title: "Privacy-Preserving Federated Learning at Clinical Scale",
      authors: "McMahan B., Chen S., Ramage D.",
      venue: "Nature Medicine",
      year: 2024,
      tags: ["Federated Learning", "Clinical AI"],
    },
    {
      title: "Contrastive Learning for Histopathology Representation",
      authors: "Chen T., Kornblith S., Norouzi M.",
      venue: "NeurIPS 2024",
      year: 2024,
      tags: ["Medical Imaging", "Self-Supervised Learning"],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F6F1", display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          minHeight: "100vh",
          backgroundColor: "#173F35",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(220,235,228,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CambiumLogo size={28} />
            <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "14px", color: "#DCEBE4", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Cambium
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {nav.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: activeNav === item ? "rgba(220,235,228,0.15)" : "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "Manrope",
                fontSize: "13px",
                fontWeight: activeNav === item ? 600 : 400,
                color: activeNav === item ? "#DCEBE4" : "rgba(220,235,228,0.55)",
                textAlign: "left",
                marginBottom: "2px",
                transition: "all 0.1s ease",
              }}
            >
              <NavIcon name={item} active={activeNav === item} />
              {item}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(220,235,228,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#285C4D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "Manrope", fontSize: "12px", fontWeight: 700, color: "#DCEBE4" }}>
                {setupData.orcidConnected ? setupData.orcidName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "YO"}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "Manrope", fontSize: "12px", fontWeight: 600, color: "#DCEBE4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {setupData.orcidConnected ? setupData.orcidName : "Your Name"}
              </div>
              <div style={{ fontFamily: "Manrope", fontSize: "11px", color: "rgba(220,235,228,0.5)" }}>Researcher</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: "220px", flex: 1, minWidth: 0 }}>
        {/* Top bar */}
        <div
          style={{
            padding: "20px 40px",
            borderBottom: "1px solid #DDE2DE",
            backgroundColor: "#F7F6F1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1 style={{ fontFamily: "Manrope", fontSize: "20px", fontWeight: 700, color: "#17201D", margin: 0, letterSpacing: "-0.01em" }}>
              Welcome back{setupData.orcidConnected ? `, ${setupData.orcidName.split(" ")[0]}` : ""}.
            </h1>
            <p style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C", margin: "2px 0 0 0" }}>
              Your research workspace is personalized and ready.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                backgroundColor: "#DCEBE4",
                borderRadius: "100px",
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#173F35" }} />
              <span style={{ fontFamily: "Manrope", fontSize: "11px", fontWeight: 600, color: "#173F35" }}>Research context active</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "32px 40px", maxWidth: "1000px" }}>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "32px" }}>
            {[
              { label: "Interests", value: setupData.interests.length || "—", sub: setupData.interests.length > 0 ? "areas selected" : "not configured" },
              { label: "Topics", value: setupData.topics.length || "—", sub: setupData.topics.length > 0 ? "topics tracked" : "not configured" },
              { label: "Publications", value: importedPubs.length || "—", sub: importedPubs.length > 0 ? "imported" : "none imported" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DDE2DE",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <div style={{ fontFamily: "Manrope", fontSize: "10px", fontWeight: 700, color: "#66716C", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: "Manrope", fontSize: "28px", fontWeight: 800, color: "#173F35", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C", marginTop: "4px" }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
            {/* Recommended papers */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <h2 style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 700, color: "#17201D", margin: 0 }}>
                  Recommended for you
                </h2>
                <button style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  See all
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentPapers.map((paper, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #DDE2DE",
                      borderRadius: "10px",
                      padding: "18px 20px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600, color: "#17201D", lineHeight: "1.4", marginBottom: "6px" }}>
                      {paper.title}
                    </div>
                    <div style={{ fontFamily: "Manrope", fontSize: "12px", color: "#66716C", marginBottom: "10px" }}>
                      {paper.authors} · {paper.venue} · {paper.year}
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {paper.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "Manrope",
                            fontSize: "11px",
                            fontWeight: 500,
                            color: "#173F35",
                            backgroundColor: "#DCEBE4",
                            borderRadius: "100px",
                            padding: "3px 9px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar panels */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* ORCID status */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DDE2DE",
                  borderRadius: "10px",
                  padding: "18px",
                }}
              >
                <div style={{ fontFamily: "Manrope", fontSize: "11px", fontWeight: 700, color: "#66716C", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Academic Identity
                </div>
                {setupData.orcidConnected ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "6px", backgroundColor: "#A6CE39", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: "10px", color: "white" }}>iD</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: "Manrope", fontSize: "13px", fontWeight: 600, color: "#17201D" }}>{setupData.orcidName}</div>
                        <div style={{ fontFamily: "Manrope", fontSize: "11px", color: "#66716C" }}>{setupData.orcidId}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#285C4D" }} />
                      <span style={{ fontFamily: "Manrope", fontSize: "11px", color: "#285C4D", fontWeight: 500 }}>ORCID connected</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C", marginBottom: "10px" }}>No ORCID connected</div>
                    <button style={{ fontFamily: "Manrope", fontSize: "12px", fontWeight: 600, color: "#173F35", background: "none", border: "1.5px solid #173F35", borderRadius: "6px", padding: "7px 12px", cursor: "pointer" }}>
                      Connect ORCID
                    </button>
                  </div>
                )}
              </div>

              {/* Research focus */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DDE2DE",
                  borderRadius: "10px",
                  padding: "18px",
                }}
              >
                <div style={{ fontFamily: "Manrope", fontSize: "11px", fontWeight: 700, color: "#66716C", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Research Focus
                </div>
                {setupData.interests.length > 0 || setupData.topics.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {[...setupData.interests.slice(0, 3), ...setupData.topics.slice(0, 2)].map((item) => (
                      <span
                        key={item}
                        style={{
                          fontFamily: "Manrope",
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "#173F35",
                          backgroundColor: "#DCEBE4",
                          borderRadius: "100px",
                          padding: "3px 9px",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                    {(setupData.interests.length + setupData.topics.length) > 5 && (
                      <span style={{ fontFamily: "Manrope", fontSize: "11px", color: "#66716C", padding: "3px 0" }}>
                        +{(setupData.interests.length + setupData.topics.length) - 5} more
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ fontFamily: "Manrope", fontSize: "13px", color: "#66716C", fontStyle: "italic" }}>
                    No focus areas set
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "#DCEBE4" : "rgba(220,235,228,0.55)";
  const icons: Record<string, ReactElement> = {
    Home: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2 7L7.5 2L13 7v6H9.5v-3h-3v3H2V7z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
    Library: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="2" width="11" height="11" rx="1.5" stroke={color} strokeWidth="1.3" />
        <path d="M5 5h5M5 7.5h5M5 10h3" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    Collaborate: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="5.5" cy="5" r="2" stroke={color} strokeWidth="1.3" />
        <circle cx="10.5" cy="5" r="2" stroke={color} strokeWidth="1.3" />
        <path d="M1 13c0-2.209 2.015-4 4.5-4M14 13c0-2.209-2.015-4-4.5-4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    Insights: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2 11l3-3 2.5 2 3-4L13 4" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    Settings: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="2" stroke={color} strokeWidth="1.3" />
        <path d="M7.5 2v1.5M7.5 11.5V13M2 7.5h1.5M11.5 7.5H13M3.7 3.7l1 1M10.3 10.3l1 1M10.3 3.7l-1 1M3.7 10.3l1-1" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  };
  return icons[name] || null;
}
