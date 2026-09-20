import { SectionWrapper, SectionHeader } from "./shared";

function CambiumMark({ size = 40, color = "#4A7C59" }: { size?: number; color?: string }) {
  const s = size / 40;
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 40 48" fill="none">
      {/* Vertical spine */}
      <line x1="20" y1="3" x2="20" y2="45" stroke={color} strokeWidth={2 * (1 / Math.max(s, 0.5))} strokeLinecap="round" />
      {/* Top node */}
      <circle cx="20" cy="4" r="3.5" fill={color} />
      {/* Left branch, upper */}
      <line x1="20" y1="16" x2="8" y2="16" stroke={color} strokeWidth={1.5 * (1 / Math.max(s, 0.5))} strokeLinecap="round" />
      <circle cx="7" cy="16" r="2.5" fill={color} />
      {/* Right branch, lower */}
      <line x1="20" y1="30" x2="32" y2="30" stroke={color} strokeWidth={1.5 * (1 / Math.max(s, 0.5))} strokeLinecap="round" />
      <circle cx="33" cy="30" r="2.5" fill={color} />
      {/* Bottom node */}
      <circle cx="20" cy="44" r="3.5" fill={color} />
    </svg>
  );
}

function CambiumWordmark({ color = "#1C1C1A", size = 32 }: { color?: string; size?: number }) {
  return (
    <div className="flex items-center gap-4">
      <CambiumMark size={size} color={color === "#1C1C1A" ? "#4A7C59" : color} />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: size * 0.7,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color,
          textTransform: "uppercase" as const,
        }}
      >
        CAMBIUM
      </span>
    </div>
  );
}

function LogoVariant({
  label,
  bg,
  children,
}: {
  label: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--c-border-default)" }}>
      <div className="flex items-center justify-center py-12 px-8" style={{ background: bg }}>
        {children}
      </div>
      <div className="px-4 py-3" style={{ background: "var(--c-surface-raised)", borderTop: "1px solid var(--c-border-default)" }}>
        <p className="text-xs font-medium" style={{ color: "var(--c-text-secondary)" }}>{label}</p>
      </div>
    </div>
  );
}

function UsageExample({ correct, label, bg = "var(--c-surface-raised)" }: { correct: boolean; label: string; bg?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: correct ? "#3A8C4F" : "#C43D3D" }}
      >
        {correct ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <span className="text-sm" style={{ color: "var(--c-text-secondary)" }}>{label}</span>
    </div>
  );
}

export default function Logo() {
  return (
    <SectionWrapper id="02-logo">
      <SectionHeader
        number="02"
        title="Logo"
        description="The Cambium identity system. Use consistently across all surfaces."
      />

      {/* Primary variants */}
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--c-text-tertiary)" }}>
          Primary Variants
        </p>
        <div className="grid grid-cols-2 gap-5">
          <LogoVariant label="Primary — Light" bg="var(--c-surface-base)">
            <CambiumWordmark size={32} />
          </LogoVariant>
          <LogoVariant label="Primary — Dark" bg="var(--c-surface-inverse)">
            <CambiumWordmark size={32} color="#F5F4F0" />
          </LogoVariant>
          <LogoVariant label="Wordmark only" bg="var(--c-surface-base)">
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "var(--c-text-primary)",
                textTransform: "uppercase" as const,
              }}
            >
              CAMBIUM
            </span>
          </LogoVariant>
          <LogoVariant label="Mark only" bg="var(--c-surface-base)">
            <div className="flex items-center gap-12">
              <CambiumMark size={48} />
              <CambiumMark size={32} />
              <CambiumMark size={20} />
              <CambiumMark size={14} />
            </div>
          </LogoVariant>
          <LogoVariant label="Monochrome — Charcoal" bg="#F5F4F0">
            <CambiumWordmark size={28} color="#1C1C1A" />
          </LogoVariant>
          <LogoVariant label="Inverse — On Dark" bg="#1C1C1A">
            <CambiumWordmark size={28} color="#FAFAF8" />
          </LogoVariant>
        </div>
      </div>

      {/* Clear space & minimum size */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-xl" style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--c-text-tertiary)" }}>
            Clear Space
          </p>
          <div
            className="flex items-center justify-center"
            style={{
              border: "1.5px dashed var(--c-border-strong)",
              borderRadius: 8,
              padding: 32,
              background: "var(--c-surface-base)",
            }}
          >
            <CambiumWordmark size={28} />
          </div>
          <p className="text-xs mt-4 leading-relaxed" style={{ color: "var(--c-text-secondary)" }}>
            Maintain a minimum clear space equal to the height of the mark on all sides. Never crowd the logo.
          </p>
        </div>
        <div className="p-6 rounded-xl" style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--c-text-tertiary)" }}>
            Minimum Sizes
          </p>
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <CambiumWordmark size={20} />
              <span className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>120px min</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CambiumMark size={16} />
              <span className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>16px min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="p-6 rounded-xl" style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "var(--c-text-tertiary)" }}>
          Usage Guidelines
        </p>
        <div className="grid grid-cols-2 gap-3">
          <UsageExample correct label="Use on light surfaces: white, off-white, warm greys" />
          <UsageExample correct label="Use inverse version on dark surfaces only" />
          <UsageExample correct label="Scale proportionally, never distort" />
          <UsageExample correct label="Maintain minimum clear space at all times" />
          <UsageExample correct={false} label="Do not recolor the mark to non-brand colors" />
          <UsageExample correct={false} label="Do not add drop shadows or effects" />
          <UsageExample correct={false} label="Do not rotate or skew the logo" />
          <UsageExample correct={false} label="Do not place on busy photographic backgrounds" />
        </div>
      </div>
    </SectionWrapper>
  );
}
