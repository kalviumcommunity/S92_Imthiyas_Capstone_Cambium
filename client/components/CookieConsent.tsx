"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cambium-cookie-consent");
      if (!consent) {
        // Small delay so it smoothly slides in after initial paint
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const handleConsent = (level: "all" | "essential") => {
    try {
      localStorage.setItem(
        "cambium-cookie-consent",
        JSON.stringify({ level, timestamp: new Date().toISOString() })
      );
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Privacy and Cookie Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 print:hidden"
    >
      <div className="bg-[#FAF7F0] dark:bg-[#18241B] border border-[#E4DCCB] dark:border-[#28382C] rounded-2xl p-5 shadow-xl text-[#202920] dark:text-[#EDEAE2]">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#DCE6D7] dark:bg-[#233527] text-[#3E6248] dark:text-[#4ADE80] shrink-0 mt-0.5">
            <ShieldCheck size={18} />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className="font-serif text-[15px] font-semibold text-[#202920] dark:text-[#EDEAE2] m-0">
              Privacy & Open Scholarship
            </h3>
            <p className="text-xs text-[#62685E] dark:text-[#9DA39A] leading-relaxed m-0 font-sans">
              Cambium uses functional cookies and privacy-preserving telemetry to support authenticated workspace sessions and real-time citation synchronization. Zero commercial ad trackers.
            </p>
            <div className="pt-0.5">
              <Link
                href="/privacy"
                className="text-[11px] font-mono text-[#3E6248] dark:text-[#4ADE80] hover:underline"
              >
                Read Privacy & Data Governance Policy →
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            className="text-[#85877B] hover:text-[#202920] dark:hover:text-[#EDEAE2] p-1 rounded-lg transition-colors cursor-pointer border-0 bg-transparent shrink-0"
            aria-label="Close cookie banner"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E4DCCB]/60 dark:border-[#28382C]/60 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-[#62685E] dark:text-[#9DA39A] hover:text-[#202920] dark:hover:text-white hover:bg-[#F2EBDD] dark:hover:bg-[#202E24] transition-colors cursor-pointer border-0 bg-transparent"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => handleConsent("all")}
            className="px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold bg-[#3E6248] hover:bg-[#2E4B36] dark:bg-[#4ADE80] dark:hover:bg-[#38C86E] text-white dark:text-[#121B13] transition-colors cursor-pointer border-0 shadow-xs"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
