import SectionWrapper from "../components/SectionWrapper";

// Brand-derived chart colors
const PRIMARY = "#173F35";
const SECONDARY = "#285C4D";
const ACCENT = "#DCEBE4";
const ACCENT_MID = "#7EB5A0";
const TEXT = "#66716C";
const GRID_LINE = "#DDE2DE";
const SURFACE = "#FFFFFF";

function ChartLabel({ label }: { label: string }) {
  return (
    <div className="px-3 py-2 bg-surface-sunken border-b border-edge-default">
      <span className="text-[10px] font-semibold tracking-[0.12em] text-ink-tertiary uppercase">{label}</span>
    </div>
  );
}

function BarChart() {
  const data = [
    { label: "2020", value: 42 },
    { label: "2021", value: 58 },
    { label: "2022", value: 71 },
    { label: "2023", value: 85 },
    { label: "2024", value: 94 },
  ];
  const max = 100;
  const h = 100;
  const barW = 28;
  const gap = 14;
  const totalW = data.length * (barW + gap) - gap + 36;

  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden">
      <ChartLabel label="Bar Chart — Publications per year" />
      <div className="p-5">
        <svg width={totalW} height={h + 32} viewBox={`0 0 ${totalW} ${h + 32}`}>
          {[0, 25, 50, 75, 100].map((v) => {
            const y = h - (v / max) * h;
            return (
              <g key={v}>
                <line x1="0" y1={y} x2={totalW} y2={y} stroke={GRID_LINE} strokeWidth="1" />
                <text x="0" y={y - 3} fontSize="8" fill={TEXT} opacity="0.8">{v}</text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const barH = (d.value / max) * h;
            const x = 18 + i * (barW + gap);
            const y = h - barH;
            const isLatest = i === 4;
            return (
              <g key={d.label}>
                <rect x={x} y={y} width={barW} height={barH} fill={isLatest ? PRIMARY : ACCENT} rx="2" />
                <text x={x + barW / 2} y={h + 14} textAnchor="middle" fontSize="9" fill={TEXT} fontFamily="Manrope, system-ui, sans-serif">{d.label}</text>
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="8" fill={isLatest ? PRIMARY : SECONDARY} fontFamily="Manrope" fontWeight="600">{d.value}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function LineChart() {
  const data = [12, 18, 15, 28, 32, 24, 38, 42, 35, 50, 48, 56];
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const W = 280, H = 80;
  const max = 60;
  const stepX = W / (data.length - 1);
  const points = data.map((v, i) => `${i * stepX},${H - (v / max) * H}`).join(" ");
  const areaPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden">
      <ChartLabel label="Line Chart — Research activity trend" />
      <div className="p-5">
        <svg width={W} height={H + 24} viewBox={`0 0 ${W} ${H + 24}`}>
          {[0, 30, 60].map((v) => (
            <line key={v} x1={0} y1={H - (v / max) * H} x2={W} y2={H - (v / max) * H} stroke={GRID_LINE} strokeWidth="1" />
          ))}
          <polyline points={areaPoints} fill={ACCENT} opacity="0.4" />
          <polyline points={points} fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {data.map((v, i) => (
            <g key={i}>
              <circle cx={i * stepX} cy={H - (v / max) * H} r={i === 11 ? 4 : 0} fill={PRIMARY} />
              <text x={i * stepX} y={H + 14} textAnchor="middle" fontSize="8" fill={TEXT} fontFamily="Manrope">{months[i]}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function Timeline() {
  const events = [
    { year: "2022", label: "Project started", type: "milestone" },
    { year: "2023 Q1", label: "First data collection", type: "event" },
    { year: "2023 Q3", label: "Preliminary results", type: "event" },
    { year: "2024 Q1", label: "Paper submitted", type: "milestone" },
    { year: "2024 Q2", label: "Peer review", type: "event" },
  ];

  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden">
      <ChartLabel label="Timeline — Research milestones" />
      <div className="p-5">
        <div className="relative">
          <div className="absolute left-20 top-0 bottom-0 w-px bg-edge-default" />
          {events.map((e, i) => (
            <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
              <span className="text-[10px] font-mono text-ink-tertiary text-right w-16 flex-shrink-0">{e.year}</span>
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 relative z-10"
                style={{
                  background: e.type === "milestone" ? PRIMARY : SURFACE,
                  border: e.type === "milestone" ? `none` : `1.5px solid ${ACCENT_MID}`,
                }}
              />
              <span className="text-xs text-ink-secondary">{e.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Progress() {
  const items = [
    { label: "Data collection", pct: 100 },
    { label: "Analysis", pct: 72 },
    { label: "Writing", pct: 40 },
    { label: "Peer review", pct: 0 },
  ];

  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden">
      <ChartLabel label="Progress — Project completion" />
      <div className="p-5 space-y-3.5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-ink-secondary">{item.label}</span>
              <span className="text-[10px] font-mono text-ink-tertiary">{item.pct}%</span>
            </div>
            <div className="h-1.5 bg-surface-sunken rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.pct}%`,
                  background: item.pct === 100 ? PRIMARY : item.pct > 0 ? ACCENT_MID : "transparent",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Distribution() {
  const cats = [
    { label: "Biology", pct: 34, color: PRIMARY },
    { label: "Chemistry", pct: 22, color: SECONDARY },
    { label: "Physics", pct: 18, color: ACCENT_MID },
    { label: "Other", pct: 26, color: ACCENT },
  ];
  let offset = 0;
  const R = 50, CX = 70, CY = 65;

  const slices = cats.map((c) => {
    const start = (offset / 100) * 360;
    const angle = (c.pct / 100) * 360;
    const sR = ((start - 90) * Math.PI) / 180;
    const eR = ((start + angle - 90) * Math.PI) / 180;
    const x1 = CX + R * Math.cos(sR), y1 = CY + R * Math.sin(sR);
    const x2 = CX + R * Math.cos(eR), y2 = CY + R * Math.sin(eR);
    const large = angle > 180 ? 1 : 0;
    const path = `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
    offset += c.pct;
    return { ...c, path };
  });

  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden">
      <ChartLabel label="Distribution — Research fields" />
      <div className="p-5 flex items-center gap-6">
        <svg width={140} height={130} viewBox="0 0 140 130">
          {slices.map((s) => (
            <path key={s.label} d={s.path} fill={s.color} stroke={SURFACE} strokeWidth="2" />
          ))}
          <circle cx={CX} cy={CY} r={22} fill={SURFACE} />
        </svg>
        <div className="space-y-2">
          {cats.map((c) => (
            <div key={c.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: c.color, border: `1px solid ${GRID_LINE}` }} />
              <span className="text-[11px] text-ink-secondary">{c.label}</span>
              <span className="text-[11px] font-mono text-ink-tertiary ml-auto">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityHeatmap() {
  const weeks = 12;
  const days = 7;
  const values = Array.from({ length: weeks * days }, () =>
    Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0
  );
  const fills = ["#EEECE6", "#DCEBE4", "#7EB5A0", "#285C4D", "#173F35"];

  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden">
      <ChartLabel label="Activity — Research contributions" />
      <div className="p-5">
        <div className="flex gap-1">
          {Array.from({ length: weeks }).map((_, w) => (
            <div key={w} className="flex flex-col gap-1">
              {Array.from({ length: days }).map((_, d) => {
                const val = values[w * days + d];
                return (
                  <div
                    key={d}
                    className="w-4 h-4 rounded-sm"
                    style={{ background: fills[Math.min(val, 4)] }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] text-ink-tertiary">Less</span>
          {fills.map((f) => (
            <div key={f} className="w-3 h-3 rounded-sm" style={{ background: f, border: `1px solid ${GRID_LINE}` }} />
          ))}
          <span className="text-[10px] text-ink-tertiary">More</span>
        </div>
      </div>
    </div>
  );
}

export default function DataVizSection() {
  return (
    <SectionWrapper
      id="data-viz"
      num="11"
      title="Data Visualization"
      description="Restrained academic charts derived from the brand palette. Forest green anchors key data points. The accent fills create breathing room without competing with content."
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <BarChart />
        <LineChart />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Timeline />
        <Progress />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Distribution />
        <ActivityHeatmap />
      </div>
    </SectionWrapper>
  );
}
