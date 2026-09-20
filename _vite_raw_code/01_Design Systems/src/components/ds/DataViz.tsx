import { SectionWrapper, SectionHeader, SubLabel } from "./shared";

function LineChart() {
  const data = [42, 58, 51, 68, 75, 72, 85, 91, 88, 96, 102, 108];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const w = 360;
  const h = 120;
  const pad = { top: 12, right: 8, bottom: 20, left: 32 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const points = data.map((v, i) => {
    const x = pad.left + (i / (data.length - 1)) * iw;
    const y = pad.top + ih - ((v - min) / range) * ih;
    return `${x},${y}`;
  });

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* Y grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.top + ih * (1 - t);
        return (
          <g key={t}>
            <line x1={pad.left} y1={y} x2={pad.left + iw} y2={y} stroke="#E4E2DC" strokeWidth="1" />
            <text x={pad.left - 4} y={y + 4} textAnchor="end" fontSize="8" fill="#9A9A96">
              {Math.round(min + range * t)}
            </text>
          </g>
        );
      })}
      {/* Area fill */}
      <polygon
        points={`${pad.left},${pad.top + ih} ${points.join(" ")} ${pad.left + iw},${pad.top + ih}`}
        fill="#4A7C59"
        fillOpacity="0.06"
      />
      {/* Line */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#4A7C59"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Last point dot */}
      {(() => {
        const lastIdx = data.length - 1;
        const x = pad.left + (lastIdx / (data.length - 1)) * iw;
        const y = pad.top + ih - ((data[lastIdx] - min) / range) * ih;
        return <circle cx={x} cy={y} r="3" fill="#4A7C59" />;
      })()}
      {/* X labels — every 3 */}
      {data.map((_, i) => {
        if (i % 3 !== 0) return null;
        const x = pad.left + (i / (data.length - 1)) * iw;
        return (
          <text key={i} x={x} y={h - 4} textAnchor="middle" fontSize="8" fill="#9A9A96">
            {months[i]}
          </text>
        );
      })}
    </svg>
  );
}

function BarChart() {
  const data = [
    { label: "Papers", value: 84 },
    { label: "Projects", value: 62 },
    { label: "Collab.", value: 45 },
    { label: "Grants", value: 28 },
    { label: "Reviews", value: 71 },
  ];
  const max = Math.max(...data.map((d) => d.value));
  const h = 120;
  const barW = 36;
  const gap = 12;
  const pad = { top: 8, bottom: 20 };
  const ih = h - pad.top - pad.bottom;

  return (
    <svg width={data.length * (barW + gap)} height={h}>
      {data.map((d, i) => {
        const barH = (d.value / max) * ih;
        const x = i * (barW + gap);
        const y = pad.top + ih - barH;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} fill="#4A7C59" fillOpacity="0.75" rx="3" />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="8" fill="#5C5C58">
              {d.value}
            </text>
            <text x={x + barW / 2} y={h - 4} textAnchor="middle" fontSize="8" fill="#9A9A96">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ProgressBar({ label, value, total, color = "#4A7C59" }: { label: string; value: number; total: number; color?: string }) {
  const pct = (value / total) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs" style={{ color: "var(--c-text-secondary)" }}>{label}</span>
        <span className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)" }}>{value}/{total}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "var(--c-surface-sunken)" }}>
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color, transition: "width 300ms ease-out" }} />
      </div>
    </div>
  );
}

function Timeline() {
  const events = [
    { date: "Mar 2022", label: "First draft submitted", type: "paper" },
    { date: "Jun 2022", label: "Peer review received", type: "review" },
    { date: "Sep 2022", label: "Revisions completed", type: "paper" },
    { date: "Jan 2023", label: "Published in Nature", type: "publication" },
    { date: "Mar 2024", label: "200 citations reached", type: "milestone" },
  ];
  const typeColors: Record<string, string> = {
    paper: "#3A6FA8",
    review: "#B8780A",
    publication: "#3A8C4F",
    milestone: "#4A7C59",
  };
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-2 bottom-2 w-px" style={{ background: "var(--c-border-default)" }} />
      {events.map(({ date, label, type }) => (
        <div key={date} className="relative flex items-start gap-3 mb-4">
          <div
            className="absolute -left-4 w-2 h-2 rounded-full mt-1 flex-shrink-0"
            style={{ background: typeColors[type] }}
          />
          <div>
            <p className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)" }}>{date}</p>
            <p className="text-sm" style={{ color: "var(--c-text-primary)" }}>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Comparison() {
  const items = [
    { label: "Cambium users", value: 76 },
    { label: "Control group", value: 43 },
  ];
  return (
    <div className="space-y-4">
      {items.map(({ label, value }) => (
        <div key={label}>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs" style={{ color: "var(--c-text-secondary)" }}>{label}</span>
            <span className="text-xs font-mono font-semibold" style={{ color: "var(--c-text-primary)" }}>{value}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--c-surface-sunken)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${value}%`,
                background: label.includes("Cambium") ? "#4A7C59" : "#C8C5BD",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityHeatmap() {
  const days = Array.from({ length: 35 }, (_, i) => ({
    value: Math.random(),
    active: Math.random() > 0.35,
  }));
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
      {days.map((d, i) => (
        <div
          key={i}
          className="aspect-square rounded-sm"
          style={{
            background: d.active
              ? `rgba(74, 124, 89, ${0.15 + d.value * 0.75})`
              : "var(--c-surface-sunken)",
          }}
        />
      ))}
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
    >
      <div className="mb-4">
        <p className="text-sm font-semibold" style={{ color: "var(--c-text-primary)" }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--c-text-tertiary)" }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export default function DataViz() {
  return (
    <SectionWrapper id="11-data-viz">
      <SectionHeader
        number="11"
        title="Data Visualization"
        description="Academic-grade charts that communicate clearly. Typography and spacing lead. Decoration follows."
      />

      <div className="grid grid-cols-2 gap-5 mb-5">
        <ChartCard title="Research Output" subtitle="Publications per month, 12-month trend">
          <LineChart />
        </ChartCard>
        <ChartCard title="Activity by Category" subtitle="Contributions across research types">
          <div className="pt-2">
            <BarChart />
          </div>
        </ChartCard>
        <ChartCard title="Grant Progress" subtitle="Milestones completed vs. total">
          <div className="pt-2">
            <ProgressBar label="Data collection" value={18} total={20} />
            <ProgressBar label="Analysis" value={11} total={20} />
            <ProgressBar label="Writing" value={6} total={20} color="#96C0A6" />
            <ProgressBar label="Review" value={2} total={20} color="#C8C5BD" />
          </div>
        </ChartCard>
        <ChartCard title="Publication Timeline" subtitle="Key milestones for primary paper">
          <Timeline />
        </ChartCard>
        <ChartCard title="Collaboration Effectiveness" subtitle="Avg. papers completed in 12 months">
          <Comparison />
        </ChartCard>
        <ChartCard title="Weekly Activity" subtitle="Research contributions, last 5 weeks">
          <ActivityHeatmap />
        </ChartCard>
      </div>

      <div className="p-5 rounded-lg" style={{ background: "var(--c-surface-sunken)", border: "1px solid var(--c-border-default)" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--c-text-tertiary)" }}>
          Design principles
        </p>
        <div className="grid grid-cols-3 gap-4 text-xs" style={{ color: "var(--c-text-secondary)" }}>
          <p>· Use moss green as the primary data color. Use grey for secondary datasets.</p>
          <p>· Label axes clearly, always show units. Never require a legend to interpret a single-series chart.</p>
          <p>· Remove chart junk: no gradients, no 3D effects, no decorative grid lines at high density.</p>
        </div>
      </div>
    </SectionWrapper>
  );
}
