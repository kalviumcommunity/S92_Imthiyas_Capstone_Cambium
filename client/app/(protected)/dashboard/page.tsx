"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  MessageSquare,
  Plus,
  Download,
  SlidersHorizontal,
  Sparkles,
  Heart,
  MessageCircle,
  Repeat2,
  ExternalLink,
  ArrowRight,
  BookOpen as BookOpenIcon,
  Cpu,
  Leaf,
  Bookmark,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AttentionCardData {
  badge: string;
  title: string;
  description: string;
  match: number;
  meta: string;
  authors?: string;
}

interface FeedItem {
  initials: string;
  badgeLabel: string;
  author: string;
  role: string;
  date: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
  reposts: number;
  tags: string[];
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ATTENTION_CARDS: AttentionCardData[] = [
  {
    badge: "OPPORTUNITY",
    title: "NSF Graduate Research Fellowship — Climate AI Track",
    description:
      "Applications open for the 2027 cohort. Strong alignment with your work on predictive ecological modeling and ML-driven climate data pipelines.",
    match: 94,
    meta: "Deadline: Oct 18, 2026 · $37,000/yr",
  },
  {
    badge: "PAPER",
    title: "Emergent Representations in Sparse Transformer Architectures",
    description:
      "A preprint from DeepMind explores how sparse attention heads develop structured internal representations without explicit supervision — directly relevant to your Chapter 3.",
    match: 88,
    meta: "arXiv · Sep 9, 2026",
    authors: "Park et al. · DeepMind",
  },
  {
    badge: "COLLABORATION",
    title: "Cross-disciplinary group: Language Models for Climate Risk",
    description:
      "A new working group at the intersection of NLP and climate science is forming ahead of NeurIPS 2026. 11 researchers already enrolled.",
    match: 91,
    meta: "Virtual · Kickoff Oct 2, 2026",
  },
  {
    badge: "DATASET",
    title: "ERA5-ML: High-Resolution Reanalysis Embeddings (2000–2025)",
    description:
      "ECMWF releases a new embedding-first version of ERA5, pre-processed for direct ingestion into ML pipelines — covers the time range of your dissertation study.",
    match: 85,
    meta: "6.4 TB · CC BY 4.0 · ecmwf.int",
    authors: "ECMWF Copernicus Team",
  },
];

const FOR_YOU_ITEMS: FeedItem[] = [
  {
    initials: "JL",
    badgeLabel: "RESEARCH UPDATE",
    author: "Dr. James Liu",
    role: "Stanford · Climate Informatics",
    date: "2h ago",
    title: "New findings on feedback loops in Arctic sea-ice extent under SSP5-8.5",
    body: "We've been running updated CESM2 simulations incorporating new albedo parameterizations. Early results suggest non-linear tipping behaviour appearing 8–12 years earlier than IPCC AR6 projections. Preprint incoming this week.",
    likes: 47,
    comments: 12,
    reposts: 9,
    tags: ["climateml", "arcticice", "CESM2"],
  },
  {
    initials: "NK",
    badgeLabel: "PAPER DISCUSSION",
    author: "Nadia Kowalski",
    role: "PhD Candidate · Oxford",
    date: "5h ago",
    title: 'Thoughts on "Scaling Laws for Biological Sequence Models" (Nguyen et al., 2026)',
    body: "The analogy to LLM scaling laws is compelling, but I think the authors underestimate the distribution shift problem in cross-species transfer. Happy to share annotated notes — DM me or comment below.",
    likes: 31,
    comments: 24,
    reposts: 6,
    tags: ["bioinformatics", "scalinglaws", "sequencemodels"],
  },
  {
    initials: "RV",
    badgeLabel: "OPEN QUESTION",
    author: "Rajan Varma",
    role: "Postdoc · MPI-IS",
    date: "Yesterday",
    title: "What evaluation protocols do you trust for long-horizon climate forecasting?",
    body: "Benchmark fragmentation in the climate-ML space is getting worse. We're building an evaluation toolkit and would love input from practitioners before we finalize the metric set. What do you actually trust in your own work?",
    likes: 62,
    comments: 38,
    reposts: 17,
    tags: ["evaluation", "climateforecasting", "openscience"],
  },
];

const FOLLOWING_ITEMS: FeedItem[] = [
  {
    initials: "AR",
    badgeLabel: "COLLABORATOR PREPRINT",
    author: "Dr. Aisha Rahman",
    role: "MIT CSAIL · Computational Linguistics",
    date: "45m ago",
    title: "Latent Alignment in Cross-Modal Scientific Foundations: From Genes to Text",
    body: "Delighted to share our preprint with Jonas Keller's lab! We map latent manifold representations of biochemical sequences directly to natural language descriptions with 94.2% retrieval accuracy on benchmarks.",
    likes: 89,
    comments: 21,
    reposts: 34,
    tags: ["multimodal", "genomics", "representationlearning"],
  },
  {
    initials: "JK",
    badgeLabel: "METHODOLOGY NOTE",
    author: "Prof. Jonas Keller",
    role: "ETH Zürich · Environmental AI",
    date: "3h ago",
    title: "Validation protocols for high-dimensional spatiotemporal kriging",
    body: "Our lab has released a standardized Python package for spatial cross-validation under non-stationary covariate distributions. Tested across 40 years of European meteorological telemetry.",
    likes: 54,
    comments: 16,
    reposts: 12,
    tags: ["spatialstatistics", "geospatial", "opensource"],
  },
  {
    initials: "SC",
    badgeLabel: "BENCHMARK RELEASE",
    author: "Sophia Chen",
    role: "Stanford University · AI for Science",
    date: "6h ago",
    title: "Carbon-Eval: An empirical benchmark for transformer inference energy cost",
    body: "We evaluated 18 open foundation models across 5 hardware architectures to calculate FLOP-to-carbon coefficients. Full dataset and code repository are now public on Cambium OS.",
    likes: 112,
    comments: 42,
    reposts: 28,
    tags: ["greenai", "benchmarking", "sustainability"],
  },
];

const TRENDING_ITEMS: FeedItem[] = [
  {
    initials: "NC",
    badgeLabel: "NATURE BREAKTHROUGH",
    author: "Nature Computational Science",
    role: "Editorial Spotlight · Published Today",
    date: "1h ago",
    title: "De Novo Design of Macrocyclic Inhibitors Guided by Diffusion Priors",
    body: "A milestone study demonstrating atomically verified binding affinity for targeted oncology therapeutics designed entirely via continuous-time diffusion models without crystal seed structures.",
    likes: 248,
    comments: 87,
    reposts: 95,
    tags: ["drugdiscovery", "diffusionmodels", "biophysics"],
  },
  {
    initials: "ML",
    badgeLabel: "OPEN ACCESS DISPATCH",
    author: "Open Science Collective",
    role: "Global Research Network",
    date: "4h ago",
    title: "NIH & Horizon Europe Announce Unified Open Data Standard for 2027",
    body: "Starting January 2027, all funded researchers must provide machine-actionable metadata and raw tensor checkpoints in FAIR-compliant repositories with persistent cryptographic verification.",
    likes: 183,
    comments: 65,
    reposts: 74,
    tags: ["policy", "openscience", "FAIRdata"],
  },
  {
    initials: "EP",
    badgeLabel: "NEURIPS SPOTLIGHT",
    author: "Elena Petrova",
    role: "Oxford University · Vector Institute",
    date: "7h ago",
    title: "Equivariant Graph Neural Networks for Dynamic Atmospheric Flow",
    body: "By enforcing SO(3) symmetry constraints directly into the message-passing layers, our model tracks turbulent eddy propagation with 100x lower variance than standard numerical PDE integrators.",
    likes: 139,
    comments: 29,
    reposts: 41,
    tags: ["geometricdl", "climateai", "pdelearning"],
  },
];

const EVENTS = [
  { month: "SEP", day: 14, title: "NeurIPS Paper Deadline", time: "11:59 PM AoE", type: "Deadline" },
  { month: "SEP", day: 18, title: "Lab Meeting — Climate Models", time: "2:00 PM · Zoom", type: "Meeting" },
  { month: "SEP", day: 22, title: "EMNLP Early Submission", time: "5:00 PM PST", type: "Deadline" },
];

const RESEARCHERS = [
  { initials: "AR", name: "Dr. Aisha Rahman", role: "Computational Linguistics · MIT" },
  { initials: "JK", name: "Prof. Jonas Keller", role: "Climate Informatics · ETH Zürich" },
  { initials: "SC", name: "Sophia Chen", role: "AI for Science · Stanford" },
];

const EXPLORING = [
  { icon: Cpu, label: "Large Language Models in Biology" },
  { icon: Leaf, label: "Carbon Capture via ML Optimization" },
  { icon: BookOpenIcon, label: "Preprints: September 2026" },
];

const FEED_TABS = ["For You", "Following", "Trending"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AttentionCard({ badge, title, description, match, meta, authors }: AttentionCardData) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl p-5 h-full transition-all duration-200 cursor-pointer bg-white border border-[#E4DCCB] hover:border-[#66866A] shadow-2xs hover:shadow-md">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider bg-[#F2EBDD] text-[#3E6248] font-mono border border-[#E4DCCB]">
          {badge}
        </span>
        <span className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#DCE6D7] text-[#202920] border border-[#66866A]/30">
          <span className="rounded-full w-1.5 h-1.5 bg-[#3E6248] animate-pulse" />
          {match}% match
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-[17px] font-semibold leading-snug text-[#202920] m-0">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[13px] leading-relaxed flex-1 text-[#62685E] font-sans m-0">
        {description}
      </p>

      {/* Footer */}
      <div className="flex flex-col gap-1 pt-2.5 border-t border-[#E4DCCB]/60">
        {authors && <p className="text-xs text-[#85877B] font-sans truncate m-0">{authors}</p>}
        <p className="text-xs text-[#3E6248] font-sans font-medium m-0">{meta}</p>
      </div>
    </div>
  );
}

function FeedItemCard({ initials, badgeLabel, author, role, date, title, body, likes, comments, reposts, tags }: FeedItem) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <article className="py-6 border-b border-[#E4DCCB] last:border-b-0">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex items-center justify-center rounded-full text-xs font-bold w-8 h-8 bg-[#DCE6D7] text-[#3E6248] font-sans border border-[#66866A]/40 shrink-0 mt-0.5">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold rounded-full px-2 py-0.5 uppercase tracking-wider bg-[#F2EBDD] text-[#3E6248] border border-[#E4DCCB] font-mono">
              {badgeLabel}
            </span>
            <span className="text-xs text-[#85877B]">·</span>
            <span className="text-xs text-[#85877B] font-mono">{date}</span>
          </div>
          <p className="text-xs font-semibold text-[#202920] font-sans mt-0.5 m-0">
            {author}{" "}
            <span className="font-normal text-[#85877B]">· {role}</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="pl-11">
        <h4 className="font-serif text-[18px] font-semibold text-[#202920] leading-snug mb-2 m-0">
          {title}
        </h4>
        <p className="text-[13.5px] text-[#62685E] leading-relaxed font-sans mb-3 m-0">
          {body}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-[#F2EBDD] text-[#62685E] font-mono hover:text-[#202920] border border-[#E4DCCB] cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5 pt-1">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer border-0 bg-transparent ${
              liked ? "text-[#B33D35] font-medium" : "text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} strokeWidth={1.5} />
            {likes + (liked ? 1 : 0)}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-[#62685E] hover:text-[#202920] transition-colors cursor-pointer border-0 bg-transparent">
            <MessageCircle size={15} strokeWidth={1.5} />
            {comments}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-[#62685E] hover:text-[#202920] transition-colors cursor-pointer border-0 bg-transparent">
            <Repeat2 size={15} strokeWidth={1.5} />
            {reposts}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-1.5 text-xs ml-auto transition-colors cursor-pointer border-0 bg-transparent ${
              saved ? "text-[#3E6248] font-medium" : "text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <header className="h-16 px-8 bg-[#FAF7F0] border-b border-[#E4DCCB] sticky top-0 z-10 flex items-center justify-between gap-4">
      {/* Left: Context Indicator to balance center search */}
      <div className="hidden md:flex items-center gap-2.5 min-w-[220px] shrink-0">
        <span className="w-2 h-2 rounded-full bg-[#66866A] animate-pulse" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E6248]">
          Live Research Desk
        </span>
      </div>

      {/* Center Search Bar - Perfectly centered in top margin without entering body */}
      <div className="flex-1 max-w-[540px] mx-auto flex items-center gap-2 rounded-xl px-3.5 py-2 bg-white border border-[#E4DCCB] hover:border-[#66866A]/60 focus-within:border-[#3E6248] focus-within:ring-2 focus-within:ring-[#3E6248]/15 transition-all shadow-2xs">
        <Search size={15} className="text-[#85877B] shrink-0" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search 240M+ papers, researchers, topics, grants…"
          className="flex-1 bg-transparent text-sm text-[#202920] placeholder:text-[#85877B] outline-none font-sans"
          aria-label="Search"
        />
        <span className="text-[10px] font-mono font-medium rounded px-1.5 py-0.5 text-[#62685E] bg-[#F2EBDD] border border-[#E4DCCB]">
          ⌘K
        </span>
      </div>

      {/* Right Controls - Balanced min-w to preserve center alignment */}
      <div className="flex items-center justify-end gap-3 min-w-[220px] shrink-0">
        <Link
          href="/notifications"
          className="relative p-2 rounded-xl text-[#62685E] hover:text-[#202920] hover:bg-[#F2EBDD] transition-colors cursor-pointer no-underline"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#3E6248] ring-2 ring-[#FAF7F0]" />
        </Link>

        <Link
          href="/intelligence"
          className="relative p-2 rounded-xl text-[#62685E] hover:text-[#202920] hover:bg-[#F2EBDD] transition-colors cursor-pointer no-underline"
          aria-label="Intelligence Assistant"
        >
          <Sparkles size={18} strokeWidth={1.5} className="text-[#3E6248]" />
        </Link>

        <div className="h-5 w-px bg-[#E4DCCB] mx-1" />

        <Link
          href="/profile"
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F2EBDD] transition-colors no-underline"
        >
          <div className="w-8 h-8 rounded-full bg-[#DCE6D7] text-[#3E6248] font-bold text-xs flex items-center justify-center border border-[#66866A]/40">
            IM
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-[#202920] leading-none">Imthiyas</span>
            <span className="block text-[10px] text-[#85877B] leading-none mt-1 font-sans">MIT CSAIL · Postdoc</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function MainContent() {
  const [activeTab, setActiveTab] = useState("For You");

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const currentFeed =
    activeTab === "Following"
      ? FOLLOWING_ITEMS
      : activeTab === "Trending"
      ? TRENDING_ITEMS
      : FOR_YOU_ITEMS;

  return (
    <main className="flex-1 overflow-y-auto bg-[#FAF7F0] min-w-0" tabIndex={-1}>
      <div className="max-w-[880px] px-8 py-8 mx-auto">
        {/* Welcome Greeting (Clean without duplicate search above it) */}

        {/* Welcome Greeting (30% larger) */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[52px] font-normal text-[#202920] leading-[1.12] tracking-tight mb-2">
            {greeting}, <span className="italic text-[#3E6248]">Imthiyas.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#62685E] font-sans">
            Here is your live research synthesis and active scholarly horizon for {dateStr}.
          </p>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2.5 mb-8 flex-wrap">
          {[
            { icon: Plus, label: "New Hypothesis", href: "/workspace" },
            { icon: Download, label: "Import Literature", href: "/workspace" },
            { icon: SlidersHorizontal, label: "Refine Topics", href: "/discover" },
            { icon: Sparkles, label: "Ask Cambium AI", href: "/intelligence" },
          ].map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#202920] bg-white border border-[#E4DCCB] hover:bg-[#F2EBDD] hover:border-[#3E6248] transition-all cursor-pointer shadow-2xs no-underline"
            >
              <Icon size={14} className="text-[#3E6248]" strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Section: Needs Attention */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#202920] leading-tight m-0">
                Needs your attention
              </h2>
              <p className="text-xs text-[#62685E] font-sans mt-0.5 m-0">
                High-confidence matches for your active research vectors
              </p>
            </div>
            <Link href="/discover" className="text-xs text-[#3E6248] hover:underline font-semibold font-sans no-underline flex items-center gap-1">
              View all 8 matches <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ATTENTION_CARDS.map((card) => (
              <AttentionCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* Section: Community Feed */}
        <section>
          {/* Feed Tabs Header */}
          <div className="flex items-center justify-between border-b border-[#E4DCCB] mb-2">
            <div className="flex items-center gap-6">
              {FEED_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-sans font-semibold transition-colors cursor-pointer border-0 bg-transparent border-b-2 -mb-px ${
                    activeTab === tab
                      ? "text-[#202920] border-[#3E6248]"
                      : "text-[#85877B] border-transparent hover:text-[#202920]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <Link
              href="/workspace"
              className="text-xs text-[#3E6248] hover:underline font-medium font-sans pb-3 flex items-center gap-1 no-underline"
            >
              Filter Feed <SlidersHorizontal size={11} />
            </Link>
          </div>

          {/* Feed List */}
          <div className="bg-white rounded-2xl border border-[#E4DCCB] px-6 shadow-2xs divide-y divide-[#E4DCCB]">
            {currentFeed.map((item) => (
              <FeedItemCard key={item.title} {...item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function RightPanel() {
  return (
    <aside className="w-[300px] xl:w-[330px] border-l border-[#E4DCCB] bg-[#FAF7F0] p-6 hidden lg:flex flex-col gap-7 overflow-y-auto shrink-0">
      {/* Calendar & Deadlines */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#3E6248] m-0">
            Upcoming Deadlines
          </p>
          <Link href="/workspace" className="text-xs text-[#85877B] hover:text-[#202920] transition-colors font-medium no-underline">
            Calendar
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {EVENTS.map((ev) => (
            <div
              key={ev.title}
              className="flex items-start gap-3 rounded-xl p-3 bg-white border border-[#E4DCCB] hover:border-[#66866A]/60 transition-colors shadow-2xs"
            >
              <div className="flex flex-col items-center justify-center rounded-lg w-10 h-10 bg-[#F2EBDD] border border-[#E4DCCB] shrink-0 text-center">
                <span className="text-[9px] font-bold font-mono text-[#85877B] leading-none uppercase">
                  {ev.month}
                </span>
                <span className="font-serif text-lg font-bold text-[#3E6248] leading-none mt-0.5">
                  {ev.day}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-xs font-semibold text-[#202920] font-sans leading-snug truncate m-0">
                  {ev.title}
                </p>
                <p className="text-[11px] text-[#85877B] font-sans m-0">{ev.time}</p>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.2 mt-1 self-start font-mono ${
                    ev.type === "Deadline"
                      ? "bg-[#B33D35]/10 text-[#B33D35]"
                      : "bg-[#DCE6D7] text-[#3E6248]"
                  }`}
                >
                  {ev.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Researchers you may know */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#3E6248] m-0">
            Scholars You May Know
          </p>
          <Link href="/discover" className="text-xs flex items-center gap-1 text-[#85877B] hover:text-[#3E6248] transition-colors no-underline font-medium">
            Explore <ArrowRight size={11} />
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {RESEARCHERS.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-3 rounded-xl p-3 bg-white border border-[#E4DCCB] shadow-2xs"
            >
              <div className="rounded-full flex items-center justify-center text-xs font-bold w-8 h-8 bg-[#DCE6D7] text-[#3E6248] font-sans border border-[#66866A]/40 shrink-0">
                {r.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#202920] font-sans truncate m-0">{r.name}</p>
                <p className="text-[11px] text-[#85877B] font-sans truncate m-0">{r.role}</p>
              </div>
              <button className="text-xs rounded-full px-3 py-1 border border-[#E4DCCB] bg-[#FAF7F0] hover:border-[#3E6248] text-[#202920] font-medium transition-colors cursor-pointer shrink-0">
                + Connect
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Continue exploring */}
      <section>
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#3E6248] mb-3 m-0">
          Curated Vectors
        </p>
        <div className="flex flex-col gap-1.5">
          {EXPLORING.map(({ icon: Icon, label }) => (
            <Link
              key={label}
              href="/discover"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-[#62685E] hover:text-[#202920] hover:bg-white transition-colors w-full cursor-pointer text-xs font-medium no-underline border border-transparent hover:border-[#E4DCCB]"
            >
              <Icon size={14} className="text-[#3E6248] shrink-0" strokeWidth={1.5} />
              <span className="flex-1 truncate">{label}</span>
              <ExternalLink size={11} className="text-[#85877B] shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-[#FAF7F0] font-sans">
      <TopBar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <MainContent />
        <RightPanel />
      </div>
    </div>
  );
}
