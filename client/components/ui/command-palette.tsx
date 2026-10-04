"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  Compass,
  Sparkles,
  User,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Layers,
  Settings,
  FolderGit2,
  Calendar,
  X,
  History,
  Command,
} from "lucide-react";

export type PaletteCategory =
  | "all"
  | "pages"
  | "papers"
  | "opportunities"
  | "researchers"
  | "actions";

export interface PaletteItem {
  id: string;
  category: "pages" | "papers" | "opportunities" | "researchers" | "actions";
  title: string;
  subtitle: string;
  href?: string;
  badge?: string;
  action?: () => void;
  keywords?: string[];
}

const ITEMS: PaletteItem[] = [
  // PAGES
  {
    id: "p-workspace",
    category: "pages",
    title: "Scholar Workspace",
    subtitle: "Active research notebooks, synthesis canvas, and graph notes",
    href: "/workspace",
    badge: "PAGE",
    keywords: ["editor", "notes", "canvas", "write", "draft"],
  },
  {
    id: "p-discover",
    category: "pages",
    title: "Discover Research Engine",
    subtitle: "Global literature exploration and semantic paper finder",
    href: "/discover",
    badge: "PAGE",
    keywords: ["search", "papers", "literature", "preprints", "arxiv"],
  },
  {
    id: "p-opportunities",
    category: "pages",
    title: "Opportunities & Grants Directory",
    subtitle: "Track live research fellowships, funding calls, and lab openings",
    href: "/opportunities",
    badge: "PAGE",
    keywords: ["grants", "funding", "fellowships", "nsf", "horizon"],
  },
  {
    id: "p-intelligence",
    category: "pages",
    title: "Research Intelligence & Graph",
    subtitle: "Field topology, laboratory clusters, and funding flows",
    href: "/intelligence",
    badge: "PAGE",
    keywords: ["topology", "network", "clusters", "insights"],
  },
  {
    id: "p-portfolio",
    category: "pages",
    title: "Scholar Research Portfolio",
    subtitle: "Curated publications, contribution calender, and metrics",
    href: "/portfolio",
    badge: "PAGE",
    keywords: ["cv", "publications", "profile", "github", "contributions"],
  },
  {
    id: "p-os",
    category: "pages",
    title: "Personal Research OS",
    subtitle: "System telemetry, task workflows, and active sprint pipelines",
    href: "/os",
    badge: "PAGE",
    keywords: ["tasks", "streak", "system", "logs", "metrics"],
  },
  {
    id: "p-changelog",
    category: "pages",
    title: "Changelog & Release Catalog",
    subtitle: "Explore v1.4.0 updates and upcoming platform milestones",
    href: "/changelog",
    badge: "PAGE",
    keywords: ["updates", "versions", "notes", "roadmap"],
  },
  {
    id: "p-settings",
    category: "pages",
    title: "Platform Settings & Security",
    subtitle: "API tokens, institutional SSO, and workspace preferences",
    href: "/settings",
    badge: "PAGE",
    keywords: ["profile", "sso", "security", "preferences", "account"],
  },
  {
    id: "p-about",
    category: "pages",
    title: "About Cambium",
    subtitle: "Institutional philosophy, team, and architecture note from builder",
    href: "/about",
    badge: "PAGE",
    keywords: ["builder", "shaik", "mission", "company"],
  },
  {
    id: "p-careers",
    category: "pages",
    title: "Careers & Open Inquiries",
    subtitle: "Explore 6 active research tracks and collaborative roles",
    href: "/careers",
    badge: "PAGE",
    keywords: ["jobs", "openings", "hire", "contribute"],
  },
  {
    id: "p-contact",
    category: "pages",
    title: "Contact & Institutional Inquiries",
    subtitle: "Direct channels for labs, universities, and researchers",
    href: "/contact",
    badge: "PAGE",
    keywords: ["help", "email", "reach", "support"],
  },

  // PAPERS & PREPRINTS
  {
    id: "pap-1",
    category: "papers",
    title: "Attention Is All You Need",
    subtitle: "Vaswani et al. · NIPS 2017 · 142k citations · Transformer architecture",
    href: "/reader",
    badge: "PAPER",
    keywords: ["transformer", "llm", "deep learning", "nlp"],
  },
  {
    id: "pap-2",
    category: "papers",
    title: "Living Mycelium Architectural Scaffolds for Carbon Capture",
    subtitle: "Rostova et al. · Nature Materials 2026 · 1.4k citations",
    href: "/reader",
    badge: "PAPER",
    keywords: ["bio", "materials", "mycelium", "climate", "carbon"],
  },
  {
    id: "pap-3",
    category: "papers",
    title: "AlphaFold 3: Accurate Structure Prediction of Biomolecular Complexes",
    subtitle: "Abramson et al. · Nature 2024 · 22k citations · Protein folding",
    href: "/reader",
    badge: "PAPER",
    keywords: ["alphafold", "protein", "dna", "biology"],
  },
  {
    id: "pap-4",
    category: "papers",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    subtitle: "Lewis et al. · NeurIPS 2020 · 18k citations · Hybrid vector search",
    href: "/reader",
    badge: "PAPER",
    keywords: ["rag", "retrieval", "vector", "search"],
  },

  // OPPORTUNITIES & GRANTS
  {
    id: "opp-1",
    category: "opportunities",
    title: "Horizon Europe: Quantum Materials & Scalable Coherence",
    subtitle: "€4,200,000 · Deadline: Nov 15, 2026 · European Research Council",
    href: "/opportunities",
    badge: "GRANT",
    keywords: ["europe", "erc", "quantum", "physics"],
  },
  {
    id: "opp-2",
    category: "opportunities",
    title: "NSF Bio-Inspired Computing & Neuromorphic Arrays",
    subtitle: "$2,850,000 · Deadline: Dec 01, 2026 · National Science Foundation",
    href: "/opportunities",
    badge: "GRANT",
    keywords: ["nsf", "usa", "neuromorphic", "biology"],
  },
  {
    id: "opp-3",
    category: "opportunities",
    title: "Wellcome Trust Discovery Award: Microbial Genetic Networks",
    subtitle: "£1,750,000 · Deadline: Jan 20, 2027 · Wellcome Trust UK",
    href: "/opportunities",
    badge: "GRANT",
    keywords: ["wellcome", "uk", "genetics", "microbial"],
  },

  // RESEARCHERS
  {
    id: "res-1",
    category: "researchers",
    title: "Dr. Elena Rostova",
    subtitle: "Lead Scientist, Living Architecture Lab · ETH Zürich",
    href: "/portfolio",
    badge: "SCHOLAR",
    keywords: ["eth", "zurich", "materials", "bio"],
  },
  {
    id: "res-2",
    category: "researchers",
    title: "Shaik Mohamed Imthiyas",
    subtitle: "Builder & Lead Architect of Cambium · Research OS Infrastructure",
    href: "/about",
    badge: "BUILDER",
    keywords: ["founder", "architect", "engineer", "cambium"],
  },
  {
    id: "res-3",
    category: "researchers",
    title: "Marcus Thorne, PhD",
    subtitle: "Principal Investigator · Harvard Quantum Informatics Initiative",
    href: "/portfolio",
    badge: "SCHOLAR",
    keywords: ["harvard", "quantum", "thorne"],
  },

  // ACTIONS
  {
    id: "act-1",
    category: "actions",
    title: "New Research Note",
    subtitle: "Open a fresh notebook scratchpad in Workspace",
    href: "/workspace",
    badge: "ACTION",
    keywords: ["create", "new", "scratchpad", "draft"],
  },
  {
    id: "act-2",
    category: "actions",
    title: "Export Citation Graph as BibTeX",
    subtitle: "Download all workspace references in standardized format",
    badge: "ACTION",
    keywords: ["export", "bibtex", "cite", "download"],
  },
  {
    id: "act-3",
    category: "actions",
    title: "System Status & Telemetry",
    subtitle: "Verify live cluster uptime and response latency",
    href: "/status",
    badge: "ACTION",
    keywords: ["uptime", "health", "telemetry", "status"],
  },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PaletteCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Attention Is All You Need",
    "Horizon Europe Quantum",
    "Living Architecture Lab",
  ]);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cambium_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Global hotkey: Cmd+K / Ctrl+K and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setActiveCategory("all");
    }
  }, [isOpen]);

  // Filter items based on activeCategory and search query
  const filteredItems = ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;

    const q = query.toLowerCase().trim();
    if (!q) return matchesCategory;

    const inTitle = item.title.toLowerCase().includes(q);
    const inSubtitle = item.subtitle.toLowerCase().includes(q);
    const inKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));

    return matchesCategory && (inTitle || inSubtitle || inKeywords);
  });

  // Keep selected index in bounds
  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(0);
    }
  }, [filteredItems.length, selectedIndex]);

  // Keyboard navigation within the modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length > 0
          ? (prev - 1 + filteredItems.length) % filteredItems.length
          : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        handleExecute(current);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const categories: PaletteCategory[] = [
        "all",
        "pages",
        "papers",
        "opportunities",
        "researchers",
        "actions",
      ];
      const curIdx = categories.indexOf(activeCategory);
      const nextIdx = e.shiftKey
        ? (curIdx - 1 + categories.length) % categories.length
        : (curIdx + 1) % categories.length;
      setActiveCategory(categories[nextIdx]);
      setSelectedIndex(0);
    }
  };

  const saveRecentSearch = (text: string) => {
    if (!text.trim()) return;
    const updated = [text.trim(), ...recentSearches.filter((s) => s !== text.trim())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("cambium_recent_searches", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleExecute = (item: PaletteItem) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    setIsOpen(false);

    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "pages":
        return <Layers size={15} className="text-[#3E6248]" />;
      case "papers":
        return <BookOpen size={15} className="text-[#204033]" />;
      case "opportunities":
        return <Sparkles size={15} className="text-amber-700" />;
      case "researchers":
        return <User size={15} className="text-[#3E6248]" />;
      default:
        return <Command size={15} className="text-[#62685E]" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#17201D]/55 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E4DCCB] bg-white">
          <Search size={18} className="text-[#3E6248] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search papers, grants, scholars, pages, or commands..."
            className="flex-1 text-[15px] font-sans font-medium text-[#202920] placeholder:text-[#85877B] bg-transparent outline-none border-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-[#85877B] hover:text-[#202920] transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E] shrink-0">
            Esc
          </span>
        </div>

        {/* Dedicated Category Pills */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FAF7F0] border-b border-[#E4DCCB] overflow-x-auto text-xs font-sans">
          {[
            { id: "all", label: "All Items" },
            { id: "pages", label: "Pages" },
            { id: "papers", label: "Papers" },
            { id: "opportunities", label: "Grants" },
            { id: "researchers", label: "Scholars" },
            { id: "actions", label: "Actions" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as PaletteCategory);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                activeCategory === cat.id
                  ? "bg-[#3E6248] text-white shadow-2xs font-semibold"
                  : "bg-white text-[#62685E] hover:text-[#202920] border border-[#E4DCCB]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Scroll Area */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 divide-y divide-transparent space-y-1"
        >
          {/* If query is empty, show recent searches strip */}
          {!query && recentSearches.length > 0 && activeCategory === "all" && (
            <div className="px-3 py-2 mb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#85877B] mb-2 font-semibold">
                <History size={12} />
                <span>Recent Inquiries</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(term);
                      setSelectedIndex(0);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#E4DCCB] text-xs font-sans text-[#202920] hover:border-[#3E6248] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredItems.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => handleExecute(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? "bg-white border-l-4 border-[#3E6248] shadow-xs text-[#202920]"
                    : "hover:bg-white/60 text-[#202920]/80"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F0] border border-[#E4DCCB] flex items-center justify-center shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[15px] font-medium text-[#202920] truncate">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span
                          className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded font-bold ${
                            item.badge === "GRANT"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : item.badge === "PAPER"
                              ? "bg-[#DCE6D7] text-[#293E30] border border-[#66866A]/30"
                              : "bg-[#F3EFE6] text-[#62685E] border border-[#E4DCCB]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-[#62685E] truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-mono text-[#3E6248] transition-opacity flex items-center gap-1 ${
                      isSelected ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span>Open</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 px-6">
              <Compass size={24} className="mx-auto text-[#85877B] mb-2" />
              <p className="font-serif text-base text-[#202920]">
                No matching research artifacts found
              </p>
              <p className="font-serif text-xs text-[#62685E] mt-1 max-w-sm mx-auto">
                No local nodes matched &ldquo;{query}&rdquo;. Try searching across arXiv or PubMed via the Discover engine.
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/discover?q=${encodeURIComponent(query)}`);
                }}
                className="mt-4 bg-[#3E6248] text-white px-4 py-1.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <span>Launch Search in Discover</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Footer Keybinding Hints */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-white border-t border-[#E4DCCB] text-[11px] font-mono text-[#85877B]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#FAF7F0] border border-[#E4DCCB] font-semibold text-[#202920]">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#FAF7F0] border border-[#E4DCCB] font-semibold text-[#202920]">
                ↵
              </kbd>{" "}
              Select
            </span>
            <span className="flex items-center gap-1 hidden sm:inline-flex">
              <kbd className="px-1.5 py-0.5 rounded bg-[#FAF7F0] border border-[#E4DCCB] font-semibold text-[#202920]">
                Tab
              </kbd>{" "}
              Cycle Category
            </span>
          </div>

          <span className="text-[#3E6248] font-semibold">Cambium Core Search</span>
        </div>
      </div>
    </div>
  );
}
