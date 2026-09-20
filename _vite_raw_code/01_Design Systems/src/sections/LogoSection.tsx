import CambiumMark from "../components/CambiumMark";
import SectionWrapper from "../components/SectionWrapper";

const PRIMARY = "#173F35";
const PRIMARY_LIGHT = "#DCEBE4";
const INK = "#17201D";
const INK_INVERSE = "#F7F6F1";
const SURFACE = "#FFFFFF";
const SURFACE_BASE = "#F7F6F1";
const EDGE = "#DDE2DE";

function Wordmark({
  dark = false,
  size = "md",
}: {
  dark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const markSizes = { sm: 20, md: 28, lg: 40 };
  const fontSizes = { sm: 13, md: 17, lg: 24 };
  const bg = dark ? PRIMARY : SURFACE;
  const border = dark ? "none" : `1px solid ${EDGE}`;
  const textColor = dark ? INK_INVERSE : INK;
  const markColor = dark ? PRIMARY_LIGHT : PRIMARY;

  return (
    <div
      className="inline-flex items-center gap-3 px-6 py-5 rounded-xl"
      style={{ background: bg, border }}
    >
      <CambiumMark size={markSizes[size]} color={markColor} counterOpacity={0.28} />
      <span
        style={{
          fontFamily: "Manrope, system-ui, sans-serif",
          fontWeight: 700,
          fontSize: fontSizes[size],
          letterSpacing: "0.12em",
          color: textColor,
        }}
      >
        CAMBIUM
      </span>
    </div>
  );
}

function MarkTile({
  label,
  bg,
  color,
  size = 40,
  border,
}: {
  label: string;
  bg: string;
  color: string;
  size?: number;
  border?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className="rounded-xl flex items-center justify-center"
        style={{ background: bg, border: border || "none", width: 72, height: 72 }}
      >
        <CambiumMark size={size} color={color} counterOpacity={0.3} />
      </div>
      <span className="text-[11px] text-ink-tertiary">{label}</span>
    </div>
  );
}

export default function LogoSection() {
  return (
    <SectionWrapper
      id="logo"
      num="02"
      title="Logo"
      description="The Fibonacci spiral — nature's compounding growth law. Each revolution builds on the last, expanding outward. A faint counter-spiral suggests dialogue and connection."
    >
      {/* Primary lockups */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="flex flex-col gap-3">
          <Wordmark dark={false} size="md" />
          <span className="text-[11px] text-ink-tertiary">Horizontal — Light surface</span>
        </div>
        <div className="flex flex-col gap-3">
          <Wordmark dark={true} size="md" />
          <span className="text-[11px] text-ink-tertiary">Horizontal — Forest green (primary)</span>
        </div>
      </div>

      {/* Stacked */}
      <div className="flex items-end gap-6 mb-12">
        <div className="flex flex-col items-start gap-3">
          <div
            className="flex flex-col items-center gap-3 px-8 py-6 rounded-xl"
            style={{ background: SURFACE, border: `1px solid ${EDGE}` }}
          >
            <CambiumMark size={36} color={PRIMARY} counterOpacity={0.28} />
            <span
              style={{
                fontFamily: "Manrope, system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.14em",
                color: INK,
              }}
            >
              CAMBIUM
            </span>
          </div>
          <span className="text-[11px] text-ink-tertiary">Stacked</span>
        </div>

        {/* Scale test */}
        <div className="flex flex-col gap-3 ml-6">
          <span className="text-[10px] font-semibold tracking-[0.12em] text-ink-tertiary uppercase">Scale test</span>
          <div className="flex items-end gap-4">
            {[16, 24, 32, 48, 64].map((sz) => (
              <div key={sz} className="flex flex-col items-center gap-1.5">
                <CambiumMark size={sz} color={PRIMARY} counterOpacity={0.3} />
                <span className="text-[10px] font-mono text-ink-tertiary">{sz}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mark variations */}
      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-5">
        Mark Variants
      </h3>
      <div className="flex items-start gap-5 mb-12">
        <MarkTile label="Primary" bg={SURFACE} color={PRIMARY} border={`1px solid ${EDGE}`} />
        <MarkTile label="Forest" bg={PRIMARY} color={PRIMARY_LIGHT} />
        <MarkTile label="Accent fill" bg={PRIMARY_LIGHT} color={PRIMARY} />
        <MarkTile label="Monochrome" bg={SURFACE} color={INK} border={`1px solid ${EDGE}`} />
        <MarkTile label="Inverse" bg={INK} color={INK_INVERSE} />
        <MarkTile label="Compact 24px" bg={SURFACE} color={PRIMARY} size={24} border={`1px solid ${EDGE}`} />
      </div>

      {/* Color variants — matching the brand image */}
      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-5">
        Color Variants
      </h3>
      <div className="flex flex-col gap-2 mb-12">
        {[
          { bg: SURFACE_BASE, color: PRIMARY, border: `1px solid ${EDGE}`, label: "On surface/base" },
          { bg: SURFACE, color: PRIMARY, border: `1px solid ${EDGE}`, label: "On surface/raised" },
          { bg: "#DCEBE4", color: PRIMARY, border: "none", label: "On accent/moss-100" },
          { bg: PRIMARY, color: PRIMARY_LIGHT, border: "none", label: "On primary (reversed)" },
          { bg: INK, color: INK_INVERSE, border: "none", label: "On text/primary (inverse)" },
        ].map(({ bg, color, border, label }) => (
          <div
            key={label}
            className="flex items-center gap-4 px-5 py-3 rounded-xl"
            style={{ background: bg, border: border || "none" }}
          >
            <CambiumMark size={20} color={color} counterOpacity={0.3} />
            <span
              style={{
                fontFamily: "Manrope, system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.12em",
                color,
              }}
            >
              CAMBIUM
            </span>
            <span
              className="ml-auto text-[11px]"
              style={{ color: color === INK_INVERSE ? "rgba(247,246,241,0.5)" : "#9CAAA5" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Wordmark weights */}
      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-5">
        Wordmark Weights
      </h3>
      <div
        className="flex items-start gap-10 p-8 rounded-xl"
        style={{ background: SURFACE, border: `1px solid ${EDGE}` }}
      >
        {[
          { weight: 600, label: "A — SemiBold" },
          { weight: 700, label: "B — Bold" },
          { weight: 700, label: "C — Wide Optical", tracking: "0.2em" },
        ].map(({ weight, label, tracking }) => (
          <div key={label} className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.1em] text-ink-tertiary uppercase">
              {label}
            </span>
            <span
              style={{
                fontFamily: "Manrope, system-ui, sans-serif",
                fontWeight: weight,
                fontSize: 22,
                letterSpacing: tracking || "0.08em",
                color: INK,
              }}
            >
              CAMBIUM
            </span>
          </div>
        ))}
      </div>

      {/* Clear space & do/don't */}
      <div className="grid grid-cols-2 gap-4 mt-10">
        <div className="p-6 rounded-xl border-2 border-semantic-success/20 bg-moss-050">
          <div className="flex items-center gap-2.5 mb-4">
            <CambiumMark size={24} color={PRIMARY} counterOpacity={0.28} />
            <span
              style={{
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.12em",
                color: INK,
              }}
            >
              CAMBIUM
            </span>
          </div>
          <span className="text-[11px] text-semantic-success font-semibold">✓ Correct</span>
          <p className="text-xs text-ink-secondary mt-1">
            Original proportions, approved colors, correct spacing.
          </p>
        </div>
        <div
          className="p-6 rounded-xl border-2"
          style={{ borderColor: "rgba(140,50,37,0.2)", background: "#FDF1EF" }}
        >
          <div
            className="flex items-center gap-2.5 mb-4"
            style={{ opacity: 0.5, transform: "scaleX(1.5) scaleY(0.7)", transformOrigin: "left" }}
          >
            <CambiumMark size={24} color="#8C3225" counterOpacity={0.3} />
            <span
              style={{
                fontFamily: "Manrope",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.12em",
                color: "#8C3225",
              }}
            >
              CAMBIUM
            </span>
          </div>
          <span className="text-[11px] text-semantic-error font-semibold">× Incorrect</span>
          <p className="text-xs text-ink-secondary mt-1">
            Do not stretch, recolor outside the palette, or alter spacing.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
