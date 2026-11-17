"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { CambiumMark } from "@/components/CambiumLogo";

export interface WorkspaceProvisioningModalProps {
  isOpen: boolean;
  onComplete?: () => void;
  destinationUrl?: string;
  userName?: string;
}

const REAL_STEPS = [
  { id: 1, label: "Calibrating research vectors & focus areas" },
  { id: 2, label: "Configuring personalized discovery feed" },
  { id: 3, label: "Workspace calibrated and ready" },
];

export function WorkspaceProvisioningModal(props: WorkspaceProvisioningModalProps) {
  return props.isOpen ? <WorkspaceProvisioningContent {...props} /> : null;
}

function WorkspaceProvisioningContent({
  onComplete,
  destinationUrl = "/dashboard",
  userName = "Scholar",
}: Omit<WorkspaceProvisioningModalProps, "isOpen">) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [percent, setPercent] = useState(20);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setCurrentStep(2);
      setPercent(65);
    }, 600);

    const t2 = setTimeout(() => {
      setCurrentStep(3);
      setPercent(100);
    }, 1250);

    const t3 = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        router.push(destinationUrl);
      }
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, destinationUrl, router]);

  const cleanName = userName && userName !== "Scholar" ? userName : "your account";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202920]/65 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] rounded-3xl shadow-2xl p-7 sm:p-8 font-sans text-[#202920] dark:text-[#EDEAE2] animate-in zoom-in-[0.98] duration-200 space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#DCE6D7] dark:bg-[#1F2E23] border border-[#66866A]/30 dark:border-[#4ADE80]/30 flex items-center justify-center shadow-xs">
            <CambiumMark size={28} />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
              Setting up your workspace
            </h2>
            <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1 m-0 leading-relaxed font-sans">
              Personalizing research tools and discovery feed for {cleanName}.
            </p>
          </div>
        </div>

        {/* Clean Linear Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-1.5 rounded-full bg-[#E4DCCB] dark:bg-[#233327] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3E6248] to-[#66866A] dark:from-[#4ADE80] dark:to-[#22C55E] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10.5px] font-mono text-[#85877B] dark:text-[#7E8B7B]">
            <span>Preparing environment</span>
            <span>{percent}%</span>
          </div>
        </div>

        {/* Real Milestones Checklist */}
        <div className="space-y-2.5 pt-1">
          {REAL_STEPS.map((step) => {
            const isCompleted = currentStep > step.id || percent === 100;
            const isCurrent = currentStep === step.id && percent < 100;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-sans ${
                  isCurrent
                    ? "bg-white dark:bg-[#18231B] border-[#3E6248]/40 dark:border-[#4ADE80]/40 text-[#202920] dark:text-[#EDEAE2] shadow-2xs"
                    : isCompleted
                    ? "bg-[#DCE6D7]/30 dark:bg-[#1F2E23]/30 border-transparent text-[#62685E] dark:text-[#A3B899]"
                    : "border-transparent text-[#85877B]/70 dark:text-[#7E8B7B]/70"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F]"
                        : isCurrent
                        ? "border-2 border-[#3E6248] dark:border-[#4ADE80] bg-transparent"
                        : "border border-[#E4DCCB] dark:border-[#233327]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={11} strokeWidth={3} />
                    ) : isCurrent ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] animate-pulse" />
                    ) : null}
                  </div>
                  <span className={`text-[12px] ${isCurrent ? "font-semibold" : ""}`}>
                    {step.label}
                  </span>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-mono text-[#3E6248] dark:text-[#4ADE80] font-bold uppercase tracking-wider animate-pulse">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
