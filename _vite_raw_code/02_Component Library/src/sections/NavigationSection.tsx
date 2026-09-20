import { useState } from "react";
import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";
import { CambiumIconDark } from "@/components/CambiumLogo";

function SidebarExample() {
  const [active, setActive] = useState("workspace");
  const items = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "workspace", label: "Research Workspace", icon: WorkspaceIcon },
    { id: "discover", label: "Discover", icon: DiscoverIcon },
    { id: "opportunities", label: "Opportunities", icon: OppIcon },
    { id: "portfolio", label: "Portfolio", icon: PortfolioIcon },
    { id: "intelligence", label: "Intelligence", icon: IntelIcon },
  ];
  return (
    <div className="w-52 bg-surface border border-line rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-4 border-b border-line">
        <div className="flex items-center gap-2">
          <CambiumIconDark size={20} radius={5} />
          <div>
            <span className="text-[10px] font-semibold text-ink block leading-none" style={{ letterSpacing: "0.18em" }}>CAMBIUM</span>
            <span className="text-[9px] text-ink-3">Research OS</span>
          </div>
        </div>
      </div>
      <div className="py-2 px-2">
        <p className="text-[9px] text-ink-3 uppercase tracking-widest px-2 pt-1 pb-2">Main</p>
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-colors mb-0.5 ${
              active === id
                ? "bg-navy-light text-navy"
                : "text-ink-2 hover:text-ink hover:bg-surface-2"
            }`}
          >
            <Icon active={active === id} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
      <div className="px-2 pb-2 border-t border-line mt-1 pt-2">
        <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-navy" : "text-ink-3"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  );
}
function WorkspaceIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-navy" : "text-ink-3"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function DiscoverIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-navy" : "text-ink-3"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  );
}
function OppIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-navy" : "text-ink-3"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
    </svg>
  );
}
function PortfolioIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-navy" : "text-ink-3"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function IntelIcon({ active }: { active: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-navy" : "text-ink-3"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}

function BreadcrumbExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-ink-3 hover:text-ink cursor-pointer transition-colors">Workspace</span>
        <svg className="w-3 h-3 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <span className="text-ink-3 hover:text-ink cursor-pointer transition-colors">Projects</span>
        <svg className="w-3 h-3 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <span className="text-ink font-medium">Federated Learning Study</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-ink-3 hover:text-ink cursor-pointer transition-colors">Opportunities</span>
        <svg className="w-3 h-3 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <span className="text-ink-3 hover:text-ink cursor-pointer transition-colors">Fellowships</span>
        <svg className="w-3 h-3 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <span className="text-ink font-medium">Early Career Research Fellowship</span>
      </div>
    </div>
  );
}

function TabsExample() {
  const [active, setActive] = useState("papers");
  const tabs = [
    { id: "papers", label: "Papers", count: 24 },
    { id: "notes", label: "Notes", count: 8 },
    { id: "experiments", label: "Experiments", count: 3 },
    { id: "references", label: "References", count: 47 },
  ];
  return (
    <div className="flex flex-col gap-6">
      {/* Default tabs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center border-b border-line gap-1">
          {tabs.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                active === id
                  ? "border-navy text-navy"
                  : "border-transparent text-ink-3 hover:text-ink-2"
              }`}
            >
              {label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  active === id ? "bg-navy-light text-navy" : "bg-surface-3 text-ink-3"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-3 pt-1">Underline tabs — standard navigation pattern</p>
      </div>
      {/* Pill tabs */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 bg-surface-3 p-1 rounded-lg w-fit">
          {["All", "Papers", "Projects", "Researchers"].map((t) => (
            <button
              key={t}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                t === "Papers"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-3 hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-3 pt-1">Segmented / pill tabs</p>
      </div>
    </div>
  );
}

function PaginationExample() {
  const [current, setCurrent] = useState(3);
  const total = 12;
  const pages = [1, 2, 3, "...", 11, 12];
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrent(Math.max(1, current - 1))}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-ink-2 border border-line rounded-md hover:border-line-2 hover:text-ink transition-colors"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Prev
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2 text-xs text-ink-3">···</span>
        ) : (
          <button
            key={p}
            onClick={() => setCurrent(Number(p))}
            className={`w-8 h-8 text-xs rounded-md transition-colors font-medium ${
              current === p
                ? "bg-navy text-white"
                : "text-ink-2 hover:bg-surface-3"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => setCurrent(Math.min(total, current + 1))}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-ink-2 border border-line rounded-md hover:border-line-2 hover:text-ink transition-colors"
      >
        Next
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
}

export default function NavigationSection() {
  return (
    <SectionWrapper
      id="navigation"
      number="01"
      title="Navigation"
      description="Compact and elegant navigation components. The sidebar should feel like a quiet research companion, not an enterprise panel."
    >
      <ComponentGroup label="Sidebar" note="With workspace switcher and section labels">
        <SidebarExample />
      </ComponentGroup>
      <ComponentGroup label="Breadcrumb" note="Path context for nested research artifacts">
        <BreadcrumbExample />
      </ComponentGroup>
      <ComponentGroup label="Tabs" note="Underline and segmented variants">
        <TabsExample />
      </ComponentGroup>
      <ComponentGroup label="Pagination" note="Navigate large result sets">
        <PaginationExample />
      </ComponentGroup>
    </SectionWrapper>
  );
}
