"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bold,
  ChevronDown,
  ChevronUp,
  Code2,
  Database,
  FileCheck2,
  GitBranch,
  Italic,
  Layers,
  Link2,
  Lock,
  Network,
  Plus,
  ShieldCheck,
  Sparkles,
  Type,
  Underline,
} from "lucide-react";

interface ProposalSectionItem {
  id: string;
  code: string;
  title: string;
  fieldLabel: string;
  fieldValue: string;
  secondaryLabel: string;
  secondaryValue: string;
}

// Mirrors real sections and NSF SaTC draft context from ProposalDraftsDesk.tsx
const PROPOSAL_SECTIONS: ProposalSectionItem[] = [
  {
    id: "aims",
    code: "01",
    title: "Specific Aims",
    fieldLabel: "Aim 2 Verification Bound",
    fieldValue: "Bounded model checking (k <= 64 steps) for NSF SaTC rubric",
    secondaryLabel: "Reviewer Thread · Dr. Elena Vance",
    secondaryValue: "Co-PI & Formal Verification Lead · Lock Active",
  },
  {
    id: "strategy",
    code: "02",
    title: "Significance & Methodology",
    fieldLabel: "Collaborative Workspace Engine",
    fieldValue: "CRDT / Socket.IO section locking + PresenceBar synchronization",
    secondaryLabel: "Target Schema",
    secondaryValue: "PostgreSQL 16 + Transactional Outbox Relay",
  },
  {
    id: "budget",
    code: "03",
    title: "Budget & Institutional Pool",
    fieldLabel: "Cost Allocation Ledger",
    fieldValue: "Faculty Seed Pool + Compute Credits + PhD Stipend Lines",
    secondaryLabel: "Tenant Governance",
    secondaryValue: "Institutional RBAC & Approval Workflow",
  },
  {
    id: "dmp",
    code: "04",
    title: "Data Management & FAIR",
    fieldLabel: "Repository Provenance",
    fieldValue: "Zenodo DOI Registry + SHA-256 Tamper-Evident Audit Chain",
    secondaryLabel: "Author Attribution",
    secondaryValue: "14-Role CRediT Taxonomy + ORCID Sync",
  },
];

// Mirrors real capabilities from client/app/(protected)/peer-review/page.tsx & audit/page.tsx
const REVIEW_ITEMS = [
  {
    id: "credit",
    code: "01",
    title: "CRediT 14-Role Authorship Matrix",
    note: "All 4 co-authors attested Conceptualization, Formal analysis, Software, and Validation roles.",
    tags: ["CRediT Taxonomy", "ORCID"],
  },
  {
    id: "cope",
    code: "02",
    title: "COPE Double-Blind Confidentiality Redaction",
    note: "Confidential referee links and manuscript identifiers masked cleanly for third-party viewers.",
    tags: ["COPE Ethics", "Verified"],
  },
  {
    id: "sha256",
    code: "03",
    title: "Recursive SHA-256 Audit Ledger",
    note: "64-zero genesis block verified with cryptographic hash chaining across milestone events.",
    tags: ["SHA-256 Chain", "GDPR Art. 20"],
  },
];

function SurfaceHeaderLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#18241C] hover:bg-[#4ADE80] text-[#A3B899] hover:text-[#0B120D] border border-[#2C4231] hover:border-[#4ADE80] font-mono text-[10px] font-semibold no-underline transition-colors shrink-0"
    >
      {label}
      <ArrowUpRight size={11} />
    </Link>
  );
}

/**
 * Full-bleed wide floating showcase ("Inside Cambium") spotlighting authentic
 * internal Cambium surfaces (/workspace, /os, /agent-reader, /publications, /graph, /peer-review, /audit)
 * over a nocturnal chiaroscuro botanical oil-canvas backdrop.
 */
export function PlatformCollageSection() {
  const [expandedProposalIds, setExpandedProposalIds] = useState<Record<string, boolean>>({
    strategy: true,
  });
  const [expandedReviewId, setExpandedReviewId] = useState<string>("credit");
  const [activeToolbarStyle, setActiveToolbarStyle] = useState<"bold" | "italic" | "cite">("cite");

  const allProposalsExpanded = PROPOSAL_SECTIONS.every((s) => expandedProposalIds[s.id]);

  const toggleProposal = (id: string) => {
    setExpandedProposalIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllProposals = () => {
    if (allProposalsExpanded) {
      setExpandedProposalIds({});
    } else {
      const next: Record<string, boolean> = {};
      for (const s of PROPOSAL_SECTIONS) next[s.id] = true;
      setExpandedProposalIds(next);
    }
  };

  return (
    <section
      id="inside-cambium"
      className="relative overflow-hidden bg-[#070C09] border-t border-[rgba(74,222,128,0.18)] py-24 sm:py-32"
    >
      {/* Nocturnal Chiaroscuro Botanical Oil Canvas Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/backgrounds/cambium-collage-nocturne-canvas.webp')",
          opacity: 0.72,
        }}
      />

      {/* Deep Dark Chiaroscuro Scrim & Corner Shadows (Elevates Floating Windows) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, rgba(6,10,7,0.84) 0%, rgba(6,10,7,0.44) 22%, rgba(6,10,7,0.48) 78%, rgba(6,10,7,0.88) 100%),
            radial-gradient(ellipse 75% 65% at 50% 54%, rgba(5,9,6,0.46) 0%, rgba(4,7,5,0.86) 100%)
          `,
        }}
      />

      <div className="relative z-10 px-5 sm:px-8">
        {/* Centered Symmetrical Section Heading Using Exact Cambium Typography */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-[#4ADE80] mb-4 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
            INSIDE CAMBIUM · THE RESEARCH OPERATING SYSTEM
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal leading-[1.08] tracking-[-0.03em] text-[#FAF7F0] mb-5 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            Built for individual scholars.
            <br />
            Engineered for entire institutions.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#C6D5C0] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            Every proposal draft, citation graph, peer-review ledger, AI paper audit, and grant compliance trail — running in one connected workspace. Click any surface to inspect it live.
          </p>
        </div>

        {/* ── WIDE EDGE-BLEED FLOATING COLLAGE (Spans wider than 100% viewport on desktop, framed cleanly at 80% zoom) ── */}
        <div className="w-full lg:w-[114vw] lg:max-w-[1740px] lg:relative lg:left-1/2 lg:-translate-x-1/2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
            {/* LEFT COLUMN (Cols 1-4): Proposal Drafts Desk + Rich Text Citation Editor */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:mt-10">
              {/* Panel 1: Proposal Drafts Desk (/workspace) */}
              <div className="rounded-2xl bg-[#111A14]/95 border border-[#283B2D] shadow-[0_38px_95px_rgba(0,0,0,0.9),0_0_0_1px_rgba(74,222,128,0.12)] p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1D2D21]">
                  <div>
                    <div className="font-sans text-xs font-bold text-[#FAF7F0] flex items-center gap-1.5">
                      <Layers size={14} className="text-[#4ADE80]" />
                      ProposalDraftsDesk
                    </div>
                    <div className="font-mono text-[10px] text-[#8FA89B] flex items-center gap-1.5 mt-0.5">
                      <Lock size={10} className="text-[#4ADE80]" />
                      draft-satc-2026 · Section Locking
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={toggleAllProposals}
                      className="text-[10px] font-mono text-[#A3B899] hover:text-[#FAF7F0] cursor-pointer bg-transparent border-0 p-0"
                    >
                      {allProposalsExpanded ? "Collapse all" : "Expand all"}
                    </button>
                    <SurfaceHeaderLink href="/workspace" label="/workspace" />
                  </div>
                </div>

                <div className="space-y-2">
                  {PROPOSAL_SECTIONS.map((sec) => {
                    const isOpen = Boolean(expandedProposalIds[sec.id]);
                    return (
                      <div
                        key={sec.id}
                        className="rounded-xl bg-[#16221A] border border-[#253629] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleProposal(sec.id)}
                          className="w-full px-3 py-2.5 flex items-center justify-between text-left bg-transparent border-0 cursor-pointer hover:bg-[#1B2B20] transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0E1510] text-[#8FA89B] border border-[#253629]">
                              {sec.code}
                            </span>
                            <span className="font-sans text-xs font-semibold text-[#EDEAE2] truncate">
                              {sec.title}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp size={14} className="text-[#8FA89B] shrink-0" />
                          ) : (
                            <ChevronDown size={14} className="text-[#8FA89B] shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-3 pb-3 pt-1 space-y-2 border-t border-[#203025]">
                            <div>
                              <div className="text-[10px] font-mono text-[#8FA89B] mb-1">
                                {sec.fieldLabel}
                              </div>
                              <div className="font-sans text-[11.5px] text-[#FAF7F0] bg-[#0C120E] border border-[#253629] rounded-lg px-2.5 py-1.5">
                                {sec.fieldValue}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-[#8FA89B] mb-1">
                                {sec.secondaryLabel}
                              </div>
                              <div className="font-sans text-[11px] text-[#A3B899] bg-[#0C120E] border border-[#253629] rounded-lg px-2.5 py-1.5">
                                {sec.secondaryValue}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/workspace"
                  className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] font-medium text-[#4ADE80] hover:text-[#FAF7F0] no-underline"
                >
                  <Plus size={12} />
                  Open Collaborative Proposal Desk
                </Link>
              </div>

              {/* Panel 5: Rich Text & BibTeX Citation Engine (/publications) */}
              <div className="rounded-2xl bg-[#111A14]/95 border border-[#283B2D] shadow-[0_36px_90px_rgba(0,0,0,0.88),0_0_0_1px_rgba(74,222,128,0.12)] p-4 sm:p-5 relative transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1 bg-[#18241C] border border-[#283B2D] rounded-lg px-2 py-1">
                    <span className="p-1 text-[#8FA89B]">
                      <Plus size={12} />
                    </span>
                    <span className="p-1 text-[#8FA89B] border-r border-[#283B2D] pr-2">
                      <Type size={12} />
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveToolbarStyle("bold")}
                      className={`p-1 rounded cursor-pointer border-0 ${
                        activeToolbarStyle === "bold"
                          ? "bg-[#3E6248] text-white"
                          : "bg-transparent text-[#A3B899] hover:text-white"
                      }`}
                      title="Bold emphasis"
                    >
                      <Bold size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveToolbarStyle("italic")}
                      className={`p-1 rounded cursor-pointer border-0 ${
                        activeToolbarStyle === "italic"
                          ? "bg-[#3E6248] text-white"
                          : "bg-transparent text-[#A3B899] hover:text-white"
                      }`}
                      title="Italic emphasis"
                    >
                      <Italic size={12} />
                    </button>
                    <span className="p-1 text-[#8FA89B]">
                      <Underline size={12} />
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveToolbarStyle("cite")}
                      className={`p-1 rounded cursor-pointer border-0 flex items-center gap-1 text-[10px] font-mono ${
                        activeToolbarStyle === "cite"
                          ? "bg-[#4ADE80]/20 text-[#4ADE80]"
                          : "bg-transparent text-[#A3B899] hover:text-white"
                      }`}
                      title="Live BibTeX Citation"
                    >
                      <Link2 size={12} />
                      Cite
                    </button>
                  </div>
                  <SurfaceHeaderLink href="/publications" label="/publications" />
                </div>

                <div className="relative pt-1">
                  <p className="font-serif text-xl sm:text-[22px] leading-snug text-[#EDEAE2] m-0">
                    The{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded transition-colors ${
                        activeToolbarStyle === "cite"
                          ? "bg-[#3E6248]/55 text-[#FAF7F0] ring-1 ring-[#4ADE80]/60"
                          : activeToolbarStyle === "bold"
                          ? "font-bold text-[#4ADE80]"
                          : "italic text-[#DCE6D7]"
                      }`}
                    >
                      Scholarly Citation Engine
                    </span>{" "}
                    generates BibTeX, APA 7th, and IEEE directly from your manuscripts.
                  </p>

                  <span className="inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded bg-[#4ADE80] text-[#0B120D] font-mono text-[10px] font-bold shadow-md">
                    Lead Author
                  </span>

                  <p className="font-sans text-[11.5px] text-[#8FA89B] leading-relaxed mt-2.5 mb-0">
                    LaTeX special-character escaping, DOI resolution, and verified publication provenance synced with your institutional ledger.
                  </p>
                </div>
              </div>
            </div>

            {/* CENTER COLUMN (Cols 5-8): Institutional OS Telemetry + RAG Engine Code + 3 Visual Route Cards */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Panel 2: Institutional Research OS (/os) */}
              <div className="rounded-2xl bg-[#111A14]/95 border border-[#283B2D] shadow-[0_40px_100px_rgba(0,0,0,0.92),0_0_0_1px_rgba(74,222,128,0.14)] p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8FA89B]">
                    Institutional OS · Research Command
                  </span>
                  <SurfaceHeaderLink href="/os" label="/os" />
                </div>

                <h3 className="font-serif text-2xl font-normal text-[#FAF7F0] tracking-tight mb-3 mt-0">
                  Welcome back, Scholar
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="rounded-xl bg-[#16221A] border border-[#253629] p-3">
                    <div className="flex items-center justify-between text-[10px] text-[#8FA89B] mb-1 font-sans">
                      <span>Unit Suites Verified</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#4ADE80]/15 text-[#4ADE80] font-mono">
                        255/255
                      </span>
                    </div>
                    <div className="font-sans text-xl font-bold text-[#FAF7F0] tracking-tight">
                      57 Routes
                    </div>
                    <svg viewBox="0 0 120 26" className="w-full h-5 mt-1.5 overflow-visible">
                      <path
                        d="M 2 22 C 25 20, 42 15, 65 13 C 88 11, 102 6, 118 3"
                        fill="none"
                        stroke="#4ADE80"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="rounded-xl bg-[#16221A] border border-[#253629] p-3">
                    <div className="flex items-center justify-between text-[10px] text-[#8FA89B] mb-1 font-sans">
                      <span>Audit Integrity</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#4ADE80]/15 text-[#4ADE80] font-mono">
                        SHA-256
                      </span>
                    </div>
                    <div className="font-sans text-xl font-bold text-[#FAF7F0] tracking-tight">
                      100%
                    </div>
                    <svg viewBox="0 0 120 26" className="w-full h-5 mt-1.5 overflow-visible">
                      <path
                        d="M 2 23 C 30 22, 54 18, 76 12 C 94 7, 106 5, 118 2"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="rounded-xl bg-[#16221A] border border-[#253629] p-3">
                  <div className="flex items-center justify-between text-[10.5px] mb-1.5 font-sans">
                    <span className="text-[#EDEAE2] font-medium">
                      Funding Pools &amp; Compliance Cadence
                    </span>
                    <span className="font-mono text-[#4ADE80]">Live Ledger</span>
                  </div>
                  <svg viewBox="0 0 280 42" className="w-full h-9 overflow-visible">
                    <path
                      d="M 2 36 C 55 34, 95 30, 140 24 C 190 17, 232 10, 278 4"
                      fill="none"
                      stroke="#4ADE80"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 2 38 C 65 37, 118 35, 175 28 C 218 23, 250 18, 278 13"
                      fill="none"
                      stroke="rgba(163,184,153,0.35)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  </svg>
                </div>
              </div>

              {/* Panel 3: Real queryRagEngine() Code Block (client/lib/ai/rag-engine.ts -> /agent-reader) */}
              <div className="rounded-2xl bg-[#0E1510] border border-[#283B2D] shadow-[0_36px_92px_rgba(0,0,0,0.9),0_0_0_1px_rgba(74,222,128,0.14)] p-4 sm:p-5 relative transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#4ADE80]">
                    <Code2 size={12} />
                    lib/ai/rag-engine.ts · queryRagEngine()
                  </span>
                  <SurfaceHeaderLink href="/agent-reader" label="/agent-reader" />
                </div>

                <pre className="m-0 font-mono text-[11px] leading-[1.6] text-[#C6D5C0] overflow-x-auto bg-[#090E0B] border border-[#1E2E22] rounded-xl p-3">
                  <code>
                    <span className="text-[#8FA89B]">{"// Dense TF-IDF + Gemini Flash Synthesis\n"}</span>
                    <span className="text-[#4ADE80]">const</span>{" res: RagResponse = "}
                    <span className="text-[#FDE68A]">await</span>{" queryRagEngine({\n"}
                    {"  query: "}
                    <span className="text-[#A7F3D0]">&quot;Verify bounded model checking bounds&quot;</span>
                    {",\n  persona: "}
                    <span className="text-[#A7F3D0]">&quot;Methodology Auditor&quot;</span>
                    {",\n  offlineFallback: "}
                    <span className="text-[#93C5FD]">true</span>
                    {"\n});\n"}
                    <span className="text-[#4ADE80]">return</span>{" res."}
                    <span className="text-[#FAF7F0]">citations</span>
                    {"; "}
                    <span className="text-[#8FA89B]">{"// page & line anchors"}</span>
                  </code>
                </pre>

                <div className="mt-2.5 flex items-center justify-end">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#295237] text-[#FAF7F0] border border-[#4ADE80]/50 font-mono text-[10px] font-semibold shadow-md">
                    <Sparkles size={10} className="text-[#4ADE80]" />
                    Methodology Auditor
                  </span>
                </div>
              </div>

              {/* Panel 6: 3 Real App Surfaces Strip (/graph, /datasets, /portfolio) */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    title: "Citation Graph",
                    sub: "/graph · OpenAlex",
                    href: "/graph",
                    icon: Network,
                  },
                  {
                    title: "FAIR Datasets",
                    sub: "/data-management",
                    href: "/data-management",
                    icon: Database,
                  },
                  {
                    title: "Scholar Ledger",
                    sub: "/portfolio · ORCID",
                    href: "/portfolio",
                    icon: GitBranch,
                  },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group rounded-xl bg-[#111A14]/95 border border-[#283B2D] hover:border-[#4ADE80] p-3 no-underline shadow-[0_22px_50px_rgba(0,0,0,0.85)] transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[112px]"
                    >
                      <div className="flex items-center justify-between text-[#8FA89B] group-hover:text-[#4ADE80] transition-colors">
                        <IconComp size={14} />
                        <ArrowUpRight size={12} />
                      </div>
                      <div className="my-2 h-8 rounded-lg bg-gradient-to-br from-[#19281D] to-[#0E1610] border border-[#233327] flex items-center justify-center">
                        <span className="w-8 h-1 rounded-full bg-[#4ADE80]/45 group-hover:bg-[#4ADE80] transition-colors" />
                      </div>
                      <div>
                        <div className="font-sans text-[11px] font-semibold text-[#FAF7F0] truncate">
                          {item.title}
                        </div>
                        <div className="text-[9.5px] font-mono text-[#8FA89B] truncate">
                          {item.sub}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN (Cols 9-12): AI Paper Reader Split Preview + COPE Peer Review & Audit Ledger */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:mt-6">
              {/* Panel 4: AI Paper Reader Split-Pane Preview (/agent-reader) */}
              <div className="rounded-2xl bg-[#111A14]/95 border border-[#283B2D] shadow-[0_38px_95px_rgba(0,0,0,0.9),0_0_0_1px_rgba(74,222,128,0.12)] p-4 sm:p-5 relative transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1D2D21]">
                  <div className="min-w-0">
                    <div className="font-mono text-[9.5px] text-[#8FA89B] truncate">
                      /agent-reader · Grounded Synthesis
                    </div>
                    <div className="font-sans text-xs font-bold text-[#FAF7F0] truncate">
                      Zero-Shot Clinical Tomography Synthesis
                    </div>
                  </div>
                  <SurfaceHeaderLink href="/agent-reader" label="Inspect" />
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-7 space-y-2">
                    <div>
                      <div className="text-[9.5px] font-mono text-[#8FA89B] mb-1">
                        Active Agent Persona
                      </div>
                      <div className="font-sans text-[11px] text-[#FAF7F0] bg-[#0C120E] border border-[#253629] rounded-lg px-2.5 py-1.5">
                        Statistical Rigor · Line Citations
                      </div>
                    </div>
                    <div className="relative">
                      <div className="text-[9.5px] font-mono text-[#8FA89B] mb-1">
                        Extracted Source Citation
                      </div>
                      <div className="font-sans text-[11px] text-[#DCE6D7] bg-[#0C120E] border border-[#38BDF8]/45 rounded-lg px-2.5 py-1.5">
                        Section §3.2 · Cosine similarity 0.94
                      </div>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#38BDF8] text-[#0B120D] font-mono text-[9px] font-bold mt-1.5">
                        Postdoc
                      </span>
                    </div>
                  </div>

                  <div className="col-span-5 rounded-xl bg-[#090E0B] border border-[#253629] p-2.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#18241C] text-[#A3B899]">
                        arXiv:2411
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                    </div>
                    <div className="font-serif text-[12px] text-[#FAF7F0] leading-snug">
                      sim(q, d) = q·d / ‖q‖‖d‖
                    </div>
                    <div className="text-[9.5px] font-mono text-[#8FA89B] mt-2">
                      Page + Line Grounded
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel 7: COPE Peer-Review Matrix & SHA-256 Audit Ledger (/peer-review & /audit) */}
              <div className="rounded-2xl bg-[#111A14]/95 border border-[#283B2D] shadow-[0_36px_90px_rgba(0,0,0,0.88),0_0_0_1px_rgba(74,222,128,0.12)] p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1D2D21]">
                  <div>
                    <div className="font-sans text-xs font-bold text-[#FAF7F0] flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#4ADE80]" />
                      PeerReview &amp; Audit Ledger
                    </div>
                    <div className="font-mono text-[10px] text-[#8FA89B]">
                      COPE Redaction · CRediT Matrix
                    </div>
                  </div>
                  <SurfaceHeaderLink href="/peer-review" label="/peer-review" />
                </div>

                <div className="space-y-2">
                  {REVIEW_ITEMS.map((item) => {
                    const isOpen = expandedReviewId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#16221A] border border-[#253629] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedReviewId(isOpen ? "" : item.id)}
                          className="w-full px-3 py-2 flex items-center justify-between text-left bg-transparent border-0 cursor-pointer hover:bg-[#1B2B20] transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#0E1510] text-[#8FA89B] border border-[#253629]">
                              {item.code}
                            </span>
                            <span className="font-sans text-xs font-semibold text-[#EDEAE2] truncate">
                              {item.title}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp size={13} className="text-[#8FA89B] shrink-0" />
                          ) : (
                            <ChevronDown size={13} className="text-[#8FA89B] shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-3 pb-3 pt-1.5 border-t border-[#203025] space-y-2">
                            <div className="relative rounded-lg bg-[#0C120E] border border-[#F59E0B]/40 p-2.5 font-sans text-[11px] text-[#EDEAE2] leading-relaxed">
                              {item.note}
                              <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded bg-[#F59E0B] text-[#0B120D] font-mono text-[9px] font-bold align-middle">
                                Peer Reviewer
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded bg-[#0E1510] border border-[#253629] font-mono text-[9.5px] text-[#A3B899]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1D2D21] flex items-center justify-between">
                  <Link
                    href="/audit"
                    className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-[#A3B899] hover:text-[#4ADE80] no-underline transition-colors"
                  >
                    <FileCheck2 size={12} className="text-[#4ADE80]" />
                    Inspect SHA-256 Audit Trail →
                  </Link>
                  <Link
                    href="/opportunities"
                    className="font-mono text-[10.5px] text-[#4ADE80] hover:underline no-underline"
                  >
                    Opportunities ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
