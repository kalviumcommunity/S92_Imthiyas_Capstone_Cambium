"use client";

import React, { useState } from "react";
import {
  X,
  Star,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export interface StructuredPeerReviewSubmission {
  postId: string;
  postTitle: string;
  reviewerName: string;
  reviewerInstitution: string;
  methodologyScore: number;
  statisticalScore: number;
  reproducibilityScore: number;
  noveltyScore: number;
  averageScore: number;
  recommendation: "ACCEPT" | "MINOR_REVISION" | "MAJOR_REVISION" | "REJECT";
  writtenCritique: string;
  noConflictOfInterest: boolean;
  submittedAt: string;
}

interface StructuredReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  authorName: string;
  doi?: string;
  onSubmitReview: (review: StructuredPeerReviewSubmission) => void;
}

export function StructuredReviewModal({
  isOpen,
  onClose,
  postId,
  postTitle,
  authorName,
  doi,
  onSubmitReview,
}: StructuredReviewModalProps) {
  const [methodologyScore, setMethodologyScore] = useState<number>(4);
  const [statisticalScore, setStatisticalScore] = useState<number>(4);
  const [reproducibilityScore, setReproducibilityScore] = useState<number>(4);
  const [noveltyScore, setNoveltyScore] = useState<number>(5);
  const [recommendation, setRecommendation] = useState<"ACCEPT" | "MINOR_REVISION" | "MAJOR_REVISION" | "REJECT">(
    "ACCEPT"
  );
  const [writtenCritique, setWrittenCritique] = useState<string>("");
  const [noConflictOfInterest, setNoConflictOfInterest] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const averageScore = Number(
    ((methodologyScore + statisticalScore + reproducibilityScore + noveltyScore) / 4).toFixed(1)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noConflictOfInterest) {
      setErrorMsg("Please certify that you have no competing financial or personal conflicts of interest.");
      return;
    }
    if (writtenCritique.trim().length < 20) {
      setErrorMsg("Please provide at least a brief paragraph (min 20 characters) summarizing your critique.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const review: StructuredPeerReviewSubmission = {
      postId,
      postTitle,
      reviewerName: "Imthiyas",
      reviewerInstitution: "MIT CSAIL & Broad Institute",
      methodologyScore,
      statisticalScore,
      reproducibilityScore,
      noveltyScore,
      averageScore,
      recommendation,
      writtenCritique,
      noConflictOfInterest,
      submittedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onSubmitReview(review);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const renderStarSelector = (score: number, setScore: (s: number) => void, label: string, rubric: string[]) => (
    <div className="space-y-1.5 p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#151D16] border border-[#E4DCCB] dark:border-[#233327]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#202920] dark:text-[#EDEAE2]">{label}</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setScore(star)}
              className="p-1 rounded hover:scale-110 transition-transform cursor-pointer"
              title={`${star}/5: ${rubric[star - 1]}`}
            >
              <Star
                size={16}
                className={
                  star <= score
                    ? "text-[#EAB308] fill-[#EAB308]"
                    : "text-[#B8B2A7] dark:text-[#4A5E4D]"
                }
              />
            </button>
          ))}
          <span className="font-mono text-xs font-bold text-[#3E6248] dark:text-[#4ADE80] ml-1.5 w-6">
            {score}/5
          </span>
        </div>
      </div>
      <p className="text-[11px] text-[#62685E] dark:text-[#8D9B8F] italic font-serif m-0">
        Level {score}: {rubric[score - 1]}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#202920]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E4DCCB] dark:border-[#233327] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE6D7] dark:bg-[#203324] text-[#3E6248] dark:text-[#4ADE80] text-[10px] font-mono uppercase font-semibold mb-1">
              <ShieldCheck size={12} />
              COPE Compliant Open Peer Review Desk
            </div>
            <h2 className="font-serif text-xl text-[#202920] dark:text-[#FAF7F0] m-0">
              Structured Manuscript Evaluation
            </h2>
            <p className="text-xs text-[#62685E] dark:text-[#8D9B8F] font-sans mt-0.5 line-clamp-1">
              Reviewing: <strong className="text-[#202920] dark:text-[#FAF7F0]">{postTitle}</strong> by {authorName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#62685E] hover:text-[#202920] dark:hover:text-white hover:bg-[#FAF7F0] dark:hover:bg-[#203324] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#B33D35]/10 border border-[#B33D35]/30 text-[#B33D35] text-xs flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 4 COPE Rubrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderStarSelector(
              methodologyScore,
              setMethodologyScore,
              "1. Methodological Soundness",
              [
                "Flawed or unverified methodology",
                "Notable gaps in baseline controls",
                "Standard conventional methodology",
                "Rigorous, controlled experimental design",
                "Exemplary / Novel formal derivation",
              ]
            )}
            {renderStarSelector(
              statisticalScore,
              setStatisticalScore,
              "2. Statistical Rigor & Power",
              [
                "Underpowered, p-hacking risk",
                "Insufficient sample size or confidence intervals",
                "Adequate statistical power",
                "Robust multiple testing corrections",
                "Formal bounds & mathematical proofs",
              ]
            )}
            {renderStarSelector(
              reproducibilityScore,
              setReproducibilityScore,
              "3. Reproducibility & Open Code",
              [
                "No artifacts or code provided",
                "Incomplete repository or missing dependencies",
                "Code runs with manual interventions",
                "Containerized environment / Zenodo archive",
                "1-click fully deterministic reproduction",
              ]
            )}
            {renderStarSelector(
              noveltyScore,
              setNoveltyScore,
              "4. Scientific Impact & Novelty",
              [
                "Redundant or incremental",
                "Minor delta over existing literature",
                "Solid contribution to domain",
                "High disciplinary impact",
                "Paradigm-shifting breakthrough",
              ]
            )}
          </div>

          {/* Average Score Banner */}
          <div className="p-3 rounded-xl bg-[#DCE6D7]/40 dark:bg-[#203324]/50 border border-[#66866A]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[#3E6248] dark:text-[#4ADE80]" />
              <span className="text-xs font-semibold text-[#202920] dark:text-[#FAF7F0]">
                Composite Open Review Score
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#3E6248] dark:text-[#4ADE80]">
              <Star size={16} className="fill-[#3E6248] dark:fill-[#4ADE80]" />
              <span>{averageScore} / 5.0</span>
            </div>
          </div>

          {/* Editorial Recommendation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#202920] dark:text-[#EDEAE2]">
              Overall Editorial Recommendation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: "ACCEPT", label: "Accept as Is", color: "text-[#3E6248] border-[#3E6248]/40" },
                  { id: "MINOR_REVISION", label: "Minor Revisions", color: "text-[#365F8D] border-[#365F8D]/40" },
                  { id: "MAJOR_REVISION", label: "Major Revisions", color: "text-[#8A5A12] border-[#8A5A12]/40" },
                  { id: "REJECT", label: "Reject / Redo", color: "text-[#B33D35] border-[#B33D35]/40" },
                ] as const
              ).map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setRecommendation(rec.id)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-medium transition-all text-center cursor-pointer ${
                    recommendation === rec.id
                      ? "bg-[#3E6248] text-white border-[#3E6248] shadow-sm font-bold"
                      : "bg-[#FAF7F0] dark:bg-[#151D16] text-[#62685E] dark:text-[#8D9B8F] border-[#E4DCCB] dark:border-[#233327]"
                  }`}
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Written Critique */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#202920] dark:text-[#EDEAE2] flex items-center justify-between">
              <span>Detailed Written Critique & Suggestions for Authors</span>
              <span className="font-mono text-[10px] text-[#85877B]">Markdown supported</span>
            </label>
            <textarea
              rows={4}
              value={writtenCritique}
              onChange={(e) => setWrittenCritique(e.target.value)}
              placeholder="Detail the strengths, statistical caveats, missing controls, or verification notes for the authors..."
              className="w-full text-xs font-sans p-3 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#151D16] text-[#202920] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#3E6248] resize-none"
            />
          </div>

          {/* Conflict of Interest Declaration */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#151D16] border border-[#E4DCCB] dark:border-[#233327] cursor-pointer">
            <input
              type="checkbox"
              checked={noConflictOfInterest}
              onChange={(e) => setNoConflictOfInterest(e.target.checked)}
              className="mt-0.5 rounded border-[#E4DCCB] text-[#3E6248] focus:ring-[#3E6248]"
            />
            <span className="text-xs text-[#62685E] dark:text-[#8D9B8F] leading-relaxed">
              I certify that I have <strong>no competing financial, institutional, or personal conflicts of interest</strong> with the authors of this work and endorse this critique under the COPE Open Peer Review guidelines.
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E4DCCB] dark:border-[#233327]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E4DCCB] dark:border-[#233327] text-xs font-mono text-[#62685E] dark:text-[#8D9B8F] hover:bg-[#FAF7F0] dark:hover:bg-[#203324] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#3E6248] hover:bg-[#2d4734] text-white text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              {isSubmitting ? (
                <span>Publishing Review...</span>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>Publish Structured Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StructuredReviewModal;
