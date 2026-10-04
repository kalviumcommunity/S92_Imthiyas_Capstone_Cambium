"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const invoices = [
  { date: "Sep 1, 2026", amount: "$20.00", plan: "Cambium Pro", id: "INV-2026-09", status: "Paid" },
  { date: "Aug 1, 2026", amount: "$20.00", plan: "Cambium Pro", id: "INV-2026-08", status: "Paid" },
  { date: "Jul 1, 2026", amount: "$20.00", plan: "Cambium Pro", id: "INV-2026-07", status: "Paid" },
];

const freeTierFeatures = [
  "100 AI requests / month",
  "Basic literature search & graph",
  "Up to 3 active workspace drafts",
  "Community scholarly support",
  "Standard inference latency",
];

const proTierFeatures = [
  "10,000 AI Intelligence Credits",
  "Multi-paper synthesis & literature matrix",
  "Unlimited workspace drafts & projects",
  "Priority peer review pipeline",
  "High-performance GPU compute clusters",
  "Institutional API access & BibTeX sync",
  "Custom export to LaTeX & Nature formats",
];

export default function BillingPage() {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(84.5), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">

        {/* Page Header (Cambium Living Materials Design System) */}
        <div className="mb-8 pb-6 border-b border-[#E4DCCB]">
          <div className="flex items-center gap-2 mb-2 font-mono text-[11px] font-bold tracking-wider uppercase text-[#3E6248]">
            <span className="w-2 h-2 rounded-full bg-[#66866A] animate-pulse" />
            <span>Compute Quota & Subscription Ledger</span>
          </div>
          <h1 className="font-serif text-[32px] sm:text-[38px] font-normal tracking-[-0.02em] text-[#202920] leading-tight m-0">
            Billing & <span className="italic text-[#3E6248]">Compute Matrix</span>
          </h1>
          <p className="text-sm text-[#62685E] mt-2 font-sans max-w-xl leading-relaxed">
            Manage your Cambium Research operating tier, inspect neural compute token allocations, and download verified institutional receipts.
          </p>
        </div>

        {/* Section 1: Plan + AI Usage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Current Plan Card */}
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#85877B] uppercase tracking-wider">
                    Current Operating Tier
                  </span>
                  <h2 className="text-2xl font-serif font-normal text-[#202920] mt-1 m-0">
                    Cambium Pro
                  </h2>
                </div>
                <span className="text-xs font-mono font-semibold bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/30 py-1 px-3 rounded-full">
                  Active Tier
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-serif font-normal text-[#202920] leading-none">$20</span>
                <span className="text-sm text-[#62685E] font-sans">/ month (billed annually)</span>
              </div>

              <div className="border-t border-[#E4DCCB] pt-4 flex flex-col gap-2.5 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E]">Billing frequency</span>
                  <span className="font-semibold text-[#202920] font-mono">Monthly Institutional</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E]">Next billing cycle</span>
                  <span className="font-semibold text-[#202920] font-mono">Nov 1, 2026</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E]">Assigned account</span>
                  <span className="font-semibold text-[#3E6248] font-mono">imthiyas@cambium.edu</span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full text-xs font-mono font-semibold uppercase tracking-wider text-[#202920] bg-white border border-[#E4DCCB] hover:bg-[#F2EBDD] py-2.5 rounded-xl transition-colors cursor-pointer">
              Manage Subscription Plan
            </button>
          </div>

          {/* AI Compute Credits Card */}
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-1">
                <span className="font-mono text-[10px] font-bold text-[#85877B] uppercase tracking-wider">
                  Neural Intelligence Quota
                </span>
                <span className="text-xs font-mono font-bold text-[#3E6248] bg-[#DCE6D7] px-2 py-0.5 rounded">
                  84.5% Used
                </span>
              </div>

              <h2 className="text-2xl font-serif font-normal text-[#202920] mb-5 m-0">
                Cambium AI Compute
              </h2>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="h-2.5 bg-[#F2EBDD] rounded-full overflow-hidden border border-[#E4DCCB]">
                  <div
                    className="h-full bg-[#3E6248] rounded-full"
                    style={{
                      width: `${barWidth}%`,
                      transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-[#62685E] mb-5 font-mono">
                <span className="font-bold text-[#202920]">8,450</span> / 10,000 intelligence tokens expended
              </p>

              <div className="border-t border-[#E4DCCB] pt-4 flex flex-col gap-2.5 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E]">Remaining allocation</span>
                  <span className="font-semibold text-[#202920] font-mono">1,550 tokens</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E]">Monthly token reset</span>
                  <span className="font-semibold text-[#202920] font-mono">Nov 1, 2026</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E]">Average daily burn rate</span>
                  <span className="font-semibold text-[#202920] font-mono">281 tokens / day</span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full text-xs font-mono font-semibold uppercase tracking-wider text-white bg-[#3E6248] hover:bg-[#202920] py-2.5 rounded-xl transition-colors cursor-pointer border border-[#3E6248]">
              Purchase Add-on Compute Pack
            </button>
          </div>
        </div>

        {/* Section 2: Subscription Tiers */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-2xl font-normal text-[#202920] m-0">
              Subscription Tiers
            </h3>
            <span className="text-xs font-mono text-[#85877B]">Annual or Monthly invoicing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Researcher */}
            <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="mb-4">
                  <span className="font-mono text-[10px] font-bold text-[#85877B] uppercase tracking-wider">
                    Free Researcher
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-serif font-normal text-[#202920] leading-none">$0</span>
                    <span className="text-xs text-[#62685E]">/ month</span>
                  </div>
                  <p className="text-xs text-[#62685E] mt-1.5 leading-relaxed">
                    Essential literature discovery and basic workspace notes for individual investigators.
                  </p>
                </div>

                <div className="border-t border-[#E4DCCB] pt-4 mb-6">
                  <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
                    {freeTierFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <span className="shrink-0 text-[#85877B]">
                          <CheckIcon />
                        </span>
                        <span className="text-xs text-[#62685E]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                disabled
                className="w-full text-xs font-mono font-semibold uppercase tracking-wider bg-[#F2EBDD] border border-[#E4DCCB] text-[#85877B] py-2.5 rounded-xl cursor-not-allowed opacity-75"
              >
                Current Baseline
              </button>
            </div>

            {/* Pro Tier (Recommended) */}
            <div className="bg-[#FAF7F0] border-2 border-[#3E6248] rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between shadow-md">
              {/* Badge */}
              <div className="absolute -top-3 right-6 bg-[#3E6248] text-white text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-xs">
                Active Tier · Recommended
              </div>

              <div>
                <div className="mb-4">
                  <span className="font-mono text-[10px] font-bold text-[#3E6248] uppercase tracking-wider">
                    Cambium Pro Researcher
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-serif font-normal text-[#202920] leading-none">$20</span>
                    <span className="text-xs text-[#62685E]">/ month</span>
                  </div>
                  <p className="text-xs text-[#62685E] mt-1.5 leading-relaxed">
                    Full AI intelligence engine, synthesis matrix, and priority high-performance compute.
                  </p>
                </div>

                <div className="border-t border-[#E4DCCB] pt-4 mb-6">
                  <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
                    {proTierFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <span className="shrink-0 text-[#3E6248]">
                          <CheckIcon />
                        </span>
                        <span className="text-xs font-medium text-[#202920]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                className="w-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#3E6248] hover:bg-[#202920] py-2.5 rounded-xl transition-colors cursor-pointer border border-[#3E6248] shadow-2xs"
              >
                Renewed on Pro Tier
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Invoices History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-2xl font-normal text-[#202920] m-0">
              Billing Ledger & Receipts
            </h3>
            <span className="text-xs font-mono text-[#3E6248] font-semibold cursor-pointer hover:underline">
              Export All Receipts (ZIP)
            </span>
          </div>

          <div className="bg-white border border-[#E4DCCB] rounded-2xl overflow-hidden shadow-2xs">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_120px_1fr_100px_90px] px-6 py-3.5 bg-[#FAF7F0] border-b border-[#E4DCCB]">
              {["Date", "Amount", "Plan Type", "Status", ""].map((col, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-mono font-bold text-[#85877B] uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"}`}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            {invoices.map((inv, idx) => (
              <div
                key={inv.id}
                className={`grid grid-cols-[1fr_120px_1fr_100px_90px] px-6 py-4 items-center transition-colors hover:bg-[#FAF7F0]/60 ${idx < invoices.length - 1 ? "border-b border-[#E4DCCB]" : ""}`}
              >
                <span className="text-xs font-medium text-[#202920]">{inv.date}</span>
                <span className="text-xs font-mono font-semibold text-[#202920]">{inv.amount}</span>
                <span className="text-xs text-[#62685E] font-sans">{inv.plan}</span>
                <span className="inline-flex">
                  <span className="text-[10px] font-mono font-semibold bg-[#DCE6D7] text-[#3E6248] px-2 py-0.5 rounded-full border border-[#66866A]/20">
                    {inv.status}
                  </span>
                </span>
                <div className="flex justify-end">
                  <button className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#62685E] bg-white border border-[#E4DCCB] rounded-lg px-2.5 py-1 cursor-pointer transition-colors hover:border-[#3E6248] hover:bg-[#DCE6D7] hover:text-[#3E6248]">
                    <DownloadIcon />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
