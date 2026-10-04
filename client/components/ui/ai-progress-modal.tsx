"use client";

import React, { useState, useEffect } from "react";
import { Cpu, CheckCircle2, Loader2, X, AlertTriangle, ArrowRight, Database, GitBranch, Layers } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface AiProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  artifactName?: string;
}

const STEPS = [
  {
    id: 1,
    label: "Document Ingestion & Semantic Chunking",
    telemetry: "Parsed 42 pages · 128 semantic chunks · SHA-256: 4f9a72e",
    icon: Database,
  },
  {
    id: 2,
    label: "Dense Vector Embedding & Dimensional Projection",
    telemetry: "Embedding 768-dim tensors · Batch throughput: 18.4k tokens/sec · FP16",
    icon: Cpu,
  },
  {
    id: 3,
    label: "Citation Topology & Cross-Reference Grounding",
    telemetry: "Connecting 142 citation nodes · CrossRef DOI resolution verified",
    icon: GitBranch,
  },
  {
    id: 4,
    label: "Literature Synthesis & Confidence Scoring",
    telemetry: "Calibrated empirical bounds · Statistical p-value: < 0.001",
    icon: Layers,
  },
];

export function AiProgressModal({
  isOpen,
  onClose,
  title = "AI Literature Synthesis in Progress",
  artifactName = "Vaswani_Attention_NeurIPS2017.pdf (42 Pages)",
}: AiProgressModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(15);
  const [isDone, setIsDone] = useState(false);
  const [isAborted, setIsAborted] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setProgress(15);
      setIsDone(false);
      setIsAborted(false);
      return;
    }

    const t1 = setTimeout(() => {
      setCurrentStep(2);
      setProgress(45);
    }, 1200);

    const t2 = setTimeout(() => {
      setCurrentStep(3);
      setProgress(75);
    }, 2800);

    const t3 = setTimeout(() => {
      setCurrentStep(4);
      setProgress(95);
    }, 4200);

    const t4 = setTimeout(() => {
      setProgress(100);
      setIsDone(true);
      toast({
        title: "Synthesis Complete",
        description: "Artifact fully indexed with verified deterministic tensor embeddings.",
        variant: "success",
      });
    }, 5400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, toast]);

  if (!isOpen) return null;

  const handleAbort = () => {
    setIsAborted(true);
    toast({
      title: "Pipeline Terminated",
      description: "Computational pipeline aborted safely. Zero memory corruption.",
      variant: "warning",
    });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-[#141A14]/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-150 font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCE6D7] border border-[#E4DCCB] flex items-center justify-center text-[#3E6248] shadow-2xs">
              <Cpu size={20} className={!isDone && !isAborted ? "animate-pulse" : ""} />
            </div>
            <div>
              <span className="font-mono text-[10.5px] font-bold text-[#3E6248] uppercase tracking-wider block">
                DETERMINISTIC COGNITIVE PIPELINE
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#202920] m-0">
                {title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#85877B] hover:text-[#202920] hover:bg-[#F2EBDD] transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Target Artifact Info */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E4DCCB] mb-5 flex items-center justify-between text-xs font-sans">
          <span className="text-[#62685E] truncate">
            Target: <strong className="text-[#202920] font-mono">{artifactName}</strong>
          </span>
          <span className="font-mono text-[11px] font-semibold text-[#3E6248] shrink-0">
            {progress}% COMPLETED
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#E4DCCB] overflow-hidden mb-6">
          <div
            className="h-full bg-[#3E6248] transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps Skeleton */}
        <div className="space-y-3 mb-8">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id || isDone;
            const isCurrent = currentStep === step.id && !isDone;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? "bg-white border-[#3E6248] shadow-xs"
                    : isCompleted
                    ? "bg-[#FAF7F0] border-[#E4DCCB]"
                    : "bg-white/40 border-transparent opacity-40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isCompleted
                          ? "bg-[#DCE6D7] text-[#3E6248]"
                          : isCurrent
                          ? "bg-[#3E6248] text-white"
                          : "bg-[#F2EBDD] text-[#85877B]"
                      }`}
                    >
                      <StepIcon size={13} />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isCurrent ? "text-[#202920] font-semibold" : "text-[#62685E]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-[#3E6248] shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 size={15} className="text-[#3E6248] animate-spin shrink-0" />
                  ) : null}
                </div>

                {/* Deterministic telemetry line */}
                {(isCurrent || isCompleted) && (
                  <div className="mt-1.5 pl-8 text-[10.5px] font-mono text-[#85877B]">
                    {step.telemetry}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Abort / Finish Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E4DCCB]">
          <span className="text-[11px] font-mono text-[#85877B]">
            ACCELERATOR: CUDA-FP16 // AIR-GAP
          </span>

          <div className="flex items-center gap-3">
            {!isDone && !isAborted && (
              <button
                type="button"
                onClick={handleAbort}
                className="px-3.5 py-1.5 rounded-lg border border-[#B33D35]/30 text-[#B33D35] hover:bg-[#FBF1F0] text-xs font-medium transition-colors cursor-pointer bg-transparent"
              >
                Abort Safely
              </button>
            )}

            {isDone && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#3E6248] text-white text-xs font-medium hover:bg-[#293E30] transition-colors cursor-pointer border-0 shadow-xs"
              >
                <span>Inspect Synthesis</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
