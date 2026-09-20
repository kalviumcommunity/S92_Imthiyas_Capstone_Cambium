import { useState, useEffect } from "react";
import Brand from "./Brand";
import Logo from "./Logo";
import Color from "./Color";
import Typography from "./Typography";
import Spacing from "./Spacing";
import Grid from "./Grid";
import Radius from "./Radius";
import Elevation from "./Elevation";
import Icons from "./Icons";
import ResearchViz from "./ResearchViz";
import DataViz from "./DataViz";
import Motion from "./Motion";
import Accessibility from "./Accessibility";

const navItems = [
  { id: "01-brand", label: "Brand", number: "01" },
  { id: "02-logo", label: "Logo", number: "02" },
  { id: "03-color", label: "Color", number: "03" },
  { id: "04-typography", label: "Typography", number: "04" },
  { id: "05-spacing", label: "Spacing", number: "05" },
  { id: "06-grid", label: "Grid", number: "06" },
  { id: "07-radius", label: "Radius", number: "07" },
  { id: "08-elevation", label: "Elevation", number: "08" },
  { id: "09-icons", label: "Icons", number: "09" },
  { id: "10-research-viz", label: "Research Viz", number: "10" },
  { id: "11-data-viz", label: "Data Viz", number: "11" },
  { id: "12-motion", label: "Motion", number: "12" },
  { id: "13-accessibility", label: "Accessibility", number: "13" },
];

function CambiumMark({ size = 28, color = "#4A7C59" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 1.2)} viewBox="0 0 40 48" fill="none">
      <line x1="20" y1="3" x2="20" y2="45" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="4" r="3.5" fill={color} />
      <line x1="20" y1="16" x2="8" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7" cy="16" r="2.5" fill={color} />
      <line x1="20" y1="30" x2="32" y2="30" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="33" cy="30" r="2.5" fill={color} />
      <circle cx="20" cy="44" r="3.5" fill={color} />
    </svg>
  );
}

export default function CambiumDS() {
  const [activeSection, setActiveSection] = useState("01-brand");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -65% 0px", threshold: 0 }
    );

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-full" style={{ background: "var(--c-surface-base)" }}>
      {/* Sidebar navigation */}
      <aside
        className="sticky top-0 h-screen flex-shrink-0 flex flex-col overflow-y-auto"
        style={{
          width: 220,
          borderRight: "1px solid var(--c-border-default)",
          background: "var(--c-surface-base)",
        }}
      >
        {/* Logo */}
        <div
          className="px-6 py-6 flex items-center gap-3"
          style={{ borderBottom: "1px solid var(--c-border-default)" }}
        >
          <CambiumMark size={22} />
          <div>
            <p
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--c-text-primary)", letterSpacing: "0.1em" }}
            >
              CAMBIUM
            </p>
            <p className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>
              Design System
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="px-3 py-5 flex-1">
          <p
            className="px-3 mb-3 text-xs font-semibold tracking-widest uppercase"
            style={{ color: "var(--c-text-tertiary)" }}
          >
            Foundations
          </p>
          {navItems.map(({ id, label, number }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left mb-0.5"
                style={{
                  background: isActive ? "var(--c-moss-050)" : "transparent",
                  border: "1px solid",
                  borderColor: isActive ? "var(--c-moss-100)" : "transparent",
                  cursor: "pointer",
                  transition: "all 150ms ease-out",
                }}
              >
                <span
                  className="text-xs font-mono w-6 flex-shrink-0"
                  style={{ color: isActive ? "var(--c-moss-500)" : "var(--c-text-tertiary)" }}
                >
                  {number}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: isActive ? "var(--c-moss-700)" : "var(--c-text-secondary)",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1 h-1 rounded-full" style={{ background: "var(--c-moss-500)" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5" style={{ borderTop: "1px solid var(--c-border-default)" }}>
          <p className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>
            01 — Design System
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--c-text-tertiary)" }}>
            v1.0 · 2025
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Page header */}
        <div
          className="px-12 py-10"
          style={{ borderBottom: "1px solid var(--c-border-default)" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--c-moss-500)" }}>
            01 — Design System
          </p>
          <h1
            className="font-serif font-light mb-3"
            style={{ fontSize: 40, letterSpacing: "-0.02em", color: "var(--c-text-primary)", lineHeight: 1.2 }}
          >
            Cambium Design System
          </h1>
          <p className="text-lg" style={{ color: "var(--c-text-secondary)", maxWidth: 560 }}>
            The single source of truth for Cambium's visual language. Every decision made here shapes how research feels.
          </p>
          <div className="flex items-center gap-6 mt-6">
            {[
              { label: "13", desc: "Sections" },
              { label: "Inter + Source Serif 4", desc: "Typography" },
              { label: "Moss green", desc: "Accent" },
              { label: "WCAG AA", desc: "Accessibility" },
            ].map(({ label, desc }) => (
              <div key={desc} className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: "var(--c-text-primary)" }}>{label}</span>
                <span className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <Brand />
        <Logo />
        <Color />
        <Typography />
        <Spacing />
        <Grid />
        <Radius />
        <Elevation />
        <Icons />
        <ResearchViz />
        <DataViz />
        <Motion />
        <Accessibility />
      </main>
    </div>
  );
}
