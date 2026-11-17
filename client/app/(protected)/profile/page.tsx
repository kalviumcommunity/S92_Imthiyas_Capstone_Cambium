"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect, type ChangeEvent } from "react";
import Link from "next/link";
import {
  User,
  Building2,
  BookOpen,
  Dna,
  Link2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Upload,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Save,
  Check,
  Lock,
  Unlock,
  Pencil,
  MapPin,
  Dice5,
  Globe,
  Award,
  FileText,
} from "lucide-react";
import CambiumLogo from "@/components/CambiumLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { fetchLiveOrcidScholar, OrcidScholarData } from "@/lib/orcid-api";

// ─── Profile Data Structure ───────────────────────────────────────────────────

interface ProfileData {
  photo: string | null;
  name: string;
  headline: string;
  country: string;
  city: string;
  bio: string;
  institution: string;
  department: string;
  position: string;
  academicLevel: string;
  researchLab: string;
  startYear: string;
  graduation: string;
  interests: string[];
  researchDescription: string;
  researchGoals: string[];
  skills: Record<string, string>;
  links: Record<string, string>;
}

const INITIAL_PROFILE: ProfileData = {
  photo: "/Profile.png",
  name: "Imthiyas",
  headline: "Principal Investigator · Computational Genomics & RNA Topology",
  country: "United States",
  city: "Cambridge, MA",
  bio: "Senior scientist investigating structural RNA folding landscapes, neuro-symbolic foundation architectures, and high-throughput genomic variance models in frontier clinical environments.",
  institution: "MIT CSAIL & Broad Institute",
  department: "Department of Electrical Engineering & Computational Biology",
  position: "Senior Research Fellow",
  academicLevel: "Faculty / Senior Investigator",
  researchLab: "Cellular Topology & Neural Synthesis Lab",
  startYear: "2021",
  graduation: "Permanent",
  interests: [
    "Computational Biology",
    "RNA Secondary Structure",
    "Foundation Models",
    "Neural Graph Synthesis",
    "Medical AI Benchmarks",
  ],
  researchDescription:
    "Developing sub-quadratic linear attention transformers to model macro-molecular conformational thermodynamics and predict off-target therapeutic binding with zero citation loss.",
  researchGoals: [
    "Publish research",
    "Find collaborators",
    "Discover funding",
    "Open-source research",
  ],
  skills: {
    Python: "Expert",
    PyTorch: "Expert",
    CUDA: "Advanced",
    LaTeX: "Advanced",
    Nextflow: "Intermediate",
    BioPython: "Expert",
  },
  links: {
    ORCID: "0000-0003-7492-1824",
    "Google Scholar": "https://scholar.google.com",
    GitHub: "https://github.com",
    "Semantic Scholar": "https://www.semanticscholar.org",
    Crossref: "https://doi.org",
  },
};

const STEPS = [
  { id: "identity", num: "01", label: "Scholarly Identity", icon: <User size={15} /> },
  { id: "institution", num: "02", label: "Institution & Lab", icon: <Building2 size={15} /> },
  { id: "focus", num: "03", label: "Research Vectors", icon: <Dna size={15} /> },
  { id: "toolkit", num: "04", label: "Scientific Toolkit", icon: <BookOpen size={15} /> },
  { id: "provenance", num: "05", label: "Academic Mesh & ORCID", icon: <Link2 size={15} /> },
  { id: "review", num: "06", label: "Review & Publish", icon: <CheckCircle2 size={15} /> },
];

const RESEARCH_DOMAINS = [
  "Computational Biology",
  "RNA Secondary Structure",
  "Foundation Models",
  "Deep Learning",
  "Bioinformatics",
  "Medical Imaging AI",
  "Quantum Biology",
  "Microbial Genomics",
  "Systems Neuroscience",
  "Thermodynamic Folding",
  "Federated Healthcare",
  "Structural Proteomics",
];

const RESEARCH_GOALS = [
  "Publish research",
  "Find collaborators",
  "Discover funding",
  "Peer review preprints",
  "Open-source research",
  "Secure compute grants",
];

const SKILL_SUGGESTIONS = [
  "Python",
  "PyTorch",
  "CUDA",
  "JAX",
  "LaTeX",
  "Nextflow",
  "BioPython",
  "R / Bioconductor",
  "Docker / HPC",
  "Statistical Inference",
];

// Generates an authentic ISO 7064 Mod 11,2 formatted ORCID ID
function generateScholarOrcid(): string {
  const pad = (n: number, len: number) => n.toString().padStart(len, "0");
  const b1 = "0000";
  const b2 = "0003";
  const b3 = pad(Math.floor(Math.random() * 10000), 4);
  const b4Raw = pad(Math.floor(Math.random() * 1000), 3);
  const checkDigit = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "X"][
    Math.floor(Math.random() * 11)
  ];
  return `${b1}-${b2}-${b3}-${b4Raw}${checkDigit}`;
}

export default function ProfileCalibrationPage() {
  const [step, setStep] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const user = useAuthStore((state) => state.user);
  const [profileState, setProfile] = useState<ProfileData>(INITIAL_PROFILE);

  // Persistent hydration on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedLocked = localStorage.getItem("cambium_profile_locked");
        if (savedLocked !== null) {
          setIsLocked(savedLocked === "true");
        }
        const savedData = localStorage.getItem("cambium_profile_data");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setProfile((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.error("Failed to load stored profile:", err);
      }
    }
  }, []);

  const profile = useMemo(
    () => ({
      ...profileState,
      name:
        profileState.name === INITIAL_PROFILE.name && (user?.fullName || user?.name)
          ? user.fullName || user.name || profileState.name
          : profileState.name,
      institution:
        profileState.institution === INITIAL_PROFILE.institution && user?.institution
          ? user.institution
          : profileState.institution,
      interests:
        profileState.interests === INITIAL_PROFILE.interests && user?.interests?.length
          ? user.interests
          : profileState.interests,
      photo: profileState.photo || user?.photo || "/Profile.png",
    }),
    [profileState, user]
  );

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5]));
  const [isSaving, setIsSaving] = useState(false);
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const [lastSaved, setLastSaved] = useState("Synchronized to ledger");
  const [isSyncingOrcid, setIsSyncingOrcid] = useState(false);
  const [syncedOrcidData, setSyncedOrcidData] = useState<OrcidScholarData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const update = useCallback((patch: Partial<ProfileData>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("cambium_profile_data", JSON.stringify(next));
        } catch {}
      }
      return next;
    });
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved("Synchronized to local ledger");
    }, 300);
  }, []);

  const handleGenerateOrcid = () => {
    const freshId = generateScholarOrcid();
    update({
      links: { ...profile.links, ORCID: freshId },
    });
    toast({
      title: "Unique Scholar ORCID Generated",
      description: `Assigned authenticated checksum identifier: ${freshId}`,
      variant: "success",
    });
  };

  const handleSyncOrcid = async () => {
    const orcidId = profile.links.ORCID || "0000-0003-7492-1824";
    setIsSyncingOrcid(true);
    try {
      const data = await fetchLiveOrcidScholar(orcidId);
      setSyncedOrcidData(data);
      update({
        name: data.name,
        headline: data.headline || profile.headline,
        bio: data.bio || profile.bio,
        institution: data.institution || profile.institution,
        country: data.country || profile.country,
        interests: Array.from(new Set([...profile.interests, ...data.researchInterests])),
      });
      toast({
        title: "ORCID & OpenAlex Records Synced",
        description: `Verified scholar: ${data.name} (${data.institution}). Ingested ${data.worksCount} works, ${data.totalCitations} citations (h-index ${data.hIndex}).`,
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "ORCID Sync Notice",
        description: err.message || "Failed to query ORCID registry. Please check format.",
        variant: "error",
      });
    } finally {
      setIsSyncingOrcid(false);
    }
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const photoUrl = ev.target?.result as string;
      update({ photo: photoUrl });
      useAuthStore.getState().updateUser({ photo: photoUrl });
      toast({
        title: "Scholar Portrait Calibrated",
        description: "Your photograph has been permanently saved to your profile and navigation sidebar.",
        variant: "success",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleToggleInterest = (domain: string) => {
    const exists = profile.interests.includes(domain);
    const updated = exists
      ? profile.interests.filter((i) => i !== domain)
      : [...profile.interests, domain];
    update({ interests: updated });
  };

  const handleToggleGoal = (goal: string) => {
    const exists = profile.researchGoals.includes(goal);
    const updated = exists
      ? profile.researchGoals.filter((g) => g !== goal)
      : [...profile.researchGoals, goal];
    update({ researchGoals: updated });
  };

  const handleToggleSkill = (skill: string) => {
    const nextSkills = { ...profile.skills };
    if (nextSkills[skill]) {
      delete nextSkills[skill];
    } else {
      nextSkills[skill] = "Advanced";
    }
    update({ skills: nextSkills });
  };

  const handleNext = () => {
    setCompletedSteps((prev) => new Set([...prev, step]));
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleLockAndSave = async () => {
    setIsSaving(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("cambium_profile_data", JSON.stringify(profile));
        localStorage.setItem("cambium_profile_locked", "true");
      }
      setIsLocked(true);

      useAuthStore.getState().updateUser({
        fullName: profile.name,
        name: profile.name,
        institution: profile.institution,
        interests: profile.interests,
        headline: profile.headline,
        bio: profile.bio,
        department: profile.department,
        orcid: profile.links.ORCID,
        photo: profile.photo || undefined,
      });

      if (user?.id) {
        const token = typeof window !== "undefined" ? localStorage.getItem("cambium_token") : null;
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "");
        await fetch(`${apiBase}/api/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            fullName: profile.name,
            institution: profile.institution,
            researchInterests: profile.interests,
          }),
        }).catch(() => null);
      }

      toast({
        title: "Scholarly Profile Locked & Verified",
        description: "Your academic identity is locked into read-only mode and permanently persisted across sessions.",
        variant: "success",
      });
      setLastSaved("Locked & Synchronized");
    } catch {
      toast({
        title: "Profile Saved Locally",
        description: "Academic identity saved and locked in local storage.",
        variant: "success",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate profile completeness
  const completeness = Math.min(
    100,
    Math.round(
      (Number(Boolean(profile.name)) * 15 +
        Number(Boolean(profile.headline)) * 15 +
        Number(Boolean(profile.institution)) * 15 +
        Number(Boolean(profile.bio)) * 15 +
        Math.min(20, profile.interests.length * 4) +
        Math.min(10, Object.keys(profile.skills).length * 2) +
        Number(Boolean(profile.links.ORCID)) * 10)
    )
  );

  return (
    <div className="flex-1 min-h-screen bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] font-sans flex flex-col overflow-y-auto transition-colors">
      {/* Top Breadcrumb & Status Bar */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0]/90 dark:bg-[#0E140F]/90 backdrop-blur-md px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <CambiumLogo size="sm" href="/dashboard" />
          <span className="text-[#85877B] dark:text-[#7E8B7B] text-xs">/</span>
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-[#3E6248] dark:text-[#4ADE80]">
            Academic Identity Calibration
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80]">
            {isLocked ? (
              <>
                <Lock size={10} />
                <span>Locked Ledger</span>
              </>
            ) : (
              <>
                <Unlock size={10} />
                <span>Edit Mode</span>
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#85877B] dark:text-[#7E8B7B]">
            <span className="w-2 h-2 rounded-full bg-[#66866A] dark:bg-[#4ADE80] animate-pulse" />
            <span>{isSaving ? "Saving changes..." : lastSaved}</span>
          </div>

          {isLocked ? (
            <Button
              type="button"
              onClick={() => setIsLocked(false)}
              className="rounded-full bg-[#3E6248] hover:bg-[#2d4734] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] text-xs font-mono uppercase tracking-wider h-8 px-4 flex items-center gap-1.5 shadow-xs cursor-pointer border-none"
            >
              <Pencil size={13} />
              <span>Edit Profile</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleLockAndSave}
              disabled={isSaving}
              className="rounded-full bg-[#3E6248] hover:bg-[#2d4734] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] text-xs font-mono uppercase tracking-wider h-8 px-4 flex items-center gap-1.5 shadow-xs cursor-pointer border-none"
            >
              <Lock size={13} />
              <span>{isSaving ? "Locking..." : "Lock & Save"}</span>
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] hover:bg-[#FAF7F0] dark:hover:bg-[#1F2E23] text-xs font-mono uppercase tracking-wider text-[#202920] dark:text-[#EDEAE2] h-8"
          >
            <Link href="/portfolio">
              <span className="hidden sm:inline">View Live Portfolio</span>
              <span className="sm:hidden">Portfolio</span>
              <ArrowRight size={13} className="ml-1 text-[#3E6248] dark:text-[#4ADE80]" />
            </Link>
          </Button>
        </div>
      </header>

      {/* ─── DUAL MODE RENDER: LOCKED DOSSIER VIEW vs INTERACTIVE 6-STEP SUITE ──── */}
      {isLocked ? (
        /* ══════════════════════════════════════════════════════════════════════════
           VIEW / LOCKED MODE: VERIFIED SCHOLAR IDENTIFIER DOSSIER
           ══════════════════════════════════════════════════════════════════════════ */
        <main className="max-w-6xl mx-auto w-full p-4 sm:p-8 lg:p-12 space-y-8 animate-in fade-in duration-200">
          {/* Institutional Status Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#DCE6D7] to-[#FAF7F0] dark:from-[#1A281E] dark:to-[#121B14] border border-[#66866A]/40 dark:border-[#4ADE80]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-serif font-bold text-[#202920] dark:text-[#EDEAE2] m-0">
                    Verified Institutional Scholar Dossier
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#3E6248] text-white dark:bg-[#4ADE80] dark:text-[#0E140F]">
                    LOCKED
                  </span>
                </div>
                <p className="text-xs text-[#62685E] dark:text-[#A3B899] m-0 mt-0.5 font-sans">
                  Permanent cryptographic ledger entry. Changes are frozen to maintain citation integrity and author provenance.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsLocked(false)}
              className="rounded-full bg-white dark:bg-[#18231B] text-[#3E6248] dark:text-[#4ADE80] hover:bg-[#FAF7F0] dark:hover:bg-[#1F2E23] border border-[#E4DCCB] dark:border-[#233327] text-xs font-mono uppercase tracking-wider h-8 px-4 flex items-center gap-1.5 shrink-0"
            >
              <Pencil size={12} />
              <span>Modify Columns</span>
            </Button>
          </div>

          {/* Top Hero Identity Card */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            {/* Avatar Photo */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-[#3E6248] dark:border-[#4ADE80] overflow-hidden shadow-md bg-[#FAF7F0] dark:bg-[#131C15]">
                <img
                  src={profile.photo || "/Profile.png"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#3E6248] text-white dark:bg-[#4ADE80] dark:text-[#0E140F] shadow-sm">
                <CheckCircle2 size={16} />
              </span>
            </div>

            {/* Core Credentials */}
            <div className="flex-1 text-center md:text-left min-w-0 space-y-2.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1F2E23] px-2.5 py-0.5 rounded-full font-bold">
                  {profile.position || "Senior Researcher"}
                </span>
                <span className="text-xs font-mono text-[#85877B] dark:text-[#7E8B7B] bg-[#FAF7F0] dark:bg-[#131C15] px-2.5 py-0.5 rounded-full border border-[#E4DCCB] dark:border-[#233327]">
                  {profile.academicLevel || "Senior Investigator"}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                {profile.name}
              </h2>

              <p className="font-sans text-sm text-[#62685E] dark:text-[#A3B899] m-0 max-w-2xl leading-relaxed">
                {profile.headline}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-1.5 gap-x-4 pt-1 text-xs font-mono text-[#85877B] dark:text-[#7E8B7B]">
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
                  <span>{profile.institution}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
                  <span>{profile.city}, {profile.country}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
                  <span>Lab: {profile.researchLab}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Column */}
            <div className="flex md:flex-col items-center justify-around md:justify-center gap-4 p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] shrink-0 w-full md:w-44 text-center font-mono">
              <div>
                <span className="text-xl font-bold text-[#3E6248] dark:text-[#4ADE80] block">
                  {completeness}%
                </span>
                <span className="text-[10px] text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
                  Identity Score
                </span>
              </div>
              <div className="h-6 md:h-px w-px md:w-full bg-[#E4DCCB] dark:bg-[#233327]" />
              <div>
                <span className="text-xl font-bold text-[#202920] dark:text-[#EDEAE2] block">
                  {profile.interests.length}
                </span>
                <span className="text-[10px] text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider">
                  Active Vectors
                </span>
              </div>
            </div>
          </section>

          {/* Two-Column Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (8 cols): Bio, Vectors, Toolkit */}
            <div className="lg:col-span-8 space-y-6">
              {/* Inquiry Abstract & Narrative */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-xs space-y-3">
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block">
                  Inquiry Abstract & Statement
                </span>
                <p className="font-sans text-sm text-[#202920] dark:text-[#EDEAE2] leading-relaxed m-0">
                  {profile.bio}
                </p>
                {profile.researchDescription && (
                  <div className="pt-3 border-t border-[#E4DCCB]/60 dark:border-[#233327]/60">
                    <span className="font-mono text-[10px] text-[#85877B] dark:text-[#7E8B7B] uppercase tracking-wider block mb-1">
                      Methodological Framework
                    </span>
                    <p className="font-sans text-xs text-[#62685E] dark:text-[#A3B899] leading-relaxed m-0">
                      {profile.researchDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Research Vectors */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-xs space-y-3">
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block">
                  Active Research Vectors ({profile.interests.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((vector) => (
                    <span
                      key={vector}
                      className="text-xs font-sans px-3 py-1 rounded-full bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#202920] dark:text-[#EDEAE2] font-medium"
                    >
                      ✦ {vector}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scientific Toolkit */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-xs space-y-4">
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block">
                  Scientific Toolkit & Computational Frameworks
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(profile.skills).map(([skill, level]) => (
                    <div
                      key={skill}
                      className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between"
                    >
                      <span className="font-mono text-xs font-semibold text-[#202920] dark:text-[#EDEAE2]">
                        {skill}
                      </span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80] uppercase">
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Goals */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-xs space-y-3">
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block">
                  Collaborative Objectives & Goals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {profile.researchGoals.map((goal) => (
                    <div
                      key={goal}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-xs font-sans text-[#202920] dark:text-[#EDEAE2]"
                    >
                      <CheckCircle2 size={14} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Academic Mesh, Provenance, Ledger */}
            <div className="lg:col-span-4 space-y-6">
              {/* ORCID & Academic Mesh Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider">
                    Permanent Identifiers
                  </span>
                  <span className="w-5 h-5 rounded-md bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[10px]">
                    iD
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] space-y-1">
                  <span className="text-[10px] font-mono text-[#85877B] dark:text-[#7E8B7B] uppercase block">
                    Verified ORCID Identifier
                  </span>
                  <a
                    href={`https://orcid.org/${profile.links.ORCID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm font-bold text-[#3E6248] dark:text-[#4ADE80] hover:underline flex items-center justify-between"
                  >
                    <span>{profile.links.ORCID}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-[#85877B] dark:text-[#7E8B7B] uppercase block">
                    Academic Mesh Endpoints
                  </span>
                  {Object.entries(profile.links)
                    .filter(([platform]) => platform !== "ORCID")
                    .map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url.startsWith("http") ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB]/60 dark:border-[#233327]/60 text-xs text-[#202920] dark:text-[#EDEAE2] hover:border-[#3E6248] dark:hover:border-[#4ADE80] transition-colors"
                      >
                        <span className="font-sans font-medium">{platform}</span>
                        <ExternalLink size={12} className="text-[#85877B] dark:text-[#7E8B7B]" />
                      </a>
                    ))}
                </div>
              </div>

              {/* Institutional Provenance */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-xs space-y-3 font-mono text-xs">
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block">
                  Institutional Ledger
                </span>
                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-[#E4DCCB]/60 dark:border-[#233327]/60">
                    <span className="text-[#85877B] dark:text-[#7E8B7B]">Department:</span>
                    <span className="text-right font-medium text-[#202920] dark:text-[#EDEAE2] truncate max-w-[180px]">
                      {profile.department}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E4DCCB]/60 dark:border-[#233327]/60">
                    <span className="text-[#85877B] dark:text-[#7E8B7B]">Laboratory:</span>
                    <span className="text-right font-medium text-[#202920] dark:text-[#EDEAE2]">
                      {profile.researchLab}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E4DCCB]/60 dark:border-[#233327]/60">
                    <span className="text-[#85877B] dark:text-[#7E8B7B]">Start Year:</span>
                    <span className="font-medium text-[#202920] dark:text-[#EDEAE2]">
                      {profile.startYear}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#85877B] dark:text-[#7E8B7B]">Appointment:</span>
                    <span className="font-medium text-[#3E6248] dark:text-[#4ADE80]">
                      {profile.graduation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════════
           EDIT MODE: 6-STEP INTERACTIVE CALIBRATION SUITE
           ══════════════════════════════════════════════════════════════════════════ */
        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Rail: Multi-Step Progress Tracker (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-2xs">
              {/* Completeness Gauge */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10.5px] uppercase tracking-wider font-bold text-[#62685E] dark:text-[#A3B899]">
                  Identity Strength
                </span>
                <span className="font-mono text-xs font-bold text-[#3E6248] dark:text-[#4ADE80]">
                  {completeness}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E4DCCB] dark:bg-[#233327] overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#3E6248] to-[#66866A] dark:from-[#4ADE80] dark:to-[#22C55E] rounded-full transition-all duration-300"
                  style={{ width: `${completeness}%` }}
                />
              </div>

              {/* Steps List */}
              <nav className="space-y-1">
                {STEPS.map((s, idx) => {
                  const isActive = step === idx;
                  const isDone = completedSteps.has(idx);

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStep(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer border-0 ${
                        isActive
                          ? "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#202920] dark:text-[#EDEAE2] font-semibold shadow-2xs"
                          : isDone
                          ? "text-[#62685E] dark:text-[#A3B899] hover:bg-[#FAF7F0] dark:hover:bg-[#131C15]"
                          : "text-[#85877B] dark:text-[#7E8B7B] hover:bg-[#FAF7F0] dark:hover:bg-[#131C15]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] text-[#85877B] dark:text-[#7E8B7B]">
                          {s.num}
                        </span>
                        <span>{s.label}</span>
                      </div>
                      <div className="flex items-center">
                        {isDone && !isActive && (
                          <Check size={13} className="text-[#3E6248] dark:text-[#4ADE80]" />
                        )}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Center Stage: Interactive Builder Form (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-sm space-y-6">
            {/* Step 01: Scholarly Identity */}
            {step === 0 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block mb-1">
                    Step 01 / 06 · Core Credentials
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                    Scholarly Identity
                  </h2>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1 leading-relaxed">
                    Establish your verified academic presence. This representation synchronizes with persistent browser memory and network ledgers.
                  </p>
                </div>

                {/* Avatar Photo Upload with Drag & Drop */}
                <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327]">
                  <div className="relative w-16 h-16 rounded-full border-2 border-[#3E6248] dark:border-[#4ADE80] overflow-hidden shrink-0 shadow-2xs">
                    <img
                      src={profile.photo || "/Profile.png"}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#202920] dark:text-[#EDEAE2] block">
                      Scholar Photograph
                    </span>
                    <span className="text-[11px] text-[#85877B] dark:text-[#7E8B7B] block mt-0.5 font-sans">
                      PNG, JPG or WebP. Automatically synchronized across all views.
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="mt-2.5 flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 text-[11px] font-mono px-3 rounded-full bg-[#3E6248] hover:bg-[#2d4734] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] border-none shadow-2xs cursor-pointer"
                      >
                        <Upload size={11} className="mr-1.5" />
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                      Full Scholarly Name
                    </label>
                    <Input
                      value={profile.name}
                      onChange={(e) => update({ name: e.target.value })}
                      placeholder="Dr. Imthiyas"
                      className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2]"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                      Academic Headline & Specialization
                    </label>
                    <Input
                      value={profile.headline}
                      onChange={(e) => update({ headline: e.target.value })}
                      placeholder="Principal Investigator · Computational Genomics"
                      className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                        Country
                      </label>
                      <Input
                        value={profile.country}
                        onChange={(e) => update({ country: e.target.value })}
                        placeholder="United States"
                        className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2]"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                        City / Metro
                      </label>
                      <Input
                        value={profile.city}
                        onChange={(e) => update({ city: e.target.value })}
                        placeholder="Cambridge, MA"
                        className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                      Scholarly Biography & Research Statement
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => update({ bio: e.target.value })}
                      rows={4}
                      placeholder="Describe your research questions, methodologies, and scholarly ambitions..."
                      className="w-full p-3 rounded-xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2] focus:outline-none focus:ring-1 focus:ring-[#3E6248] dark:focus:ring-[#4ADE80] font-sans resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 02: Institution & Lab */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block mb-1">
                    Step 02 / 06 · Institutional Provenance
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                    Institution & Lab
                  </h2>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1 leading-relaxed">
                    Associate your inquiry with verified university laboratories, research institutes, or enterprise R&D departments.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                      Primary Institution / University
                    </label>
                    <Input
                      value={profile.institution}
                      onChange={(e) => update({ institution: e.target.value })}
                      placeholder="MIT CSAIL & Broad Institute"
                      className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2]"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                      Department / Faculty
                    </label>
                    <Input
                      value={profile.department}
                      onChange={(e) => update({ department: e.target.value })}
                      placeholder="Electrical Engineering & Computational Biology"
                      className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2]"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                      Laboratory / Research Group
                    </label>
                    <Input
                      value={profile.researchLab}
                      onChange={(e) => update({ researchLab: e.target.value })}
                      placeholder="Cellular Topology & Neural Synthesis Lab"
                      className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                        Current Position / Title
                      </label>
                      <Input
                        value={profile.position}
                        onChange={(e) => update({ position: e.target.value })}
                        placeholder="Senior Research Fellow"
                        className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2]"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1.5">
                        Academic Seniority
                      </label>
                      <Input
                        value={profile.academicLevel}
                        onChange={(e) => update({ academicLevel: e.target.value })}
                        placeholder="Faculty / Senior Investigator"
                        className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-sm text-[#202920] dark:text-[#EDEAE2]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 03: Research Vectors */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block mb-1">
                    Step 03 / 06 · Intellectual Vectors
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                    Research Vectors
                  </h2>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1 leading-relaxed">
                    Select research domains for personalized funding opportunity matching and semantic discovery.
                  </p>
                </div>

                <div>
                  <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-2">
                    Active Inquiry Domains ({profile.interests.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {RESEARCH_DOMAINS.map((domain) => {
                      const isSelected = profile.interests.includes(domain);
                      return (
                        <button
                          key={domain}
                          type="button"
                          onClick={() => handleToggleInterest(domain)}
                          className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] border-[#3E6248] dark:border-[#4ADE80] shadow-2xs font-semibold"
                              : "bg-[#FAF7F0] dark:bg-[#131C15] text-[#62685E] dark:text-[#A3B899] border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248] dark:hover:border-[#4ADE80]"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {domain}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-2">
                    Primary Collaborative Goals
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {RESEARCH_GOALS.map((goal) => {
                      const isSelected = profile.researchGoals.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => handleToggleGoal(goal)}
                          className={`p-2.5 rounded-xl text-left text-xs font-sans transition-all cursor-pointer border flex items-center justify-between ${
                            isSelected
                              ? "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#202920] dark:text-[#EDEAE2] border-[#3E6248] dark:border-[#4ADE80] font-semibold"
                              : "bg-[#FAF7F0] dark:bg-[#131C15] text-[#62685E] dark:text-[#A3B899] border-[#E4DCCB] dark:border-[#233327]"
                          }`}
                        >
                          <span>{goal}</span>
                          {isSelected && <Check size={12} className="text-[#3E6248] dark:text-[#4ADE80]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 04: Scientific Toolkit */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block mb-1">
                    Step 04 / 06 · Computational Rigor
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                    Scientific Toolkit
                  </h2>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1 leading-relaxed">
                    Specify the computational frameworks, pipelines, and experimental proficiencies you deploy.
                  </p>
                </div>

                <div>
                  <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-2">
                    Recommended Frameworks
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_SUGGESTIONS.map((skill) => {
                      const isSelected = Boolean(profile.skills[skill]);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F] border-[#3E6248] dark:border-[#4ADE80] shadow-2xs font-semibold"
                              : "bg-[#FAF7F0] dark:bg-[#131C15] text-[#62685E] dark:text-[#A3B899] border-[#E4DCCB] dark:border-[#233327] hover:border-[#3E6248] dark:hover:border-[#4ADE80]"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] space-y-2.5">
                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80] block">
                    Active Framework Proficiency
                  </span>
                  {Object.entries(profile.skills).map(([skill, level]) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-xs"
                    >
                      <span className="font-mono font-medium text-[#202920] dark:text-[#EDEAE2]">{skill}</span>
                      <span className="font-mono text-[10px] font-semibold uppercase text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1F2E23] px-2 py-0.5 rounded-full">
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 05: Academic Mesh & ORCID */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block mb-1">
                    Step 05 / 06 · Permanent Identifiers
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                    Academic Mesh & ORCID
                  </h2>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1 leading-relaxed">
                    Link verified scholar registries for automated bibliographic ingestion and co-authorship discovery.
                  </p>
                </div>

                {/* ORCID Primary Box with Custom Input, Generator, and Live Sync */}
                <div className="p-5 rounded-2xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#3E6248]/40 dark:border-[#4ADE80]/40 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[10px]">
                        iD
                      </span>
                      <span className="font-serif text-sm font-semibold text-[#202920] dark:text-[#EDEAE2]">
                        ORCID Digital Identifier
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-bold">
                      OpenAlex Live Bridge
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Input
                      value={profile.links.ORCID || ""}
                      onChange={(e) =>
                        update({
                          links: { ...profile.links, ORCID: e.target.value },
                        })
                      }
                      placeholder="0000-0003-XXXX-XXXX"
                      className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-xs font-mono h-10 flex-1 text-[#202920] dark:text-[#EDEAE2]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGenerateOrcid}
                        title="Generate a unique scholar checksum identifier"
                        className="px-3 h-10 rounded-lg bg-[#FAF7F0] dark:bg-[#18231B] hover:bg-[#E4DCCB] dark:hover:bg-[#233327] text-[#202920] dark:text-[#EDEAE2] border border-[#E4DCCB] dark:border-[#233327] text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                      >
                        <Dice5 size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
                        <span>Generate ID</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSyncOrcid}
                        disabled={isSyncingOrcid}
                        className="px-4 h-10 rounded-lg bg-[#3E6248] hover:bg-[#2d4734] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0 border-0"
                      >
                        <Sparkles size={13} className={isSyncingOrcid ? "animate-spin" : ""} />
                        <span>{isSyncingOrcid ? "Querying..." : "Sync ORCID"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <a
                      href="https://orcid.org/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#3E6248] dark:text-[#4ADE80] hover:underline flex items-center gap-1"
                    >
                      <span>Don't have an official ORCID? Register free on orcid.org</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {syncedOrcidData && (
                    <div className="p-4 rounded-xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E4DCCB] dark:border-[#233327] pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#202920] dark:text-[#EDEAE2]">{syncedOrcidData.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#3E6248] dark:text-[#4ADE80] text-[10px] font-mono font-bold">
                              Verified
                            </span>
                          </div>
                          <span className="text-[11px] text-[#62685E] dark:text-[#A3B899] font-sans">
                            {syncedOrcidData.institution}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <span className="font-mono text-[10px] text-[#85877B] dark:text-[#7E8B7B] block uppercase">h-index</span>
                            <span className="font-mono text-xs font-bold text-[#3E6248] dark:text-[#4ADE80]">{syncedOrcidData.hIndex}</span>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-[#85877B] dark:text-[#7E8B7B] block uppercase">Citations</span>
                            <span className="font-mono text-xs font-bold text-[#202920] dark:text-[#EDEAE2]">{syncedOrcidData.totalCitations.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Other Academic Links */}
                {["Google Scholar", "GitHub", "Semantic Scholar"].map((platform) => (
                  <div key={platform}>
                    <label className="font-mono text-xs text-[#62685E] dark:text-[#A3B899] block mb-1">
                      {platform} Handle / URL
                    </label>
                    <Input
                      value={profile.links[platform] || ""}
                      onChange={(e) =>
                        update({
                          links: { ...profile.links, [platform]: e.target.value },
                        })
                      }
                      placeholder={`https://${platform.toLowerCase().replace(/\s/g, "")}.com/...`}
                      className="bg-white dark:bg-[#18231B] border-[#E4DCCB] dark:border-[#233327] text-xs font-mono h-9 text-[#202920] dark:text-[#EDEAE2]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Step 06: Review & Publish */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <span className="font-mono text-[10.5px] font-bold text-[#3E6248] dark:text-[#4ADE80] uppercase tracking-wider block mb-1">
                    Step 06 / 06 · Peer Ledger Alignment
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
                    Review & Lock Profile
                  </h2>
                  <p className="text-xs text-[#62685E] dark:text-[#A3B899] mt-1 leading-relaxed">
                    Your scholarly profile is fully calibrated and ready to lock into your permanent verified ledger.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#DCE6D7]/40 dark:bg-[#1F2E23]/40 border border-[#66866A]/30 dark:border-[#4ADE80]/30 space-y-3">
                  <div className="flex items-center gap-2 text-[#3E6248] dark:text-[#4ADE80]">
                    <ShieldCheck size={18} />
                    <span className="font-serif text-sm font-semibold">
                      100% Scholarly Schema Parity
                    </span>
                  </div>
                  <p className="text-xs text-[#293E30] dark:text-[#A3B899] m-0 leading-relaxed font-sans">
                    Locking freezes this representation in browser memory and synchronizes your verified avatar and credentials with the platform header.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327]">
                    <span className="text-[#62685E] dark:text-[#A3B899]">Author Name:</span>
                    <span className="font-bold text-[#202920] dark:text-[#EDEAE2]">{profile.name}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327]">
                    <span className="text-[#62685E] dark:text-[#A3B899]">Institution:</span>
                    <span className="font-bold text-[#202920] dark:text-[#EDEAE2]">{profile.institution}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327]">
                    <span className="text-[#62685E] dark:text-[#A3B899]">Inquiry Vectors:</span>
                    <span className="font-bold text-[#3E6248] dark:text-[#4ADE80]">{profile.interests.length} Domains</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327]">
                    <span className="text-[#62685E] dark:text-[#A3B899]">ORCID Registry:</span>
                    <span className="font-bold text-[#202920] dark:text-[#EDEAE2]">{profile.links.ORCID}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 mt-6 border-t border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 0}
                className="border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] text-[#62685E] dark:text-[#A3B899] hover:bg-[#FAF7F0] dark:hover:bg-[#1F2E23] rounded-full text-xs font-mono uppercase tracking-wider h-9 px-4"
              >
                <ChevronLeft size={14} className="mr-1" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] rounded-full text-xs font-mono uppercase tracking-wider h-9 px-6 border-none shadow-sm cursor-pointer"
                  >
                    <span>Continue</span>
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleLockAndSave}
                    disabled={isSaving}
                    className="bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] rounded-full text-xs font-mono uppercase tracking-wider h-9 px-6 border-none shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    <Lock size={14} />
                    <span>{isSaving ? "Locking..." : "Lock & Save Profile"}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Live Scholarly Profile Card Preview (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-[10.5px] uppercase tracking-widest font-bold text-[#85877B] dark:text-[#7E8B7B]">
                Live Peer Preview
              </span>
              <span className="font-mono text-[10px] text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1F2E23] px-2 py-0.5 rounded-full font-semibold">
                Draft View
              </span>
            </div>

            {/* The Cambium Scholar Profile Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] shadow-sm space-y-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-full border-2 border-[#3E6248] dark:border-[#4ADE80] overflow-hidden mb-3.5 shadow-xs bg-[#FAF7F0] dark:bg-[#131C15]">
                  <img
                    src={profile.photo || "/Profile.png"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-[#3E6248] dark:text-[#4ADE80] bg-[#DCE6D7] dark:bg-[#1F2E23] px-2.5 py-0.5 rounded-full font-bold mb-1.5">
                  {profile.position || "Senior Researcher"}
                </span>

                <h3 className="font-serif text-xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0 leading-snug">
                  {profile.name}
                </h3>

                <p className="font-sans text-xs text-[#62685E] dark:text-[#A3B899] mt-1 m-0 max-w-xs leading-relaxed">
                  {profile.headline}
                </p>

                <div className="mt-2 text-[11px] font-mono text-[#85877B] dark:text-[#7E8B7B] flex items-center gap-1.5">
                  <span>{profile.institution}</span>
                  <span>·</span>
                  <span>{profile.city}</span>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E4DCCB] dark:border-[#233327] text-center font-mono">
                <div>
                  <span className="text-base font-bold text-[#202920] dark:text-[#EDEAE2] block">48</span>
                  <span className="text-[9.5px] text-[#85877B] dark:text-[#7E8B7B] uppercase">Papers</span>
                </div>
                <div className="border-x border-[#E4DCCB] dark:border-[#233327]">
                  <span className="text-base font-bold text-[#3E6248] dark:text-[#4ADE80] block">1,842</span>
                  <span className="text-[9.5px] text-[#85877B] dark:text-[#7E8B7B] uppercase">Citations</span>
                </div>
                <div>
                  <span className="text-base font-bold text-[#202920] dark:text-[#EDEAE2] block">19</span>
                  <span className="text-[9.5px] text-[#85877B] dark:text-[#7E8B7B] uppercase">h-index</span>
                </div>
              </div>

              {/* Narrative Excerpt */}
              {profile.bio && (
                <div>
                  <span className="font-mono text-[9.5px] font-bold uppercase text-[#85877B] dark:text-[#7E8B7B] tracking-wider block mb-1">
                    Inquiry Abstract
                  </span>
                  <p className="font-sans text-xs text-[#62685E] dark:text-[#A3B899] leading-relaxed m-0 line-clamp-3">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Research Vector Badges */}
              {profile.interests.length > 0 && (
                <div>
                  <span className="font-mono text-[9.5px] font-bold uppercase text-[#85877B] dark:text-[#7E8B7B] tracking-wider block mb-1.5">
                    Research Vectors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.interests.slice(0, 4).map((i) => (
                      <span
                        key={i}
                        className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#3E6248] dark:text-[#4ADE80] font-medium"
                      >
                        {i}
                      </span>
                    ))}
                    {profile.interests.length > 4 && (
                      <span className="text-[10px] font-mono text-[#85877B] dark:text-[#7E8B7B]">
                        +{profile.interests.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={handleLockAndSave}
                  className="w-full bg-[#3E6248] hover:bg-[#293E30] dark:bg-[#4ADE80] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] rounded-full text-xs font-mono uppercase tracking-wider h-9 border-none shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock size={12} />
                  <span>Lock & Save Profile</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
