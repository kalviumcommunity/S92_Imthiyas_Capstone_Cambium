"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  BookOpen,
  Clock,
  DollarSign,
  Award,
  CheckCircle2,
  X,
  Copy,
  Check,
  Search,
  ExternalLink,
  FileText,
  TrendingUp,
} from "lucide-react";

export interface TargetVenue {
  id: string;
  name: string;
  publisher: string;
  impactFactor: number;
  turnaroundDays: number;
  acceptanceRate: number;
  apcCost: string;
  isDiamondOA: boolean;
  matchScore: number;
  focusRationale: string;
  recommendedSection: string;
  url: string;
}

const VENUES_DATABASE: TargetVenue[] = [
  {
    id: "nat-mi",
    name: "Nature Machine Intelligence",
    publisher: "Springer Nature",
    impactFactor: 18.8,
    turnaroundDays: 42,
    acceptanceRate: 8,
    apcCost: "$11,690 (Transformative Agreement Eligible)",
    isDiamondOA: false,
    matchScore: 96,
    focusRationale: "Seeks foundational methodological breakthroughs in artificial intelligence applied to clinical imaging with multi-institutional validation.",
    recommendedSection: "Original Research / Articles",
    url: "https://www.nature.com/natmachintell/",
  },
  {
    id: "ieee-tpami",
    name: "IEEE Trans. on Pattern Analysis and Machine Intelligence (T-PAMI)",
    publisher: "IEEE Computer Society",
    impactFactor: 20.8,
    turnaroundDays: 60,
    acceptanceRate: 11,
    apcCost: "$2,495 (Open Access Hybrid)",
    isDiamondOA: false,
    matchScore: 94,
    focusRationale: "Preeminent computer vision journal emphasizing rigorous algorithmic formulation, theoretical bounds, and SOTA benchmark superiority.",
    recommendedSection: "Regular Paper",
    url: "https://www.computer.org/csdl/journal/tp",
  },
  {
    id: "jmlr",
    name: "Journal of Machine Learning Research (JMLR)",
    publisher: "Microtome Publishing",
    impactFactor: 6.2,
    turnaroundDays: 90,
    acceptanceRate: 22,
    apcCost: "$0 (Diamond Open Access · Free Forever)",
    isDiamondOA: true,
    matchScore: 91,
    focusRationale: "Gold-standard academic venue for pure machine learning theory and foundational algorithms with zero author-facing publication charges.",
    recommendedSection: "Volume Submission",
    url: "https://www.jmlr.org/",
  },
  {
    id: "media",
    name: "Medical Image Analysis (MedIA)",
    publisher: "Elsevier / MICCAI Society",
    impactFactor: 10.9,
    turnaroundDays: 48,
    acceptanceRate: 16,
    apcCost: "$3,620 (Hybrid / Institutional Waiver)",
    isDiamondOA: false,
    matchScore: 95,
    focusRationale: "Official journal of the MICCAI Society dedicated to computational algorithms for medical image computing and clinical diagnostic workflows.",
    recommendedSection: "Original Research Paper",
    url: "https://www.sciencedirect.com/journal/medical-image-analysis",
  },
  {
    id: "cell-sys",
    name: "Cell Systems",
    publisher: "Cell Press",
    impactFactor: 10.3,
    turnaroundDays: 35,
    acceptanceRate: 14,
    apcCost: "$9,350 (Hybrid Open Access)",
    isDiamondOA: false,
    matchScore: 89,
    focusRationale: "Publishes quantitative, system-level discoveries bridging biological phenomena with computational models and data-driven methods.",
    recommendedSection: "Research Article",
    url: "https://www.cell.com/cell-systems/home",
  },
];

export interface JournalScopeMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectDraft?: (venueText: string) => void;
}

export function JournalScopeMatcherModal({
  isOpen,
  onClose,
  onInjectDraft,
}: JournalScopeMatcherModalProps) {
  const [manuscriptTitle, setManuscriptTitle] = useState(
    "Multimodal Foundation Models for Low-Resource Clinical Imaging: A Multi-Center Evaluation"
  );
  const [keywords, setKeywords] = useState("Medical Imaging, Foundation Models, Self-Supervised Learning, Cross-Center Shift");
  const [filterMode, setFilterMode] = useState<"all" | "diamond" | "fast">("all");
  const [copiedVenueId, setCopiedVenueId] = useState<string | null>(null);

  const filteredVenues = useMemo(() => {
    let list = [...VENUES_DATABASE];
    if (filterMode === "diamond") {
      list = list.filter((v) => v.isDiamondOA);
    } else if (filterMode === "fast") {
      list = list.filter((v) => v.turnaroundDays <= 45);
    }
    return list.sort((a, b) => b.matchScore - a.matchScore);
  }, [filterMode]);

  if (!isOpen) return null;

  const handleCopyStrategy = (venue: TargetVenue) => {
    const text = `TARGET VENUE FIT ANALYSIS:\nVenue: ${venue.name} (${venue.publisher})\nImpact Factor: ${venue.impactFactor} | Match: ${venue.matchScore}%\nReview Turnaround: ${venue.turnaroundDays} days\nCost: ${venue.apcCost}\nRationale: ${venue.focusRationale}`;
    navigator.clipboard.writeText(text);
    setCopiedVenueId(venue.id);
    setTimeout(() => setCopiedVenueId(null), 1800);
  };

  const handleInject = (venue: TargetVenue) => {
    const text = `Selected Target Publication Venue: ${venue.name} (IF: ${venue.impactFactor}, ${venue.turnaroundDays}-day turnaround). Scope rationale: ${venue.focusRationale}`;
    if (onInjectDraft) {
      onInjectDraft(text);
    } else {
      localStorage.setItem("cambium_injected_venue", text);
    }
    setCopiedVenueId(venue.id);
    setTimeout(() => {
      setCopiedVenueId(null);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-surface-raised border border-edge-default rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-edge-default flex items-start justify-between gap-4 bg-surface-base">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-moss-50 border border-moss-200/80 text-moss-800 text-[11px] font-mono font-semibold tracking-wide">
              <Sparkles size={13} className="text-moss-700" />
              <span>AI JOURNAL SCOPE MATCHER</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-ink-primary">
              Target Publication Venue & Scope Recommender
            </h2>
            <p className="text-xs text-ink-secondary leading-relaxed max-w-xl">
              Analyzes your manuscript topic, empirical methods, and turnaround preferences to recommend high-impact venues with zero desk-reject risk.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink-primary hover:bg-surface-sunken transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Input Parameters */}
        <div className="p-5 border-b border-edge-default bg-surface-sunken/40 space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-semibold text-ink-secondary uppercase tracking-wider">
              Working Manuscript Title
            </label>
            <input
              type="text"
              value={manuscriptTitle}
              onChange={(e) => setManuscriptTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-edge-default bg-surface-base text-ink-primary focus:border-moss-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[11px] font-mono text-ink-tertiary shrink-0">Keywords:</span>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded border border-edge-default bg-surface-base text-ink-primary focus:border-moss-600 focus:outline-none"
              />
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1 bg-surface-base p-1 rounded-lg border border-edge-default shrink-0">
              {[
                { id: "all", label: "All Venues" },
                { id: "diamond", label: "$0 Diamond OA" },
                { id: "fast", label: "Fast (<45d)" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterMode(f.id as any)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    filterMode === f.id
                      ? "bg-moss-600 text-white shadow-xs"
                      : "text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ranked Venues List */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="p-4 rounded-xl border border-edge-default hover:border-moss-300 bg-surface-base transition-all shadow-xs space-y-2.5 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm font-semibold text-ink-primary group-hover:text-moss-700 transition-colors">
                    {venue.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-sunken text-ink-secondary border border-edge-default">
                    {venue.publisher}
                  </span>
                  {venue.isDiamondOA && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      $0 Diamond OA
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-moss-700 bg-moss-50 px-2.5 py-0.5 rounded border border-moss-200">
                    {venue.matchScore}% Match
                  </span>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1 px-2.5 rounded-lg bg-surface-sunken/60 border border-edge-default/60 text-[11px]">
                <div>
                  <span className="text-ink-tertiary">Impact Factor:</span>{" "}
                  <span className="font-semibold font-mono text-ink-primary">{venue.impactFactor}</span>
                </div>
                <div>
                  <span className="text-ink-tertiary">Turnaround:</span>{" "}
                  <span className="font-semibold font-mono text-ink-primary">{venue.turnaroundDays} Days</span>
                </div>
                <div>
                  <span className="text-ink-tertiary">Acceptance:</span>{" "}
                  <span className="font-semibold font-mono text-ink-primary">{venue.acceptanceRate}%</span>
                </div>
                <div className="truncate">
                  <span className="text-ink-tertiary">APC Fee:</span>{" "}
                  <span className="font-semibold font-mono text-ink-secondary">{venue.apcCost}</span>
                </div>
              </div>

              {/* Rationale */}
              <p className="text-xs text-ink-secondary leading-relaxed">
                <span className="font-semibold text-ink-primary">Scope Fit Rationale:</span> {venue.focusRationale}
              </p>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-edge-default/60 flex items-center justify-between gap-2">
                <a
                  href={venue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-secondary hover:text-ink-primary hover:underline"
                >
                  <span>Aims & Scope Portal</span>
                  <ExternalLink size={11} />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyStrategy(venue)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-edge-default hover:bg-surface-sunken text-[11px] font-medium text-ink-secondary transition-colors"
                  >
                    {copiedVenueId === venue.id ? <Check size={12} className="text-moss-600" /> : <Copy size={12} />}
                    <span>{copiedVenueId === venue.id ? "Copied" : "Copy Scope"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInject(venue)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-moss-600 hover:bg-moss-700 text-white text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    <FileText size={12} />
                    <span>Select for Draft</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

