import {
  LayoutDashboard, BookOpen, FlaskConical, Users, FileText,
  Bookmark, Settings, Bell, ChevronRight
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "Research Feed", active: false },
  { icon: FlaskConical, label: "Experiments", active: false },
  { icon: Users, label: "Collaborators", active: false },
  { icon: FileText, label: "Publications", active: false },
  { icon: Bookmark, label: "Saved", active: false },
];

export default function Sidebar() {
  return (
    <aside
      className="flex flex-col h-screen sticky top-0"
      style={{
        width: 260,
        minWidth: 260,
        background: "#F7F6F1",
        borderRight: "1px solid #DDE2DE",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid #DDE2DE" }}>
        <span
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#173F35",
            letterSpacing: "-0.3px",
          }}
        >
          Cambium
        </span>
        <span
          style={{
            display: "block",
            fontSize: 10,
            color: "#66716C",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: 1,
            fontWeight: 500,
          }}
        >
          Research Platform
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col" style={{ gap: 2 }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#66716C",
            fontWeight: 600,
            padding: "4px 10px 8px",
          }}
        >
          Menu
        </p>
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left transition-colors"
            style={{
              background: active ? "#FFFFFF" : "transparent",
              color: active ? "#17201D" : "#66716C",
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              border: active ? "1px solid #DDE2DE" : "1px solid transparent",
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(221,226,222,0.45)";
            }}
            onMouseLeave={(e) => {
              if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <Icon size={16} strokeWidth={active ? 2 : 1.5} />
            {label}
            {active && (
              <ChevronRight size={12} className="ml-auto" style={{ color: "#66716C" }} />
            )}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{ borderTop: "1px solid #DDE2DE" }}
      >
        <div
          className="flex items-center justify-center rounded-full text-sm font-semibold flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: "#173F35",
            color: "#DCEBE4",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          MC
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: "#17201D" }}
          >
            Maya Chen
          </p>
          <p className="text-xs truncate" style={{ color: "#66716C" }}>
            PhD Researcher
          </p>
        </div>
        <button
          className="rounded-md p-1.5 transition-colors"
          style={{ color: "#66716C" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#DDE2DE")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
          }
        >
          <Settings size={15} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
