"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  Brain,
  Search,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Check,
  Bookmark,
  Sparkles,
  History,
  Users,
  Award,
  Layers,
  BookOpen,
  FileText,
  Clock,
  Share2,
  Filter,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode =
  | "Explore"
  | "Understand"
  | "Compare"
  | "Synthesize"
  | "Critique"
  | "Discover"
  | "Plan"
  | "Write";

type ContextOption =
  | "Entire Research World"
  | "Current Workspace"
  | "Current Project"
  | "Literature Review"
  | "Selected Papers"
  | "Notes"
  | "Experiments"
  | "Publications"
  | "Opportunities"
  | "Researchers";

type RightTab = "Sources" | "Insights" | "Graph";

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODES: { name: Mode; desc: string }[] = [
  { name: "Explore", desc: "Discover related concepts and research" },
  { name: "Understand", desc: "Explain a difficult paper or concept" },
  { name: "Compare", desc: "Compare methodologies, findings, or papers" },
  { name: "Synthesize", desc: "Combine evidence across literature" },
  { name: "Critique", desc: "Identify weaknesses, limitations, and assumptions" },
  { name: "Discover", desc: "Find papers, researchers, datasets, and opportunities" },
  { name: "Plan", desc: "Turn research findings into next steps" },
  { name: "Write", desc: "Structure research writing using existing context" },
];

const QUICK_ACTIONS = [
  "Summarize literature",
  "Find research gaps",
  "Compare papers",
  "Build literature map",
  "Find related papers",
  "Analyze methodology",
  "Generate research questions",
  "Find conflicting findings",
  "Find datasets",
  "Find collaborators",
  "Find relevant opportunities",
  "Suggest journals",
  "Suggest conferences",
];

const CONTEXT_OPTIONS: ContextOption[] = [
  "Entire Research World",
  "Current Workspace",
  "Current Project",
  "Literature Review",
  "Selected Papers",
  "Notes",
  "Experiments",
  "Publications",
  "Opportunities",
  "Researchers",
];

const SUGGESTED_PROMPTS = [
  "Which papers in my workspace disagree about federated learning?",
  "What are the major research gaps in low-resource medical imaging?",
  "Find papers related to my current segmentation project.",
  "Which conferences would be relevant to this research?",
];

const HISTORY = [
  "Research gaps in medical imaging",
  "Compare federated learning methods",
  "Find papers on multimodal clinical AI",
  "Potential MICCAI research directions",
  "Literature synthesis — segmentation",
];

const ANSWER_GAPS = [
  {
    num: "01",
    title: "Limited cross-domain validation",
    body: "Several studies evaluate models on a single dataset, making generalization difficult to establish.",
    sources: ["Imthiyas et al., 2024", "Park & Kim, 2025", "Nguyen et al., 2023"],
    label: "ANALYSIS",
  },
  {
    num: "02",
    title: "Limited evaluation under label scarcity",
    body: "Most approaches assume more labeled data than is available in low-resource clinical environments.",
    sources: ["Rodriguez et al., 2025", "Liu et al., 2024"],
    label: "POTENTIAL GAP",
  },
  {
    num: "03",
    title: "Privacy and distributed learning remain underexplored",
    body: "Federated approaches appear promising, but evaluation across heterogeneous clinical datasets remains limited.",
    sources: ["Patel & Singh, 2025", "Zhao et al., 2024"],
    label: "POTENTIAL GAP",
  },
];

const SOURCES_LIST = [
  {
    n: "[1]",
    title: "Foundation Models for Medical Image Understanding",
    authors: "Imthiyas et al.",
    year: "2026",
    reason: "Discusses segmentation under limited annotation budgets.",
    type: "Paper",
  },
  {
    n: "[2]",
    title: "Federated Learning for Clinical Imaging",
    authors: "Rodriguez, E. et al.",
    year: "2025",
    reason: "Covers federated evaluation across heterogeneous datasets.",
    type: "Paper",
  },
  {
    n: "[3]",
    title: "Low-Resource Medical Image Segmentation",
    authors: "Park, J. & Kim, S.",
    year: "2025",
    reason: "Directly matches your current project focus.",
    type: "Paper",
  },
  {
    n: "[4]",
    title: "Segmentation notes — Week 12",
    authors: "Imthiyas",
    year: "2026",
    reason: "Contains relevant observations from your literature review.",
    type: "Note",
  },
  {
    n: "[5]",
    title: "Experiment 02 — nnU-Net baseline",
    authors: "Imthiyas",
    year: "2026",
    reason: "Baseline segmentation experiment in your current workspace.",
    type: "Experiment",
  },
];

const INSIGHTS_LIST = [
  {
    tag: "Emerging topic",
    title: "Multimodal medical AI",
    body: "Interest has increased across several papers connected to your research.",
    type: "topic",
  },
  {
    tag: "Potential gap",
    title: "Federated evaluation under severe label scarcity",
    body: "Few studies compare federated approaches under extreme annotation constraints.",
    type: "gap",
  },
  {
    tag: "Related researcher",
    title: "Dr. Elena Rodriguez",
    body: "Works on federated learning and clinical imaging datasets.",
    type: "researcher",
  },
  {
    tag: "Relevant opportunity",
    title: "Early Career Research Fellowship",
    body: "Deadline in 6 weeks. Research focus aligns with your current project.",
    type: "opportunity",
  },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function ContextSelector({
  value,
  onChange,
}: {
  value: ContextOption;
  onChange: (v: ContextOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface-sunken border border-edge-default hover:border-moss-300 rounded-md text-xs font-medium text-moss-700 transition-colors shadow-xs"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-moss-700/70 text-[10px] font-bold tracking-wider uppercase">
          Context:
        </span>
        <span className="text-ink-primary font-semibold max-w-[280px] sm:max-w-[360px] truncate">
          {value === "Current Project"
            ? "Current Project — Low-Resource Medical Image Segmentation"
            : value}
        </span>
        <ChevronDown size={14} className={`text-moss-700 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+4px)] left-0 z-50 bg-surface-raised border border-edge-default rounded-lg shadow-elevation2 min-w-[280px] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150"
          role="listbox"
        >
          {CONTEXT_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={opt === value}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3 py-2 text-left text-xs transition-colors ${
                opt === value
                  ? "bg-moss-50 text-moss-700 font-semibold"
                  : "text-ink-secondary hover:bg-surface-sunken hover:text-ink-primary"
              }`}
            >
              <span>{opt}</span>
              {opt === value && <Check size={14} className="text-moss-700" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ModePicker({
  value,
  onChange,
}: {
  value: Mode;
  onChange: (v: Mode) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      {MODES.map((m) => (
        <button
          key={m.name}
          type="button"
          title={m.desc}
          onClick={() => onChange(m.name)}
          className={`px-3 py-1 rounded-full text-xs transition-all ${
            m.name === value
              ? "bg-moss-600 text-white font-medium shadow-xs border border-moss-600"
              : "bg-surface-raised border border-edge-default text-ink-secondary hover:border-moss-600/50 hover:text-ink-primary"
          }`}
        >
          {m.name}
        </button>
      ))}
    </div>
  );
}

function ResearchAnswer({ onSave }: { onSave: () => void }) {
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-wider text-moss-700 uppercase bg-moss-50 border border-moss-200/80 px-2 py-0.5 rounded-sm">
              ANALYSIS
            </span>
            <span className="text-xs text-ink-tertiary">
              Based on 18 papers in your current literature review
            </span>
          </div>
          <p className="text-[15px] text-ink-primary leading-relaxed">
            Three recurring gaps stand out in the literature on{" "}
            <strong className="text-ink-primary font-semibold">
              low-resource medical image segmentation
            </strong>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSaved(true);
            onSave();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all shadow-xs shrink-0 ${
            saved
              ? "bg-moss-50 border-moss-200 text-moss-700"
              : "bg-surface-raised border-edge-default text-ink-secondary hover:text-ink-primary hover:border-edge-strong"
          }`}
        >
          <Bookmark size={13} className={saved ? "fill-moss-700 text-moss-700" : ""} />
          {saved ? "Saved" : "Save insight"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {ANSWER_GAPS.map((gap, i) => {
          const isExp = expanded === i;
          return (
            <div
              key={i}
              className="border border-edge-default hover:border-edge-strong rounded-lg overflow-hidden bg-surface-raised transition-colors shadow-xs"
            >
              <div
                className="flex items-center gap-4 p-3.5 cursor-pointer select-none"
                onClick={() => setExpanded(isExp ? null : i)}
                role="button"
                aria-expanded={isExp}
                tabIndex={0}
                onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpanded(isExp ? null : i);
                  }
                }}
              >
                <span className="font-serif text-2xl text-ink-tertiary/60 shrink-0 leading-none">
                  {gap.num}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-semibold text-ink-primary">
                      {gap.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm ${
                        gap.label === "ANALYSIS"
                          ? "bg-moss-50 text-moss-700 border border-moss-200"
                          : "bg-amber-light text-amber border border-amber/20"
                      }`}
                    >
                      {gap.label}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className={`text-ink-tertiary transition-transform duration-200 ${
                    isExp ? "rotate-90" : ""
                  }`}
                />
              </div>

              {isExp && (
                <div className="px-4 pb-4 pt-1 border-t border-edge-default/60 ml-9 sm:ml-12">
                  <p className="text-[13.5px] text-ink-secondary leading-relaxed mb-3">
                    {gap.body}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-[11px] text-ink-tertiary font-medium">
                      Sources:
                    </span>
                    {gap.sources.map((s, j) => (
                      <span
                        key={j}
                        className="text-xs px-2 py-0.5 border border-edge-default rounded bg-surface-sunken text-ink-secondary hover:text-ink-primary hover:border-moss-300 transition-colors cursor-pointer"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap pt-1">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-2.5 py-1 border border-edge-default hover:border-edge-strong rounded-md text-xs font-medium text-ink-secondary hover:text-ink-primary bg-surface-base hover:bg-surface-sunken transition-colors"
                    >
                      <Plus size={12} /> Add to Workspace
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-2.5 py-1 border border-edge-default hover:border-edge-strong rounded-md text-xs font-medium text-ink-secondary hover:text-ink-primary bg-surface-base hover:bg-surface-sunken transition-colors"
                    >
                      <Sparkles size={12} className="text-moss-700" /> Create research question
                    </button>
                    <button
                      type="button"
                      onClick={onSave}
                      className="flex items-center gap-1.5 px-2.5 py-1 border border-edge-default hover:border-edge-strong rounded-md text-xs font-medium text-ink-secondary hover:text-ink-primary bg-surface-base hover:bg-surface-sunken transition-colors"
                    >
                      <Bookmark size={12} /> Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested next steps banner */}
      <div className="mt-4 p-3.5 bg-surface-sunken/70 rounded-lg border border-edge-default">
        <p className="text-xs text-ink-secondary mb-2.5">
          <span className="font-semibold text-ink-primary">Suggested next steps</span>{" "}
          based on these gaps:
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-edge-default hover:border-moss-300 rounded-md text-xs font-medium text-ink-primary bg-surface-raised hover:bg-surface-sunken transition-colors shadow-xs"
          >
            <Search size={12} className="text-moss-700" /> Explore related papers
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-edge-default hover:border-moss-300 rounded-md text-xs font-medium text-ink-primary bg-surface-raised hover:bg-surface-sunken transition-colors shadow-xs"
          >
            <Sparkles size={12} className="text-moss-700" /> Generate research questions
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-edge-default hover:border-moss-300 rounded-md text-xs font-medium text-ink-primary bg-surface-raised hover:bg-surface-sunken transition-colors shadow-xs"
          >
            <Users size={12} className="text-moss-700" /> Find collaborators
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-edge-default hover:border-moss-300 rounded-md text-xs font-medium text-ink-primary bg-surface-raised hover:bg-surface-sunken transition-colors shadow-xs"
          >
            <Award size={12} className="text-moss-700" /> Explore opportunities
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  const steps = [
    "Analyzing 18 papers...",
    "Connecting related research...",
    "Identifying research gaps...",
    "Finding supporting evidence...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, steps.length - 1)),
      750
    );
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 transition-opacity duration-300 ${
              i <= step ? "opacity-100" : "opacity-30"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                i < step
                  ? "bg-moss-600 border-moss-600 text-white"
                  : i === step
                  ? "border-moss-600 bg-moss-50"
                  : "border-edge-strong bg-transparent"
              }`}
            >
              {i < step ? (
                <Check size={12} />
              ) : i === step ? (
                <span className="w-2 h-2 rounded-full bg-moss-600 animate-pulse" />
              ) : null}
            </div>
            <span
              className={`text-sm ${
                i <= step ? "text-ink-primary font-medium" : "text-ink-tertiary"
              }`}
            >
              {s}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <div className="h-3.5 bg-edge-default/40 rounded animate-pulse w-[92%]" />
        <div className="h-3.5 bg-edge-default/40 rounded animate-pulse w-[78%]" />
        <div className="h-3.5 bg-edge-default/40 rounded animate-pulse w-[64%]" />
      </div>
    </div>
  );
}

function SourcesPanel() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs text-ink-tertiary mb-2">
        <span className="font-semibold text-ink-primary">5 sources</span> used in this answer
      </p>
      {SOURCES_LIST.map((s, i) => {
        const isSelected = active === i;
        return (
          <div
            key={i}
            onClick={() => setActive(isSelected ? null : i)}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              isSelected
                ? "bg-surface-sunken border-moss-300 shadow-xs"
                : "bg-surface-raised border-edge-default hover:border-edge-strong hover:bg-surface-sunken/40"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-[10px] font-bold text-moss-700 bg-moss-50 border border-moss-200 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                {s.n}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-ink-primary leading-snug mb-1">
                  {s.title}
                </div>
                <div className="text-[11px] text-ink-tertiary">
                  {s.authors} · {s.year} ·{" "}
                  <span className="text-moss-700 font-medium">{s.type}</span>
                </div>
                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-edge-default/60 animate-in fade-in duration-150">
                    <p className="text-xs text-ink-secondary italic border-l-2 border-moss-600 pl-2 py-0.5 mb-2.5 leading-relaxed">
                      {s.reason}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-[11px] px-2.5 py-1 border border-edge-default rounded bg-surface-raised hover:bg-surface-sunken text-ink-primary font-medium transition-colors"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        className="text-[11px] px-2.5 py-1 border border-edge-default rounded bg-surface-raised hover:bg-surface-sunken text-ink-primary font-medium transition-colors"
                      >
                        Cite
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InsightsPanel() {
  const tagColors: Record<string, { bg: string; text: string; border: string }> = {
    "Emerging topic": { bg: "bg-moss-50", text: "text-moss-700", border: "border-moss-200" },
    "Potential gap": { bg: "bg-amber-light", text: "text-amber", border: "border-amber/20" },
    "Related researcher": { bg: "bg-iris-light", text: "text-iris", border: "border-iris/20" },
    "Relevant opportunity": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  };

  return (
    <div className="space-y-2.5">
      {INSIGHTS_LIST.map((ins, i) => {
        const conf = tagColors[ins.tag] || {
          bg: "bg-surface-sunken",
          text: "text-ink-secondary",
          border: "border-edge-default",
        };
        return (
          <div
            key={i}
            className="p-3 rounded-lg border border-edge-default hover:border-edge-strong bg-surface-raised transition-colors shadow-xs"
          >
            <span
              className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm border ${conf.bg} ${conf.text} ${conf.border}`}
            >
              {ins.tag}
            </span>
            <div className="text-xs font-semibold text-ink-primary mt-2 mb-1">
              {ins.title}
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed mb-2.5">
              {ins.body}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-[11px] px-2.5 py-0.5 border border-edge-default rounded bg-surface-base hover:bg-surface-sunken text-ink-secondary hover:text-ink-primary transition-colors font-medium"
              >
                Save
              </button>
              <button
                type="button"
                className="text-[11px] px-2.5 py-0.5 border border-edge-default rounded bg-surface-base hover:bg-surface-sunken text-ink-secondary hover:text-ink-primary transition-colors font-medium"
              >
                Explore
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResearchGraph() {
  const nodes = [
    { label: "Research Question", x: 125, y: 24, primary: true },
    { label: "Low-resource segmentation", x: 125, y: 88 },
    { label: "Federated Learning", x: 48, y: 154 },
    { label: "Clinical AI", x: 202, y: 154 },
    { label: "Foundation Models", x: 48, y: 220 },
    { label: "Dr. E. Rodriguez", x: 202, y: 220 },
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
  ];

  return (
    <div className="relative h-[260px] w-full select-none">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y + 12}
            x2={nodes[b].x}
            y2={nodes[b].y + 12}
            stroke="var(--color-edge-default)"
            strokeWidth="1.5"
            strokeDasharray={a === 0 ? "none" : "3,3"}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <div
          key={i}
          style={{ left: n.x - 58, top: n.y }}
          className={`absolute w-[116px] rounded-md px-1.5 py-1 text-[10.5px] text-center truncate cursor-default transition-all shadow-xs ${
            n.primary
              ? "bg-moss-600 text-white font-semibold border border-moss-600"
              : "bg-surface-raised border border-edge-default text-ink-primary hover:border-moss-600 hover:bg-moss-50"
          }`}
          title={n.label}
        >
          {n.label}
        </div>
      ))}
    </div>
  );
}

// ─── Main Screen Component ───────────────────────────────────────────────────

export default function ResearchIntelligencePage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("Explore");
  const [context, setContext] = useState<ContextOption>("Current Project");
  const [rightTab, setRightTab] = useState<RightTab>("Sources");
  const [savedToast, setSavedToast] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setSubmitted(false);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2800);
  };

  const handleQuickAction = (action: string) => {
    const map: Record<string, string> = {
      "Find research gaps":
        "What are the main research gaps in low-resource medical image segmentation?",
      "Summarize literature":
        "Summarize the key themes across my current literature review.",
      "Compare papers":
        "Compare the methodologies used in my top 3 segmentation papers.",
      "Generate research questions":
        "Generate new research questions based on my current project.",
      "Find collaborators":
        "Find researchers working on federated learning for clinical imaging.",
    };
    setQuery(map[action] || `${action} across my current research.`);
    textareaRef.current?.focus();
  };

  const filteredHistory = HISTORY.filter((h) =>
    h.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden bg-surface-base text-ink-primary font-sans select-none">
      {/* ── Screen Header ── */}
      <header className="px-6 py-5 border-b border-edge-default bg-surface-base shrink-0">
        <div className="mb-3">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7] border border-[#66866A]/30 text-[#3E6248] text-xs font-mono font-bold tracking-wide">
              <Sparkles size={13} className="text-[#3E6248]" />
              <span>POWERED BY CAMBIUM AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#66866A] animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#62685E]">
              <span className="w-2 h-2 rounded-full bg-[#3E6248]" />
              <span>Cambium AI Cognitive Core · Active</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-[35px] font-normal tracking-[-0.02em] text-[#202920] leading-tight mb-2">
            Think with your research <span className="italic text-[#3E6248]">world.</span>
          </h1>
          <p className="text-sm text-[#62685E] max-w-2xl font-sans">
            Cambium AI reasons over your private literature corpus, connects latent hypotheses, and investigates cross-domain discoveries.
          </p>
        </div>

        {/* Workspace statistics pill indicators */}
        <div className="flex items-center gap-4 flex-wrap pt-1">
          {[
            ["24", "papers"],
            ["18", "notes"],
            ["3", "experiments"],
            ["2", "datasets"],
            ["1", "active draft"],
          ].map(([n, l]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-ink-primary">{n}</span>
              <span className="text-ink-tertiary">{l}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Main Workspace Body: Canvas + Right Rail ── */}
      <div className="flex-1 min-w-0 flex overflow-hidden">
        {/* Left: Interactive Canvas */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
            {/* Context & Mode selector row */}
            <div className="flex items-center justify-between flex-wrap gap-2.5 pb-1">
              <ContextSelector value={context} onChange={setContext} />
              <ModePicker value={mode} onChange={setMode} />
            </div>

            {/* Query Input Box with Keyboard Shortcut */}
            <div className="border border-edge-strong/80 focus-within:border-moss-600 focus-within:ring-2 focus-within:ring-moss-600/10 rounded-lg bg-surface-raised shadow-xs transition-all overflow-hidden">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Ask anything about your research..."
                rows={3}
                className="w-full px-4 py-3.5 border-none outline-none text-[14.5px] text-ink-primary bg-transparent resize-none leading-relaxed font-sans placeholder:text-ink-tertiary"
                aria-label="Research query input"
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-edge-default bg-surface-sunken/40">
                <span className="text-[11px] text-ink-tertiary">
                  ⌘ + Enter to submit
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!query.trim() || loading}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all shadow-xs ${
                    query.trim() && !loading
                      ? "bg-moss-600 hover:bg-moss-700 text-white cursor-pointer"
                      : "bg-edge-default text-ink-tertiary cursor-not-allowed"
                  }`}
                  aria-label="Submit research query"
                >
                  <ArrowUp size={13} />
                  Research
                </button>
              </div>
            </div>

            {/* Quick Actions Chips */}
            {!submitted && !loading && (
              <div>
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-ink-tertiary mb-2">
                  Quick actions
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => handleQuickAction(a)}
                      className="px-2.5 py-1 rounded border border-edge-default hover:border-moss-300 hover:text-moss-700 bg-surface-raised hover:bg-surface-sunken text-xs text-ink-secondary transition-colors"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Prompts Empty State */}
            {!submitted && !loading && (
              <div className="pt-2">
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-ink-tertiary mb-2">
                  Suggested
                </div>
                <div className="flex flex-col gap-2">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setQuery(p);
                        textareaRef.current?.focus();
                      }}
                      className="flex items-center gap-2.5 text-left p-3 rounded-lg border border-edge-default hover:border-edge-strong bg-surface-raised hover:bg-surface-sunken text-xs sm:text-[13px] text-ink-primary transition-all shadow-xs group"
                    >
                      <Search
                        size={14}
                        className="text-ink-tertiary group-hover:text-moss-700 shrink-0 transition-colors"
                      />
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Simulation */}
            {loading && <LoadingState />}

            {/* Submitted Answer State */}
            {submitted && (
              <div className="space-y-4">
                <div className="p-3.5 bg-surface-sunken/80 rounded-lg border border-edge-default">
                  <div className="text-[10px] font-bold tracking-wider text-ink-tertiary uppercase mb-1">
                    Your question
                  </div>
                  <p className="text-sm font-medium text-ink-primary">
                    {query}
                  </p>
                </div>
                <ResearchAnswer
                  onSave={() => {
                    setSavedToast(true);
                    setTimeout(() => setSavedToast(false), 2400);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Rail: Sources / Insights / Graph */}
        <aside
          className="w-[280px] sm:w-[300px] min-w-[280px] sm:min-w-[300px] border-l border-edge-default flex flex-col bg-surface-base overflow-hidden shrink-0"
          aria-label="Intelligence rail"
        >
          {/* Rail Tabs */}
          <div className="flex border-b border-edge-default shrink-0 bg-surface-sunken/30">
            {(["Sources", "Insights", "Graph"] as RightTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRightTab(tab)}
                className={`flex-1 py-2.5 text-xs text-center transition-all ${
                  rightTab === tab
                    ? "font-semibold text-ink-primary border-b-2 border-moss-600 bg-surface-base"
                    : "font-normal text-ink-tertiary hover:text-ink-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Recent Sessions Filter */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-ink-tertiary">
                <History size={13} />
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  Recent sessions
                </span>
              </div>
              <div className="relative mb-2">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary"
                />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search sessions..."
                  className="w-full pl-7 pr-2.5 py-1 text-xs rounded border border-edge-default bg-surface-raised text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-moss-600 transition-colors"
                />
              </div>
              <div className="space-y-0.5">
                {filteredHistory.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(h);
                      handleSubmit();
                    }}
                    className="block w-full text-left px-2 py-1 rounded text-xs text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken truncate transition-colors"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-edge-default" />

            {/* Tab Body */}
            {rightTab === "Sources" &&
              (submitted ? (
                <SourcesPanel />
              ) : (
                <p className="text-xs text-ink-tertiary italic">
                  Sources will appear after your first research query.
                </p>
              ))}

            {rightTab === "Insights" && <InsightsPanel />}

            {rightTab === "Graph" && (
              <div>
                <div className="text-xs text-ink-tertiary mb-2">
                  Knowledge connections for your query.
                </div>
                {submitted ? (
                  <ResearchGraph />
                ) : (
                  <div>
                    <ResearchGraph />
                    <p className="text-[11px] text-ink-tertiary italic mt-2 text-center">
                      Interactive preview. Refines with each active research query.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contextual Intelligence Footer */}
          <div className="border-t border-edge-default p-3.5 bg-surface-sunken/40 shrink-0">
            <div className="text-[10px] font-bold tracking-wider uppercase text-ink-tertiary mb-2">
              Context
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-ink-secondary">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-600 mt-1.5 shrink-0" />
                <span>Connected to your current project</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-600 mt-1.5 shrink-0" />
                <span>Based on 18 papers in your workspace</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full border border-amber bg-amber/20 mt-1.5 shrink-0" />
                <span>Potential collaborator identified</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink-primary text-surface-raised px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 shadow-elevation3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check size={14} className="text-moss-500" />
          Insight saved to Workspace
        </div>
      )}
    </div>
  );
}
