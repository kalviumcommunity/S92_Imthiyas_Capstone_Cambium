"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { InvertedIndex, SearchableDocument } from "@/lib/search/inverted-index";
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
  ExternalLink,
} from "lucide-react";
import { BooleanQueryBuilder } from "@/components/ui/boolean-query-builder";
import { AiAutocompleteInput } from "@/components/ai/AiAutocompleteInput";
import {
  fetchScholarlyWorks,
  fetchScholarlyResearchers,
  fetchTrendingTopics,
  fetchOpenAccessBooks,
  fetchResearchArtifacts,
  ScholarlyWork,
  ScholarlyAuthor,
  ScholarlyTopic,
  ScholarlyBook,
  ResearchArtifact,
} from "@/lib/scholarly-api";
import { useAuthStore } from "@/lib/store/useAuthStore";

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

type AnyCard =
  | ScholarlyWork
  | PaperCard
  | ResearcherCard
  | TopicCard
  | LabCard
  | ScholarlyBook
  | ResearchArtifact
  | ScholarlyAuthor
  | ScholarlyTopic;

// ─── Static data ──────────────────────────────────────────────────────────────

const CONTENT_TYPES = [
  "All",
  "Papers",
  "Books",
  "Datasets & Code",
  "Researchers",
  "Topics",
  "Labs",
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
  variant?: "default" | "green" | "sand" | "amber" | "blue";
}) {
  const styles = {
    default: "bg-[#F2EBDD] dark:bg-[#1F2E23] text-[#62685E] dark:text-[#A4B3A2] border border-[#E4DCCB] dark:border-[#233327]",
    green: "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#202920] dark:text-[#4ADE80] border border-[#66866A]/30 dark:border-[#4ADE80]/30 font-semibold",
    sand: "bg-[#FAF7F0] dark:bg-[#18231B] text-[#805B43] dark:text-[#E2C898] border border-[#E4DCCB] dark:border-[#233327]",
    amber: "bg-[#FBF5E8] dark:bg-[#2B2313] text-[#7E5812] dark:text-[#F3C472] border border-[#E2C898] dark:border-[#5C451D]",
    blue: "bg-[#E8F1F5] dark:bg-[#142633] text-[#1D5E7E] dark:text-[#76C2E8] border border-[#B8D8E8] dark:border-[#234B63]",
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
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DCE6D7]/60 dark:bg-[#1F2E23]/60 border border-[#66866A]/30 dark:border-[#4ADE80]/30 text-[#293E30] dark:text-[#EDEAE2] text-[11.5px] font-sans">
      <span className="text-[#3E6248] dark:text-[#4ADE80] text-xs">✦</span>
      <span className="leading-snug">{text}</span>
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

function SearchBar({
  onFocus,
  activeQuery,
  onClear,
}: {
  onFocus: () => void;
  activeQuery?: string;
  onClear?: () => void;
}) {
  return (
    <div className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-full bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#28382C] text-[#62685E] dark:text-[#A3B899] shadow-sm hover:border-[#8FA89B] dark:hover:border-[#3E7750] hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 min-w-0 flex-1 cursor-text" onClick={onFocus}>
        <Search className="w-4 h-4 text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
        {activeQuery ? (
          <div className="flex items-center gap-2 text-sm text-[#202920] dark:text-[#EDEAE2] truncate">
            <span className="text-[#85877B] dark:text-[#6E7D72]">Filtering by:</span>
            <span className="font-semibold text-[#3E6248] dark:text-[#4ADE80] bg-[#FAF7F0] dark:bg-[#121B14] px-2.5 py-0.5 rounded-full border border-[#3E6248]/20 truncate">
              {activeQuery}
            </span>
          </div>
        ) : (
          <span className="text-[14px] text-[#85877B] dark:text-[#6E7D72] truncate font-sans">
            Search papers, researchers, topics, labs, datasets across the network...
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {activeQuery && onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-1 rounded-full text-[#85877B] hover:text-[#202920] dark:hover:text-white hover:bg-[#F2EBDD] dark:hover:bg-[#202E24] transition-colors border-0 bg-transparent cursor-pointer"
            title="Clear filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <kbd
          onClick={onFocus}
          className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium text-[#62685E] dark:text-[#A3B899] bg-[#F2EBDD] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#28382C] rounded-full cursor-pointer"
        >
          ⌘ K
        </kbd>
      </div>
    </div>
  );
}

// ─── Search Overlay ───────────────────────────────────────────────────────────

function SearchOverlay({
  onClose,
  onSearch,
}: {
  onClose: () => void;
  onSearch: (q: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const discoverIndex = useMemo(() => {
    const idx = new InvertedIndex<SearchableDocument>({
      title: 5.0,
      tags: 3.5,
      author: 2.0,
      description: 1.0,
    });
    idx.addDocuments([
      ...PAPER_CARDS.map((p) => ({
        id: p.id,
        title: p.title,
        author: p.authors.join(", "),
        tags: p.topics,
        description: p.abstract,
        category: "paper",
      })),
      ...RESEARCHER_CARDS.map((r) => ({
        id: r.id,
        title: r.name,
        author: r.role,
        tags: r.sharedInterests,
        description: `${r.institution} ${r.focus}`,
        category: "researcher",
      })),
      ...TOPIC_CARDS.map((t) => ({
        id: t.id,
        title: t.name,
        description: t.description,
        category: "topic",
      })),
      ...LAB_CARDS.map((l) => ({
        id: l.id,
        title: l.name,
        author: l.institution,
        tags: l.focus,
        description: `${l.institution} · ${l.focus.join(", ")}`,
        category: "lab",
      })),
    ]);
    return idx;
  }, []);

  const instantMatches = useMemo(() => {
    if (!query.trim()) return [];
    return discoverIndex.search(query.trim(), { limit: 6 });
  }, [query, discoverIndex]);

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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#202920]/45 dark:bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-2xl bg-[#FAF7F0] dark:bg-[#121B14] border border-[#E4DCCB] dark:border-[#28382C] rounded-[28px] shadow-2xl p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google-Style Clean Rounded Pill Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#28382C] shadow-sm hover:border-[#8FA89B] dark:hover:border-[#3E7750] focus-within:border-[#3E6248] dark:focus-within:border-[#4ADE80] focus-within:ring-2 focus-within:ring-[#3E6248]/15 dark:focus-within:ring-[#4ADE80]/20 transition-all mb-4"
        >
          <Search className="w-5 h-5 text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, researchers, topics, labs, datasets..."
            className="flex-1 bg-transparent border-0 outline-none text-[15px] text-[#202920] dark:text-[#EDEAE2] placeholder:text-[#85877B] dark:placeholder:text-[#6E7D72] font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-[#85877B] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#202E24] transition-colors border-0 bg-transparent cursor-pointer"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-4 py-1.5 rounded-full bg-[#3E6248] dark:bg-[#2D583B] text-white text-xs font-sans font-semibold hover:bg-[#204033] dark:hover:bg-[#386D49] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>Search</span>
            <span className="font-mono text-[10px] opacity-75">↵</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#85877B] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#202E24] transition-colors border-0 bg-transparent cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

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
                      type="button"
                      onClick={() => {
                        onSearch(s);
                        onClose();
                      }}
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
                      type="button"
                      onClick={() => {
                        onSearch(s);
                        onClose();
                      }}
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
            <div className="space-y-3">
              {instantMatches.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#85877B] font-semibold">
                    Instant Inverted Index Matches ({instantMatches.length})
                  </div>
                  {instantMatches.map(({ item, score }) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSearch(item.title);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E4DCCB] text-left hover:border-[#3E6248] transition-all cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-semibold text-[#202920] truncate">
                            {item.title}
                          </span>
                          <span className="px-1.5 py-0.2 rounded font-mono text-[9px] uppercase tracking-wider bg-[#F2EBDD] text-[#62685E]">
                            {item.category}
                          </span>
                        </div>
                        {item.author && (
                          <div className="text-xs text-[#62685E] truncate mt-0.5">
                            {item.author}
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-[#3E6248] bg-emerald-50 px-1.5 py-0.5 rounded ml-2 shrink-0">
                        BM25 {score.toFixed(1)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div
                onClick={() => handleSubmit()}
                className="text-center py-4 px-3 text-[#62685E] text-xs font-sans cursor-pointer hover:bg-white rounded-xl transition-colors border border-dashed border-[#E4DCCB]"
              >
                Press Enter or click to search for &ldquo;
                <span className="font-semibold text-[#202920]">{query}</span>
                &rdquo; across 250M+ OpenAlex research papers...
              </div>
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] text-[12px] font-sans font-medium text-[#62685E] dark:text-[#A4B3A2] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:border-[#3E6248] dark:hover:border-[#4ADE80] transition-colors cursor-pointer"
      >
        <span>{label}</span>
        <ChevronDown className="w-3 h-3 text-[#85877B] dark:text-[#7A8C78]" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-30 min-w-[170px] bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-xl p-1 shadow-lg animate-in fade-in duration-150">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-sans text-left transition-colors border-0 cursor-pointer ${
                value === opt
                  ? "bg-[#DCE6D7] dark:bg-[#233327] text-[#202920] dark:text-[#4ADE80] font-semibold"
                  : "text-[#62685E] dark:text-[#A4B3A2] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23]"
              }`}
            >
              <span>{opt}</span>
              {value === opt && <Check className="w-3 h-3 text-[#3E6248] dark:text-[#4ADE80]" />}
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
      <div
        role="region"
        aria-label="Content type filters"
        aria-live="polite"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1"
      >
        {CONTENT_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-sans font-medium transition-all duration-150 cursor-pointer border ${
              activeType === t
                ? "bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] border-[#3E6248] dark:border-[#4ADE80] font-semibold shadow-xs"
                : "bg-[#FAF7F0] dark:bg-[#131C15] text-[#62685E] dark:text-[#A4B3A2] border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248] dark:hover:border-[#4ADE80] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
            }`}
          >
            {t}
          </button>
        ))}

        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-sans font-semibold bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80] border border-[#66866A]/30 dark:border-[#4ADE80]/30 hover:bg-[#3E6248] dark:hover:bg-[#4ADE80] hover:text-[#FAF7F0] dark:hover:text-[#0E140F] transition-colors no-underline"
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
  onShare,
  saved,
}: {
  data: ScholarlyWork | PaperCard;
  onOpen: (d: AnyCard) => void;
  onSave: (id: string) => void;
  onShare?: () => void;
  saved: boolean;
}) {
  const citations = typeof (data as any).citedByCount === "number"
    ? (data as any).citedByCount
    : (data as any).cited ?? 0;

  return (
    <article
      onClick={() => onOpen(data)}
      className="p-5 rounded-2xl bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] hover:border-[#66866A] dark:hover:border-[#4ADE80]/50 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col gap-3 relative"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tag label="Paper" variant="green" />
          <span className="font-mono text-[11px] text-[#85877B] dark:text-[#7A8C78]">
            {data.venue} · {data.date}
          </span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onSave(data.id)}
            title={saved ? "Saved in Reading List" : "Save paper"}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              saved
                ? "bg-[#DCE6D7] dark:bg-[#1F2E23] border-[#66866A]/50 text-[#3E6248] dark:text-[#4ADE80]"
                : "border-[#E4DCCB] dark:border-[#233327] text-[#85877B] dark:text-[#7A8C78] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23]"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-[#3E6248] dark:fill-[#4ADE80]" : ""}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(
                  `${data.title} — ${(data as any).doiUrl || window.location.href}`
                );
              }
              onShare?.();
            }}
            title="Share citation & link"
            className="p-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] text-[#85877B] dark:text-[#7A8C78] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23] transition-colors cursor-pointer bg-white dark:bg-[#18231B]"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-[18px] font-semibold text-[#202920] dark:text-[#EDEAE2] leading-snug group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors m-0">
          {data.title}
        </h3>
        <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans mt-1 mb-0">
          {Array.isArray(data.authors) ? data.authors.join(", ") : "Contributing Scholars"}
        </p>
      </div>

      <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed line-clamp-2 m-0">
        {data.abstract}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        {(data.topics || []).map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>

      <div className="pt-2 border-t border-[#E4DCCB]/60 dark:border-[#233327] flex items-center justify-between">
        <ReasonChip text={data.reason || "Semantic relevance match"} />
        <span className="font-mono text-[11px] text-[#85877B] dark:text-[#7A8C78]">
          {citations.toLocaleString()} citations
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
  data: ResearcherCard | ScholarlyAuthor;
  onOpen: (d: AnyCard) => void;
  followed: boolean;
  onFollow: (id: string) => void;
}) {
  const initials = data.name
    ? data.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SC";
  const paperCount = (data as any).recentPapers ?? (data as any).worksCount ?? 12;

  return (
    <article
      onClick={() => onOpen(data)}
      className="p-5 rounded-2xl bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] hover:border-[#66866A] dark:hover:border-[#4ADE80]/50 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DCE6D7] dark:bg-[#1F2E23] border border-[#66866A]/40 dark:border-[#4ADE80]/40 flex items-center justify-center text-[#3E6248] dark:text-[#4ADE80] font-bold text-sm">
              {initials}
            </div>
            <div>
              <h4 className="font-serif text-[16px] font-semibold text-[#202920] dark:text-[#EDEAE2] group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors m-0">
                {data.name}
              </h4>
              <p className="text-[12px] text-[#85877B] dark:text-[#7A8C78] font-sans m-0">
                {data.institution}
              </p>
            </div>
          </div>
          <Tag label="Scholar" variant="green" />
        </div>

        <p className="text-[12.5px] italic text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed m-0">
          &ldquo;{data.focus}&rdquo;
        </p>

        <div className="flex flex-wrap gap-1 mt-3">
          {(data.sharedInterests || []).map((i) => (
            <Tag key={i} label={i} />
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#E4DCCB]/60 dark:border-[#233327] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <div className="font-mono text-[11px] text-[#85877B] dark:text-[#7A8C78]">
          {paperCount} papers · h-index {data.hIndex}
        </div>
        <button
          onClick={() => onFollow(data.id)}
          className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer border ${
            followed
              ? "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80] border-[#66866A]/40 dark:border-[#4ADE80]/40"
              : "bg-white dark:bg-[#18231B] text-[#202920] dark:text-[#EDEAE2] border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248] dark:hover:border-[#4ADE80]"
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
  data: TopicCard | ScholarlyTopic;
  onOpen: (d: AnyCard) => void;
  followed: boolean;
  onFollow: (id: string) => void;
}) {
  return (
    <article
      onClick={() => onOpen(data)}
      className="p-5 rounded-2xl bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] hover:border-[#66866A] dark:hover:border-[#4ADE80]/50 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <Tag label="Emerging Topic" variant="green" />
          <span className="font-mono text-[11px] text-[#3E6248] dark:text-[#4ADE80] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Trending
          </span>
        </div>
        <h4 className="font-serif text-[17px] font-semibold text-[#202920] dark:text-[#EDEAE2] group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors m-0">
          {data.name}
        </h4>
        <p className="text-[12.5px] text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed mt-2 m-0">
          {data.description}
        </p>
      </div>

      <div className="pt-3 border-t border-[#E4DCCB]/60 dark:border-[#233327] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <span className="font-mono text-[11px] text-[#85877B] dark:text-[#7A8C78]">
          {data.relatedPapers.toLocaleString()} papers · {data.researchers.toLocaleString()} scholars
        </span>
        <button
          onClick={() => onFollow(data.id)}
          className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer border ${
            followed
              ? "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80] border-[#66866A]/40 dark:border-[#4ADE80]/40"
              : "bg-white dark:bg-[#18231B] text-[#202920] dark:text-[#EDEAE2] border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248] dark:hover:border-[#4ADE80]"
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
      className="p-5 rounded-2xl bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] hover:border-[#66866A] dark:hover:border-[#4ADE80]/50 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F2EBDD] dark:bg-[#1F2E23] border border-[#E4DCCB] dark:border-[#233327] flex items-center justify-center text-[#3E6248] dark:text-[#4ADE80] font-mono text-xs font-bold shrink-0">
          LAB
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-serif text-[16px] font-semibold text-[#202920] dark:text-[#EDEAE2] group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors m-0">
              {data.name}
            </h4>
            <Tag label="Institutional Node" variant="sand" />
          </div>
          <p className="text-[12px] text-[#85877B] dark:text-[#7A8C78] font-sans m-0">
            {data.institution} · {data.researcherCount} active researchers · {data.recentPublications} recent publications
          </p>
        </div>
      </div>

      <Link
        href="/lab"
        className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1F2E23] hover:bg-[#3E6248] hover:text-[#FAF7F0] dark:hover:bg-[#4ADE80] dark:hover:text-[#0E140F] px-3.5 py-1.5 rounded-full transition-colors border border-[#66866A]/30 dark:border-[#4ADE80]/30 shrink-0 no-underline"
      >
        <span>Explore Lab</span>
        <ArrowUpRight className="w-3 h-3" />
      </Link>
    </article>
  );
}

// ─── Open Book Card Component ─────────────────────────────────────────────────

function BookCardComponent({
  data,
  onOpen,
  onSave,
  onShare,
  saved,
}: {
  data: ScholarlyBook;
  onOpen: (d: AnyCard) => void;
  onSave: (id: string) => void;
  onShare?: () => void;
  saved: boolean;
}) {
  return (
    <article
      onClick={() => onOpen(data)}
      className="p-5 rounded-2xl bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] hover:border-[#66866A] dark:hover:border-[#4ADE80]/50 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col md:flex-row gap-4 relative"
    >
      {data.coverUrl ? (
        <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0 border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#18231B] flex items-center justify-center">
          <img
            src={data.coverUrl}
            alt={data.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-20 h-28 rounded-lg shrink-0 border border-[#E4DCCB] dark:border-[#233327] bg-[#F2EBDD] dark:bg-[#1F2E23] flex flex-col items-center justify-center p-2 text-center text-[#3E6248] dark:text-[#4ADE80]">
          <BookOpen className="w-6 h-6 mb-1 opacity-70" />
          <span className="text-[10px] font-mono leading-tight">Monograph</span>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-between gap-2.5">
        <div>
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2">
              <Tag label="Open Book" variant="amber" />
              <span className="font-mono text-[11px] text-[#85877B] dark:text-[#7A8C78]">
                {data.publisher || "Academic Press"} · {data.year}
              </span>
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onSave(data.id)}
                title={saved ? "Saved in Reading List" : "Save book"}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  saved
                    ? "bg-[#DCE6D7] dark:bg-[#1F2E23] border-[#66866A]/50 text-[#3E6248] dark:text-[#4ADE80]"
                    : "border-[#E4DCCB] dark:border-[#233327] text-[#85877B] dark:text-[#7A8C78] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23]"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-[#3E6248] dark:fill-[#4ADE80]" : ""}`} />
              </button>
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(`${data.title} — ${data.openUrl}`);
                  }
                  onShare?.();
                }}
                title="Share link"
                className="p-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] text-[#85877B] dark:text-[#7A8C78] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23] transition-colors cursor-pointer bg-white dark:bg-[#18231B]"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h3 className="font-serif text-[18px] font-semibold text-[#202920] dark:text-[#EDEAE2] leading-snug group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors m-0">
            {data.title}
          </h3>
          <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans mt-1 mb-0">
            {data.authors.join(", ")}
          </p>
        </div>

        <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed line-clamp-2 m-0">
          {data.abstract}
        </p>

        <div className="pt-2 border-t border-[#E4DCCB]/60 dark:border-[#233327] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {data.subjects.slice(0, 3).map((s) => (
              <Tag key={s} label={s} />
            ))}
          </div>

          <a
            href={data.openUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11.5px] font-mono text-[#3E6248] dark:text-[#4ADE80] hover:underline"
          >
            <span>Open in Catalog</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

// ─── Research Artifact / Dataset / Software Card Component ────────────────────

function ArtifactCardComponent({
  data,
  onOpen,
  onSave,
  onShare,
  saved,
}: {
  data: ResearchArtifact;
  onOpen: (d: AnyCard) => void;
  onSave: (id: string) => void;
  onShare?: () => void;
  saved: boolean;
}) {
  return (
    <article
      onClick={() => onOpen(data)}
      className="p-5 rounded-2xl bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] hover:border-[#66866A] dark:hover:border-[#4ADE80]/50 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col gap-3 relative"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tag
            label={data.resourceType || "Dataset"}
            variant={data.type === "software" ? "green" : "blue"}
          />
          <span className="font-mono text-[11px] text-[#85877B] dark:text-[#7A8C78]">
            Zenodo (CERN) · {data.publicationDate}
          </span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onSave(data.id)}
            title={saved ? "Saved in Reading List" : "Save artifact"}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              saved
                ? "bg-[#DCE6D7] dark:bg-[#1F2E23] border-[#66866A]/50 text-[#3E6248] dark:text-[#4ADE80]"
                : "border-[#E4DCCB] dark:border-[#233327] text-[#85877B] dark:text-[#7A8C78] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23]"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-[#3E6248] dark:fill-[#4ADE80]" : ""}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(`${data.title} — ${data.doiUrl}`);
              }
              onShare?.();
            }}
            title="Share DOI & link"
            className="p-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] text-[#85877B] dark:text-[#7A8C78] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23] transition-colors cursor-pointer bg-white dark:bg-[#18231B]"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-[18px] font-semibold text-[#202920] dark:text-[#EDEAE2] leading-snug group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors m-0">
          {data.title}
        </h3>
        <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans mt-1 mb-0">
          {data.creators.join(", ")}
        </p>
      </div>

      <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed line-clamp-2 m-0">
        {data.description}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        {(data.keywords || []).slice(0, 4).map((k) => (
          <Tag key={k} label={k} />
        ))}
      </div>

      <div className="pt-2 border-t border-[#E4DCCB]/60 dark:border-[#233327] flex items-center justify-between">
        <ReasonChip text={data.reason || "Open Access scientific deposit"} />
        <a
          href={data.doiUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-[#3E6248] dark:text-[#4ADE80] hover:underline"
        >
          <span>DOI: {data.doi}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
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

      <div className="divide-y divide-[#E4DCCB] dark:divide-[#233327] bg-white dark:bg-[#131C15] rounded-2xl border border-[#E4DCCB] dark:border-[#233327] shadow-2xs overflow-hidden">
        {MOMENTUM_TOPICS.map((topic, idx) => (
          <div
            key={topic.id}
            className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAF7F0] dark:hover:bg-[#18231B] transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="font-mono text-xs font-semibold text-[#85877B] dark:text-[#7A8C78] w-6 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-semibold text-[14px] text-[#202920] dark:text-[#EDEAE2] truncate">
                    {topic.name}
                  </span>
                  <span className="font-mono text-[10px] text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1F2E23] px-2 py-0.5 rounded-full font-bold">
                    {topic.growth}
                  </span>
                </div>
                <p className="text-[12px] text-[#62685E] dark:text-[#A4B3A2] truncate m-0 mt-0.5">
                  {topic.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => onFollow(topic.id)}
              className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors cursor-pointer shrink-0 border ${
                followed.has(topic.id)
                  ? "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80] border-[#66866A]/40 dark:border-[#4ADE80]/40"
                  : "bg-white dark:bg-[#18231B] text-[#202920] dark:text-[#EDEAE2] border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248] dark:hover:border-[#4ADE80]"
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
    <section className="p-6 rounded-2xl bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] shadow-2xs space-y-5">
      <div>
        <div className="font-mono text-xs text-[#3E6248] dark:text-[#4ADE80] font-bold uppercase tracking-wider mb-1">
          03 / Scholarly Relational Topology
        </div>
        <h2 className="font-serif text-[22px] font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight m-0">
          Cross-disciplinary research pathways
        </h2>
        <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans m-0 mt-0.5">
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
                  ? "bg-[#DCE6D7]/80 dark:bg-[#1F2E23] border-[#3E6248] dark:border-[#4ADE80] shadow-xs"
                  : "bg-[#FAF7F0] dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] hover:border-[#66866A]/60 dark:hover:border-[#4ADE80]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-transform ${
                    active === node.id
                      ? "bg-[#3E6248] dark:bg-[#4ADE80] scale-125"
                      : "bg-[#85877B] dark:text-[#7A8C78]"
                  }`}
                />
                <span
                  className={`font-sans text-[14px] ${
                    active === node.id
                      ? "font-bold text-[#202920] dark:text-[#EDEAE2]"
                      : "font-medium text-[#62685E] dark:text-[#A4B3A2]"
                  }`}
                >
                  {node.name}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#85877B] dark:text-[#7A8C78]">
                {node.papers} papers · {node.researchers} scholars
              </span>
            </button>
          ))}
        </div>

        {/* Selected Node Card */}
        <div className="md:col-span-4 p-5 rounded-xl bg-[#FAF7F0] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] flex flex-col justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] text-[#85877B] dark:text-[#7A8C78] uppercase tracking-wider font-semibold mb-1">
              Field Focus
            </div>
            <h4 className="font-serif text-[18px] font-bold text-[#202920] dark:text-[#EDEAE2] m-0">
              {activeNode.name}
            </h4>
            <p className="text-[12px] text-[#62685E] dark:text-[#A4B3A2] font-sans mt-2 mb-0">
              High cross-citation density connecting computational vision algorithms with clinical diagnostic trials.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E4DCCB] dark:border-[#233327]">
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327]">
              <div className="font-serif text-[16px] font-bold text-[#202920] dark:text-[#EDEAE2]">
                {activeNode.papers}
              </div>
              <div className="font-sans text-[10px] text-[#85877B] dark:text-[#7A8C78] uppercase">Papers</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327]">
              <div className="font-serif text-[16px] font-bold text-[#202920] dark:text-[#EDEAE2]">
                {activeNode.researchers}
              </div>
              <div className="font-sans text-[10px] text-[#85877B] dark:text-[#7A8C78] uppercase">Scholars</div>
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
        <div className="font-mono text-xs text-[#3E6248] dark:text-[#4ADE80] font-bold uppercase tracking-wider mb-1">
          04 / Serendipity Engine
        </div>
        <h2 className="font-serif text-[22px] font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight m-0">
          Unexpected cross-domain intersections
        </h2>
        <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans m-0 mt-0.5">
          Discover how external disciplines solve identical algorithmic constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UNEXPECTED_CONNECTIONS.map((uc) => (
          <div
            key={uc.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] hover:border-[#66866A] dark:hover:border-[#4ADE80]/50 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag label={uc.yourInterest} variant="sand" />
                <span className="text-[#85877B] dark:text-[#7A8C78] text-xs">→</span>
                <Tag label={uc.connectedField} variant="green" />
              </div>
              <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed m-0">
                {uc.reason}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-[12px] space-y-1">
              <div className="font-semibold text-[#202920] dark:text-[#EDEAE2] truncate">
                {uc.relatedPaper}
              </div>
              <div className="text-[#85877B] dark:text-[#7A8C78] font-mono text-[11px]">
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
  const user = useAuthStore((state) => state.user);
  const userInterests = user?.interests && user.interests.length > 0 ? user.interests : MY_INTERESTS;

  return (
    <div className="space-y-8">
      {/* Research Interests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-[15px] font-semibold text-[#202920] dark:text-[#EDEAE2] m-0">
            Your Research Core
          </h3>
          <Link
            href="/profile"
            className="text-[11px] font-mono text-[#3E6248] dark:text-[#4ADE80] hover:underline cursor-pointer border-0 bg-transparent no-underline"
          >
            Edit
          </Link>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {userInterests.map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-1 rounded-full text-[11.5px] font-sans bg-[#F2EBDD] dark:bg-[#18231B] text-[#202920] dark:text-[#EDEAE2] border border-[#E4DCCB] dark:border-[#28382C] hover:border-[#3E6248] transition-colors cursor-default"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-[#E4DCCB] dark:bg-[#233327]" />

      {/* Suggested Researchers to explore */}
      <div>
        <div className="mb-3">
          <h3 className="font-serif text-[15px] font-semibold text-[#202920] dark:text-[#EDEAE2] m-0">
            Scholars to Explore
          </h3>
          <p className="text-[11px] text-[#85877B] dark:text-[#7A8C78] font-sans m-0 mt-0.5">
            Matching your citation network
          </p>
        </div>

        <div className="space-y-2.5">
          {SUGGESTED_RESEARCHERS.map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between gap-3 hover:border-[#66866A]/60 dark:hover:border-[#4ADE80]/50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#DCE6D7] dark:bg-[#1F2E23] border border-[#66866A]/30 dark:border-[#4ADE80]/30 flex items-center justify-center text-[#3E6248] dark:text-[#4ADE80] text-xs font-bold shrink-0">
                  {r.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[#202920] dark:text-[#EDEAE2] truncate font-sans">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-[#85877B] dark:text-[#7A8C78] truncate font-sans">
                    {r.area}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onFollow(r.id)}
                className={`p-1.5 rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer shrink-0 border ${
                  followed.has(r.id)
                    ? "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80] border-[#66866A]/40 dark:border-[#4ADE80]/40"
                    : "bg-[#FAF7F0] dark:bg-[#131C15] text-[#62685E] dark:text-[#A4B3A2] border-[#E4DCCB] dark:border-[#233327] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                {followed.has(r.id) ? (
                  <Check className="w-3.5 h-3.5 text-[#3E6248] dark:text-[#4ADE80]" />
                ) : (
                  <span className="text-xs px-1">+</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-[#E4DCCB] dark:bg-[#233327]" />

      {/* Recently Viewed */}
      <div>
        <h3 className="font-serif text-[15px] font-semibold text-[#202920] dark:text-[#EDEAE2] mb-3 m-0">
          Recently Inspected
        </h3>
        <div className="space-y-2">
          {RECENTLY_VIEWED.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg hover:bg-white dark:hover:bg-[#18231B] border border-transparent hover:border-[#E4DCCB] dark:hover:border-[#233327] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80] font-bold">
                  {item.type}
                </span>
              </div>
              <div className="text-[12.5px] text-[#62685E] dark:text-[#A4B3A2] group-hover:text-[#202920] dark:group-hover:text-[#EDEAE2] font-sans leading-snug line-clamp-2">
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

  const itemType = (item as any).type || ((item as any).worksCount !== undefined ? "researcher" : (item as any).growth !== undefined ? "topic" : "item");

  const title =
    itemType === "paper"
      ? (item as any).title
      : itemType === "researcher"
      ? (item as any).name
      : itemType === "topic"
      ? (item as any).name
      : itemType === "book"
      ? (item as ScholarlyBook).title
      : itemType === "dataset" || itemType === "software"
      ? (item as ResearchArtifact).title
      : (item as any).name || (item as any).title || "Research Item";

  return (
    <div
      className="fixed inset-0 z-50 bg-[#202920]/40 dark:bg-black/60 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF7F0] dark:bg-[#131C15] h-full shadow-2xl border-l border-[#E4DCCB] dark:border-[#233327] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E4DCCB] dark:border-[#233327] pb-4">
            <Tag
              label={itemType.toUpperCase()}
              variant={
                itemType === "book"
                  ? "amber"
                  : itemType === "dataset" || itemType === "software"
                  ? "blue"
                  : "green"
              }
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] text-[#85877B] dark:text-[#7A8C78] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23] cursor-pointer bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="font-serif text-[24px] font-semibold text-[#202920] dark:text-[#EDEAE2] leading-snug m-0">
              {title}
            </h2>
            {itemType === "paper" && (
              <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans mt-2">
                {((item as any).authors || []).join(", ")} · {(item as any).venue || "Scholarly Index"}
              </p>
            )}
            {itemType === "book" && (
              <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans mt-2">
                {((item as any).authors || []).join(", ")} · {(item as any).publisher || "Academic Press"} ({(item as any).year})
              </p>
            )}
            {(itemType === "dataset" || itemType === "software") && (
              <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans mt-2">
                {((item as any).creators || []).join(", ")} · Zenodo ({(item as any).publicationDate})
              </p>
            )}
            {itemType === "researcher" && (
              <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans mt-2">
                {(item as any).institution} · {(item as any).role || "Researcher"}
              </p>
            )}
          </div>

          {itemType === "paper" && (
            <div className="p-4 rounded-xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] space-y-2">
              <div className="font-mono text-[10px] text-[#85877B] dark:text-[#7A8C78] uppercase tracking-wider font-semibold">
                Abstract
              </div>
              <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed m-0">
                {(item as any).abstract}
              </p>
            </div>
          )}

          {itemType === "book" && (
            <div className="p-4 rounded-xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] space-y-2">
              <div className="font-mono text-[10px] text-[#85877B] dark:text-[#7A8C78] uppercase tracking-wider font-semibold">
                Monograph Overview
              </div>
              <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed m-0">
                {(item as any).abstract}
              </p>
              {(item as any).isbn && (
                <div className="pt-2 font-mono text-xs text-[#85877B] dark:text-[#7A8C78]">
                  ISBN: {(item as any).isbn}
                </div>
              )}
            </div>
          )}

          {(itemType === "dataset" || itemType === "software") && (
            <div className="p-4 rounded-xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] space-y-2">
              <div className="font-mono text-[10px] text-[#85877B] dark:text-[#7A8C78] uppercase tracking-wider font-semibold">
                Artifact Documentation
              </div>
              <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed m-0">
                {(item as any).description}
              </p>
              <div className="pt-2 font-mono text-xs text-[#3E6248] dark:text-[#4ADE80]">
                Citable DOI: {(item as any).doi}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] flex flex-wrap items-center justify-between gap-3">
          {itemType === "paper" || itemType === "book" || itemType === "dataset" || itemType === "software" ? (
            <button
              onClick={() => onSave(item.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3E6248] dark:bg-[#2D583B] text-[#FAF7F0] text-sm font-semibold hover:bg-[#293E30] dark:hover:bg-[#386D49] transition-colors border-0 cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>{saved ? "Saved in Reading List" : "Save to Canvas"}</span>
            </button>
          ) : (
            <button
              onClick={() => onFollow(item.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3E6248] dark:bg-[#2D583B] text-[#FAF7F0] text-sm font-semibold hover:bg-[#293E30] dark:hover:bg-[#386D49] transition-colors border-0 cursor-pointer"
            >
              <span>{followed ? "Following" : "Follow"}</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            {(item as any).openUrl && (
              <a
                href={(item as any).openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#62685E] dark:text-[#A4B3A2] hover:text-[#202920] dark:hover:text-[#EDEAE2] px-3 py-2 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] no-underline"
              >
                <span>Open Catalog</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {(item as any).doiUrl && (
              <a
                href={(item as any).doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#62685E] dark:text-[#A4B3A2] hover:text-[#202920] dark:hover:text-[#EDEAE2] px-3 py-2 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] no-underline"
              >
                <span>View DOI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <Link
              href={`/agent-reader?title=${encodeURIComponent(title)}&doi=${encodeURIComponent((item as any).doi || "")}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FAF7F0] bg-[#3E6248] dark:bg-[#2D583B] hover:bg-[#293E30] dark:hover:bg-[#386D49] px-4 py-2 rounded-xl transition-colors no-underline shadow-xs"
            >
              <span>Analyze in Reader</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
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
  const [showProfileBanner, setShowProfileBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const isDismissed = sessionStorage.getItem("cambium_dismiss_profile_prompt") === "true";
        const isLocked = localStorage.getItem("cambium_profile_locked") === "true";
        if (!isDismissed && !isLocked) {
          setShowProfileBanner(true);
        }
      } catch {}
    }
  }, []);

  const user = useAuthStore((state) => state.user);

  // Live Scholarly Data State (OpenAlex, Europe PMC, arXiv, Crossref, DOAJ, Open Library, Zenodo)
  const [livePapers, setLivePapers] = useState<ScholarlyWork[]>([]);
  const [liveResearchers, setLiveResearchers] = useState<ScholarlyAuthor[]>([]);
  const [liveTopics, setLiveTopics] = useState<ScholarlyTopic[]>([]);
  const [liveBooks, setLiveBooks] = useState<ScholarlyBook[]>([]);
  const [liveArtifacts, setLiveArtifacts] = useState<ResearchArtifact[]>([]);
  const [activeQuery, setActiveQuery] = useState("");
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2400);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const loadScholarlyData = async () => {
      setIsSearchingLive(true);
      try {
        const defaultUserTopic = user?.interests && user.interests.length > 0 ? user.interests[0] : "artificial intelligence";
        const queryToUse = activeQuery || activeArea || defaultUserTopic;
        const sortType =
          activeSort === "Most cited"
            ? "cited"
            : activeSort === "Newest"
            ? "newest"
            : "relevance";
        const [works, authors, topics, books, artifacts] = await Promise.all([
          fetchScholarlyWorks({ query: queryToUse, sort: sortType, limit: 8 }),
          fetchScholarlyResearchers(queryToUse, 4),
          fetchTrendingTopics(),
          fetchOpenAccessBooks(queryToUse, 4),
          fetchResearchArtifacts(queryToUse, 4),
        ]);
        if (!isCancelled) {
          setLivePapers(works);
          setLiveResearchers(authors);
          setLiveTopics(topics);
          setLiveBooks(books);
          setLiveArtifacts(artifacts);
        }
      } catch {
        // Fallback handled in scholarly-api
      } finally {
        if (!isCancelled) setIsSearchingLive(false);
      }
    };
    loadScholarlyData();
    return () => {
      isCancelled = true;
    };
  }, [activeQuery, activeArea, activeSort, user?.interests]);
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
    <div className="flex flex-1 h-screen overflow-hidden bg-[#FAF7F0] dark:bg-[#0E140F] font-sans">
      {/* Center content stream (Expands to fill all available space, properly responsive) */}
      <main
        id="main-content"
        className="flex-1 min-w-0 h-screen overflow-y-auto px-6 sm:px-10 lg:px-12 py-8"
        aria-label="Discovery feed"
      >
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <header className="space-y-3">
            {showProfileBanner && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#DCE6D7] to-[#FAF7F0] dark:from-[#1A281E] dark:to-[#121B14] border border-[#66866A]/40 dark:border-[#4ADE80]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-serif font-bold text-[#202920] dark:text-[#EDEAE2] block">
                      Complete your Scholarly Identity
                    </span>
                    <span className="text-[11px] text-[#62685E] dark:text-[#A3B899] font-sans block mt-0.5">
                      Calibrate your research vectors and ORCID to unlock personalized funding matches and peer discovery.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <Link
                    href="/profile"
                    className="px-3 py-1 rounded-full bg-[#3E6248] hover:bg-[#2d4734] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 shadow-2xs no-underline"
                  >
                    <span>Complete Profile</span>
                    <ArrowUpRight size={12} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileBanner(false);
                      try {
                        sessionStorage.setItem("cambium_dismiss_profile_prompt", "true");
                      } catch {}
                    }}
                    className="p-1 rounded-lg text-[#85877B] hover:text-[#202920] dark:hover:text-[#EDEAE2] transition-colors cursor-pointer border-0 bg-transparent"
                    aria-label="Dismiss banner"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
            <h1 className="font-serif text-[32px] md:text-[38px] font-normal leading-[1.14] tracking-[-0.02em] text-[#202920] dark:text-[#EDEAE2] m-0">
              Explore what&apos;s happening in research.
            </h1>
            <p className="text-[15px] text-[#62685E] dark:text-[#A4B3A2] font-sans leading-relaxed max-w-2xl m-0">
              Find papers, open-access books, software artifacts, researchers, and emerging topics connected to your research canvas across 250M+ open scholarly records.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex flex-col gap-2">
                <AiAutocompleteInput
                  placeholder="Search 120M+ preprints, topics, and grants with AI autocomplete (Try 'quantum', 'crispr', 'deep')..."
                  mode="search"
                  onSelect={(query) => {
                    setActiveQuery(query);
                    showToast(`AI Autocomplete: "${query}"`);
                  }}
                />
              </div>
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
            <div className="flex items-center justify-between">
              <div>
                <h2
                  id="recommended-heading"
                  className="font-serif text-[22px] font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight m-0"
                >
                  Recommended for you
                </h2>
                <p className="text-[13px] text-[#62685E] dark:text-[#A4B3A2] font-sans m-0 mt-0.5">
                  Live scholarly catalog from OpenAlex, Europe PMC, Open Library, and CERN Zenodo.
                </p>
              </div>
              {isSearchingLive && (
                <span className="text-xs font-mono text-[#3E6248] dark:text-[#4ADE80] animate-pulse bg-[#DCE6D7] dark:bg-[#1F2E23] px-2.5 py-1 rounded-full border border-[#66866A]/30 dark:border-[#4ADE80]/30">
                  Syncing live catalog...
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* Papers (Shown in "All" and "Papers") */}
              {(activeType === "All" || activeType === "Papers") &&
                (livePapers.length > 0 ? livePapers : PAPER_CARDS).map((p) => (
                  <PaperCardComponent
                    key={p.id}
                    data={p}
                    onOpen={setDetailItem}
                    onSave={handleSave}
                    onShare={() => showToast("Citation and link copied to clipboard")}
                    saved={savedItems.has(p.id)}
                  />
                ))}

              {/* Books (Shown in "All" and "Books") */}
              {(activeType === "All" || activeType === "Books") &&
                liveBooks.map((b) => (
                  <BookCardComponent
                    key={b.id}
                    data={b}
                    onOpen={setDetailItem}
                    onSave={handleSave}
                    onShare={() => showToast("Book title and open catalog link copied")}
                    saved={savedItems.has(b.id)}
                  />
                ))}

              {/* Research Data & Code Artifacts (Shown in "All" and "Datasets & Code") */}
              {(activeType === "All" || activeType === "Datasets & Code") &&
                liveArtifacts.map((a) => (
                  <ArtifactCardComponent
                    key={a.id}
                    data={a}
                    onOpen={setDetailItem}
                    onSave={handleSave}
                    onShare={() => showToast("Artifact DOI copied to clipboard")}
                    saved={savedItems.has(a.id)}
                  />
                ))}

              {/* Researchers & Topics (Shown in "All", "Researchers", "Topics") */}
              {(activeType === "All" || activeType === "Researchers" || activeType === "Topics") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeType === "All" || activeType === "Researchers") &&
                    (liveResearchers.length > 0 ? liveResearchers : RESEARCHER_CARDS).map((r) => (
                      <ResearcherCardComponent
                        key={r.id}
                        data={r}
                        onOpen={setDetailItem}
                        followed={followedItems.has(r.id)}
                        onFollow={handleFollow}
                      />
                    ))}
                  {(activeType === "All" || activeType === "Topics") &&
                    (liveTopics.length > 0 ? liveTopics : TOPIC_CARDS).map((t) => (
                      <TopicCardComponent
                        key={t.id}
                        data={t}
                        onOpen={setDetailItem}
                        followed={followedItems.has(t.id)}
                        onFollow={handleFollow}
                      />
                    ))}
                </div>
              )}

              {/* Labs (Shown in "All" and "Labs") */}
              {(activeType === "All" || activeType === "Labs") &&
                LAB_CARDS.map((l) => (
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
        className="w-[320px] xl:w-[350px] shrink-0 h-screen overflow-y-auto border-l border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] p-6 hidden lg:block"
        aria-label="Research context & interests"
      >
        <RightRail followed={followedItems} onFollow={handleFollow} />
      </aside>

      {/* Overlays */}
      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onSearch={(q) => {
            setActiveQuery(q);
            showToast(`Searching OpenAlex for "${q}"...`);
          }}
        />
      )}

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
