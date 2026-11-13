"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Download,
  Copy,
  Check,
  Sparkles,
  Calendar,
  DollarSign,
  Building2,
  Trash2,
  ExternalLink,
  Save,
  BookOpen,
} from "lucide-react";

export interface ProposalDraft {
  id: string;
  title: string;
  funder: string;
  program: string;
  budget: string;
  deadline: string;
  status: "DRAFTING" | "INTERNAL_REVIEW" | "READY_TO_SUBMIT";
  lastEdited: string;
  aims: string;
  significance: string;
  methodology: string;
  budgetBreakdown: string;
  keywords: string[];
}

const DEFAULT_DRAFTS: ProposalDraft[] = [
  {
    id: "draft-satc-2026",
    title: "Graph Neural Networks for Cryptographic Protocol Verification",
    funder: "National Science Foundation (NSF)",
    program: "Secure and Trustworthy Cyberspace (SaTC)",
    budget: "$600,000",
    deadline: "2026-12-15",
    status: "DRAFTING",
    lastEdited: "10 mins ago",
    aims: `Specific Aim 1: Design inductive graph attention representations over abstract syntax trees (ASTs) of cryptographic primitives.
Specific Aim 2: Train zero-shot neural invariant verifiers capable of detecting timing side-channels and state desynchronizations.
Specific Aim 3: Empirical evaluation across OpenSSL and WireGuard cryptographic implementations with zero false-negative guarantees.`,
    significance: `Current automated theorem provers require extensive manual invariant annotations, creating an unbridgeable verification gap for modern cryptographic libraries. By leveraging topological representations, our architecture reduces human formalization effort by 85% while guaranteeing sound invariants.`,
    methodology: `We will utilize a dual-layer architecture: a neuro-symbolic grammar extractor combined with a bounded model checker (CBMC). All trained representations will be published under open-source Apache-2.0 licenses in compliance with FAIR data principles.`,
    budgetBreakdown: `• Senior Personnel (Lead PI, 2 months summer): $48,000
• 2 PhD Graduate Research Assistants (stipend + tuition): $280,000
• Compute Infrastructure (A100 GPU cluster hours): $110,000
• Dissemination & IEEE S&P Conference Travel: $22,000
• Institutional F&A Indirect Costs (52%): $140,000`,
    keywords: ["Cryptographic Protocols", "Graph Neural Networks", "Formal Methods", "Symbolic Execution"],
  },
  {
    id: "draft-r01-spatial",
    title: "Foundation Models for Multi-Modal Spatial Transcriptomics in Glioblastoma",
    funder: "National Institutes of Health (NIH)",
    program: "R01 Research Project Grant (NCI / NLM)",
    budget: "$1,850,000",
    deadline: "2027-02-05",
    status: "INTERNAL_REVIEW",
    lastEdited: "Yesterday",
    aims: `Specific Aim 1: Construct a unified multi-tissue spatial embedding space mapping 10x Visium and MERFISH multiplexed imaging datasets.
Specific Aim 2: Uncover tumor-microenvironment resistance niches through spatially-resolved cell-cell communication inference.
Specific Aim 3: Validate predicted therapeutic targets using patient-derived glioblastoma organoid perturbation assays.`,
    significance: `Glioblastoma heterogeneity remains the primary obstacle to durable immunotherapy. Existing spatial pipelines analyze gene expression in isolation from histological morphology. Our multi-modal foundation model enables joint latent inference, pinpointing invasive margin niches that escape surgical resection.`,
    methodology: `We leverage a masked autoencoder architecture trained on over 4.2 million spatial transcriptomic spots. Downstream validation is performed in collaboration with the Department of Neurosurgery and validated against clinical progression-free survival records.`,
    budgetBreakdown: `• Principal Investigators (MPI Imthiyas & Rostova, 25% calendar): $160,000/yr
• Postdoctoral Computational Biologist & Staff Bioinformatician: $240,000/yr
• Sequencing & Spatial Consumables (10x Genomics Visium CytAssist): $450,000
• Laboratory Animal Organoid Perturbations: $280,000
• Institutional Overhead & Compliance Audits: $720,000`,
    keywords: ["Spatial Transcriptomics", "Foundation Models", "Glioblastoma", "Single-Cell Biology"],
  },
];

interface ProposalDraftsDeskProps {
  injectedDraft?: {
    title?: string;
    funder?: string;
    budget?: string;
  };
}

export function ProposalDraftsDesk({ injectedDraft }: ProposalDraftsDeskProps) {
  const [drafts, setDrafts] = useState<ProposalDraft[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cambium_workspace_drafts_v2");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse stored workspace drafts", e);
        }
      }
    }
    return DEFAULT_DRAFTS;
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    return DEFAULT_DRAFTS[0]?.id || "";
  });

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"aims" | "significance" | "methodology" | "budget">("aims");
  const [copiedSection, setCopiedSection] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Draft Modal state
  const [newTitle, setNewTitle] = useState("");
  const [newFunder, setNewFunder] = useState("");
  const [newProgram, setNewProgram] = useState("");
  const [newBudget, setNewBudget] = useState("");

  // Handle injected draft from opportunities page
  useEffect(() => {
    if (injectedDraft?.title) {
      const existing = drafts.find((d) => d.title.toLowerCase() === injectedDraft.title?.toLowerCase());
      if (existing) {
        setSelectedId(existing.id);
      } else {
        const newDraft: ProposalDraft = {
          id: `draft-inj-${Date.now()}`,
          title: injectedDraft.title,
          funder: injectedDraft.funder || "Federal Grant Agency",
          program: "Targeted Research Initiative",
          budget: injectedDraft.budget || "$750,000",
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "DRAFTING",
          lastEdited: "Just now",
          aims: `Specific Aim 1: Define baseline empirical methodology and formulate research objectives for ${injectedDraft.title}.\nSpecific Aim 2: Develop robust experimental framework and validation protocols.\nSpecific Aim 3: Benchmark findings and deliver open-access computational reproducibility package.`,
          significance: `This research directly addresses the solicitation criteria published by ${injectedDraft.funder || "the sponsor"}, providing measurable breakthroughs in the domain.`,
          methodology: `Our proposed methodology employs rigorous validation controls, multi-site reproducibility protocols, and FAIR data dissemination.`,
          budgetBreakdown: `• Personnel: 60%\n• Direct Research Supplies & Compute: 25%\n• Travel & Publication: 5%\n• Institutional Overhead: 10%`,
          keywords: ["Grant Proposal", "Specific Aims", "Novel Investigation"],
        };

        const updated = [newDraft, ...drafts];
        setDrafts(updated);
        setSelectedId(newDraft.id);
        if (typeof window !== "undefined") {
          localStorage.setItem("cambium_workspace_drafts_v2", JSON.stringify(updated));
        }
      }
    }
  }, [injectedDraft]);

  // Persist to localStorage whenever drafts change
  const saveDraftsToStorage = (updated: ProposalDraft[]) => {
    setDrafts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("cambium_workspace_drafts_v2", JSON.stringify(updated));
    }
  };

  const activeDraft = drafts.find((d) => d.id === selectedId) || drafts[0];

  const updateActiveDraft = (patch: Partial<ProposalDraft>) => {
    if (!activeDraft) return;
    const updated = drafts.map((d) => {
      if (d.id === activeDraft.id) {
        return {
          ...d,
          ...patch,
          lastEdited: "Just now",
        };
      }
      return d;
    });
    saveDraftsToStorage(updated);
  };

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: ProposalDraft = {
      id: `draft-${Date.now()}`,
      title: newTitle.trim(),
      funder: newFunder.trim() || "National Science Foundation",
      program: newProgram.trim() || "Principal Investigator Award",
      budget: newBudget.trim() || "$500,000",
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "DRAFTING",
      lastEdited: "Just now",
      aims: "Specific Aim 1: Hypothesize and formulate core mathematical/computational foundations.\nSpecific Aim 2: Conduct empirical benchmarking against state-of-the-art baselines.\nSpecific Aim 3: Validate robustness across multi-domain datasets.",
      significance: "Formulate the scientific rationale and unresolved challenges addressed by this investigation.",
      methodology: "Detail research design, data collection protocols, and statistical power calculations.",
      budgetBreakdown: "• Personnel & Research Assistants: $300,000\n• Computational Resources & Equipment: $120,000\n• Travel & Dissemination: $30,000\n• Indirect Costs: $50,000",
      keywords: ["Research Proposal", "Specific Aims"],
    };

    const updated = [created, ...drafts];
    saveDraftsToStorage(updated);
    setSelectedId(created.id);
    setIsNewModalOpen(false);
    setNewTitle("");
    setNewFunder("");
    setNewProgram("");
    setNewBudget("");
  };

  const handleDeleteDraft = (id: string) => {
    if (drafts.length <= 1) return;
    const updated = drafts.filter((d) => d.id !== id);
    saveDraftsToStorage(updated);
    if (selectedId === id) {
      setSelectedId(updated[0]?.id || "");
    }
  };

  const handleCopyCurrentSection = () => {
    if (!activeDraft) return;
    const textToCopy =
      activeTab === "aims"
        ? activeDraft.aims
        : activeTab === "significance"
        ? activeDraft.significance
        : activeTab === "methodology"
        ? activeDraft.methodology
        : activeDraft.budgetBreakdown;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedSection(true);
      setTimeout(() => setCopiedSection(false), 2000);
    }
  };

  const handleExportMarkdown = () => {
    if (!activeDraft) return;
    const md = `# ${activeDraft.title}
**Funding Agency**: ${activeDraft.funder}
**Program Call**: ${activeDraft.program}
**Requested Budget**: ${activeDraft.budget}
**Deadline**: ${activeDraft.deadline}
**Status**: ${activeDraft.status}

---

## 1. Specific Aims
${activeDraft.aims}

## 2. Significance & Scientific Impact
${activeDraft.significance}

## 3. Research Design & Methodology
${activeDraft.methodology}

## 4. Budget & Resource Allocation
${activeDraft.budgetBreakdown}

---
*Generated by Cambium Research Operating System — Living Materials Enterprise Desk*
`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDraft.title.slice(0, 32).replace(/[^a-zA-Z0-9]/g, "_")}_Proposal.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportLatex = () => {
    if (!activeDraft) return;
    const tex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,amsfonts,amssymb}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{\\textbf{${activeDraft.title}}}
\\author{Principal Investigator: Cambium Research Fellow}
\\date{\\today}

\\begin{document}
\\maketitle

\\begin{abstract}
Target Grant: ${activeDraft.funder} (${activeDraft.program}) \\\\
Requested Funding Allocation: ${activeDraft.budget} \\\\
Submission Deadline: ${activeDraft.deadline}
\\end{abstract}

\\section{Specific Aims}
${activeDraft.aims.replace(/\n/g, "\n\n")}

\\section{Significance and Innovation}
${activeDraft.significance.replace(/\n/g, "\n\n")}

\\section{Research Strategy and Methodology}
${activeDraft.methodology.replace(/\n/g, "\n\n")}

\\section{Budget Justification}
\\begin{verbatim}
${activeDraft.budgetBreakdown}
\\end{verbatim}

\\end{document}
`;

    const blob = new Blob([tex], { type: "application/x-latex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDraft.title.slice(0, 32).replace(/[^a-zA-Z0-9]/g, "_")}_Proposal.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDrafts = drafts.filter((d) => {
    const matchesStatus = filterStatus === "ALL" || d.status === filterStatus;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.funder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.program.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex h-full w-full bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] overflow-hidden font-sans">
      {/* ── Left Column: Drafts Index (320px) ── */}
      <div className="w-80 shrink-0 border-r border-[#E4DCCB] dark:border-[#233327] flex flex-col h-full bg-[#F4EFE6]/50 dark:bg-[#141E16]/40">
        {/* Top Header & New Button */}
        <div className="p-4 border-b border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#3E6248] text-white flex items-center justify-center shadow-xs">
              <FileText size={15} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#202920] dark:text-[#EDEAE2] leading-tight">
                Proposal Drafts
              </h2>
              <span className="text-[10px] font-mono text-[#62685E] dark:text-[#A3B899]">
                {drafts.length} Active Dossiers
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] text-xs font-semibold shadow-xs cursor-pointer transition-all"
            title="Create New Grant Proposal Draft"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>New Draft</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-3 border-b border-[#E4DCCB] dark:border-[#233327] space-y-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2.5 text-[#85877B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search proposals or agencies..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#18231B] text-xs text-[#202920] dark:text-[#EDEAE2] placeholder-[#85877B] focus:outline-none focus:ring-1 focus:ring-[#3E6248]"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {["ALL", "DRAFTING", "INTERNAL_REVIEW", "READY_TO_SUBMIT"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  filterStatus === st
                    ? "bg-[#3E6248] text-white font-semibold shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:bg-[#E4DCCB]/60 dark:hover:bg-[#233327]"
                }`}
              >
                {st === "ALL" ? "All" : st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E4DCCB]/60 dark:divide-[#233327]/60">
          {filteredDrafts.map((d) => {
            const isSelected = d.id === selectedId;
            return (
              <div
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`p-3.5 transition-colors cursor-pointer text-left relative ${
                  isSelected
                    ? "bg-[#FAF7F0] dark:bg-[#18231B] border-l-3 border-[#3E6248] dark:border-[#4ADE80] shadow-xs"
                    : "hover:bg-[#EBE5D8]/50 dark:hover:bg-[#18231B]/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[9.5px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold ${
                      d.status === "READY_TO_SUBMIT"
                        ? "bg-[#DCE6D7] text-[#293E30] dark:bg-[#1A281E] dark:text-[#4ADE80]"
                        : d.status === "INTERNAL_REVIEW"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                    }`}
                  >
                    {d.status.replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-mono text-[#85877B]">{d.lastEdited}</span>
                </div>

                <h3 className="text-xs font-semibold text-[#202920] dark:text-[#EDEAE2] line-clamp-2 leading-snug mb-1">
                  {d.title}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-[#62685E] dark:text-[#A3B899] font-mono">
                  <span className="truncate max-w-[130px]">{d.funder}</span>
                  <span className="font-semibold text-[#3E6248] dark:text-[#4ADE80]">{d.budget}</span>
                </div>
              </div>
            );
          })}

          {filteredDrafts.length === 0 && (
            <div className="p-8 text-center text-xs text-[#85877B] space-y-2">
              <FileText size={24} className="mx-auto text-[#85877B]/60" />
              <p>No proposal drafts match query.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Column: Interactive Proposal Editor ── */}
      {activeDraft ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAF7F0] dark:bg-[#0E140F]">
          {/* Top Metadata Strip */}
          <div className="p-5 border-b border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#131C15] space-y-3 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <input
                  type="text"
                  value={activeDraft.title}
                  onChange={(e) => updateActiveDraft({ title: e.target.value })}
                  className="w-full font-serif text-xl sm:text-2xl font-bold text-[#202920] dark:text-[#EDEAE2] bg-transparent border-0 p-0 focus:outline-none focus:ring-0 leading-tight"
                  placeholder="Proposal Title..."
                />

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#62685E] dark:text-[#A3B899] pt-1">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Building2 size={13} className="text-[#3E6248] dark:text-[#4ADE80]" />
                    <input
                      type="text"
                      value={activeDraft.funder}
                      onChange={(e) => updateActiveDraft({ funder: e.target.value })}
                      className="bg-transparent border-b border-transparent hover:border-[#E4DCCB] focus:border-[#3E6248] focus:outline-none font-semibold text-[#202920] dark:text-[#EDEAE2]"
                    />
                  </div>

                  <span className="text-[#85877B]">·</span>

                  <div className="flex items-center gap-1 font-mono">
                    <DollarSign size={13} className="text-[#3E6248] dark:text-[#4ADE80]" />
                    <input
                      type="text"
                      value={activeDraft.budget}
                      onChange={(e) => updateActiveDraft({ budget: e.target.value })}
                      className="bg-transparent border-b border-transparent hover:border-[#E4DCCB] focus:border-[#3E6248] focus:outline-none font-bold text-[#3E6248] dark:text-[#4ADE80] w-24"
                    />
                  </div>

                  <span className="text-[#85877B]">·</span>

                  <div className="flex items-center gap-1 font-mono">
                    <Calendar size={13} className="text-[#85877B]" />
                    <span>Target Deadline:</span>
                    <input
                      type="date"
                      value={activeDraft.deadline}
                      onChange={(e) => updateActiveDraft({ deadline: e.target.value })}
                      className="bg-transparent border-b border-transparent hover:border-[#E4DCCB] focus:border-[#3E6248] focus:outline-none text-[#202920] dark:text-[#EDEAE2]"
                    />
                  </div>
                </div>
              </div>

              {/* Status Selector & Action Strip */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={activeDraft.status}
                  onChange={(e) => updateActiveDraft({ status: e.target.value as any })}
                  className="text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#18231B] text-[#202920] dark:text-[#EDEAE2] focus:outline-none cursor-pointer"
                >
                  <option value="DRAFTING">Drafting</option>
                  <option value="INTERNAL_REVIEW">Internal Review</option>
                  <option value="READY_TO_SUBMIT">Ready to Submit</option>
                </select>

                <button
                  type="button"
                  onClick={handleExportLatex}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#18231B] hover:bg-[#E4DCCB]/60 dark:hover:bg-[#233327] text-xs font-mono font-medium text-[#202920] dark:text-[#EDEAE2] cursor-pointer shadow-2xs"
                  title="Download standard LaTeX package"
                >
                  <Download size={13} />
                  <span>LaTeX</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#18231B] hover:bg-[#E4DCCB]/60 dark:hover:bg-[#233327] text-xs font-mono font-medium text-[#202920] dark:text-[#EDEAE2] cursor-pointer shadow-2xs"
                  title="Download Markdown summary"
                >
                  <Download size={13} />
                  <span>Markdown</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteDraft(activeDraft.id)}
                  className="p-2 rounded-lg text-[#85877B] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Delete proposal draft"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex items-center justify-between border-t border-[#E4DCCB]/60 dark:border-[#233327]/60 pt-3">
              <div className="flex gap-2">
                {[
                  { id: "aims", label: "Specific Aims", count: activeDraft.aims.length },
                  { id: "significance", label: "Significance & Innovation", count: activeDraft.significance.length },
                  { id: "methodology", label: "Research Methodology", count: activeDraft.methodology.length },
                  { id: "budget", label: "Budget Justification", count: activeDraft.budgetBreakdown.length },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === t.id
                        ? "bg-[#3E6248] text-white shadow-xs font-semibold"
                        : "text-[#62685E] dark:text-[#A3B899] hover:bg-[#E4DCCB]/60 dark:hover:bg-[#233327]"
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="text-[10px] opacity-70">({Math.round(t.count / 5)}w)</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopyCurrentSection}
                className="flex items-center gap-1 text-[11px] font-mono text-[#3E6248] dark:text-[#4ADE80] hover:underline cursor-pointer"
              >
                {copiedSection ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedSection ? "Copied Section" : "Copy Plain Text"}</span>
              </button>
            </div>
          </div>

          {/* Section Body Editor */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-[#62685E] dark:text-[#A3B899] font-mono pb-1 border-b border-[#E4DCCB]/60 dark:border-[#233327]/60">
                <span>
                  {activeTab === "aims"
                    ? "Section 1: Specific Aims & Primary Hypotheses (NIH / NSF format)"
                    : activeTab === "significance"
                    ? "Section 2: Scientific Significance, Unresolved Gaps & Innovation"
                    : activeTab === "methodology"
                    ? "Section 3: Research Strategy, Work Packages & Experimental Protocols"
                    : "Section 4: Direct Personnel, Supplies & Institutional F&A Justification"}
                </span>
                <span className="text-[11px]">Auto-saved to secure local vault</span>
              </div>

              <textarea
                rows={20}
                value={
                  activeTab === "aims"
                    ? activeDraft.aims
                    : activeTab === "significance"
                    ? activeDraft.significance
                    : activeTab === "methodology"
                    ? activeDraft.methodology
                    : activeDraft.budgetBreakdown
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (activeTab === "aims") updateActiveDraft({ aims: val });
                  else if (activeTab === "significance") updateActiveDraft({ significance: val });
                  else if (activeTab === "methodology") updateActiveDraft({ methodology: val });
                  else updateActiveDraft({ budgetBreakdown: val });
                }}
                className="w-full p-4 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#131C15] font-mono text-xs sm:text-sm text-[#202920] dark:text-[#EDEAE2] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#3E6248] resize-none shadow-2xs"
                placeholder="Draft section content..."
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-[#85877B]">
          Select or initialize a proposal draft to begin editing.
        </div>
      )}

      {/* ── New Draft Modal ── */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#202920]/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4DCCB] dark:border-[#233327] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3E6248] text-white flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#202920] dark:text-[#EDEAE2]">
                    Initialize Grant Proposal
                  </h3>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899]">
                    Standardized Specific Aims & Budget framework
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="text-[#85877B] hover:text-[#202920] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#62685E] dark:text-[#A3B899] mb-1 font-semibold">
                  Investigation Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Robust Quantum Invariance for Distributed Consensus"
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] text-xs text-[#202920] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#3E6248]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#62685E] dark:text-[#A3B899] mb-1 font-semibold">
                    Target Funder
                  </label>
                  <input
                    type="text"
                    value={newFunder}
                    onChange={(e) => setNewFunder(e.target.value)}
                    placeholder="e.g. NSF / NIH / ERC"
                    className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] text-xs text-[#202920] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#3E6248]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#62685E] dark:text-[#A3B899] mb-1 font-semibold">
                    Requested Budget
                  </label>
                  <input
                    type="text"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="e.g. $750,000"
                    className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] text-xs text-[#202920] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#3E6248]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#62685E] dark:text-[#A3B899] mb-1 font-semibold">
                  Program Mechanism / Call
                </label>
                <input
                  type="text"
                  value={newProgram}
                  onChange={(e) => setNewProgram(e.target.value)}
                  placeholder="e.g. Cyberinfrastructure Early Career Track"
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] text-xs text-[#202920] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#3E6248]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4DCCB] dark:border-[#233327]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E4DCCB] dark:border-[#233327] text-xs font-mono text-[#62685E] hover:bg-[#E4DCCB]/50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono font-semibold shadow-xs cursor-pointer"
                >
                  Create Proposal Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProposalDraftsDesk;
