"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Check, Download, Zap, ShieldCheck } from "lucide-react";

type Currency = "USD" | "INR";

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

const freeTierFeatures = [
  "100 AI inference queries / month",
  "Basic literature search & citation graph",
  "Up to 3 active workspace drafts",
  "Community scholarly discussions",
  "Standard inference latency queue",
];

const proTierFeatures = [
  "10,000 Neural AI Reasoning Tokens / month",
  "Multi-paper synthesis & literature matrix",
  "Unlimited workspace drafts & notebook projects",
  "Split-screen Agentic PDF Reader & RAG search",
  "Priority peer review pipeline access",
  "High-performance GPU compute cluster allocation",
  "One-click export to LaTeX, BibTeX & Nature formats",
];

export default function BillingPage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(84.5), 100);
    return () => clearTimeout(t);
  }, []);

  const priceAmount = currency === "USD" 
    ? (billingPeriod === "monthly" ? "$1.00" : "$10.00")
    : (billingPeriod === "monthly" ? "₹89.00" : "₹899.00");

  const priceDisplay = currency === "USD"
    ? (billingPeriod === "monthly" ? "$1" : "$10")
    : (billingPeriod === "monthly" ? "₹89" : "₹899");

  const pricePeriodLabel = billingPeriod === "monthly" ? "/ month" : "/ year (Save ~16%)";

  const invoices = [
    {
      date: "Sep 1, 2026",
      amount: currency === "USD" ? "$1.00" : "₹89.00",
      plan: "Scholar Pro (Starting Stage)",
      id: "INV-2026-09",
      status: "Paid",
    },
    {
      date: "Aug 1, 2026",
      amount: currency === "USD" ? "$1.00" : "₹89.00",
      plan: "Scholar Pro (Starting Stage)",
      id: "INV-2026-08",
      status: "Paid",
    },
    {
      date: "Jul 1, 2026",
      amount: currency === "USD" ? "$1.00" : "₹89.00",
      plan: "Scholar Pro (Starting Stage)",
      id: "INV-2026-07",
      status: "Paid",
    },
  ];

  const handleDownloadInvoice = (inv: (typeof invoices)[0]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt — ${inv.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF7F0; color: #202920; padding: 48px; }
            .card { max-width: 580px; margin: 0 auto; background: white; border: 1px solid #E4DCCB; border-radius: 16px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E4DCCB; padding-bottom: 20px; margin-bottom: 20px; }
            .brand { font-size: 22px; font-weight: 700; color: #3E6248; font-family: Georgia, serif; }
            .mono { font-family: monospace; font-size: 12px; color: #62685E; }
            .row { display: flex; justify-content: space-between; margin: 12px 0; font-size: 14px; }
            .total { border-top: 1px solid #E4DCCB; padding-top: 16px; margin-top: 24px; font-size: 18px; font-weight: bold; }
            .status { display: inline-block; background: #DCE6D7; color: #3E6248; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="brand">CAMBIUM RESEARCH</div>
              <div class="status">${inv.status.toUpperCase()}</div>
            </div>
            <div class="mono">Invoice Ref: ${inv.id}</div>
            <div class="mono">Billing Date: ${inv.date}</div>
            <div style="height: 20px;"></div>
            <div class="row"><span>Subscription Plan:</span><strong>${inv.plan}</strong></div>
            <div class="row"><span>Billed To:</span><span>Primary Scholar Account</span></div>
            <div class="row"><span>Tax (0% Subsidized Scholar Rate):</span><span>${currency === "USD" ? "$0.00" : "₹0.00"}</span></div>
            <div class="row total"><span>Total Charged:</span><span>${inv.amount}</span></div>
            <div style="margin-top: 36px; font-size: 11px; color: #85877B; text-align: center; font-family: monospace;">
              CAMBIUM CORE RESEARCH OS · ELECTRONIC PAYMENT RECEIPT
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] font-sans overflow-y-auto transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">

        {/* Page Header (Living Materials & Bioluminescent Botanical) */}
        <div className="mb-8 pb-6 border-b border-[#E4DCCB] dark:border-[#233327] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] font-bold tracking-wider uppercase text-[#3E6248] dark:text-[#4ADE80]">
              <span className="w-2 h-2 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] animate-pulse" />
              <span>Compute Quota & Accessible Scholar Ledger</span>
            </div>
            <h1 className="font-serif text-[32px] sm:text-[38px] font-normal tracking-[-0.02em] text-[#202920] dark:text-[#EDEAE2] leading-tight m-0">
              Billing & <span className="italic text-[#3E6248] dark:text-[#4ADE80]">Compute Matrix</span>
            </h1>
            <p className="text-sm text-[#62685E] dark:text-[#A3B899] mt-2 font-sans max-w-xl leading-relaxed">
              Democratizing frontier AI discovery. Starting stage entry pricing calibrated to pass student card & UPI micro-transaction thresholds without grant procurement friction.
            </p>
          </div>

          {/* Currency & Billing Frequency Controller */}
          <div className="flex items-center gap-2.5 self-start md:self-auto bg-white dark:bg-[#18231B] p-1.5 rounded-2xl border border-[#E4DCCB] dark:border-[#233327] shadow-2xs">
            {/* Currency selector */}
            <div className="flex items-center bg-[#FAF7F0] dark:bg-[#131C15] p-0.5 rounded-xl border border-[#E4DCCB] dark:border-[#233327]">
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  currency === "INR"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                INR (₹)
              </button>
            </div>

            {/* Billing period switcher */}
            <div className="flex items-center bg-[#FAF7F0] dark:bg-[#131C15] p-0.5 rounded-xl border border-[#E4DCCB] dark:border-[#233327]">
              <button
                type="button"
                onClick={() => setBillingPeriod("monthly")}
                className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                  billingPeriod === "monthly"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod("annual")}
                className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                  billingPeriod === "annual"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                Annual (-16%)
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Plan + AI Usage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Current Plan Card (Lowest Market Price Starting Stage) */}
          <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
                    Current Operating Tier
                  </span>
                  <h2 className="text-2xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] mt-1 m-0">
                    Cambium Scholar Pro
                  </h2>
                </div>
                <span className="text-xs font-mono font-semibold bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] border border-[#66866A]/30 dark:border-[#4ADE80]/30 py-1 px-3 rounded-full">
                  Active Tier
                </span>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] leading-none">
                  {priceDisplay}
                </span>
                <span className="text-sm text-[#62685E] dark:text-[#A3B899] font-sans">
                  {pricePeriodLabel}
                </span>
              </div>

              {/* Research-Backed Rationale Callout */}
              <div className="mb-5 p-2.5 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] flex items-center gap-2 text-xs">
                <Zap size={14} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
                <span className="text-[#62685E] dark:text-[#A3B899] leading-tight">
                  <strong className="text-[#202920] dark:text-[#EDEAE2]">Lowest Market Entry Rate:</strong> Subsidized for early-stage scholars (~{currency === "USD" ? "$1" : "₹89"}/mo). Zero grant procurement approval required.
                </span>
              </div>

              <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 flex flex-col gap-2.5 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Billing frequency</span>
                  <span className="font-semibold text-[#202920] dark:text-[#EDEAE2] font-mono">
                    {billingPeriod === "monthly" ? "Monthly Micro-Debit" : "Annual Scholarly Pass"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Next renewal cycle</span>
                  <span className="font-semibold text-[#202920] dark:text-[#EDEAE2] font-mono">Nov 1, 2026</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Assigned scholar identity</span>
                  <span className="font-semibold text-[#3E6248] dark:text-[#4ADE80] font-mono">imthiyas@cambium.edu</span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full text-xs font-mono font-semibold uppercase tracking-wider text-[#202920] dark:text-[#EDEAE2] bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] hover:bg-[#F2EBDD] dark:hover:bg-[#202D23] py-2.5 rounded-xl transition-colors cursor-pointer">
              Manage Payment Details
            </button>
          </div>

          {/* AI Compute Credits Card */}
          <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-1">
                <span className="font-mono text-[10px] font-bold text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
                  Neural Intelligence Quota
                </span>
                <span className="text-xs font-mono font-bold text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1A281E] px-2 py-0.5 rounded border border-[#66866A]/20 dark:border-[#4ADE80]/30">
                  84.5% Used
                </span>
              </div>

              <h2 className="text-2xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] mb-5 m-0">
                Cambium AI Compute
              </h2>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="h-2.5 bg-[#F2EBDD] dark:bg-[#1F2E23] rounded-full overflow-hidden border border-[#E4DCCB] dark:border-[#233327]">
                  <div
                    className="h-full bg-[#3E6248] dark:bg-[#4ADE80] rounded-full"
                    style={{
                      width: `${barWidth}%`,
                      transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-[#62685E] dark:text-[#A3B899] mb-5 font-mono">
                <span className="font-bold text-[#202920] dark:text-[#EDEAE2]">8,450</span> / 10,000 intelligence tokens expended
              </p>

              <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 flex flex-col gap-2.5 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Remaining token balance</span>
                  <span className="font-semibold text-[#202920] dark:text-[#EDEAE2] font-mono">1,550 tokens</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Monthly allocation reload</span>
                  <span className="font-semibold text-[#202920] dark:text-[#EDEAE2] font-mono">Nov 1, 2026</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Average daily burn rate</span>
                  <span className="font-semibold text-[#202920] dark:text-[#EDEAE2] font-mono">281 tokens / day</span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full text-xs font-mono font-semibold uppercase tracking-wider text-white dark:text-[#0E140F] bg-[#3E6248] dark:bg-[#4ADE80] hover:bg-[#202920] dark:hover:bg-[#22C55E] py-2.5 rounded-xl transition-colors cursor-pointer border border-[#3E6248] dark:border-[#4ADE80]">
              Purchase Add-on Compute (+5,000 for {currency === "USD" ? "$0.50" : "₹45"})
            </button>
          </div>
        </div>

        {/* Section 2: Subscription Tiers (Lowest Entry Economics) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                Operating Tiers & Economics
              </h3>
              <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1 m-0">
                Full-featured enterprise research suite engineered to cost less than a cup of coffee.
              </p>
            </div>
            <span className="text-xs font-mono text-[#85877B] dark:text-[#7E8B7B]">
              Billed in {currency}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Researcher */}
            <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="mb-4">
                  <span className="font-mono text-[10px] font-bold text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
                    Scholar Free
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] leading-none">
                      {currency === "USD" ? "$0" : "₹0"}
                    </span>
                    <span className="text-xs text-[#62685E] dark:text-[#A3B899]">/ month</span>
                  </div>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1.5 leading-relaxed">
                    Essential literature discovery, public preprints, and basic workspace notes for independent reading.
                  </p>
                </div>

                <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 mb-6">
                  <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
                    {freeTierFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <span className="shrink-0 text-[#85877B] dark:text-[#7E8B7B]">
                          <CheckIcon />
                        </span>
                        <span className="text-xs text-[#62685E] dark:text-[#A3B899]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                disabled
                className="w-full text-xs font-mono font-semibold uppercase tracking-wider bg-[#F2EBDD] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#85877B] dark:text-[#7E8B7B] py-2.5 rounded-xl cursor-not-allowed opacity-75"
              >
                Current Baseline
              </button>
            </div>

            {/* Scholar Pro (Recommended - Lowest Price starting stage) */}
            <div className="bg-[#FAF7F0] dark:bg-[#131C15] border-2 border-[#3E6248] dark:border-[#4ADE80] rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between shadow-md">
              {/* Badge */}
              <div className="absolute -top-3 right-6 bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-xs">
                Active Tier · Recommended
              </div>

              <div>
                <div className="mb-4">
                  <span className="font-mono text-[10px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider">
                    Cambium Scholar Pro (Starting Stage)
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] leading-none">
                      {priceDisplay}
                    </span>
                    <span className="text-xs text-[#62685E] dark:text-[#A3B899]">
                      {pricePeriodLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1.5 leading-relaxed">
                    The highest leverage for the lowest price. Unrestricted literature synthesis, Agentic RAG, and priority compute clusters.
                  </p>
                </div>

                <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 mb-6">
                  <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
                    {proTierFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <span className="shrink-0 text-[#3E6248] dark:text-[#4ADE80]">
                          <CheckIcon />
                        </span>
                        <span className="text-xs font-medium text-[#202920] dark:text-[#EDEAE2]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                className="w-full text-xs font-mono font-bold uppercase tracking-wider text-white dark:text-[#0E140F] bg-[#3E6248] dark:bg-[#4ADE80] hover:bg-[#202920] dark:hover:bg-[#22C55E] py-2.5 rounded-xl transition-colors cursor-pointer border border-[#3E6248] dark:border-[#4ADE80] shadow-2xs"
              >
                Renewed on Scholar Pro
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Invoices History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                Billing Ledger & Receipts
              </h3>
              <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-0.5 m-0">
                Verified electronic receipts for tax and institutional reimbursement.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDownloadInvoice(invoices[0])}
              className="text-xs font-mono text-[#3E6248] dark:text-[#4ADE80] font-semibold cursor-pointer hover:underline bg-transparent border-0 p-0"
            >
              Export Latest Receipt (PDF)
            </button>
          </div>

          <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl overflow-hidden shadow-2xs">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_120px_1fr_100px_90px] px-6 py-3.5 bg-[#FAF7F0] dark:bg-[#131C15] border-b border-[#E4DCCB] dark:border-[#233327]">
              {["Date", "Amount", "Plan Type", "Status", ""].map((col, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-mono font-bold text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"}`}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            {invoices.map((inv, idx) => (
              <div
                key={inv.id}
                className={`grid grid-cols-[1fr_120px_1fr_100px_90px] px-6 py-4 items-center transition-colors hover:bg-[#FAF7F0]/60 dark:hover:bg-[#1F2E23]/40 ${
                  idx < invoices.length - 1 ? "border-b border-[#E4DCCB] dark:border-[#233327]" : ""
                }`}
              >
                <span className="text-xs font-medium text-[#202920] dark:text-[#EDEAE2]">{inv.date}</span>
                <span className="text-xs font-mono font-semibold text-[#202920] dark:text-[#EDEAE2]">{inv.amount}</span>
                <span className="text-xs text-[#62685E] dark:text-[#A3B899] font-sans">{inv.plan}</span>
                <span className="inline-flex">
                  <span className="text-[10px] font-mono font-semibold bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] px-2 py-0.5 rounded-full border border-[#66866A]/20 dark:border-[#4ADE80]/30">
                    {inv.status}
                  </span>
                </span>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDownloadInvoice(inv)}
                    className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#62685E] dark:text-[#A3B899] bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-lg px-2.5 py-1 cursor-pointer transition-colors hover:border-[#3E6248] dark:hover:border-[#4ADE80] hover:bg-[#DCE6D7] dark:hover:bg-[#1F2E23] hover:text-[#3E6248] dark:hover:text-[#4ADE80]"
                    title={`Print or save invoice ${inv.id}`}
                  >
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
