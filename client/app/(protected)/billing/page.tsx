"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Users,
  Lock,
  ArrowUpRight,
  PlusCircle,
  Clock,
  FileText,
} from "lucide-react";
import {
  useSubscriptionStore,
  type SubscriptionTier,
  type BillingCycle,
  type Currency,
  type InvoiceItem,
} from "@/lib/store/useSubscriptionStore";
import { PaymentCheckoutModal } from "@/components/billing/PaymentCheckoutModal";

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function BillingPageContent() {
  const searchParams = useSearchParams();
  const requestedTier = searchParams.get("tier");

  const {
    currentPlan,
    billingCycle,
    currency,
    tokensUsed,
    tokensTotal,
    renewalDate,
    paymentMethod,
    invoices,
    setCurrency,
    setBillingCycle,
    addTokens,
    downgradePlan,
  } = useSubscriptionStore();

  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionTier | null>(null);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupSuccessMessage, setTopupSuccessMessage] = useState("");
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (requestedTier === "pro" || requestedTier === "team" || requestedTier === "enterprise") {
      setCheckoutPlan(requestedTier as SubscriptionTier);
    }
  }, [requestedTier]);

  useEffect(() => {
    const percentage = Math.min(100, Math.round((tokensUsed / tokensTotal) * 100));
    const t = setTimeout(() => setBarWidth(percentage), 100);
    return () => clearTimeout(t);
  }, [tokensUsed, tokensTotal]);

  const isAnnual = billingCycle === "annual";

  // Price calculation
  const proMonthly = currency === "USD" ? "$1.00" : "₹89.00";
  const proAnnual = currency === "USD" ? "$10.00" : "₹899.00";
  const proPriceDisplay = isAnnual ? proAnnual : proMonthly;
  const proPeriodLabel = isAnnual ? "/ year (Save ~16%)" : "/ month";

  const teamMonthly = currency === "USD" ? "$49.00" : "₹3,999.00";
  const teamAnnual = currency === "USD" ? "$490.00" : "₹39,990.00";
  const teamPriceDisplay = isAnnual ? teamAnnual : teamMonthly;
  const teamPeriodLabel = isAnnual ? "/ year (Full Lab)" : "/ month (Full Lab)";

  const enterprisePriceDisplay = currency === "USD" ? "$5,000.00" : "₹420,000.00";

  const handleDownloadInvoice = (inv: InvoiceItem) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt — ${inv.invoiceNumber}</title>
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
            <div class="mono">Invoice Ref: ${inv.invoiceNumber} (${inv.id})</div>
            <div class="mono">Billing Date: ${inv.date}</div>
            <div style="height: 20px;"></div>
            <div class="row"><span>Subscription Plan:</span><strong>${inv.plan}</strong></div>
            <div class="row"><span>Payment Method:</span><span>${inv.method}</span></div>
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

  const handleAddTokens = (amount: number, costStr: string) => {
    addTokens(amount, costStr);
    setTopupSuccessMessage(`Successfully added +${amount.toLocaleString()} compute tokens!`);
    setShowTopupModal(false);
    setTimeout(() => setTopupSuccessMessage(""), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] font-sans overflow-y-auto transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">

        {/* Page Header */}
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
              <strong>75% of Cambium features are completely free forever.</strong> Pay-as-you-go and collaborative team workspaces are priced at the lowest market entry rates to pass student card and P-Card thresholds without grant bureaucracy.
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
                onClick={() => setBillingCycle("monthly")}
                className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] shadow-xs"
                    : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
                }`}
              >
                Annual (-16%)
              </button>
            </div>
          </div>
        </div>

        {/* Top-up feedback banner */}
        {topupSuccessMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#DCE6D7] dark:bg-[#1A281E] border border-[#66866A]/30 text-[#3E6248] dark:text-[#4ADE80] flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2.5 text-xs font-mono font-semibold">
              <Check size={16} />
              <span>{topupSuccessMessage}</span>
            </div>
          </div>
        )}

        {/* Section 1: Active Operating Tier & AI Quota Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Active Operating Tier Card */}
          <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-3xl p-7 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
                    Current Operating Tier
                  </span>
                  <h2 className="text-2xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] mt-1 m-0">
                    {currentPlan === "free"
                      ? "Cambium Scholar Free"
                      : currentPlan === "pro"
                      ? "Cambium Scholar Pro"
                      : currentPlan === "team"
                      ? "Cambium Lab Team Workspace"
                      : "Campus Enterprise Deployment"}
                  </h2>
                </div>
                <span className="text-xs font-mono font-semibold bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] border border-[#66866A]/30 dark:border-[#4ADE80]/30 py-1 px-3 rounded-full">
                  Active Tier
                </span>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] leading-none">
                  {currentPlan === "free"
                    ? "$0"
                    : currentPlan === "pro"
                    ? proPriceDisplay
                    : currentPlan === "team"
                    ? teamPriceDisplay
                    : enterprisePriceDisplay}
                </span>
                <span className="text-sm text-[#62685E] dark:text-[#A3B899] font-sans">
                  {currentPlan === "free" ? "/ month (Forever Free)" : currentPlan === "pro" ? proPeriodLabel : teamPeriodLabel}
                </span>
              </div>

              {/* Rationale callout */}
              <div className="mb-5 p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] flex items-center gap-2.5 text-xs">
                <Zap size={14} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
                <span className="text-[#62685E] dark:text-[#A3B899] leading-tight">
                  {currentPlan === "free"
                    ? "75% of Cambium features are available with zero credit card required."
                    : currentPlan === "pro"
                    ? "Subsidized individual tier (~$1/mo). Instant deep RAG reading and line-grounded proof."
                    : "Collaborative lab tier. Multi-user proposals, shared compute, and CRediT authorship."}
                </span>
              </div>

              <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 flex flex-col gap-2.5 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Payment Method</span>
                  <span className="font-semibold text-[#202920] dark:text-[#EDEAE2] font-mono">
                    {paymentMethod ? `${paymentMethod.label} (${paymentMethod.identifier})` : "None required (Free)"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Next Renewal Cycle</span>
                  <span className="font-semibold text-[#202920] dark:text-[#EDEAE2] font-mono">
                    {currentPlan === "free" ? "No expiration" : renewalDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setCheckoutPlan(currentPlan === "free" ? "pro" : currentPlan === "pro" ? "team" : "pro")}
                className="flex-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#202920] dark:text-[#EDEAE2] bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] hover:bg-[#F2EBDD] dark:hover:bg-[#202D23] py-2.5 rounded-xl transition-colors cursor-pointer text-center"
              >
                {currentPlan === "free" ? "Upgrade to Pro ($1)" : "Change Plan"}
              </button>
              {currentPlan !== "free" && (
                <button
                  onClick={() => downgradePlan("free")}
                  className="px-4 text-xs font-mono text-[#85877B] hover:text-[#C84B31] transition-colors cursor-pointer bg-transparent border-0"
                >
                  Downgrade
                </button>
              )}
            </div>
          </div>

          {/* AI Compute Credits Card */}
          <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-3xl p-7 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-1">
                <span className="font-mono text-[10px] font-bold text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
                  AI Assistant Monthly Quota
                </span>
                <span className="text-xs font-mono font-bold text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1A281E] px-2 py-0.5 rounded border border-[#66866A]/20 dark:border-[#4ADE80]/30">
                  {Math.round((tokensUsed / tokensTotal) * 100)}% Used
                </span>
              </div>

              <h2 className="text-2xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] mb-5 m-0">
                AI Assistant Allowance
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
                <span className="font-bold text-[#202920] dark:text-[#EDEAE2]">{tokensUsed.toLocaleString()}</span> / {tokensTotal.toLocaleString()} intelligence tokens expended
              </p>

              <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 flex flex-col gap-2.5 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Remaining token balance</span>
                  <span className="font-semibold text-[#202920] dark:text-[#EDEAE2] font-mono">
                    {Math.max(0, tokensTotal - tokensUsed).toLocaleString()} tokens
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Quota reload cycle</span>
                  <span className="font-semibold text-[#202920] dark:text-[#EDEAE2] font-mono">{renewalDate}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#62685E] dark:text-[#A3B899]">Pay-as-you-go top-up</span>
                  <span className="font-semibold text-[#3E6248] dark:text-[#4ADE80] font-mono">Enabled</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTopupModal(true)}
              className="mt-6 w-full text-xs font-mono font-semibold uppercase tracking-wider text-white dark:text-[#0E140F] bg-[#3E6248] dark:bg-[#4ADE80] hover:bg-[#202920] dark:hover:bg-[#22C55E] py-2.5 rounded-xl transition-colors cursor-pointer border border-[#3E6248] dark:border-[#4ADE80] flex items-center justify-center gap-2"
            >
              <PlusCircle size={14} />
              <span>Purchase Add-on Compute (+5,000 for {currency === "USD" ? "$0.50" : "₹45"})</span>
            </button>
          </div>
        </div>

        {/* Section 2: Complete 4-Tier Matrix */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider">
                MAANG-Grade Production Tiers
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                Operating Plans & Enterprise Economics
              </h3>
              <p className="text-xs sm:text-sm text-[#62685E] dark:text-[#A3B899] mt-1 m-0">
                Calibrated for individual scholars, growing research labs, and institution-wide deployments.
              </p>
            </div>
            <span className="text-xs font-mono text-[#85877B] dark:text-[#7E8B7B]">
              Billed in {currency} · Zero lock-in
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TIER 1: SCHOLAR FREE */}
            <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-3xl p-6 flex flex-col justify-between shadow-2xs hover:border-[#66866A]/40 transition-colors">
              <div>
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
                    Scholar Free
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] leading-none">
                      {currency === "USD" ? "$0" : "₹0"}
                    </span>
                    <span className="text-xs text-[#62685E] dark:text-[#A3B899]">/ forever</span>
                  </div>
                  <div className="mt-2 inline-block text-[10px] font-mono font-semibold bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] px-2 py-0.5 rounded-full">
                    75% of Platform Free
                  </div>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-2 leading-relaxed">
                    Essential literature search, force-directed graph exploration, and public preprint indexing for student scholars.
                  </p>
                </div>

                <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 mb-6">
                  <ul className="flex flex-col gap-2.5 m-0 p-0 list-none text-xs text-[#62685E] dark:text-[#A3B899]">
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>Unlimited paper search & knowledge graph</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>Public preprint & grant discovery</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>Up to 3 active workspace drafts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>20 AI paper audits / month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>Verified ORCID scholarly dossier</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                disabled={currentPlan === "free"}
                onClick={() => downgradePlan("free")}
                className={`w-full text-xs font-mono font-semibold uppercase tracking-wider py-2.5 rounded-xl transition-all ${
                  currentPlan === "free"
                    ? "bg-[#F2EBDD] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#85877B] cursor-default"
                    : "bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] hover:bg-[#FAF7F0] cursor-pointer"
                }`}
              >
                {currentPlan === "free" ? "Current Tier" : "Downgrade to Free"}
              </button>
            </div>

            {/* TIER 2: SCHOLAR PRO (INDIVIDUAL & PAY-AS-YOU-GO) */}
            <div className={`bg-[#FAF7F0] dark:bg-[#131C15] border-2 rounded-3xl p-6 relative flex flex-col justify-between shadow-md transition-all ${
              currentPlan === "pro"
                ? "border-[#3E6248] dark:border-[#4ADE80]"
                : "border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248]"
            }`}>
              {/* Highlight badge */}
              <div className="absolute -top-3 right-6 bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-0.5 rounded-full shadow-xs">
                {currentPlan === "pro" ? "Active Tier" : "Recommended"}
              </div>

              <div>
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider">
                    Scholar Pro
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] leading-none">
                      {proPriceDisplay}
                    </span>
                    <span className="text-xs text-[#62685E] dark:text-[#A3B899]">{proPeriodLabel}</span>
                  </div>
                  <div className="mt-2 inline-block text-[10px] font-mono font-semibold bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] px-2 py-0.5 rounded-full">
                    Pay-as-you-go Compute
                  </div>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-2 leading-relaxed">
                    Subsidized for postdocs & solo researchers (~$1/mo). Deep synthesis, line-level PDF audits, and pay-as-you-go compute.
                  </p>
                </div>

                <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 mb-6">
                  <ul className="flex flex-col gap-2.5 m-0 p-0 list-none text-xs text-[#202920] dark:text-[#EDEAE2]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>10,000 monthly AI Assistant tokens</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>Unlimited drafts & research notebooks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>Deep multi-paper literature matrix</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>Line-grounded PDF citations [p. X, L. Y]</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>Export to LaTeX, BibTeX & Nature styles</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                disabled={currentPlan === "pro"}
                onClick={() => setCheckoutPlan("pro")}
                className={`w-full text-xs font-mono font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-xs cursor-pointer ${
                  currentPlan === "pro"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] cursor-default"
                    : "bg-[#202920] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] hover:bg-[#3E6248]"
                }`}
              >
                {currentPlan === "pro" ? "Active on Pro" : `Upgrade to Pro (${proPriceDisplay})`}
              </button>
            </div>

            {/* TIER 3: LAB TEAM (COLLABORATIVE PRODUCTION) */}
            <div className={`bg-white dark:bg-[#18231B] border-2 rounded-3xl p-6 relative flex flex-col justify-between shadow-2xs transition-all ${
              currentPlan === "team"
                ? "border-[#3E6248] dark:border-[#4ADE80]"
                : "border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248]"
            }`}>
              {/* Highlight badge */}
              <div className="absolute -top-3 right-6 bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-0.5 rounded-full shadow-xs">
                {currentPlan === "team" ? "Active Tier" : "Team & Lab"}
              </div>

              <div>
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider">
                    Lab Team Workspace
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] leading-none">
                      {teamPriceDisplay}
                    </span>
                    <span className="text-xs text-[#62685E] dark:text-[#A3B899]">{teamPeriodLabel}</span>
                  </div>
                  <div className="mt-2 inline-block text-[10px] font-mono font-semibold bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] px-2 py-0.5 rounded-full">
                    Up to 15 Researchers
                  </div>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-2 leading-relaxed">
                    Notion & Figma-grade collaborative workspace for research laboratories, PIs, and cross-institutional teams.
                  </p>
                </div>

                <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 mb-6">
                  <ul className="flex flex-col gap-2.5 m-0 p-0 list-none text-xs text-[#202920] dark:text-[#EDEAE2]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>Shared lab workspace (up to 15 seats)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>Shared 50,000 GPU compute token pool</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>Multi-user grant pipeline & ICS sync</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>CRediT contributor authorship matrix</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#3E6248] dark:text-[#4ADE80]"><CheckIcon /></span>
                      <span>Multi-site IRB compliance checkpoints</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                disabled={currentPlan === "team"}
                onClick={() => setCheckoutPlan("team")}
                className={`w-full text-xs font-mono font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-xs cursor-pointer ${
                  currentPlan === "team"
                    ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] cursor-default"
                    : "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] hover:bg-[#202920]"
                }`}
              >
                {currentPlan === "team" ? "Active on Team" : "Upgrade to Lab Team"}
              </button>
            </div>

            {/* TIER 4: CAMPUS ENTERPRISE */}
            <div className={`bg-white dark:bg-[#18231B] border-2 rounded-3xl p-6 relative flex flex-col justify-between shadow-2xs transition-all ${
              currentPlan === "enterprise"
                ? "border-[#3E6248] dark:border-[#4ADE80]"
                : "border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248]"
            }`}>
              <div>
                <div className="mb-4">
                  <span className="text-[10px] font-mono font-bold text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
                    Campus Enterprise
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2] leading-none">
                      {currency === "USD" ? "$5,000+" : "₹4.2L+"}
                    </span>
                    <span className="text-xs text-[#62685E] dark:text-[#A3B899]">/ year</span>
                  </div>
                  <div className="mt-2 inline-block text-[10px] font-mono font-semibold bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#62685E] dark:text-[#A3B899] px-2 py-0.5 rounded-full">
                    Campus-Wide SSO
                  </div>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-2 leading-relaxed">
                    For university deans, provosts, and central research offices needing regulatory compliance and audit guarantees.
                  </p>
                </div>

                <div className="border-t border-[#E4DCCB] dark:border-[#233327] pt-4 mb-6">
                  <ul className="flex flex-col gap-2.5 m-0 p-0 list-none text-xs text-[#62685E] dark:text-[#A3B899]">
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>SAML / Shibboleth / EduGAIN SSO</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>Cryptographic Merkle audit ledger</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>Campus-wide grant pipeline analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>Central IRB ethics oversight board</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon />
                      <span>99.9% Uptime SLA & Dedicated TAM</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setCheckoutPlan("enterprise")}
                className="w-full text-xs font-mono font-semibold uppercase tracking-wider py-2.5 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#202D23] transition-all cursor-pointer"
              >
                Contact Campus Sales
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
                Verified electronic receipts with tax and institutional PO metadata for immediate reimbursement.
              </p>
            </div>
            {invoices.length > 0 && (
              <button
                type="button"
                onClick={() => handleDownloadInvoice(invoices[0])}
                className="text-xs font-mono text-[#3E6248] dark:text-[#4ADE80] font-semibold cursor-pointer hover:underline bg-transparent border-0 p-0"
              >
                Export Latest Receipt (PDF)
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-3xl overflow-hidden shadow-2xs">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_120px_1fr_100px_90px] px-6 py-3.5 bg-[#FAF7F0] dark:bg-[#131C15] border-b border-[#E4DCCB] dark:border-[#233327]">
              {["Date & Ref", "Amount", "Plan & Method", "Status", ""].map((col, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-mono font-bold text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider ${
                    i === 4 ? "text-right" : "text-left"
                  }`}
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
                <div>
                  <div className="text-xs font-medium text-[#202920] dark:text-[#EDEAE2]">{inv.date}</div>
                  <div className="text-[10px] font-mono text-[#85877B] dark:text-[#7E8B7B]">{inv.invoiceNumber}</div>
                </div>
                <span className="text-xs font-mono font-semibold text-[#202920] dark:text-[#EDEAE2]">{inv.amount}</span>
                <div>
                  <div className="text-xs text-[#202920] dark:text-[#EDEAE2] font-sans">{inv.plan}</div>
                  <div className="text-[10px] text-[#85877B] dark:text-[#7E8B7B] font-mono truncate max-w-xs">{inv.method}</div>
                </div>
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

      {/* Checkout Modal */}
      {checkoutPlan && (
        <PaymentCheckoutModal
          isOpen={Boolean(checkoutPlan)}
          onClose={() => setCheckoutPlan(null)}
          targetPlan={checkoutPlan}
          initialCycle={billingCycle}
          onSuccess={() => setCheckoutPlan(null)}
        />
      )}

      {/* Pay-as-you-go Top-up Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80]">
                  Pay-As-You-Go Add-On
                </span>
                <h3 className="font-serif text-xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                  Top-Up AI Compute Tokens
                </h3>
              </div>
              <button
                onClick={() => setShowTopupModal(false)}
                className="text-[#85877B] hover:text-[#202920] dark:hover:text-[#EDEAE2] p-1 rounded-xl bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#62685E] dark:text-[#A3B899] leading-relaxed">
              Add instantaneous intelligence tokens to your personal partition. Tokens never expire and carry over across billing cycles.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleAddTokens(5000, currency === "USD" ? "$0.50" : "₹45.00")}
                className="w-full p-4 rounded-2xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248] flex items-center justify-between text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div>
                  <div className="text-sm font-semibold text-[#202920] dark:text-[#EDEAE2] group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors">
                    +5,000 Compute Tokens
                  </div>
                  <div className="text-[11px] text-[#85877B] dark:text-[#7E8B7B]">
                    ~50 intensive PDF methodology audits
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-[#3E6248] dark:text-[#4ADE80]">
                    {currency === "USD" ? "$0.50" : "₹45.00"}
                  </div>
                  <div className="text-[10px] text-[#85877B] dark:text-[#7E8B7B]">1-Click Debit</div>
                </div>
              </button>

              <button
                onClick={() => handleAddTokens(20000, currency === "USD" ? "$1.50" : "₹130.00")}
                className="w-full p-4 rounded-2xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248] flex items-center justify-between text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div>
                  <div className="text-sm font-semibold text-[#202920] dark:text-[#EDEAE2] group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors">
                    +20,000 Compute Tokens
                  </div>
                  <div className="text-[11px] text-[#85877B] dark:text-[#7E8B7B]">
                    ~200 intensive audits + multi-paper matrices
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-[#3E6248] dark:text-[#4ADE80]">
                    {currency === "USD" ? "$1.50" : "₹130.00"}
                  </div>
                  <div className="text-[10px] text-[#85877B] dark:text-[#7E8B7B]">Best Value</div>
                </div>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowTopupModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-mono text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent border-0 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#0E140F] flex items-center justify-center font-mono text-xs text-[#85877B]">
          Loading billing ledger...
        </div>
      }
    >
      <BillingPageContent />
    </Suspense>
  );
}
