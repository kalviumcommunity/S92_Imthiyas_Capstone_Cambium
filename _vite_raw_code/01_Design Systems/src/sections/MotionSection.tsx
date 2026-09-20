import SectionWrapper from "../components/SectionWrapper";
import { useState } from "react";

const PRIMARY = "#173F35";
const ACCENT = "#DCEBE4";
const EDGE = "#DDE2DE";
const SURFACE = "#FFFFFF";
const SURFACE_BASE = "#F7F6F1";
const INK = "#17201D";
const INK_MID = "#66716C";

const durations = [
  { name: "Micro", range: "150–200ms", ms: 175, easing: "ease-out", usage: "Button hover, focus ring, icon swap" },
  { name: "Standard", range: "200–300ms", ms: 250, easing: "ease-in-out", usage: "Card hover, panel open, menu reveal" },
  { name: "Major", range: "400–700ms", ms: 550, easing: "ease-in-out", usage: "Page transition, modal, graph reveal" },
];

const principles = [
  { label: "Quiet", desc: "Motion does not compete with content. It exists to serve clarity." },
  { label: "Purposeful", desc: "Every animation communicates a state change or spatial relationship." },
  { label: "Fast", desc: "Transitions are snappy. Cambium never makes users wait for animation." },
  { label: "Natural", desc: "ease-out and ease-in-out only. Never linear or spring/bouncy functions." },
  { label: "Non-distracting", desc: "Users should barely notice the animation — only the resulting state." },
];

const avoidances = [
  "Bouncy, spring, or elastic animations",
  "Excessive scale transforms (>5%)",
  "Confetti, particle effects, celebrations",
  "3D perspective transforms",
  "Infinite loops without user intent",
  "Animations that block interaction",
];

function ButtonHoverDemo() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl p-5">
      <p className="text-[11px] text-ink-tertiary mb-4">Hover the element below</p>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer select-none"
        style={{
          background: hovered ? ACCENT : SURFACE,
          borderColor: hovered ? PRIMARY : EDGE,
          color: hovered ? PRIMARY : INK,
          border: `1px solid ${hovered ? PRIMARY : EDGE}`,
          transform: `translateY(${hovered ? -1 : 0}px)`,
          boxShadow: hovered ? `0 4px 12px rgba(23,63,53,0.12)` : `0 1px 3px rgba(23,32,29,0.04)`,
          transition: "all 200ms ease-out",
        }}
      >
        Button hover — 200ms ease-out
      </button>
    </div>
  );
}

function CardHoverDemo() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl p-5">
      <p className="text-[11px] text-ink-tertiary mb-4">Hover the card below</p>
      <div
        className="p-4 rounded-xl cursor-pointer select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? SURFACE : SURFACE_BASE,
          border: `1px solid ${hovered ? "#B8C4C0" : EDGE}`,
          transform: `translateY(${hovered ? -2 : 0}px)`,
          boxShadow: hovered ? "0 4px 16px rgba(23,32,29,0.1)" : "0 1px 3px rgba(23,32,29,0.04)",
          transition: "all 250ms ease-in-out",
        }}
      >
        <div className="text-xs font-semibold text-ink-primary mb-1">Publication title</div>
        <div className="text-[11px] text-ink-tertiary">Card hover — 250ms ease-in-out</div>
      </div>
    </div>
  );
}

export default function MotionSection() {
  return (
    <SectionWrapper
      id="motion"
      num="12"
      title="Motion"
      description="Motion is quiet and purposeful. Cambium animates to communicate spatial relationships and state changes — never for decoration or delight."
    >
      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">Duration Scale</h3>
      <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden mb-10">
        {durations.map((d, i) => {
          const pct = (d.ms / 700) * 100;
          return (
            <div key={d.name} className={`px-6 py-4 grid grid-cols-[80px_1fr_100px_140px_200px] items-center gap-4 ${i < durations.length - 1 ? "border-b border-edge-default" : ""}`}>
              <span className="text-xs font-semibold text-ink-primary">{d.name}</span>
              <div className="h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: PRIMARY }} />
              </div>
              <span className="text-[11px] font-mono text-ink-secondary">{d.range}</span>
              <span className="text-[11px] font-mono text-ink-tertiary">{d.easing}</span>
              <span className="text-[11px] text-ink-tertiary">{d.usage}</span>
            </div>
          );
        })}
      </div>

      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">Interactive Examples</h3>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <ButtonHoverDemo />
        <CardHoverDemo />
      </div>

      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">Principles</h3>
      <div className="grid grid-cols-1 gap-3 mb-8">
        {principles.map(({ label, desc }) => (
          <div key={label} className="flex items-start gap-4 p-4 bg-surface-raised border border-edge-default rounded-xl">
            <span className="text-xs font-semibold text-moss-600 w-28 flex-shrink-0 pt-0.5">{label}</span>
            <span className="text-sm text-ink-secondary">{desc}</span>
          </div>
        ))}
      </div>

      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">Never Use</h3>
      <div className="grid grid-cols-2 gap-2 mb-8">
        {avoidances.map((a) => (
          <div key={a} className="flex items-start gap-2 text-sm text-ink-secondary p-3 rounded-lg" style={{ background: "#FDF1EF", border: "1px solid rgba(140,50,37,0.15)" }}>
            <span className="text-semantic-error flex-shrink-0">×</span>
            <span>{a}</span>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-xl bg-surface-sunken border border-edge-default">
        <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-3">Reduced Motion</h3>
        <div className="space-y-2 mb-4">
          {[
            "All transitions check prefers-reduced-motion: reduce media query",
            "When active: remove transforms, retain opacity fades ≤ 100ms",
            "Never use motion to convey meaning — always pair with text and icons",
          ].map((p) => (
            <div key={p} className="flex items-start gap-2 text-sm text-ink-secondary">
              <span className="text-moss-500 mt-0.5 flex-shrink-0">→</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
        <div className="p-3 bg-surface-raised border border-edge-default rounded-lg">
          <code className="text-[11px] font-mono text-ink-secondary">
            {'@media (prefers-reduced-motion: reduce) {'}<br/>
            {'  * { transition-duration: 0.01ms !important; }'}<br/>
            {'}'}
          </code>
        </div>
      </div>
    </SectionWrapper>
  );
}
