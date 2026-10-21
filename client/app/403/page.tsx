"use client";

import React, { useState } from "react";
import Link from "next/link";
import CambiumLogo from "@/components/CambiumLogo";
import {
  Lock,
  ShieldAlert,
  ArrowLeft,
  KeyRound,
  Building2,
  Send,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function ForbiddenPage() {
  const [requestSent, setRequestSent] = useState(false);
  const [justification, setJustification] = useState("");

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) return;
    setRequestSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#202920] font-sans flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      {/* Background Subtle Noise & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E4DCCB_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between border-b border-[#E4DCCB] pb-6">
        <CambiumLogo size="md" badge="Enterprise Security" href="/" />

        <Link
          href="/dashboard"
          className="text-xs font-mono text-[#62685E] hover:text-[#202920] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={13} />
          Return to Dashboard
        </Link>
      </header>

      {/* Main Error Container */}
      <main className="relative z-10 max-w-2xl mx-auto w-full my-auto py-12 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/30 text-[#92400E]">
            <Lock size={13} />
            <span className="font-mono text-xs uppercase tracking-widest font-semibold">
              HTTP 403 // Access Denied
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#202920] tracking-tight leading-tight m-0">
            Restricted Institutional Enclave
          </h1>

          <p className="font-serif text-base sm:text-lg text-[#62685E] leading-relaxed">
            You do not hold active RBAC clearance or SMART IRB reliance authorization for this laboratory's confidential genomic datasets and manuscripts.
          </p>
        </div>

        {/* Security Diagnostics Card */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#62685E] font-semibold">
            Institutional Diagnostic Context
          </div>

          <div className="space-y-2 text-xs font-mono text-[#202920]">
            <div className="flex justify-between py-1.5 border-b border-[#E4DCCB]/60">
              <span className="text-[#62685E]">Requested Boundary:</span>
              <span className="font-semibold">MIT CSAIL · Lab Enclave #884</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E4DCCB]/60">
              <span className="text-[#62685E]">Your Current Role:</span>
              <span>Visiting Scholar / Guest (Tier 4)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E4DCCB]/60">
              <span className="text-[#62685E]">Required Clearance:</span>
              <span className="text-[#991B1B] font-semibold">Principal Investigator or Co-PI Delegation</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#62685E]">Audit Event Logged:</span>
              <span className="text-[#62685E]">evt-403-access-gatekeeper</span>
            </div>
          </div>
        </div>

        {/* Action: Request Access or Re-Authenticate */}
        {!requestSent ? (
          <form
            onSubmit={handleRequestAccess}
            className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-[#3E6248]" />
              <h2 className="font-serif text-base font-semibold text-[#202920] m-0">
                Request PI Delegation & Data Access
              </h2>
            </div>
            <p className="text-xs text-[#62685E]">
              Transmit an encrypted delegation request directly to the Principal Investigator's compliance queue.
            </p>

            <textarea
              required
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="State your institutional research need, grant reference, or co-authorship agreement..."
              className="w-full p-3 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248]"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#3E6248] hover:bg-[#173F35] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Send size={13} />
                Submit Access Petition
              </button>

              <Link
                href="/institution-sso"
                className="py-2.5 px-4 rounded-xl bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-[#202920] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 text-center"
              >
                <KeyRound size={13} />
                Switch SAML / SSO Credentials
              </Link>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-[#DCE6D7] border border-[#66866A]/40 text-[#173F35] space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 size={16} className="text-[#3E6248]" />
              Delegation Petition Dispatched
            </div>
            <p className="text-xs font-serif leading-relaxed">
              Your cryptographic access request has been sent to the lab Principal Investigator and logged in the institutional audit ledger. You will receive an email confirmation once reviewed.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full pt-6 border-t border-[#E4DCCB] text-center text-xs font-mono text-[#62685E]">
        Cambium Research Compliance OS · Standard ISO/IEC 27001 & HIPAA Multi-Tenant Isolation
      </footer>
    </div>
  );
}
