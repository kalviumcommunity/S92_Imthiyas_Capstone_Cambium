"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Code2,
  Database,
  FileCheck2,
  GitBranch,
  Layers,
  Network,
  Plus,
  ShieldCheck,
  Sparkles,
  Type,
  Bold,
  Italic,
  Underline,
  Link2,
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

const PROPOSAL_SECTIONS: ProposalSectionItem[] = [
  {
    id: "aims",
    code: "01",
    title: "Specific Aims",
    fieldLabel: "Aim 1 Hypothesis",
    fieldValue: "Zero-shot MRI cross-domain invariance via sparse spectral attention",
    secondaryLabel: "Grant Program",
    secondaryValue: "NSF CISE · Smart Health & Biomedical",
  },
  {
    id: "strategy",
    code: "02",
    title: "Research Strategy",
    fieldLabel: "Primary Architecture",
    fieldValue: "Hierarchical Swin-Cambium Encoder (42M params)",
    secondaryLabel: "Target Benchmark",
    secondaryValue: "Multi-Site BraTS + UK Biobank Cohort",
  },
  {
    id: "budget",
    code: "03",
    title: "Budget Justification",
    fieldLabel: "Compute & Personnel",
    fieldValue: "$385,000 · 36 Months · 2 PhD Fellows + H100 Allocation",
    secondaryLabel: "Cost-Sharing Status",
    secondaryValue: "Institutional Match Verified (15%)",
  },
  {
    id: "dmp",
    code: "04",
    title: "Data Management Plan",
    fieldLabel: "Archival Repository",
    fieldValue: "Zenodo + Institutional S3 (CC-BY-4.0 / HIPAA De-ID)",
    secondaryLabel: "Provenance Lock",
    secondaryValue: "SHA-256 Ledger + ORCID Sync",
  },
];

const REVIEW_ITEMS = [
  {
    id: "stat",
    code: "01",
    title: "Statistical power & multi-site ablation",
    note: "Verified 95% CI across 4 hospital cohorts. Add bootstrap p-values to Table 2.",
    tags: ["Methodology", "COPE-Verified"],
  },
  {
    id: "seed",
    code: "02",
    title: "Deterministic reproducibility seed & weights",
    note: "Container digest and PyTorch checkpoint hash matched Zenodo release v1.2.",
    tags: ["Reproducibility", "SHA-256"],
  },
  {
    id: "credit",
    code: "03",
    title: "CRediT authorship role attestation",
    note: "All 4 co-authors signed off on Conceptualization, Formal Analysis, and Software.",
    tags: ["CRediT Matrix", "ORCID"],
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
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1C2C20] hover:bg-[#4ADE80] text-[#A3B899] hover:text-[#0B120D] border border-[#2C4231] hover:border-[#4ADE80] font-mono text-[10px] font-semibold no-underline transition-colors shrink-0"
    >
      {label}
      <ArrowUpRight size={11} />
    </Link>
  );
}

/**
 * Multi-panel floating showcase ("Inside Cambium") spotlighting real internal
 * Cambium surfaces (/workspace, /os, /agent-reader, /publications, /graph, /peer-review).
 */
export function PlatformCollageSection() {
  const [expandedProposalIds, setExpandedProposalIds] = useState<Record<string, boolean>>({
    strategy: true,
  });
  const [expandedReviewId, setExpandedReviewId] = useState<string>("stat");
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
      className="relative overflow-hidden bg-[#0B120D] border-t border-[rgba(74,222,128,0.18)] py-24 sm:py-28 px-5 sm:px-8"
    >
      {/* Architectural Botanical Light Shafts (Zero external assets, 60fps CSS) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 65% 45% at 50% 0%, rgba(62,98,72,0.28) 0%, transparent 70%),
            linear-gradient(122deg, transparent 15%, rgba(41,62,48,0.22) 28%, transparent 42%),
            linear-gradient(122deg, transparent 52%, rgba(74,222,128,0.06) 63%, transparent 76%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(11,18,13,0.95) 0%, transparent 75%)
          `,
        }}
      />

      <div className="relative z-10 max-w-[1340px] mx-auto">
        {/* Centered Symmetrical Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-[#4ADE80] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
            INSIDE CAMBIUM · THE RESEARCH OPERATING SYSTEM
          </div>
          <h2
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            className="text-3xl sm:text-5xl lg:text-[54px] font-normal leading-[1.08] tracking-[-0.03em] text-[#FAF7F0] mb-5"
          >
            Built for individual scholars.
            <br />
            Engineered for entire institutions.
          </h2>
          <p className="text-sm sm:text-base text-[#A3B899] max-w-2xl mx-auto leading-relaxed">
            Every proposal draft, citation graph, peer-review ledger, AI paper audit, and grant compliance trail — running in one connected workspace. Click any surface to inspect it live.
          </p>
        </div>

        {/* ── ASYMMETRIC FLOATING COLLAGE (Desktop 12-Col Staggered Bento + Responsive Stack) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* LEFT COLUMN (Cols 1-4): Proposal Drafts Accordion + Rich Text Citation Editor */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:mt-10">
            {/* Panel 1: Proposal Drafts Desk (/workspace) */}
            <div className="rounded-2xl bg-[#111A14]/95 border border-[#233327] shadow-[0_28px_70px_rgba(0,0,0,0.65)] p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1D2D21]">
                <div>
                  <div className="text-xs font-bold text-[#FAF7F0] flex items-center gap-1.5">
                    <Layers size={14} className="text-[#4ADE80]" />
                    Proposal Drafts
                  </div>
                  <div className="font-mono text-[10px] text-[#8FA89B]">
                    NSF-2026-CISE · Active
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#101812] text-[#8FA89B] border border-[#253629]">
                            {sec.code}
                          </span>
                          <span className="text-xs font-semibold text-[#EDEAE2] truncate">
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
                            <div className="text-[11.5px] text-[#FAF7F0] bg-[#0E1510] border border-[#253629] rounded-lg px-2.5 py-1.5">
                              {sec.fieldValue}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-mono text-[#8FA89B] mb-1">
                              {sec.secondaryLabel}
                            </div>
                            <div className="text-[11px] text-[#A3B899] bg-[#0E1510] border border-[#253629] rounded-lg px-2.5 py-1.5">
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
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4ADE80] hover:text-[#FAF7F0] no-underline"
              >
                <Plus size={12} />
                Add Proposal Section in /workspace
              </Link>
            </div>

            {/* Panel 5: Rich Text & BibTeX Citation Editor (/publications) */}
            <div className="rounded-2xl bg-[#111A14]/95 border border-[#233327] shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-4 sm:p-5 relative transition-transform duration-300 hover:-translate-y-1">
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
                <p
                  style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
                  className="text-lg sm:text-xl leading-snug text-[#EDEAE2] m-0"
                >
                  Write manuscripts with{" "}
                  <span
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      activeToolbarStyle === "cite"
                        ? "bg-[#3E6248]/55 text-[#FAF7F0] ring-1 ring-[#4ADE80]/60"
                        : activeToolbarStyle === "bold"
                        ? "font-bold text-[#4ADE80]"
                        : "italic text-[#DCE6D7]"
                    }`}
                  >
                    live BibTeX verification
                  </span>{" "}
                  and instant CRediT attribution.
                </p>

                {/* Live Role Cursor Badge */}
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded bg-[#4ADE80] text-[#0B120D] font-mono text-[10px] font-bold shadow-md">
                  Lead Author
                </span>

                <p className="text-[11.5px] text-[#8FA89B] leading-relaxed mt-2.5 mb-0">
                  Validated BibTeX, APA 7th, and IEEE exports backed directly by DOI metadata and institutional provenance logs.
                </p>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN (Cols 5-8): Institutional OS Telemetry + Citation Code Audit + 3 Visual Asset Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Panel 2: Institutional Research OS Telemetry (/os) */}
            <div className="rounded-2xl bg-[#111A14]/95 border border-[#233327] shadow-[0_32px_80px_rgba(0,0,0,0.72)] p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8FA89B]">
                  Institutional OS · AMET R&amp;D
                </span>
                <SurfaceHeaderLink href="/os" label="/os" />
              </div>

              <h3 className="text-lg font-semibold text-[#FAF7F0] tracking-tight mb-3 mt-0">
                Research Telemetry
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl bg-[#16221A] border border-[#253629] p-3">
                  <div className="flex items-center justify-between text-[10px] text-[#8FA89B] mb-1">
                    <span>Active Grants</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#4ADE80]/15 text-[#4ADE80] font-mono">
                      +18.4%
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[#FAF7F0] tracking-tight">
                    $1.42M
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
                  <div className="flex items-center justify-between text-[10px] text-[#8FA89B] mb-1">
                    <span>Verified Outputs</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#4ADE80]/15 text-[#4ADE80] font-mono">
                      100%
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[#FAF7F0] tracking-tight">
                    27 DOIs
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
                <div className="flex items-center justify-between text-[10.5px] mb-1.5">
                  <span className="text-[#EDEAE2] font-medium">
                    Citation Velocity · 12-Month Trajectory
                  </span>
                  <span className="font-mono text-[#4ADE80]">1,842 Citations</span>
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

            {/* Panel 3: Methodology Auditor & Citation AST (/agent-reader) */}
            <div className="rounded-2xl bg-[#0F1711] border border-[#253629] shadow-[0_28px_72px_rgba(0,0,0,0.72)] p-4 sm:p-5 relative transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#4ADE80]">
                  <Code2 size={12} />
                  rag-engine.ts · Citation Verification
                </span>
                <SurfaceHeaderLink href="/agent-reader" label="/agent-reader" />
              </div>

              <pre className="m-0 font-mono text-[11px] leading-[1.6] text-[#C6D5C0] overflow-x-auto bg-[#0A100C] border border-[#1E2E22] rounded-xl p-3">
                <code>
                  <span className="text-[#8FA89B]">{"// Verified DOI & RAG Chunk Anchor\n"}</span>
                  <span className="text-[#4ADE80]">const</span>{" citation = "}
                  <span className="text-[#FDE68A]">await</span>{" verifyScholarlyClaim({\n"}
                  {"  doi: "}
                  <span className="text-[#A7F3D0]">&quot;10.1016/j.cels.2026.01.004&quot;</span>
                  {",\n  persona: "}
                  <span className="text-[#A7F3D0]">&quot;Methodology Auditor&quot;</span>
                  {",\n  auditSha256: "}
                  <span className="text-[#93C5FD]">true</span>
                  {"\n});\n"}
                  <span className="text-[#4ADE80]">return</span>{" citation."}
                  <span className="text-[#FAF7F0]">groundingScore</span>
                  {"; "}
                  <span className="text-[#8FA89B]">{"// 0.96"}</span>
                </code>
              </pre>

              {/* Floating Role Cursor */}
              <div className="mt-2.5 flex items-center justify-end">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#295237] text-[#FAF7F0] border border-[#4ADE80]/50 font-mono text-[10px] font-semibold shadow-md">
                  <Sparkles size={10} className="text-[#4ADE80]" />
                  Methodology Auditor
                </span>
              </div>
            </div>

            {/* Panel 6: 3 Visual Research Artifacts Strip (/graph, /datasets, /portfolio) */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  title: "Citation Graph",
                  sub: "2,410 edges",
                  href: "/graph",
                  icon: Network,
                },
                {
                  title: "MRI Corpus",
                  sub: "Zenodo v1.2",
                  href: "/datasets",
                  icon: Database,
                },
                {
                  title: "Checkpoints",
                  sub: "Apache-2.0",
                  href: "/portfolio",
                  icon: GitBranch,
                },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group rounded-xl bg-[#111A14]/95 border border-[#233327] hover:border-[#4ADE80] p-3 no-underline shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[112px]"
                  >
                    <div className="flex items-center justify-between text-[#8FA89B] group-hover:text-[#4ADE80] transition-colors">
                      <IconComp size={14} />
                      <ArrowUpRight size={12} />
                    </div>
                    <div className="my-2 h-8 rounded-lg bg-gradient-to-br from-[#19281D] to-[#0E1610] border border-[#233327] flex items-center justify-center">
                      <span className="w-8 h-1 rounded-full bg-[#4ADE80]/45 group-hover:bg-[#4ADE80] transition-colors" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-[#FAF7F0] truncate">
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

          {/* RIGHT COLUMN (Cols 9-12): AI Paper Live Synthesis Split Preview + COPE Peer Review & Audit Ledger */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:mt-6">
            {/* Panel 4: AI Paper Reader Split-Pane Preview (/agent-reader) */}
            <div className="rounded-2xl bg-[#111A14]/95 border border-[#233327] shadow-[0_28px_70px_rgba(0,0,0,0.68)] p-4 sm:p-5 relative transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1D2D21]">
                <div className="min-w-0">
                  <div className="font-mono text-[9.5px] text-[#8FA89B] truncate">
                    /agent-reader · Live Synthesis
                  </div>
                  <div className="text-xs font-bold text-[#FAF7F0] truncate">
                    Emergent Sparse Attention in MRI
                  </div>
                </div>
                <SurfaceHeaderLink href="/agent-reader" label="Inspect" />
              </div>

              <div className="grid grid-cols-12 gap-3">
                {/* Left metadata inputs */}
                <div className="col-span-7 space-y-2">
                  <div>
                    <div className="text-[9.5px] font-mono text-[#8FA89B] mb-1">
                      Target Section
                    </div>
                    <div className="text-[11px] text-[#FAF7F0] bg-[#0E1510] border border-[#253629] rounded-lg px-2.5 py-1.5">
                      Sec 3.2 · Ablation Matrix
                    </div>
                  </div>
                  <div className="relative">
                    <div className="text-[9.5px] font-mono text-[#8FA89B] mb-1">
                      Verified Claim Anchor
                    </div>
                    <div className="text-[11px] text-[#DCE6D7] bg-[#0E1510] border border-[#38BDF8]/45 rounded-lg px-2.5 py-1.5">
                      Dice +4.2% across out-of-distribution scanners
                    </div>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#38BDF8] text-[#0B120D] font-mono text-[9px] font-bold mt-1.5">
                      Postdoc
                    </span>
                  </div>
                </div>

                {/* Right live preview window */}
                <div className="col-span-5 rounded-xl bg-[#0A100C] border border-[#253629] p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#18241C] text-[#A3B899]">
                      arXiv PDF
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                  </div>
                  <div
                    style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
                    className="text-[12px] text-[#FAF7F0] leading-snug"
                  >
                    L = L_seg + λ · KL(q‖p)
                  </div>
                  <div className="text-[9.5px] font-mono text-[#8FA89B] mt-2">
                    p. 6 · Eq. (4) grounded
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 7: COPE Peer-Review Matrix & SHA-256 Audit Ledger (/peer-review & /audit) */}
            <div className="rounded-2xl bg-[#111A14]/95 border border-[#233327] shadow-[0_26px_68px_rgba(0,0,0,0.65)] p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1D2D21]">
                <div>
                  <div className="text-xs font-bold text-[#FAF7F0] flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#4ADE80]" />
                    Peer Review &amp; Audit Ledger
                  </div>
                  <div className="font-mono text-[10px] text-[#8FA89B]">
                    COPE Double-Blind · SHA-256 Chain
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
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#101812] text-[#8FA89B] border border-[#253629]">
                            {item.code}
                          </span>
                          <span className="text-xs font-semibold text-[#EDEAE2] truncate">
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
                          <div className="relative rounded-lg bg-[#0E1510] border border-[#F59E0B]/40 p-2.5 text-[11px] text-[#EDEAE2] leading-relaxed">
                            {item.note}
                            <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded bg-[#F59E0B] text-[#0B120D] font-mono text-[9px] font-bold align-middle">
                              Peer Reviewer
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded bg-[#101812] border border-[#253629] font-mono text-[9.5px] text-[#A3B899]"
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
                  Grants Radar ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
