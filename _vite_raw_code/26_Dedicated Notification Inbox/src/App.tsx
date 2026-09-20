import { useState } from "react";

type Tab = "All" | "Unread" | "Mentions" | "System";

interface Notification {
  id: number;
  read: boolean;
  type: "collaboration" | "system";
  avatar?: string;
  avatarInitials?: string;
  avatarBg?: string;
  icon?: React.ReactNode;
  text: React.ReactNode;
  timestamp: string;
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3.5 3.5L13 4.5" stroke="#173F35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l2.4 7.6H22l-6.5 4.7 2.5 7.7L12 17.3 6 22l2.5-7.7L2 9.6h7.6L12 2z" fill="#173F35" />
  </svg>
);

const initialNotifications: Notification[] = [
  {
    id: 1,
    read: false,
    type: "collaboration",
    avatarInitials: "EP",
    avatarBg: "#DCEBE4",
    text: (
      <span>
        <strong className="font-semibold text-[#17201D]">Dr. Elena Park</strong>{" "}
        <span className="text-[#66716C]">commented on</span>{" "}
        <strong className="font-semibold text-[#17201D]">Foundation Models in Healthcare</strong>
        <span className="text-[#66716C]">.</span>
      </span>
    ),
    timestamp: "2m ago",
  },
  {
    id: 2,
    read: false,
    type: "system",
    icon: <SparkleIcon />,
    text: (
      <span>
        <span className="text-[#66716C]">New grant match:</span>{" "}
        <strong className="font-semibold text-[#17201D]">NSF AI Research Fellowship</strong>
        <span className="text-[#66716C]">.</span>
      </span>
    ),
    timestamp: "1h ago",
  },
  {
    id: 3,
    read: true,
    type: "collaboration",
    avatarInitials: "AR",
    avatarBg: "#E8E4F0",
    text: (
      <span>
        <strong className="font-semibold text-[#17201D]">Dr. Arjun Rao</strong>{" "}
        <span className="text-[#66716C]">accepted your collaboration request.</span>
      </span>
    ),
    timestamp: "Yesterday",
  },
];

function NotificationRow({
  notif,
  onMarkRead,
}: {
  notif: Notification;
  onMarkRead: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex items-start gap-3 px-5 py-4 border-b border-[#DDE2DE] cursor-pointer group"
      style={{
        backgroundColor: hovered ? "#F7F6F1" : notif.read ? "#FFFFFF" : "#F7F6F1",
        transition: "background-color 180ms ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onMarkRead(notif.id)}
    >
      {/* Unread dot */}
      <div className="flex items-center self-stretch w-3 shrink-0 pt-0.5">
        {!notif.read && (
          <span
            className="w-2 h-2 rounded-full bg-[#173F35] shrink-0"
            style={{ marginTop: "6px" }}
          />
        )}
      </div>

      {/* Avatar or Icon */}
      {notif.type === "collaboration" ? (
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-[#173F35]"
          style={{ backgroundColor: notif.avatarBg }}
        >
          {notif.avatarInitials}
        </div>
      ) : (
        <div className="w-9 h-9 rounded-lg bg-[#DCEBE4] flex items-center justify-center shrink-0">
          {notif.icon}
        </div>
      )}

      {/* Text content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm leading-relaxed">{notif.text}</p>
        <span className="text-xs text-[#66716C] mt-1 block">{notif.timestamp}</span>
      </div>

      {/* Hover check action */}
      <div
        className="flex items-center self-center ml-2 shrink-0"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0.8)",
          transition: "opacity 150ms ease, transform 150ms ease",
        }}
        title="Mark as read"
      >
        <div className="w-7 h-7 rounded-md bg-[#DCEBE4] flex items-center justify-center hover:bg-[#c6dfd4] transition-colors">
          <CheckIcon />
        </div>
      </div>
    </div>
  );
}

const TABS: Tab[] = ["All", "Unread", "Mentions", "System"];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return !n.read;
    if (activeTab === "Mentions") return n.type === "collaboration";
    if (activeTab === "System") return n.type === "system";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F7F6F1] flex justify-center">
      <div
        className="w-full max-w-3xl bg-white min-h-screen"
        style={{ borderLeft: "1px solid #DDE2DE", borderRight: "1px solid #DDE2DE" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-8 pb-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#17201D] tracking-tight">Inbox</h2>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold bg-[#173F35] text-white rounded-full px-2 py-0.5 leading-none">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={markAllRead}
            className="text-sm text-[#66716C] hover:text-[#17201D] transition-colors duration-150 font-medium"
          >
            Mark all as read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-0 px-6 mt-5 border-b border-[#DDE2DE]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-4 py-2.5 text-sm font-medium transition-colors duration-150"
                style={{
                  color: isActive ? "#173F35" : "#66716C",
                  borderBottom: isActive ? "2px solid #173F35" : "2px solid transparent",
                  marginBottom: "-1px",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Notification List */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#66716C]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-40">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#66716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium">All caught up</p>
              <p className="text-xs mt-1 opacity-70">No notifications here.</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <NotificationRow key={notif.id} notif={notif} onMarkRead={markRead} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
