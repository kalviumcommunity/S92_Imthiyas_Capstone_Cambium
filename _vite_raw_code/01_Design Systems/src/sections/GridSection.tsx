import SectionWrapper from "../components/SectionWrapper";

interface GridSpec {
  label: string;
  width: string;
  cols: number;
  margin: string;
  gutter: string;
  maxContent?: string;
}

const grids: GridSpec[] = [
  { label: "Desktop 1440", width: "1440px", cols: 12, margin: "88px", gutter: "24px", maxContent: "1280px" },
  { label: "Desktop 1280", width: "1280px", cols: 12, margin: "64px", gutter: "24px" },
  { label: "Tablet 1024", width: "1024px", cols: 8, margin: "48px", gutter: "20px" },
  { label: "Tablet 768", width: "768px", cols: 6, margin: "32px", gutter: "16px" },
  { label: "Mobile 390", width: "390px", cols: 4, margin: "20px", gutter: "16px" },
];

function GridPreview({ grid }: { grid: GridSpec }) {
  const containerWidth = 320;
  const marginPx = 20;
  const availableWidth = containerWidth - marginPx * 2;
  const gutterPx = 6;
  const totalGutters = (grid.cols - 1) * gutterPx;
  const colWidth = Math.floor((availableWidth - totalGutters) / grid.cols);

  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden">
      <div className="p-4 border-b border-edge-default bg-surface-sunken flex items-center justify-between">
        <span className="text-xs font-medium text-ink-primary">{grid.label}</span>
        <span className="text-[11px] font-mono text-ink-tertiary">{grid.width}</span>
      </div>
      <div className="p-4">
        {/* Grid visual */}
        <div
          className="relative mb-4 flex"
          style={{
            width: containerWidth,
            paddingLeft: marginPx,
            paddingRight: marginPx,
            height: 48,
          }}
        >
          {/* Margin overlays */}
          <div className="absolute inset-y-0 left-0 bg-orange-100/40" style={{ width: marginPx }} />
          <div className="absolute inset-y-0 right-0 bg-orange-100/40" style={{ width: marginPx }} />
          {/* Columns */}
          <div className="flex gap-[6px] flex-1">
            {Array.from({ length: grid.cols }).map((_, i) => (
              <div
                key={i}
                className="bg-moss-100/70 rounded-sm flex-1 h-full"
                style={{ maxWidth: colWidth }}
              />
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            ["Columns", `${grid.cols}`],
            ["Margin", grid.margin],
            ["Gutter", grid.gutter],
            ...(grid.maxContent ? [["Max content", grid.maxContent]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[11px] text-ink-tertiary">{k}</span>
              <span className="text-[11px] font-mono text-ink-primary">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GridSection() {
  return (
    <SectionWrapper
      id="grid"
      num="06"
      title="Grid"
      description="Responsive 12-column layout system. Content scales gracefully from desktop to mobile with progressive column reduction and adjusted margins."
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        {grids.slice(0, 2).map((g) => <GridPreview key={g.label} grid={g} />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {grids.slice(2).map((g) => <GridPreview key={g.label} grid={g} />)}
      </div>
    </SectionWrapper>
  );
}
