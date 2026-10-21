"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import { Check, Sparkles, Building2, ShieldCheck, ArrowRight, Zap, HelpCircle } from "lucide-react";

type Currency = "USD" | "INR";

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "Scholar Free",
      tagline: "Essential literature discovery for independent students and researchers.",
      price: currency === "USD" ? "$0" : "₹0",
      period: "forever",
      badge: "Open Science",
      buttonText: "Get Started Free",
      buttonHref: "/sign-up",
      highlight: false,
      features: [
        "100 AI inference queries / month",
        "Public preprint search & arXiv indexing",
        "Up to 3 active workspace drafts",
        "Standard semantic citation graph",
        "Community forum scholarly support",
      ],
    },
    {
      name: "Scholar Pro (Starting Stage)",
      tagline: "Lowest market price: Passes student card & UPI micro-transaction limits without grant approval.",
      price: currency === "USD"
        ? (billingPeriod === "monthly" ? "$1" : "$10")
        : (billingPeriod === "monthly" ? "₹89" : "₹899"),
      period: billingPeriod === "monthly" ? "/ month" : "/ year (Save ~16%)",
      badge: "Best Value · Lowest Entry Rate",
      buttonText: `Activate Scholar Pro (${currency === "USD" ? "$1" : "₹89"}/mo)`,
      buttonHref: "/billing",
      highlight: true,
      features: [
        "10,000 Neural AI Reasoning Credits / month",
        "Split-screen Agentic PDF Reader & RAG matrix",
        "Unlimited workspace projects & notebooks",
        "Multi-paper synthesis & literature matrix",
        "Shared GPU cluster priority inference",
        "BibTeX, Zotero, & ORCID bidirectional sync",
        "Export to LaTeX, Nature & IEEE templates",
      ],
    },
    {
      name: "Institutional Enterprise",
      tagline: "Campus-wide compliance, SMART IRB reliance, and dedicated HPC clusters.",
      price: "Custom",
      period: "per university department",
      badge: "Campus & Consortium",
      buttonText: "Schedule Institutional Demo",
      buttonHref: "/contact",
      highlight: false,
      features: [
        "SAML 2.0 / Shibboleth & InCommon SSO",
        "Multi-site SMART IRB protocol management",
        "Immutable Merkle-verified audit ledger",
        "Custom FAIR data bridge (Zenodo/Dryad)",
        "Dedicated on-premise or VPC deployment",
        "HIPAA, SOC-2 Type II, and GDPR compliance SLA",
        "Dedicated Institutional Success Partner",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] font-sans flex flex-col selection:bg-[#3E6248]/20 selection:text-[#173F35] transition-colors duration-200">
      <PublicHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 sm:py-24 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/70 dark:bg-[#1A281E] border border-[#66866A]/30 dark:border-[#4ADE80]/30">
            <Sparkles size={13} className="text-[#3E6248] dark:text-[#4ADE80]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] dark:text-[#4ADE80] font-semibold">
              Democratized Scholarly Economics
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#202920] dark:text-[#EDEAE2] tracking-tight leading-tight m-0">
            Frontier AI reasoning for <br />
            <span className="italic text-[#3E6248] dark:text-[#4ADE80]">every single researcher</span>.
          </h1>

          <p className="font-serif text-base sm:text-lg text-[#62685E] dark:text-[#A3B899] max-w-2xl mx-auto leading-relaxed">
            From undergraduate student preprints to laboratory consortia. Priced at the lowest battle-tested rate so cost is never a barrier to breakthrough science.
          </p>

          {/* Controls: Currency + Billing Switcher */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {/* Currency toggle */}
            <div className="bg-[#E4DCCB]/60 dark:bg-[#18231B] p-1 rounded-full flex items-center border border-[#E4DCCB] dark:border-[#233327]">
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                  currency === "INR"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                INR (₹)
              </button>
            </div>

            {/* Billing period switcher */}
            <div className="bg-[#E4DCCB]/60 dark:bg-[#18231B] p-1 rounded-full flex items-center border border-[#E4DCCB] dark:border-[#233327]">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                  billingPeriod === "monthly"
                    ? "bg-white dark:bg-[#202D23] text-[#202920] dark:text-[#EDEAE2] shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                Billed Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingPeriod === "annual"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] shadow-xs font-semibold"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                <span>Billed Annually</span>
                <span className="text-[10px] bg-white/20 dark:bg-black/20 px-1.5 py-0.2 rounded-full font-bold">
                  Save ~16%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                p.highlight
                  ? "bg-white dark:bg-[#18231B] border-2 border-[#3E6248] dark:border-[#4ADE80] shadow-lg shadow-[#3E6248]/10 scale-[1.02]"
                  : "bg-white/80 dark:bg-[#18231B]/70 border border-[#E4DCCB] dark:border-[#233327] shadow-xs hover:border-[#3E6248]/40 dark:hover:border-[#4ADE80]/40"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] font-mono text-[11px] font-semibold uppercase tracking-wider shadow-xs whitespace-nowrap">
                  {p.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                    {p.name}
                  </h3>
                  {!p.highlight && (
                    <span className="font-mono text-[10px] text-[#62685E] dark:text-[#A3B899] px-2 py-0.5 rounded-full bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327]">
                      {p.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#62685E] dark:text-[#A3B899] min-h-[36px] leading-relaxed">
                  {p.tagline}
                </p>

                <div className="py-6 border-b border-[#E4DCCB] dark:border-[#233327] flex items-baseline gap-1.5">
                  <span className="font-serif text-4xl sm:text-5xl font-semibold text-[#202920] dark:text-[#EDEAE2]">
                    {p.price}
                  </span>
                  <span className="text-xs font-mono text-[#62685E] dark:text-[#A3B899]">
                    {p.period}
                  </span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 py-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#62685E] dark:text-[#A3B899] font-semibold">
                    Included Capabilities:
                  </div>
                  {p.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#202920] dark:text-[#EDEAE2]">
                      <div className="w-4 h-4 rounded-full bg-[#DCE6D7] dark:bg-[#1A281E] flex items-center justify-center shrink-0 mt-0.5 text-[#3E6248] dark:text-[#4ADE80]">
                        <Check size={11} strokeWidth={2.5} />
                      </div>
                      <span className="leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href={p.buttonHref}
                  className={`w-full py-3 px-5 rounded-2xl font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 text-center no-underline shadow-xs ${
                    p.highlight
                      ? "bg-[#3E6248] dark:bg-[#4ADE80] hover:bg-[#173F35] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F]"
                      : "bg-[#FAF7F0] dark:bg-[#131C15] hover:bg-[#E4DCCB] dark:hover:bg-[#202D23] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2]"
                  }`}
                >
                  <span>{p.buttonText}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Compliance Assurance Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F2EBDD] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327]">
              <ShieldCheck size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] dark:text-[#4ADE80] font-semibold">
                Institutional Trust & Grants
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
              Eligible for Student Stipend & Grant Invoicing
            </h2>
            <p className="text-xs sm:text-sm text-[#62685E] dark:text-[#A3B899] leading-relaxed">
              Cambium qualifies as an allowable direct cost on NIH, NSF, and Horizon Europe grant applications, and passes individual graduate student bank micro-transaction limits with instant automated PDF receipts.
            </p>
          </div>

          <Link
            href="/institution-sso"
            className="px-6 py-3.5 rounded-2xl bg-[#202920] dark:bg-[#3E6248] hover:bg-[#173F35] dark:hover:bg-[#293E30] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shrink-0 shadow-xs no-underline"
          >
            <Building2 size={15} />
            Institutional SAML Directory
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
