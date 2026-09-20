import { SectionWrapper, SectionHeader, SubLabel } from "./shared";

interface TypeSpec {
  label: string;
  size: number;
  weight: number;
  lineHeight: number;
  letterSpacing: string;
  usage: string;
  serif?: boolean;
  specimen: string;
}

const typeSpecs: TypeSpec[] = [
  { label: "Display XL", size: 64, weight: 300, lineHeight: 1.1, letterSpacing: "-0.03em", usage: "Hero statements, marketing pages only", serif: true, specimen: "Research, connected." },
  { label: "Display Large", size: 48, weight: 300, lineHeight: 1.15, letterSpacing: "-0.025em", usage: "Section heroes, landing emphasis", serif: true, specimen: "Complex ideas, made clear." },
  { label: "Display Medium", size: 40, weight: 400, lineHeight: 1.2, letterSpacing: "-0.02em", usage: "Feature titles, editorial headers", specimen: "Knowledge at every level" },
  { label: "Heading 1", size: 32, weight: 600, lineHeight: 1.25, letterSpacing: "-0.015em", usage: "Page titles, major sections", specimen: "Your research workspace" },
  { label: "Heading 2", size: 24, weight: 600, lineHeight: 1.3, letterSpacing: "-0.01em", usage: "Section headings, card titles", specimen: "Recent Publications" },
  { label: "Heading 3", size: 20, weight: 600, lineHeight: 1.35, letterSpacing: "-0.008em", usage: "Subsection headings, panel titles", specimen: "Collaboration Networks" },
  { label: "Heading 4", size: 18, weight: 600, lineHeight: 1.4, letterSpacing: "-0.005em", usage: "Component headings, sidebar titles", specimen: "Connected Researchers" },
  { label: "Body Large", size: 18, weight: 400, lineHeight: 1.65, letterSpacing: "0em", usage: "Lead paragraphs, introductions", specimen: "Cambium connects your academic identity with your research work, making it easy to build, share, and discover." },
  { label: "Body", size: 16, weight: 400, lineHeight: 1.65, letterSpacing: "0em", usage: "Default body text, descriptions", specimen: "Organize papers, projects, and collaborations in one place. Track citations, manage grants, and surface opportunities." },
  { label: "Body Small", size: 14, weight: 400, lineHeight: 1.6, letterSpacing: "0.005em", usage: "Secondary content, helper text", specimen: "This paper has 12 citations and was published in Nature Computational Science, March 2024." },
  { label: "Label", size: 13, weight: 500, lineHeight: 1.4, letterSpacing: "0.02em", usage: "Form labels, UI labels, nav items", specimen: "Field Label" },
  { label: "Caption", size: 12, weight: 400, lineHeight: 1.5, letterSpacing: "0.01em", usage: "Timestamps, attribution, figure captions", specimen: "Last updated 2 hours ago · 3 collaborators" },
  { label: "Metadata", size: 11, weight: 500, lineHeight: 1.4, letterSpacing: "0.06em", usage: "Tags, status indicators, overline", specimen: "OPEN ACCESS · PEER REVIEWED" },
];

function TypeRow({ spec }: { spec: TypeSpec }) {
  return (
    <div
      className="grid gap-6 py-6"
      style={{
        gridTemplateColumns: "160px 1fr 280px",
        borderBottom: "1px solid var(--c-border-default)",
      }}
    >
      {/* Specimen */}
      <div className="flex flex-col justify-center">
        <p className="text-xs font-semibold mb-1" style={{ color: "var(--c-moss-500)" }}>{spec.label}</p>
        <p className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)" }}>
          {spec.size}px / {spec.weight} / {spec.lineHeight}
        </p>
      </div>
      <div className="flex items-center overflow-hidden">
        <p
          style={{
            fontFamily: spec.serif ? "'Source Serif 4', Georgia, serif" : "'Inter', sans-serif",
            fontSize: Math.min(spec.size, 48),
            fontWeight: spec.weight,
            lineHeight: spec.lineHeight,
            letterSpacing: spec.letterSpacing,
            color: "var(--c-text-primary)",
            whiteSpace: spec.size >= 32 ? "nowrap" : "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {spec.specimen}
        </p>
      </div>
      <div className="flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
          <span style={{ color: "var(--c-text-tertiary)" }}>Size</span>
          <span className="font-mono" style={{ color: "var(--c-text-secondary)" }}>{spec.size}px</span>
          <span style={{ color: "var(--c-text-tertiary)" }}>Weight</span>
          <span className="font-mono" style={{ color: "var(--c-text-secondary)" }}>{spec.weight}</span>
          <span style={{ color: "var(--c-text-tertiary)" }}>Line height</span>
          <span className="font-mono" style={{ color: "var(--c-text-secondary)" }}>{spec.lineHeight}</span>
          <span style={{ color: "var(--c-text-tertiary)" }}>Tracking</span>
          <span className="font-mono" style={{ color: "var(--c-text-secondary)" }}>{spec.letterSpacing}</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--c-text-tertiary)" }}>{spec.usage}</p>
      </div>
    </div>
  );
}

export default function Typography() {
  return (
    <SectionWrapper id="04-typography">
      <SectionHeader
        number="04"
        title="Typography"
        description="Inter for interface clarity. Source Serif 4 for editorial moments. Readability above all."
      />

      {/* Font pairs */}
      <div className="grid grid-cols-2 gap-5 mb-16">
        <div
          className="p-8 rounded-xl"
          style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--c-text-tertiary)" }}>
            Primary — Inter
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, fontWeight: 300, color: "var(--c-text-primary)", letterSpacing: "-0.02em" }}>
            Aa
          </p>
          <p className="mt-2 text-sm font-mono" style={{ color: "var(--c-text-secondary)" }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
            abcdefghijklmnopqrstuvwxyz<br />
            0123456789
          </p>
          <p className="text-xs mt-3" style={{ color: "var(--c-text-tertiary)" }}>Weights: 300, 400, 500, 600, 700</p>
        </div>
        <div
          className="p-8 rounded-xl"
          style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--c-text-tertiary)" }}>
            Editorial — Source Serif 4
          </p>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 36, fontWeight: 300, color: "var(--c-text-primary)", letterSpacing: "-0.02em" }}>
            Aa
          </p>
          <p className="mt-2 text-sm" style={{ fontFamily: "'Source Serif 4', serif", color: "var(--c-text-secondary)" }}>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
            abcdefghijklmnopqrstuvwxyz<br />
            0123456789
          </p>
          <p className="text-xs mt-3" style={{ color: "var(--c-text-tertiary)" }}>Display headers only · Weights: 300, 400, 600</p>
        </div>
      </div>

      {/* Type scale */}
      <SubLabel>Type Scale</SubLabel>
      <div>
        {typeSpecs.map((spec) => (
          <TypeRow key={spec.label} spec={spec} />
        ))}
      </div>

      {/* Pairing note */}
      <div
        className="mt-10 p-6 rounded-lg"
        style={{ background: "var(--c-surface-sunken)", border: "1px solid var(--c-border-default)" }}
      >
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--c-text-tertiary)" }}>
          Pairing Principle
        </p>
        <p
          className="font-serif text-2xl font-light mb-3"
          style={{ color: "var(--c-text-primary)", letterSpacing: "-0.01em" }}
        >
          "Every researcher has a story worth reading."
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--c-text-secondary)" }}>
          Source Serif 4 should appear at most once per view — as a hero statement or editorial pull quote. The moment it becomes the default reading font, the distinction is lost.
        </p>
      </div>
    </SectionWrapper>
  );
}
