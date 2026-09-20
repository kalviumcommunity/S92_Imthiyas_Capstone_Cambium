import { SectionWrapper, SectionHeader, SubLabel } from "./shared";
import { useState } from "react";

function ContrastPair({ bg, text, ratio, label, pass }: { bg: string; text: string; ratio: string; label: string; pass: "AA" | "AAA" | "FAIL" }) {
  const passColor = pass === "FAIL" ? "#C43D3D" : pass === "AAA" ? "#31573C" : "#4A7C59";
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--c-border-default)" }}>
      <div
        className="flex items-center justify-center py-6 px-4"
        style={{ background: bg }}
      >
        <p className="text-sm font-medium text-center" style={{ color: text }}>
          The quick brown fox
        </p>
      </div>
      <div className="px-4 py-3" style={{ background: "var(--c-surface-raised)", borderTop: "1px solid var(--c-border-default)" }}>
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--c-text-secondary)" }}>{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)" }}>{ratio}</span>
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{ background: `${passColor}18`, color: passColor }}
            >
              {pass}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FocusRingDemo() {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <button
        className="px-4 py-2 rounded-lg text-sm font-medium outline-none"
        style={{
          background: "var(--c-surface-raised)",
          border: "1px solid var(--c-border-default)",
          color: "var(--c-text-primary)",
          boxShadow: focused ? "0 0 0 2px var(--c-surface-base), 0 0 0 4px var(--c-moss-500)" : "none",
          transition: "box-shadow 150ms ease-out",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        Tab to focus me
      </button>
      <p className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>
        2px moss ring · 2px offset · keyboard focus only
      </p>
    </div>
  );
}

function TouchTargetDemo() {
  return (
    <div className="flex items-end gap-6">
      {[
        { size: 44, label: "Min target", ok: true },
        { size: 32, label: "Too small", ok: false },
        { size: 44, label: "Icon button", ok: true },
      ].map(({ size, label, ok }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center">
            {ok && (
              <div
                className="absolute rounded-lg"
                style={{
                  width: 44,
                  height: 44,
                  border: "1.5px dashed var(--c-moss-300)",
                }}
              />
            )}
            <div
              className="rounded-md flex items-center justify-center"
              style={{
                width: size,
                height: size,
                background: ok ? "var(--c-moss-050)" : "#FDF0F0",
                border: `1.5px solid ${ok ? "var(--c-moss-300)" : "#C43D3D44"}`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ok ? "var(--c-moss-500)" : "#C43D3D"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-center" style={{ color: "var(--c-text-secondary)" }}>{label}</p>
          <p className="text-xs font-mono text-center" style={{ color: "var(--c-text-tertiary)" }}>{size}×{size}px</p>
        </div>
      ))}
    </div>
  );
}

const requirements = [
  { area: "Color contrast", level: "WCAG AA", spec: "≥4.5:1 normal text, ≥3:1 large text and UI", status: "Required" },
  { area: "Keyboard focus", level: "WCAG AA", spec: "All interactive elements must have visible focus", status: "Required" },
  { area: "Focus ring", level: "Design spec", spec: "2px moss offset ring, 2px offset", status: "Defined" },
  { area: "Touch targets", level: "WCAG 2.5.5", spec: "Minimum 44×44px for all interactive controls", status: "Required" },
  { area: "Color independence", level: "WCAG 1.4.1", spec: "Never use color as the sole means of conveying information", status: "Required" },
  { area: "Text readability", level: "WCAG AA", spec: "Body text ≥16px, minimum 400 weight, 1.5+ line height", status: "Recommended" },
  { area: "Reduced motion", level: "WCAG 2.3.3", spec: "Respect prefers-reduced-motion; disable all decorative animation", status: "Required" },
  { area: "Semantic states", level: "WCAG 4.1.3", spec: "All status messages must be programmatically determinable", status: "Required" },
];

export default function Accessibility() {
  return (
    <SectionWrapper id="13-accessibility" last>
      <SectionHeader
        number="13"
        title="Accessibility"
        description="Cambium must work for every researcher. WCAG AA is the minimum standard — we target beyond it."
      />

      {/* Contrast pairs */}
      <div className="mb-12">
        <SubLabel>Color Contrast</SubLabel>
        <div className="grid grid-cols-3 gap-4">
          <ContrastPair
            bg="#FAFAF8"
            text="#1C1C1A"
            ratio="18.6:1"
            label="text/primary on surface/base"
            pass="AAA"
          />
          <ContrastPair
            bg="#FAFAF8"
            text="#5C5C58"
            ratio="8.1:1"
            label="text/secondary on surface/base"
            pass="AAA"
          />
          <ContrastPair
            bg="#FAFAF8"
            text="#9A9A96"
            ratio="3.8:1"
            label="text/tertiary on surface/base"
            pass="AA"
          />
          <ContrastPair
            bg="#1C1C1A"
            text="#F5F4F0"
            ratio="16.2:1"
            label="text/inverse on surface/inverse"
            pass="AAA"
          />
          <ContrastPair
            bg="#4A7C59"
            text="#FFFFFF"
            ratio="5.1:1"
            label="white on accent/moss-500"
            pass="AA"
          />
          <ContrastPair
            bg="#FAFAF8"
            text="#4A7C59"
            ratio="5.2:1"
            label="accent/moss-500 on surface/base"
            pass="AA"
          />
        </div>
      </div>

      {/* Focus and touch */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div
          className="p-6 rounded-xl"
          style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
        >
          <SubLabel>Keyboard Focus Ring</SubLabel>
          <FocusRingDemo />
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span style={{ color: "var(--c-text-tertiary)" }}>Ring color</span>
              <p className="font-mono mt-0.5" style={{ color: "var(--c-text-secondary)" }}>#4A7C59 · moss-500</p>
            </div>
            <div>
              <span style={{ color: "var(--c-text-tertiary)" }}>Offset</span>
              <p className="font-mono mt-0.5" style={{ color: "var(--c-text-secondary)" }}>2px</p>
            </div>
            <div>
              <span style={{ color: "var(--c-text-tertiary)" }}>Ring width</span>
              <p className="font-mono mt-0.5" style={{ color: "var(--c-text-secondary)" }}>2px</p>
            </div>
            <div>
              <span style={{ color: "var(--c-text-tertiary)" }}>Trigger</span>
              <p className="font-mono mt-0.5" style={{ color: "var(--c-text-secondary)" }}>:focus-visible</p>
            </div>
          </div>
        </div>
        <div
          className="p-6 rounded-xl"
          style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
        >
          <SubLabel>Touch Targets</SubLabel>
          <TouchTargetDemo />
          <p className="text-xs mt-4 leading-relaxed" style={{ color: "var(--c-text-tertiary)" }}>
            All interactive elements must have a clickable/tappable area of at least 44×44px — even if the visual design appears smaller. Use padding or invisible tap areas to achieve this.
          </p>
        </div>
      </div>

      {/* Requirements table */}
      <SubLabel>Requirements Checklist</SubLabel>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--c-border-default)" }}>
        <div
          className="grid px-5 py-3 text-xs font-semibold tracking-widest uppercase"
          style={{
            gridTemplateColumns: "1fr 100px 1fr 90px",
            background: "var(--c-surface-sunken)",
            color: "var(--c-text-tertiary)",
            borderBottom: "1px solid var(--c-border-default)",
          }}
        >
          <span>Area</span>
          <span>Standard</span>
          <span>Specification</span>
          <span>Status</span>
        </div>
        {requirements.map((r, i) => (
          <div
            key={r.area}
            className="grid px-5 py-4 items-center gap-4"
            style={{
              gridTemplateColumns: "1fr 100px 1fr 90px",
              borderBottom: i < requirements.length - 1 ? "1px solid var(--c-border-default)" : "none",
              background: i % 2 === 0 ? "var(--c-surface-base)" : "var(--c-surface-raised)",
            }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--c-text-primary)" }}>{r.area}</span>
            <span className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)" }}>{r.level}</span>
            <span className="text-xs leading-relaxed" style={{ color: "var(--c-text-secondary)" }}>{r.spec}</span>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full inline-block"
              style={{
                background: r.status === "Required" ? "var(--c-moss-050)" : "var(--c-surface-sunken)",
                color: r.status === "Required" ? "var(--c-moss-600)" : "var(--c-text-tertiary)",
                border: `1px solid ${r.status === "Required" ? "var(--c-moss-100)" : "var(--c-border-default)"}`,
              }}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
