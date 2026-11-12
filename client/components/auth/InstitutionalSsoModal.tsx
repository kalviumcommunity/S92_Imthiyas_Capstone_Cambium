"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Search,
  ShieldCheck,
  Building2,
  X,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useToast } from "@/components/ui/toast";
import { useHydrated } from "@/lib/hooks/use-hydrated";

export interface InstitutionalSsoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INSTITUTIONS = [
  {
    id: "stanford",
    name: "Stanford University",
    domain: "stanford.edu",
    protocol: "InCommon / SAML 2.0",
    badge: "Tier 1 Research",
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    domain: "mit.edu",
    protocol: "Touchstone SSO",
    badge: "Tier 1 Research",
  },
  {
    id: "oxford",
    name: "University of Oxford",
    domain: "ox.ac.uk",
    protocol: "EduGAIN / Shibboleth",
    badge: "UK Academic",
  },
  {
    id: "harvard",
    name: "Harvard University",
    domain: "harvard.edu",
    protocol: "HarvardKey SAML",
    badge: "Tier 1 Research",
  },
  {
    id: "cambridge",
    name: "University of Cambridge",
    domain: "cam.ac.uk",
    protocol: "Raven / Shibboleth",
    badge: "UK Academic",
  },
  {
    id: "eth",
    name: "ETH Zürich",
    domain: "ethz.ch",
    protocol: "SWITCHaai / SAML",
    badge: "European Union",
  },
  {
    id: "maxplanck",
    name: "Max Planck Society",
    domain: "mpg.de",
    protocol: "DFN-AAI / EduGAIN",
    badge: "Research Institute",
  },
  {
    id: "nih",
    name: "National Institutes of Health",
    domain: "nih.gov",
    protocol: "Login.gov / PIV Card",
    badge: "Gov / Clinical",
  },
];

export function InstitutionalSsoModal({ isOpen, onClose }: InstitutionalSsoModalProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();

  const [step, setStep] = useState<"search" | "2fa">("search");
  const [selectedInst, setSelectedInst] = useState<(typeof INSTITUTIONS)[0] | null>(null);
  const [query, setQuery] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const mounted = useHydrated();

  if (!isOpen || !mounted) return null;

  const filtered = INSTITUTIONS.filter(
    (inst) =>
      inst.name.toLowerCase().includes(query.toLowerCase()) ||
      inst.domain.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectInstitution = (inst: (typeof INSTITUTIONS)[0]) => {
    setSelectedInst(inst);
    setStep("2fa");
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`sso-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify2fa = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const demoUser = {
        id: "sso-scholar-1",
        username: "elena.vance",
        email: `e.vance@${selectedInst?.domain || "stanford.edu"}`,
        fullName: "Dr. Elena Vance",
        institution: selectedInst?.name || "Stanford University",
      };
      setAuth(demoUser, "saml-token-" + Date.now());
      onClose();
      toast({
        title: "SSO Authentication Successful",
        description: `Authenticated via ${selectedInst?.protocol}. Welcome Dr. Vance.`,
        variant: "success",
      });
      router.push("/dashboard");
    }, 800);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#141A14]/75 dark:bg-[#070B08]/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl shadow-2xl overflow-hidden font-sans relative z-10"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E4DCCB] dark:border-[#233327] bg-[#F2EBDD]/40 dark:bg-[#18231B]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#DCE6D7] dark:bg-[#1F2E23] border border-[#E4DCCB] dark:border-[#233327] text-[#3E6248] dark:text-[#4ADE80] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] font-semibold bg-[#DCE6D7] dark:bg-[#1F2E23] px-2 py-0.5 rounded border border-[#E4DCCB] dark:border-[#233327]">
                  EduGAIN · SAML 2.0
                </span>
                <span className="text-[11px] text-[#85877B] dark:text-[#7E8B7B] font-mono">Academic Trust Mesh</span>
              </div>
              <h2 className="font-serif text-[18px] font-semibold text-[#202920] dark:text-[#EDEAE2] m-0 mt-0.5">
                {step === "search" ? "Institutional Single Sign-On" : "Two-Factor Verification (2FA)"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {step === "search" ? (
          <div className="p-6">
            <p className="text-[13px] text-[#62685E] dark:text-[#A3B899] m-0 mb-4 leading-relaxed">
              Authenticate using your university or research hospital identity provider with federated multi-factor authorization.
            </p>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-[#85877B] dark:text-[#7E8B7B] absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Search by university name or domain (e.g. stanford.edu, mit.edu)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-lg text-[13px] text-[#202920] dark:text-[#EDEAE2] placeholder-[#85877B] dark:placeholder-[#7E8B7B] outline-none focus:border-[#3E6248] dark:focus:border-[#4ADE80] transition-colors"
              />
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filtered.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => handleSelectInstitution(inst)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] hover:border-[#3E6248] dark:hover:border-[#4ADE80] hover:bg-[#F2EBDD]/40 dark:hover:bg-[#1F2E23]/50 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Building2 className="w-4 h-4 text-[#85877B] dark:text-[#7E8B7B] group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#202920] dark:text-[#EDEAE2] group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] truncate">
                        {inst.name}
                      </div>
                      <div className="text-[11px] text-[#85877B] dark:text-[#7E8B7B] font-mono">{inst.domain} · {inst.protocol}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#62685E] dark:text-[#A3B899] shrink-0">
                    {inst.badge}
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-6 text-[12.5px] text-[#85877B] dark:text-[#7E8B7B]">
                  No matching university identity provider found. Contact your institution&apos;s Cambium administrator.
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between text-[11.5px] text-[#85877B] dark:text-[#7E8B7B]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3E6248] dark:text-[#4ADE80]" />
                <span>Protected by SAML 2.0 Web Browser SSO profile</span>
              </div>
              <span className="font-mono">InCommon Accredited</span>
            </div>
          </div>
        ) : (
          /* Step 2: 2FA Screen */
          <div className="p-6">
            <div className="p-3 bg-[#DCE6D7]/40 dark:bg-[#1F2E23]/40 rounded-xl border border-[#E4DCCB] dark:border-[#233327] mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] flex items-center justify-center font-bold text-xs text-[#3E6248] dark:text-[#4ADE80]">
                  {selectedInst?.name[0]}
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-[#202920] dark:text-[#EDEAE2]">{selectedInst?.name}</div>
                  <div className="text-[11px] text-[#62685E] dark:text-[#A3B899] font-mono">{selectedInst?.protocol} Handshake Verified</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep("search")}
                className="text-[11px] text-[#3E6248] dark:text-[#4ADE80] hover:underline bg-transparent border-0 cursor-pointer p-0"
              >
                Change
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F0] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-[#3E6248] dark:text-[#4ADE80] flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-[17px] font-semibold text-[#202920] dark:text-[#EDEAE2] m-0">
                Enter Institutional 2FA Code
              </h3>
              <p className="text-[12.5px] text-[#62685E] dark:text-[#A3B899] m-0 mt-1">
                Enter the 6-digit verification code generated by your Duo Mobile or institutional authenticator app.
              </p>
            </div>

            <form onSubmit={handleVerify2fa}>
              {/* 6 OTP Inputs */}
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`sso-otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-12 text-center text-[18px] font-mono font-bold bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] rounded-lg text-[#202920] dark:text-[#EDEAE2] focus:border-[#3E6248] dark:focus:border-[#4ADE80] focus:ring-2 focus:ring-[#3E6248]/20 dark:focus:ring-[#4ADE80]/20 outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] font-medium text-[13px] rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <span>{isVerifying ? "Validating SAML Assertion…" : "Verify & Complete SSO Login"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#E4DCCB] dark:border-[#233327] text-center">
              <button
                type="button"
                onClick={() => {
                  setOtp(["1", "2", "3", "4", "5", "6"]);
                  toast({
                    title: "Test OTP Populated",
                    description: "Simulation code 123456 ready to submit.",
                  });
                }}
                className="text-[11.5px] text-[#3E6248] dark:text-[#4ADE80] hover:underline bg-transparent border-0 cursor-pointer p-0"
              >
                Quick Demo: Auto-fill sample 2FA code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
