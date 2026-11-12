"use client";

import React, { useState } from "react";
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";
import {
  useSubscriptionStore,
  type SubscriptionTier,
} from "@/lib/store/useSubscriptionStore";
import { PaymentCheckoutModal } from "@/components/billing/PaymentCheckoutModal";

interface FeatureGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle: string;
  featureDescription?: string;
  requiredTier?: "pro" | "team" | "enterprise";
}

export function FeatureGateModal({
  isOpen,
  onClose,
  featureTitle,
  featureDescription,
  requiredTier = "pro",
}: FeatureGateModalProps) {
  const { currentPlan, currency } = useSubscriptionStore();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const isTeam = requiredTier === "team";
  const planName = isTeam ? "Lab Team Workspace" : "Cambium Scholar Pro";
  const priceDisplay = isTeam
    ? currency === "USD"
      ? "$49 / month"
      : "₹3,999 / month"
    : currency === "USD"
    ? "$1 / month"
    : "₹89 / month";

  const benefits = isTeam
    ? [
        "Collaborative shared lab workspace for up to 15 researchers",
        "Multi-user grant pipeline with calendar deadline sync (ICS)",
        "CRediT contributor authorship matrix & consensus locking",
        "Shared high-throughput GPU vector compute pool",
        "Multi-site IRB compliance renewal alerts",
      ]
    : [
        "Unlimited workspace paper drafts & research notebooks",
        "10,000 monthly AI Assistant token allowance",
        "Deep multi-paper literature synthesis & matrix extraction",
        "Line-grounded methodology citations [p. X, L. Y] in source PDFs",
        "One-click export to LaTeX, BibTeX, Nature, and CSD formats",
      ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-[#E4DCCB] dark:border-[#233327] flex items-start justify-between bg-white/60 dark:bg-[#18231B]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DCE6D7] dark:bg-[#1A281E] border border-[#66866A]/30 text-[#3E6248] dark:text-[#4ADE80] flex items-center justify-center shrink-0">
                {isTeam ? <Users size={20} /> : <Zap size={20} />}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#3E6248] dark:text-[#4ADE80]">
                  {planName} Feature Gate
                </span>
                <h3 className="font-serif text-xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0 leading-tight">
                  {featureTitle}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-xl text-[#85877B] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23] transition-colors border-0 bg-transparent cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* 75% Free Notice Banner */}
            <div className="p-3 rounded-2xl bg-[#DCE6D7]/60 dark:bg-[#1A281E]/60 border border-[#66866A]/20 dark:border-[#4ADE80]/20 flex items-center gap-2.5 text-xs">
              <Sparkles size={16} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
              <div className="text-[#202920] dark:text-[#EDEAE2] leading-tight">
                <strong>75% of Cambium is completely free forever.</strong> Standard literature search, 2D knowledge graphs, and public preprint discovery require no subscription.
              </div>
            </div>

            <p className="text-xs text-[#62685E] dark:text-[#A3B899] leading-relaxed">
              {featureDescription ||
                `To unlock ${featureTitle} and high-throughput scholarly compute, upgrade your account to ${planName}. Calibrated to bypass university grant procurement friction.`}
            </p>

            {/* Plan Perks */}
            <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-4.5 space-y-2.5">
              <div className="flex items-baseline justify-between border-b border-[#E4DCCB]/60 dark:border-[#233327]/60 pb-2 mb-2">
                <span className="font-serif text-base font-semibold text-[#202920] dark:text-[#EDEAE2]">
                  {planName}
                </span>
                <span className="text-sm font-mono font-bold text-[#3E6248] dark:text-[#4ADE80]">
                  {priceDisplay}
                </span>
              </div>

              <ul className="space-y-2 m-0 p-0 list-none">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-[#62685E] dark:text-[#A3B899]">
                    <Check size={14} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Micro reassurance */}
            <div className="flex items-center gap-2 text-[11px] text-[#85877B] dark:text-[#7E8B7B]">
              <ShieldCheck size={13} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
              <span>Zero contract lock-in. Cancel anytime with 1-click. Instant activation.</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 pt-3 border-t border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between bg-white/40 dark:bg-[#18231B]/40">
            <button
              onClick={onClose}
              className="text-xs font-mono text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent border-0 cursor-pointer"
            >
              Continue on Free Plan
            </button>

            <button
              onClick={() => setShowCheckout(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] hover:bg-[#202920] dark:hover:bg-[#22C55E] transition-all cursor-pointer shadow-md"
            >
              <span>Upgrade Now ({priceDisplay.split(" ")[0]})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Checkout */}
      {showCheckout && (
        <PaymentCheckoutModal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            onClose();
          }}
          targetPlan={requiredTier}
          onSuccess={() => {
            setShowCheckout(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
