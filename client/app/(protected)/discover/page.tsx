"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Compass,
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Bookmark,
  Settings,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Share2,
  Check,
  ChevronDown,
  X,
  Clock,
  Search,
} from "lucide-react";
import { BooleanQueryBuilder } from "@/components/ui/boolean-query-builder";

// ─── Design tokens (SSOT: Cambium Master Living Materials System) ─────────────
const C = {
  // Master Four Living Materials
  mineralSand: "#F2EBDD",
  livingAlgae: "#66866A",
  rootwood: "#805B43",
  forestInk: "#202920",

  // Extended Color System
  parchment: "#FAF7F0",
  limestone: "#E4DCCB",
  sageMist: "#DCE6D7",
  canopy: "#3E6248",
  deepMoss: "#293E30",
  barkGrey: "#62685E",
  quietStone: "#85877B",
  surfaceRaised: "#FFFFFF",
  amberBorder: "#E2C898",
  amberSurface: "#FBF5E8",
  amberText: "#7E5812",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type CardType = "paper" | "researcher" | "topic" | "lab";

interface PaperCard {
  id: string;
  type: "paper";
  title: string;
  authors: string[];
  venue: string;
  date: string;
  topics: string[];
  reason: string;
  abstract: string;
  cited: number;
}

interface ResearcherCard {
  id: string;
  type: "researcher";
  name: string;
  role: string;
  institution: string;
  sharedInterests: string[];
  focus: string;
  recentPapers: number;
  hIndex: number;
}

interface TopicCard {
  id: string;
  type: "topic";
  name: string;
  description: string;
  relatedPapers: number;
  researchers: number;
  projects: number;
  recentActivity: string;
}

interface LabCard {
  id: string;
  type: "lab";
  name: string;
  institution: string;
  focus: string[];
  researcherCount: number;
  recentPublications: number;
}

type AnyCard = PaperCard | ResearcherCard | TopicCard | LabCard;

// ─── Static data ──────────────────────────────────────────────────────────────

const CONTENT_TYPES = [
  "All",
  "Papers",
  "Researchers",
  "Projects",
  "Topics",
  "Labs",
  "Datasets",
];
const TIME_FILTERS = ["Any time", "Past week", "Past month", "Past year"];
const RESEARCH_AREAS = [
  "AI & Machine Learning",
  "Computer Vision",
  "Healthcare & Bio",
  "Foundation Models",
  "Robotics",
];
const SORT_OPTIONS = [
  "Relevance",
  "Newest",
  "Trending",
  "Most cited",
];

const RECENT_SEARCHES = [
  "medical imaging foundation models",
  "federated learning healthcare",
  "low-resource segmentation",
];

const SUGGESTED_SEARCHES = [
  "What's emerging in multimodal medical AI?",
  "Researchers working on medical imaging + transformers",
  "Recent papers on low-resource computer vision",
  "Datasets for medical image segmentation",
];

const PAPER_CARDS: PaperCard[] = [
  {
    id: "p1",
    type: "paper",
    title: "Foundation Models for Medical Image Understanding",
    authors: ["Elena Rodriguez", "James Park", "Maya Singh"],
    venue: "Nature Machine Intelligence",
    date: "August 2026",
    topics: ["Medical Imaging", "Foundation Models", "Computer Vision"],
    reason: "Related to your current research on low-resource segmentation.",
    abstract:
      "A comprehensive study of foundation models adapted for medical image understanding, demonstrating significant performance gains across diverse clinical imaging modalities through task-specific fine-tuning strategies.",
    cited: 142,
  },
  {
    id: "p2",
    type: "paper",
    title: "Self-Supervised Contrastive Learning for Low-Resource Medical Segmentation",
    authors: ["Wei Zhang", "Priya Sharma", "Carlos Fernandez"],
    venue: "MICCAI 2026",
    date: "July 2026",
    topics: ["Segmentation", "Self-Supervised Learning", "Healthcare AI"],
    reason: "Directly related to your low-resource segmentation work.",
    abstract:
      "A contrastive learning framework achieving state-of-the-art segmentation with as few as 50 labeled examples per class, validated across three clinical imaging datasets.",
    cited: 89,
  },
  {
    id: "p3",
    type: "paper",
    title: "Efficient Vision Transformers for Real-Time Clinical Image Analysis",
    authors: ["Aisha Nkemdirim", "Henrik Larsson"],
    venue: "IEEE Transactions on Medical Imaging",
    date: "June 2026",
    topics: ["Vision Transformers", "Clinical AI", "Efficiency"],
    reason: "Connected to 6 papers in your reading list.",
    abstract:
      "We introduce a lightweight vision transformer architecture optimized for inference speed in clinical settings without sacrificing diagnostic accuracy.",
    cited: 67,
  },
];

const RESEARCHER_CARDS: ResearcherCard[] = [
  {
    id: "r1",
    type: "researcher",
    name: "Dr. Elena Rodriguez",
    role: "Computational Biology · Machine Learning",
    institution: "Stanford Bio-X & HAI",
    sharedInterests: ["Machine Learning", "Medical Imaging"],
    focus: "Learning robust multimodal representations for clinical datasets.",
    recentPapers: 8,
    hIndex: 22,
  },
];

const TOPIC_CARDS: TopicCard[] = [
  {
    id: "t1",
    type: "topic",
    name: "Multimodal Medical AI",
    description:
      "Research combining language, vision and clinical time-series data is gaining exponential momentum across top institutes.",
    relatedPapers: 347,
    researchers: 89,
    projects: 24,
    recentActivity: "14 new preprints this week",
  },
];

const LAB_CARDS: LabCard[] = [
  {
    id: "l1",
    type: "lab",
    name: "AI for Healthcare & Vision Lab",
    institution: "MIT CSAIL",
    focus: ["Medical Imaging", "Machine Learning", "Clinical AI"],
    researcherCount: 42,
    recentPublications: 18,
  },
];

const MOMENTUM_TOPICS = [
  {
    id: "m1",
    name: "Multimodal Medical AI",
    reason: "Growing quickly across papers, benchmarks, and grant awards.",
    growth: "+48% velocity",
  },
  {
    id: "m2",
    name: "Foundation Models for Healthcare",
    reason: "Significant activity in preprints and top conferences.",
    growth: "+36% velocity",
  },
  {
    id: "m3",
    name: "Federated Medical Learning",
    reason: "Emerging focus in privacy-preserving clinical AI.",
    growth: "+29% velocity",
  },
  {
    id: "m4",
    name: "Synthetic Clinical Data Generative Models",
    reason: "Rising interest in privacy-compliant synthetic training data.",
    growth: "+22% velocity",
  },
  {
    id: "m5",
    name: "AI-Assisted Structural Proteomics",
    reason: "Cross-disciplinary attention from ML and chemical biology.",
    growth: "+19% velocity",
  },
];

const CONNECTION_CHAIN = [
  { id: "c1", name: "Medical Imaging", papers: "2,400+", researchers: "380+" },
  { id: "c2", name: "Computer Vision", papers: "8,900+", researchers: "1,200+" },
  { id: "c3", name: "Foundation Models", papers: "3,200+", researchers: "540+" },
  { id: "c4", name: "Multimodal Learning", papers: "1,800+", researchers: "290+" },
  { id: "c5", name: "Clinical AI", papers: "970+", researchers: "160+" },
];

const UNEXPECTED_CONNECTIONS = [
  {
    id: "uc1",
    yourInterest: "Medical Imaging",
    connectedField: "Satellite Remote Sensing",
    reason:
      "Satellite hyper-spectral image segmentation methods are being adapted to medical imaging workflows.",
    relatedPaper: "Cross-Domain Transfer of Segmentation Networks from Satellite to Histopathology",
    researcher: "Dr. Amara Osei",
    topic: "Remote Sensing Segmentation",
  },
  {
    id: "uc2",
    yourInterest: "Computer Vision",
    connectedField: "Materials Science",
    reason:
      "Microstructure analysis techniques from materials science are informing new dense topological segmentation approaches.",
    relatedPaper: "Vision Transformers for Microstructural Analysis in Biomaterials",
    researcher: "Dr. Lena Fischer",
    topic: "Microscopy Vision",
  },
];

const MY_INTERESTS = [
  "Medical Imaging",
  "Computer Vision",
  "Machine Learning",
  "Deep Learning",
  "Self-Supervised Learning",
];

const SUGGESTED_RESEARCHERS = [
  { id: "sr1", name: "Dr. Elena Rodriguez", area: "Multimodal Medical AI", initials: "ER" },
  { id: "sr2", name: "Dr. Arjun Mehta", area: "Federated Learning", initials: "AM" },
  { id: "sr3", name: "Dr. Sofia Klein", area: "Vision Transformers", initials: "SK" },
];

const RECENTLY_VIEWED = [
  { id: "rv1", title: "Foundation Models for Medical Image Understanding", type: "paper" as const },
  { id: "rv2", title: "Federated Learning in Healthcare", type: "paper" as const },
  { id: "rv3", title: "Low-Resource Computer Vision", type: "topic" as const },
];

// ─── Small UI Atoms ──────────────────────────────────────────────────────────

function Tag({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "green" | "sand";
}) {
  const styles = {
    default: "bg-[#F2EBDD] text-[#62685E] border border-[#E4DCCB]",
    green: "bg-[#DCE6D7] text-[#202920] border border-[#66866A]/30 font-semibold",
    sand: "bg-[#FAF7F0] text-[#805B43] border border-[#E4DCCB]",
  }[variant];

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium tracking-tight ${styles}`}
    >
      {label}
    </span>
  );
}

function ReasonChip({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DCE6D7]/60 border border-[#66866A]/30 text-[#293E30] text-[11.5px] font-sans">
      <span className="text-[#3E6248] text-xs">✦</span>
      <span className="leading-snug">{text}</span>
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

function SearchBar({ onFocus }: { onFocus: () => void }) {
  return (
    <button
      onClick={onFocus}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[#E4DCCB] text-[#62685E] shadow-2xs hover:border-[#3E6248] hover:shadow-xs transition-all duration-200 cursor-text text-left"
      aria-label="Search papers, researchers, topics, labs, datasets"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Search className="w-4 h-4 text-[#3E6248] shrink-0" />
        <span className="text-[14px] text-[#85877B] truncate font-sans">
          Search papers, researchers, topics, labs, datasets across the network...
        </span>
      </div>
      <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium text-[#62685E] bg-[#F2EBDD] border border-[#E4DCCB] rounded-md">
        ⌘ K
      </kbd>
    </button>
  );
}

// ─── Search Overlay ───────────────────────────────────────────────────────────

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#202920]/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-2xl bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E4DCCB] bg-white">
          <Search className="w-5 h-5 text-[#3E6248] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, researchers, topics, labs, datasets..."
            className="flex-1 bg-transparent border-0 outline-none text-[15px] text-[#202920] placeholder:text-[#85877B] font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#85877B] hover:text-[#202920] hover:bg-[#F2EBDD] transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {!query ? (
            <>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#85877B] font-semibold mb-2">
                  Recent Searches
                </div>
                <div className="space-y-1">
                  {RECENT_SEARCHES.map((s, i) => (
                    <button
                      key={i}
                      onClick={onClose}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-[#62685E] hover:text-[#202920] hover:bg-[#F2EBDD] transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#85877B]" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#85877B] font-semibold mb-2">
                  Suggested Explorations
                </div>
                <div className="space-y-1">
                  {SUGGESTED_SEARCHES.map((s, i) => (
                    <button
                      key={i}
                      onClick={onClose}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-[#202920] hover:bg-[#F2EBDD] transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-[#3E6248]" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-[#62685E] text-sm font-sans">
              Press Enter to search for &ldquo;
              <span className="font-semibold text-[#202920]">{query}</span>
              &rdquo; across 120M+ research papers...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E4DCCB] bg-[#FAF7F0] text-[12px] font-sans font-medium text-[#62685E] hover:text-[#202920] hover:border-[#3E6248] transition-colors cursor-pointer"
      >
        <span>{label}</span>
        <ChevronDown className="w-3 h-3 text-[#85877B]" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-30 min-w-[170px] bg-white border border-[#E4DCCB] rounded-xl p-1 shadow-lg animate-in fade-in duration-150">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-sans text-left transition-colors border-0 cursor-pointer ${
                value === opt
                  ? "bg-[#DCE6D7] text-[#202920] font-semibold"
                  : "text-[#62685E] hover:text-[#202920] hover:bg-[#F2EBDD]"
              }`}
            >
              <span>{opt}</span>
              {value === opt && <Check className="w-3 h-3 text-[#3E6248]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar({
  activeType,
  setActiveType,
  activeTime,
  setActiveTime,
  activeArea,
  setActiveArea,
  activeSort,
  setActiveSort,
}: {
  activeType: string;
  setActiveType: (v: string) => void;
  activeTime: string;
  setActiveTime: (v: string) => void;
  activeArea: string;
  setActiveArea: (v: string) => void;
  activeSort: string;
  setActiveSort: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Pills row */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {CONTENT_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-sans font-medium transition-all duration-150 cursor-pointer border ${
              activeType === t
                ? "bg-[#3E6248] text-[#FAF7F0] border-[#3E6248] font-semibold shadow-xs"
                : "bg-[#FAF7F0] text-[#62685E] border-[#E4DCCB] hover:border-[#3E6248] hover:text-[#202920]"
            }`}
          >
            {t}
          </button>
        ))}

        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-sans font-semibold bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/30 hover:bg-[#3E6248] hover:text-[#FAF7F0] transition-colors no-underline"
        >
          <Sparkles className="w-3 h-3" />
          <span>Opportunities</span>
          <ArrowUpRight className="w-2.5 h-2.5 opacity-70" />
        </Link>
      </div>

      {/* Dropdown controls */}
      <div className="flex items-center gap-2">
        <FilterDropdown
          label={activeTime}
          options={TIME_FILTERS}
          value={activeTime}
          onChange={setActiveTime}
        />
        <FilterDropdown
          label={activeArea || "Research Area"}
          options={RESEARCH_AREAS}
          value={activeArea}
          onChange={setActiveArea}
        />
        <FilterDropdown
          label={`Sort: ${activeSort}`}
          options={SORT_OPTIONS}
          value={activeSort}
          onChange={setActiveSort}
        />
      </div>
    </div>
  );
}

// ─── Paper Card Component ─────────────────────────────────────────────────────

function PaperCardComponent({
  data,
  onOpen,
  onSave,
  saved,
}: {
  data: PaperCard;
  onOpen: (d: AnyCard) => void;
  onSave: (id: string) => void;
  saved: boolean;
}) {
  return (
    <article
      onClick={() => onOpen(data)}
      className="p-5 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#66866A] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col gap-3 relative"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tag label="Paper" variant="green" />
          <span className="font-mono text-[11px] text-[#85877B]">
            {data.venue} · {data.date}
          </span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onSave(data.id)}
            title={saved ? "Saved in Reading List" : "Save paper"}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              saved
                ? "bg-[#DCE6D7] border-[#66866A]/50 text-[#3E6248]"
                : "border-[#E4DCCB] text-[#85877B] hover:text-[#202920] hover:bg-[#F2EBDD]"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-[#3E6248]" : ""}`} />
          </button>
          <button
            title="Share"
            className="p-1.5 rounded-lg border border-[#E4DCCB] text-[#85877B] hover:text-[#202920] hover:bg-[#F2EBDD] transition-colors cursor-pointer bg-white"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-[18px] font-semibold text-[#202920] leading-snug group-hover:text-[#3E6248] transition-colors m-0">
          {data.title}
        </h3>
        <p className="text-[13px] text-[#62685E] font-sans mt-1 mb-0">
          {data.authors.join(", ")}
        </p>
      </div>

      <p className="text-[13px] text-[#62685E] font-sans leading-relaxed line-clamp-2 m-0">
        {data.abstract}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        {data.topics.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>

      <div className="pt-2 border-t border-[#E4DCCB]/60 flex items-center justify-between">
        <ReasonChip text={data.reason} />
        <span className="font-mono text-[11px] text-[#85877B]">
          {data.cited} citations
        </span>
      </div>
    </article>
  );
}

// ─── Researcher Card Component ───────────────────────────────────────────────

function ResearcherCardComponent({
  data,
  onOpen,
  followed,
  onFollow,
}: {
  data: ResearcherCard;
  onOpen: (d: AnyCard) => void;
  followed: boolean;
  onFollow: (id: string) => void;
}) {
  return (
    <article
      onClick={() => onOpen(data)}
      className="p-5 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#66866A] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DCE6D7] border border-[#66866A]/40 flex items-center justify-center text-[#3E6248] font-bold text-sm">
              ER
            </div>
            <div>
              <h4 className="font-serif text-[16px] font-semibold text-[#202920] group-hover:text-[#3E6248] transition-colors m-0">
                {data.name}
              </h4>
              <p className="text-[12px] text-[#85877B] font-sans m-0">
                {data.institution}
              </p>
            </div>
          </div>
          <Tag label="Scholar" variant="green" />
        </div>

        <p className="text-[12.5px] italic text-[#62685E] font-sans leading-relaxed m-0">
          &ldquo;{data.focus}&rdquo;
        </p>

        <div className="flex flex-wrap gap-1 mt-3">
          {data.sharedInterests.map((i) => (
            <Tag key={i} label={i} />
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#E4DCCB]/60 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <div className="font-mono text-[11px] text-[#85877B]">
          {data.recentPapers} papers · h-index {data.hIndex}
        </div>
        <button
          onClick={() => onFollow(data.id)}
          className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer border ${
            followed
              ? "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/40"
              : "bg-white text-[#202920] border-[#E4DCCB] hover:border-[#3E6248]"
          }`}
        >
          {followed ? "✓ Following" : "+ Follow"}
        </button>
      </div>
    </article>
  );
}

// ─── Topic Card Component ─────────────────────────────────────────────────────

function TopicCardComponent({
  data,
  onOpen,
  followed,
  onFollow,
}: {
  data: TopicCard;
  onOpen: (d: AnyCard) => void;
  followed: boolean;
  onFollow: (id: string) => void;
}) {
  return (
    <article
      onClick={() => onOpen(data)}
      className="p-5 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#66866A] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <Tag label="Emerging Topic" variant="green" />
          <span className="font-mono text-[11px] text-[#3E6248] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Trending
          </span>
        </div>
        <h4 className="font-serif text-[17px] font-semibold text-[#202920] group-hover:text-[#3E6248] transition-colors m-0">
          {data.name}
        </h4>
        <p className="text-[12.5px] text-[#62685E] font-sans leading-relaxed mt-2 m-0">
          {data.description}
        </p>
      </div>

      <div className="pt-3 border-t border-[#E4DCCB]/60 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <span className="font-mono text-[11px] text-[#85877B]">
          {data.relatedPapers} papers · {data.researchers} scholars
        </span>
        <button
          onClick={() => onFollow(data.id)}
          className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer border ${
            followed
              ? "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/40"
              : "bg-white text-[#202920] border-[#E4DCCB] hover:border-[#3E6248]"
          }`}
        >
          {followed ? "✓ Following" : "+ Follow"}
        </button>
      </div>
    </article>
  );
}

// ─── Lab Card Component ───────────────────────────────────────────────────────

function LabCardComponent({
  data,
  onOpen,
}: {
  data: LabCard;
  onOpen: (d: AnyCard) => void;
}) {
  return (
    <article
      onClick={() => onOpen(data)}
      className="p-5 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#66866A] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F2EBDD] border border-[#E4DCCB] flex items-center justify-center text-[#3E6248] font-mono text-xs font-bold shrink-0">
          LAB
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-serif text-[16px] font-semibold text-[#202920] group-hover:text-[#3E6248] transition-colors m-0">
              {data.name}
            </h4>
            <Tag label="Institutional Node" variant="sand" />
          </div>
          <p className="text-[12px] text-[#85877B] font-sans m-0">
            {data.institution} · {data.researcherCount} active researchers · {data.recentPublications} recent publications
          </p>
        </div>
      </div>

      <button className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-[#3E6248] bg-[#DCE6D7] hover:bg-[#3E6248] hover:text-[#FAF7F0] px-3.5 py-1.5 rounded-full transition-colors border border-[#66866A]/30 shrink-0">
        <span>Explore Lab</span>
        <ArrowUpRight className="w-3 h-3" />
      </button>
    </article>
  );
}

// ─── Momentum Section ─────────────────────────────────────────────────────────

function MomentumSection({
  followed,
  onFollow,
}: {
  followed: Set<string>;
  onFollow: (id: string) => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#3E6248] font-bold uppercase tracking-wider mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          02 / Frontier Velocity
        </div>
        <h2 className="font-serif text-[24px] font-normal text-[#202920] tracking-tight m-0">
          Research gaining momentum
        </h2>
        <p className="text-[13.5px] text-[#62685E] font-sans m-0 mt-0.5">
          Topics with rapid citation surges and active cross-institutional preprints.
        </p>
      </div>

      <div className="divide-y divide-[#E4DCCB] bg-white rounded-2xl border border-[#E4DCCB] shadow-2xs overflow-hidden">
        {MOMENTUM_TOPICS.map((topic, idx) => (
          <div
            key={topic.id}
            className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAF7F0] transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="font-mono text-xs font-semibold text-[#85877B] w-6 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-[14px] text-[#202920] truncate">
                    {topic.name}
                  </span>
                  <span className="font-mono text-[10px] text-[#3E6248] bg-[#DCE6D7] px-2 py-0.5 rounded-full font-bold">
                    {topic.growth}
                  </span>
                </div>
                <p className="text-[12px] text-[#62685E] truncate m-0 mt-0.5">
                  {topic.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => onFollow(topic.id)}
              className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer shrink-0 border ${
                followed.has(topic.id)
                  ? "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/40"
                  : "bg-white text-[#202920] border-[#E4DCCB] hover:border-[#3E6248]"
              }`}
            >
              {followed.has(topic.id) ? "✓ Following" : "+ Track"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Connections Viz ──────────────────────────────────────────────────────────

function ConnectionsViz() {
  const [active, setActive] = useState("c1");
  const activeNode = CONNECTION_CHAIN.find((n) => n.id === active)!;

  return (
    <section className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs space-y-5">
      <div>
        <div className="font-mono text-xs text-[#3E6248] font-bold uppercase tracking-wider mb-1">
          03 / Scholarly Relational Topology
        </div>
        <h2 className="font-serif text-[22px] font-normal text-[#202920] tracking-tight m-0">
          Cross-disciplinary research pathways
        </h2>
        <p className="text-[13px] text-[#62685E] font-sans m-0 mt-0.5">
          Trace how your core questions link organically to emerging methodologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Pathway nodes */}
        <div className="md:col-span-8 flex flex-col gap-2">
          {CONNECTION_CHAIN.map((node) => (
            <button
              key={node.id}
              onClick={() => setActive(node.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                active === node.id
                  ? "bg-[#DCE6D7]/80 border-[#3E6248] shadow-xs"
                  : "bg-[#FAF7F0] border-[#E4DCCB] hover:border-[#66866A]/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-transform ${
                    active === node.id
                      ? "bg-[#3E6248] scale-125"
                      : "bg-[#85877B]"
                  }`}
                />
                <span
                  className={`font-sans text-[14px] ${
                    active === node.id
                      ? "font-bold text-[#202920]"
                      : "font-medium text-[#62685E]"
                  }`}
                >
                  {node.name}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#85877B]">
                {node.papers} papers · {node.researchers} scholars
              </span>
            </button>
          ))}
        </div>

        {/* Selected Node Card */}
        <div className="md:col-span-4 p-5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] text-[#85877B] uppercase tracking-wider font-semibold mb-1">
              Field Focus
            </div>
            <h4 className="font-serif text-[18px] font-bold text-[#202920] m-0">
              {activeNode.name}
            </h4>
            <p className="text-[12px] text-[#62685E] font-sans mt-2 mb-0">
              High cross-citation density connecting computational vision algorithms with clinical diagnostic trials.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E4DCCB]">
            <div className="p-2.5 rounded-lg bg-white border border-[#E4DCCB]">
              <div className="font-serif text-[16px] font-bold text-[#202920]">
                {activeNode.papers}
              </div>
              <div className="font-sans text-[10px] text-[#85877B] uppercase">Papers</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#E4DCCB]">
              <div className="font-serif text-[16px] font-bold text-[#202920]">
                {activeNode.researchers}
              </div>
              <div className="font-sans text-[10px] text-[#85877B] uppercase">Scholars</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Unexpected Connections Section ──────────────────────────────────────────

function UnexpectedSection() {
  return (
    <section className="space-y-4">
      <div>
        <div className="font-mono text-xs text-[#3E6248] font-bold uppercase tracking-wider mb-1">
          04 / Serendipity Engine
        </div>
        <h2 className="font-serif text-[22px] font-normal text-[#202920] tracking-tight m-0">
          Unexpected cross-domain intersections
        </h2>
        <p className="text-[13px] text-[#62685E] font-sans m-0 mt-0.5">
          Discover how external disciplines solve identical algorithmic constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UNEXPECTED_CONNECTIONS.map((uc) => (
          <div
            key={uc.id}
            className="p-5 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#66866A] shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag label={uc.yourInterest} variant="sand" />
                <span className="text-[#85877B] text-xs">→</span>
                <Tag label={uc.connectedField} variant="green" />
              </div>
              <p className="text-[13px] text-[#62685E] font-sans leading-relaxed m-0">
                {uc.reason}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] text-[12px] space-y-1">
              <div className="font-semibold text-[#202920] truncate">
                {uc.relatedPaper}
              </div>
              <div className="text-[#85877B] font-mono text-[11px]">
                {uc.researcher} · {uc.topic}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Right Rail (Research Context Sidebar) ───────────────────────────────────

function RightRail({
  followed,
  onFollow,
}: {
  followed: Set<string>;
  onFollow: (id: string) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Research Interests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-[15px] font-semibold text-[#202920] m-0">
            Your Research Core
          </h3>
          <button className="text-[11px] font-mono text-[#3E6248] hover:underline cursor-pointer border-0 bg-transparent">
            Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MY_INTERESTS.map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-1 rounded-full text-[11.5px] font-sans bg-[#F2EBDD] text-[#202920] border border-[#E4DCCB] hover:border-[#3E6248] transition-colors cursor-default"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-[#E4DCCB]" />

      {/* Suggested Researchers to explore */}
      <div>
        <div className="mb-3">
          <h3 className="font-serif text-[15px] font-semibold text-[#202920] m-0">
            Scholars to Explore
          </h3>
          <p className="text-[11px] text-[#85877B] font-sans m-0 mt-0.5">
            Matching your citation network
          </p>
        </div>

        <div className="space-y-2.5">
          {SUGGESTED_RESEARCHERS.map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-xl bg-white border border-[#E4DCCB] flex items-center justify-between gap-3 hover:border-[#66866A]/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#DCE6D7] border border-[#66866A]/30 flex items-center justify-center text-[#3E6248] text-xs font-bold shrink-0">
                  {r.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[#202920] truncate font-sans">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-[#85877B] truncate font-sans">
                    {r.area}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onFollow(r.id)}
                className={`p-1.5 rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer shrink-0 border ${
                  followed.has(r.id)
                    ? "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/40"
                    : "bg-[#FAF7F0] text-[#62685E] border-[#E4DCCB] hover:text-[#202920]"
                }`}
              >
                {followed.has(r.id) ? (
                  <Check className="w-3.5 h-3.5 text-[#3E6248]" />
                ) : (
                  <span className="text-xs px-1">+</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-[#E4DCCB]" />

      {/* Recently Viewed */}
      <div>
        <h3 className="font-serif text-[15px] font-semibold text-[#202920] mb-3 m-0">
          Recently Inspected
        </h3>
        <div className="space-y-2">
          {RECENTLY_VIEWED.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg hover:bg-white border border-transparent hover:border-[#E4DCCB] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#DCE6D7] text-[#3E6248] font-bold">
                  {item.type}
                </span>
              </div>
              <div className="text-[12.5px] text-[#62685E] group-hover:text-[#202920] font-sans leading-snug line-clamp-2">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  item,
  onClose,
  saved,
  onSave,
  followed,
  onFollow,
}: {
  item: AnyCard;
  onClose: () => void;
  saved: boolean;
  onSave: (id: string) => void;
  followed: boolean;
  onFollow: (id: string) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const title =
    item.type === "paper"
      ? (item as PaperCard).title
      : item.type === "researcher"
      ? (item as ResearcherCard).name
      : item.type === "topic"
      ? (item as TopicCard).name
      : (item as LabCard).name;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#202920]/30 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF7F0] h-full shadow-2xl border-l border-[#E4DCCB] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-4">
            <Tag label={item.type.toUpperCase()} variant="green" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[#E4DCCB] text-[#85877B] hover:text-[#202920] hover:bg-[#F2EBDD] cursor-pointer bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="font-serif text-[24px] font-semibold text-[#202920] leading-snug m-0">
              {title}
            </h2>
            {item.type === "paper" && (
              <p className="text-[13px] text-[#62685E] font-sans mt-2">
                {(item as PaperCard).authors.join(", ")} · {(item as PaperCard).venue}
              </p>
            )}
          </div>

          {item.type === "paper" && (
            <div className="p-4 rounded-xl bg-white border border-[#E4DCCB] space-y-2">
              <div className="font-mono text-[10px] text-[#85877B] uppercase tracking-wider font-semibold">
                Abstract
              </div>
              <p className="text-[13px] text-[#62685E] font-sans leading-relaxed m-0">
                {(item as PaperCard).abstract}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#E4DCCB] bg-white flex items-center justify-between">
          {item.type === "paper" ? (
            <button
              onClick={() => onSave(item.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3E6248] text-[#FAF7F0] text-sm font-semibold hover:bg-[#293E30] transition-colors border-0 cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>{saved ? "Saved in Reading List" : "Save Paper"}</span>
            </button>
          ) : (
            <button
              onClick={() => onFollow(item.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3E6248] text-[#FAF7F0] text-sm font-semibold hover:bg-[#293E30] transition-colors border-0 cursor-pointer"
            >
              <span>{followed ? "Following" : "Follow"}</span>
            </button>
          )}

          <Link
            href="/reader"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3E6248] hover:underline no-underline"
          >
            <span>Open in Workspace</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Toast Notification ──────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#202920] text-[#FAF7F0] text-xs font-mono shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
      {message}
    </div>
  );
}

// ─── Main Discover Page ───────────────────────────────────────────────────────

export default function DiscoverPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeType, setActiveType] = useState("All");
  const [activeTime, setActiveTime] = useState("Any time");
  const [activeArea, setActiveArea] = useState("");
  const [activeSort, setActiveSort] = useState("Relevance");
  const [detailItem, setDetailItem] = useState<AnyCard | null>(null);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [followedItems, setFollowedItems] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2400);
  }, []);

  const handleSave = useCallback(
    (id: string) => {
      setSavedItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          showToast("Removed from Reading List");
        } else {
          next.add(id);
          showToast("Saved to Reading List");
        }
        return next;
      });
    },
    [showToast]
  );

  const handleFollow = useCallback(
    (id: string) => {
      setFollowedItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          showToast("Unfollowed");
        } else {
          next.add(id);
          showToast("Added to your followed network");
        }
        return next;
      });
    },
    [showToast]
  );

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex flex-1 h-screen overflow-hidden bg-[#FAF7F0] font-sans">
      {/* Center content stream (Expands to fill all available space, properly responsive) */}
      <main
        id="main-content"
        className="flex-1 min-w-0 h-screen overflow-y-auto px-6 sm:px-10 lg:px-12 py-8"
        aria-label="Discovery feed"
      >
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <header className="space-y-3">
            <h1 className="font-serif text-[32px] md:text-[38px] font-normal leading-[1.14] tracking-[-0.02em] text-[#202920] m-0">
              Explore what&apos;s happening in research.
            </h1>
            <p className="text-[15px] text-[#62685E] font-sans leading-relaxed max-w-2xl m-0">
              Find papers, researchers, ideas and emerging topics connected to your research canvas across 120M+ indexed publications.
            </p>

            <div className="pt-2 space-y-3">
              <SearchBar onFocus={() => setSearchOpen(true)} />
              <BooleanQueryBuilder
                onApply={(queryExpr) => {
                  if (queryExpr) {
                    showToast(`Active Boolean Filter: ${queryExpr.slice(0, 38)}...`);
                  }
                }}
              />
            </div>
          </header>

          {/* Filter Bar */}
          <div>
            <FilterBar
              activeType={activeType}
              setActiveType={setActiveType}
              activeTime={activeTime}
              setActiveTime={setActiveTime}
              activeArea={activeArea}
              setActiveArea={setActiveArea}
              activeSort={activeSort}
              setActiveSort={setActiveSort}
            />
          </div>

          {/* Recommended Section */}
          <section className="space-y-4" aria-labelledby="recommended-heading">
            <div>
              <h2
                id="recommended-heading"
                className="font-serif text-[22px] font-normal text-[#202920] tracking-tight m-0"
              >
                Recommended for you
              </h2>
              <p className="text-[13px] text-[#62685E] font-sans m-0 mt-0.5">
                Calculated from your verified research topics and recent citations.
              </p>
            </div>

            <div className="space-y-4">
              {PAPER_CARDS.map((p) => (
                <PaperCardComponent
                  key={p.id}
                  data={p}
                  onOpen={setDetailItem}
                  onSave={handleSave}
                  saved={savedItems.has(p.id)}
                />
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESEARCHER_CARDS.map((r) => (
                  <ResearcherCardComponent
                    key={r.id}
                    data={r}
                    onOpen={setDetailItem}
                    followed={followedItems.has(r.id)}
                    onFollow={handleFollow}
                  />
                ))}
                {TOPIC_CARDS.map((t) => (
                  <TopicCardComponent
                    key={t.id}
                    data={t}
                    onOpen={setDetailItem}
                    followed={followedItems.has(t.id)}
                    onFollow={handleFollow}
                  />
                ))}
              </div>

              {LAB_CARDS.map((l) => (
                <LabCardComponent key={l.id} data={l} onOpen={setDetailItem} />
              ))}
            </div>
          </section>

          {/* Momentum Section */}
          <MomentumSection followed={followedItems} onFollow={handleFollow} />

          {/* Connections Section */}
          <ConnectionsViz />

          {/* Unexpected Section */}
          <UnexpectedSection />
        </div>
      </main>

      {/* Right Rail (Right Shifted, utilizing empty screen real estate without squeezing center) */}
      <aside
        className="w-[320px] xl:w-[350px] shrink-0 h-screen overflow-y-auto border-l border-[#E4DCCB] bg-[#FAF7F0] p-6 hidden lg:block"
        aria-label="Research context & interests"
      >
        <RightRail followed={followedItems} onFollow={handleFollow} />
      </aside>

      {/* Overlays */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {detailItem && (
        <DetailPanel
          item={detailItem}
          onClose={() => setDetailItem(null)}
          saved={savedItems.has(detailItem.id)}
          onSave={handleSave}
          followed={followedItems.has(detailItem.id)}
          onFollow={handleFollow}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
