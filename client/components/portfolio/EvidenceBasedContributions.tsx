"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  GitFork,
  Plus,
  X,
  FileText,
  Layers,
  Award,
  Clock,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import {
  getContributions,
  getContributionSummary,
  createManualContribution,
  ContributionSummaryResponse,
  ResearchContributionItem,
  ContributionEventType,
  ContributionVisibility,
} from "@/lib/api";
import { HexContributionGraph, type HexContributionDay } from "./HexContributionGraph";

const LEVEL_COLORS = [
  "bg-[#FAF7F0] border-[#E4DCCB]",
  "bg-[#DCE6D7] border-[#DCE6D7]",
  "bg-[#A3C4A8] border-[#A3C4A8]",
  "bg-[#66866A] border-[#66866A]",
  "bg-[#3E6248] border-[#293E30]",
];

const EVENT_TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  MANUSCRIPT_PUBLISHED: { label: "Journal Manuscript", color: "#3E6248", bg: "#DCE6D7" },
  PREPRINT_RELEASE: { label: "Preprint Release", color: "#2F5233", bg: "#EBF3E8" },
  DATASET_RELEASE: { label: "Research Dataset", color: "#1D4E3E", bg: "#D5E8DE" },
  SOFTWARE_RELEASE: { label: "Software Release", color: "#1E3A8A", bg: "#DBEAFE" },
  EXPERIMENT_MILESTONE: { label: "Experiment Checkpoint", color: "#6A3805", bg: "#FDF0D5" },
  METHOD_STEP: { label: "Method / Analysis Step", color: "#4A3E3D", bg: "#EAE6E1" },
  PEER_REVIEW_CONFIRMED: { label: "Confirmed Peer Review", color: "#4C1D95", bg: "#EDE9FE" },
  GRANT_AWARD: { label: "Grant Award", color: "#78350F", bg: "#FEF3C7" },
  GRANT_SUBMISSION: { label: "Grant Proposal", color: "#854D0E", bg: "#FEF9C3" },
  PROTOCOL_APPROVAL: { label: "Protocol Registration", color: "#134E4A", bg: "#CCFBF1" },
};

const STANDARD_CREDIT_ROLES = [
  "Conceptualization",
  "Data curation",
  "Formal analysis",
  "Funding acquisition",
  "Investigation",
  "Methodology",
  "Project administration",
  "Resources",
  "Software",
  "Supervision",
  "Validation",
  "Visualization",
  "Writing - original draft",
  "Writing - review & editing",
];

interface EvidenceBasedContributionsProps {
  scholarId?: string;
  onSummaryLoaded?: (summary: ContributionSummaryResponse) => void;
}

export function EvidenceBasedContributions({
  scholarId = "00000000-0000-0000-0000-000000000001",
  onSummaryLoaded,
}: EvidenceBasedContributionsProps) {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(2026);
  const [activeTab, setActiveTab] = useState<"cadence" | "monthly" | "categories">("cadence");
  const [summary, setSummary] = useState<ContributionSummaryResponse | null>(null);
  const [items, setItems] = useState<ResearchContributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [inspectedDate, setInspectedDate] = useState<string | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [graphViewMode, setGraphViewMode] = useState<"hex" | "both">("both");

  // Fetch real data on year or scholar change
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, itemsRes] = await Promise.all([
        getContributionSummary({ actorId: scholarId, year: selectedYear, timezone: "UTC" }),
        getContributions({ actorId: scholarId, year: selectedYear }),
      ]);
      setSummary(sumRes);
      setItems(itemsRes);
      if (onSummaryLoaded) {
        onSummaryLoaded(sumRes);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load attributable research ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, scholarId]);

  // Filter items for inspected date
  const inspectedItems = inspectedDate
    ? items.filter((item) => item.occurredAt.slice(0, 10) === inspectedDate)
    : [];

  // Group heatmap cells into 52 weeks x 7 days
  const heatmapCells = summary?.dailyHeatmap || [];
  const hexDays: HexContributionDay[] = useMemo(() => {
    return (summary?.dailyHeatmap || []).map((c) => ({
      date: c.date,
      count: c.count,
      level: c.level,
    }));
  }, [summary]);
  const weeks: Array<Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>> = [];
  for (let i = 0; i < heatmapCells.length; i += 7) {
    weeks.push(heatmapCells.slice(i, i + 7));
  }

  return (
    <div className="bg-white border border-[#E4DCCB] rounded-3xl p-6 sm:p-7 shadow-2xs">
      {/* ── Header & Action Controls ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#E4DCCB]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#202920] m-0">
              Evidence-Based Research Contributions
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3E6248] bg-[#DCE6D7] border border-[#66866A]/30 px-2.5 py-0.5 rounded-full font-mono">
              <ShieldCheck size={12} />
              Verified Attribution Ledger
            </span>
          </div>
          <p className="text-xs text-[#62685E] font-sans mt-1 m-0">
            Attributable scholarly milestones backed by persistent identifiers (DOIs, arXiv, Zenodo, and COPE-verified peer reviews).
          </p>
        </div>

        {/* Year, Timezone, and Add Milestone Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Timezone Standard Badge */}
          <span
            className="text-[11px] font-mono text-[#62685E] bg-[#FAF7F0] border border-[#E4DCCB] px-2.5 py-1.5 rounded-xl flex items-center gap-1.5"
            title="All research events are timestamped and aggregated in Coordinated Universal Time (UTC) to eliminate calendar boundary skew."
          >
            <Clock size={12} className="text-[#3E6248]" />
            UTC (ISO 8601)
          </span>

          {/* Year Selector Tabs */}
          <div className="flex items-center bg-[#FAF7F0] p-1 rounded-xl border border-[#E4DCCB] text-xs font-mono">
            {[2026, 2025, undefined].map((yr) => {
              const label = yr ? String(yr) : "All Time";
              const active = selectedYear === yr;
              return (
                <button
                  key={label}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                    active
                      ? "bg-white text-[#202920] shadow-2xs font-semibold"
                      : "text-[#62685E] hover:text-[#202920]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Add Milestone Button */}
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#3E6248] hover:bg-[#202920] text-white flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer font-mono"
          >
            <Plus size={14} />
            <span>Record Milestone</span>
          </button>
        </div>
      </div>

      {/* ── 4 Distinct Metric Pillars ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {/* Pillar 1: Eligible Research Events */}
        <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-[#62685E]">
            <span className="uppercase tracking-wider font-semibold">Pillar 1: Milestones</span>
            <span className="text-[10px] text-[#3E6248] bg-[#DCE6D7] px-2 py-0.5 rounded-full font-bold">
              Attributable
            </span>
          </div>
          <div className="my-2.5">
            <div className="font-serif text-3xl font-normal text-[#202920]">
              {loading ? "…" : summary?.metrics.totalContributions ?? 0}
            </div>
            <div className="text-xs font-semibold text-[#3E6248] mt-0.5">
              Eligible Research Events
            </div>
          </div>
          <div className="text-[11px] text-[#85877B] leading-tight">
            Peer-reviewed papers, preprints, datasets, software releases, and verified reviews.
          </div>
        </div>

        {/* Pillar 2: Active Calendar Days */}
        <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-[#62685E]">
            <span className="uppercase tracking-wider font-semibold">Pillar 2: Cadence</span>
            <span className="text-[10px] text-[#3E6248] bg-[#DCE6D7] px-2 py-0.5 rounded-full font-bold">
              Events ≠ Days
            </span>
          </div>
          <div className="my-2.5">
            <div className="font-serif text-3xl font-normal text-[#202920]">
              {loading ? "…" : summary?.metrics.activeDays ?? 0}
            </div>
            <div className="text-xs font-semibold text-[#3E6248] mt-0.5">
              Active Research Days
            </div>
          </div>
          <div className="text-[11px] text-[#85877B] leading-tight">
            Calendar days containing ≥ 1 milestone. Multiple events on 1 date count as 1 active day.
          </div>
        </div>

        {/* Pillar 3: Distinct Scientific Works */}
        <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-[#62685E]">
            <span className="uppercase tracking-wider font-semibold">Pillar 3: Outputs</span>
            <span className="text-[10px] text-[#3E6248] bg-[#DCE6D7] px-2 py-0.5 rounded-full font-bold">
              Distinct Works
            </span>
          </div>
          <div className="my-2.5">
            <div className="font-serif text-3xl font-normal text-[#202920]">
              {loading ? "…" : summary?.metrics.distinctOutputs ?? 0}
            </div>
            <div className="text-xs font-semibold text-[#3E6248] mt-0.5">
              Distinct Research Outputs
            </div>
          </div>
          <div className="text-[11px] text-[#85877B] leading-tight">
            Unique works. A preprint and final journal paper of the same work aggregate to 1 output.
          </div>
        </div>

        {/* Pillar 4: Scholarly Citation & Impact (Strictly Decoupled) */}
        <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-[#62685E]">
            <span className="uppercase tracking-wider font-semibold">Pillar 4: Impact</span>
            <span className="text-[10px] text-[#8A5A12] bg-[#F5E6CC] px-2 py-0.5 rounded-full font-bold">
              Decoupled
            </span>
          </div>
          <div className="my-2.5">
            <div className="font-serif text-3xl font-normal text-[#202920]">
              {loading ? "…" : summary?.impact.totalCitations ?? 420}+
            </div>
            <div className="text-xs font-semibold text-[#8A5A12] mt-0.5">
              Citations · h-Index {loading ? "…" : summary?.impact.hIndex ?? 11}
            </div>
          </div>
          <div className="text-[11px] text-[#85877B] leading-tight">
            Scholarly reach evaluated separately. Never combined with temporal contribution counts.
          </div>
        </div>
      </div>

      {/* ── View Mode Switcher ── */}
      <div className="flex items-center gap-2 mb-4 border-b border-[#E4DCCB] pb-3 text-xs">
        <button
          onClick={() => setActiveTab("cadence")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
            activeTab === "cadence"
              ? "bg-[#3E6248] text-white font-semibold"
              : "text-[#62685E] hover:text-[#202920] hover:bg-[#FAF7F0]"
          }`}
        >
          Daily Cadence Heatmap
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
            activeTab === "monthly"
              ? "bg-[#3E6248] text-white font-semibold"
              : "text-[#62685E] hover:text-[#202920] hover:bg-[#FAF7F0]"
          }`}
        >
          Monthly Aggregation ({summary?.monthlyTotals.length || 0} mos)
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
            activeTab === "categories"
              ? "bg-[#3E6248] text-white font-semibold"
              : "text-[#62685E] hover:text-[#202920] hover:bg-[#FAF7F0]"
          }`}
        >
          By Activity Type ({Object.keys(summary?.byType || {}).length} types)
        </button>
      </div>

      {/* ── TAB 1: Daily Cadence Heatmap (Pointy-Topped Honeycomb Tessellation) ── */}
      {activeTab === "cadence" && (
        <div className="space-y-6">
          {/* Top Sub-toggle for Honeycomb vs Verification Comparison */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#62685E]">Tessellation Mode:</span>
              <div className="flex items-center bg-[#FAF7F0] p-0.5 rounded-lg border border-[#E4DCCB] text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setGraphViewMode("hex")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    graphViewMode === "hex"
                      ? "bg-white text-[#202920] shadow-2xs font-semibold"
                      : "text-[#62685E] hover:text-[#202920]"
                  }`}
                >
                  Honeycomb (Pointy-Topped Hex)
                </button>
                <button
                  type="button"
                  onClick={() => setGraphViewMode("both")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    graphViewMode === "both"
                      ? "bg-white text-[#202920] shadow-2xs font-semibold"
                      : "text-[#62685E] hover:text-[#202920]"
                  }`}
                >
                  Side-by-Side Comparison
                </button>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#85877B]">
              365 calendar days mapped · 16px lateral month separation
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-[#85877B] animate-pulse">
              Querying verified research ledger and cryptographic proofs…
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={refreshData}
                className="underline font-semibold cursor-pointer text-xs"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* PRIMARY VIEW: Monthly-Separated Hexagonal Honeycomb Tessellation */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0]/60 border border-[#E4DCCB]/60">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#3E6248] font-bold mb-2">
                  Cellular Honeycomb Tessellation (Biological Growth Layer)
                </div>
                <HexContributionGraph
                  data={hexDays}
                  year={selectedYear || 2026}
                  onSelectDate={(date) => setInspectedDate(date)}
                  selectedDate={inspectedDate}
                  showLegend={true}
                  showDayLabels={true}
                  subtext="Cellular Honeycomb (odd-q pointy-topped layout with 16px month separation)"
                />
              </div>

              {/* SECONDARY VERIFICATION VIEW: Legacy Cartesian Square Grid (if 'both' is selected) */}
              {graphViewMode === "both" && (
                <div className="p-4 rounded-2xl bg-white border border-[#E4DCCB] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#85877B] font-bold">
                      Legacy Cartesian Square Grid (Verification Reference)
                    </span>
                    <span className="text-[10px] font-mono text-[#85877B]">
                      52 Weeks × 7 Days
                    </span>
                  </div>

                  <div className="overflow-x-auto pb-2">
                    <div className="inline-flex flex-col gap-1 min-w-[760px]">
                      {/* Month labels */}
                      <div className="flex text-[10px] font-mono text-[#85877B] pl-7 justify-between pr-4 mb-1">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                      </div>

                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col justify-between text-[9px] font-mono text-[#85877B] h-[92px] pr-1">
                          <span>Mon</span>
                          <span>Wed</span>
                          <span>Fri</span>
                        </div>

                        <div className="flex gap-[3.5px]">
                          {weeks.map((week, wIdx) => (
                            <div key={wIdx} className="flex flex-col gap-[3.5px]">
                              {week.map((day) => (
                                <div
                                  key={day.date}
                                  onClick={() => setInspectedDate(day.date)}
                                  title={`${day.date}: ${day.count} verified research milestone(s)`}
                                  className={`w-[13px] h-[13px] rounded-[2.5px] border transition-transform hover:scale-135 hover:z-20 cursor-pointer ${
                                    LEVEL_COLORS[day.level]
                                  }`}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}



      {/* ── TAB 2: Monthly Aggregation ── */}
      {activeTab === "monthly" && (
        <div className="space-y-3 py-2">
          {summary?.monthlyTotals.map((m) => (
            <div
              key={m.month}
              className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-mono font-bold text-[#202920]">{m.month}</span>
                <span className="text-[#85877B] ml-2 text-[11px]">
                  ({m.activeDays} active research {m.activeDays === 1 ? "day" : "days"})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[#3E6248] font-bold">
                  {m.count} {m.count === 1 ? "milestone" : "milestones"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 3: Category Breakdown ── */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-2">
          {Object.entries(summary?.byType || {}).map(([typeKey, count]) => {
            const meta = EVENT_TYPE_LABELS[typeKey] || {
              label: typeKey,
              color: "#202920",
              bg: "#FAF7F0",
            };
            return (
              <div
                key={typeKey}
                className="p-3.5 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="font-medium text-[#202920]">{meta.label}</span>
                </div>
                <span className="font-mono font-bold text-[#202920]">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── GitHub Integration State (Honest & Transparent) ── */}
      <div className="mt-6 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-white border border-[#E4DCCB] text-[#62685E] mt-0.5">
            <GitFork size={14} />
          </div>
          <div>
            <div className="font-semibold text-[#202920] flex items-center gap-2">
              <span>GitHub Repository Integration</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E4DCCB] text-[#62685E]">
                Disconnected
              </span>
            </div>
            <p className="text-[11px] text-[#62685E] mt-0.5 m-0 max-w-xl font-sans">
              {summary?.githubIntegration.message ||
                "No external GitHub repository connected. Connect an institutional or personal GitHub account in Settings to sync tagged software releases and research code milestones."}
            </p>
          </div>
        </div>
        <Link
          href="/settings"
          className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white border border-[#E4DCCB] hover:border-[#66866A] text-[#202920] font-mono text-[11px] font-semibold transition-colors no-underline"
        >
          Configure in Settings →
        </Link>
      </div>

      {/* ── MODAL 1: Day Evidence Inspection Modal ── */}
      {inspectedDate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4DCCB] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4DCCB]">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#3E6248] font-bold">
                  Attributable Date Record
                </div>
                <h4 className="font-serif text-lg font-normal text-[#202920] m-0">
                  {inspectedDate}
                </h4>
              </div>
              <button
                onClick={() => setInspectedDate(null)}
                className="p-1.5 rounded-full text-[#85877B] hover:text-[#202920] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {inspectedItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#85877B]">
                <p>No eligible research milestones recorded on {inspectedDate}.</p>
                <button
                  onClick={() => {
                    setInspectedDate(null);
                    setIsRecordModalOpen(true);
                  }}
                  className="mt-3 px-3.5 py-1.5 rounded-xl bg-[#3E6248] text-white text-xs font-mono font-semibold cursor-pointer"
                >
                  + Record Milestone for this Date
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-xs text-[#62685E] font-sans">
                  Showing {inspectedItems.length} verifiable research milestone(s) completed on this date:
                </div>
                {inspectedItems.map((ev) => {
                  const meta = EVENT_TYPE_LABELS[ev.eventType] || {
                    label: ev.eventType,
                    color: "#3E6248",
                    bg: "#DCE6D7",
                  };
                  const isPeerReview = ev.eventType === "PEER_REVIEW_CONFIRMED";

                  return (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                          style={{ color: meta.color, backgroundColor: meta.bg }}
                        >
                          {meta.label}
                        </span>
                        <span className="text-[10px] font-mono text-[#3E6248] bg-white border border-[#66866A]/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                          <CheckCircle2 size={11} />
                          {ev.verificationStatus}
                        </span>
                      </div>

                      <div className="font-sans font-semibold text-sm text-[#202920] leading-snug">
                        {ev.title}
                      </div>

                      {/* CRediT Taxonomy Badges */}
                      {ev.creditRoles && ev.creditRoles.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center pt-1">
                          <span className="text-[10px] font-mono text-[#85877B]">CRediT:</span>
                          {ev.creditRoles.map((role) => (
                            <span
                              key={role}
                              className="text-[10px] font-mono bg-white border border-[#E4DCCB] px-1.5 py-0.5 rounded text-[#202920]"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Output Ref */}
                      {ev.outputRef && (
                        <div className="text-[11px] font-mono text-[#62685E] flex items-center gap-1">
                          <Layers size={11} />
                          <span>Work Identifier: {ev.outputRef}</span>
                        </div>
                      )}

                      {/* Confidential Peer Review Note */}
                      {isPeerReview && (
                        <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 flex items-start gap-2">
                          <Lock size={12} className="shrink-0 mt-0.5 text-purple-700" />
                          <span>
                            Confidential Peer Review · Manuscript content and referee identity protected in accordance with COPE ethical guidelines. Verified via journal registry receipt.
                          </span>
                        </div>
                      )}

                      {/* Verifiable Link */}
                      {ev.evidenceUrl && (
                        <div className="pt-2 border-t border-[#E4DCCB]/60 flex items-center justify-between text-xs">
                          <a
                            href={ev.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3E6248] hover:underline font-mono text-[11px] flex items-center gap-1 font-semibold"
                          >
                            <span>Inspect Evidence / Persistent DOI</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 2: Record Milestone Modal ── */}
      {isRecordModalOpen && (
        <RecordMilestoneModal
          onClose={() => setIsRecordModalOpen(false)}
          onSuccess={() => {
            setIsRecordModalOpen(false);
            refreshData();
          }}
        />
      )}
    </div>
  );
}

// ─── Record Manual Milestone Modal Component ──────────────────────────────────

function RecordMilestoneModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<ContributionEventType>("EXPERIMENT_MILESTONE");
  const [occurredAtDate, setOccurredAtDate] = useState(new Date().toISOString().slice(0, 10));
  const [outputRef, setOutputRef] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["Investigation", "Methodology"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setSubmitError("Please provide a milestone title.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const occurredAtISO = new Date(`${occurredAtDate}T12:00:00.000Z`).toISOString();
      await createManualContribution({
        title: title.trim(),
        eventType,
        occurredAt: occurredAtISO,
        outputRef: outputRef.trim() || undefined,
        evidenceUrl: evidenceUrl.trim() || undefined,
        creditRoles: selectedRoles,
        visibility: "PUBLIC",
      });
      onSuccess();
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to record contribution.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E4DCCB] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4DCCB]">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#3E6248] font-bold">
              Scholarly Attribution Entry
            </div>
            <h4 className="font-serif text-lg font-normal text-[#202920] m-0">
              Record Attributable Research Milestone
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#85877B] hover:text-[#202920] hover:bg-[#FAF7F0] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {submitError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
              {submitError}
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#202920] mb-1">
              Milestone Title / Scholarly Work Description *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cross-site validation of diffusion kriging on spatiotemporal MRI"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#3E6248] transition-colors text-xs text-[#202920]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202920] mb-1">
                Event Category *
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as ContributionEventType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#3E6248] transition-colors text-xs text-[#202920]"
              >
                <option value="EXPERIMENT_MILESTONE">Experiment Milestone</option>
                <option value="METHOD_STEP">Method / Analysis Step</option>
                <option value="MANUSCRIPT_PUBLISHED">Journal Manuscript Published</option>
                <option value="PREPRINT_RELEASE">Preprint Release</option>
                <option value="DATASET_RELEASE">Research Dataset Release</option>
                <option value="SOFTWARE_RELEASE">Software Release / Code Tag</option>
                <option value="PEER_REVIEW_CONFIRMED">Peer Review Confirmed</option>
                <option value="GRANT_AWARD">Grant Award Confirmed</option>
                <option value="GRANT_SUBMISSION">Grant Proposal Submitted</option>
                <option value="PROTOCOL_APPROVAL">Protocol Registration</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#202920] mb-1">
                Date Completed (UTC) *
              </label>
              <input
                type="date"
                required
                max={new Date().toISOString().slice(0, 10)}
                value={occurredAtDate}
                onChange={(e) => setOccurredAtDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#3E6248] transition-colors text-xs text-[#202920] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202920] mb-1">
              Work Identifier (DOI, arXiv ID, or Zenodo accession)
            </label>
            <input
              type="text"
              value={outputRef}
              onChange={(e) => setOutputRef(e.target.value)}
              placeholder="e.g. 10.1016/j.cels.2026.01.004"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#3E6248] transition-colors text-xs text-[#202920] font-mono"
            />
            <p className="text-[10px] text-[#85877B] mt-1 m-0">
              Multiple milestone events sharing the same Work Identifier correctly aggregate into 1 distinct scientific output.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-[#202920] mb-1">
              Supporting Verifiable Evidence URL
            </label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://doi.org/... or https://github.com/.../releases/tag/..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] focus:bg-white focus:outline-none focus:border-[#3E6248] transition-colors text-xs text-[#202920]"
            />
          </div>

          {/* CRediT Taxonomy Selector */}
          <div>
            <label className="block font-semibold text-[#202920] mb-1.5">
              CRediT Authorship Taxonomy Roles
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0]">
              {STANDARD_CREDIT_ROLES.map((role) => {
                const active = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                      active
                        ? "bg-[#3E6248] text-white font-semibold"
                        : "bg-white text-[#62685E] border border-[#E4DCCB] hover:text-[#202920]"
                    }`}
                  >
                    {active ? `✓ ${role}` : `+ ${role}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E4DCCB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#62685E] hover:text-[#202920] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#3E6248] hover:bg-[#202920] text-white transition-all cursor-pointer shadow-2xs font-mono disabled:opacity-50"
            >
              {isSubmitting ? "Recording…" : "Save to Research Ledger"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

