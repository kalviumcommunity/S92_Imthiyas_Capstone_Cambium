import SectionWrapper from "../components/SectionWrapper";

const tokens = [
  { token: "radius/none", px: 0, usage: "Tables, strict grid elements" },
  { token: "radius/sm", px: 4, usage: "Badges, tags, compact chips" },
  { token: "radius/md", px: 8, usage: "Default — inputs, buttons, small cards" },
  { token: "radius/lg", px: 12, usage: "Cards, modals, panels" },
  { token: "radius/xl", px: 16, usage: "Feature cards, large containers" },
  { token: "radius/full", px: 999, usage: "Pills, avatars, toggles" },
];

export default function RadiusSection() {
  return (
    <SectionWrapper
      id="radius"
      num="07"
      title="Radius"
      description="A restrained, functional radius scale. Cambium should not feel excessively rounded. The default radius is 8px. Pill shapes are reserved for compact controls."
    >
      <div className="grid grid-cols-3 gap-5 mb-10">
        {tokens.map(({ token, px, usage }) => (
          <div key={token} className="bg-surface-raised border border-edge-default rounded-xl p-5">
            <div
              className="w-full h-20 bg-surface-sunken border border-edge-strong mb-4"
              style={{ borderRadius: Math.min(px, 32) }}
            />
            <div className="text-[11px] font-mono font-medium text-ink-primary mb-0.5">{token}</div>
            <div className="text-[11px] font-mono text-ink-tertiary mb-1.5">{px === 999 ? "999px" : `${px}px`}</div>
            <div className="text-[11px] text-ink-secondary">{usage}</div>
          </div>
        ))}
      </div>

      {/* Usage examples */}
      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-5">Applied Examples</h3>
      <div className="bg-surface-raised border border-edge-default rounded-xl p-8 space-y-6">
        {/* Button row */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-ink-tertiary w-24">Button</span>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium bg-moss-600 text-white" style={{ borderRadius: 8 }}>
              Save changes
            </button>
            <button className="px-4 py-2 text-sm font-medium border border-edge-strong text-ink-secondary" style={{ borderRadius: 8 }}>
              Cancel
            </button>
          </div>
          <span className="text-[11px] font-mono text-ink-tertiary">radius/md — 8px</span>
        </div>

        {/* Tag row */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-ink-tertiary w-24">Tags</span>
          <div className="flex items-center gap-2">
            {["Machine Learning", "Neuroscience", "Open Access"].map((t) => (
              <span key={t} className="px-3 py-1 text-[11px] font-medium bg-moss-050 text-moss-700 border border-moss-100" style={{ borderRadius: 999 }}>
                {t}
              </span>
            ))}
          </div>
          <span className="text-[11px] font-mono text-ink-tertiary">radius/full</span>
        </div>

        {/* Card row */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-ink-tertiary w-24">Card</span>
          <div className="px-4 py-3 bg-surface-sunken border border-edge-default text-sm text-ink-secondary" style={{ borderRadius: 12 }}>
            Publication card — radius/lg — 12px
          </div>
          <span className="text-[11px] font-mono text-ink-tertiary">radius/lg — 12px</span>
        </div>

        {/* Avatar row */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-ink-tertiary w-24">Avatar</span>
          <div className="flex gap-2">
            {["JL", "AR", "MW"].map((init) => (
              <div
                key={init}
                className="w-8 h-8 bg-moss-100 flex items-center justify-center text-[11px] font-semibold text-moss-700"
                style={{ borderRadius: 999 }}
              >
                {init}
              </div>
            ))}
          </div>
          <span className="text-[11px] font-mono text-ink-tertiary">radius/full</span>
        </div>
      </div>
    </SectionWrapper>
  );
}
