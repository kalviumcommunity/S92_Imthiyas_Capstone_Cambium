import SectionWrapper from "../components/SectionWrapper";
import { useState } from "react";

interface ContrastRow {
  combo: string;
  fg: string;
  bg: string;
  ratio: string;
  level: string;
  pass: boolean;
}

// Updated for brand palette (#17201D text, #173F35 primary, etc.)
const contrastRows: ContrastRow[] = [
  { combo: "text/primary on surface/base", fg: "#17201D", bg: "#F7F6F1", ratio: "12.1:1", level: "AAA", pass: true },
  { combo: "text/primary on surface/raised", fg: "#17201D", bg: "#FFFFFF", ratio: "14.2:1", level: "AAA", pass: true },
  { combo: "text/secondary on surface/raised", fg: "#66716C", bg: "#FFFFFF", ratio: "5.7:1", level: "AA", pass: true },
  { combo: "text/inverse on surface/inverse", fg: "#F7F6F1", bg: "#173F35", ratio: "9.8:1", level: "AAA", pass: true },
  { combo: "moss-600 (#173F35) on white", fg: "#173F35", bg: "#FFFFFF", ratio: "9.8:1", level: "AAA", pass: true },
  { combo: "moss-600 on accent/moss-100", fg: "#173F35", bg: "#DCEBE4", ratio: "5.4:1", level: "AA", pass: true },
  { combo: "semantic/error on surface/raised", fg: "#8C3225", bg: "#FFFFFF", ratio: "5.0:1", level: "AA", pass: true },
  { combo: "semantic/warning on surface/raised", fg: "#856214", bg: "#FFFFFF", ratio: "4.7:1", level: "AA", pass: true },
];

function ContrastTable() {
  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden mb-10">
      <div className="px-4 py-3 border-b border-edge-default bg-surface-sunken grid grid-cols-[2fr_1fr_1fr_80px] gap-4">
        {["Combination", "Ratio", "Level", "WCAG AA"].map((h) => (
          <span key={h} className="text-[10px] font-semibold tracking-[0.1em] text-ink-tertiary uppercase">{h}</span>
        ))}
      </div>
      {contrastRows.map((row) => (
        <div key={row.combo} className="px-4 py-3 border-b border-edge-default last:border-0 grid grid-cols-[2fr_1fr_1fr_80px] gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center" style={{ background: row.bg, border: "1px solid #DDE2DE" }}>
              <span style={{ color: row.fg, fontSize: 9, fontWeight: 700 }}>Aa</span>
            </div>
            <span className="text-[11px] text-ink-secondary">{row.combo}</span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-ink-primary">{row.ratio}</span>
          <span className="text-[11px] font-mono text-moss-600">{row.level}</span>
          <span className={`text-[11px] font-semibold ${row.pass ? "text-semantic-success" : "text-semantic-error"}`}>
            {row.pass ? "✓ Pass" : "✗ Fail"}
          </span>
        </div>
      ))}
    </div>
  );
}

function FocusRingDemo() {
  const [focused, setFocused] = useState(false);
  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl p-6">
      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">Focus Ring</h3>
      <div className="flex items-center gap-6">
        <button
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="px-4 py-2 text-sm font-semibold rounded-lg border border-edge-strong bg-surface-raised text-ink-primary outline-none"
          style={{
            boxShadow: focused ? "0 0 0 2px #F7F6F1, 0 0 0 4px #173F35" : "none",
            transition: "box-shadow 150ms ease-out",
          }}
        >
          Tab to focus me
        </button>
        <div className="text-[11px] font-mono text-ink-tertiary space-y-1">
          <div>outline-color: <span className="text-ink-primary">moss-600 #173F35</span></div>
          <div>outline-width: 2px</div>
          <div>outline-offset: 2px</div>
        </div>
      </div>
    </div>
  );
}

function TouchTargets() {
  return (
    <div className="bg-surface-raised border border-edge-default rounded-xl p-6">
      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">Touch Targets</h3>
      <div className="flex items-end gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-11 h-11 rounded-lg border-2 border-dashed border-moss-300 flex items-center justify-center bg-moss-050">
            <div className="w-5 h-5 rounded" style={{ background: "#173F35" }} />
          </div>
          <span className="text-[10px] text-ink-tertiary">Min 44×44px</span>
          <span className="text-[10px] text-semantic-success font-semibold">✓ Correct</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 rounded border-2 border-dashed flex items-center justify-center" style={{ borderColor: "rgba(140,50,37,0.35)", background: "#FDF1EF" }}>
            <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(140,50,37,0.4)" }} />
          </div>
          <span className="text-[10px] text-ink-tertiary">20×20px</span>
          <span className="text-[10px] text-semantic-error font-semibold">✗ Too small</span>
        </div>
        <p className="text-[11px] text-ink-secondary max-w-xs">
          All interactive elements require a minimum 44×44px touch target. Padding extends the tap area — visual size may be smaller.
        </p>
      </div>
    </div>
  );
}

const a11yRules = [
  { topic: "Color independence", desc: "Never convey information with color alone. Always pair with text, icons, or patterns." },
  { topic: "Keyboard navigation", desc: "All interactive elements are reachable and operable via keyboard. Tab order follows reading order." },
  { topic: "Semantic HTML", desc: "Use correct elements: <button> for actions, <a> for navigation, <label> for form fields." },
  { topic: "Reduced motion", desc: "Respect prefers-reduced-motion. Disable transforms; retain opacity changes ≤ 100ms." },
  { topic: "Typography readability", desc: "Minimum 16px body text. Line height ≥ 1.5. Optimal line length 60–80 characters." },
  { topic: "Error messages", desc: "Pair error colors with explicit text labels. Color is never the sole error indicator." },
];

export default function AccessibilitySection() {
  return (
    <SectionWrapper
      id="accessibility"
      num="13"
      title="Accessibility"
      description="Cambium is built for every researcher, regardless of ability. WCAG 2.1 AA is the floor — AAA is the goal wherever practical."
    >
      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">WCAG Contrast</h3>
      <ContrastTable />

      <div className="grid grid-cols-2 gap-4 mb-10">
        <FocusRingDemo />
        <TouchTargets />
      </div>

      <h3 className="text-[11px] font-semibold tracking-[0.15em] text-ink-tertiary uppercase mb-4">Core Requirements</h3>
      <div className="grid grid-cols-1 gap-3">
        {a11yRules.map(({ topic, desc }) => (
          <div key={topic} className="flex items-start gap-4 p-4 bg-surface-raised border border-edge-default rounded-xl">
            <span className="text-xs font-semibold text-moss-600 w-36 flex-shrink-0 pt-0.5 leading-relaxed">{topic}</span>
            <span className="text-sm text-ink-secondary">{desc}</span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
