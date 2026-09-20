import { SectionWrapper, SectionHeader } from "./shared";

const icons: { name: string; path: string }[] = [
  { name: "Home", path: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-5h-6v5H4a1 1 0 01-1-1V9.5z" },
  { name: "Search", path: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" },
  { name: "Research", path: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" },
  { name: "Paper", path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { name: "Project", path: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" },
  { name: "Opportunity", path: "M15 10l4.553-2.069A1 1 0 0121 8.82V16a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" },
  { name: "People", path: "M17 20h5v-2a4 4 0 00-5.477-3.76M9 11a4 4 0 100-8 4 4 0 000 8zm8 9v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h16z" },
  { name: "Calendar", path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { name: "Notes", path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { name: "AI", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0v4m0 16v-4m10-6h-4M6 12H2m14.24-6.24l-2.83 2.83M6.59 17.41l2.83-2.83m8.48 0l-2.83-2.83M9.42 6.59L6.59 9.42" },
  { name: "Settings", path: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { name: "Notifications", path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  { name: "Messages", path: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { name: "Save", path: "M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8l-4-4m-4 8v-4m0 0l-2 2m2-2l2 2" },
  { name: "Share", path: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" },
  { name: "Comment", path: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
  { name: "Filter", path: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" },
  { name: "Sort", path: "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" },
  { name: "Arrow", path: "M13 7l5 5m0 0l-5 5m5-5H6" },
  { name: "Plus", path: "M12 4v16m8-8H4" },
  { name: "Close", path: "M6 18L18 6M6 6l12 12" },
];

function Icon({ path, size = 20 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export default function Icons() {
  return (
    <SectionWrapper id="09-icons">
      <SectionHeader
        number="09"
        title="Icons"
        description="Clean outline icons. Geometric, consistent, minimal. Single stroke weight throughout."
      />

      {/* Size demonstration */}
      <div className="mb-10 flex items-end gap-8">
        <div className="flex items-end gap-6">
          {[16, 20, 24].map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <div style={{ color: "var(--c-text-primary)" }}>
                <Icon path={icons[1].path} size={size} />
              </div>
              <p className="text-xs font-mono" style={{ color: "var(--c-text-tertiary)" }}>{size}px</p>
            </div>
          ))}
        </div>
        <div className="ml-4 text-sm" style={{ color: "var(--c-text-secondary)" }}>
          <p className="mb-1"><strong style={{ color: "var(--c-text-primary)" }}>16px</strong> — compact UI, table actions, dense lists</p>
          <p className="mb-1"><strong style={{ color: "var(--c-text-primary)" }}>20px</strong> — default UI, navigation, buttons</p>
          <p><strong style={{ color: "var(--c-text-primary)" }}>24px</strong> — feature icons, empty states, large controls</p>
        </div>
      </div>

      {/* Icon grid */}
      <div className="grid grid-cols-7 gap-1">
        {icons.map(({ name, path }) => (
          <div
            key={name}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg group cursor-default"
            style={{
              border: "1px solid transparent",
              transition: "all 150ms ease-out",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--c-surface-raised)";
              el.style.borderColor = "var(--c-border-default)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.borderColor = "transparent";
            }}
          >
            <div style={{ color: "var(--c-text-primary)" }}>
              <Icon path={path} size={20} />
            </div>
            <p className="text-xs text-center" style={{ color: "var(--c-text-tertiary)" }}>{name}</p>
          </div>
        ))}
      </div>

      {/* Style guide */}
      <div className="mt-10 grid grid-cols-3 gap-5">
        {[
          { label: "Style", value: "Outline (stroke)" },
          { label: "Stroke weight", value: "1.5px" },
          { label: "Line caps", value: "Round" },
          { label: "Line joins", value: "Round" },
          { label: "Grid", value: "24×24px" },
          { label: "Padding", value: "2px optical margin" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="px-4 py-3 rounded-lg flex items-center gap-3"
            style={{ border: "1px solid var(--c-border-default)", background: "var(--c-surface-raised)" }}
          >
            <span className="text-xs" style={{ color: "var(--c-text-tertiary)" }}>{label}</span>
            <span className="text-sm font-medium ml-auto" style={{ color: "var(--c-text-primary)" }}>{value}</span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
