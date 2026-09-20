import { Search, Bell, MessageSquare } from "lucide-react";

export default function TopBar() {
  return (
    <header
      className="flex items-center gap-4 px-8"
      style={{
        height: 64,
        background: "#FFFFFF",
        borderBottom: "1px solid #DDE2DE",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Search */}
      <div className="flex-1 flex items-center gap-2 rounded-md px-3 py-2"
        style={{ background: "#F7F6F1", border: "1px solid #DDE2DE", maxWidth: "60%" }}
      >
        <Search size={15} style={{ color: "#66716C" }} strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search papers, people, topics…"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "#17201D", fontFamily: "'Manrope', sans-serif" }}
        />
        <span
          className="text-xs rounded px-1.5 py-0.5"
          style={{
            color: "#66716C",
            background: "#FFFFFF",
            border: "1px solid #DDE2DE",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          ⌘K
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button
          className="relative rounded-md p-2 transition-colors"
          style={{ color: "#66716C" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#F7F6F1")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
        >
          <Bell size={18} strokeWidth={1.5} />
          <span
            className="absolute top-1.5 right-1.5 rounded-full"
            style={{ width: 6, height: 6, background: "#173F35" }}
          />
        </button>

        {/* Messages */}
        <button
          className="relative rounded-md p-2 transition-colors"
          style={{ color: "#66716C" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#F7F6F1")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
        >
          <MessageSquare size={18} strokeWidth={1.5} />
          <span
            className="absolute top-1.5 right-1.5 rounded-full text-white flex items-center justify-center"
            style={{ width: 14, height: 14, background: "#173F35", fontSize: 8, fontWeight: 700 }}
          >
            3
          </span>
        </button>

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full text-sm font-semibold ml-1 cursor-pointer"
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
      </div>
    </header>
  );
}
