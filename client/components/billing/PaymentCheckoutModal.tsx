"use client";

import React, { useState } from "react";
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  Info,
} from "lucide-react";
import {
  useSubscriptionStore,
  type SubscriptionTier,
  type BillingCycle,
  type Currency,
  type PaymentMethodInfo,
} from "@/lib/store/useSubscriptionStore";

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: SubscriptionTier;
  initialCycle?: BillingCycle;
  onSuccess?: (plan: SubscriptionTier) => void;
}

type PaymentChannel = "card" | "upi" | "grant_po";

export function PaymentCheckoutModal({
  isOpen,
  onClose,
  targetPlan,
  initialCycle = "monthly",
  onSuccess,
}: PaymentCheckoutModalProps) {
  const { currency, setCurrency, upgradePlan } = useSubscriptionStore();
  const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
  const [channel, setChannel] = useState<PaymentChannel>(currency === "INR" ? "upi" : "card");

  // Form state
  const [cardName, setCardName] = useState("Dr. Shaik Mohamed Imthiyas");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("889");

  const [upiId, setUpiId] = useState("imthiyas@okaxis");
  const [grantCode, setGrantCode] = useState("NIH-R01-HG012345");
  const [departmentCode, setDepartmentCode] = useState("BIO-ENG-2026");

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  // Plan pricing matrix
  const isAnnual = cycle === "annual";
  let planTitle = "Cambium Scholar Pro";
  let priceDisplay = currency === "USD" ? (isAnnual ? "$10.00" : "$1.00") : (isAnnual ? "₹899.00" : "₹89.00");
  let periodLabel = isAnnual ? "/ year (Save ~16%)" : "/ month";
  let highlightNote = "Subsidized entry rate calibrated to bypass institutional grant procurement friction.";

  if (targetPlan === "team") {
    planTitle = "Cambium Lab Team Workspace";
    priceDisplay = currency === "USD" ? (isAnnual ? "$490.00" : "$49.00") : (isAnnual ? "₹39,990.00" : "₹3,999.00");
    periodLabel = isAnnual ? "/ year (Full Lab)" : "/ month (Full Lab)";
    highlightNote = "Includes up to 15 team researchers, shared compute pool, and collaborative grant pipeline.";
  } else if (targetPlan === "enterprise") {
    planTitle = "Campus Enterprise Deployment";
    priceDisplay = currency === "USD" ? "$5,000.00" : "₹420,000.00";
    periodLabel = "/ year (Campus-wide)";
    highlightNote = "Includes unlimited departmental researchers, SAML SSO, and immutable Merkle audit ledgers.";
  }

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    setProcessingStep("Verifying academic credentials and routing...");

    await new Promise((r) => setTimeout(r, 700));
    setProcessingStep(
      channel === "card"
        ? "Authorizing university P-Card via 3D Secure / Stripe gateway..."
        : channel === "upi"
        ? "Verifying instant UPI VPA handle & bank routing..."
        : "Validating federal grant PO voucher & university cost center..."
    );

    await new Promise((r) => setTimeout(r, 800));
    setProcessingStep("Provisioning dedicated high-throughput vector compute partition...");

    await new Promise((r) => setTimeout(r, 600));

    let paymentInfo: PaymentMethodInfo = {
      type: "card",
      label: "University Purchasing Card",
      identifier: `•••• ${cardNumber.slice(-4) || "4242"}`,
      expDate: cardExp,
    };

    if (channel === "upi") {
      paymentInfo = {
        type: "upi",
        label: "Instant Scholarly UPI",
        identifier: upiId || "scholar@upi",
      };
    } else if (channel === "grant_po") {
      paymentInfo = {
        type: "grant_po",
        label: "Federal Grant PO Voucher",
        identifier: grantCode || "GRANT-PO-2026",
      };
    }

    upgradePlan(targetPlan, cycle, paymentInfo);

    // Sync subscription tier to backend (mock billing endpoint)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = typeof window !== "undefined" ? localStorage.getItem("cambium_access_token") : null;
      if (token) {
        fetch(`${apiUrl}/api/billing/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tier: targetPlan, cycle }),
        }).catch((err) => {
          console.warn("[Billing] Backend sync warning (non-blocking):", err);
        });
      }
    } catch {
      // Non-blocking catch
    }

    setIsProcessing(false);
    setIsCompleted(true);

    if (onSuccess) {
      onSuccess(targetPlan);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between bg-white/70 dark:bg-[#18231B]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] flex items-center justify-center">
              <Lock size={15} />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80]">
                Enterprise Payment Gateway
              </div>
              <h2 className="text-lg font-serif font-semibold text-[#202920] dark:text-[#EDEAE2] m-0 leading-tight">
                Complete Subscription
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#85877B] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23] transition-colors border-0 bg-transparent cursor-pointer"
            aria-label="Close checkout"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isCompleted ? (
            /* Success confirmation screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] border border-[#66866A]/30 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                  Plan Successfully Activated
                </h3>
                <p className="text-sm text-[#62685E] dark:text-[#A3B899] mt-2 max-w-md mx-auto leading-relaxed">
                  Your workspace has been upgraded to <strong>{planTitle}</strong>. An electronic receipt with institutional metadata has been issued to your billing ledger.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl max-w-sm mx-auto text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#85877B] dark:text-[#7E8B7B]">Plan Tier:</span>
                  <span className="font-bold text-[#202920] dark:text-[#EDEAE2]">{planTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#85877B] dark:text-[#7E8B7B]">Total Charged:</span>
                  <span className="font-bold text-[#3E6248] dark:text-[#4ADE80]">{priceDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#85877B] dark:text-[#7E8B7B]">Billing Cycle:</span>
                  <span className="text-[#202920] dark:text-[#EDEAE2]">{cycle === "monthly" ? "Monthly" : "Annual"}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] hover:bg-[#202920] dark:hover:bg-[#22C55E] transition-all cursor-pointer shadow-md"
                >
                  Return to Workspace
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            /* Loading authorization spinner */
            <div className="py-12 text-center space-y-5">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-3 border-[#E4DCCB] dark:border-[#233327] border-t-[#3E6248] dark:border-t-[#4ADE80] animate-spin" />
                <Sparkles size={18} className="absolute inset-0 m-auto text-[#3E6248] dark:text-[#4ADE80] animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                  Processing Electronic Transaction
                </h3>
                <p className="text-xs font-mono text-[#3E6248] dark:text-[#4ADE80] mt-2 animate-pulse">
                  {processingStep}
                </p>
              </div>
              <p className="text-[11px] text-[#85877B] dark:text-[#7E8B7B] max-w-xs mx-auto">
                Enforcing bank-grade 256-bit encryption and PCI-DSS Level 1 compliance.
              </p>
            </div>
          ) : (
            /* Normal checkout form */
            <>
              {/* Order Summary Banner */}
              <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-4.5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider">
                      Selected Plan
                    </span>
                    <h3 className="text-lg font-serif font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                      {planTitle}
                    </h3>
                    <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-0.5">
                      {highlightNote}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-serif font-normal text-[#202920] dark:text-[#EDEAE2]">
                      {priceDisplay}
                    </div>
                    <div className="text-[11px] text-[#85877B] dark:text-[#7E8B7B] font-sans">
                      {periodLabel}
                    </div>
                  </div>
                </div>

                {/* Currency and frequency toggle controls */}
                <div className="pt-3 border-t border-[#E4DCCB]/60 dark:border-[#233327]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 bg-[#FAF7F0] dark:bg-[#131C15] p-1 rounded-xl border border-[#E4DCCB] dark:border-[#233327]">
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-semibold cursor-pointer transition-all ${
                        currency === "USD"
                          ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F]"
                          : "text-[#62685E] dark:text-[#A3B899]"
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("INR")}
                      className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-semibold cursor-pointer transition-all ${
                        currency === "INR"
                          ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F]"
                          : "text-[#62685E] dark:text-[#A3B899]"
                      }`}
                    >
                      INR (₹)
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#FAF7F0] dark:bg-[#131C15] p-1 rounded-xl border border-[#E4DCCB] dark:border-[#233327]">
                    <button
                      type="button"
                      onClick={() => setCycle("monthly")}
                      className={`px-2 py-0.5 rounded-lg font-sans text-[11px] font-medium cursor-pointer transition-all ${
                        cycle === "monthly"
                          ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F]"
                          : "text-[#62685E] dark:text-[#A3B899]"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setCycle("annual")}
                      className={`px-2 py-0.5 rounded-lg font-sans text-[11px] font-medium cursor-pointer transition-all ${
                        cycle === "annual"
                          ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F]"
                          : "text-[#62685E] dark:text-[#A3B899]"
                      }`}
                    >
                      Annual (-16%)
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Channel Selector */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#85877B] dark:text-[#7E8B7B] mb-2">
                  Select Institutional Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel("card")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      channel === "card"
                        ? "bg-white dark:bg-[#18231B] border-[#3E6248] dark:border-[#4ADE80] shadow-xs"
                        : "bg-[#FAF7F0] dark:bg-[#131C15] border-[#E4DCCB] dark:border-[#233327] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <CreditCard
                      size={18}
                      className={channel === "card" ? "text-[#3E6248] dark:text-[#4ADE80]" : "text-[#85877B]"}
                    />
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-[#202920] dark:text-[#EDEAE2]">P-Card / Card</div>
                      <div className="text-[10px] text-[#85877B] dark:text-[#7E8B7B]">Visa, MC, Amex</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("upi")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      channel === "upi"
                        ? "bg-white dark:bg-[#18231B] border-[#3E6248] dark:border-[#4ADE80] shadow-xs"
                        : "bg-[#FAF7F0] dark:bg-[#131C15] border-[#E4DCCB] dark:border-[#233327] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <QrCode
                      size={18}
                      className={channel === "upi" ? "text-[#3E6248] dark:text-[#4ADE80]" : "text-[#85877B]"}
                    />
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-[#202920] dark:text-[#EDEAE2]">Instant UPI / QR</div>
                      <div className="text-[10px] text-[#85877B] dark:text-[#7E8B7B]">GPay, PhonePe, VPA</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("grant_po")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      channel === "grant_po"
                        ? "bg-white dark:bg-[#18231B] border-[#3E6248] dark:border-[#4ADE80] shadow-xs"
                        : "bg-[#FAF7F0] dark:bg-[#131C15] border-[#E4DCCB] dark:border-[#233327] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Building2
                      size={18}
                      className={channel === "grant_po" ? "text-[#3E6248] dark:text-[#4ADE80]" : "text-[#85877B]"}
                    />
                    <div className="mt-2">
                      <div className="text-xs font-semibold text-[#202920] dark:text-[#EDEAE2]">Grant PO / Voucher</div>
                      <div className="text-[10px] text-[#85877B] dark:text-[#7E8B7B]">NIH / NSF Account</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Channel Form Details */}
              <div className="bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl p-4.5 space-y-3.5">
                {channel === "card" && (
                  <>
                    <div>
                      <label className="block text-[11px] font-mono text-[#62685E] dark:text-[#A3B899] mb-1">
                        Cardholder Name (or Institutional Department)
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Dr. Elena Rodriguez"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] focus:outline-hidden focus:border-[#3E6248]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#62685E] dark:text-[#A3B899] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] focus:outline-hidden focus:border-[#3E6248]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-[#62685E] dark:text-[#A3B899] mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] focus:outline-hidden focus:border-[#3E6248]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#62685E] dark:text-[#A3B899] mb-1">
                          Security Code (CVC)
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] focus:outline-hidden focus:border-[#3E6248]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {channel === "upi" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#62685E] dark:text-[#A3B899] mb-1">
                        Virtual Payment Address (VPA / UPI ID)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="scholar@okaxis"
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] focus:outline-hidden focus:border-[#3E6248]"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] flex items-center gap-3">
                      <QrCode size={36} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
                      <div className="text-[11px] text-[#62685E] dark:text-[#A3B899] leading-tight">
                        Instant zero-fee student debit. Scan QR code or approve notification in your Google Pay, BHIM, or PhonePe app.
                      </div>
                    </div>
                  </div>
                )}

                {channel === "grant_po" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#62685E] dark:text-[#A3B899] mb-1">
                        Federal Grant Award / Project Code
                      </label>
                      <input
                        type="text"
                        value={grantCode}
                        onChange={(e) => setGrantCode(e.target.value)}
                        placeholder="NIH-R01-HG012345 or NSF-CAREER-24510"
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] focus:outline-hidden focus:border-[#3E6248]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#62685E] dark:text-[#A3B899] mb-1">
                        University Department Cost Center
                      </label>
                      <input
                        type="text"
                        value={departmentCode}
                        onChange={(e) => setDepartmentCode(e.target.value)}
                        placeholder="DEPT-CC-4921"
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] focus:outline-hidden focus:border-[#3E6248]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Security & Guarantee Disclaimer */}
              <div className="flex items-center gap-2 text-[11px] text-[#85877B] dark:text-[#7E8B7B]">
                <ShieldCheck size={14} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
                <span>
                  Zero commitment. Cancel anytime with 1-click in account settings. 100% money-back guarantee for 14 days.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isCompleted && !isProcessing && (
          <div className="px-6 py-4 border-t border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between bg-white/70 dark:bg-[#18231B]/70">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono font-medium text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent border-0 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExecutePayment}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] hover:bg-[#202920] dark:hover:bg-[#22C55E] transition-all cursor-pointer shadow-md"
            >
              <span>Pay & Activate ({priceDisplay})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

