import SectionWrapper from "../components/SectionWrapper";

interface IconDef {
  name: string;
  path: React.ReactNode;
}

const ICONS: IconDef[] = [
  {
    name: "Home",
    path: <><path d="M3 9.5l7-6 7 6V17a.5.5 0 01-.5.5h-4V13h-5v4.5H3.5A.5.5 0 013 17V9.5z" /></>,
  },
  {
    name: "Search",
    path: <><circle cx="8.5" cy="8.5" r="5.5" /><line x1="16" y1="16" x2="12.5" y2="12.5" /></>,
  },
  {
    name: "Research",
    path: <><circle cx="10" cy="10" r="2" /><path d="M10 4a6 6 0 100 12 6 6 0 000-12zM10 1v2M10 17v2M1 10h2M17 10h2" /></>,
  },
  {
    name: "Paper",
    path: <><path d="M4 2h8l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" /><path d="M12 2v4h4" /><line x1="6" y1="9" x2="13" y2="9" /><line x1="6" y1="12" x2="13" y2="12" /><line x1="6" y1="15" x2="10" y2="15" /></>,
  },
  {
    name: "Project",
    path: <><path d="M2 5a1 1 0 011-1h4l2 2h7a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" /></>,
  },
  {
    name: "Opportunity",
    path: <><path d="M10 2L12.39 7.26 18 8.08l-4 3.9.94 5.5L10 14.77 5.06 17.48 6 11.98 2 8.08l5.61-.82L10 2z" /></>,
  },
  {
    name: "People",
    path: <><circle cx="8" cy="6" r="3" /><path d="M1 18v-1.5A5.5 5.5 0 0112.5 15" /><circle cx="15" cy="13" r="2.5" /><path d="M11 18v-1a4 4 0 018 0v1" /></>,
  },
  {
    name: "Calendar",
    path: <><rect x="2" y="3" width="16" height="16" rx="2" /><line x1="2" y1="8" x2="18" y2="8" /><line x1="6" y1="1" x2="6" y2="5" /><line x1="14" y1="1" x2="14" y2="5" /><rect x="5" y="11" width="2" height="2" /><rect x="9" y="11" width="2" height="2" /><rect x="13" y="11" width="2" height="2" /></>,
  },
  {
    name: "Notes",
    path: <><rect x="3" y="2" width="14" height="17" rx="2" /><line x1="6" y1="6" x2="14" y2="6" /><line x1="6" y1="9.5" x2="14" y2="9.5" /><line x1="6" y1="13" x2="10" y2="13" /></>,
  },
  {
    name: "AI",
    path: <><path d="M10 2l1.5 3 3.5.5-2.5 2.5.5 3.5L10 10l-3 1.5.5-3.5L5 5.5 8.5 5 10 2z" /><line x1="10" y1="13" x2="10" y2="18" /><line x1="6" y1="16" x2="14" y2="16" /></>,
  },
  {
    name: "Settings",
    path: <><circle cx="10" cy="10" r="2.5" /><path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.22 4.22l1.06 1.06M14.72 14.72l1.06 1.06M4.22 15.78l1.06-1.06M14.72 5.28l1.06-1.06" /></>,
  },
  {
    name: "Notifications",
    path: <><path d="M10 2a6 6 0 00-6 6v4l-2 2h16l-2-2V8a6 6 0 00-6-6z" /><path d="M8 17.5a2 2 0 004 0" /></>,
  },
  {
    name: "Messages",
    path: <><path d="M2 3h16v11H2z" rx="1.5" /><path d="M6 18l4-4 4 4" /></>,
  },
  {
    name: "Save",
    path: <><path d="M3 2h10l4 4v12a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" /><path d="M6 2v5h8V2M6 12h8v6H6z" /></>,
  },
  {
    name: "Share",
    path: <><circle cx="14.5" cy="4" r="2" /><circle cx="14.5" cy="16" r="2" /><circle cx="4" cy="10" r="2" /><line x1="6" y1="10" x2="12.5" y2="4.5" /><line x1="6" y1="10" x2="12.5" y2="15.5" /></>,
  },
  {
    name: "Comment",
    path: <><path d="M2 3h16v11H8l-6 5V3z" rx="1" /></>,
  },
  {
    name: "Filter",
    path: <><path d="M2 4h16M5 9h10M8 14h4" strokeLinecap="round" /></>,
  },
  {
    name: "Sort",
    path: <><line x1="3" y1="5" x2="17" y2="5" /><line x1="5" y1="9" x2="15" y2="9" /><line x1="7" y1="13" x2="13" y2="13" /></>,
  },
  {
    name: "Arrow",
    path: <><line x1="4" y1="10" x2="16" y2="10" /><polyline points="12,6 16,10 12,14" /></>,
  },
  {
    name: "Plus",
    path: <><line x1="10" y1="3" x2="10" y2="17" /><line x1="3" y1="10" x2="17" y2="10" /></>,
  },
  {
    name: "Close",
    path: <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></>,
  },
];

function IconTile({ icon, size }: { icon: IconDef; size: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center justify-center rounded-lg border border-edge-default bg-surface-raised"
        style={{ width: size + 20, height: size + 20 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ink-secondary"
        >
          {icon.path}
        </svg>
      </div>
      <span className="text-[10px] text-ink-tertiary text-center">{icon.name}</span>
    </div>
  );
}

export default function IconsSection() {
  return (
    <SectionWrapper
      id="icons"
      num="09"
      title="Icons"
      description="Clean outline icons at consistent 1.5px stroke weight. Simple, geometric, professional. Icons communicate function — never decoration."
    >
      {/* Sizes */}
      <div className="flex items-end gap-8 p-6 bg-surface-raised border border-edge-default rounded-xl mb-10">
        {[
          { size: 16, label: "Small — 16px" },
          { size: 20, label: "Default — 20px" },
          { size: 24, label: "Large — 24px" },
        ].map(({ size, label }) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center">
              <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-secondary">
                <circle cx="8.5" cy="8.5" r="5.5" /><line x1="16" y1="16" x2="12.5" y2="12.5" />
              </svg>
            </div>
            <span className="text-[10px] text-ink-tertiary">{label}</span>
          </div>
        ))}
        <div className="ml-8 pl-8 border-l border-edge-default">
          <div className="text-[11px] text-ink-tertiary space-y-1">
            <div><span className="font-mono">stroke-width:</span> 1.5px</div>
            <div><span className="font-mono">stroke-linecap:</span> round</div>
            <div><span className="font-mono">stroke-linejoin:</span> round</div>
            <div><span className="font-mono">fill:</span> none</div>
          </div>
        </div>
      </div>

      {/* Icon grid */}
      <div className="grid grid-cols-7 gap-4">
        {ICONS.map((icon) => (
          <IconTile key={icon.name} icon={icon} size={20} />
        ))}
      </div>
    </SectionWrapper>
  );
}
