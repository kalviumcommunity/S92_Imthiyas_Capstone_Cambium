import SectionWrapper from "../components/SectionWrapper";

interface Token {
  token: string;
  hex: string;
  purpose: string;
}

function Swatch({ token, hex, purpose }: Token) {
  // Use white text on dark surfaces, dark text on light
  const lum = parseInt(hex.slice(1, 3), 16) * 0.299 + parseInt(hex.slice(3, 5), 16) * 0.587 + parseInt(hex.slice(5, 7), 16) * 0.114;
  const swatchText = lum < 140 ? "#F7F6F1" : "#17201D";
  return (
    <div className="rounded-xl overflow-hidden border border-edge-default bg-surface-raised">
      <div className="h-14 flex items-end p-2.5" style={{ backgroundColor: hex }}>
        <span className="text-[10px] font-mono opacity-70" style={{ color: swatchText }}>{hex}</span>
      </div>
      <div className="p-3.5">
        <div className="text-[11px] font-semibold text-ink-primary mb-1 font-mono">{token}</div>
        <div className="text-[11px] text-ink-secondary leading-relaxed">{purpose}</div>
      </div>
    </div>
  );
}

function Group({ label, tokens, cols = 4 }: { label: string; tokens: Token[]; cols?: number }) {
  return (
    <div className="mb-12">
      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">{label}</h3>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {tokens.map((t) => <Swatch key={t.token} {...t} />)}
      </div>
    </div>
  );
}

const BACKGROUNDS: Token[] = [
  { token: "surface/base", hex: "#F7F6F1", purpose: "Default page background" },
  { token: "surface/raised", hex: "#FFFFFF", purpose: "Cards, panels, inputs" },
  { token: "surface/sunken", hex: "#EEECE6", purpose: "Recessed containers, code blocks" },
  { token: "surface/inverse", hex: "#173F35", purpose: "Dark overlays, sidebar, hero tiles" },
];

const TEXT: Token[] = [
  { token: "text/primary", hex: "#17201D", purpose: "Headings, primary body copy" },
  { token: "text/secondary", hex: "#66716C", purpose: "Supporting text, descriptions" },
  { token: "text/tertiary", hex: "#9CAAA5", purpose: "Placeholder, metadata, captions" },
  { token: "text/inverse", hex: "#F7F6F1", purpose: "Text on forest green surfaces" },
];

const BORDERS: Token[] = [
  { token: "border/default", hex: "#DDE2DE", purpose: "Default dividers and outlines" },
  { token: "border/strong", hex: "#B8C4C0", purpose: "Emphasized borders, separators" },
  { token: "border/hover", hex: "#66716C", purpose: "Hovered interactive elements" },
  { token: "border/focus", hex: "#173F35", purpose: "Focused inputs and controls" },
];

const ACCENT: Token[] = [
  { token: "accent/moss-050", hex: "#EFF5F2", purpose: "Tinted backgrounds, hover fills" },
  { token: "accent/moss-100", hex: "#DCEBE4", purpose: "Accent fills — brand highlight" },
  { token: "accent/moss-300", hex: "#7EB5A0", purpose: "Decorative accents, icons" },
  { token: "accent/moss-500", hex: "#285C4D", purpose: "Secondary actions, mid-tone" },
  { token: "accent/moss-600", hex: "#173F35", purpose: "Primary brand — interactive focus" },
  { token: "accent/moss-700", hex: "#0D2B22", purpose: "Dark accent, pressed state" },
];

const SEMANTIC: Token[] = [
  { token: "semantic/success", hex: "#285C4D", purpose: "Confirmations, positive states" },
  { token: "semantic/warning", hex: "#856214", purpose: "Warnings, caution indicators" },
  { token: "semantic/error", hex: "#8C3225", purpose: "Errors, destructive actions" },
  { token: "semantic/info", hex: "#1E5A72", purpose: "Informational messages, links" },
];

export default function ColorSection() {
  return (
    <SectionWrapper
      id="color"
      num="03"
      title="Color"
      description="Deep forest green on warm cream. The palette is botanical, restrained, and scholarly — pulled directly from the Cambium brand identity. Accent (#DCEBE4) occupies less than 10% of any viewport."
    >
      {/* Brand anchor swatches */}
      <div className="mb-12 p-6 rounded-xl bg-surface-raised border border-edge-default">
        <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-5">
          Brand Identity Colors
        </h3>
        <div className="grid grid-cols-4 gap-3 mb-3">
          {[
            { name: "Primary", hex: "#173F35" },
            { name: "Secondary", hex: "#285C4D" },
            { name: "Accent", hex: "#DCEBE4" },
            { name: "Background", hex: "#F7F6F1" },
          ].map(({ name, hex }) => {
            const lum = parseInt(hex.slice(1, 3), 16) * 0.299 + parseInt(hex.slice(3, 5), 16) * 0.587 + parseInt(hex.slice(5, 7), 16) * 0.114;
            const tc = lum < 140 ? "#F7F6F1" : "#17201D";
            return (
              <div key={name} className="rounded-lg overflow-hidden border border-edge-default">
                <div className="h-16 flex items-end p-2.5" style={{ backgroundColor: hex }}>
                  <span className="text-[10px] font-mono" style={{ color: tc, opacity: 0.7 }}>{hex}</span>
                </div>
                <div className="px-3 py-2 bg-surface-raised">
                  <span className="text-[11px] font-semibold text-ink-primary">{name}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "Surface", hex: "#FFFFFF" },
            { name: "Text", hex: "#17201D" },
            { name: "Muted", hex: "#66716C" },
            { name: "Border", hex: "#DDE2DE" },
          ].map(({ name, hex }) => {
            const lum = parseInt(hex.slice(1, 3), 16) * 0.299 + parseInt(hex.slice(3, 5), 16) * 0.587 + parseInt(hex.slice(5, 7), 16) * 0.114;
            const tc = lum < 140 ? "#F7F6F1" : "#17201D";
            return (
              <div key={name} className="rounded-lg overflow-hidden border border-edge-default">
                <div className="h-16 flex items-end p-2.5" style={{ backgroundColor: hex }}>
                  <span className="text-[10px] font-mono" style={{ color: tc, opacity: 0.7 }}>{hex}</span>
                </div>
                <div className="px-3 py-2 bg-surface-raised">
                  <span className="text-[11px] font-semibold text-ink-primary">{name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Group label="Background — Surface Tokens" tokens={BACKGROUNDS} />
      <Group label="Text — Ink Tokens" tokens={TEXT} />
      <Group label="Border — Edge Tokens" tokens={BORDERS} />

      {/* Accent — 6 cols */}
      <div className="mb-12">
        <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">
          Accent — Moss / Forest Scale
        </h3>
        <div className="grid grid-cols-6 gap-3">
          {ACCENT.map((t) => <Swatch key={t.token} {...t} />)}
        </div>
      </div>

      <Group label="Semantic States" tokens={SEMANTIC} cols={4} />

      {/* Principle */}
      <div className="p-5 rounded-xl bg-moss-050 border border-moss-100">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-moss-600 mt-1.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-ink-primary mb-1">Forest green is the brand</p>
            <p className="text-sm text-ink-secondary">
              The primary (#173F35) and secondary (#285C4D) greens anchor the identity.
              The accent (#DCEBE4) is the light counterpart — used for fills, tags, and
              highlights. Never use large accent surfaces. This palette avoids generic AI blue gradients.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
