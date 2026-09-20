import { SectionWrapper, SectionHeader } from "./shared";

const radii = [
  { token: "radius/none", px: 0, label: "None", usage: "Tables, dense data, inline code" },
  { token: "radius/sm", px: 4, label: "Small", usage: "Badges, inline tags, tooltips" },
  { token: "radius/md", px: 8, label: "Medium", usage: "Default — inputs, buttons, cards" },
  { token: "radius/lg", px: 12, label: "Large", usage: "Panels, dialogs, large cards" },
  { token: "radius/xl", px: 16, label: "Extra Large", usage: "Feature cards, image containers" },
  { token: "radius/full", px: 999, label: "Full", usage: "Pills, tags, filters, avatars, status" },
];

export default function Radius() {
  return (
    <SectionWrapper id="07-radius">
      <SectionHeader
        number="07"
        title="Radius"
        description="A restrained corner system. Cambium reads as precise and modern, not excessively rounded."
      />

      <div className="grid grid-cols-3 gap-6 mb-12">
        {radii.map(({ token, px, label, usage }) => (
          <div
            key={token}
            className="p-6"
            style={{
              border: "1px solid var(--c-border-default)",
              background: "var(--c-surface-raised)",
              borderRadius: 8,
            }}
          >
            {/* Swatch */}
            <div className="mb-5 flex items-center justify-center" style={{ height: 80 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: Math.min(px, 36),
                  border: "2px solid var(--c-border-strong)",
                  background: "var(--c-surface-sunken)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)" }}>
                  {px === 999 ? "∞" : `${px}px`}
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold mb-1" style={{ color: "var(--c-moss-500)" }}>{label}</p>
            <p className="text-sm font-mono font-medium mb-1" style={{ color: "var(--c-text-primary)" }}>{token}</p>
            <p className="text-xs font-mono mb-3" style={{ color: "var(--c-text-tertiary)" }}>
              {px === 999 ? "999px" : `${px}px`}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--c-text-secondary)" }}>{usage}</p>
          </div>
        ))}
      </div>

      {/* Default recommendation */}
      <div
        className="p-6 rounded-xl"
        style={{ background: "var(--c-moss-050)", border: "1px solid var(--c-moss-100)" }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--c-moss-600)" }}>
          Default recommendation
        </p>
        <div className="grid grid-cols-3 gap-6">
          {[
            { usage: "Buttons, inputs, small controls", radius: "radius/md · 8px" },
            { usage: "Cards, panels, modals", radius: "radius/lg · 12px" },
            { usage: "Feature sections, hero media", radius: "radius/xl · 16px" },
          ].map(({ usage, radius }) => (
            <div key={usage}>
              <p className="text-sm font-mono font-medium mb-1" style={{ color: "var(--c-moss-700)" }}>{radius}</p>
              <p className="text-xs" style={{ color: "var(--c-moss-600)" }}>{usage}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-5" style={{ color: "var(--c-moss-600)" }}>
          Reserve <code className="text-xs font-mono">radius/full</code> strictly for pill shapes: tags, filters, status chips, and avatar rings. Avoid using on large surfaces.
        </p>
      </div>
    </SectionWrapper>
  );
}
