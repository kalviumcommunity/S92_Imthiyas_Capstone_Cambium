import { useState, useEffect } from "react";

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4.5 4.5H8.5M4.5 7H8.5M4.5 9.5H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const WorkspaceIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8" y="8" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const LitReviewIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 3C2 2.44772 2.44772 2 3 2H7L12 6V11C12 11.5523 11.5523 12 11 12H3C2.44772 12 2 11.5523 2 11V3Z" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7 2V6H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 8.5L6.5 10L9 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type ResultItem = {
  id: string;
  label: string;
  meta?: string;
  type: "command" | "paper";
};

const suggestions: ResultItem[] = [
  { id: "workspace", label: "Go to Workspace", type: "command" },
  { id: "litreview", label: "Start Literature Review", type: "command" },
];

const recentPapers: ResultItem[] = [
  { id: "paper1", label: "Attention Is All You Need", meta: "Vaswani et al., 2017", type: "paper" },
  { id: "paper2", label: "BERT: Pre-training of Deep Bidirectional Transformers", meta: "Devlin et al., 2019", type: "paper" },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("paper1");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const allItems = [...suggestions, ...recentPapers];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const idx = allItems.findIndex((i) => i.id === selectedId);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedId(allItems[(idx + 1) % allItems.length].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedId(allItems[(idx - 1 + allItems.length) % allItems.length].id);
    } else if (e.key === "Escape") {
      setVisible(false);
    }
  };

  return (
    <div
      className="w-screen h-screen flex justify-center items-start"
      style={{
        background: "rgba(23,32,29,0.40)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Modal */}
      <div
        style={{
          marginTop: "96px",
          maxWidth: "600px",
          width: "100%",
          background: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #DDE2DE",
          boxShadow: "0 16px 40px rgba(23,63,53,0.14)",
          overflow: "hidden",
          transformOrigin: "top center",
          transition: visible
            ? "opacity 180ms cubic-bezier(0.34,1.56,0.64,1), transform 180ms cubic-bezier(0.34,1.56,0.64,1)"
            : "none",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
        }}
      >
        {/* Search Input Row */}
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: "12px",
            borderBottom: "1px solid #DDE2DE",
          }}
        >
          <SearchIcon className="shrink-0" style={{ color: "#66716C" } as React.CSSProperties} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, people, or commands..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "17px",
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 500,
              color: "#17201D",
              letterSpacing: "-0.01em",
            }}
          />
          <span
            style={{
              background: "#F7F6F1",
              color: "#66716C",
              fontSize: "11px",
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 600,
              padding: "3px 7px",
              borderRadius: "4px",
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Esc
          </span>
        </div>

        {/* Results */}
        <div style={{ paddingBottom: "8px" }}>
          {/* Suggestions group */}
          <SectionLabel>Suggestions</SectionLabel>
          {suggestions.map((item) => (
            <CommandItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onSelect={() => setSelectedId(item.id)}
            />
          ))}

          {/* Recent Papers group */}
          <SectionLabel>Recent Papers</SectionLabel>
          {recentPapers.map((item) => (
            <PaperItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onSelect={() => setSelectedId(item.id)}
            />
          ))}
        </div>

        {/* Footer hint */}
        <div
          style={{
            borderTop: "1px solid #DDE2DE",
            padding: "10px 16px",
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <HintKey label="↑↓" desc="navigate" />
          <HintKey label="↵" desc="open" />
          <HintKey label="Esc" desc="close" />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "10.5px",
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 700,
        color: "#66716C",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        padding: "14px 16px 6px",
      }}
    >
      {children}
    </div>
  );
}

function CommandItem({
  item,
  isSelected,
  onSelect,
}: {
  item: ResultItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const active = isSelected;
  const bg = active ? "#173F35" : hovered ? "#F7F6F1" : "transparent";
  const color = active ? "#FFFFFF" : "#17201D";
  const iconColor = active ? "#FFFFFF" : "#66716C";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        background: bg,
        color,
        cursor: "pointer",
        transition: "background 100ms ease",
        borderRadius: "6px",
        margin: "1px 6px",
      }}
    >
      <span style={{ color: iconColor, display: "flex", alignItems: "center" }}>
        {item.id === "workspace" ? <WorkspaceIcon /> : <LitReviewIcon />}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: "14px",
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {item.label}
      </span>
      <span style={{ color: iconColor, display: "flex", alignItems: "center", opacity: active || hovered ? 1 : 0, transition: "opacity 120ms" }}>
        <ArrowRightIcon />
      </span>
    </div>
  );
}

function PaperItem({
  item,
  isSelected,
  onSelect,
}: {
  item: ResultItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const active = isSelected;
  const bg = active ? "#173F35" : hovered ? "#F7F6F1" : "transparent";
  const color = active ? "#FFFFFF" : "#17201D";
  const metaColor = active ? "rgba(255,255,255,0.62)" : "#66716C";
  const iconColor = active ? "#FFFFFF" : "#66716C";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        background: bg,
        color,
        cursor: "pointer",
        transition: "background 100ms ease",
        borderRadius: "6px",
        margin: "1px 6px",
      }}
    >
      <span style={{ color: iconColor, display: "flex", alignItems: "center", flexShrink: 0 }}>
        <DocumentIcon />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: "14px",
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </span>
        {item.meta && (
          <span
            style={{
              display: "block",
              fontSize: "11.5px",
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 400,
              color: metaColor,
              marginTop: "1px",
            }}
          >
            {item.meta}
          </span>
        )}
      </span>
      <span style={{ color: iconColor, display: "flex", alignItems: "center", opacity: active || hovered ? 1 : 0, transition: "opacity 120ms" }}>
        <ArrowRightIcon />
      </span>
    </div>
  );
}

function HintKey({ label, desc }: { label: string; desc: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <span
        style={{
          background: "#F7F6F1",
          border: "1px solid #DDE2DE",
          borderRadius: "4px",
          padding: "2px 6px",
          fontSize: "10.5px",
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 600,
          color: "#17201D",
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: "11px", color: "#66716C", fontFamily: "'Manrope', sans-serif" }}>{desc}</span>
    </span>
  );
}
