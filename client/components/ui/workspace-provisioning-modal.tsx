"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Database, HardDrive, Cpu, Sparkles } from "lucide-react";

export interface WorkspaceProvisioningModalProps {
  isOpen: boolean;
  onComplete?: () => void;
  destinationUrl?: string;
  userName?: string;
}

const PROVISIONING_STEPS = [
  { id: 1, label: "Structuring relational schemas & lab entities", icon: Database },
  { id: 2, label: "Compiling personal dense vector partition", icon: Cpu },
  { id: 3, label: "Mounting CrossRef & arXiv citation indices", icon: HardDrive },
  { id: 4, label: "Establishing air-gap encryption ledger", icon: ShieldCheck },
  { id: 5, label: "Dedicated workspace provisioned", icon: CheckCircle2 },
];

export function WorkspaceProvisioningModal({
  isOpen,
  onComplete,
  destinationUrl = "/dashboard",
  userName = "Scholar",
}: WorkspaceProvisioningModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [percent, setPercent] = useState(12);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setPercent(12);
      return;
    }

    const t1 = setTimeout(() => {
      setCurrentStep(2);
      setPercent(38);
    }, 450);

    const t2 = setTimeout(() => {
      setCurrentStep(3);
      setPercent(68);
    }, 950);

    const t3 = setTimeout(() => {
      setCurrentStep(4);
      setPercent(88);
    }, 1450);

    const t4 = setTimeout(() => {
      setCurrentStep(5);
      setPercent(100);
    }, 1900);

    const t5 = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        router.push(destinationUrl);
      }
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen, onComplete, destinationUrl, router]);

  if (!isOpen) return null;

  // Ring circumference for r = 42: 2 * Math.PI * 42 = 263.89
  const circumference = 263.89;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141A14]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden font-sans text-[#202920]">
        {/* Header */}
        <div className="p-6 text-center border-b border-[#E4DCCB]/60 bg-[#F2EBDD]/40">
          <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#E4DCCB"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#3E6248"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono font-bold text-[18px] text-[#202920] leading-none">
                {percent}%
              </span>
              <span className="text-[9px] font-mono text-[#85877B] tracking-wider uppercase mt-0.5">
                ALLOCATING
              </span>
            </div>
          </div>

          <h2 className="font-serif text-[20px] font-semibold text-[#202920] tracking-tight m-0">
            Provisioning Research Workspace
          </h2>
          <p className="text-[12.5px] text-[#62685E] mt-1 m-0">
            Mounting schema partitions and indexing initial citation graph for {userName}.
          </p>
        </div>

        {/* Steps List */}
        <div className="p-6 space-y-3">
          {PROVISIONING_STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? "bg-white border-[#3E6248] shadow-xs"
                    : isCompleted
                    ? "bg-[#FAF7F0] border-[#E4DCCB]"
                    : "bg-white/40 border-transparent opacity-40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isCompleted
                        ? "bg-[#DCE6D7] text-[#3E6248]"
                        : isCurrent
                        ? "bg-[#3E6248] text-white"
                        : "bg-[#F2EBDD] text-[#85877B]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[12.5px] font-medium ${isCurrent ? "text-[#202920] font-semibold" : "text-[#62685E]"}`}>
                    {step.label}
                  </span>
                </div>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#3E6248] shrink-0" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[#3E6248] animate-ping shrink-0 mr-1" />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Footer Hardware Metrics */}
        <div className="px-6 py-3 border-t border-[#E4DCCB]/60 bg-[#FAF7F0] flex items-center justify-between text-[11px] font-mono text-[#85877B]">
          <span>STATUS: SECURE</span>
          <span className="text-[#3E6248]">NODE // US-EAST-RESEARCH</span>
        </div>
      </div>
    </div>
  );
}
