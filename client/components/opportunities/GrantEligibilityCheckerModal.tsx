"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Download,
  Building2,
  UserCheck,
  Globe2,
  DollarSign,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface GrantOpportunitySummary {
  id: string;
  title: string;
  funder?: string;
  amount?: string;
  deadline?: string;
  mechanism?: string;
}

export interface GrantEligibilityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: GrantOpportunitySummary | null;
  onInjectProposal?: (attestation: string) => void;
}

export function GrantEligibilityCheckerModal({
  isOpen,
  onClose,
  opportunity,
  onInjectProposal,
}: GrantEligibilityCheckerModalProps) {
  const [careerStage, setCareerStage] = useState<
    "phd" | "postdoc" | "esi" | "senior" | "hospital"
  >("esi");
  const [institutionType, setInstitutionType] = useState<
    "us_academic" | "foreign_academic" | "non_profit" | "small_biz"
  >("us_academic");
  const [costShareAccepted, setCostShareAccepted] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute eligibility verdict
  const verdict = useMemo(() => {
    const mech = (opportunity?.mechanism || "").toUpperCase();
    const funder = (opportunity?.funder || "").toUpperCase();

    let status: "ELIGIBLE" | "CONDITIONAL" | "INELIGIBLE" = "ELIGIBLE";
    let score = 96;
    const reasons: string[] = [];
    const recommendations: string[] = [];

    // Career stage logic
    if (careerStage === "phd") {
      if (mech.includes("R01") || mech.includes("CAREER")) {
        status = "CONDITIONAL";
        score = 45;
        reasons.push("Doctoral candidates cannot serve as Sole PI on standard R01/CAREER mechanisms.");
        recommendations.push("Apply under NIH F31, NSF GRFP, or include tenured advisor as Contact PI.");
      } else {
        score = 88;
        reasons.push("Doctoral candidates eligible under predoctoral training grants.");
      }
    } else if (careerStage === "postdoc") {
      if (mech.includes("R01")) {
        status = "CONDITIONAL";
        score = 65;
        reasons.push("Postdoctoral fellows typically require institutional waiver or K99/R00 dual mechanism.");
        recommendations.push("Request Departmental PI Status Waiver or target NIH K99/R00 Pathway to Independence.");
      } else {
        score = 92;
        reasons.push("Postdoctoral scholar eligible with faculty endorsement.");
      }
    } else if (careerStage === "esi") {
      score = 98;
      reasons.push("Early-Stage Investigator (ESI) qualification verified (< 10 years post-terminal degree).");
      recommendations.push("NIH Study Section will apply ESI scoring priority (+2 to +5 percentile advantage).");
    } else {
      score = 95;
      reasons.push("Senior PI meets all established tenure/faculty eligibility criteria.");
    }

    // Institution location logic
    if (institutionType === "foreign_academic") {
      if (funder.includes("NSF") || funder.includes("DOE")) {
        if (status === "ELIGIBLE") status = "CONDITIONAL";
        score = Math.min(score, 70);
        reasons.push("Foreign institutions cannot receive direct prime awards from NSF without explicit justification.");
        recommendations.push("Partner as Subawardee/Subcontractor with an eligible U.S. Lead Institution.");
      } else if (funder.includes("NIH")) {
        reasons.push("Foreign institutions are eligible for NIH R01 awards subject to 8% indirect cost cap.");
      }
    }

    // Cost share logic
    if (!costShareAccepted) {
      status = "CONDITIONAL";
      score = Math.min(score, 60);
      reasons.push("Federally negotiated F&A or mandatory institutional cost-share unconfirmed.");
      recommendations.push("Verify institutional indirect rate agreement with Sponsored Research Office (SRO).");
    }

    return { status, score, reasons, recommendations };
  }, [careerStage, institutionType, costShareAccepted, opportunity]);

  if (!isOpen || !opportunity) return null;

  const handleExportJson = () => {
    const payload = {
      grant: opportunity,
      evaluation: {
        careerStage,
        institutionType,
        costShareAccepted,
        verdict,
        evaluatedAt: new Date().toISOString(),
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grant-eligibility-${opportunity.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInject = () => {
    const attestation = `ELIGIBILITY ATTESTATION (${verdict.status} - Score: ${verdict.score}%):\nTarget: ${opportunity.title}\nCareer Stage: ${careerStage.toUpperCase()}\nInstitution: ${institutionType.toUpperCase()}\nKey Note: ${verdict.reasons[0] || "Fully qualified"}`;
    if (onInjectProposal) {
      onInjectProposal(attestation);
    } else {
      localStorage.setItem("cambium_injected_eligibility", attestation);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-surface-raised border border-edge-default rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-edge-default flex items-start justify-between gap-4 bg-surface-base">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-moss-50 border border-moss-200/80 text-moss-800 text-[11px] font-mono font-semibold tracking-wide">
              <ShieldCheck size={13} className="text-moss-700" />
              <span>GRANT ELIGIBILITY CHECKER</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-ink-primary line-clamp-1">
              {opportunity.title}
            </h2>
            <div className="text-xs text-ink-secondary flex items-center gap-2 flex-wrap">
              <span>{opportunity.funder || "Federal Agency"}</span>
              <span>·</span>
              <span>{opportunity.amount || "Ceiling Undisclosed"}</span>
              <span>·</span>
              <span>Deadline: {opportunity.deadline || "Open Window"}</span>
            </div>
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

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* User Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parameter 1: Career Stage */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-primary flex items-center gap-1.5">
                <UserCheck size={14} className="text-moss-700" />
                <span>Primary Investigator Career Stage</span>
              </label>
              <select
                value={careerStage}
                onChange={(e) => setCareerStage(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-edge-default bg-surface-base text-ink-primary focus:border-moss-600 focus:outline-none"
              >
                <option value="phd">PhD Candidate / Graduate Fellow</option>
                <option value="postdoc">Postdoctoral Fellow (&lt; 3 yrs post-PhD)</option>
                <option value="esi">Early-Stage Investigator (ESI) (&lt; 10 yrs post-terminal degree)</option>
                <option value="senior">Senior Faculty / Tenured Professor</option>
                <option value="hospital">Hospital Research Clinician</option>
              </select>
            </div>

            {/* Parameter 2: Institution Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink-primary flex items-center gap-1.5">
                <Building2 size={14} className="text-moss-700" />
                <span>Institutional Affiliation</span>
              </label>
              <select
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-edge-default bg-surface-base text-ink-primary focus:border-moss-600 focus:outline-none"
              >
                <option value="us_academic">U.S. Higher Education (R1/R2 University)</option>
                <option value="foreign_academic">Non-U.S. International Institution</option>
                <option value="non_profit">501(c)(3) Non-Profit Research Institute</option>
                <option value="small_biz">Small Business Concern (SBIR/STTR)</option>
              </select>
            </div>
          </div>

          {/* Parameter 3: Cost Share Confirmation */}
          <label className="flex items-center gap-2.5 p-3 rounded-lg border border-edge-default bg-surface-base cursor-pointer hover:bg-surface-sunken transition-colors">
            <input
              type="checkbox"
              checked={costShareAccepted}
              onChange={(e) => setCostShareAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-edge-strong text-moss-600 focus:ring-moss-600"
            />
            <div className="text-xs text-ink-primary">
              <span className="font-semibold">Institutional F&A Signoff:</span> University Sponsored Research Office agrees to standard federally negotiated indirect cost rates.
            </div>
          </label>

          {/* Verdict Score Card */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-4 ${
              verdict.status === "ELIGIBLE"
                ? "bg-moss-50/50 border-moss-300"
                : verdict.status === "CONDITIONAL"
                ? "bg-amber-light border-amber/30"
                : "bg-rose-50 border-rose-200"
            }`}
          >
            <div className="mt-0.5">
              {verdict.status === "ELIGIBLE" ? (
                <CheckCircle2 size={24} className="text-moss-700" />
              ) : verdict.status === "CONDITIONAL" ? (
                <AlertTriangle size={24} className="text-amber" />
              ) : (
                <X size={24} className="text-rose-600" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    verdict.status === "ELIGIBLE"
                      ? "text-moss-800"
                      : verdict.status === "CONDITIONAL"
                      ? "text-amber"
                      : "text-rose-700"
                  }`}
                >
                  VERDICT: {verdict.status} ({verdict.score}% MATCH)
                </span>
                <span className="text-xs font-mono text-ink-tertiary">
                  Automated Pre-Screen
                </span>
              </div>

              <div className="space-y-1 pt-1">
                {verdict.reasons.map((r, i) => (
                  <p key={i} className="text-xs text-ink-secondary leading-relaxed">
                    • {r}
                  </p>
                ))}
              </div>

              {verdict.recommendations.length > 0 && (
                <div className="pt-2 border-t border-edge-default/40">
                  <span className="text-[11px] font-semibold text-ink-primary">Actionable Advisory:</span>
                  {verdict.recommendations.map((rec, i) => (
                    <p key={i} className="text-xs text-moss-800 font-medium">
                      → {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-edge-default bg-surface-base flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-edge-default bg-surface-raised hover:bg-surface-sunken text-xs font-medium text-ink-primary transition-all shadow-xs"
          >
            <Download size={13} className="text-ink-secondary" />
            <span>Export JSON Audit</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-ink-secondary hover:text-ink-primary transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleInject}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-moss-600 hover:bg-moss-700 text-white text-xs font-semibold transition-all shadow-xs"
            >
              <FileText size={13} />
              <span>{copied ? "Injected into Draft!" : "Inject Attestation"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
