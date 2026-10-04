"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, KeyRound, ArrowRight, LogOut, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface SessionLockModalProps {
  isOpen: boolean;
  onUnlock: () => void;
  userName?: string;
  userEmail?: string;
  institution?: string;
}

export function SessionLockModal({
  isOpen,
  onUnlock,
  userName = "Dr. Alex Rivera",
  userEmail = "a.rivera@stanford.edu",
  institution = "Stanford University · School of Medicine",
}: SessionLockModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(true);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onUnlock();
      toast({
        title: "Session Resumed",
        description: "Workplace state and active notebooks restored.",
        variant: "success",
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141A14]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-[#FAF7F0] border border-[#E4DCCB] rounded-2xl shadow-2xl overflow-hidden font-sans">
        {/* Top security header badge */}
        <div className="px-6 pt-7 pb-4 text-center border-b border-[#E4DCCB]/60 bg-[#F2EBDD]/40">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#DCE6D7] text-[#3E6248] mb-3 shadow-inner">
            <Lock className="w-5 h-5" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3E6248]/10 text-[#3E6248] text-[11px] font-mono font-medium mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            ENTERPRISE AIR-GAP LOCK
          </div>
          <h2 className="font-serif text-[22px] font-semibold text-[#202920] tracking-tight m-0">
            Research Session Suspended
          </h2>
          <p className="text-[12.5px] text-[#62685E] mt-1 m-0">
            Unsaved drafts, open datasets, and vector hypotheses remain encrypted in memory.
          </p>
        </div>

        {/* User Identity Card */}
        <div className="p-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E4DCCB] mb-5">
            <div className="w-10 h-10 rounded-full bg-[#3E6248] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
              {userName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-[#202920] truncate">{userName}</div>
              <div className="text-[11.5px] text-[#62685E] truncate">{userEmail}</div>
              <div className="text-[10.5px] text-[#3E6248] font-mono truncate">{institution}</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#3E6248] shrink-0" />
          </div>

          {/* Unlock Form */}
          <form onSubmit={handleUnlock} className="flex flex-col gap-3">
            <div>
              <label className="block text-[11.5px] font-medium text-[#202920] mb-1.5">
                Institutional Credentials or Master Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter password to unlock"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-[13px] text-[#202920] placeholder-[#85877B] outline-none transition-colors ${
                    error ? "border-[#B33D35] bg-[#FBF1F0]" : "border-[#E4DCCB] focus:border-[#3E6248]"
                  }`}
                />
                <KeyRound className="w-4 h-4 text-[#85877B] absolute right-3 top-3 pointer-events-none" />
              </div>
              {error && (
                <p className="text-[11px] text-[#B33D35] mt-1 m-0">
                  Please enter your password to resume this workspace.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#3E6248] hover:bg-[#293E30] text-white font-medium text-[13px] rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span>{isVerifying ? "Verifying Token…" : "Resume Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Sign Out or SSO switch */}
          <div className="mt-5 pt-4 border-t border-[#E4DCCB]/60 flex items-center justify-between text-[11.5px]">
            <span className="text-[#85877B]">Not {userName}?</span>
            <button
              onClick={() => {
                window.location.href = "/sign-in";
              }}
              className="inline-flex items-center gap-1 text-[#62685E] hover:text-[#B33D35] transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch Account / Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
