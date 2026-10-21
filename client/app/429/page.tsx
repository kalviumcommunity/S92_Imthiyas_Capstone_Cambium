"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CambiumLogo from "@/components/CambiumLogo";
import {
  Clock,
  Zap,
  ArrowLeft,
  Cpu,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function RateLimitedPage() {
  const [secondsRemaining, setSecondsRemaining] = useState(874); // 14 mins 34 secs
  const [burstRequested, setBurstRequested] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#202920] font-sans flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      {/* Background Subtle Noise & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E4DCCB_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between border-b border-[#E4DCCB] pb-6">
        <CambiumLogo size="md" badge="Compute Governor" href="/" />

        <Link
          href="/dashboard"
          className="text-xs font-mono text-[#62685E] hover:text-[#202920] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={13} />
          Return to Dashboard
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-2xl mx-auto w-full my-auto py-12 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/30 text-[#92400E]">
            <Clock size={13} />
            <span className="font-mono text-xs uppercase tracking-widest font-semibold">
              HTTP 429 // Quota Exhaustion
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#202920] tracking-tight leading-tight m-0">
            Hourly Reasoning Quota Depleted
          </h1>

          <p className="font-serif text-base sm:text-lg text-[#62685E] leading-relaxed">
            Your laboratory account has exhausted its hourly inference allowance for frontier reasoning models (120,000 reasoning tokens/hour).
          </p>
        </div>

        {/* Live Cooldown Countdown Card */}
        <div className="p-8 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#62685E] font-semibold">
              Replenishment Window
            </div>
            <div className="font-mono text-4xl font-bold text-[#3E6248] mt-1 tracking-wider">
              {formatTime(secondsRemaining)}
            </div>
            <div className="text-xs text-[#62685E] mt-1">
              Automatic window reset at the turn of the hour.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] shrink-0 text-center">
            <div className="text-[10px] font-mono uppercase text-[#62685E]">
              Current Tier
            </div>
            <div className="font-serif text-base font-semibold text-[#202920] mt-0.5">
              University Pro
            </div>
            <div className="text-[10px] font-mono text-[#3E6248] mt-0.5">
              120k Tokens / hr
            </div>
          </div>
        </div>

        {/* Resource Consumption Diagnostics */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#62685E] font-semibold">
            Inference Consumption Breakdown (Past 60 mins)
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono text-[#202920] mb-1">
                <span>Frontier Deductive Synthesis (Claude 3.7 / RAG)</span>
                <span className="text-[#991B1B] font-bold">120,000 / 120,000 (100%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] overflow-hidden">
                <div className="h-full bg-[#991B1B] rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-[#202920] mb-1">
                <span>Semantic Embeddings (text-embedding-3-large)</span>
                <span className="text-[#3E6248]">84,100 / 500,000 (16.8%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] overflow-hidden">
                <div className="h-full bg-[#3E6248] rounded-full" style={{ width: "16.8%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Action: Burst via Grant Allocation or Lab Cluster */}
        {!burstRequested ? (
          <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#D97706]" />
              <h2 className="font-serif text-base font-semibold text-[#202920] m-0">
                Grant-Funded Compute Burst
              </h2>
            </div>
            <p className="text-xs text-[#62685E]">
              If you have urgent grant deadlines or peer-review filings, you can route overage queries directly through your lab's NSF/NIH grant compute allocation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => setBurstRequested(true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#3E6248] hover:bg-[#173F35] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Cpu size={13} />
                Activate Lab Grant Burst (NIH R01)
              </button>

              <Link
                href="/graph"
                className="py-2.5 px-4 rounded-xl bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-[#202920] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 text-center"
              >
                Explore Cached Topography
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#DCE6D7] border border-[#66866A]/40 text-[#173F35] space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={16} className="text-[#3E6248]" />
              Grant Burst Active (+500,000 Tokens)
            </div>
            <p className="text-xs font-serif leading-relaxed">
              Quota has been temporarily drawn from NIH Grant R01-EB034912 compute reserves. You can resume synthesis in the Agentic Reader.
            </p>
            <div className="pt-2">
              <Link
                href="/agent-reader"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3E6248] text-white text-xs font-mono font-medium hover:bg-[#173F35]"
              >
                Back to Agentic Reader <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full pt-6 border-t border-[#E4DCCB] text-center text-xs font-mono text-[#62685E]">
        Cambium Adaptive Token Governor · Algorithmic Fair Queuing (AFQ) Protocol
      </footer>
    </div>
  );
}
