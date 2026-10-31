"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Sparkles,
  BookOpen,
  DollarSign,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Plus,
  Circle,
  MoreVertical,
  GraduationCap,
  Award,
  Hash,
  X,
  Smile,
} from "lucide-react";
import { useRealtimeEvents } from "@/lib/realtime/useRealtimeEvents";

interface ScholarContact {
  id: string;
  name: string;
  role: string;
  institution: string;
  initials: string;
  avatarColor: string;
  isOnline: boolean;
  orcid: string;
  hIndex: number;
  sharedInterests: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ChatAttachment {
  type: "paper" | "opportunity" | "project_invite";
  title: string;
  subtitle: string;
  badge: string;
  link: string;
  metadata?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  time: string;
  isMe: boolean;
  status: "sent" | "delivered" | "read";
  attachment?: ChatAttachment;
}

const INITIAL_SCHOLARS: ScholarContact[] = [
  {
    id: "scholar-1",
    name: "Dr. Elena Vance",
    role: "Associate Professor of Bio-AI",
    institution: "Stanford University · Bio-X",
    initials: "EV",
    avatarColor: "#3E6248",
    isOnline: true,
    orcid: "0000-0002-1825-0097",
    hIndex: 34,
    sharedInterests: ["Multimodal MRI", "Foundation Models", "Clinical AI"],
    lastMessage: "I reviewed the proof for Theorem 3. The Horn-clause projection holds!",
    lastMessageTime: "10:42 AM",
    unreadCount: 2,
  },
  {
    id: "scholar-2",
    name: "Prof. Marcus Thorne",
    role: "Chair of Genomic Systems",
    institution: "Harvard Medical School",
    initials: "MT",
    avatarColor: "#173F35",
    isOnline: true,
    orcid: "0000-0001-9043-4412",
    hIndex: 58,
    sharedInterests: ["Structural Biology", "CRISPR Off-Target", "AlphaFold 3"],
    lastMessage: "We are finalizing the NIH R01 consortium application. Ready to join?",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
  },
  {
    id: "scholar-3",
    name: "Dr. Arjun Rao",
    role: "Senior Staff ML Scientist",
    institution: "IISc & Cambium ML Fellow",
    initials: "AR",
    avatarColor: "#4A6B8A",
    isOnline: false,
    orcid: "0000-0003-4418-9102",
    hIndex: 26,
    sharedInterests: ["Scientific NLP", "Low-Resource Benchmarks"],
    lastMessage: "Evaluation code is published. Let's run the cross-validation script.",
    lastMessageTime: "Oct 29",
    unreadCount: 0,
  },
  {
    id: "scholar-4",
    name: "Dr. Elena Rostova",
    role: "Postdoctoral Fellow in Geometric ML",
    institution: "University of Cambridge",
    initials: "ER",
    avatarColor: "#6B5A7A",
    isOnline: true,
    orcid: "0000-0002-7712-3091",
    hIndex: 19,
    sharedInterests: ["Graph Transformers", "Cellular Topology"],
    lastMessage: "The cellular graph invariants converge with linear memory complexity.",
    lastMessageTime: "Oct 28",
    unreadCount: 0,
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "scholar-1": [
    {
      id: "m-1",
      senderId: "scholar-1",
      senderName: "Dr. Elena Vance",
      content: "Hi Imthiyas, hope your dissertation chapter revisions are coming along well!",
      time: "10:30 AM",
      isMe: false,
      status: "read",
    },
    {
      id: "m-2",
      senderId: "me",
      senderName: "Imthiyas",
      content: "Thanks Elena! I just wrapped up the formal validation section for our neuro-symbolic projection operator.",
      time: "10:35 AM",
      isMe: true,
      status: "read",
    },
    {
      id: "m-3",
      senderId: "scholar-1",
      senderName: "Dr. Elena Vance",
      content: "Have you had a chance to audit this preprint on clinical MRI synthesis? The methodology is directly related to our validation pipeline:",
      time: "10:40 AM",
      isMe: false,
      status: "read",
      attachment: {
        type: "paper",
        title: "Foundation Models for Medical Image Understanding & Zero-Shot Clinical Synthesis",
        subtitle: "Nature Machine Intelligence · Elena Rodriguez et al. · 384 Citations",
        badge: "DOI: 10.1038/s42256-026-00812-4",
        link: "/agent-reader?doi=10.1038/s42256-026-00812-4",
        metadata: "Click to audit methodology and proofs with Agentic Reader",
      },
    },
    {
      id: "m-4",
      senderId: "scholar-1",
      senderName: "Dr. Elena Vance",
      content: "I reviewed the proof for Theorem 3. The Horn-clause projection holds!",
      time: "10:42 AM",
      isMe: false,
      status: "read",
    },
  ],
  "scholar-2": [
    {
      id: "m-201",
      senderId: "scholar-2",
      senderName: "Prof. Marcus Thorne",
      content: "Hello Imthiyas. We have an open Co-PI slot on our multi-institutional NIH award:",
      time: "Yesterday",
      isMe: false,
      status: "read",
      attachment: {
        type: "opportunity",
        title: "NIH R01 Targeted Nanoparticle Delivery for Epigenetic Silencing",
        subtitle: "National Institutes of Health · $2,500,000 Budget · 28 Days Left",
        badge: "Grant Opportunity",
        link: "/opportunities",
        metadata: "Eligible for Lead & Co-PI consortia",
      },
    },
    {
      id: "m-202",
      senderId: "scholar-2",
      senderName: "Prof. Marcus Thorne",
      content: "We are finalizing the NIH R01 consortium application. Ready to join?",
      time: "Yesterday",
      isMe: false,
      status: "read",
    },
  ],
};

export default function ScholarMessagesPage() {
  const [scholars, setScholars] = useState<ScholarContact[]>(INITIAL_SCHOLARS);
  const [activeScholarId, setActiveScholarId] = useState<string>("scholar-1");
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeScholar = scholars.find((s) => s.id === activeScholarId) || scholars[0];
  const activeConversation = messages[activeScholarId] || [];

  const { isSocketConnected, sendMessage } = useRealtimeEvents("direct_messages");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeScholarId, activeConversation.length]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSendMessage = (e?: React.FormEvent, attachment?: ChatAttachment) => {
    if (e) e.preventDefault();
    const content = inputContent.trim();
    if (!content && !attachment) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      senderName: "Imthiyas",
      content: content || (attachment ? `Shared ${attachment.badge}: ${attachment.title}` : ""),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      status: "sent",
      attachment,
    };

    setMessages((prev) => ({
      ...prev,
      [activeScholarId]: [...(prev[activeScholarId] || []), newMsg],
    }));

    setInputContent("");
    setShowAttachmentMenu(false);

    // Update last message in sidebar
    setScholars((prev) =>
      prev.map((s) =>
        s.id === activeScholarId
          ? {
              ...s,
              lastMessage: newMsg.content.slice(0, 55) + (newMsg.content.length > 55 ? "..." : ""),
              lastMessageTime: "Just now",
            }
          : s
      )
    );

    // Send through WebSocket real-time mesh
    sendMessage(newMsg.content, `dm:${activeScholarId}`);
    triggerToast("Message dispatched to scholar ✓");
  };

  const handleAttachPaper = () => {
    handleSendMessage(undefined, {
      type: "paper",
      title: "Neuro-Symbolic Deductive Inference Over Large Chemical Spaces",
      subtitle: "Nature Machine Intelligence · Imthiyas, Rodriguez, & Vance · 142 Citations",
      badge: "DOI: 10.1016/j.cels.2025.04.002",
      link: "/agent-reader?doi=10.1016/j.cels.2025.04.002",
      metadata: "Verified laboratory benchmark preprint",
    });
  };

  const handleAttachOpportunity = () => {
    handleSendMessage(undefined, {
      type: "opportunity",
      title: "NSF Cyberinfrastructure for Sustained Scientific Innovation (CSSI)",
      subtitle: "National Science Foundation · $600,000 Award · 42 Days Left",
      badge: "NSF Research Grant",
      link: "/opportunities",
      metadata: "Multi-investigator collaborative grant",
    });
  };

  const handleAttachProjectInvite = () => {
    handleSendMessage(undefined, {
      type: "project_invite",
      title: "Multimodal Biomolecular Complex Prediction Workspace",
      subtitle: "Role: Co-PI & Clinical Lead · 5 Active Members · Shared Vault",
      badge: "Project Workspace Invite",
      link: "/workspace",
      metadata: "Click to accept invitation and join repository",
    });
  };

  const filteredScholars = scholars.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sharedInterests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 min-w-0 h-screen overflow-hidden bg-[#FAF7F0] text-[#202920] font-sans flex flex-col">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-[#E4DCCB] bg-[#FAF7F0]/95 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#DCE6D7] border border-[#66866A]/30 text-[#3E6248]">
            <MessageSquare size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-normal text-[#202920] tracking-tight m-0">
                Scholar Direct Messaging Desk
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-medium border flex items-center gap-1.5 ${
                  isSocketConnected
                    ? "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/30"
                    : "bg-[#F2EBDD] text-[#85877B] border-[#E4DCCB]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSocketConnected ? "bg-[#3E6248] animate-pulse" : "bg-[#85877B]"
                  }`}
                />
                {isSocketConnected ? "Encrypted WebSocket Mesh Active" : "In-Memory Session"}
              </span>
            </div>
            <p className="text-xs text-[#62685E] font-sans mt-0.5">
              1-on-1 confidential scholar communication with line-level paper grounding & grant co-authorship.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/community"
            className="px-3 py-1.5 rounded-lg border border-[#E4DCCB] bg-white text-xs font-mono font-medium text-[#202920] hover:bg-[#FAF7F0] transition-colors"
          >
            ← Community Feed
          </Link>
          <Link
            href="/workspace"
            className="px-3 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#202920] text-white text-xs font-mono font-medium transition-colors"
          >
            Project Workspaces ↗
          </Link>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Column: Conversations Roster */}
        <div className="w-80 md:w-88 border-r border-[#E4DCCB] bg-white flex flex-col shrink-0">
          <div className="p-3.5 border-b border-[#E4DCCB] space-y-2.5">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85877B]"
                size={14}
              />
              <input
                type="text"
                placeholder="Search connected scholars, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E4DCCB] bg-[#FAF7F0] text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248]"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#62685E]">
              <span>Mutual Scholars ({scholars.length})</span>
              <span className="text-[#3E6248] font-semibold">2-Way Verified</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#E4DCCB]/50">
            {filteredScholars.map((scholar) => {
              const isSelected = scholar.id === activeScholarId;
              return (
                <button
                  key={scholar.id}
                  onClick={() => {
                    setActiveScholarId(scholar.id);
                    // Mark read
                    setScholars((prev) =>
                      prev.map((s) => (s.id === scholar.id ? { ...s, unreadCount: 0 } : s))
                    );
                  }}
                  className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected ? "bg-[#FAF7F0] border-l-4 border-l-[#3E6248]" : "hover:bg-[#FAF7F0]/60"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs"
                      style={{ backgroundColor: scholar.avatarColor }}
                    >
                      {scholar.initials}
                    </div>
                    {scholar.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4ADE80] border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#202920] truncate">
                        {scholar.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#85877B] shrink-0 ml-1">
                        {scholar.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#62685E] truncate mb-1">
                      {scholar.institution}
                    </p>
                    <p className="text-xs text-[#202920] truncate font-sans">
                      {scholar.lastMessage}
                    </p>
                  </div>

                  {scholar.unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#3E6248] text-white text-[10px] font-mono font-bold shrink-0">
                      {scholar.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: Active Conversation */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAF7F0]">
          {/* Conversation Header */}
          <div className="px-6 py-3 border-b border-[#E4DCCB] bg-white flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: activeScholar.avatarColor }}
              >
                {activeScholar.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#202920]">
                    {activeScholar.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/20">
                    ORCID: {activeScholar.orcid}
                  </span>
                </div>
                <p className="text-xs text-[#62685E]">
                  {activeScholar.role} · {activeScholar.institution}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#62685E] hidden sm:inline">
                h-index: <strong className="text-[#202920]">{activeScholar.hIndex}</strong>
              </span>
              <button
                onClick={() => triggerToast(`Profile dossier exported for ${activeScholar.name}`)}
                className="p-1.5 rounded-lg border border-[#E4DCCB] hover:bg-[#FAF7F0] text-[#62685E] cursor-pointer"
                title="Options"
              >
                <MoreVertical size={15} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono text-[#85877B] bg-[#F2EBDD] border border-[#E4DCCB]">
                Academic Encryption Active · CRediT Verified Connection
              </span>
            </div>

            {activeConversation.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[78%] md:max-w-[65%] rounded-2xl p-4 text-xs font-sans shadow-xs ${
                    msg.isMe
                      ? "bg-[#3E6248] text-white rounded-br-xs"
                      : "bg-white text-[#202920] border border-[#E4DCCB] rounded-bl-xs"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* Attachment Card if present */}
                  {msg.attachment && (
                    <div
                      className={`mt-3 p-3 rounded-xl border transition-all ${
                        msg.isMe
                          ? "bg-[#2A4633] border-white/20 text-white"
                          : "bg-[#FAF7F0] border-[#E4DCCB] text-[#202920]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {msg.attachment.type === "paper" && (
                          <BookOpen size={13} className="text-[#4ADE80]" />
                        )}
                        {msg.attachment.type === "opportunity" && (
                          <DollarSign size={13} className="text-[#D97706]" />
                        )}
                        {msg.attachment.type === "project_invite" && (
                          <Layers size={13} className="text-[#60A5FA]" />
                        )}
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80">
                          {msg.attachment.badge}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold mb-1 leading-snug">
                        {msg.attachment.title}
                      </h4>
                      <p className="text-[11px] opacity-80 mb-2 leading-relaxed">
                        {msg.attachment.subtitle}
                      </p>

                      <Link
                        href={msg.attachment.link}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                          msg.isMe
                            ? "bg-white text-[#202920] hover:bg-[#FAF7F0]"
                            : "bg-[#3E6248] text-white hover:bg-[#202920]"
                        }`}
                      >
                        {msg.attachment.type === "paper" && "Audit in Agentic Reader ↗"}
                        {msg.attachment.type === "opportunity" && "Inspect Grant Details ↗"}
                        {msg.attachment.type === "project_invite" && "Accept & Join Workspace ↗"}
                      </Link>
                    </div>
                  )}

                  <div
                    className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] font-mono opacity-70`}
                  >
                    <span>{msg.time}</span>
                    {msg.isMe && (
                      <span>
                        {msg.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer Dock */}
          <div className="p-4 bg-white border-t border-[#E4DCCB] shrink-0 relative">
            {/* Attachment Flyout Menu */}
            {showAttachmentMenu && (
              <div className="absolute bottom-18 left-6 z-30 bg-white border border-[#E4DCCB] rounded-xl shadow-xl p-2 w-72 space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#85877B] px-2.5 py-1 uppercase tracking-wider">
                  Attach Academic Artifact
                </div>
                <button
                  onClick={handleAttachPaper}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#FAF7F0] flex items-center gap-2.5 text-xs text-[#202920] cursor-pointer transition-colors"
                >
                  <BookOpen size={14} className="text-[#3E6248]" />
                  <div>
                    <div className="font-semibold">Research Preprint / Paper</div>
                    <div className="text-[10px] text-[#62685E]">Send verified DOI with abstract</div>
                  </div>
                </button>
                <button
                  onClick={handleAttachOpportunity}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#FAF7F0] flex items-center gap-2.5 text-xs text-[#202920] cursor-pointer transition-colors"
                >
                  <DollarSign size={14} className="text-[#D97706]" />
                  <div>
                    <div className="font-semibold">Grant / CFP Opportunity</div>
                    <div className="text-[10px] text-[#62685E]">Propose multi-PI co-application</div>
                  </div>
                </button>
                <button
                  onClick={handleAttachProjectInvite}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#FAF7F0] flex items-center gap-2.5 text-xs text-[#202920] cursor-pointer transition-colors"
                >
                  <Layers size={14} className="text-[#2563EB]" />
                  <div>
                    <div className="font-semibold">Collaborative Workspace Invite</div>
                    <div className="text-[10px] text-[#62685E]">Assign CRediT authorship role</div>
                  </div>
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  showAttachmentMenu
                    ? "bg-[#3E6248] text-white border-[#3E6248]"
                    : "border-[#E4DCCB] text-[#62685E] hover:bg-[#FAF7F0]"
                }`}
                title="Attach academic paper, grant, or project invite"
              >
                <Paperclip size={16} />
              </button>

              <input
                type="text"
                placeholder={`Message ${activeScholar.name} with paper grounding or proposal questions...`}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248] shadow-2xs"
              />

              <button
                type="submit"
                disabled={!inputContent.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#3E6248] hover:bg-[#202920] disabled:opacity-40 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Send size={13} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Scholar Context Dossier */}
        <div className="w-72 border-l border-[#E4DCCB] bg-white hidden xl:flex flex-col p-5 shrink-0 overflow-y-auto space-y-5">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center font-bold text-lg text-white shadow-sm mb-2.5"
              style={{ backgroundColor: activeScholar.avatarColor }}
            >
              {activeScholar.initials}
            </div>
            <h3 className="font-bold text-sm text-[#202920]">{activeScholar.name}</h3>
            <p className="text-xs text-[#62685E] mt-0.5">{activeScholar.role}</p>
            <p className="text-xs font-semibold text-[#3E6248] mt-0.5">
              {activeScholar.institution}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#62685E]">Verified ORCID:</span>
              <span className="font-mono font-semibold text-[#202920]">
                {activeScholar.orcid}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#62685E]">Citation H-Index:</span>
              <span className="font-mono font-bold text-[#3E6248]">
                {activeScholar.hIndex}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#62685E]">Network Status:</span>
              <span className="font-mono text-[#4ADE80] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                Connected
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#202920] mb-2 flex items-center gap-1.5">
              <GraduationCap size={14} className="text-[#3E6248]" />
              Shared Research Domains
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeScholar.sharedInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#DCE6D7]/60 text-[#3E6248] border border-[#66866A]/20"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E4DCCB]">
            <Link
              href="/portfolio"
              className="w-full py-2 rounded-lg border border-[#E4DCCB] hover:bg-[#FAF7F0] text-xs font-mono font-medium text-[#202920] flex items-center justify-center gap-1.5 transition-colors no-underline"
            >
              <ExternalLink size={12} />
              View Verified Academic CV
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#202920] text-[#FAF7F0] px-4 py-2.5 rounded-xl text-xs font-mono shadow-xl border border-white/10 flex items-center gap-2">
          <Sparkles size={14} className="text-[#4ADE80]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
