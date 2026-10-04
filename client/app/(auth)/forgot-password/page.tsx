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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen("check");
    }, 900);
  };

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  if (screen === "check") {
    return (
      <div className="w-full space-y-8 animate-fade-in">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-[#DCE6D7] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
              stroke="#3E6248"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-[28px] font-normal text-[#202920] leading-tight">
            Check your inbox
          </h2>
          <p className="text-sm text-[#62685E] font-sans leading-relaxed">
            We sent a secure link to your email. Click the link to securely reset your credentials.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.open("mailto:", "_blank")}
            className="w-full rounded-lg border border-[#E4DCCB] bg-white px-4 py-2.5 text-sm font-semibold text-[#202920] transition-all hover:bg-[#F2EBDD] active:scale-[0.99]"
          >
            Open email app
          </button>

          <div className="text-center">
            {resent ? (
              <span className="text-sm text-[#3E6248] font-medium font-sans">Reset link sent!</span>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-[#62685E] hover:text-[#202920] font-sans transition-colors underline underline-offset-2 decoration-[#E4DCCB]"
              >
                Didn't receive it? Click to resend.
              </button>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-[#E4DCCB] bg-[#F2EBDD]/50 px-4 py-3">
          <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#62685E" strokeWidth="1.2" />
            <path d="M7 6.5V9.5M7 4.5V5" stroke="#62685E" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-[#62685E] font-sans leading-relaxed">
            The link expires in 30 minutes. Check your spam folder if it doesn't arrive within a few minutes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7 animate-fade-in font-sans">
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
