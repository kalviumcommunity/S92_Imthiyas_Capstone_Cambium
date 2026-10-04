"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  GitBranch,
  Search,
  CheckCircle2,
  ArrowRight,
  Filter,
  ExternalLink,
  Shield,
  Layers,
  Zap,
} from "lucide-react";

interface ReleaseItem {
  id: number;
  date: string;
  version: string;
  codename?: string;
  title: string;
  latest: boolean;
  category: "Major" | "Minor" | "Patch";
  image?: {
    src: string;
    alt: string;
  } | null;
  tags: { label: string; style: "new" | "improved" | "fixed" }[];
  body: string;
  highlights: string[];
  moduleUrl?: string;
  moduleLabel?: string;
}

const releases: ReleaseItem[] = [
  {
    id: 1,
    date: "September 12, 2026",
    version: "Cambium 1.4.0",
    codename: "Constellation Search",
    title: "Enhanced Global Command Palette & Research Search",
    latest: true,
    category: "Major",
    image: {
      src: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1000&h=460&fit=crop&auto=format",
      alt: "Global search interface showing universal command palette in Cambium",
    },
    tags: [
      { label: "New Feature", style: "new" },
      { label: "Universal Command Palette (⌘K)", style: "new" },
      { label: "Semantic Ranking", style: "improved" },
    ],
    body: "Cambium 1.4 introduces a redesigned global search experience built around a universal command palette. Reach any research paper, opportunity cluster, scholar profile, annotation, or workspace action from a single keystroke — ⌘K or Ctrl+K from anywhere in the platform. Results are ranked by semantic relevance, grant deadlines, and personal citation graphs.",
    highlights: [
      "Dedicated multi-domain search tabs: Papers, Opportunities, Researchers, Actions, and Navigation",
      "Instant keyboard navigation (↑/↓, Enter to select, Tab to cycle categories, Esc to dismiss)",
      "Persistent recent searches and quick command history saved locally in scholar state",
      "Contextual quick jump to /workspace, /discover, /intelligence, and /portfolio directly",
    ],
    moduleUrl: "/discover",
    moduleLabel: "Try Command Palette in Discover",
  },
  {
    id: 2,
    date: "August 28, 2026",
    version: "Cambium 1.3.2",
    codename: "Federated Identity",
    title: "Institutional Single Sign-On & Large Dataset Virtualization",
    latest: false,
    category: "Minor",
    image: null,
    tags: [
      { label: "Enterprise SSO", style: "new" },
      { label: "Virtual Grid 4× Speed", style: "improved" },
      { label: "Security & SAML", style: "improved" },
    ],
    body: "Academic departments and research institutions on Cambium can now provision seamless access through their university identity providers — Okta, Azure AD, InCommon, and Google Workspace. In addition, dataset rendering for opportunity catalogs exceeding 50,000 entries has been rewritten with dynamic virtual scrolling, cutting initial memory footprint by 65%.",
    highlights: [
      "SAML 2.0, EduGAIN, and OIDC institutional single sign-on support",
      "Automatic researcher role provisioning via SCIM directory sync",
      "Virtual rendering for citation graphs and opportunity catalogs up to 100k nodes",
      "Fine-grained laboratory permissions and departmental billing tracking",
    ],
    moduleUrl: "/settings",
    moduleLabel: "View SSO in Settings",
  },
  {
    id: 3,
    date: "August 5, 2026",
    version: "Cambium 1.2.0",
    codename: "Living Annotation",
    title: "Collaborative Annotation Layer & Citation Cross-Linking",
    latest: false,
    category: "Major",
    image: {
      src: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1000&h=460&fit=crop&auto=format",
      alt: "Collaborative annotation view showing highlighted text with team comments",
    },
    tags: [
      { label: "Collaboration", style: "new" },
      { label: "Threaded Citations", style: "new" },
      { label: "Latency Fix", style: "fixed" },
    ],
    body: "Real-time scholar annotation is now available across all literature formats — arXiv preprints, PubMed abstracts, and attached PDF datasets. Highlight passages, attach structured research notes, and cross-reference lab hypotheses inline. Annotations are versioned alongside the artifact so teams can reconstruct how their literature review crystallized over time.",
    highlights: [
      "Threaded scholar comments anchored to exact sentence and paragraph offsets",
      "Bidirectional export to Obsidian, Notion, and plain BibTeX/Markdown notes",
      "Zero-conflict live synchronization with optimistic UI rollbacks",
      "Resolved edge-case sync race condition during transient offline disconnects",
    ],
    moduleUrl: "/workspace",
    moduleLabel: "Explore Workspace Notebooks",
  },
  {
    id: 4,
    date: "July 14, 2026",
    version: "Cambium 1.1.0",
    codename: "Graph Atlas",
    title: "Citation Topology Graph & Research Opportunity Clustering",
    latest: false,
    category: "Major",
    image: null,
    tags: [
      { label: "Graph Engine", style: "new" },
      { label: "Taxonomy Clusters", style: "new" },
      { label: "Parser Stability", style: "fixed" },
    ],
    body: "The Citation Topology Graph maps the intellectual lineage of any paper — upstream foundation models, lateral methodologies, and downstream citations — rendered as an interactive force-directed canvas. Explore how ideas propagate between biomedical fields, synthetic biology, and quantum computing.",
    highlights: [
      "Bidirectional citation traversal up to 3 degrees of separation with depth filtering",
      "Author co-citation and funding body clustering for community discovery",
      "Robust parser error boundary for malformed BibTeX and RIS files",
      "Interactive SVG node highlight and researcher co-author pathfinding",
    ],
    moduleUrl: "/intelligence",
    moduleLabel: "Launch Intelligence Graph",
  },
];

export default function ChangelogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredReleases = releases.filter((rel) => {
    const matchesCategory =
      selectedCategory === "All" || rel.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesText =
      rel.version.toLowerCase().includes(query) ||
      rel.title.toLowerCase().includes(query) ||
      rel.body.toLowerCase().includes(query) ||
      (rel.codename && rel.codename.toLowerCase().includes(query)) ||
      rel.highlights.some((h) => h.toLowerCase().includes(query)) ||
      rel.tags.some((t) => t.label.toLowerCase().includes(query));

    return matchesCategory && matchesText;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F0] text-[#202920] selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      {/* Top Header & Breadcrumb */}
      <div className="border-b border-[#E4DCCB] bg-white/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#85877B]">
            <Link href="/workspace" className="hover:text-[#3E6248] no-underline text-[#85877B]">
              Workspace
            </Link>
            <span>/</span>
            <span className="text-[#202920] font-semibold">Changelog & Release Catalog</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30">
            <span className="w-2 h-2 rounded-full bg-[#3E6248] animate-pulse" />
            <span className="font-mono text-[11px] font-semibold text-[#293E30] uppercase tracking-wider">
              Current Build: v1.4.0 (Production)
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        {/* Editorial Page Header */}
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-4">
            <Sparkles size={12} className="text-[#3E6248]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Product Catalog // Release Notes
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-[#202920] mb-4">
            System evolution & <br className="hidden sm:block" />
            <span className="italic text-[#3E6248]">release catalog</span>.
          </h1>

          <p className="font-serif text-[17px] text-[#62685E] leading-relaxed">
            Every update to the Cambium Research Operating System is documented here with architecture notes, functional changes, and direct links to live tools.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-12 p-4 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["All", "Major", "Minor"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#3E6248] text-[#FAF7F0] shadow-xs"
                    : "bg-[#FAF7F0] text-[#62685E] hover:text-[#202920] border border-[#E4DCCB]"
                }`}
              >
                {cat === "All" ? "All Releases" : `${cat} Releases`}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85877B]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search release highlights..."
              className="w-full pl-9 pr-4 py-2 text-xs font-sans text-[#202920] placeholder:text-[#85877B] bg-[#FAF7F0] border border-[#E4DCCB] rounded-full focus:outline-none focus:border-[#3E6248] transition-colors"
            />
          </div>
        </div>

        {/* Releases Timeline & Cards */}
        <div className="relative pl-0 sm:pl-8">
          {/* Vertical spine indicator */}
          <div className="hidden sm:block absolute left-2.5 top-4 bottom-12 w-[1px] bg-[#E4DCCB]" />

          <div className="space-y-12">
            {filteredReleases.map((release) => (
              <div key={release.id} className="relative flex flex-col sm:flex-row gap-6 items-start">
                {/* Timeline node */}
                <div className="hidden sm:flex absolute -left-8 top-6 items-center justify-center">
                  {release.latest ? (
                    <div className="w-5 h-5 rounded-full bg-[#3E6248] border-4 border-[#FAF7F0] shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-[#85877B] shadow-2xs" />
                  )}
                </div>

                {/* Release Card */}
                <div className="w-full rounded-2xl border border-[#E4DCCB] bg-white p-6 sm:p-9 shadow-sm hover:border-[#3E6248]/40 transition-all">
                  {/* Top metadata strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#E4DCCB]">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-[#DCE6D7] text-[#293E30] tracking-wide">
                        {release.version}
                      </span>
                      {release.codename && (
                        <span className="font-mono text-xs text-[#85877B] hidden sm:inline">
                          Codename: <strong className="text-[#202920] font-sans">{release.codename}</strong>
                        </span>
                      )}
                      {release.latest && (
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Latest Release
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-[#85877B] uppercase tracking-wider">
                      {release.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#202920] mb-3">
                    {release.title}
                  </h2>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {release.tags.map((tag, tIdx) => {
                      const styles = {
                        new: "bg-[#DCE6D7]/70 text-[#293E30] border border-[#66866A]/30",
                        improved: "bg-[#FAF7F0] text-[#62685E] border border-[#E4DCCB]",
                        fixed: "bg-amber-50 text-amber-900 border border-amber-200",
                      }[tag.style];
                      return (
                        <span
                          key={tIdx}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${styles}`}
                        >
                          {tag.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Image showcase if present */}
                  {release.image && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-[#E4DCCB] relative h-64 sm:h-72 w-full bg-[#FAF7F0]">
                      <img
                        src={release.image.src}
                        alt={release.image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Narrative Body */}
                  <p className="font-serif text-[16px] text-[#202920]/90 leading-relaxed mb-6">
                    {release.body}
                  </p>

                  {/* Key Highlights */}
                  <div className="p-5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] mb-6">
                    <span className="font-mono text-[11px] font-semibold text-[#3E6248] uppercase tracking-wider block mb-3">
                      Key Upgrades & Architecture Changes
                    </span>
                    <ul className="space-y-2.5 font-serif text-sm text-[#202920] list-none p-0 m-0">
                      {release.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-[#3E6248] mt-0.5 shrink-0" />
                          <span className="leading-snug">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Link to Module */}
                  {release.moduleUrl && (
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                      <Link
                        href={release.moduleUrl}
                        className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#3E6248] hover:text-[#293E30] transition-colors"
                      >
                        <span>{release.moduleLabel || "Explore Updated Surface"}</span>
                        <ArrowRight size={13} />
                      </Link>

                      <div className="font-mono text-[11px] text-[#85877B]">
                        Build verification: Passed automated telemetry
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredReleases.length === 0 && (
              <div className="text-center py-16 p-8 rounded-2xl bg-white border border-[#E4DCCB]">
                <Filter size={28} className="mx-auto text-[#85877B] mb-3" />
                <h3 className="font-serif text-xl font-normal text-[#202920]">
                  No matching releases found
                </h3>
                <p className="font-serif text-sm text-[#62685E] mt-1 mb-4">
                  No release entries matched your search query &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="bg-[#3E6248] text-white px-5 py-2 rounded-full font-sans text-xs font-semibold uppercase tracking-wider"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Catalog Note */}
        <div className="mt-16 p-8 rounded-2xl bg-white border border-[#E4DCCB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-xl font-normal text-[#202920]">
              Upcoming Research OS Milestones
            </h4>
            <p className="font-serif text-sm text-[#62685E] mt-1 max-w-xl">
              Preview scheduled capabilities including autonomous grant deadline trackers, multi-agent literature synthesizers, and laboratory inventory connectors.
            </p>
          </div>

          <Link
            href="/help"
            className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] px-6 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-2 no-underline border border-[#66866A]/30 shrink-0 shadow-xs"
          >
            <span>Documentation & Support</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
