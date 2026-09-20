import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function DocCard({ name, purpose, variants, states, usage, doThis, dontDo }: {
  name: string;
  purpose: string;
  variants: string[];
  states: string[];
  usage: string;
  doThis: string;
  dontDo: string;
}) {
  return (
    <div className="bg-surface border border-line rounded-xl overflow-hidden max-w-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-line bg-surface-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-ink-3 uppercase tracking-widest mb-1">Component</p>
            <h3 className="font-serif text-ink font-medium text-base">{name}</h3>
          </div>
          <span className="text-[10px] text-ink-3 bg-surface border border-line px-2 py-0.5 rounded font-mono">
            {name.toLowerCase().replace(/\s+/g, "-")}
          </span>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Purpose */}
        <div>
          <p className="text-[10px] text-ink-3 uppercase tracking-widest mb-1.5">Purpose</p>
          <p className="text-sm text-ink-2 leading-relaxed">{purpose}</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Variants */}
          <div>
            <p className="text-[10px] text-ink-3 uppercase tracking-widest mb-1.5">Variants</p>
            <div className="space-y-1">
              {variants.map(v => (
                <div key={v} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-navy" />
                  <span className="text-xs text-ink-2">{v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* States */}
          <div>
            <p className="text-[10px] text-ink-3 uppercase tracking-widest mb-1.5">States</p>
            <div className="flex flex-wrap gap-1">
              {states.map(s => (
                <span key={s} className="text-[10px] text-ink-3 bg-surface-2 px-1.5 py-0.5 rounded border border-line font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Usage */}
        <div>
          <p className="text-[10px] text-ink-3 uppercase tracking-widest mb-1.5">Usage</p>
          <p className="text-xs text-ink-3 leading-relaxed font-mono bg-surface-2 border border-line rounded-lg px-3 py-2">{usage}</p>
        </div>

        {/* Do / Don't */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-sage-light border border-sage/20 rounded-lg p-3">
            <p className="text-[10px] text-sage font-bold uppercase tracking-widest mb-1.5">✓ Do</p>
            <p className="text-xs text-ink-2 leading-relaxed">{doThis}</p>
          </div>
          <div className="bg-crimson-light border border-crimson/20 rounded-lg p-3">
            <p className="text-[10px] text-crimson font-bold uppercase tracking-widest mb-1.5">✗ Don't</p>
            <p className="text-xs text-ink-2 leading-relaxed">{dontDo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignTokensRef() {
  const tokens = [
    { name: "ink", val: "#17201D", role: "Primary text" },
    { name: "ink-2", val: "#667168", role: "Secondary text" },
    { name: "ink-3", val: "#8FA298", role: "Tertiary / placeholder" },
    { name: "navy", val: "#173F35", role: "Brand primary / interactive — deep forest" },
    { name: "navy-mid", val: "#285C4D", role: "Hover / active accent — medium forest" },
    { name: "navy-light", val: "#DCEBE4", role: "Selected / highlighted bg — mint" },
    { name: "sage", val: "#1D5C3E", role: "Success / active states" },
    { name: "amber", val: "#7A5210", role: "Warning / deadline" },
    { name: "crimson", val: "#8B1D1D", role: "Error / danger" },
    { name: "iris", val: "#2E4A6B", role: "AI components — restrained slate" },
  ];
  return (
    <div className="max-w-2xl">
      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-line bg-surface-2">
          <p className="text-xs font-medium text-ink">Color tokens</p>
        </div>
        <div className="divide-y divide-line">
          {tokens.map(({ name, val, role }) => (
            <div key={name} className="flex items-center gap-4 px-4 py-2.5 hover:bg-surface-2 transition-colors">
              <div className="w-6 h-6 rounded flex-shrink-0 border border-line" style={{ backgroundColor: val }} />
              <code className="text-[11px] font-mono text-ink-2 w-32 flex-shrink-0">--color-{name}</code>
              <code className="text-[11px] font-mono text-ink-3 w-24 flex-shrink-0">{val}</code>
              <span className="text-xs text-ink-3">{role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TypographyScale() {
  const scale = [
    { name: "Display", cls: "font-serif text-2xl font-medium", sample: "Research Workspace" },
    { name: "Heading", cls: "font-serif text-xl font-medium", sample: "Federated Learning Study" },
    { name: "Subheading", cls: "font-serif text-base font-medium", sample: "Privacy-Preserving AI" },
    { name: "Body", cls: "text-sm text-ink-2 leading-relaxed", sample: "Cambium connects academic identity, research, and opportunity in a unified operating system for researchers." },
    { name: "Small", cls: "text-xs text-ink-3", sample: "Smith, Johnson, et al. · Nature Machine Intelligence · 2024" },
    { name: "Label", cls: "text-[10px] text-ink-3 uppercase tracking-widest font-medium", sample: "Research area" },
  ];
  return (
    <div className="space-y-5 max-w-xl">
      {scale.map(({ name, cls, sample }) => (
        <div key={name} className="flex items-baseline gap-6">
          <span className="text-[10px] text-ink-3 w-24 flex-shrink-0 uppercase tracking-widest">{name}</span>
          <p className={cls}>{sample}</p>
        </div>
      ))}
    </div>
  );
}

function SpacingScale() {
  const steps = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
  return (
    <div className="space-y-2">
      {steps.map(step => (
        <div key={step} className="flex items-center gap-3">
          <span className="text-[10px] text-ink-3 font-mono w-8">{step}</span>
          <div className="bg-navy h-3 rounded-sm" style={{ width: `${step * 4}px` }} />
          <span className="text-[10px] text-ink-3">{step * 4}px</span>
        </div>
      ))}
    </div>
  );
}

export default function DocumentationSection() {
  return (
    <SectionWrapper
      id="documentation"
      number="16"
      title="Component Documentation"
      description="Usage guidelines, design tokens, typography scale, and spacing reference for the Cambium component library."
    >
      <ComponentGroup label="Component Documentation Template" note="Standard documentation format for each component">
        <DocCard
          name="Paper Card"
          purpose="Displays a research paper with title, authors, venue, citation count, and topic tags. Used in search results, reading lists, and discovery feeds."
          variants={["Default", "Compact", "Featured", "Loading skeleton"]}
          states={["Default", "Hover", "Selected", "Loading", "Disabled"]}
          usage={`<Card.Paper\n  paper={paper}\n  onSave={handleSave}\n  onOpen={handleOpen}\n/>`}
          doThis="Show the most relevant metadata for the research context. Keep topic tags to 3 maximum."
          dontDo="Do not show all available metadata simultaneously. Do not use the card for non-paper content types."
        />
      </ComponentGroup>

      <ComponentGroup label="Color Tokens" note="The complete Cambium color palette">
        <DesignTokensRef />
      </ComponentGroup>

      <ComponentGroup label="Typography Scale" note="Source Serif 4 for editorial headlines, Manrope for all UI text">
        <TypographyScale />
      </ComponentGroup>

      <ComponentGroup label="Spacing Scale" note="4px base unit — all spacing is a multiple of 4">
        <SpacingScale />
      </ComponentGroup>

      <ComponentGroup label="Border Radius Reference" note="Consistent rounding across components" row>
        {[
          { label: "Chip / tag", radius: "rounded", px: "4px" },
          { label: "Button / input", radius: "rounded-md", px: "6px" },
          { label: "Card", radius: "rounded-lg", px: "8px" },
          { label: "Modal / panel", radius: "rounded-xl", px: "12px" },
          { label: "Badge", radius: "rounded-full", px: "9999px" },
        ].map(({ label, radius, px }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 bg-navy-light border border-navy/20 ${radius}`} />
            <span className="text-[10px] text-ink-3 text-center">{label}</span>
            <span className="text-[9px] text-ink-3 font-mono">{px}</span>
          </div>
        ))}
      </ComponentGroup>
    </SectionWrapper>
  );
}
