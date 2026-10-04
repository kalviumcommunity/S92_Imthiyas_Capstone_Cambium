"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Bookmark,
  ExternalLink,
  Check,
  Copy,
  Download,
  Mail,
  UserPlus,
  Users,
  Award,
  BookOpen,
  Sparkles,
  ArrowRight,
  Star,
  GitFork,
  Calendar,
  Flame,
  ShieldCheck,
  Globe,
  FileText,
  Clock,
  Compass,
} from "lucide-react";

// ─── Static Data (Preserved & Extended) ────────────────────────────────────────

const TOPICS = [
  { label: "Medical Imaging", primary: true },
  { label: "Computer Vision", primary: false },
  { label: "Machine Learning", primary: false },
  { label: "Federated Learning", primary: false },
  { label: "Deep Learning", primary: false },
  { label: "Healthcare AI", primary: false },
];

const PINNED_ARTIFACTS = [
  {
    name: "foundation-medical-vision",
    badge: "Public Preprint · Code",
    desc: "Lightweight Vision Transformer foundation model for zero-shot clinical tomography and multi-center MRI segmentation.",
    field: "Medical AI",
    fieldColor: "#3E6248",
    lang: "PyTorch · Python",
    langColor: "#3572A5",
    citations: 148,
    replications: 32,
    license: "Apache-2.0",
    href: "/workspace",
  },
  {
    name: "clinical-segmentation-fl",
    badge: "Published in MICCAI",
    desc: "Federated learning pipeline preserving patient confidentiality across heterogeneous hospital imaging clusters without central data sharing.",
    field: "Federated Learning",
    fieldColor: "#66866A",
    lang: "Python · MONAI",
    langColor: "#3572A5",
    citations: 86,
    replications: 24,
    license: "MIT",
    href: "/publications",
  },
  {
    name: "histopath-vit-adapt",
    badge: "Preprint · Dataset",
    desc: "Low-resource parameter-efficient fine-tuning (PEFT) benchmarks for gigapixel whole-slide histopathology biopsy triage.",
    field: "Histopathology",
    fieldColor: "#8A5A12",
    lang: "PyTorch · CUDA",
    langColor: "#3572A5",
    citations: 42,
    replications: 18,
    license: "CC-BY-4.0",
    href: "/workspace",
  },
  {
    name: "cambium-era5-telemetry",
    badge: "Open Benchmark",
    desc: "Empirical evaluation suite for transformer inference energy cost and continuous-time spatiotemporal diffusion kriging.",
    field: "Environmental ML",
    fieldColor: "#285C4D",
    lang: "Python · JAX",
    langColor: "#E5732F",
    citations: 29,
    replications: 14,
    license: "Open Data Commons",
    href: "/discover",
  },
];

const PUBLICATIONS = [
  {
    title: "Foundation Models for Medical Image Understanding",
    authors: ["Imthiyas", "Daniel Lee", "Priya Raman"],
    venue: "Journal of Medical AI",
    year: 2026,
    citations: 148,
    tags: ["Medical Imaging", "Foundation Models"],
  },
  {
    title: "Federated Learning for Privacy-Preserving Clinical Segmentation",
    authors: ["Imthiyas", "Elena Rodriguez", "Arjun Patel"],
    venue: "MICCAI 2025",
    year: 2025,
    citations: 86,
    tags: ["Federated Learning", "Segmentation"],
  },
  {
    title: "Low-Resource Adaptation of Vision Transformers for Histopathology",
    authors: ["Imthiyas", "James Wu"],
    venue: "Medical Image Analysis",
    year: 2024,
    citations: 42,
    tags: ["Computer Vision", "Histopathology"],
  },
];

const PROJECTS = [
  {
    name: "Low-Resource Medical Image Segmentation",
    status: "Active",
    description:
      "Developing lightweight segmentation models for medical imaging in environments with limited labeled data.",
    areas: ["Medical Imaging", "Computer Vision"],
    collaborators: ["Imthiyas", "Elena Rodriguez", "Arjun Patel"],
    updated: "2 hours ago",
  },
  {
    name: "Clinical Vision Benchmark",
    status: "Completed",
    description:
      "A standardized evaluation suite for clinical computer vision models across diverse imaging modalities.",
    areas: ["Medical AI", "Evaluation"],
    collaborators: ["Imthiyas", "James Wu"],
    updated: "3 months ago",
  },
  {
    name: "Multimodal Medical Report Generation",
    status: "Planning",
    description:
      "Exploring large multimodal models for automated radiology report generation from imaging data.",
    areas: ["Foundation Models", "NLP"],
    collaborators: ["Imthiyas"],
    updated: "1 week ago",
  },
];

const TIMELINE = [
  {
    year: "2026",
    event: "Started PhD research in Medical Imaging at AMET University & MIT CSAIL Affiliate",
    type: "milestone",
  },
  {
    year: "2025",
    event: "Published “Foundation Models for Medical Image Understanding” — Journal of Medical AI",
    type: "publication",
  },
  {
    year: "2025",
    event: "Joined AI & Medical Imaging Lab as Lead Fellow",
    type: "affiliation",
  },
  {
    year: "2024",
    event: "Research project: Low-Resource Clinical Vision with Massachusetts General Hospital",
    type: "project",
  },
  {
    year: "2023",
    event: "M.Tech in Computer Science — Specialization in Artificial Intelligence (Gold Medalist)",
    type: "milestone",
  },
];

const QUESTIONS = [
  {
    text: "How can medical vision models remain reliable when labeled clinical data is scarce?",
    links: ["3 papers", "2 projects", "1 experiment"],
  },
  {
    text: "Can federated learning improve privacy without sacrificing model performance in heterogeneous clinical settings?",
    links: ["2 papers", "1 collaboration"],
  },
  {
    text: "What evaluation metrics best capture the clinical utility of AI segmentation models?",
    links: ["4 papers", "1 dataset"],
  },
];

const EXPERTISE: Record<string, string[]> = {
  "Research Methods": [
    "Experimental Design",
    "Literature Review",
    "Statistical Analysis",
    "Model Evaluation",
    "Ablation Studies",
    "Reproducibility Audits",
  ],
  Technical: [
    "Python",
    "PyTorch",
    "JAX",
    "OpenCV",
    "SQL",
    "MONAI",
    "Weights & Biases",
    "Distributed Training",
  ],
  Academic: [
    "Scientific Writing",
    "LaTeX",
    "Peer Review",
    "Research Communication",
    "Grant Writing",
    "IRB Protocols",
  ],
};

const NETWORK = [
  {
    name: "Dr. Elena Rodriguez",
    role: "Associate Professor · Stanford Medicine",
    institution: "Stanford University",
    relation: "Co-author",
    initials: "ER",
    shared: "Federated Learning, Healthcare AI",
  },
  {
    name: "James Wu",
    role: "PhD Candidate · Harvard Medical School",
    institution: "Harvard University",
    relation: "Collaborator",
    initials: "JW",
    shared: "Histopathology, Computer Vision",
  },
  {
    name: "Arjun Patel",
    role: "Research Scientist · Google DeepMind",
    institution: "Google Research",
    relation: "Advisor",
    initials: "AP",
    shared: "Medical Imaging, Foundation Models",
  },
  {
    name: "Dr. Sofia Lindqvist",
    role: "Postdoc Fellow · Karolinska Institute",
    institution: "Karolinska Institutet",
    relation: "Peer Reviewer",
    initials: "SL",
    shared: "Oncology Imaging, Clinical Validation",
  },
];

const ACTIVITIES = [
  {
    type: "publication",
    action: "Published paper preprint",
    detail: "Foundation Models for Medical Image Understanding",
    time: "2 days ago",
  },
  {
    type: "note",
    action: "Shared research synthesis note",
    detail: "Notes on ViT attention shift in histopathology",
    time: "4 days ago",
  },
  {
    type: "experiment",
    action: "Started clinical experiment checkpoint",
    detail: "Low-data adaptation: ViT-Tiny on ISIC 2026",
    time: "1 week ago",
  },
  {
    type: "discussion",
    action: "Joined research symposium discussion",
    detail: "Multimodal approaches in radiology AI",
    time: "1 week ago",
  },
];

const ACTIVITY_COLORS: Record<string, string> = {
  publication: "#285C4D",
  note: "#1E5A72",
  experiment: "#856214",
  discussion: "#5E4A7D",
  collaboration: "#285C4D",
  question: "#856214",
};

const UPCOMING_CALENDAR = [
  { date: "Oct 18, 2026", title: "NSF AI Fellowship Submission", badge: "Grant Deadline", type: "deadline" },
  { date: "Oct 24, 2026", title: "MICCAI 2026 Camera Ready Draft", badge: "Conference", type: "conference" },
  { date: "Nov 02, 2026", title: "Clinical Cohort Sync — Stanford Lab", badge: "Meeting", type: "meeting" },
  { date: "Nov 15, 2026", title: "Nature Medicine Peer Review Due", badge: "Review", type: "review" },
];

function statusChip(status: string) {
  if (status === "Active")
    return "text-[#3E6248] bg-[#DCE6D7] border border-[#66866A]/30";
  if (status === "Completed")
    return "text-[#1E5A72] bg-[#E8F1F5] border border-[#1E5A72]/20";
  return "text-[#8A5A12] bg-[#F2EBDD] border border-[#8A5A12]/20";
}

function SectionHeading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#62685E] font-mono">
        {children}
      </h2>
      {action}
    </div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#202920]/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E4DCCB] p-7 w-full max-w-[440px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 id="share-title" className="font-serif text-xl font-normal text-[#202920]">
            Share Research Portfolio
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E6248] bg-[#DCE6D7] border border-[#66866A]/30 px-2.5 py-0.5 rounded-full font-mono">
            Public SSOT
          </span>
        </div>
        <p className="text-xs text-[#62685E] mb-5 leading-relaxed font-sans">
          Share your academic identity, verified publication matrix, and project codebases with collaborators and funding agencies.
        </p>

        <div className="bg-[#FAF7F0] border border-[#E4DCCB] rounded-xl p-4 mb-4">
          <div className="font-serif text-base font-semibold text-[#202920] leading-tight">
            Imthiyas, Ph.D.
          </div>
          <div className="text-xs text-[#62685E] mt-0.5 font-sans">
            Postdoc Fellow · Medical AI & Computer Vision
          </div>
          <div className="text-[11px] text-[#85877B] mt-0.5 font-sans">
            AMET University & MIT CSAIL Affiliate · Chennai, India
          </div>
        </div>

        <div className="space-y-2.5 mb-5">
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              copied
                ? "bg-[#DCE6D7] border-[#66866A] text-[#3E6248]"
                : "border-[#E4DCCB] text-[#202920] hover:bg-[#FAF7F0]"
            }`}
          >
            <span>{copied ? "Link copied to clipboard!" : "Copy portfolio link"}</span>
            {copied ? <Check size={14} className="text-[#3E6248]" /> : <Copy size={14} className="text-[#85877B]" />}
          </button>
          <button
            onClick={() => alert("Downloading verified dossier PDF...")}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold border border-[#E4DCCB] rounded-xl text-[#202920] hover:bg-[#FAF7F0] transition-all cursor-pointer"
          >
            <span>Download Research Dossier (PDF)</span>
            <Download size={14} className="text-[#85877B]" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-center text-xs font-medium text-[#85877B] hover:text-[#202920] transition-colors cursor-pointer py-1"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Research Activity Heatmap (GitHub-style) ─────────────────────────────────

function ContributionHeatmap() {
  const weeks = 52;
  const days = 7;
  const getLevel = (w: number, d: number) => {
    const val = (Math.sin(w * 0.38) + Math.cos(d * 0.72) + Math.sin(w * 0.14 + d * 0.9)) / 3;
    if (val > 0.42) return 4;
    if (val > 0.18) return 3;
    if (val > -0.06) return 2;
    if (val > -0.32) return 1;
    return 0;
  };

  const levelColors = [
    "bg-[#FAF7F0] border-[#E4DCCB]",
    "bg-[#DCE6D7] border-[#DCE6D7]",
    "bg-[#A3C4A8] border-[#A3C4A8]",
    "bg-[#66866A] border-[#66866A]",
    "bg-[#3E6248] border-[#293E30]",
  ];

  return (
    <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 shadow-2xs">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div>
          <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
            Research Cadence & Contribution Heatmap
          </h3>
          <p className="text-xs text-[#62685E] font-sans mt-0.5 m-0">
            1,482 verified scholarly actions (manuscript iterations, experiment checkpoints, peer reviews) in the past 52 weeks
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#3E6248] bg-[#DCE6D7] px-3 py-1 rounded-full border border-[#66866A]/30 font-semibold text-[11px] flex items-center gap-1.5">
            <Flame size={12} className="text-[#3E6248]" />
            18-Day Active Streak
          </span>
        </div>
      </div>

      {/* Grid container with horizontal scroll */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1 min-w-[760px]">
          {/* Month labels */}
          <div className="flex text-[10px] font-mono text-[#85877B] pl-7 justify-between pr-4 mb-1">
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
          </div>

          <div className="flex gap-2 items-center">
            {/* Day of week labels */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-[#85877B] h-[92px] pr-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* 52 columns of 7 days */}
            <div className="flex gap-[3.5px]">
              {Array.from({ length: weeks }).map((_, w) => (
                <div key={w} className="flex flex-col gap-[3.5px]">
                  {Array.from({ length: days }).map((_, d) => {
                    const level = getLevel(w, d);
                    return (
                      <div
                        key={d}
                        title={`Week ${w + 1}, Day ${d + 1}: ${level * 3 + (level > 0 ? 1 : 0)} research contributions`}
                        className={`w-[13px] h-[13px] rounded-[2.5px] border transition-transform hover:scale-125 hover:z-10 cursor-pointer ${levelColors[level]}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer legend */}
      <div className="flex items-center justify-between text-xs text-[#85877B] mt-4 pt-3 border-t border-[#E4DCCB]">
        <span>Verified cryptographic research momentum ledger</span>
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span>Less</span>
          {levelColors.map((cls, i) => (
            <div key={i} className={`w-3 h-3 rounded-[2px] border ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Portfolio Page ──────────────────────────────────────────────────────

export default function ResearchPortfolioPage() {
  const [following, setFollowing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [expertiseTab, setExpertiseTab] = useState("Research Methods");
  const [savedPubs, setSavedPubs] = useState<Set<number>>(new Set());
  const [hoveredNetwork, setHoveredNetwork] = useState<number | null>(null);

  function toggleSaved(i: number) {
    setSavedPubs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="flex-1 min-h-screen overflow-y-auto bg-[#FAF7F0] font-sans pb-24" tabIndex={-1}>
      <div className="max-w-[1180px] mx-auto px-6 sm:px-8 pt-6">

        {/* ── Top Breadcrumb Badge ── */}
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-wider uppercase text-[#3E6248]">
            <span className="w-2 h-2 rounded-full bg-[#66866A] animate-pulse" />
            Verified Academic Identity & Research Portfolio
          </div>
          <span className="text-[11px] font-mono text-[#85877B] hidden sm:inline">
            ORCID: 0000-0002-1825-0097
          </span>
        </div>

        {/* ── LinkedIn-Style Cover Banner & Overlapping Profile Card ── */}
        <div className="bg-white border border-[#E4DCCB] rounded-3xl overflow-hidden shadow-2xs mb-8">
          {/* Cover Banner (Rich Scholarly Geometric Art) */}
          <div className="h-44 sm:h-56 w-full relative overflow-hidden bg-gradient-to-r from-[#202920] via-[#2F4534] to-[#1E3827]">
            {/* Topological Manifold Lattice SVG Pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              viewBox="0 0 1000 300"
              fill="none"
              preserveAspectRatio="none"
            >
              <path d="M0,150 C300,50 600,250 1000,120 L1000,300 L0,300 Z" fill="#DCE6D7" />
              <path d="M0,80 C250,220 750,20 1000,180" stroke="#FAF7F0" strokeWidth="1.5" strokeDasharray="6 6" />
              <path d="M0,200 C350,120 650,280 1000,70" stroke="#66866A" strokeWidth="2" />
              <circle cx="280" cy="90" r="4" fill="#FAF7F0" />
              <circle cx="680" cy="190" r="5" fill="#DCE6D7" />
              <circle cx="820" cy="110" r="4" fill="#3E6248" />
            </svg>

            {/* Top Right Banner Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider font-semibold border border-white/30">
                Peer-Verified Academic Record
              </span>
            </div>
          </div>

          {/* Profile Card Body with Overlapping Avatar */}
          <div className="px-6 sm:px-8 pb-7 pt-2 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
              {/* Avatar Overlap */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-white bg-[#F2EBDD] shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Profile.png"
                    alt="Imthiyas"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-[#3E6248] border-2 border-white shadow-xs flex items-center justify-center text-white"
                  title="Active Academic Fellow"
                >
                  <Check size={11} strokeWidth={3} />
                </div>
              </div>

              {/* Action Buttons (LinkedIn style right aligned) */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setFollowing((f) => !f)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs font-mono uppercase tracking-wider ${
                    following
                      ? "bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/40"
                      : "bg-[#3E6248] hover:bg-[#202920] text-white border border-[#3E6248]"
                  }`}
                >
                  {following ? "✓ Connected" : "+ Connect"}
                </button>
                <button
                  onClick={() => alert("Direct messaging Imthiyas...")}
                  className="px-4 py-2 rounded-full text-xs font-semibold border border-[#E4DCCB] text-[#202920] bg-white hover:bg-[#FAF7F0] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail size={13} className="text-[#3E6248]" />
                  <span>Message</span>
                </button>
                <Link
                  href="/workspace"
                  className="px-4 py-2 rounded-full text-xs font-semibold border border-[#E4DCCB] text-[#202920] bg-white hover:bg-[#FAF7F0] transition-colors cursor-pointer flex items-center gap-1.5 no-underline"
                >
                  <Users size={13} className="text-[#3E6248]" />
                  <span>Collaborate</span>
                </Link>
                <button
                  onClick={() => setShareOpen(true)}
                  className="p-2 rounded-full text-[#62685E] hover:text-[#202920] hover:bg-[#FAF7F0] border border-[#E4DCCB] transition-colors cursor-pointer"
                  title="Share Profile"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Profile Identity Details */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] leading-tight m-0">
                    <span className="italic text-[#3E6248]">Imthiyas</span>, Ph.D.
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3E6248] bg-[#DCE6D7] border border-[#66866A]/30 px-2.5 py-0.5 rounded-full font-mono">
                    <ShieldCheck size={13} />
                    Verified Fellow
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[#202920] font-sans font-medium mt-1.5 leading-snug">
                  Lead Postdoctoral Fellow in Computational Radiology & Vision Transformers · MIT CSAIL & Broad Institute
                </p>

                <p className="text-xs text-[#62685E] mt-1 font-sans">
                  Ph.D. in Computer Science (Medical Imaging) · AMET University & MIT Affiliate · Chennai, India & Cambridge, MA
                </p>

                {/* Academic Outlinks */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs">
                  {[
                    { label: "ORCID", href: "https://orcid.org" },
                    { label: "Google Scholar", href: "#" },
                    { label: "GitHub: @imthiyas", href: "#" },
                    { label: "arXiv Preprints", href: "#" },
                    { label: "Contact Info", href: "#" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        if (link.href === "#") e.preventDefault();
                      }}
                      className="text-xs font-medium text-[#3E6248] hover:underline underline-offset-2 transition-colors inline-flex items-center gap-1"
                    >
                      <span>{link.label}</span>
                      <ExternalLink size={10} className="text-[#3E6248]/70" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Institutional Summary Box */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] md:w-72 shrink-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#85877B] font-bold mb-2">
                  Primary Affiliation
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#3E6248]/10 text-[#3E6248] flex items-center justify-center font-bold font-mono text-xs border border-[#3E6248]/20">
                    AU
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#202920]">AMET University</div>
                    <div className="text-[11px] text-[#62685E]">Dept. of Computer Science & AI</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar (GitHub & LinkedIn Style) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-[#E4DCCB]">
              {[
                { label: "Publications", value: "12", sub: "Peer-reviewed" },
                { label: "Citations", value: "420+", sub: "Across Google Scholar" },
                { label: "h-Index", value: "11", sub: "Scholarly impact" },
                { label: "Active Projects", value: "4", sub: "Workspace teams" },
                { label: "Research Streak", value: "18 Days", sub: "Consistent output" },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-[#FAF7F0]/60 border border-[#E4DCCB]/60 text-center">
                  <div className="font-serif text-xl sm:text-2xl font-normal text-[#202920] m-0">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-semibold text-[#3E6248] font-sans mt-0.5">{m.label}</div>
                  <div className="text-[10px] text-[#85877B] font-sans truncate">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section: Pinned Research Artifacts (GitHub-Style Cards) ── */}
        <section className="mb-8">
          <SectionHeading action={<Link href="/publications" className="text-xs text-[#3E6248] hover:underline font-semibold font-sans no-underline flex items-center gap-1">View all 12 artifacts <ArrowRight size={12} /></Link>}>
            Pinned Research Outputs & Codebases
          </SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PINNED_ARTIFACTS.map((item) => (
              <div
                key={item.name}
                className="p-5 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#66866A] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-[#3E6248]" />
                      <Link
                        href={item.href}
                        className="font-mono text-sm font-bold text-[#202920] group-hover:text-[#3E6248] transition-colors no-underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E]">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs text-[#62685E] font-sans leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-[#85877B] pt-3 border-t border-[#E4DCCB]/60 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] font-mono">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.langColor }} />
                      {item.lang}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono">
                      <Star size={12} className="text-[#8A5A12]" />
                      {item.citations} cit.
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono">
                      <GitFork size={12} />
                      {item.replications}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#85877B]">{item.license}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section: Contribution Heatmap (GitHub-Style) ── */}
        <section className="mb-8">
          <ContributionHeatmap />
        </section>

        {/* ── Section: Cambium Research Calendar Milestones ── */}
        <section className="mb-8">
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#3E6248]" />
                <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                  Upcoming Scholarly Milestones & Calendar Deadlines
                </h3>
              </div>
              <Link href="/os" className="text-xs font-semibold text-[#3E6248] hover:underline font-mono uppercase">
                Open Personal OS Calendar →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {UPCOMING_CALENDAR.map((cal) => (
                <div key={cal.title} className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#3E6248] uppercase tracking-wider">
                        {cal.badge}
                      </span>
                      <span className="text-[10px] font-mono text-[#85877B]">{cal.date}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#202920] font-sans leading-snug">
                      {cal.title}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#E4DCCB]/60 text-[10px] text-[#62685E] font-mono flex items-center gap-1">
                    <Clock size={10} />
                    <span>Synchronized with Personal OS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Two-Column Main Details Layout (All Original Content Preserved) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-8">

            {/* Research Focus Topics */}
            <section aria-labelledby="focus-heading">
              <SectionHeading>Research Focus & Taxonomic Vectors</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.label}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                      t.primary
                        ? "bg-[#3E6248] text-white border border-[#3E6248] font-semibold shadow-xs"
                        : "bg-white text-[#62685E] border border-[#E4DCCB] hover:border-[#66866A] hover:text-[#3E6248] hover:bg-[#FAF7F0]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Current Active Research */}
            <section className="bg-white border border-[#E4DCCB] rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#62685E] font-mono">
                  Current Primary Research
                </div>
                <span className="text-[10px] px-2.5 py-0.5 bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/30 rounded-full font-bold uppercase tracking-wider font-mono">
                  Active
                </span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#202920] leading-snug mb-2">
                Low-Resource Medical Image Segmentation
              </h3>
              <p className="text-sm text-[#62685E] leading-relaxed mb-5 font-sans">
                Developing lightweight vision transformer segmentation models for clinical tomography in environments with limited labeled radiologic data.
              </p>

              <div className="mb-4">
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#85877B] font-mono mb-2">
                  Active Hypotheses
                </div>
                <div className="space-y-2">
                  {[
                    "How can segmentation models perform reliably with limited labeled clinical data?",
                    "Can federated learning improve privacy while maintaining clinical calibration?",
                  ].map((q, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="text-[#3E6248] shrink-0 font-bold">—</span>
                      <span className="font-serif text-sm text-[#202920] italic leading-snug">
                        {q}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {[
                  "Computer Vision",
                  "Deep Learning",
                  "Federated Learning",
                  "Medical Image Analysis",
                ].map((m) => (
                  <span
                    key={m}
                    className="text-xs px-2.5 py-0.5 bg-[#FAF7F0] text-[#62685E] rounded-md border border-[#E4DCCB]"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#E4DCCB] text-xs">
                <Link
                  href="/workspace"
                  className="text-[#3E6248] font-semibold hover:underline underline-offset-2 no-underline"
                >
                  View Workspace Drafts →
                </Link>
                <span className="text-[#E4DCCB] select-none">·</span>
                <Link
                  href="/publications"
                  className="text-[#62685E] hover:text-[#202920] hover:underline underline-offset-2 no-underline"
                >
                  Associated Publications
                </Link>
              </div>
            </section>

            {/* Selected Publications Matrix */}
            <section>
              <SectionHeading action={<Link href="/publications" className="text-xs text-[#3E6248] hover:underline font-semibold font-sans no-underline">View full bibliography →</Link>}>
                Selected Publications
              </SectionHeading>
              <div className="space-y-3.5">
                {PUBLICATIONS.map((pub, i) => (
                  <article
                    key={i}
                    className="bg-white border border-[#E4DCCB] rounded-2xl p-5 hover:border-[#66866A] transition-all duration-200 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono font-bold text-[#3E6248]">{pub.year}</span>
                          <span className="text-[#85877B] text-xs">·</span>
                          <span className="text-xs font-medium text-[#62685E] italic">{pub.venue}</span>
                        </div>
                        <h4 className="font-serif text-lg font-normal text-[#202920] leading-snug mb-1.5">
                          {pub.title}
                        </h4>
                        <p className="text-xs text-[#85877B] font-sans mb-3">
                          {pub.authors.join(", ")}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {pub.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaved(i)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          savedPubs.has(i)
                            ? "bg-[#DCE6D7] border-[#66866A] text-[#3E6248]"
                            : "border-[#E4DCCB] text-[#85877B] hover:text-[#202920] hover:bg-[#FAF7F0]"
                        }`}
                        title={savedPubs.has(i) ? "Saved to workspace" : "Save to workspace"}
                      >
                        <Bookmark size={15} fill={savedPubs.has(i) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Research Journey / Career Timeline */}
            <section>
              <SectionHeading>Academic Milestones & Experience</SectionHeading>
              <div className="relative pl-6 bg-white border border-[#E4DCCB] rounded-2xl p-6 shadow-2xs">
                <div className="absolute left-[31px] top-8 bottom-8 w-px bg-[#E4DCCB]" />
                <div className="space-y-6">
                  {TIMELINE.map((item, i) => (
                    <div key={i} className="relative flex items-start gap-4">
                      <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#3E6248] mt-1 shrink-0 z-10" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono font-bold text-[#3E6248] tracking-wider mb-0.5">
                          {item.year}
                        </div>
                        <div className="text-xs text-[#202920] font-medium leading-snug">
                          {item.event}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Questions Exploring */}
            <section>
              <SectionHeading>Active Research Hypotheses Under Investigation</SectionHeading>
              <div className="space-y-3">
                {QUESTIONS.map((q, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#E4DCCB] rounded-2xl p-5 hover:border-[#66866A] transition-colors shadow-2xs"
                  >
                    <p className="font-serif text-base text-[#202920] leading-relaxed italic mb-3">
                      &ldquo;{q.text}&rdquo;
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {q.links.map((link) => (
                        <button
                          key={link}
                          className="text-xs font-semibold text-[#3E6248] bg-[#DCE6D7] border border-[#66866A]/30 px-2.5 py-0.5 rounded-full hover:underline transition-colors cursor-pointer"
                        >
                          {link}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN (Sidebar Stats & Network) ── */}
          <div className="space-y-6">

            {/* Contributions Breakdown */}
            <section className="bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-2xs">
              <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#62685E] font-mono mb-4">
                Research Ledger Summary
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: "Publications", count: 12 },
                  { label: "Active projects", count: 4 },
                  { label: "Research datasets", count: 8 },
                  { label: "Research notes", count: 23 },
                  { label: "Experiments", count: 31 },
                  { label: "Discussions", count: 17 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="text-[#62685E]">{item.label}</span>
                    <span className="font-mono font-bold text-[#202920]">{item.count}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Expertise Tabs */}
            <section className="bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-2xs">
              <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#62685E] font-mono mb-3">
                Expertise & Protocols
              </h3>
              <div className="flex gap-1 mb-3 bg-[#FAF7F0] p-1 rounded-xl border border-[#E4DCCB]">
                {Object.keys(EXPERTISE).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setExpertiseTab(tab)}
                    className={`flex-1 text-[11px] py-1 rounded-lg text-center transition-colors cursor-pointer font-sans ${
                      expertiseTab === tab
                        ? "bg-white text-[#3E6248] font-bold shadow-2xs"
                        : "text-[#85877B] hover:text-[#202920]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {EXPERTISE[expertiseTab].map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 bg-[#FAF7F0] text-[#202920] rounded-lg border border-[#E4DCCB] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Research Network & Collaborators (with Tooltip) */}
            <section className="bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-2xs">
              <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#62685E] font-mono mb-4">
                Research Network
              </h3>
              <div className="space-y-3">
                {NETWORK.map((person, i) => (
                  <div
                    key={i}
                    className="relative flex items-center gap-2.5 group cursor-default"
                    onMouseEnter={() => setHoveredNetwork(i)}
                    onMouseLeave={() => setHoveredNetwork(null)}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#DCE6D7] text-[#3E6248] text-xs font-bold flex items-center justify-center shrink-0 border border-[#66866A]/30">
                      {person.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-[#202920] truncate group-hover:text-[#3E6248] transition-colors">
                        {person.name}
                      </div>
                      <div className="text-[11px] text-[#85877B] truncate">
                        {person.role}
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] px-2 py-0.5 bg-[#FAF7F0] text-[#62685E] rounded-md border border-[#E4DCCB]">
                      {person.relation}
                    </span>

                    {/* Hover tooltip */}
                    {hoveredNetwork === i && (
                      <div className="absolute left-0 top-full mt-2 z-30 bg-white border border-[#E4DCCB] rounded-xl p-3.5 shadow-2xl w-64 pointer-events-none">
                        <div className="text-xs font-semibold text-[#202920]">
                          {person.name}
                        </div>
                        <div className="text-[11px] text-[#85877B] mt-0.5">
                          {person.institution}
                        </div>
                        <div className="text-[11px] text-[#3E6248] mt-1.5 leading-snug">
                          Shared: {person.shared}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Research Identity Strength */}
            <section className="bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#62685E] font-mono m-0">
                  Identity Verification
                </h3>
                <span className="text-xs font-bold font-mono text-[#3E6248]">
                  94% Verified
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#FAF7F0] border border-[#E4DCCB] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-[#3E6248] rounded-full transition-all duration-500"
                  style={{ width: "94%" }}
                />
              </div>
              <p className="text-xs text-[#62685E] leading-relaxed mb-3">
                Your profile is cryptographically verified against ORCID and institutional domain records.
              </p>
              <div className="space-y-1.5">
                {["Add Secondary Institution", "Sync PubMed Repository", "Export BibTeX Citations"].map(
                  (s) => (
                    <Link
                      key={s}
                      href="/settings"
                      className="block text-xs font-semibold text-[#3E6248] hover:underline underline-offset-2 transition-colors no-underline"
                    >
                      {s} →
                    </Link>
                  )
                )}
              </div>
            </section>

            {/* Export & Actions */}
            <section className="bg-white border border-[#E4DCCB] rounded-2xl p-5 shadow-2xs">
              <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#62685E] font-mono mb-3">
                Export & Dossier
              </h3>
              <div className="space-y-2">
                {[
                  "Export Research CV (PDF)",
                  "Export Publications Matrix",
                  "Download BibTeX Citations",
                  "Institutional Audit Report",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => alert(`Exporting ${option}...`)}
                    className="w-full text-left text-xs font-medium text-[#62685E] hover:text-[#3E6248] transition-colors cursor-pointer py-1"
                  >
                    {option} →
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </div>
  );
}
