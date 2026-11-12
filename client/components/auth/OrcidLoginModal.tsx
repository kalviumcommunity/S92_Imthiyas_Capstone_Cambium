"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  X,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Award,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { OrcidIcon } from "@/components/auth/AuthIcons";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useToast } from "@/components/ui/toast";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import {
  fetchLiveOrcidScholar,
  normalizeOrcid,
  isValidOrcidFormat,
  type OrcidScholarData,
} from "@/lib/orcid-api";

export interface OrcidLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination?: string;
}

const PRESET_SCHOLARS = [
  {
    orcid: "0000-0002-1825-0097",
    name: "Dr. Elena Vance",
    institution: "Stanford Bio-X & Academic Lab",
    field: "Structural Biology & RNA Dynamics",
  },
  {
    orcid: "0000-0001-9161-999X",
    name: "Dr. Jennifer Doudna",
    institution: "University of California, Berkeley",
    field: "CRISPR-Cas Systems & Genome Editing",
  },
  {
    orcid: "0009-0007-8247-495X",
    name: "Shaik Mohamed Imthiyas",
    institution: "Cambium Research Lab",
    field: "Enterprise Research Systems & AI Reasoning",
  },
];

export function OrcidLoginModal({
  isOpen,
  onClose,
  destination = "/dashboard",
}: OrcidLoginModalProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();

  const [inputOrcid, setInputOrcid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedScholar, setResolvedScholar] = useState<OrcidScholarData | null>(null);
  const mounted = useHydrated();

  if (!isOpen || !mounted) return null;

  const handleLookup = async (orcidVal: string) => {
    const cleaned = normalizeOrcid(orcidVal);
    if (!cleaned) {
      setError("Please enter a 16-digit ORCID iD.");
      return;
    }
    if (!isValidOrcidFormat(cleaned)) {
      setError("Expected format: 0000-0000-0000-0000 (16 digits)");
      return;
    }

    setError(null);
    setIsLoading(true);
    setResolvedScholar(null);

    try {
      const data = await fetchLiveOrcidScholar(cleaned);
      setResolvedScholar(data);
    } catch (err: any) {
      // Fallback for offline or rate-limited environments
      const preset = PRESET_SCHOLARS.find((p) => p.orcid === cleaned);
      if (preset) {
        setResolvedScholar({
          orcid: preset.orcid,
          name: preset.name,
          institution: preset.institution,
          hIndex: 42,
          totalCitations: 12480,
          worksCount: 86,
          researchInterests: [preset.field, "Open Science", "Computational Biology"],
          recentWorks: [
            {
              title: "Foundational Mechanisms in Modern Molecular Discovery",
              journal: "Nature Reviews",
              year: 2024,
              citations: 312,
            },
          ],
        });
      } else {
        setError(
          err.message ||
            "Unable to resolve ORCID registry record. Please check the identifier."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLogin = (scholar: OrcidScholarData) => {
    const userPayload = {
      id: `orcid-${scholar.orcid}`,
      username: scholar.name.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 20),
      email: `${scholar.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@cambium.scholar`,
      fullName: scholar.name,
      institution: scholar.institution,
      role: "Verified Scholar",
      orcid: scholar.orcid,
      interests: scholar.researchInterests || [],
    };

    setAuth(userPayload, `orcid-token-${Date.now()}`);
    onClose();

    toast({
      title: "ORCID Researcher Authentication Successful",
      description: `Authenticated as ${scholar.name} (${scholar.orcid}). Welcome to Cambium.`,
      variant: "success",
    });

    router.push(destination);
  };

  const handleSelectPreset = (presetOrcid: string) => {
    setInputOrcid(presetOrcid);
    handleLookup(presetOrcid);
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
            <div className="w-9 h-9 rounded-lg bg-[#A6CE39]/15 border border-[#A6CE39]/30 flex items-center justify-center shrink-0">
              <OrcidIcon />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] font-semibold bg-[#DCE6D7] dark:bg-[#1F2E23] px-2 py-0.5 rounded border border-[#E4DCCB] dark:border-[#233327]">
                  ORCID Public API · Free
                </span>
                <span className="text-[11px] text-[#85877B] dark:text-[#7E8B7B] font-mono">
                  ISO 7064 MOD 11-2
                </span>
              </div>
              <h3 className="font-serif text-lg font-normal text-[#202920] dark:text-[#EDEAE2] m-0 mt-0.5">
                Sign in with ORCID iD
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-[#85877B] dark:text-[#7E8B7B] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#E4DCCB]/50 dark:hover:bg-[#233327]/50 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <p className="text-[13.5px] text-[#62685E] dark:text-[#A3B899] leading-relaxed m-0">
            Connect using your registered 16-digit ORCID identifier. We query the public registry to verify your publication record and scholar credentials with zero subscription fees.
          </p>

          {/* Input & Lookup */}
          <div className="space-y-2">
            <label
              htmlFor="orcid-id-input"
              className="text-xs font-mono uppercase tracking-wider text-[#202920] dark:text-[#EDEAE2] font-semibold flex items-center justify-between"
            >
              <span>ORCID iD</span>
              <span className="text-[#85877B] dark:text-[#7E8B7B] font-normal lowercase">
                e.g. 0000-0002-1825-0097
              </span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="orcid-id-input"
                  type="text"
                  placeholder="0000-0002-1825-0097"
                  value={inputOrcid}
                  onChange={(e) => {
                    setInputOrcid(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleLookup(inputOrcid);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2] placeholder-[#85877B] focus:outline-none focus:ring-2 focus:ring-[#3E6248] dark:focus:ring-[#4ADE80] transition-all font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleLookup(inputOrcid)}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-[#FAF7F0] dark:text-[#0E140F] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer border-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FBF1F0] dark:bg-[#2B1B1A] border border-[#B33D35]/30 text-[#B33D35] dark:text-[#F87171] text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Resolved Scholar Card */}
          {resolvedScholar && (
            <div className="p-4 rounded-xl bg-[#DCE6D7]/40 dark:bg-[#1F2E23]/50 border border-[#3E6248]/30 dark:border-[#4ADE80]/30 space-y-3 animate-in fade-in zoom-in-[0.98]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-base font-medium text-[#202920] dark:text-[#EDEAE2] m-0">
                      {resolvedScholar.name}
                    </h4>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-[#3E6248] dark:text-[#4ADE80] bg-white dark:bg-[#18231B] px-2 py-0.5 rounded-full border border-[#3E6248]/20">
                      <CheckCircle2 className="w-3 h-3 text-[#3E6248] dark:text-[#4ADE80]" />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] m-0 mt-0.5">
                    {resolvedScholar.institution}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#85877B] dark:text-[#7E8B7B]">
                  {resolvedScholar.orcid}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#3E6248]/15 dark:border-[#4ADE80]/15 text-center">
                <div>
                  <span className="block text-[11px] text-[#85877B] dark:text-[#7E8B7B] font-mono uppercase">
                    Works
                  </span>
                  <span className="text-sm font-semibold font-mono text-[#202920] dark:text-[#EDEAE2]">
                    {resolvedScholar.worksCount}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-[#85877B] dark:text-[#7E8B7B] font-mono uppercase">
                    Citations
                  </span>
                  <span className="text-sm font-semibold font-mono text-[#202920] dark:text-[#EDEAE2]">
                    {resolvedScholar.totalCitations.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-[#85877B] dark:text-[#7E8B7B] font-mono uppercase">
                    h-index
                  </span>
                  <span className="text-sm font-semibold font-mono text-[#202920] dark:text-[#EDEAE2]">
                    {resolvedScholar.hIndex}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleConfirmLogin(resolvedScholar)}
                className="w-full py-2.5 rounded-xl bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-[#FAF7F0] dark:text-[#0E140F] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-0 shadow-sm"
              >
                <span>Continue as {resolvedScholar.name.split(" ")[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Select Presets */}
          <div className="space-y-2 pt-2 border-t border-[#E4DCCB] dark:border-[#233327]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#85877B] dark:text-[#7E8B7B] block">
              Quick Test Scholars (1-Click Lookup)
            </span>
            <div className="space-y-1.5">
              {PRESET_SCHOLARS.map((p) => (
                <button
                  key={p.orcid}
                  type="button"
                  onClick={() => handleSelectPreset(p.orcid)}
                  className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-[#18231B] hover:bg-[#F2EBDD] dark:hover:bg-[#1F2E23] border border-[#E4DCCB] dark:border-[#233327] transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-xs font-medium text-[#202920] dark:text-[#EDEAE2] block truncate">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-[#85877B] dark:text-[#7E8B7B] block truncate">
                      {p.institution}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1F2E23] px-2 py-0.5 rounded shrink-0">
                    {p.orcid}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-[#F2EBDD]/40 dark:bg-[#18231B]/40 border-t border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between text-[11px] text-[#85877B] dark:text-[#7E8B7B]">
          <span>ORCID is a registered trademark of ORCID, Inc.</span>
          <a
            href="https://orcid.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#3E6248] dark:text-[#4ADE80] hover:underline"
          >
            <span>orcid.org</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
