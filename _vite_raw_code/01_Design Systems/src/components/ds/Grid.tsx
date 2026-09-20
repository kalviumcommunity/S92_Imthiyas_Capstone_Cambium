import { SectionWrapper, SectionHeader } from "./shared";

interface GridSpec {
  label: string;
  width: number;
  columns: number;
  margins: number;
  gutters: number;
  maxContent?: string;
}

const grids: GridSpec[] = [
  { label: "Desktop 1440", width: 1440, columns: 12, margins: 88, gutters: 24, maxContent: "1280px" },
  { label: "Desktop 1280", width: 1280, columns: 12, margins: 64, gutters: 24 },
  { label: "Tablet 1024", width: 1024, columns: 8, margins: 48, gutters: 20 },
  { label: "Tablet 768", width: 768, columns: 6, margins: 32, gutters: 16 },
  { label: "Mobile 390", width: 390, columns: 4, margins: 20, gutters: 16 },
];

function GridVisual({ columns, scaleFactor }: { columns: number; scaleFactor: number }) {
  const containerWidth = 480 * scaleFactor;
  const gutterWidth = 8;
  const usedForGutters = gutterWidth * (columns - 1);
  const colWidth = (containerWidth - usedForGutters) / columns;

  return (
    <div className="flex items-stretch" style={{ width: containerWidth, height: 48, gap: gutterWidth }}>
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded-sm"
          style={{
            width: colWidth,
            background: i % 2 === 0 ? "var(--c-moss-100)" : "var(--c-moss-050)",
            border: "1px solid var(--c-moss-300)",
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

export default function Grid() {
  return (
    <SectionWrapper id="06-grid">
      <SectionHeader
        number="06"
        title="Grid"
        description="Responsive layout grids provide the structural foundation for every Cambium view."
      />

      <div className="space-y-8">
        {grids.map((g) => {
          const scale = Math.min(480 / g.width, 1);
          return (
            <div
              key={g.label}
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--c-border-default)" }}
            >
              {/* Column visual */}
              <div
                className="px-8 py-6 flex items-center"
                style={{ background: "var(--c-surface-raised)" }}
              >
                {/* Margin indicators */}
                <div
                  className="flex-shrink-0 rounded-l-sm"
                  style={{
                    width: g.margins * scale * 0.5,
                    height: 48,
                    background: "var(--c-surface-sunken)",
                    border: "1px solid var(--c-border-default)",
                    borderRight: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)", fontSize: 9, writingMode: "vertical-rl" as const }}>
                    {g.margins}
                  </span>
                </div>
                <GridVisual columns={g.columns} scaleFactor={scale} />
                <div
                  className="flex-shrink-0 rounded-r-sm"
                  style={{
                    width: g.margins * scale * 0.5,
                    height: 48,
                    background: "var(--c-surface-sunken)",
                    border: "1px solid var(--c-border-default)",
                    borderLeft: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)", fontSize: 9, writingMode: "vertical-rl" as const }}>
                    {g.margins}
                  </span>
                </div>
              </div>

              {/* Specs */}
              <div
                className="px-8 py-4 flex items-center gap-8"
                style={{ borderTop: "1px solid var(--c-border-default)", background: "var(--c-surface-base)" }}
              >
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--c-text-primary)" }}>{g.label}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: "var(--c-text-tertiary)" }}>{g.width}px</p>
                </div>
                <div className="h-6 w-px" style={{ background: "var(--c-border-default)" }} />
                <Spec label="Columns" value={String(g.columns)} />
                <Spec label="Margins" value={`${g.margins}px`} />
                <Spec label="Gutters" value={`${g.gutters}px`} />
                {g.maxContent && <Spec label="Max content" value={g.maxContent} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="mt-10 p-5 rounded-lg" style={{ background: "var(--c-surface-sunken)", border: "1px solid var(--c-border-default)" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--c-text-tertiary)" }}>
          Grid principles
        </p>
        <ul className="text-sm space-y-2" style={{ color: "var(--c-text-secondary)" }}>
          <li>· Primary content should never exceed 1280px on wide viewports.</li>
          <li>· Use the 12-column grid for dense research dashboards; 6 or fewer columns for reading-focused layouts.</li>
          <li>· On mobile, default to full-width single column with 20px side margins.</li>
        </ul>
      </div>
    </SectionWrapper>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>{label}</p>
      <p className="text-sm font-mono font-medium" style={{ color: "var(--c-text-secondary)" }}>{value}</p>
    </div>
  );
}
