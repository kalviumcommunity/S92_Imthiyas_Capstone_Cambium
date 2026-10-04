"use client";

import React from "react";
import Link from "next/link";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Icon */}
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 rounded-full bg-moss-600 flex items-center justify-center relative z-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L4 7V12C4 16.42 7.56 20.55 12 21.93C16.44 20.55 20 16.42 20 12V7L12 3Z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 12L11 14L15 10"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* success pulse ring */}
        <div className="absolute inset-0 rounded-full bg-moss-600 opacity-20 animate-ping" />
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-[28px] font-semibold text-ink-primary leading-tight">
          Password reset complete
        </h2>
        <p className="text-sm text-ink-secondary leading-relaxed">
          Your research identity is secure. You can now sign in with your new password.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/sign-in"
          className="flex items-center justify-center w-full rounded-md bg-moss-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-moss-500 active:scale-[0.99] border border-moss-600 no-underline"
        >
          Return to sign in
        </Link>

        <div className="flex items-center gap-2 text-xs text-ink-secondary justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#66716C" strokeWidth="1" />
            <path d="M4 6L5.5 7.5L8 4.5" stroke="#66716C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Session secured · All other sessions signed out
        </div>
      </div>
    </div>
  );
}
