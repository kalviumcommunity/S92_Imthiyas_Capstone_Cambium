"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactiveNullState } from "@/components/ui/reactive-null-state";
import { useRouter } from "next/navigation";

type Tab = "All" | "Unread" | "Mentions" | "System";

interface NotificationItem {
  id: number;
  read: boolean;
  type: "collaboration" | "system";
  title: string;
  sender?: string;
  senderRole?: string;
  avatarInitials?: string;
  avatarBg?: string;
  icon?: React.ReactNode;
  summary: React.ReactNode;
  timestamp: string;
  dateStr: string;
  body: string;
  category: string;
  actionLabel?: string;
  actionHref?: string;
}

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l2.4 7.6H22l-6.5 4.7 2.5 7.7L12 17.3 6 22l2.5-7.7L2 9.6h7.6L12 2z" fill="#3E6248" />
  </svg>
);

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    read: false,
    type: "collaboration",
    category: "Peer Commentary",
    title: "Comment on Foundation Models in Healthcare",
    sender: "Dr. Elena Park",
    senderRole: "Stanford Medicine · Lead AI Fellow",
    avatarInitials: "EP",
    avatarBg: "bg-[#DCE6D7] text-[#3E6248]",
    summary: (
      <span className="font-sans">
        <strong className="font-semibold text-[#202920]">Dr. Elena Park</strong>{" "}
        <span className="text-[#62685E]">commented on</span>{" "}
        <strong className="font-semibold text-[#202920]">Foundation Models in Healthcare</strong>
        <span className="text-[#62685E]">.</span>
      </span>
    ),
    timestamp: "2m ago",
    dateStr: "Today, 1:04 PM",
    body: "I reviewed your draft on Section 3.4 (Domain shift resistance across clinical imaging benchmarks). The comparison table on page 14 is exceptionally well-structured and aligns with our multi-center cohort findings. Could we schedule a brief 15-minute sync to finalize the multi-institutional validation protocol before the preprint release on Thursday?",
    actionLabel: "View Draft in Workspace",
    actionHref: "/workspace",
  },
  {
    id: 2,
    read: false,
    type: "system",
    category: "Opportunity Match",
    title: "NSF AI Research Fellowship (98.4% Match)",
    sender: "Cambium Opportunity Engine",
    senderRole: "Automated Scholarly Matching",
    icon: <SparkleIcon />,
    summary: (
      <span className="font-sans">
        <span className="text-[#62685E]">New grant match:</span>{" "}
        <strong className="font-semibold text-[#202920]">NSF AI Research Fellowship</strong>
        <span className="text-[#62685E]">.</span>
      </span>
    ),
    timestamp: "1h ago",
    dateStr: "Today, 12:15 PM",
    body: "Your research vector has been matched with 98.4% relevance to the NSF AI Research Fellowship 2026. The committee seeks interdisciplinary inquiries combining federated architectures with healthcare reproducibility. Award funding: $175,000/yr for 3 years. Application closes in 42 days.",
    actionLabel: "Inspect in Opportunity Hub",
    actionHref: "/opportunities",
  },
  {
    id: 3,
    read: true,
    type: "collaboration",
    category: "Co-Author Invitation",
    title: "Collaboration Accepted",
    sender: "Dr. Arjun Rao",
    senderRole: "Max Planck Institute · Associate PI",
    avatarInitials: "AR",
    avatarBg: "bg-[#F2EBDD] text-[#8A5A12]",
    summary: (
      <span className="font-sans">
        <strong className="font-semibold text-[#202920]">Dr. Arjun Rao</strong>{" "}
        <span className="text-[#62685E]">accepted your collaboration request.</span>
      </span>
    ),
    timestamp: "Yesterday",
    dateStr: "Oct 3, 2026 · 4:40 PM",
    body: "Dr. Arjun Rao accepted your co-authorship invitation on 'Neuro-symbolic Clinical Synthesis'. Shared citation graphs, draft notes, and experiment telemetry are now synchronized between your workspaces.",
    actionLabel: "Open Co-Author Space",
    actionHref: "/workspace",
  },
  {
    id: 4,
    read: true,
    type: "system",
    category: "DOI Minting",
    title: "DOI Minted: 10.1038/CAMBIUM-2026.04",
    sender: "Crossref & Cambium Registrar",
    senderRole: "Permanent Record System",
    icon: <SparkleIcon />,
    summary: (
      <span className="font-sans">
        <span className="text-[#62685E]">Permanent identifier registered:</span>{" "}
        <strong className="font-semibold text-[#202920]">10.1038/CAMBIUM-2026.04</strong>
      </span>
    ),
    timestamp: "2d ago",
    dateStr: "Oct 2, 2026 · 9:18 AM",
    body: "Your preprint 'Synthetic Biological Computation' has received its canonical DOI. Metadata records have been registered across Crossref, PubMed Central, and OpenAlex. Citation tracking is actively monitoring incoming references.",
    actionLabel: "View in Publications Matrix",
    actionHref: "/publications",
  },
];

function NotificationCard({
  notif,
  onSelect,
  onMarkRead,
}: {
  notif: NotificationItem;
  onSelect: (notif: NotificationItem) => void;
  onMarkRead: (e: React.MouseEvent, id: number) => void;
}) {
  return (
    <article
      onClick={() => onSelect(notif)}
      className={cn(
        "relative rounded-2xl p-6 sm:p-7 border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md group",
        notif.read
          ? "bg-white border-[#E4DCCB] hover:border-[#66866A]"
          : "bg-white border-[#66866A] ring-1 ring-[#3E6248]/15 border-l-[6px] border-l-[#3E6248]"
      )}
    >
      {/* Top Header Row with Avatar, Sender, Category Pill, Timestamp & Mark Read Action */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar (44px) */}
          <div className="shrink-0">
            {notif.type === "collaboration" ? (
              <div
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold font-sans shadow-2xs border border-[#E4DCCB]",
                  notif.avatarBg
                )}
              >
                {notif.avatarInitials}
              </div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#DCE6D7] border border-[#66866A]/30 flex items-center justify-center text-[#3E6248] shadow-2xs">
                {notif.icon}
              </div>
            )}
          </div>

          {/* Sender & Role */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-[#202920] font-sans truncate">
                {notif.sender || "Cambium Research"}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#F2EBDD] text-[#3E6248] border border-[#E4DCCB] uppercase tracking-wider font-semibold">
                {notif.category}
              </span>
              {!notif.read && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#3E6248] bg-[#DCE6D7] px-2 py-0.5 rounded-full border border-[#66866A]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] animate-pulse" />
                  New
                </span>
              )}
            </div>
            <div className="text-xs text-[#85877B] font-sans mt-0.5 truncate">
              {notif.senderRole} · {notif.timestamp}
            </div>
          </div>
        </div>

        {/* Action Button: Mark as read/unread */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={(e) => onMarkRead(e, notif.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-1.5 cursor-pointer border",
              notif.read
                ? "bg-[#FAF7F0] border-[#E4DCCB] text-[#62685E] hover:bg-[#DCE6D7] hover:text-[#3E6248]"
                : "bg-[#DCE6D7] border-[#66866A]/40 text-[#3E6248] hover:bg-[#3E6248] hover:text-white"
            )}
            title={notif.read ? "Mark as unread" : "Mark as read"}
          >
            <Check size={13} strokeWidth={2.5} />
            <span className="hidden sm:inline">{notif.read ? "Read" : "Mark read"}</span>
          </button>
        </div>
      </div>

      {/* Main Subject & Headline */}
      <h3 className="font-serif text-lg sm:text-[19px] font-semibold text-[#202920] leading-snug mb-2 group-hover:text-[#3E6248] transition-colors">
        {notif.title}
      </h3>

      {/* Spacious Message Excerpt */}
      <p className="text-sm text-[#62685E] font-sans leading-relaxed mb-4 line-clamp-2">
        {notif.body}
      </p>

      {/* Card Footer with Direct Action and Timestamp Details */}
      <div className="flex items-center justify-between pt-3.5 border-t border-[#E4DCCB]/60 text-xs text-[#85877B] font-sans flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span>{notif.dateStr}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#3E6248] font-semibold text-xs group-hover:underline flex items-center gap-1">
            <span>Read full dispatch</span>
            <span>→</span>
          </span>
        </div>
      </div>
    </article>
  );
}

const TABS: Tab[] = ["All", "Unread", "Mentions", "System"];

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [previewNullState, setPreviewNullState] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleMarkRead = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleSelect = (notif: NotificationItem) => {
    // Automatically mark read when opened
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setSelectedNotif({ ...notif, read: true });
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
    <div className="flex-1 min-h-screen overflow-y-auto bg-[#FAF7F0] font-sans p-6 sm:p-10 pb-24">
      <div className="w-full max-w-4xl mx-auto space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-[34px] sm:text-[40px] md:text-[42px] font-normal tracking-[-0.02em] text-[#202920] m-0">
              Research <span className="italic text-[#3E6248]">Inbox</span>
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/30 rounded-full px-2.5 py-0.5 leading-none font-mono">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewNullState(!previewNullState)}
              className={cn(
                "text-xs px-3.5 py-2 rounded-full font-mono uppercase tracking-wider transition-all cursor-pointer border flex items-center gap-1.5 shadow-2xs",
                previewNullState
                  ? "bg-[#3E6248] text-white border-[#3E6248]"
                  : "bg-white text-[#3E6248] border-[#3E6248]/50 hover:bg-[#FAF7F0]"
              )}
            >
              <span>{previewNullState ? "Show Active Stream (4)" : "Preview 3D Null State"}</span>
            </button>
            <button
              onClick={markAllRead}
              className="text-xs text-[#62685E] hover:text-[#202920] transition-colors font-medium font-sans bg-white border border-[#E4DCCB] hover:bg-[#F2EBDD] px-4 py-2 rounded-full cursor-pointer shadow-2xs"
            >
              Mark all as read
            </button>
          </div>
        </div>

        {/* Filter Tabs Bar (Spacious) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-xs font-medium transition-all font-sans rounded-xl cursor-pointer",
                  isActive
                    ? "text-[#202920] font-semibold bg-[#FAF7F0] border border-[#E4DCCB] shadow-2xs text-[#3E6248]"
                    : "text-[#85877B] hover:text-[#202920] hover:bg-[#FAF7F0]/60"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Spacious Notification Card Boxes (Gap & Padding) */}
        <div className="space-y-4">
          {previewNullState || filtered.length === 0 ? (
            <div className="bg-white border border-[#E4DCCB] rounded-3xl overflow-hidden p-3 shadow-xs">
              <ReactiveNullState
                title={previewNullState ? "Zero Active Notifications (Clean Stream)" : "No active notifications in this stream"}
                description={previewNullState ? "You are experiencing the Cambium Reactive 3D Null State. Move your cursor across the card to engage perspective physics and specular light." : "All scholarly peer commentary, citation alerts, and grant milestones have been reviewed or cleared."}
                actionLabel={previewNullState ? "Restore Active Stream" : "Explore Frontier Opportunities"}
                onAction={() => {
                  if (previewNullState) {
                    setPreviewNullState(false);
                  } else {
                    router.push("/opportunities");
                  }
                }}
              />
            </div>
          ) : (
            filtered.map((notif) => (
              <NotificationCard
                key={notif.id}
                notif={notif}
                onSelect={handleSelect}
                onMarkRead={toggleMarkRead}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── Scholarly Message Detail Modal (40% - 60% of Screen) ─── */}
      {selectedNotif && (
        <div
          className="fixed inset-0 z-50 bg-[#202920]/45 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedNotif(null)}
        >
          <div
            className="w-full max-w-[560px] md:max-w-[640px] bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all"
            style={{ width: "min(92vw, 620px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4DCCB] bg-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3E6248]" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E6248]">
                  {selectedNotif.category}
                </span>
                <span className="text-[#85877B] text-xs">·</span>
                <span className="font-mono text-xs text-[#85877B]">
                  {selectedNotif.dateStr}
                </span>
              </div>
              <button
                onClick={() => setSelectedNotif(null)}
                className="w-8 h-8 rounded-full border border-[#E4DCCB] flex items-center justify-center text-[#62685E] hover:text-[#202920] hover:bg-[#F2EBDD] transition-colors cursor-pointer text-sm font-semibold"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5 overflow-y-auto max-h-[70vh]">
              {/* Sender Block */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#E4DCCB]">
                {selectedNotif.type === "collaboration" ? (
                  <div className={cn("w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold font-sans", selectedNotif.avatarBg)}>
                    {selectedNotif.avatarInitials}
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-[#DCE6D7] flex items-center justify-center shrink-0 text-[#3E6248]">
                    {selectedNotif.icon}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-[#202920] font-sans">
                    {selectedNotif.sender || "System Dispatch"}
                  </h3>
                  <p className="text-xs text-[#85877B] font-mono">
                    {selectedNotif.senderRole || "Cambium Research Operating System"}
                  </p>
                </div>
              </div>

              {/* Message Title */}
              <div>
                <h2 className="font-serif text-2xl font-normal text-[#202920] leading-snug">
                  {selectedNotif.title}
                </h2>
              </div>

              {/* Message Body Content */}
              <div className="bg-white rounded-xl p-5 border border-[#E4DCCB] shadow-2xs">
                <p className="text-sm leading-relaxed text-[#202920] font-sans whitespace-pre-line">
                  {selectedNotif.body}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-[#85877B]">
                  Verified Record · Cambium SSOT
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedNotif(null)}
                    className="px-4 py-2 text-xs font-medium text-[#62685E] hover:text-[#202920] bg-white border border-[#E4DCCB] hover:bg-[#F2EBDD] rounded-lg transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                  {selectedNotif.actionHref && (
                    <a
                      href={selectedNotif.actionHref}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#3E6248] hover:bg-[#202920] rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer no-underline"
                    >
                      <span>{selectedNotif.actionLabel || "Open Record"}</span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
