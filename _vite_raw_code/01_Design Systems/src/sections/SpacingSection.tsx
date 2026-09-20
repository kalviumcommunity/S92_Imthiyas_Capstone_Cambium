import SectionWrapper from "../components/SectionWrapper";

const tokens = [
  { token: "space/2", px: 2, usage: "Icon nudge, hairline" },
  { token: "space/4", px: 4, usage: "Icon gap, tight spacing" },
  { token: "space/8", px: 8, usage: "Micro spacing, compact UI" },
  { token: "space/12", px: 12, usage: "Element spacing" },
  { token: "space/16", px: 16, usage: "Component internal padding" },
  { token: "space/24", px: 24, usage: "Card internal padding" },
  { token: "space/32", px: 32, usage: "Component separation" },
  { token: "space/48", px: 48, usage: "Section separation" },
  { token: "space/64", px: 64, usage: "Major composition spacing" },
  { token: "space/80", px: 80, usage: "Generous section breaks" },
  { token: "space/96", px: 96, usage: "Large section gap" },
  { token: "space/120", px: 120, usage: "Hero / landing separation" },
  { token: "space/160", px: 160, usage: "Maximum structural spacing" },
];

const MAX_PX = 160;

export default function SpacingSection() {
  return (
    <SectionWrapper
      id="spacing"
      num="05"
      title="Spacing"
      description="An 8px base grid. All spacing values are multiples of 4, with the primary rhythm being 8px increments. Consistency across the system."
    >
      <div className="space-y-3">
        {tokens.map(({ token, px, usage }) => {
          const barWidth = Math.max(8, Math.round((px / MAX_PX) * 100));
          return (
            <div key={token} className="grid grid-cols-[140px_1fr_auto] items-center gap-4">
              <div>
                <div className="text-[11px] font-mono font-medium text-ink-primary">{token}</div>
                <div className="text-[11px] font-mono text-ink-tertiary">{px}px</div>
              </div>
              <div className="flex items-center h-7">
                <div
                  className="h-2 rounded-full bg-moss-300 transition-all"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="text-[11px] text-ink-tertiary text-right w-48">{usage}</div>
            </div>
          );
        })}
      </div>

      {/* Visual grid examples */}
      <div className="mt-12">
        <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-6">Common Patterns</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Compact Component", inner: 8, between: 12 },
            { label: "Standard Component", inner: 16, between: 24 },
            { label: "Spacious Card", inner: 24, between: 32 },
          ].map(({ label, inner, between }) => (
            <div key={label} className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden">
              <div className="p-3 border-b border-edge-default bg-surface-sunken">
                <span className="text-[11px] text-ink-tertiary">{label}</span>
              </div>
              <div style={{ padding: `${inner}px` }}>
                <div className="bg-moss-050 border border-moss-100 rounded h-6 mb-1" style={{ marginBottom: `${between - inner}px` }} />
                <div className="bg-moss-050 border border-moss-100 rounded h-6" />
                <div className="mt-2 text-[10px] font-mono text-ink-tertiary">
                  padding: {inner}px · gap: {between}px
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
