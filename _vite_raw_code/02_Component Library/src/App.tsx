import { useState, useEffect } from "react";
import { CambiumIconDark, CambiumMark } from "./components/CambiumLogo";
import NavigationSection from "./sections/NavigationSection";
import ButtonsSection from "./sections/ButtonsSection";
import InputsSection from "./sections/InputsSection";
import SearchSection from "./sections/SearchSection";
import FiltersSection from "./sections/FiltersSection";
import CardsSection from "./sections/CardsSection";
import ResearchSection from "./sections/ResearchSection";
import OpportunitySection from "./sections/OpportunitySection";
import ProfileSection from "./sections/ProfileSection";
import CollaborationSection from "./sections/CollaborationSection";
import WorkspaceSection from "./sections/WorkspaceSection";
import AISection from "./sections/AISection";
import DataSection from "./sections/DataSection";
import FeedbackSection from "./sections/FeedbackSection";
import OverlaysSection from "./sections/OverlaysSection";
import DocumentationSection from "./sections/DocumentationSection";

const sections = [
  { id: "navigation", number: "01", title: "Navigation" },
  { id: "buttons", number: "02", title: "Buttons" },
  { id: "inputs", number: "03", title: "Inputs" },
  { id: "search", number: "04", title: "Search" },
  { id: "filters", number: "05", title: "Filters & Controls" },
  { id: "cards", number: "06", title: "Cards" },
  { id: "research", number: "07", title: "Research" },
  { id: "opportunity", number: "08", title: "Opportunity" },
  { id: "profile", number: "09", title: "Profile" },
  { id: "collaboration", number: "10", title: "Collaboration" },
  { id: "workspace", number: "11", title: "Workspace" },
  { id: "ai", number: "12", title: "AI" },
  { id: "data", number: "13", title: "Data" },
  { id: "feedback", number: "14", title: "Feedback & States" },
  { id: "overlays", number: "15", title: "Overlays" },
  { id: "documentation", number: "16", title: "Documentation" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("navigation");

  useEffect(() => {
    const main = document.getElementById("main-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: main, rootMargin: "-10% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    const main = document.getElementById("main-scroll");
    if (!el || !main) return;
    const mainRect = main.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset = elRect.top - mainRect.top + main.scrollTop - 48;
    main.scrollTo({ top: offset, behavior: "smooth" });
  };

  return (
    <div className="flex h-full bg-canvas overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 bg-canvas border-r border-line flex flex-col h-full">
        {/* Wordmark */}
        <div className="px-5 pt-5 pb-4 border-b border-line flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <CambiumIconDark size={28} radius={7} />
            <div>
              <span
                className="text-[11px] font-semibold text-ink block leading-none"
                style={{ letterSpacing: "0.18em", fontFamily: "'Manrope', system-ui, sans-serif" }}
              >
                CAMBIUM
              </span>
              <span className="text-[10px] text-ink-3 mt-0.5 block">02 — Components</span>
            </div>
          </div>
        </div>

        {/* Section navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5">
          {sections.map(({ id, number, title }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-colors mb-0.5 group ${
                  isActive
                    ? "bg-navy-light text-navy"
                    : "text-ink-3 hover:text-ink-2 hover:bg-surface-2"
                }`}
              >
                <span
                  className={`text-[10px] font-medium tracking-widest flex-shrink-0 w-5 ${
                    isActive ? "text-navy-mid" : "text-ink-3"
                  }`}
                >
                  {number}
                </span>
                <span className={`text-xs font-medium truncate ${isActive ? "text-navy" : ""}`}>{title}</span>
                {isActive && (
                  <span className="ml-auto w-1 h-1 rounded-full bg-navy flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-line flex items-center gap-2">
          <CambiumMark size={12} color="var(--color-ink-3)" strokeWidth={2.5} />
          <p className="text-[10px] text-ink-3">Cambium Design System</p>
        </div>
      </aside>

      {/* Main scrollable content */}
      <main
        id="main-scroll"
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Page header — 3px forest green top bar anchors brand identity */}
        <div
          className="sticky top-0 z-10 bg-canvas/95 backdrop-blur-sm border-b border-line px-10 py-3 flex items-center justify-between"
          style={{ borderTop: "3px solid var(--color-navy)" }}
        >
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <span className="font-medium" style={{ letterSpacing: "0.08em" }}>Cambium</span>
            <svg className="w-3 h-3 text-line-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span className="text-ink font-medium">02 — Components</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-navy font-semibold bg-navy-light px-2 py-1 rounded" style={{ letterSpacing: "0.05em" }}>
              {sections.find(s => s.id === activeSection)?.number} — {sections.find(s => s.id === activeSection)?.title}
            </span>
            <span className="text-[10px] text-ink-3">16 sections · {sections.length * 4}+ components</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-10">
          <NavigationSection />
          <ButtonsSection />
          <InputsSection />
          <SearchSection />
          <FiltersSection />
          <CardsSection />
          <ResearchSection />
          <OpportunitySection />
          <ProfileSection />
          <CollaborationSection />
          <WorkspaceSection />
          <AISection />
          <DataSection />
          <FeedbackSection />
          <OverlaysSection />
          <DocumentationSection />
        </div>

        {/* Bottom space */}
        <div className="h-24" />
      </main>
    </div>
  );
}
