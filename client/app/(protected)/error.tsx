"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, Layers } from "lucide-react";

export default function ProtectedRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Cambium Protected Route Exception]", error);
  }, [error]);

  return (
    <div className="flex-1 min-w-0 h-full flex items-center justify-center p-6 bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] font-sans">
      <div className="max-w-lg w-full bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#DCE6D7] dark:bg-[#1E2B21] border border-[#66866A]/30 flex items-center justify-center text-[#3E6248] dark:text-[#4ADE80]">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] dark:bg-[#1E2B21] border border-[#E4DCCB] dark:border-[#28382C] text-[11px] font-mono uppercase tracking-wider text-[#85877B] dark:text-[#A3B899]">
            <span>Workspace Resilience Guard</span>
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2]">
            Component Session Interrupted
          </h2>
          <p className="text-xs text-[#62685E] dark:text-[#8FA89B] leading-relaxed max-w-sm mx-auto">
            This workspace view encountered a temporary rendering fault. Your underlying research artifacts, drafts, and knowledge constellations are preserved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer border-0"
          >
            <RefreshCw size={14} />
            <span>Retry View</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#E4DCCB] dark:border-[#28382C] bg-[#FAF7F0] dark:bg-[#1E2B21] hover:bg-white text-xs font-mono font-medium text-[#202920] dark:text-[#EDEAE2] flex items-center justify-center gap-2 transition-all no-underline shadow-2xs"
          >
            <Home size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/workspace"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#E4DCCB] dark:border-[#28382C] bg-transparent hover:bg-[#FAF7F0] text-xs font-mono font-medium text-[#62685E] dark:text-[#A3B899] flex items-center justify-center gap-2 transition-all no-underline"
          >
            <Layers size={14} />
            <span>Workspace</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-[#E4DCCB]/60 dark:border-[#28382C] font-mono text-[10px] text-[#85877B] dark:text-[#6E7D72]">
          SESSION INTEGRITY: PRESERVED · ZERO RESEARCH LOSS
        </div>
      </div>
    </div>
  );
}

