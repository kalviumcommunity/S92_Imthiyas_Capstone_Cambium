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
} from "lucide-react";

// ─── Static Data ──────────────────────────────────────────────────────────────

const TOPICS = [
  { label: "Medical Imaging", primary: true },
  { label: "Computer Vision", primary: false },
  { label: "Machine Learning", primary: false },
  { label: "Federated Learning", primary: false },
  { label: "Deep Learning", primary: false },
  { label: "Healthcare AI", primary: false },
];

const PUBLICATIONS = [
  {
    title: "Foundation Models for Medical Image Understanding",
    authors: ["Imthiyas", "Daniel Lee", "Priya Raman"],
    venue: "Journal of Medical AI",
    year: 2026,
    tags: ["Medical Imaging", "Foundation Models"],
  },
  {
    title: "Federated Learning for Privacy-Preserving Clinical Segmentation",
    authors: ["Imthiyas", "Elena Rodriguez", "Arjun Patel"],
    venue: "MICCAI 2025",
    year: 2025,
    tags: ["Federated Learning", "Segmentation"],
  },
  {
    title: "Low-Resource Adaptation of Vision Transformers for Histopathology",
    authors: ["Imthiyas", "James Wu"],
    venue: "Medical Image Analysis",
    year: 2024,
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
    event: "Started PhD research in Medical Imaging at AMET University",
    type: "milestone",
  },
  {
    year: "2025",
    event: "Published “Foundation Models for Medical Image Understanding” — Journal of Medical AI",
    type: "publication",
  },
  {
    year: "2025",
    event: "Joined AI & Medical Imaging Lab",
    type: "affiliation",
  },
  {
    year: "2024",
    event: "Research project: Low-Resource Clinical Vision",
    type: "project",
  },
  {
    year: "2023",
    event: "M.Tech in Computer Science — Specialization in Artificial Intelligence",
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
  ],
  Technical: [
    "Python",
    "PyTorch",
    "OpenCV",
    "SQL",
    "MONAI",
    "Weights & Biases",
  ],
  Academic: [
    "Scientific Writing",
    "LaTeX",
    "Peer Review",
    "Research Communication",
    "Grant Writing",
  ],
};

const NETWORK = [
  {
    name: "Dr. Elena Rodriguez",
    role: "Associate Prof · Federated Learning",
    institution: "IIT Madras",
    relation: "Collaborator",
    initials: "ER",
    shared: "Federated Learning, Privacy",
  },
  {
    name: "Dr. Arjun Patel",
    role: "Research Scientist · Computer Vision",
    institution: "AIIMS",
    relation: "Collaborator",
    initials: "AP",
    shared: "Medical Imaging, Segmentation",
  },
  {
    name: "James Wu",
    role: "PhD Researcher · Foundation Models",
    institution: "NUS",
    relation: "Co-author",
    initials: "JW",
    shared: "Vision Transformers, Low-resource",
  },
  {
    name: "Dr. Priya Raman",
    role: "Asst. Prof · Medical AI",
    institution: "AMET University",
    relation: "Advisor",
    initials: "PR",
    shared: "Medical Imaging, Research Mentorship",
  },
];

const ACTIVITIES = [
  {
    type: "publication",
    action: "Published a paper",
    detail: "Foundation Models for Medical Image Understanding",
    time: "2 days ago",
  },
  {
    type: "note",
    action: "Updated Literature Review",
    detail: "Added 3 references on federated segmentation",
    time: "4 days ago",
  },
  {
    type: "experiment",
    action: "Started an experiment",
    detail: "Low-data adaptation: ViT-Tiny on ISIC 2024",
    time: "1 week ago",
  },
  {
    type: "discussion",
    action: "Joined a research discussion",
    detail: "Multimodal approaches in radiology AI",
    time: "1 week ago",
  },
  {
    type: "collaboration",
    action: "Connected with Dr. Elena Rodriguez",
    detail: "Federated Learning · Medical Vision",
    time: "2 weeks ago",
  },
  {
    type: "question",
    action: "Created a research question",
    detail: "Can federated models maintain clinical calibration?",
    time: "2 weeks ago",
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

function statusChip(status: string) {
  if (status === "Active")
    return "text-moss-700 bg-moss-50 border border-moss-200";
  if (status === "Completed")
    return "text-navy bg-navy-light border border-navy/20";
  return "text-amber bg-amber-light border border-amber/20";
}

function SectionHeading({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-tertiary font-sans">
        {children}
      </h2>
      {action}
    </div>
  );
}

// ─── Share Modal Component ────────────────────────────────────────────────────

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-raised rounded-xl border border-edge-default p-7 w-full max-w-[420px] shadow-elevation2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2
            id="share-title"
            className="font-serif text-xl font-semibold text-ink-primary"
          >
            Share research portfolio
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider text-moss-700 bg-moss-50 border border-moss-200 px-2 py-0.5 rounded-full">
            Public
          </span>
        </div>
        <p className="text-xs text-ink-secondary mb-5 leading-relaxed font-sans">
          Share your academic identity, project portfolio, and publications with collaborators and institutions.
        </p>

        {/* Profile Snapshot Preview */}
        <div className="bg-surface-base border border-edge-default rounded-lg p-4 mb-4">
          <div className="font-serif text-base font-semibold text-ink-primary leading-tight">
            Imthiyas
          </div>
          <div className="text-xs text-ink-secondary mt-0.5 font-sans">
            PhD Researcher · Medical Imaging
          </div>
          <div className="text-[11px] text-ink-tertiary mt-0.5 font-sans">
            AMET University · Chennai, India
          </div>
        </div>

        <div className="space-y-2 mb-5">
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              copied
                ? "bg-moss-50 border-moss-300 text-moss-700"
                : "border-edge-default text-ink-primary hover:bg-surface-base hover:border-edge-strong"
            }`}
          >
            <span>{copied ? "Link copied to clipboard!" : "Copy portfolio link"}</span>
            {copied ? <Check size={14} className="text-moss-700" /> : <Copy size={14} className="text-ink-tertiary" />}
          </button>
          <button
            onClick={() => alert("Generating PDF summary...")}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold border border-edge-default rounded-lg text-ink-primary hover:bg-surface-base hover:border-edge-strong transition-all cursor-pointer"
          >
            <span>Download portfolio PDF</span>
            <Download size={14} className="text-ink-tertiary" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-center text-xs font-medium text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer py-1"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Research Portfolio Page ──────────────────────────────────────────────────

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
    <div className="flex-1 min-h-screen overflow-y-auto bg-surface-base font-sans" tabIndex={-1}>
      <div className="max-w-[1080px] mx-auto px-8 pt-8 pb-16">

        {/* ── Profile Header ─────────────────────────────────────────── */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider uppercase text-[#3E6248] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#66866A] animate-pulse" />
            06 / ACADEMIC IDENTITY · RESEARCH PORTFOLIO
          </div>
        </div>

        <header className="bg-white border border-[#E4DCCB] rounded-2xl p-7 mb-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start gap-6">

            {/* Photo */}
            <div className="relative shrink-0">
              <div className="w-[88px] h-[88px] rounded-full overflow-hidden ring-2 ring-[#E4DCCB] bg-[#F2EBDD]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format"
                  alt="Imthiyas"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#3E6248] border-2 border-white shadow-xs"
                title="Active"
                aria-label="Active Researcher Status"
              />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] leading-tight m-0">
                  <span className="italic text-[#3E6248]">Imthiyas</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E6248] bg-[#DCE6D7] border border-[#66866A]/30 px-2.5 py-0.5 rounded-full font-mono">
                  Postdoc
                </span>
              </div>
              <p className="text-sm text-[#62685E] mt-1 font-sans">
                PhD Researcher · Medical Imaging & Vision Transformers
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-xs text-ink-secondary font-sans">
                <span className="font-medium text-ink-primary">AMET University</span>
                <span className="text-edge-strong select-none">·</span>
                <span>Computer Science</span>
                <span className="text-edge-strong select-none">·</span>
                <span>Chennai, India</span>
              </div>

              {/* Research interest tags */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {TOPICS.slice(0, 4).map((t) => (
                  <span
                    key={t.label}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-edge-default bg-surface-base text-ink-secondary"
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex flex-col items-end gap-3 self-stretch sm:self-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFollowing((f) => !f)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    following
                      ? "bg-moss-50 text-moss-700 border border-moss-200"
                      : "bg-moss-600 text-white hover:bg-moss-700 shadow-xs"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </button>
                <button className="px-3.5 py-1.5 rounded-md text-xs font-semibold border border-edge-default text-ink-primary hover:bg-surface-base transition-colors cursor-pointer">
                  Message
                </button>
                <button className="px-3.5 py-1.5 rounded-md text-xs font-semibold border border-edge-default text-ink-primary hover:bg-surface-base transition-colors cursor-pointer">
                  Collaborate
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-tertiary">
                <Link
                  href="/profile"
                  className="hover:text-ink-primary transition-colors text-decoration-none"
                >
                  Edit Profile
                </Link>
                <span className="text-edge-strong select-none">·</span>
                <button
                  onClick={() => setShareOpen(true)}
                  className="hover:text-ink-primary transition-colors cursor-pointer"
                >
                  Share
                </button>
                <span className="text-edge-strong select-none">·</span>
                <button className="hover:text-ink-primary transition-colors cursor-pointer">
                  More
                </button>
              </div>
            </div>
          </div>

          {/* Bio + academic links */}
          <div className="mt-5 pt-5 border-t border-edge-default/70">
            <p className="text-sm text-ink-secondary leading-relaxed max-w-[680px]">
              PhD researcher working at the intersection of medical imaging and
              machine learning. Current research focuses on reliable computer
              vision systems for low-resource clinical environments.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
              {["ORCID", "Google Scholar", "GitHub", "LinkedIn", "Personal Website"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs font-medium text-moss-700 hover:text-moss-600 hover:underline underline-offset-2 transition-colors inline-flex items-center gap-1"
                  >
                    <span>{link}</span>
                    <ExternalLink size={10} className="text-moss-700/60" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* AI Context Note */}
          <div className="mt-4 pt-4 border-t border-edge-default/70">
            <p className="text-xs text-ink-tertiary leading-relaxed">
              <span className="text-moss-700 font-bold">Cambium Intelligence</span> —
              Your profile is connected to 8 papers in Medical Imaging. Your current project
              overlaps with 4 researchers on the platform.
            </p>
          </div>
        </header>

        {/* ── Two-column body ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Research Focus */}
            <section aria-labelledby="focus-heading">
              <SectionHeading>
                <span id="focus-heading">Research focus</span>
              </SectionHeading>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.label}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                      t.primary
                        ? "bg-moss-600 text-white border border-moss-600 font-semibold shadow-xs"
                        : "bg-surface-raised text-ink-secondary border border-edge-default hover:border-moss-300 hover:text-moss-700 hover:bg-moss-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Current Research */}
            <section
              className="bg-surface-raised border border-edge-default rounded-xl p-6 shadow-xs"
              aria-labelledby="current-heading"
            >
              <div className="flex items-center justify-between mb-3">
                <h2
                  id="current-heading"
                  className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-tertiary"
                >
                  Current research
                </h2>
                <span className="text-[10px] px-2 py-0.5 bg-moss-50 text-moss-700 border border-moss-200 rounded-full font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-primary leading-snug mb-2">
                Low-Resource Medical Image Segmentation
              </h3>
              <p className="text-sm text-ink-secondary leading-relaxed mb-5 font-sans">
                Developing lightweight segmentation models for medical imaging
                in environments with limited labeled data.
              </p>

              <div className="mb-4">
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-ink-tertiary mb-2">
                  Research questions
                </div>
                <div className="space-y-2">
                  {[
                    "How can segmentation models perform reliably with limited labeled data?",
                    "Can federated learning improve privacy while maintaining clinical performance?",
                  ].map((q, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="text-edge-strong shrink-0 mt-0.5 text-xs">—</span>
                      <span className="font-serif text-sm text-ink-primary italic leading-snug">
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
                    className="text-xs px-2.5 py-0.5 bg-surface-base text-ink-secondary rounded border border-edge-default"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-edge-default">
                <Link
                  href="/workspace"
                  className="text-xs text-moss-700 font-semibold hover:underline underline-offset-2"
                >
                  View workspace
                </Link>
                <span className="text-edge-strong select-none">·</span>
                <button className="text-xs text-moss-700 font-semibold hover:underline underline-offset-2 cursor-pointer">
                  View project
                </button>
                <span className="text-edge-strong select-none">·</span>
                <button className="text-xs text-ink-secondary hover:text-ink-primary hover:underline underline-offset-2 cursor-pointer">
                  Follow research
                </button>
              </div>
            </section>

            {/* Selected Publications */}
            <section aria-labelledby="pub-heading">
              <SectionHeading
                action={
                  <Link
                    href="/publications"
                    className="text-xs text-moss-700 font-semibold hover:underline underline-offset-2 flex items-center gap-1"
                  >
                    View all →
                  </Link>
                }
              >
                <span id="pub-heading">Selected publications</span>
              </SectionHeading>

              <div className="space-y-3">
                {PUBLICATIONS.map((pub, i) => (
                  <article
                    key={i}
                    className="bg-surface-raised border border-edge-default rounded-lg p-5 group hover:border-moss-300 hover:shadow-xs transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base font-semibold text-ink-primary leading-snug group-hover:text-moss-700 transition-colors duration-150">
                          {pub.title}
                        </h3>
                        <p className="text-xs text-ink-secondary mt-1.5 font-sans">
                          {pub.authors.join(" · ")}
                        </p>
                        <p className="text-xs text-ink-tertiary mt-0.5 font-sans">
                          {pub.venue} · {pub.year}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {pub.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 bg-surface-base text-ink-secondary rounded border border-edge-default"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                        <Link
                          href="/publications"
                          className="text-xs text-moss-700 font-semibold hover:underline underline-offset-2 whitespace-nowrap"
                        >
                          Read paper
                        </Link>
                        <button className="text-xs text-ink-tertiary hover:text-ink-primary whitespace-nowrap transition-colors cursor-pointer">
                          View citation
                        </button>
                        <button
                          onClick={() => toggleSaved(i)}
                          className={`text-xs whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                            savedPubs.has(i)
                              ? "text-moss-700 font-bold"
                              : "text-ink-tertiary hover:text-ink-primary"
                          }`}
                        >
                          <Bookmark size={12} fill={savedPubs.has(i) ? "currentColor" : "none"} />
                          {savedPubs.has(i) ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Research Projects */}
            <section aria-labelledby="projects-heading">
              <SectionHeading>
                <span id="projects-heading">Research projects</span>
              </SectionHeading>
              <div className="space-y-3">
                {PROJECTS.map((project, i) => (
                  <article
                    key={i}
                    className="bg-surface-raised border border-edge-default rounded-lg p-5 hover:border-edge-strong transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <h3 className="text-sm font-semibold text-ink-primary">
                            {project.name}
                          </h3>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider shrink-0 ${statusChip(project.status)}`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <p className="text-xs text-ink-secondary leading-relaxed mb-2.5 font-sans">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {project.areas.map((a) => (
                            <span
                              key={a}
                              className="text-[10px] px-2 py-0.5 text-ink-secondary border border-edge-default bg-surface-base rounded"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-tertiary">
                          <span>{project.collaborators.join(", ")}</span>
                          <span className="text-edge-strong select-none">·</span>
                          <span>Updated {project.updated}</span>
                        </div>
                      </div>
                      <Link
                        href="/workspace"
                        className="shrink-0 text-xs text-moss-700 font-semibold hover:underline underline-offset-2 whitespace-nowrap pt-0.5"
                      >
                        View project
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Research Journey */}
            <section aria-labelledby="timeline-heading">
              <SectionHeading>
                <span id="timeline-heading">Research journey</span>
              </SectionHeading>
              <div className="relative pl-6 bg-surface-raised border border-edge-default rounded-xl p-6">
                <div className="absolute left-[31px] top-8 bottom-8 w-px bg-edge-default" />
                <div className="space-y-6">
                  {TIMELINE.map((item, i) => (
                    <div key={i} className="relative flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full bg-surface-raised border-2 border-moss-600 mt-1 shrink-0 z-10" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono font-bold text-moss-700 tracking-wider mb-0.5">
                          {item.year}
                        </div>
                        <div className="text-xs text-ink-primary font-medium leading-snug">
                          {item.event}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Research Questions */}
            <section aria-labelledby="questions-heading">
              <SectionHeading>
                <span id="questions-heading">Questions I'm exploring</span>
              </SectionHeading>
              <div className="space-y-3">
                {QUESTIONS.map((q, i) => (
                  <div
                    key={i}
                    className="bg-surface-raised border border-edge-default rounded-lg p-5 hover:border-edge-strong transition-colors duration-200"
                  >
                    <p className="font-serif text-base text-ink-primary leading-relaxed italic mb-3">
                      &ldquo;{q.text}&rdquo;
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {q.links.map((link) => (
                        <button
                          key={link}
                          className="text-xs font-semibold text-moss-700 bg-moss-50 border border-moss-200 px-2 py-0.5 rounded hover:underline underline-offset-2 transition-colors cursor-pointer"
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

          {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Contributions */}
            <section
              className="bg-surface-raised border border-edge-default rounded-xl p-5 shadow-xs"
              aria-labelledby="contrib-heading"
            >
              <h2
                id="contrib-heading"
                className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-tertiary mb-4"
              >
                Contributions
              </h2>
              <div className="space-y-2.5">
                {[
                  { label: "Publications", count: 12 },
                  { label: "Active projects", count: 4 },
                  { label: "Research datasets", count: 8 },
                  { label: "Research notes", count: 23 },
                  { label: "Experiments", count: 31 },
                  { label: "Research discussions", count: 17 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-ink-secondary">{item.label}</span>
                    <span className="font-mono font-bold text-ink-primary">{item.count}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Expertise */}
            <section
              className="bg-surface-raised border border-edge-default rounded-xl p-5 shadow-xs"
              aria-labelledby="expertise-heading"
            >
              <h2
                id="expertise-heading"
                className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-tertiary mb-3"
              >
                Expertise
              </h2>
              <div className="flex gap-1 mb-3 bg-surface-base p-1 rounded-md border border-edge-default">
                {Object.keys(EXPERTISE).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setExpertiseTab(tab)}
                    className={`flex-1 text-[11px] py-1 rounded text-center transition-colors cursor-pointer ${
                      expertiseTab === tab
                        ? "bg-surface-raised text-moss-700 font-bold shadow-xs"
                        : "text-ink-tertiary hover:text-ink-primary"
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
                    className="text-xs px-2.5 py-1 bg-surface-base text-ink-primary rounded border border-edge-default font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Research Network */}
            <section
              className="bg-surface-raised border border-edge-default rounded-xl p-5 shadow-xs"
              aria-labelledby="network-heading"
            >
              <h2
                id="network-heading"
                className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-tertiary mb-4"
              >
                Research network
              </h2>
              <div className="space-y-3">
                {NETWORK.map((person, i) => (
                  <div
                    key={i}
                    className="relative flex items-center gap-2.5 group cursor-default"
                    onMouseEnter={() => setHoveredNetwork(i)}
                    onMouseLeave={() => setHoveredNetwork(null)}
                  >
                    <div className="w-8 h-8 rounded-full bg-moss-100 text-moss-700 text-xs font-bold flex items-center justify-center shrink-0 border border-moss-300">
                      {person.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-ink-primary truncate group-hover:text-moss-700 transition-colors">
                        {person.name}
                      </div>
                      <div className="text-[11px] text-ink-tertiary truncate">
                        {person.role}
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-surface-base text-ink-secondary rounded border border-edge-default">
                      {person.relation}
                    </span>

                    {/* Hover tooltip */}
                    {hoveredNetwork === i && (
                      <div className="absolute left-0 top-full mt-2 z-30 bg-surface-raised border border-edge-default rounded-lg p-3.5 shadow-elevation2 w-64 pointer-events-none">
                        <div className="text-xs font-semibold text-ink-primary">
                          {person.name}
                        </div>
                        <div className="text-[11px] text-ink-tertiary mt-0.5">
                          {person.institution}
                        </div>
                        <div className="text-[11px] text-moss-700 mt-1.5 leading-snug">
                          Shared interests: {person.shared}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="mt-3.5 text-xs font-semibold text-moss-700 hover:underline underline-offset-2 flex items-center gap-1 cursor-pointer">
                View full network <ArrowRight size={12} />
              </button>
            </section>

            {/* Research Activity */}
            <section
              className="bg-surface-raised border border-edge-default rounded-xl p-5 shadow-xs"
              aria-labelledby="activity-heading"
            >
              <h2
                id="activity-heading"
                className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-tertiary mb-4"
              >
                Research activity
              </h2>
              <div className="space-y-3.5">
                {ACTIVITIES.map((item, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full mt-1 shrink-0"
                      style={{
                        backgroundColor: ACTIVITY_COLORS[item.type],
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-ink-primary leading-tight">
                        {item.action}
                      </div>
                      <div className="text-[11px] text-ink-secondary mt-0.5 leading-snug">
                        {item.detail}
                      </div>
                      <div className="text-[10px] text-ink-tertiary mt-0.5 font-mono">
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Research Identity Strength */}
            <section
              className="bg-surface-raised border border-edge-default rounded-xl p-5 shadow-xs"
              aria-labelledby="strength-heading"
            >
              <div className="flex items-center justify-between mb-3">
                <h2
                  id="strength-heading"
                  className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-tertiary"
                >
                  Research identity
                </h2>
                <span className="text-xs font-bold font-mono text-moss-700">
                  82%
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-base border border-edge-default rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-moss-600 rounded-full transition-all duration-500"
                  style={{ width: "82%" }}
                />
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed mb-3">
                Your profile is strong. Adding ORCID makes your academic identity verifiable across databases.
              </p>
              <div className="space-y-1.5">
                {["Add ORCID", "Connect GitHub", "Add another publication"].map(
                  (s) => (
                    <Link
                      key={s}
                      href="/profile"
                      className="block text-xs font-semibold text-moss-700 hover:underline underline-offset-2 transition-colors"
                    >
                      {s} →
                    </Link>
                  )
                )}
              </div>
            </section>

            {/* Profile Visibility */}
            <section
              className="bg-surface-raised border border-edge-default rounded-xl p-5 shadow-xs"
              aria-labelledby="visibility-heading"
            >
              <h2
                id="visibility-heading"
                className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-tertiary mb-3"
              >
                Profile visibility
              </h2>
              <div className="space-y-2">
                {["Public", "Cambium members", "Private"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        option === "Public"
                          ? "border-moss-600 bg-moss-600"
                          : "border-edge-strong group-hover:border-ink-secondary"
                      }`}
                    >
                      {option === "Public" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        option === "Public"
                          ? "text-ink-primary font-semibold"
                          : "text-ink-secondary"
                      }`}
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Export */}
            <section
              className="bg-surface-raised border border-edge-default rounded-xl p-5 shadow-xs"
              aria-labelledby="export-heading"
            >
              <h2
                id="export-heading"
                className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-tertiary mb-3"
              >
                Export
              </h2>
              <div className="space-y-2">
                {[
                  "Export Research CV",
                  "Export Publications",
                  "Export BibTeX",
                  "Export Profile PDF",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => alert(`Exporting ${option}...`)}
                    className="w-full text-left text-xs font-medium text-ink-secondary hover:text-moss-700 transition-colors cursor-pointer"
                  >
                    {option}
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
