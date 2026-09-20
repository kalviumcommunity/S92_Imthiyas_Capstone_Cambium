import { SectionWrapper, SectionHeader, SubLabel, TokenCard } from "./shared";

const surfaceColors = [
  { token: "surface/base", hex: "#FAFAF8", purpose: "Primary page background", usage: "App background, page canvas" },
  { token: "surface/raised", hex: "#F5F4F0", purpose: "Elevated surfaces", usage: "Cards, sidebars, panels" },
  { token: "surface/sunken", hex: "#EFEDE8", purpose: "Recessed areas", usage: "Input backgrounds, code blocks" },
  { token: "surface/inverse", hex: "#1C1C1A", purpose: "Dark surface", usage: "Tooltips, inverse cards, nav" },
];

const textColors = [
  { token: "text/primary", hex: "#1C1C1A", purpose: "Main content text", usage: "Headings, body copy, labels" },
  { token: "text/secondary", hex: "#5C5C58", purpose: "Supporting text", usage: "Descriptions, metadata, captions" },
  { token: "text/tertiary", hex: "#9A9A96", purpose: "Subdued text", usage: "Placeholders, disabled, hints" },
  { token: "text/inverse", hex: "#F5F4F0", purpose: "Text on dark surfaces", usage: "Dark card text, tooltips" },
];

const borderColors = [
  { token: "border/default", hex: "#E4E2DC", purpose: "Default separator", usage: "Card borders, dividers, inputs" },
  { token: "border/strong", hex: "#C8C5BD", purpose: "Prominent border", usage: "Active inputs, emphasis" },
  { token: "border/hover", hex: "#A8A59C", purpose: "Hover state border", usage: "Interactive element hover" },
  { token: "border/focus", hex: "#4A7C59", purpose: "Focus ring accent", usage: "Keyboard focus indicator" },
];

const mossColors = [
  { token: "accent/moss-050", hex: "#F2F7F4", purpose: "Lightest tint", usage: "Subtle accent backgrounds" },
  { token: "accent/moss-100", hex: "#E4EEE9", purpose: "Light tint", usage: "Tag backgrounds, chips" },
  { token: "accent/moss-300", hex: "#96C0A6", purpose: "Medium", usage: "Charts, subtle accents" },
  { token: "accent/moss-500", hex: "#4A7C59", purpose: "Primary accent", usage: "CTAs, links, active states" },
  { token: "accent/moss-600", hex: "#3D6A4A", purpose: "Pressed / hover", usage: "Button hover, link hover" },
  { token: "accent/moss-700", hex: "#31573C", purpose: "Darkest", usage: "High-emphasis on light bg" },
];

const semanticColors = [
  { token: "semantic/success", hex: "#3A8C4F", purpose: "Positive outcomes", usage: "Completed, verified, published" },
  { token: "semantic/warning", hex: "#B8780A", purpose: "Caution states", usage: "Pending review, expiring soon" },
  { token: "semantic/error", hex: "#C43D3D", purpose: "Error and failure", usage: "Validation errors, failed actions" },
  { token: "semantic/info", hex: "#3A6FA8", purpose: "Informational", usage: "Tips, update notices, guides" },
];

export default function Color() {
  return (
    <SectionWrapper id="03-color">
      <SectionHeader
        number="03"
        title="Color"
        description="A restrained, warm-neutral palette anchored by deep charcoal and a botanical moss green accent."
      />

      {/* Accent usage note */}
      <div
        className="rounded-lg px-5 py-4 mb-12 flex items-start gap-3"
        style={{ background: "var(--c-moss-050)", border: "1px solid var(--c-moss-100)" }}
      >
        <div className="w-1 h-full rounded-full flex-shrink-0 mt-1" style={{ background: "var(--c-moss-500)", minHeight: 32 }} />
        <p className="text-sm leading-relaxed" style={{ color: "var(--c-moss-700)" }}>
          <strong>Accent restraint principle.</strong> The moss green accent should occupy less than 10% of any given viewport. It marks what matters — active states, key actions, primary links. It should not decorate.
        </p>
      </div>

      {/* Moss gradient strip */}
      <div className="mb-12">
        <SubLabel>Accent — Moss Scale</SubLabel>
        <div className="flex rounded-lg overflow-hidden h-12 mb-3" style={{ border: "1px solid var(--c-border-default)" }}>
          {mossColors.map(({ hex }) => (
            <div key={hex} className="flex-1" style={{ background: hex }} />
          ))}
        </div>
        <div className="flex">
          {mossColors.map(({ token, hex }) => (
            <div key={hex} className="flex-1 px-1">
              <p className="text-xs font-mono" style={{ color: "var(--c-text-secondary)" }}>{token.split("/")[1]}</p>
              <p className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)" }}>{hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Surface */}
      <div className="mb-10">
        <SubLabel>Surface</SubLabel>
        <div className="grid grid-cols-4 gap-4">
          {surfaceColors.map((c) => (
            <TokenCard key={c.token} {...c} swatch={c.hex} />
          ))}
        </div>
      </div>

      {/* Text */}
      <div className="mb-10">
        <SubLabel>Text</SubLabel>
        <div className="grid grid-cols-4 gap-4">
          {textColors.map((c) => (
            <TokenCard key={c.token} {...c} swatch={c.hex} />
          ))}
        </div>
      </div>

      {/* Border */}
      <div className="mb-10">
        <SubLabel>Border</SubLabel>
        <div className="grid grid-cols-4 gap-4">
          {borderColors.map((c) => (
            <TokenCard key={c.token} {...c} swatch={c.hex} />
          ))}
        </div>
      </div>

      {/* Accent */}
      <div className="mb-10">
        <SubLabel>Accent — Moss</SubLabel>
        <div className="grid grid-cols-3 gap-4">
          {mossColors.map((c) => (
            <TokenCard key={c.token} {...c} swatch={c.hex} />
          ))}
        </div>
      </div>

      {/* Semantic */}
      <div>
        <SubLabel>Semantic States</SubLabel>
        <div className="grid grid-cols-4 gap-4">
          {semanticColors.map((c) => (
            <TokenCard key={c.token} {...c} swatch={c.hex} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
