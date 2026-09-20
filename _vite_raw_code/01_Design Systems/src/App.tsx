import { useState, useEffect } from "react";
import CambiumMark from "./components/CambiumMark";
import Brand from "./sections/Brand";
import LogoSection from "./sections/LogoSection";
import ColorSection from "./sections/ColorSection";
import TypographySection from "./sections/TypographySection";
import SpacingSection from "./sections/SpacingSection";
import GridSection from "./sections/GridSection";
import RadiusSection from "./sections/RadiusSection";
import ElevationSection from "./sections/ElevationSection";
import IconsSection from "./sections/IconsSection";
import ResearchVizSection from "./sections/ResearchVizSection";
import DataVizSection from "./sections/DataVizSection";
import MotionSection from "./sections/MotionSection";
import AccessibilitySection from "./sections/AccessibilitySection";

const SECTIONS = [
  { id: "brand", num: "01", label: "Brand" },
  { id: "logo", num: "02", label: "Logo" },
  { id: "color", num: "03", label: "Color" },
  { id: "typography", num: "04", label: "Typography" },
  { id: "spacing", num: "05", label: "Spacing" },
  { id: "grid", num: "06", label: "Grid" },
  { id: "radius", num: "07", label: "Radius" },
  { id: "elevation", num: "08", label: "Elevation" },
  { id: "icons", num: "09", label: "Icons" },
  { id: "research-viz", num: "10", label: "Research Visualization" },
  { id: "data-viz", num: "11", label: "Data Visualization" },
  { id: "motion", num: "12", label: "Motion" },
  { id: "accessibility", num: "13", label: "Accessibility" },
];

// Brand colors (literal, sidebar uses inverse surface which is the forest green)
const PRIMARY = "#173F35";
const PRIMARY_LIGHT = "#DCEBE4";
const INK = "#17201D";
const INK_INVERSE = "#F7F6F1";
const BORDER_ON_GREEN = "rgba(220,235,228,0.12)";
const TEXT_ON_GREEN_DIM = "rgba(220,235,228,0.45)";
const TEXT_ON_GREEN_MID = "rgba(220,235,228,0.65)";

export default function App() {
  const [active, setActive] = useState("brand");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full font-sans" style={{ background: "#F7F6F1" }}>
      {/* Sidebar — brand primary forest green */}
      <aside
        className="w-[224px] flex-shrink-0 h-screen sticky top-0 overflow-y-auto flex flex-col"
        style={{ background: PRIMARY, borderRight: `1px solid ${BORDER_ON_GREEN}` }}
      >
        {/* Wordmark */}
        <div className="px-5 py-6" style={{ borderBottom: `1px solid ${BORDER_ON_GREEN}` }}>
          <div className="flex items-center gap-2.5 mb-4">
            <CambiumMark size={24} color={PRIMARY_LIGHT} counterOpacity={0.3} />
            <span
              style={{
                fontFamily: "Manrope, system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.14em",
                color: INK_INVERSE,
              }}
            >
              CAMBIUM
            </span>
          </div>
          <div
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-[0.06em]"
            style={{ background: "rgba(220,235,228,0.15)", color: PRIMARY_LIGHT }}
          >
            Design System v1.0
          </div>
          <p className="mt-3 text-[11px]" style={{ color: TEXT_ON_GREEN_DIM }}>
            01 — Design System
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3">
          {SECTIONS.map(({ id, num, label }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2.5 px-2 py-2 rounded-md mb-0.5 transition-colors"
                style={{
                  background: isActive ? "rgba(220,235,228,0.15)" : "transparent",
                  textDecoration: "none",
                }}
              >
                <span
                  className="text-[10px] font-mono flex-shrink-0 w-6"
                  style={{ color: isActive ? PRIMARY_LIGHT : TEXT_ON_GREEN_DIM }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontFamily: "Manrope, system-ui, sans-serif",
                    fontSize: 12,
                    color: isActive ? INK_INVERSE : TEXT_ON_GREEN_MID,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {label}
                </span>
                {isActive && (
                  <div
                    className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0"
                    style={{ background: PRIMARY_LIGHT }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: `1px solid ${BORDER_ON_GREEN}` }}>
          <p className="text-[10px]" style={{ color: TEXT_ON_GREEN_DIM, fontStyle: "italic" }}>
            Research, connected.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Page header */}
        <div className="px-16 py-12 border-b border-edge-default bg-surface-raised">
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] mb-3 text-moss-600">
              01 — DESIGN SYSTEM
            </p>
            <h1
              className="text-[40px] font-bold tracking-[-0.03em] mb-3 text-ink-primary"
              style={{ lineHeight: 1.08 }}
            >
              Cambium Design Language
            </h1>
            <p className="text-base text-ink-secondary max-w-xl" style={{ lineHeight: 1.65 }}>
              The single source of truth for Cambium's visual language. A system rooted in the
              philosophy of knowledge growth — precise, calm, and deeply connected.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="px-16 py-16 max-w-5xl space-y-28">
          <Brand />
          <LogoSection />
          <ColorSection />
          <TypographySection />
          <SpacingSection />
          <GridSection />
          <RadiusSection />
          <ElevationSection />
          <IconsSection />
          <ResearchVizSection />
          <DataVizSection />
          <MotionSection />
          <AccessibilitySection />
        </div>

        {/* Footer */}
        <div className="px-16 py-10 border-t border-edge-default mt-16">
          <div className="max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CambiumMark size={20} color={PRIMARY} counterOpacity={0.25} />
              <span
                style={{
                  fontFamily: "Manrope, system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  color: INK,
                }}
              >
                CAMBIUM
              </span>
            </div>
            <p className="text-[11px] text-ink-tertiary">Design System v1.0 — 2026</p>
          </div>
        </div>
      </main>
    </div>
  );
}
