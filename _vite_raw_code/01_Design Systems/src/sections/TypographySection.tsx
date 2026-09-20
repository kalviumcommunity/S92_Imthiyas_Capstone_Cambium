import SectionWrapper from "../components/SectionWrapper";

const MANROPE = "Manrope, system-ui, sans-serif";
const SERIF = "'Source Serif 4', Georgia, serif";

interface SpecimenRow {
  name: string;
  size: string;
  weight: string;
  lineHeight: string;
  tracking: string;
  usage: string;
  font?: "sans" | "serif";
  sample?: string;
}

const DISPLAY: SpecimenRow[] = [
  { name: "Display XL", size: "64px", weight: "700", lineHeight: "1.05", tracking: "-0.03em", usage: "Hero headlines", font: "serif", sample: "Research, connected." },
  { name: "Display Large", size: "48px", weight: "700", lineHeight: "1.08", tracking: "-0.025em", usage: "Section heroes", sample: "Knowledge in motion." },
  { name: "Display Medium", size: "40px", weight: "700", lineHeight: "1.1", tracking: "-0.02em", usage: "Feature headers", sample: "Your research, organized." },
];

const HEADINGS: SpecimenRow[] = [
  { name: "Heading 1", size: "32px", weight: "700", lineHeight: "1.2", tracking: "-0.02em", usage: "Page titles", sample: "My Research Projects" },
  { name: "Heading 2", size: "24px", weight: "700", lineHeight: "1.25", tracking: "-0.015em", usage: "Section titles", sample: "Recent Publications" },
  { name: "Heading 3", size: "20px", weight: "600", lineHeight: "1.3", tracking: "-0.01em", usage: "Card headers", sample: "Experimental Results" },
  { name: "Heading 4", size: "18px", weight: "600", lineHeight: "1.35", tracking: "-0.005em", usage: "Sub-sections", sample: "Methodology Overview" },
];

const BODY: SpecimenRow[] = [
  { name: "Body Large", size: "18px", weight: "400", lineHeight: "1.65", tracking: "0", usage: "Lead paragraphs", sample: "Cambium connects your academic identity with your research output, making the work of science more discoverable and collaborative." },
  { name: "Body", size: "16px", weight: "400", lineHeight: "1.6", tracking: "0", usage: "Default body text", sample: "Research projects, papers, datasets, and collaborators are linked together in a unified knowledge graph that evolves with your work." },
  { name: "Body Small", size: "14px", weight: "400", lineHeight: "1.55", tracking: "0", usage: "Secondary copy, tooltips", sample: "Use this scale for supplementary information, descriptions in compact components, and supporting metadata." },
];

const LABELS: SpecimenRow[] = [
  { name: "Label", size: "13px", weight: "500", lineHeight: "1.4", tracking: "0.02em", usage: "Form labels, UI text", sample: "Published Date" },
  { name: "Caption", size: "12px", weight: "400", lineHeight: "1.4", tracking: "0.01em", usage: "Captions, helper text", sample: "Last updated 2 hours ago" },
  { name: "Metadata", size: "11px", weight: "600", lineHeight: "1.4", tracking: "0.1em", usage: "Tags, categories, codes", sample: "PEER REVIEWED" },
];

function SpecimenBlock({ row }: { row: SpecimenRow }) {
  const fontFamily = row.font === "serif" ? SERIF : MANROPE;
  return (
    <div className="py-6 border-b border-edge-default last:border-0 grid grid-cols-[1fr_auto] gap-6 items-end">
      <div>
        <p
          className="text-ink-primary mb-1"
          style={{
            fontFamily,
            fontSize: row.size,
            fontWeight: row.weight,
            lineHeight: row.lineHeight,
            letterSpacing: row.tracking,
          }}
        >
          {row.sample || row.name}
        </p>
      </div>
      <div className="text-right flex-shrink-0 min-w-[200px]">
        <div className="text-[11px] font-semibold text-ink-primary mb-1">{row.name}</div>
        <div className="text-[11px] font-mono text-ink-tertiary space-y-0.5">
          <div>{row.size} / {row.weight} / lh {row.lineHeight}</div>
          <div>tracking {row.tracking || "0"}</div>
          <div className="text-moss-600">{row.usage}</div>
          {row.font === "serif" && <div className="italic text-ink-tertiary">Source Serif 4</div>}
        </div>
      </div>
    </div>
  );
}

export default function TypographySection() {
  return (
    <SectionWrapper
      id="typography"
      num="04"
      title="Typography"
      description="Manrope for all UI text — geometric, clean, optimized for screens. Source Serif 4 reserved for editorial display moments only. Type serves reading clarity above all."
    >
      {/* Font pairing */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="p-6 rounded-xl bg-surface-raised border border-edge-default">
          <div className="text-[10px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-3">
            Primary UI Font
          </div>
          <p className="text-[28px] font-bold tracking-[-0.02em] text-ink-primary mb-2" style={{ fontFamily: MANROPE }}>
            Manrope
          </p>
          <p className="text-sm text-ink-secondary mb-2" style={{ fontFamily: MANROPE }}>
            Aa Bb Cc Dd Ee Ff Gg 0123456789
          </p>
          <p className="text-sm text-ink-secondary" style={{ fontFamily: MANROPE, fontWeight: 700 }}>
            Regular · Medium · SemiBold · Bold
          </p>
          <p className="text-xs text-ink-tertiary mt-2">All UI, labels, body, headings</p>
        </div>
        <div className="p-6 rounded-xl bg-surface-raised border border-edge-default">
          <div className="text-[10px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-3">
            Editorial Typeface
          </div>
          <p className="text-[28px] font-medium text-ink-primary mb-2" style={{ fontFamily: SERIF }}>
            Source Serif 4
          </p>
          <p className="text-sm text-ink-secondary mb-2" style={{ fontFamily: SERIF }}>
            Aa Bb Cc Dd Ee Ff Gg 0123456789
          </p>
          <p className="text-sm text-ink-secondary italic" style={{ fontFamily: SERIF }}>
            Editorial headlines only
          </p>
          <p className="text-xs text-ink-tertiary mt-2">Hero statements, research quotes only</p>
        </div>
      </div>

      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-2">Display</h3>
      <div className="mb-8">
        {DISPLAY.map((r) => <SpecimenBlock key={r.name} row={r} />)}
      </div>

      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-2">Headings</h3>
      <div className="mb-8">
        {HEADINGS.map((r) => <SpecimenBlock key={r.name} row={r} />)}
      </div>

      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-2">Body</h3>
      <div className="mb-8">
        {BODY.map((r) => <SpecimenBlock key={r.name} row={r} />)}
      </div>

      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-2">Label & Caption</h3>
      <div>
        {LABELS.map((r) => <SpecimenBlock key={r.name} row={r} />)}
      </div>
    </SectionWrapper>
  );
}
