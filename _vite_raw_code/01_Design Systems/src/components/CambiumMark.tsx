interface Props {
  size?: number;
  color?: string;
  counterOpacity?: number;
}

function makePath(
  cx: number,
  cy: number,
  minR: number,
  maxR: number,
  turns: number,
  cw: boolean,
  steps: number
): string {
  const totalAngle = turns * 2 * Math.PI;
  const b = Math.log(maxR / minR) / totalAngle;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const theta = (i / steps) * totalAngle;
    const r = minR * Math.exp(b * theta);
    const x = cx + r * Math.cos(theta);
    const y = cw ? cy + r * Math.sin(theta) : cy - r * Math.sin(theta);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

// Pre-compute paths once per module load — these never change
const MAIN_PATH = makePath(15, 16, 1.5, 12.5, 2, false, 120);
const COUNTER_PATH = makePath(15, 16, 1.2, 7.5, 1.5, true, 80);

export default function CambiumMark({ size = 32, color = "currentColor", counterOpacity = 0.22 }: Props) {
  const sw = 32 / 18; // stroke width relative to 32px viewBox ≈ 1.78

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      {/* Counter-spiral — faint, suggests dialogue and connection */}
      <path
        d={COUNTER_PATH}
        stroke={color}
        strokeWidth={sw * 0.65}
        strokeLinecap="round"
        opacity={counterOpacity}
      />
      {/* Primary Fibonacci spiral — knowledge growth */}
      <path
        d={MAIN_PATH}
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}
