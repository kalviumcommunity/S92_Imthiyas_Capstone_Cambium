import { SectionWrapper, SectionHeader, SubLabel } from "./shared";
import { useState } from "react";

const timings = [
  { token: "motion/micro", range: "150–200ms", easing: "ease-out", usage: "Button hover, icon swap, checkbox toggle, badge update" },
  { token: "motion/standard", range: "200–300ms", easing: "ease-in-out", usage: "Card hover, panel reveal, dropdown open, tab switch" },
  { token: "motion/major", range: "400–700ms", easing: "ease-in-out", usage: "Page transition, modal enter, graph reveal, sidebar slide" },
];

const principles = [
  { label: "Quiet", desc: "Motion should not call attention to itself. It should help — not perform." },
  { label: "Purposeful", desc: "Every transition communicates something: hierarchy, state, direction, or causality." },
  { label: "Fast", desc: "Micro and standard interactions must feel instant. Researchers have no time for sluggish UI." },
  { label: "Natural", desc: "Use ease-out and ease-in-out. Avoid linear timing. Nothing should feel mechanical." },
  { label: "Non-distracting", desc: "The interface serves the research. When in doubt, reduce or remove the animation." },
];

const avoidList = [
  "Bouncy spring animations (overdamped)",
  "Excessive scale transforms (>1.05)",
  "Confetti or celebratory particle effects",
  "Dramatic 3D perspective transforms",
  "Infinite looping animations in content areas",
  "Simultaneous competing transitions",
];

function MotionDemo({ label, duration, easing }: { label: string; duration: number; easing: string }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className="p-4 rounded-lg"
      style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: "var(--c-text-primary)" }}>{label}</p>
      <p className="text-xs font-mono mb-3" style={{ color: "var(--c-text-tertiary)" }}>{duration}ms · {easing}</p>
      <div
        className="h-8 rounded-md cursor-pointer flex items-center px-3"
        style={{
          background: active ? "var(--c-moss-500)" : "var(--c-surface-sunken)",
          border: "1px solid",
          borderColor: active ? "var(--c-moss-500)" : "var(--c-border-default)",
          color: active ? "#fff" : "var(--c-text-secondary)",
          fontSize: 12,
          transition: `all ${duration}ms ${easing}`,
        }}
        onClick={() => {
          setActive(true);
          setTimeout(() => setActive(false), duration + 100);
        }}
      >
        {active ? "Active" : "Hover to preview"}
      </div>
    </div>
  );
}

function CardHoverDemo() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="p-4 rounded-xl cursor-pointer"
      style={{
        border: "1px solid",
        borderColor: hovered ? "var(--c-border-hover)" : "var(--c-border-default)",
        background: hovered ? "var(--c-surface-raised)" : "var(--c-surface-base)",
        boxShadow: hovered ? "0 4px 12px rgba(28,28,26,0.08)" : "none",
        transition: "all 200ms ease-in-out",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md flex-shrink-0" style={{ background: "var(--c-surface-sunken)" }} />
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--c-text-primary)" }}>Card hover state</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--c-text-secondary)" }}>200ms ease-in-out · border + shadow</p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--c-moss-500)",
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-sm" style={{ color: "var(--c-text-secondary)" }}>Loading research data...</p>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.9); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default function Motion() {
  return (
    <SectionWrapper id="12-motion">
      <SectionHeader
        number="12"
        title="Motion"
        description="Quiet, purposeful, fast. Motion that serves the researcher, not the product."
      />

      {/* Timing scale */}
      <div className="mb-12">
        <SubLabel>Timing Tokens</SubLabel>
        <div className="space-y-3">
          {timings.map((t) => (
            <div
              key={t.token}
              className="grid items-center gap-4 py-4"
              style={{
                gridTemplateColumns: "180px 120px 120px 1fr",
                borderBottom: "1px solid var(--c-border-default)",
              }}
            >
              <p className="text-sm font-mono font-medium" style={{ color: "var(--c-text-primary)" }}>{t.token}</p>
              <p className="text-sm font-mono" style={{ color: "var(--c-moss-600)" }}>{t.range}</p>
              <p className="text-sm font-mono" style={{ color: "var(--c-text-secondary)" }}>{t.easing}</p>
              <p className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>{t.usage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live demos */}
      <div className="mb-12">
        <SubLabel>Live Demos</SubLabel>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <MotionDemo label="Micro interaction" duration={175} easing="ease-out" />
          <MotionDemo label="Standard transition" duration={250} easing="ease-in-out" />
          <MotionDemo label="Major transition" duration={550} easing="ease-in-out" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-xl" style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}>
            <SubLabel>Card hover</SubLabel>
            <CardHoverDemo />
          </div>
          <div className="p-5 rounded-xl" style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}>
            <SubLabel>Loading state</SubLabel>
            <div className="pt-3">
              <LoadingState />
            </div>
          </div>
        </div>
      </div>

      {/* Principles */}
      <div className="mb-12">
        <SubLabel>Principles</SubLabel>
        <div className="grid grid-cols-5 gap-4">
          {principles.map(({ label, desc }) => (
            <div
              key={label}
              className="p-4 rounded-lg"
              style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--c-moss-500)" }}>{label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--c-text-secondary)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Never use */}
      <div className="p-5 rounded-xl" style={{ background: "var(--c-surface-sunken)", border: "1px solid var(--c-border-default)" }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--c-text-tertiary)" }}>
          Never use
        </p>
        <div className="grid grid-cols-2 gap-2">
          {avoidList.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#C43D3D22" }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#C43D3D" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs" style={{ color: "var(--c-text-secondary)" }}>{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--c-border-default)" }}>
          <p className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>
            <strong style={{ color: "var(--c-text-secondary)" }}>Reduced motion:</strong> Always respect{" "}
            <code className="font-mono text-xs" style={{ color: "var(--c-text-secondary)" }}>prefers-reduced-motion</code>. When enabled, replace transitions with instant state changes. Never remove critical state feedback — only remove decorative motion.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
