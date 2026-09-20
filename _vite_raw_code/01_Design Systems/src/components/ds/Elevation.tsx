import { SectionWrapper, SectionHeader } from "./shared";

const elevations = [
  {
    level: "Elevation 0",
    token: "elevation/00",
    label: "Flat",
    shadow: "none",
    border: "1px solid #E4E2DC",
    surface: "#FAFAF8",
    desc: "Base content. No shadow, border-driven definition only.",
    usages: ["Page background", "Default content area", "Table rows"],
  },
  {
    level: "Elevation 1",
    token: "elevation/01",
    label: "Raised",
    shadow: "0 1px 3px rgba(28,28,26,0.06), 0 1px 2px rgba(28,28,26,0.04)",
    border: "1px solid #E4E2DC",
    surface: "#F5F4F0",
    desc: "Subtle separation for cards and list items from the page background.",
    usages: ["Research cards", "Paper list items", "Sidebar panels"],
  },
  {
    level: "Elevation 2",
    token: "elevation/02",
    label: "Floating",
    shadow: "0 4px 12px rgba(28,28,26,0.08), 0 2px 4px rgba(28,28,26,0.05)",
    border: "1px solid #C8C5BD",
    surface: "#FAFAF8",
    desc: "Popovers, dropdowns, and floating controls that appear above content.",
    usages: ["Dropdowns", "Popovers", "Date pickers", "Command palette"],
  },
  {
    level: "Elevation 3",
    token: "elevation/03",
    label: "Overlay",
    shadow: "0 20px 48px rgba(28,28,26,0.14), 0 8px 16px rgba(28,28,26,0.08)",
    border: "1px solid #C8C5BD",
    surface: "#FAFAF8",
    desc: "Modals and full overlays that interrupt the main flow.",
    usages: ["Modals", "Dialogs", "Full-screen overlays", "Drawers"],
  },
];

function ElevCard({ level, shadow, border, surface, label, desc, usages }: typeof elevations[0]) {
  return (
    <div className="flex flex-col">
      {/* Demo card */}
      <div
        className="flex items-center justify-center mb-4"
        style={{ height: 120, background: "var(--c-surface-sunken)", borderRadius: 8, padding: 16 }}
      >
        <div
          className="w-full rounded-lg p-4 flex items-center gap-3"
          style={{ boxShadow: shadow, border, background: surface, maxWidth: 240 }}
        >
          <div className="w-8 h-8 rounded-md flex-shrink-0" style={{ background: "var(--c-border-default)" }} />
          <div className="flex-1">
            <div className="h-2.5 rounded" style={{ background: "var(--c-border-strong)", width: "70%", marginBottom: 6 }} />
            <div className="h-2 rounded" style={{ background: "var(--c-border-default)", width: "50%" }} />
          </div>
        </div>
      </div>

      {/* Specs */}
      <p className="text-xs font-semibold mb-1" style={{ color: "var(--c-moss-500)" }}>{level}</p>
      <p className="text-sm font-medium mb-1" style={{ color: "var(--c-text-primary)" }}>{label}</p>
      <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--c-text-secondary)" }}>{desc}</p>

      <div className="space-y-1.5 mb-3">
        <SpecRow label="Shadow" value={shadow === "none" ? "none" : "Soft layered"} />
        <SpecRow label="Border" value={border} />
        <SpecRow label="Surface" value={surface} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {usages.map((u) => (
          <span
            key={u}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "var(--c-surface-sunken)",
              border: "1px solid var(--c-border-default)",
              color: "var(--c-text-tertiary)",
            }}
          >
            {u}
          </span>
        ))}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs w-14 flex-shrink-0" style={{ color: "var(--c-text-tertiary)" }}>{label}</span>
      <span className="text-xs font-mono leading-tight" style={{ color: "var(--c-text-secondary)" }}>{value}</span>
    </div>
  );
}

export default function Elevation() {
  return (
    <SectionWrapper id="08-elevation">
      <SectionHeader
        number="08"
        title="Elevation"
        description="Border-first hierarchy. Shadows are soft, low-opacity, and reserved for floating or overlay contexts."
      />

      <div className="grid grid-cols-4 gap-6">
        {elevations.map((e) => (
          <ElevCard key={e.level} {...e} />
        ))}
      </div>

      <div
        className="mt-12 p-5 rounded-lg"
        style={{ background: "var(--c-surface-sunken)", border: "1px solid var(--c-border-default)" }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--c-text-tertiary)" }}>
          Principle
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--c-text-secondary)" }}>
          Cambium is primarily a <strong style={{ color: "var(--c-text-primary)" }}>border-driven interface</strong>. Use borders first to create structure. Only introduce shadows when an element genuinely floats above the content layer — popovers, dropdowns, and modals. Avoid heavy shadows that make the interface feel dated or heavy.
        </p>
      </div>
    </SectionWrapper>
  );
}
