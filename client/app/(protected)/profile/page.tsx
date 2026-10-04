"use client";

import React, { useState, useRef, useCallback, useEffect, type ChangeEvent } from "react";
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
} from "lucide-react";
import CambiumLogo from "@/components/CambiumLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

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
    ORCID: "0000-0002-1825-0097",
    "Google Scholar": "scholar.google.com/citations?user=imthiyas",
    GitHub: "github.com/imthiyas",
    "Semantic Scholar": "semanticscholar.org/author/imthiyas",
    Crossref: "doi.org/10.1038/cambium-2026",
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

export default function ProfileCalibrationPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0, 1]));
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("Synchronized just now");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const update = useCallback((patch: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved("Synchronized to ledger");
    }, 400);
  }, []);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      update({ photo: ev.target?.result as string });
      toast({
        title: "Photo Calibrated",
        description: "Scholar portrait updated across the Cambium network.",
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

  const handleSaveAndExit = () => {
    toast({
      title: "Profile Published",
      description: "Academic identity saved and synchronized with your Research Portfolio.",
      variant: "success",
    });
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
    <div className="flex-1 min-h-screen bg-[#FAF7F0] text-[#202920] font-sans flex flex-col overflow-y-auto">
      {/* Top Breadcrumb & Status Bar */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <CambiumLogo size="sm" href="/dashboard" />
          <span className="text-[#85877B] text-xs">/</span>
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-[#3E6248]">
            Academic Identity Calibration
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#85877B]">
            <span className="w-2 h-2 rounded-full bg-[#66866A] animate-pulse" />
            <span>{isSaving ? "Saving changes..." : lastSaved}</span>
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#E4DCCB] hover:bg-white text-xs font-mono uppercase tracking-wider text-[#202920] h-8"
          >
            <Link href="/portfolio">
              <span>View Live Portfolio</span>
              <ArrowRight size={13} className="ml-1 text-[#3E6248]" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Workspace Grid: Stepper Navigation + Builder Form + Live Scholarly Preview */}
      <div className="max-w-7xl mx-auto w-full p-6 sm:p-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Rail: Multi-Step Progress Tracker (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
            {/* Completeness Gauge */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10.5px] uppercase tracking-wider font-bold text-[#62685E]">
                Identity Strength
              </span>
              <span className="font-mono text-xs font-bold text-[#3E6248]">
                {completeness}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#E4DCCB] overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#3E6248] to-[#66866A] rounded-full transition-all duration-300"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-[11.5px] text-[#62685E] m-0 leading-relaxed font-sans">
              Verified identities receive 3.8× higher citation matching and grant visibility across Cambium.
            </p>
          </div>

          {/* Stepper Navigation List */}
          <nav className="p-2 rounded-2xl bg-white border border-[#E4DCCB] space-y-1 shadow-2xs">
            {STEPS.map((s, idx) => {
              const isActive = step === idx;
              const isDone = completedSteps.has(idx);

              return (
                <button
                  key={s.id}
                  onClick={() => setStep(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer border-0 ${
                    isActive
                      ? "bg-[#FAF7F0] border border-[#E4DCCB] shadow-2xs text-[#202920] font-semibold"
                      : "bg-transparent text-[#62685E] hover:text-[#202920] hover:bg-[#FAF7F0]/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10.5px] font-bold shrink-0 transition-colors ${
                        isActive
                          ? "bg-[#3E6248] text-white"
                          : isDone
                          ? "bg-[#DCE6D7] text-[#3E6248]"
                          : "bg-[#FAF7F0] text-[#85877B] border border-[#E4DCCB]"
                      }`}
                    >
                      {isDone && !isActive ? <Check size={12} /> : s.num}
                    </span>
                    <span className="text-xs truncate font-sans">{s.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Provenance Note */}
          <div className="p-4 rounded-xl bg-[#F2EBDD]/60 border border-[#E4DCCB] text-[11px] text-[#62685E] leading-relaxed">
            <span className="font-semibold text-[#202920] block mb-1">
              Cryptographic Data Sovereignty
            </span>
            All profile attributes are encrypted and portable. You can export this record anytime in BibTeX or CSL-JSON under Account Settings.
          </div>
        </div>

        {/* Center: Active Step Configuration Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E4DCCB] rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Step 01: Scholarly Identity */}
          {step === 0 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] uppercase tracking-wider block mb-1">
                  Step 01 / 06 · Core Provenance
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#202920] m-0">
                  Scholarly Identity
                </h2>
                <p className="text-xs text-[#62685E] mt-1 leading-relaxed">
                  Establish your authoritative name, professional headline, and scholar photo across peer indices.
                </p>
              </div>

              {/* Photo Upload with /Profile.png default */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#3E6248] bg-white shrink-0 shadow-sm">
                  <img
                    src={profile.photo || "/Profile.png"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[#202920] block mb-0.5">
                    Official Scholar Portrait
                  </span>
                  <span className="text-[11px] font-mono text-[#85877B] block mb-2">
                    JPG, PNG, or WebP. Centered face recommended.
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#3E6248] hover:bg-[#293E30] text-white text-[11px] font-mono uppercase h-7 px-3 rounded-full border-none shadow-2xs"
                    >
                      <Upload size={11} className="mr-1" />
                      Upload Photo
                    </Button>
                    {profile.photo && profile.photo !== "/Profile.png" && (
                      <button
                        type="button"
                        onClick={() => update({ photo: "/Profile.png" })}
                        className="text-[11px] font-mono text-[#62685E] hover:text-[#B33D35] bg-transparent border-0 cursor-pointer p-0"
                      >
                        Reset Default
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  Full Academic Name
                </label>
                <Input
                  value={profile.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Imthiyas"
                  className="bg-[#FAF7F0] border-[#E4DCCB] text-xs h-10"
                />
              </div>

              {/* Headline */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  Professional Headline & Core Discipline
                </label>
                <Input
                  value={profile.headline}
                  onChange={(e) => update({ headline: e.target.value })}
                  placeholder="Principal Investigator · Computational Genomics"
                  className="bg-[#FAF7F0] border-[#E4DCCB] text-xs h-10"
                />
              </div>

              {/* Location (City & Country) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                    City / Hub
                  </label>
                  <Input
                    value={profile.city}
                    onChange={(e) => update({ city: e.target.value })}
                    placeholder="Cambridge, MA"
                    className="bg-[#FAF7F0] border-[#E4DCCB] text-xs h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                    Country / Jurisdiction
                  </label>
                  <Input
                    value={profile.country}
                    onChange={(e) => update({ country: e.target.value })}
                    placeholder="United States"
                    className="bg-[#FAF7F0] border-[#E4DCCB] text-xs h-10"
                  />
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  Scholarly Narrative & Inquiries
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => update({ bio: e.target.value })}
                  rows={4}
                  placeholder="Describe your active hypotheses and scientific focus..."
                  className="w-full rounded-md border border-[#E4DCCB] bg-[#FAF7F0] p-3 text-xs text-[#202920] outline-none focus:border-[#3E6248] focus:ring-1 focus:ring-[#3E6248] font-sans resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 02: Institution & Lab */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] uppercase tracking-wider block mb-1">
                  Step 02 / 06 · Affiliation Matrix
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#202920] m-0">
                  Institution & Laboratory
                </h2>
                <p className="text-xs text-[#62685E] mt-1 leading-relaxed">
                  Connect your research center, university laboratory, and formal faculty appointment.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  University or Research Organization
                </label>
                <Input
                  value={profile.institution}
                  onChange={(e) => update({ institution: e.target.value })}
                  placeholder="MIT CSAIL & Broad Institute"
                  className="bg-[#FAF7F0] border-[#E4DCCB] text-xs h-10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  Department or Institute Branch
                </label>
                <Input
                  value={profile.department}
                  onChange={(e) => update({ department: e.target.value })}
                  placeholder="Department of Computational Biology"
                  className="bg-[#FAF7F0] border-[#E4DCCB] text-xs h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                    Academic Rank / Role
                  </label>
                  <Input
                    value={profile.position}
                    onChange={(e) => update({ position: e.target.value })}
                    placeholder="Senior Research Fellow"
                    className="bg-[#FAF7F0] border-[#E4DCCB] text-xs h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                    Level Tier
                  </label>
                  <Input
                    value={profile.academicLevel}
                    onChange={(e) => update({ academicLevel: e.target.value })}
                    placeholder="Senior Investigator"
                    className="bg-[#FAF7F0] border-[#E4DCCB] text-xs h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  Laboratory or Research Group Name
                </label>
                <Input
                  value={profile.researchLab}
                  onChange={(e) => update({ researchLab: e.target.value })}
                  placeholder="Cellular Topology & Neural Synthesis Lab"
                  className="bg-[#FAF7F0] border-[#E4DCCB] text-xs h-10"
                />
              </div>
            </div>
          )}

          {/* Step 03: Research Vectors */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] uppercase tracking-wider block mb-1">
                  Step 03 / 06 · Vector Embeddings
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#202920] m-0">
                  Research Vectors
                </h2>
                <p className="text-xs text-[#62685E] mt-1 leading-relaxed">
                  Select primary inquiry domains to automatically calibrate grant recommendations and citation alerts.
                </p>
              </div>

              {/* Research Domain Chips */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  Key Inquiry Domains ({profile.interests.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {RESEARCH_DOMAINS.map((domain) => {
                    const isSelected = profile.interests.includes(domain);
                    return (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => handleToggleInterest(domain)}
                        className={`text-xs px-3 py-1.5 rounded-full font-sans transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#3E6248] text-white border-[#3E6248] shadow-2xs font-semibold"
                            : "bg-[#FAF7F0] text-[#62685E] border-[#E4DCCB] hover:border-[#3E6248]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {domain}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Abstract / Problem Statement */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  Current Active Hypothesis / Core Focus
                </label>
                <textarea
                  value={profile.researchDescription}
                  onChange={(e) => update({ researchDescription: e.target.value })}
                  rows={4}
                  placeholder="Summarize the core scientific question your active lab inquiries address..."
                  className="w-full rounded-md border border-[#E4DCCB] bg-[#FAF7F0] p-3 text-xs text-[#202920] outline-none focus:border-[#3E6248] focus:ring-1 focus:ring-[#3E6248] font-sans resize-none"
                />
              </div>

              {/* Research Goals */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  Collaboration & Milestone Objectives
                </label>
                <div className="flex flex-wrap gap-2">
                  {RESEARCH_GOALS.map((g) => {
                    const isSelected = profile.researchGoals.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleToggleGoal(g)}
                        className={`text-xs px-3 py-1 rounded-full font-mono transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#DCE6D7] text-[#293E30] border-[#66866A]/40 font-bold"
                            : "bg-[#FAF7F0] text-[#62685E] border-[#E4DCCB]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {g}
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
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] uppercase tracking-wider block mb-1">
                  Step 04 / 06 · Technical Architecture
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#202920] m-0">
                  Scientific Toolkit
                </h2>
                <p className="text-xs text-[#62685E] mt-1 leading-relaxed">
                  Signal your analytical frameworks, experimental stacks, and computation environments.
                </p>
              </div>

              <div className="space-y-3">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                  Select Core Technical Stacks
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_SUGGESTIONS.map((skill) => {
                    const isSelected = Boolean(profile.skills[skill]);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-full font-mono transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#3E6248] text-white border-[#3E6248] font-bold"
                            : "bg-[#FAF7F0] text-[#62685E] border-[#E4DCCB] hover:border-[#3E6248]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Skills List with Level */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-2.5">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#3E6248] block">
                  Active Framework Proficiency
                </span>
                {Object.entries(profile.skills).map(([skill, level]) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E4DCCB] text-xs"
                  >
                    <span className="font-mono font-medium text-[#202920]">{skill}</span>
                    <span className="font-mono text-[10px] font-semibold uppercase text-[#3E6248] bg-[#DCE6D7] px-2 py-0.5 rounded-full">
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
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] uppercase tracking-wider block mb-1">
                  Step 05 / 06 · Permanent Identifiers
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#202920] m-0">
                  Academic Mesh & ORCID
                </h2>
                <p className="text-xs text-[#62685E] mt-1 leading-relaxed">
                  Link verified scholar registries for automated bibliographic ingestion and co-authorship discovery.
                </p>
              </div>

              {/* ORCID Primary Box */}
              <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#3E6248]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#A6CE39] text-white flex items-center justify-center font-bold text-[10px]">
                      iD
                    </span>
                    <span className="font-serif text-sm font-semibold text-[#202920]">
                      ORCID Digital Identifier
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Verified Sync Active
                  </span>
                </div>
                <Input
                  value={profile.links.ORCID || ""}
                  onChange={(e) =>
                    update({
                      links: { ...profile.links, ORCID: e.target.value },
                    })
                  }
                  placeholder="0000-0002-1825-0097"
                  className="bg-white border-[#E4DCCB] text-xs font-mono h-10"
                />
              </div>

              {/* Other Academic Links */}
              {["Google Scholar", "GitHub", "Semantic Scholar"].map((platform) => (
                <div key={platform} className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#62685E]">
                    {platform} Profile URI
                  </label>
                  <Input
                    value={profile.links[platform] || ""}
                    onChange={(e) =>
                      update({
                        links: { ...profile.links, [platform]: e.target.value },
                      })
                    }
                    placeholder={`https://${platform.toLowerCase().replace(" ", "")}.com/...`}
                    className="bg-[#FAF7F0] border-[#E4DCCB] text-xs font-mono h-10"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 06: Review & Publish */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="font-mono text-[10.5px] font-bold text-[#3E6248] uppercase tracking-wider block mb-1">
                  Step 06 / 06 · Peer Ledger Alignment
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#202920] m-0">
                  Review & Publish
                </h2>
                <p className="text-xs text-[#62685E] mt-1 leading-relaxed">
                  Your scholarly profile is fully calibrated and ready for broadcast across the Cambium research mesh.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#DCE6D7]/40 border border-[#66866A]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#3E6248]">
                  <ShieldCheck size={18} />
                  <span className="font-serif text-sm font-semibold">
                    100% Scholarly Schema Parity
                  </span>
                </div>
                <p className="text-xs text-[#293E30] m-0 leading-relaxed font-sans">
                  Published profiles are indexed on OpenAlex, Crossref-linked, and immediately resolvable in researcher graph searches.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]">
                  <span className="text-[#62685E]">Author Name:</span>
                  <span className="font-bold text-[#202920]">{profile.name}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]">
                  <span className="text-[#62685E]">Institution:</span>
                  <span className="font-bold text-[#202920]">{profile.institution}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]">
                  <span className="text-[#62685E]">Inquiry Vectors:</span>
                  <span className="font-bold text-[#3E6248]">{profile.interests.length} Domains</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB]">
                  <span className="text-[#62685E]">ORCID Registry:</span>
                  <span className="font-bold text-[#202920]">{profile.links.ORCID}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-6 mt-6 border-t border-[#E4DCCB] flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
              className="border-[#E4DCCB] text-[#62685E] hover:bg-[#FAF7F0] rounded-full text-xs font-mono uppercase tracking-wider h-9 px-4"
            >
              <ChevronLeft size={14} className="mr-1" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#3E6248] hover:bg-[#293E30] text-white rounded-full text-xs font-mono uppercase tracking-wider h-9 px-6 border-none shadow-sm"
                >
                  <span>Continue</span>
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSaveAndExit}
                  asChild
                  className="bg-[#3E6248] hover:bg-[#293E30] text-white rounded-full text-xs font-mono uppercase tracking-wider h-9 px-6 border-none shadow-sm"
                >
                  <Link href="/portfolio">
                    <Save size={14} className="mr-1.5" />
                    <span>Publish to Portfolio →</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Scholarly Profile Card Preview (4 Cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10.5px] uppercase tracking-widest font-bold text-[#85877B]">
              Live Peer Preview
            </span>
            <span className="font-mono text-[10px] text-[#3E6248] bg-[#DCE6D7] px-2 py-0.5 rounded-full font-semibold">
              Public Ledger View
            </span>
          </div>

          {/* The Cambium Scholar Profile Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E4DCCB] shadow-sm space-y-5">
            {/* Header / Avatar / Name */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-full border-2 border-[#3E6248] overflow-hidden mb-3.5 shadow-xs">
                <img
                  src={profile.photo || "/Profile.png"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-widest text-[#3E6248] bg-[#DCE6D7] px-2.5 py-0.5 rounded-full font-bold mb-1.5">
                {profile.position || "Senior Researcher"}
              </span>

              <h3 className="font-serif text-xl font-normal text-[#202920] m-0 leading-snug">
                {profile.name}
              </h3>

              <p className="font-sans text-xs text-[#62685E] mt-1 m-0 max-w-xs leading-relaxed">
                {profile.headline}
              </p>

              <div className="mt-2 text-[11px] font-mono text-[#85877B] flex items-center gap-1.5">
                <span>{profile.institution}</span>
                <span>·</span>
                <span>{profile.city}</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E4DCCB] text-center font-mono">
              <div>
                <span className="text-base font-bold text-[#202920] block">48</span>
                <span className="text-[9.5px] text-[#85877B] uppercase">Papers</span>
              </div>
              <div className="border-x border-[#E4DCCB]">
                <span className="text-base font-bold text-[#3E6248] block">1,842</span>
                <span className="text-[9.5px] text-[#85877B] uppercase">Citations</span>
              </div>
              <div>
                <span className="text-base font-bold text-[#202920] block">19</span>
                <span className="text-[9.5px] text-[#85877B] uppercase">h-index</span>
              </div>
            </div>

            {/* Narrative Excerpt */}
            {profile.bio && (
              <div>
                <span className="font-mono text-[9.5px] font-bold uppercase text-[#85877B] tracking-wider block mb-1">
                  Inquiry Abstract
                </span>
                <p className="font-sans text-xs text-[#62685E] leading-relaxed m-0 line-clamp-3">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Research Vector Badges */}
            {profile.interests.length > 0 && (
              <div>
                <span className="font-mono text-[9.5px] font-bold uppercase text-[#85877B] tracking-wider block mb-1.5">
                  Research Vectors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.slice(0, 4).map((i) => (
                    <span
                      key={i}
                      className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] text-[#3E6248] font-medium"
                    >
                      {i}
                    </span>
                  ))}
                  {profile.interests.length > 4 && (
                    <span className="text-[10px] font-mono text-[#85877B]">
                      +{profile.interests.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2">
              <Button
                asChild
                className="w-full bg-[#3E6248] hover:bg-[#293E30] text-white rounded-full text-xs font-mono uppercase tracking-wider h-9 border-none shadow-sm"
              >
                <Link href="/portfolio">
                  <span>Open Full Portfolio</span>
                  <ExternalLink size={12} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
