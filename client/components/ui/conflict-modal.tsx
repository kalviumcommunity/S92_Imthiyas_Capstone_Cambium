"use client";

import React, { useState } from "react";
import { AlertTriangle, GitMerge, Laptop, Cloud, ArrowRight, Check, X, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (strategy: "local" | "remote" | "merge") => void;
  artifactTitle?: string;
}

export function ConflictModal({
  isOpen,
  onClose,
  onResolve,
  artifactTitle = "Literature Review: Transformer Architectures in Clinical AI",
}: ConflictModalProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<"merge" | "local" | "remote">("merge");
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleApply = () => {
    onResolve(selectedStrategy);
    onClose();
    toast({
      title: "Conflict Resolved",
      description:
        selectedStrategy === "merge"
          ? "Successfully merged local edits with cloud branch."
          : selectedStrategy === "local"
          ? "Local draft promoted to authoritative cloud snapshot."
          : "Remote cloud changes pulled and synced locally.",
      variant: "success",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141A14]/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E4DCCB] bg-[#F2EBDD]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FBF5E8] border border-[#E2C898] text-[#7E5812] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E5812] font-semibold bg-[#FBF5E8] px-2 py-0.5 rounded border border-[#E2C898]">
                  State Divergence
                </span>
                <span className="text-[12px] text-[#62685E] font-mono">Snapshot #8492</span>
              </div>
              <h2 className="font-serif text-[19px] font-semibold text-[#202920] m-0 mt-0.5">
                Version Synchronization Conflict
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#E4DCCB] bg-white text-[#62685E] hover:text-[#202920] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[13px] text-[#62685E] mb-5 m-0 leading-relaxed">
            While working offline, collaborator <strong className="text-[#202920]">Dr. Marcus Chen</strong> published updates to <strong className="text-[#202920]">&ldquo;{artifactTitle}&rdquo;</strong> on the cloud cluster. Select how you wish to reconcile these changes.
          </p>

          {/* Diff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Local Copy */}
            <div
              onClick={() => setSelectedStrategy("local")}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedStrategy === "local"
                  ? "bg-white border-[#3E6248] ring-2 ring-[#3E6248]/20 shadow-sm"
                  : "bg-white/60 border-[#E4DCCB] hover:border-[#85877B]"
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#3E6248]" />
                  <span className="text-[12.5px] font-semibold text-[#202920]">Your Local Draft</span>
                </div>
                <span className="text-[11px] font-mono text-[#85877B]">2m ago · Offline</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#E4DCCB] font-mono text-[11.5px] text-[#202920] space-y-1">
                <div className="text-[#62685E]">// Methodological Hypothesis Formulation</div>
                <div className="text-[#3E6248] bg-[#DCE6D7]/60 px-1 rounded">
                  + &quot;We hypothesize self-attention mechanisms outperform LSTMs in sparse medical EHR logs by 18.4%.&quot;
                </div>
                <div className="text-[#85877B] text-[10.5px]">Author: You (Local Device)</div>
              </div>
            </div>

            {/* Remote Cloud Copy */}
            <div
              onClick={() => setSelectedStrategy("remote")}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedStrategy === "remote"
                  ? "bg-white border-[#3E6248] ring-2 ring-[#3E6248]/20 shadow-sm"
                  : "bg-white/60 border-[#E4DCCB] hover:border-[#85877B]"
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-[#365F8D]" />
                  <span className="text-[12.5px] font-semibold text-[#202920]">Remote Cloud Cluster</span>
                </div>
                <span className="text-[11px] font-mono text-[#85877B]">4m ago · Synced</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#E4DCCB] font-mono text-[11.5px] text-[#202920] space-y-1">
                <div className="text-[#62685E]">// Methodological Hypothesis Formulation</div>
                <div className="text-[#365F8D] bg-[#DCE6D7]/30 px-1 rounded">
                  + &quot;Attention mechanisms offer O(1) sequential dependency reduction across multi-modal ICU telemetry.&quot;
                </div>
                <div className="text-[#85877B] text-[10.5px]">Author: Dr. Marcus Chen (Lab Node)</div>
              </div>
            </div>
          </div>

          {/* Merge Option (Recommended) */}
          <div
            onClick={() => setSelectedStrategy("merge")}
            className={`p-4 rounded-xl border transition-all cursor-pointer mb-6 ${
              selectedStrategy === "merge"
                ? "bg-[#FAF7F0] border-[#3E6248] ring-2 ring-[#3E6248]/20 shadow-sm"
                : "bg-white/60 border-[#E4DCCB] hover:border-[#85877B]"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-[#3E6248]" />
                <span className="text-[13px] font-semibold text-[#202920]">
                  Three-Way Intelligent Merge (Recommended)
                </span>
                <span className="px-2 py-0.5 bg-[#DCE6D7] text-[#3E6248] font-mono text-[10.5px] rounded-full font-medium">
                  Zero Data Loss
                </span>
              </div>
              <div className="w-4 h-4 rounded-full border border-[#3E6248] flex items-center justify-center">
                {selectedStrategy === "merge" && <div className="w-2.5 h-2.5 rounded-full bg-[#3E6248]" />}
              </div>
            </div>
            <p className="text-[12px] text-[#62685E] m-0 pl-6">
              Synthesizes both formulations into separate verified subsections and generates a persistent audit trail milestone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E4DCCB]">
            <div className="flex items-center gap-2 text-[12px] text-[#85877B]">
              <ShieldAlert className="w-4 h-4 text-[#7E5812]" />
              <span>Rollback will always remain available via Settings &gt; Audit Logs.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#E4DCCB] bg-white text-[13px] text-[#62685E] hover:text-[#202920] font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3E6248] hover:bg-[#293E30] text-white text-[13px] font-medium transition-colors shadow-sm cursor-pointer"
              >
                <span>Apply Reconciled State</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
