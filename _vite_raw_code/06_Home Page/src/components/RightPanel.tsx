import { ExternalLink, ArrowRight, BookOpen, Cpu, Leaf } from "lucide-react";

const events = [
  {
    month: "SEP",
    day: 14,
    title: "NeurIPS Paper Deadline",
    time: "11:59 PM AoE",
    type: "Deadline",
  },
  {
    month: "SEP",
    day: 18,
    title: "Lab Meeting — Climate Models",
    time: "2:00 PM · Zoom",
    type: "Meeting",
  },
  {
    month: "SEP",
    day: 22,
    title: "EMNLP Early Submission",
    time: "5:00 PM PST",
    type: "Deadline",
  },
];

const researchers = [
  {
    initials: "AR",
    name: "Dr. Aisha Rahman",
    role: "Computational Linguistics · MIT",
    bg: "#DCEBE4",
  },
  {
    initials: "JK",
    name: "Prof. Jonas Keller",
    role: "Climate Informatics · ETH Zürich",
    bg: "#F7F6F1",
  },
  {
    initials: "SC",
    name: "Sophia Chen",
    role: "AI for Science · Stanford",
    bg: "#DDE2DE",
  },
];

const exploringLinks = [
  { icon: Cpu, label: "Large Language Models in Biology" },
  { icon: Leaf, label: "Carbon Capture via ML Optimization" },
  { icon: BookOpen, label: "Preprints: September 2026" },
];

export default function RightPanel() {
  return (
    <aside
      className="flex flex-col h-screen sticky top-0 overflow-y-auto"
      style={{
        width: 320,
        minWidth: 320,
        background: "#F7F6F1",
        borderLeft: "1px solid #DDE2DE",
        padding: 24,
        gap: 32,
      }}
    >
      {/* Coming Up */}
      <section>
        <p
          className="mb-4"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#17201D",
          }}
        >
          Coming up
        </p>
        <div className="flex flex-col" style={{ gap: 1 }}>
          {events.map((ev) => (
            <div
              key={ev.title}
              className="flex items-start gap-3 rounded-md px-3 py-3 cursor-pointer transition-colors"
              style={{ background: "#FFFFFF", border: "1px solid #DDE2DE", marginBottom: 6 }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = "#A8C0B4")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = "#DDE2DE")
              }
            >
              {/* Date block */}
              <div
                className="flex flex-col items-center rounded-md px-2.5 py-1.5 flex-shrink-0"
                style={{ background: "#F7F6F1", minWidth: 44 }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#66716C",
                    fontWeight: 600,
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {ev.month}
                </span>
                <span
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#173F35",
                    lineHeight: 1.1,
                  }}
                >
                  {ev.day}
                </span>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <p
                  className="text-xs font-semibold leading-snug"
                  style={{ color: "#17201D", fontFamily: "'Manrope', sans-serif" }}
                >
                  {ev.title}
                </p>
                <p className="text-xs" style={{ color: "#66716C" }}>
                  {ev.time}
                </p>
                <span
                  className="text-xs rounded-sm px-1.5 py-0.5 mt-1 self-start"
                  style={{
                    background: ev.type === "Deadline" ? "rgba(220,235,228,0.7)" : "#F7F6F1",
                    color: "#173F35",
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: "0.05em",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  {ev.type.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Researchers you may know */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#17201D",
            }}
          >
            Researchers you may know
          </p>
          <button
            className="text-xs flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "#66716C" }}
          >
            See all <ArrowRight size={11} />
          </button>
        </div>
        <div className="flex flex-col" style={{ gap: 10 }}>
          {researchers.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-3 rounded-md p-3"
              style={{ background: "#FFFFFF", border: "1px solid #DDE2DE" }}
            >
              <div
                className="rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  background: r.bg,
                  color: "#173F35",
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                {r.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-semibold truncate"
                  style={{ color: "#17201D", fontFamily: "'Manrope', sans-serif" }}
                >
                  {r.name}
                </p>
                <p className="text-xs truncate" style={{ color: "#66716C" }}>
                  {r.role}
                </p>
              </div>
              <button
                className="text-xs rounded-md px-2.5 py-1 transition-colors flex-shrink-0"
                style={{
                  border: "1px solid #DDE2DE",
                  background: "#FFFFFF",
                  color: "#17201D",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "#F7F6F1")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF")
                }
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Continue exploring */}
      <section>
        <p
          className="mb-4"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#17201D",
          }}
        >
          Continue exploring
        </p>
        <div className="flex flex-col" style={{ gap: 2 }}>
          {exploringLinks.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-left transition-colors w-full"
              style={{ color: "#17201D" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
              }
            >
              <Icon size={14} style={{ color: "#173F35", flexShrink: 0 }} strokeWidth={1.5} />
              <span className="text-xs font-medium flex-1" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {label}
              </span>
              <ExternalLink size={11} style={{ color: "#66716C", flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
