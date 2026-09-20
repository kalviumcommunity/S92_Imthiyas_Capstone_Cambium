import SectionWrapper from "../components/SectionWrapper";

// Brand shadow base: #17201D = rgb(23, 32, 29)
const levels = [
  {
    name: "Elevation 0",
    token: "elevation/00",
    usage: "Flat surface — default page background",
    shadow: "none",
    border: "1px solid #DDE2DE",
    surface: "#F7F6F1",
    code: "shadow: none · border: 1px solid border/default",
  },
  {
    name: "Elevation 1",
    token: "elevation/01",
    usage: "Subtle card separation — raised panels",
    shadow: "0 1px 3px rgba(23,32,29,0.07), 0 1px 2px rgba(23,32,29,0.04)",
    border: "1px solid #DDE2DE",
    surface: "#FFFFFF",
    code: "shadow: 0 1px 3px rgba(17,201,D,0.07) · border: 1px solid border/default",
  },
  {
    name: "Elevation 2",
    token: "elevation/02",
    usage: "Floating popover — dropdowns, tooltips",
    shadow: "0 4px 14px rgba(23,32,29,0.1), 0 2px 4px rgba(23,32,29,0.06)",
    border: "1px solid #DDE2DE",
    surface: "#FFFFFF",
    code: "shadow: 0 4px 14px rgba(23,32,29,0.10) · border: 1px solid border/default",
  },
  {
    name: "Elevation 3",
    token: "elevation/03",
    usage: "Modal / overlay — dialog, drawer",
    shadow: "0 16px 48px rgba(23,32,29,0.14), 0 4px 12px rgba(23,32,29,0.08)",
    border: "1px solid #B8C4C0",
    surface: "#FFFFFF",
    code: "shadow: 0 16px 48px rgba(23,32,29,0.14) · border: 1px solid border/strong",
  },
];

export default function ElevationSection() {
  return (
    <SectionWrapper
      id="elevation"
      num="08"
      title="Elevation"
      description="Cambium is primarily border-driven. Shadows are soft, low-opacity, and derived from the forest green ink — they communicate spatial hierarchy, never decoration."
    >
      <div className="grid grid-cols-2 gap-5 mb-12">
        {levels.map((level) => (
          <div
            key={level.name}
            className="rounded-xl p-6 flex flex-col gap-4"
            style={{ background: "#F7F6F1", border: "1px solid #DDE2DE" }}
          >
            <div
              className="rounded-xl p-5"
              style={{
                background: level.surface,
                boxShadow: level.shadow,
                border: level.border,
              }}
            >
              <div className="h-4 w-32 bg-edge-default rounded mb-2" />
              <div className="h-3 w-48 rounded mb-1" style={{ background: "#DDE2DE", opacity: 0.7 }} />
              <div className="h-3 w-40 rounded" style={{ background: "#DDE2DE", opacity: 0.5 }} />
            </div>
            <div>
              <div className="text-xs font-semibold text-ink-primary mb-0.5">{level.name}</div>
              <div className="text-[11px] font-mono text-moss-600 mb-1">{level.token}</div>
              <div className="text-[11px] text-ink-secondary mb-1.5">{level.usage}</div>
              <div className="text-[10px] font-mono text-ink-tertiary leading-relaxed">{level.code}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-xl bg-surface-sunken border border-edge-default">
        <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-3">
          Elevation Principles
        </h3>
        <div className="space-y-2">
          {[
            "Default to borders for separation — shadow is a secondary tool",
            "Shadows are derived from forest green ink (#17201D), never pure black",
            "Never use colored, warm, or saturated shadows",
            "Elevation 3 is the maximum — do not stack further layers",
          ].map((p) => (
            <div key={p} className="flex items-start gap-2 text-sm text-ink-secondary">
              <span className="text-moss-500 mt-0.5 flex-shrink-0">→</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
