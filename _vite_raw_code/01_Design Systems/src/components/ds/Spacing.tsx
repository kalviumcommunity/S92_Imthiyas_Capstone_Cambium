import { SectionWrapper, SectionHeader } from "./shared";

const spacingTokens = [
  { token: "space/2", px: 2, usage: "Micro gap" },
  { token: "space/4", px: 4, usage: "Tight gap" },
  { token: "space/8", px: 8, usage: "Micro spacing" },
  { token: "space/12", px: 12, usage: "Small gap" },
  { token: "space/16", px: 16, usage: "Component spacing" },
  { token: "space/24", px: 24, usage: "Internal card spacing" },
  { token: "space/32", px: 32, usage: "Component separation" },
  { token: "space/48", px: 48, usage: "Section separation" },
  { token: "space/64", px: 64, usage: "Major composition spacing" },
  { token: "space/80", px: 80, usage: "Section gap" },
  { token: "space/96", px: 96, usage: "Large section gap" },
  { token: "space/120", px: 120, usage: "Page section separation" },
  { token: "space/160", px: 160, usage: "Hero / mega section" },
];

export default function Spacing() {
  const maxPx = 160;

  return (
    <SectionWrapper id="05-spacing">
      <SectionHeader
        number="05"
        title="Spacing"
        description="An 8px-base scale. Consistent spacing builds rhythm and trust across every surface."
      />

      <div className="space-y-3">
        <div className="grid gap-3 text-xs font-semibold tracking-widest uppercase mb-2 pb-2" style={{
          gridTemplateColumns: "160px 1fr 80px 200px",
          color: "var(--c-text-tertiary)",
          borderBottom: "1px solid var(--c-border-default)",
        }}>
          <span>Token</span>
          <span>Visual</span>
          <span>Value</span>
          <span>Typical usage</span>
        </div>

        {spacingTokens.map(({ token, px, usage }) => {
          const barWidth = Math.max((px / maxPx) * 100, 2);
          return (
            <div
              key={token}
              className="grid items-center gap-3 py-2"
              style={{
                gridTemplateColumns: "160px 1fr 80px 200px",
                borderBottom: "1px solid var(--c-border-default)",
              }}
            >
              <span className="text-sm font-mono" style={{ color: "var(--c-text-primary)" }}>{token}</span>
              <div className="flex items-center">
                <div
                  className="rounded"
                  style={{
                    width: `${barWidth}%`,
                    height: Math.max(px <= 8 ? px : 8, 2),
                    background: "var(--c-moss-300)",
                    minWidth: 2,
                  }}
                />
              </div>
              <span className="text-sm font-mono" style={{ color: "var(--c-text-secondary)" }}>{px}px</span>
              <span className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>{usage}</span>
            </div>
          );
        })}
      </div>

      {/* Usage guide */}
      <div className="mt-12 grid grid-cols-3 gap-5">
        {[
          { range: "2–8px", label: "Micro", desc: "Icon padding, inline gap, tight stacking between related elements." },
          { range: "12–24px", label: "Component", desc: "Internal component padding, gaps between related UI elements within a card." },
          { range: "32–64px", label: "Layout", desc: "Separation between distinct components, card margins, grid gaps." },
          { range: "48–96px", label: "Section", desc: "Visual separation between major content sections on a page." },
          { range: "120–160px", label: "Hero", desc: "Breathing room for hero sections, major page composition anchors." },
          { range: "Base: 8px", label: "Grid base", desc: "All spacing values are multiples of 8px. Keep padding and margin on-grid." },
        ].map(({ range, label, desc }) => (
          <div
            key={label}
            className="p-5 rounded-lg"
            style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--c-moss-500)" }}>
              {label}
            </p>
            <p className="text-sm font-mono mb-2" style={{ color: "var(--c-text-secondary)" }}>{range}</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--c-text-tertiary)" }}>{desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
