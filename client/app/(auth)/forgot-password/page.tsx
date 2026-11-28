"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [screen, setScreen] = useState<"forgot" | "check">("forgot");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen("check");
  };

  if (screen === "check") {
    return (
      <div className="w-full min-h-[440px] flex flex-col justify-center space-y-6 animate-in fade-in duration-200 font-sans">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#FEF3C7]/70 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#8A5A12]">
            Controlled Pilot Support
          </div>
          <h2 className="font-serif text-[28px] font-normal text-[#202920] leading-tight">
            Coordinator-assisted password reset
          </h2>
          <p className="text-sm text-[#62685E] leading-relaxed">
            Self-service automated email password reset is not enabled during the controlled mentor pilot. To reset credentials for{" "}
            <span className="font-medium text-[#202920]">{email || "your account"}</span>, contact the Pilot Coordinator or sign in with Google / ORCID.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={`mailto:pilot-support@cambium.research?subject=Cambium%20Pilot%20Password%20Reset&body=Please%20reset%20pilot%20access%20for:%20${encodeURIComponent(email || "")}`}
            className="w-full inline-flex items-center justify-center rounded-lg border border-[#E4DCCB] bg-white px-4 py-2.5 text-sm font-semibold text-[#202920] transition-all hover:bg-[#F2EBDD] no-underline"
          >
            Request reset from Pilot Coordinator
          </a>
          <Link
            href="/sign-in"
            className="w-full inline-flex items-center justify-center rounded-lg border border-[#3E6248]/30 bg-[#DCE6D7]/50 px-4 py-2.5 text-sm font-medium text-[#202920] hover:bg-[#DCE6D7] no-underline"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[440px] flex flex-col justify-center space-y-7 animate-in fade-in duration-200 font-sans">
      <div className="space-y-2">

        <h2 className="font-serif text-[30px] font-normal text-[#202920] leading-tight">
          Reset your password
        </h2>
        <p className="text-sm text-[#62685E] font-sans leading-relaxed">
          Enter your academic email to receive a secure password recovery link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-[#202920]">
            Academic Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            className="auth-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="auth-submit-btn"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending…
            </span>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <Link
        href="/sign-in"
        className="inline-flex items-center gap-1.5 text-sm text-[#3E6248] hover:text-[#293E30] transition-colors no-underline font-medium"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to sign in
      </Link>
    </div>
  );
}
