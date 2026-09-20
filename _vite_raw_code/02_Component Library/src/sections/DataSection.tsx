import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function ProgressIndicators() {
  const items = [
    { label: "Literature review", val: 100, color: "bg-sage" },
    { label: "Methodology", val: 75, color: "bg-navy" },
    { label: "Experiments", val: 40, color: "bg-navy" },
    { label: "Paper draft", val: 15, color: "bg-navy" },
  ];
  return (
    <div className="space-y-4 max-w-sm">
      {items.map(({ label, val, color }) => (
        <div key={label}>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-ink-2">{label}</span>
            <span className="text-xs font-medium text-ink">{val}%</span>
          </div>
          <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${val}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendIndicator({ val, label, trend, unit = "" }: { val: string; label: string; trend: "up" | "down" | "flat"; unit?: string }) {
  const trendConfig = {
    up: { icon: "↑", color: "text-sage", bg: "bg-sage-light" },
    down: { icon: "↓", color: "text-crimson", bg: "bg-crimson-light" },
    flat: { icon: "→", color: "text-ink-3", bg: "bg-surface-3" },
  }[trend];
  return (
    <div className="bg-surface border border-line rounded-lg p-4 min-w-[120px]">
      <p className="text-[10px] text-ink-3 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-semibold text-ink font-serif mb-1">{val}<span className="text-sm font-sans font-normal text-ink-3 ml-0.5">{unit}</span></p>
      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${trendConfig.color} ${trendConfig.bg}`}>
        {trendConfig.icon} {trend === "up" ? "+12% this month" : trend === "down" ? "-3% this month" : "No change"}
      </span>
    </div>
  );
}

function MiniBarChart() {
  const data = [
    { label: "Jan", val: 3 },
    { label: "Feb", val: 5 },
    { label: "Mar", val: 2 },
    { label: "Apr", val: 8 },
    { label: "May", val: 6 },
    { label: "Jun", val: 11 },
    { label: "Jul", val: 9 },
    { label: "Aug", val: 14 },
  ];
  const max = Math.max(...data.map(d => d.val));
  return (
    <div className="bg-surface border border-line rounded-lg p-4">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p className="text-[10px] text-ink-3 uppercase tracking-widest">Publications per month</p>
          <p className="text-xl font-semibold text-ink font-serif mt-0.5">58 <span className="text-sm font-sans font-normal text-ink-3">this year</span></p>
        </div>
        <span className="text-[11px] text-sage font-medium bg-sage-light px-2 py-0.5 rounded">↑ 23%</span>
      </div>
      <div className="flex items-end gap-1.5 h-20">
        {data.map(({ label, val }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-navy rounded-sm hover:bg-navy-mid transition-colors cursor-pointer"
              style={{ height: `${(val / max) * 100}%` }}
              title={`${label}: ${val}`}
            />
            <span className="text-[9px] text-ink-3">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityGraph() {
  const weeks = 16;
  const days = 7;
  const activity = Array.from({ length: weeks * days }, () =>
    Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 4) + 1
  );
  const intensities = ["bg-surface-3", "bg-navy-light", "bg-navy-mid/40", "bg-navy-mid/70", "bg-navy"];
  return (
    <div className="bg-surface border border-line rounded-lg p-4">
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-[10px] text-ink-3 uppercase tracking-widest">Research activity</p>
        <span className="text-[11px] text-ink-3">Past 16 weeks</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }).map((_, d) => {
              const val = activity[w * days + d];
              return (
                <div
                  key={d}
                  className={`w-3 h-3 rounded-sm ${intensities[val]}`}
                  title={`${val} activities`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 mt-2">
        <span className="text-[9px] text-ink-3">Less</span>
        {intensities.map((cls, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-sm ${cls}`} />
        ))}
        <span className="text-[9px] text-ink-3">More</span>
      </div>
    </div>
  );
}

function DataTable() {
  const rows = [
    { paper: "Federated Learning in Medical Imaging", year: 2024, citations: 142, venue: "Nature MI", type: "Review" },
    { paper: "Differential Privacy in Neural Networks", year: 2023, citations: 89, venue: "NeurIPS", type: "Conference" },
    { paper: "Communication-Efficient Federated Learning", year: 2022, citations: 234, venue: "ICML", type: "Conference" },
    { paper: "Privacy-Preserving Healthcare AI", year: 2024, citations: 31, venue: "JMIR", type: "Journal" },
  ];
  return (
    <div className="bg-surface border border-line rounded-lg overflow-hidden max-w-3xl">
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <p className="text-xs font-medium text-ink">Reading list</p>
        <div className="flex items-center gap-2 text-[11px] text-ink-3">
          <span>4 papers</span>
          <span>·</span>
          <button className="text-navy hover:underline font-medium">Sort by citations</button>
        </div>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-line bg-surface-2">
            {["Paper", "Venue", "Year", "Citations", "Type"].map(h => (
              <th key={h} className="text-left text-[10px] uppercase tracking-widest text-ink-3 font-medium px-4 py-2.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map(({ paper, year, citations, venue, type }) => (
            <tr key={paper} className="hover:bg-surface-2 transition-colors cursor-pointer">
              <td className="px-4 py-3 font-medium text-ink max-w-xs">
                <span className="line-clamp-1">{paper}</span>
              </td>
              <td className="px-4 py-3 text-ink-3">{venue}</td>
              <td className="px-4 py-3 text-ink-2">{year}</td>
              <td className="px-4 py-3">
                <span className="text-ink-2 font-medium">{citations}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-[10px] bg-surface-2 text-ink-3 px-2 py-0.5 rounded border border-line font-medium">
                  {type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResearchStatistics() {
  return (
    <div className="grid grid-cols-2 gap-3 max-w-md">
      <TrendIndicator val="28" label="Papers" trend="up" />
      <TrendIndicator val="1.2k" label="Citations" trend="up" />
      <TrendIndicator val="14" label="h-index" trend="flat" />
      <TrendIndicator val="6" label="Active projects" trend="down" unit=" active" />
    </div>
  );
}

export default function DataSection() {
  return (
    <SectionWrapper
      id="data"
      number="13"
      title="Data Components"
      description="Restrained, academic data visualization. Research metrics should inform, not decorate."
    >
      <ComponentGroup label="Research Statistics" note="Key metrics with trend indicators">
        <ResearchStatistics />
      </ComponentGroup>
      <ComponentGroup label="Progress Indicators" note="Multi-item progress tracking">
        <ProgressIndicators />
      </ComponentGroup>
      <ComponentGroup label="Mini Bar Chart" note="Publication frequency visualization">
        <div className="max-w-md">
          <MiniBarChart />
        </div>
      </ComponentGroup>
      <ComponentGroup label="Activity Graph" note="Research activity heatmap">
        <div className="max-w-xl">
          <ActivityGraph />
        </div>
      </ComponentGroup>
      <ComponentGroup label="Data Table" note="Research paper list with sortable columns">
        <DataTable />
      </ComponentGroup>
    </SectionWrapper>
  );
}
