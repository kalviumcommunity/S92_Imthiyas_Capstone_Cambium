"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      {/* Icon */}
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 rounded-full bg-[#DCE6D7] border border-[#66866A]/40 flex items-center justify-center relative z-10 shadow-xs">
          <ShieldCheck className="w-7 h-7 text-[#3E6248]" />
        </div>
        {/* success pulse ring */}
        <div className="absolute inset-0 rounded-full bg-[#66866A] opacity-20 animate-ping" />
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-[28px] font-normal text-[#202920] leading-tight m-0">
          Password reset complete
        </h2>
        <p className="text-sm font-serif text-[#62685E] leading-relaxed m-0">
          Your scholarly identity is secure. You can now sign in with your updated credentials.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/sign-in"
          className="flex items-center justify-center w-full rounded-lg bg-[#3E6248] hover:bg-[#293E30] px-4 py-2.5 text-sm font-semibold text-[#FAF7F0] transition-all active:scale-[0.99] border border-[#66866A]/30 shadow-xs no-underline"
        >
          Return to sign in
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-[#85877B] justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3E6248]" />
          <span>Session secured · All existing tokens revoked</span>
        </div>
      </div>
    </div>
  );
}
