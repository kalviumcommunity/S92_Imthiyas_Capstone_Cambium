/**
 * Cambium logo mark — a mathematically correct Fibonacci / logarithmic spiral.
 * The growth rate b = ln(φ) / (π/2) where φ is the golden ratio, so each
 * quarter-turn the radius grows by exactly √φ, reproducing the Fibonacci spiral.
 */

const PHI = 1.618033988749895;
const B = Math.log(PHI) / (Math.PI / 2); // ≈ 0.3063

function buildSpiralPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  thetaOffset: number,
  steps: number
): string {
  const thetaSpan = Math.log(outerRadius / innerRadius) / B;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * thetaSpan + thetaOffset;
    const r = innerRadius * Math.exp(B * (theta - thetaOffset));
    // y = cy - r*sin gives a counter-clockwise visual spiral (screen space)
    pts.push(
      `${i === 0 ? "M" : "L"} ${(cx + r * Math.cos(theta)).toFixed(3)} ${(cy - r * Math.sin(theta)).toFixed(3)}`
    );
  }
  return pts.join(" ");
}

// Precomputed at module level — parameters are static
// thetaOffset = -π*0.2 → inner coil starts lower-right, unfurls CCW (matches brand mark)
// ~1.85 turns from innerRadius=0.35 to outerRadius=12.5, centered in 32×32
const SPIRAL_D = buildSpiralPath(16, 16, 0.35, 12.5, -Math.PI * 0.2, 240);

// ─── Mark ────────────────────────────────────────────────────────────────────

interface MarkProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function CambiumMark({ size = 32, color = "currentColor", strokeWidth }: MarkProps) {
  // Scale stroke weight with size so it looks right from 16 → 64px
  const sw = strokeWidth ?? Math.max(1.5, (size / 32) * 2);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d={SPIRAL_D}
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ─── Icon on dark brand background (matches screenshots) ─────────────────────

interface IconDarkProps {
  size?: number;
  radius?: number;
}

export function CambiumIconDark({ size = 36, radius = 8 }: IconDarkProps) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: "#173F35",
      }}
    >
      <CambiumMark
        size={Math.round(size * 0.62)}
        color="#DCEBE4"
        strokeWidth={Math.max(1.5, (size / 36) * 2)}
      />
    </div>
  );
}

// ─── Horizontal logo (mark + wordmark) ───────────────────────────────────────

type LogoSize = "xs" | "sm" | "md" | "lg";
type LogoTheme = "forest" | "reversed" | "white";

interface LogoProps {
  size?: LogoSize;
  theme?: LogoTheme;
}

const LOGO_CONFIGS: Record<LogoSize, { markSize: number; textSz: number; gap: number; tracking: number }> = {
  xs:  { markSize: 14, textSz: 10, gap: 6,  tracking: 0.20 },
  sm:  { markSize: 18, textSz: 11, gap: 7,  tracking: 0.20 },
  md:  { markSize: 22, textSz: 13, gap: 8,  tracking: 0.22 },
  lg:  { markSize: 30, textSz: 16, gap: 10, tracking: 0.24 },
};

export function CambiumLogo({ size = "md", theme = "forest" }: LogoProps) {
  const { markSize, textSz, gap, tracking } = LOGO_CONFIGS[size];
  const colors = {
    forest:   { mark: "#173F35", text: "#173F35" },
    reversed: { mark: "#DCEBE4", text: "#FFFFFF"  },
    white:    { mark: "#FFFFFF", text: "#FFFFFF"  },
  }[theme];

  return (
    <div className="flex items-center" style={{ gap }}>
      <CambiumMark size={markSize} color={colors.mark} />
      <span
        style={{
          fontSize: textSz,
          fontWeight: 600,
          letterSpacing: `${tracking}em`,
          color: colors.text,
          fontFamily: "'Manrope', system-ui, sans-serif",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        CAMBIUM
      </span>
    </div>
  );
}

// ─── Reversed button (dark background, for section demos) ────────────────────

export function CambiumLogoBadge() {
  return (
    <div
      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg"
      style={{ backgroundColor: "#173F35" }}
    >
      <CambiumMark size={18} color="#DCEBE4" strokeWidth={2} />
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.22em",
          color: "#FFFFFF",
          fontFamily: "'Manrope', system-ui, sans-serif",
          lineHeight: 1,
        }}
      >
        CAMBIUM
      </span>
    </div>
  );
}
