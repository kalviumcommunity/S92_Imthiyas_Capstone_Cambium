"use client";

import React, { useState, ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  X,
  Sparkles,
  BookOpen,
  User,
  Layers,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import { WorkspaceProvisioningModal } from "@/components/ui/workspace-provisioning-modal";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Publication = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  selected: boolean;
  imported: boolean;
  source: "orcid" | "manual";
};

export type SetupData = {
  orcidConnected: boolean;
  orcidName: string;
  orcidId: string;
  interests: string[];
  topics: string[];
  publications: Publication[];
};

type Screen =
  | "welcome"
  | "orcid"
  | "interests"
  | "topics"
  | "publications"
  | "review"
  | "complete";

// ─── Preset Data ──────────────────────────────────────────────────────────────

const ALL_INTERESTS = [
  "Scientific ML",
  "Computational Biology",
  "Machine Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics",
  "Bioinformatics",
  "Medical Imaging",
  "Human-Computer Interaction",
  "Data Science",
  "Quantum Computing",
  "Systems Biology",
  "Computational Neuroscience",
  "Climate Modeling",
  "Materials Informatics",
];

const SUGGESTED_TOPICS = [
  "Federated Learning",
  "Foundation Models",
  "Medical Imaging AI",
  "Self-Supervised Learning",
  "Graph Neural Networks",
  "Clinical AI",
  "Explainable AI",
  "Diffusion Models",
  "Contrastive Learning",
  "Multimodal Learning",
  "Neural Architecture Search",
  "Privacy-Preserving ML",
  "Causal Inference",
  "Genomic Foundation Models",
  "Protein Structure Prediction",
  "Transfer Learning",
  "Reinforcement Learning from Feedback",
  "Sparse Transformers",
];

const DEFAULT_ORCID_PUBLICATIONS: Publication[] = [
  {
    id: "p1",
    title: "Federated Learning for Clinical Decision Support",
    authors: "Imthiyas, Park J., Williams M.",
    year: 2024,
    venue: "Nature Machine Intelligence",
    selected: true,
    imported: false,
    source: "orcid",
  },
  {
    id: "p2",
    title: "Self-Supervised Representations in Medical Imaging",
    authors: "Imthiyas, Kumar A.",
    year: 2023,
    venue: "NeurIPS 2023",
    selected: true,
    imported: false,
    source: "orcid",
  },
  {
    id: "p3",
    title: "Graph Neural Networks for Drug Interaction Prediction",
    authors: "Imthiyas, Liu R., Park J.",
    year: 2023,
    venue: "Bioinformatics",
    selected: true,
    imported: false,
    source: "orcid",
  },
  {
    id: "p4",
    title: "Explainability Methods in Clinical AI Systems",
    authors: "Imthiyas, Thompson K.",
    year: 2022,
    venue: "JAMIA",
    selected: false,
    imported: false,
    source: "orcid",
  },
  {
    id: "p5",
    title: "Scalable Attention Mechanisms for Genomic Sequences",
    authors: "Imthiyas, Li H., Park J.",
    year: 2022,
    venue: "ICML 2022",
    selected: false,
    imported: false,
    source: "orcid",
  },
];

import CambiumLogo, { CambiumMark } from "@/components/CambiumLogo";

// ─── Shared UI Components ─────────────────────────────────────────────────────

function ConnectingSpinner() {
  return (
    <div className="w-8 h-8 rounded-full border-2 border-moss-200 border-t-moss-600 animate-spin" />
  );
}

function PageTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 sm:mb-10">
      <h1 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal tracking-tight mb-2 leading-tight">
        {children}
      </h1>
      {subtitle && (
        <p className="text-sm sm:text-[15px] text-ink-secondary leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function SetupShell({
  children,
  hasTopBar = true,
}: {
  children: React.ReactNode;
  hasTopBar?: boolean;
}) {
  return (
    <div
      className={`min-h-screen flex flex-col ${
        hasTopBar ? "pt-16 sm:pt-20" : "pt-0"
      }`}
    >
      <div className="w-full max-w-[820px] mx-auto px-5 sm:px-10 py-8 sm:py-12 pb-32 flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
}

interface BottomNavProps {
  onBack?: () => void;
  onContinue?: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  continueDisabled?: boolean;
  showSkip?: boolean;
}

function BottomNav({
  onBack,
  onContinue,
  onSkip,
  continueLabel = "Continue",
  backLabel = "Back",
  skipLabel = "Skip for now",
  continueDisabled = false,
  showSkip = false,
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface-base/95 backdrop-blur-md border-t border-edge-default">
      <div className="max-w-[820px] mx-auto px-5 sm:px-10 py-3.5 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors py-2"
            >
              <ChevronLeft size={16} />
              {backLabel}
            </button>
          )}
          {showSkip && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs sm:text-[13px] text-ink-tertiary hover:text-ink-secondary underline underline-offset-2 transition-colors py-2"
            >
              {skipLabel}
            </button>
          )}
        </div>
        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            disabled={continueDisabled}
            className={`flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs ${
              continueDisabled
                ? "bg-edge-default text-ink-tertiary cursor-not-allowed"
                : "bg-moss-600 hover:bg-moss-700 text-white cursor-pointer"
            }`}
          >
            {continueLabel}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-surface-base/95 backdrop-blur-md border-b border-edge-default">
      <div className="max-w-[820px] mx-auto px-5 sm:px-10 h-16 flex items-center justify-between gap-4">
        <CambiumLogo size="sm" href="/" />

        {/* Progress steps */}
        <div className="flex items-center gap-2 sm:gap-4">
          {steps.map((step, i) => {
            const isCompleted = i < current;
            const isCurrent = i === current;

            return (
              <div key={step} className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isCompleted
                        ? "bg-moss-600 text-white"
                        : isCurrent
                        ? "bg-moss-600 text-white shadow-xs"
                        : "border border-edge-default text-ink-tertiary bg-surface-raised"
                    }`}
                  >
                    {isCompleted ? <Check size={11} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs hidden md:inline transition-colors ${
                      isCurrent
                        ? "font-semibold text-ink-primary"
                        : isCompleted
                        ? "text-moss-700 font-medium"
                        : "text-ink-tertiary"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-3 sm:w-6 h-[1.5px] transition-colors ${
                      i < current ? "bg-moss-600" : "bg-edge-default"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function ExitConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-ink-primary/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="bg-surface-raised rounded-xl p-6 sm:p-8 max-w-md w-full shadow-elevation3 border border-edge-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 rounded-lg bg-moss-50 border border-moss-200 flex items-center justify-center mb-4 text-moss-700">
          <AlertCircle size={20} />
        </div>
        <h2 className="font-serif text-lg sm:text-xl font-bold text-ink-primary mb-2">
          Exit onboarding setup?
        </h2>
        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-6">
          You can complete or customize your research profile anytime later in account settings. Any unsaved selections will be discarded.
        </p>
        <div className="flex flex-col gap-2.5">
          <Link
            href="/dashboard"
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-lg bg-moss-600 hover:bg-moss-700 text-white font-semibold text-xs sm:text-sm text-center transition-colors shadow-xs"
          >
            Exit to Dashboard
          </Link>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-lg border border-edge-default hover:bg-surface-sunken text-ink-primary font-medium text-xs sm:text-sm transition-colors"
          >
            Continue setup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Welcome Screen ───────────────────────────────────────────────────

function SetupWelcome({
  onStart,
  onSkip,
}: {
  onStart: () => void;
  onSkip: () => void;
}) {
  const steps = [
    {
      icon: <User size={18} className="text-moss-700" />,
      label: "Academic identity",
      desc: "Connect your verified ORCID profile",
    },
    {
      icon: <Layers size={18} className="text-moss-700" />,
      label: "Research focus",
      desc: "Select domain interests and specialized topics",
    },
    {
      icon: <BookOpen size={18} className="text-moss-700" />,
      label: "Publications",
      desc: "Import and index your research output",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      {/* Top bar */}
      <div className="px-6 sm:px-10 py-5 border-b border-edge-default flex items-center justify-between">
        <CambiumLogo size="sm" href="/" />
        <span className="text-[10px] font-bold text-moss-700 bg-moss-50 border border-moss-200 px-2 py-0.5 rounded uppercase tracking-wider">
          Onboarding
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-lg w-full">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-moss-50 border border-moss-200/80 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-moss-600" />
            <span className="text-[10px] font-bold text-moss-700 tracking-wider uppercase">
              Research Setup
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal tracking-tight mb-3 leading-tight">
            Build your research <br />
            starting point.
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary mb-8 leading-relaxed max-w-md">
            Connect your academic identity, define what you research, and bring your publications directly into the Cambium ecosystem.
          </p>

          {/* Step Cards */}
          <div className="space-y-3 mb-8">
            {steps.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-surface-raised border border-edge-default rounded-xl p-4 shadow-xs"
              >
                <div className="w-10 h-10 rounded-lg bg-moss-50 border border-moss-200/60 flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink-primary">
                    {s.label}
                  </div>
                  <div className="text-xs text-ink-tertiary mt-0.5 truncate">
                    {s.desc}
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border border-edge-default shrink-0" />
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-moss-600 hover:bg-moss-700 text-white font-semibold text-sm transition-all shadow-xs"
            >
              Start setup
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="px-4 py-2.5 text-xs sm:text-sm text-ink-tertiary hover:text-ink-primary underline underline-offset-2 transition-colors text-center"
            >
              Skip for now
            </button>
          </div>

          <p className="text-[11px] text-ink-tertiary mt-6 leading-normal">
            You can always complete or update your research profile anytime in account settings.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Connect ORCID ────────────────────────────────────────────────────

function ConnectORCID({
  setupData,
  updateSetup,
  onBack,
  onContinue,
  onSkip,
}: {
  setupData: SetupData;
  updateSetup: (patch: Partial<SetupData>) => void;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const [orcidState, setOrcidState] = useState<"idle" | "connecting" | "connected">(
    setupData.orcidConnected ? "connected" : "idle"
  );
  const [manualMode, setManualMode] = useState(false);
  const [manualId, setManualId] = useState(setupData.orcidId || "");

  const handleConnect = () => {
    setOrcidState("connecting");
    setTimeout(() => {
      setOrcidState("connected");
      updateSetup({
        orcidConnected: true,
        orcidName: "Imthiyas",
        orcidId: "0000-0002-1234-5678",
        publications: DEFAULT_ORCID_PUBLICATIONS,
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setOrcidState("idle");
    updateSetup({
      orcidConnected: false,
      orcidName: "",
      orcidId: "",
      publications: [],
    });
  };

  const handleManualSave = () => {
    if (!manualId.trim()) return;
    setOrcidState("connected");
    updateSetup({
      orcidConnected: true,
      orcidName: "Imthiyas",
      orcidId: manualId.trim(),
      publications: DEFAULT_ORCID_PUBLICATIONS,
    });
  };

  return (
    <>
      <SetupShell>
        <PageTitle subtitle="ORCID is a persistent digital identifier that distinguishes you from every other researcher. Connecting it links your publications and affiliations automatically.">
          Connect your academic identity.
        </PageTitle>

        {/* ORCID Card */}
        <div
          className={`bg-surface-raised border rounded-xl p-6 sm:p-8 mb-6 shadow-xs transition-colors ${
            orcidState === "connected"
              ? "border-moss-600/80 bg-moss-50/20"
              : "border-edge-default"
          }`}
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#A6CE39] flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-xs">
                iD
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-primary mb-0.5">
                  ORCID
                </h3>
                <p className="text-xs text-ink-tertiary">
                  Open Researcher and Contributor ID
                </p>
              </div>
            </div>

            {orcidState === "connected" && (
              <span className="inline-flex items-center gap-1.5 bg-moss-50 border border-moss-200 text-moss-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-600" />
                Connected
              </span>
            )}
          </div>

          {orcidState === "idle" && (
            <div>
              <div className="space-y-2.5 mb-6">
                {[
                  "Import your publication bibliography automatically",
                  "Verify institutional affiliations and degree history",
                  "Enable one-click syncing with Cambium Research OS",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs text-ink-secondary">
                    <span className="w-4 h-4 rounded-full bg-moss-50 border border-moss-200 flex items-center justify-center text-moss-700 shrink-0">
                      <Check size={10} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleConnect}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-moss-600 hover:bg-moss-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
                >
                  Connect ORCID account
                  <ExternalLink size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setManualMode(!manualMode)}
                  className="px-4 py-2 text-xs text-ink-tertiary hover:text-ink-primary transition-colors"
                >
                  {manualMode ? "Hide manual entry" : "Enter ORCID iD manually"}
                </button>
              </div>

              {manualMode && (
                <div className="mt-4 pt-4 border-t border-edge-default flex gap-2">
                  <input
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="0000-0002-1234-5678"
                    className="flex-1 px-3 py-1.5 text-xs rounded border border-edge-default bg-surface-base text-ink-primary font-mono outline-none focus:border-moss-600"
                  />
                  <button
                    type="button"
                    onClick={handleManualSave}
                    className="px-3 py-1.5 rounded bg-surface-raised border border-edge-default hover:bg-surface-sunken text-xs font-semibold text-ink-primary"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}

          {orcidState === "connecting" && (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <ConnectingSpinner />
              <p className="text-xs text-ink-secondary font-medium">
                Authorizing with ORCID registry…
              </p>
            </div>
          )}

          {orcidState === "connected" && (
            <div className="pt-2 border-t border-edge-default/60">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <div className="text-sm font-semibold text-ink-primary">
                    {setupData.orcidName || "Imthiyas"}
                  </div>
                  <div className="text-xs text-ink-tertiary font-mono">
                    {setupData.orcidId || "0000-0002-1234-5678"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-xs text-crimson hover:underline"
                >
                  Disconnect
                </button>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed bg-surface-base p-3 rounded-lg border border-edge-default">
                Found <strong>5 publications</strong> and verified affiliation with <strong>MIT CSAIL</strong>. We will import these in the upcoming steps.
              </p>
            </div>
          )}
        </div>
      </SetupShell>

      <BottomNav
        onBack={onBack}
        onContinue={onContinue}
        onSkip={onSkip}
        showSkip
        continueLabel="Continue to Interests"
      />
    </>
  );
}

// ─── Step 3: Research Interests ───────────────────────────────────────────────

function ResearchInterests({
  setupData,
  updateSetup,
  onBack,
  onContinue,
  onSkip,
}: {
  setupData: SetupData;
  updateSetup: (patch: Partial<SetupData>) => void;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(setupData.interests);

  const filtered = ALL_INTERESTS.filter((i) =>
    i.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (interest: string) => {
    const next = selected.includes(interest)
      ? selected.filter((i) => i !== interest)
      : [...selected, interest];
    setSelected(next);
    updateSetup({ interests: next });
  };

  return (
    <>
      <SetupShell>
        <PageTitle subtitle="Select the broad areas that define your research domain. Cambium uses these to surface relevant literature, grant opportunities, and collaborators.">
          What are you exploring?
        </PageTitle>

        {/* Search input */}
        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search research interests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-edge-default bg-surface-raised text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-moss-600 focus:ring-1 focus:ring-moss-600 transition-all"
          />
        </div>

        {/* Selected count header */}
        {selected.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-moss-600 text-white rounded-full px-2.5 py-0.5 text-[11px] font-bold">
              {selected.length} selected
            </span>
            <button
              type="button"
              onClick={() => {
                setSelected([]);
                updateSetup({ interests: [] });
              }}
              className="text-xs text-ink-tertiary hover:text-ink-primary underline underline-offset-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Chips grid */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filtered.map((interest) => {
            const isSelected = selected.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggle(interest)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shadow-xs ${
                  isSelected
                    ? "bg-moss-50 text-moss-700 border border-moss-300 font-semibold"
                    : "bg-surface-raised border border-edge-default text-ink-secondary hover:border-moss-300 hover:text-ink-primary"
                }`}
              >
                {isSelected && <Check size={12} className="text-moss-700" />}
                {interest}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-xs text-ink-tertiary py-4">
              No interests found matching &ldquo;{search}&rdquo;.
            </p>
          )}
        </div>

        {/* Selected summary */}
        {selected.length > 0 && (
          <div className="p-4 rounded-xl bg-surface-sunken border border-edge-default">
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary mb-2">
              Your domain selection
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selected.map((s) => (
                <span
                  key={s}
                  className="bg-surface-raised border border-edge-default text-ink-primary text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </SetupShell>

      <BottomNav
        onBack={onBack}
        onContinue={onContinue}
        onSkip={onSkip}
        showSkip
        continueLabel="Continue to Topics"
        continueDisabled={selected.length === 0}
      />
    </>
  );
}

// ─── Step 4: Research Topics ──────────────────────────────────────────────────

function ResearchTopics({
  setupData,
  updateSetup,
  onBack,
  onContinue,
  onSkip,
}: {
  setupData: SetupData;
  updateSetup: (patch: Partial<SetupData>) => void;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(setupData.topics);
  const [customInput, setCustomInput] = useState("");

  const filtered = SUGGESTED_TOPICS.filter(
    (t) =>
      t.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(t)
  );

  const toggle = (topic: string) => {
    const next = selected.includes(topic)
      ? selected.filter((t) => t !== topic)
      : [...selected, topic];
    setSelected(next);
    updateSetup({ topics: next });
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (val && !selected.includes(val)) {
      const next = [...selected, val];
      setSelected(next);
      updateSetup({ topics: next });
      setCustomInput("");
      setSearch("");
    }
  };

  return (
    <>
      <SetupShell>
        <PageTitle subtitle="Pick the specific topics, techniques, and methodologies relevant to your projects. You can also type to add custom niche topics.">
          Choose topics that matter to your work.
        </PageTitle>

        {/* Search & Custom Add Input */}
        <div className="relative mb-2">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search or type a custom topic…"
            value={search || customInput}
            onChange={(e) => {
              setSearch(e.target.value);
              setCustomInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm rounded-lg border border-edge-default bg-surface-raised text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-moss-600 focus:ring-1 focus:ring-moss-600"
          />
          {customInput.trim() && (
            <button
              type="button"
              onClick={addCustom}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-moss-600 hover:bg-moss-700 text-white text-xs font-semibold rounded"
            >
              Add
            </button>
          )}
        </div>
        <p className="text-[11px] text-ink-tertiary mb-6">
          Press Enter or click Add to append a custom specialty topic.
        </p>

        {/* Selected topics list */}
        {selected.length > 0 && (
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary mb-2">
              Selected topics ({selected.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selected.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 bg-moss-50 border border-moss-200 text-moss-700 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => toggle(t)}
                    className="hover:text-crimson transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested topics */}
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary mb-2">
            Suggested for your research
          </div>
          <div className="flex flex-wrap gap-2">
            {filtered.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => toggle(topic)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-edge-default bg-surface-raised hover:bg-surface-sunken hover:border-moss-300 text-xs text-ink-secondary hover:text-ink-primary transition-all"
              >
                <Plus size={12} className="text-moss-700" />
                {topic}
              </button>
            ))}
          </div>
        </div>
      </SetupShell>

      <BottomNav
        onBack={onBack}
        onContinue={onContinue}
        onSkip={onSkip}
        showSkip
        continueLabel="Continue to Publications"
      />
    </>
  );
}

// ─── Step 5: Import Publications ──────────────────────────────────────────────

function ImportPublications({
  setupData,
  updateSetup,
  onBack,
  onContinue,
  onSkip,
}: {
  setupData: SetupData;
  updateSetup: (patch: Partial<SetupData>) => void;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const [pubs, setPubs] = useState<Publication[]>(
    setupData.publications.length > 0
      ? setupData.publications
      : DEFAULT_ORCID_PUBLICATIONS
  );
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(
    setupData.publications.some((p) => p.imported)
  );

  const togglePub = (id: string) => {
    const next = pubs.map((p) =>
      p.id === id ? { ...p, selected: !p.selected } : p
    );
    setPubs(next);
    updateSetup({ publications: next });
  };

  const toggleAll = () => {
    const allSelected = pubs.every((p) => p.selected);
    const next = pubs.map((p) => ({ ...p, selected: !allSelected }));
    setPubs(next);
    updateSetup({ publications: next });
  };

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      const next = pubs.map((p) =>
        p.selected ? { ...p, imported: true } : p
      );
      setPubs(next);
      updateSetup({ publications: next });
      setImporting(false);
      setDone(true);
    }, 1400);
  };

  const selectedCount = pubs.filter((p) => p.selected).length;
  const importedCount = pubs.filter((p) => p.imported).length;

  return (
    <>
      <SetupShell>
        <PageTitle subtitle="Bring your authored literature into Cambium. Imported publications empower the AI Assistant with your actual methodology and citation corpus.">
          Bring your research with you.
        </PageTitle>

        {!setupData.orcidConnected && (
          <div className="p-6 rounded-xl border border-edge-default bg-surface-raised mb-6">
            <h3 className="text-sm font-bold text-ink-primary mb-1">
              No ORCID account connected
            </h3>
            <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
              Connect your ORCID to auto-fetch your publication registry, or skip this step to add literature later manually.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-lg bg-moss-600 hover:bg-moss-700 text-white text-xs font-semibold"
              >
                Go back & connect ORCID
              </button>
              <button
                type="button"
                onClick={onContinue}
                className="px-4 py-2 text-xs text-ink-tertiary hover:text-ink-primary"
              >
                Skip publications
              </button>
            </div>
          </div>
        )}

        {setupData.orcidConnected && (
          <div>
            {/* Source bar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-moss-50 border border-moss-200 text-moss-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  From ORCID
                </span>
                <span className="text-xs text-ink-tertiary">
                  {pubs.length} papers identified
                </span>
              </div>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-moss-700 hover:underline font-medium"
              >
                {pubs.every((p) => p.selected) ? "Deselect all" : "Select all"}
              </button>
            </div>

            {/* Publication List Card */}
            <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden mb-6 divide-y divide-edge-default shadow-xs">
              {pubs.map((pub) => (
                <div
                  key={pub.id}
                  onClick={() => togglePub(pub.id)}
                  className="p-4 flex items-start gap-3 hover:bg-surface-sunken/50 cursor-pointer select-none transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={pub.selected}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 rounded border-edge-default text-moss-600 focus:ring-moss-600 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-[13.5px] font-semibold text-ink-primary leading-snug mb-1">
                      {pub.title}
                    </div>
                    <div className="text-[11px] text-ink-tertiary">
                      {pub.authors} · {pub.year} ·{" "}
                      <span className="text-moss-700 font-medium">
                        {pub.venue}
                      </span>
                    </div>
                  </div>
                  {pub.imported && (
                    <span className="text-[10px] font-bold text-moss-700 bg-moss-50 border border-moss-200 px-2 py-0.5 rounded uppercase shrink-0">
                      Imported
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Import Status or CTA */}
            {done ? (
              <div className="p-3.5 rounded-lg bg-moss-50 border border-moss-200 text-moss-700 text-xs flex items-center gap-2 mb-4">
                <Check size={14} />
                <span>
                  <strong>{importedCount} publications</strong> successfully imported to your library.
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleImport}
                disabled={selectedCount === 0 || importing}
                className={`w-full py-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
                  selectedCount > 0 && !importing
                    ? "bg-moss-600 hover:bg-moss-700 text-white cursor-pointer"
                    : "bg-edge-default text-ink-tertiary cursor-not-allowed"
                }`}
              >
                {importing ? (
                  <>
                    <RotateCw size={14} className="animate-spin" />
                    Importing {selectedCount} publications…
                  </>
                ) : (
                  <>Import selected ({selectedCount})</>
                )}
              </button>
            )}
          </div>
        )}
      </SetupShell>

      <BottomNav
        onBack={onBack}
        onContinue={onContinue}
        onSkip={onSkip}
        showSkip
        continueLabel="Review Research Context"
      />
    </>
  );
}

// ─── Step 6: Review Context ───────────────────────────────────────────────────

function ReviewContext({
  setupData,
  onBack,
  onContinue,
  onEdit,
}: {
  setupData: SetupData;
  onBack: () => void;
  onContinue: () => void;
  onEdit: (step: Screen) => void;
}) {
  const importedPubs = setupData.publications.filter((p) => p.imported);

  return (
    <>
      <SetupShell>
        <PageTitle subtitle="Confirm your customized research profile. You can jump directly into any section to make updates before entering Cambium.">
          Review your research context.
        </PageTitle>

        <div className="space-y-4 mb-8">
          {/* Academic Identity */}
          <div className="p-5 rounded-xl bg-surface-raised border border-edge-default shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary">
                Academic Identity
              </span>
              <button
                type="button"
                onClick={() => onEdit("orcid")}
                className="text-xs text-moss-700 font-semibold hover:underline"
              >
                Edit
              </button>
            </div>
            {setupData.orcidConnected ? (
              <div>
                <div className="text-sm font-semibold text-ink-primary">
                  {setupData.orcidName || "Imthiyas"}
                </div>
                <div className="text-xs text-ink-tertiary font-mono">
                  ORCID {setupData.orcidId || "0000-0002-1234-5678"}
                </div>
              </div>
            ) : (
              <span className="text-xs text-ink-tertiary italic">
                No ORCID connected
              </span>
            )}
          </div>

          {/* Research Interests */}
          <div className="p-5 rounded-xl bg-surface-raised border border-edge-default shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary">
                Domain Interests
              </span>
              <button
                type="button"
                onClick={() => onEdit("interests")}
                className="text-xs text-moss-700 font-semibold hover:underline"
              >
                Edit
              </button>
            </div>
            {setupData.interests.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {setupData.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-xs px-2.5 py-0.5 bg-moss-50 border border-moss-200 text-moss-700 rounded-full font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-ink-tertiary italic">
                None selected
              </span>
            )}
          </div>

          {/* Research Topics */}
          <div className="p-5 rounded-xl bg-surface-raised border border-edge-default shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary">
                Specialized Topics
              </span>
              <button
                type="button"
                onClick={() => onEdit("topics")}
                className="text-xs text-moss-700 font-semibold hover:underline"
              >
                Edit
              </button>
            </div>
            {setupData.topics.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {setupData.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs px-2.5 py-0.5 bg-surface-sunken border border-edge-default text-ink-primary rounded-full font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-ink-tertiary italic">
                None selected
              </span>
            )}
          </div>

          {/* Publications */}
          <div className="p-5 rounded-xl bg-surface-raised border border-edge-default shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary">
                Indexed Publications
              </span>
              <button
                type="button"
                onClick={() => onEdit("publications")}
                className="text-xs text-moss-700 font-semibold hover:underline"
              >
                Edit
              </button>
            </div>
            {importedPubs.length > 0 ? (
              <div className="space-y-2">
                {importedPubs.slice(0, 3).map((pub) => (
                  <div key={pub.id} className="text-xs">
                    <div className="font-medium text-ink-primary">
                      {pub.title}
                    </div>
                    <div className="text-ink-tertiary text-[11px]">
                      {pub.authors} ({pub.year}) · {pub.venue}
                    </div>
                  </div>
                ))}
                {importedPubs.length > 3 && (
                  <div className="text-[11px] text-ink-tertiary font-medium">
                    +{importedPubs.length - 3} additional publications indexed
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs text-ink-tertiary italic">
                None imported yet
              </span>
            )}
          </div>
        </div>
      </SetupShell>

      <BottomNav
        onBack={onBack}
        onContinue={onContinue}
        continueLabel="Complete Setup"
      />
    </>
  );
}

// ─── Step 7: Setup Complete ───────────────────────────────────────────────────

function SetupComplete({
  setupData,
  onEdit,
  onFinish,
}: {
  setupData: SetupData;
  onEdit: () => void;
  onFinish: () => void;
}) {
  const importedPubs = setupData.publications.filter((p) => p.imported);

  const summaryItems = [
    {
      icon: <User size={16} className="text-moss-700" />,
      label: "Academic Identity",
      value: setupData.orcidConnected
        ? setupData.orcidName || "Imthiyas"
        : "Not connected",
      empty: !setupData.orcidConnected,
    },
    {
      icon: <Layers size={16} className="text-moss-700" />,
      label: "Research Interests",
      value:
        setupData.interests.length > 0
          ? setupData.interests.slice(0, 3).join(", ") +
            (setupData.interests.length > 3
              ? ` +${setupData.interests.length - 3} more`
              : "")
          : "None selected",
      empty: setupData.interests.length === 0,
    },
    {
      icon: <Sparkles size={16} className="text-moss-700" />,
      label: "Research Topics",
      value:
        setupData.topics.length > 0
          ? setupData.topics.slice(0, 3).join(", ") +
            (setupData.topics.length > 3
              ? ` +${setupData.topics.length - 3} more`
              : "")
          : "None selected",
      empty: setupData.topics.length === 0,
    },
    {
      icon: <BookOpen size={16} className="text-moss-700" />,
      label: "Publications",
      value:
        importedPubs.length > 0
          ? `${importedPubs.length} publication${
              importedPubs.length !== 1 ? "s" : ""
            } imported`
          : "None imported",
      empty: importedPubs.length === 0,
    },
  ];

  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      {/* Top bar */}
      <div className="px-6 sm:px-10 py-5 border-b border-edge-default flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CambiumLogo size={24} />
          <span className="font-serif font-bold text-base tracking-tight text-ink-primary">
            CAMBIUM
          </span>
        </div>
        <span className="text-[10px] font-bold text-moss-700 bg-moss-50 border border-moss-200 px-2 py-0.5 rounded uppercase tracking-wider">
          Complete
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-lg w-full">
          {/* Hero checkmark icon */}
          <div className="w-14 h-14 rounded-2xl bg-moss-600 text-white flex items-center justify-center mb-6 shadow-xs">
            <Check size={28} />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal tracking-tight mb-2 leading-tight">
            Your research world is ready.
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary mb-8 leading-relaxed">
            Cambium has been personalized around your research context. Explore your workspace, discover literature, and uncover grant opportunities.
          </p>

          {/* Summary card */}
          <div className="bg-surface-raised border border-edge-default rounded-xl overflow-hidden mb-8 shadow-xs divide-y divide-edge-default">
            <div className="px-5 py-3 bg-surface-sunken border-b border-edge-default">
              <span className="text-[10px] font-bold tracking-wider uppercase text-ink-tertiary">
                Research Context Summary
              </span>
            </div>
            {summaryItems.map((item) => (
              <div key={item.label} className="p-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-moss-50 border border-moss-200/60 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary mb-0.5">
                    {item.label}
                  </div>
                  <div
                    className={`text-xs sm:text-[13px] truncate ${
                      item.empty
                        ? "text-ink-tertiary italic"
                        : "text-ink-primary font-medium"
                    }`}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Primary Action wired to Workspace Provisioning State */}
            <button
              type="button"
              onClick={onFinish}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-moss-600 hover:bg-moss-700 text-white font-semibold text-sm transition-all shadow-xs text-center cursor-pointer border-0"
            >
              Go to Dashboard
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="px-4 py-2.5 text-xs sm:text-sm text-ink-tertiary hover:text-ink-primary underline underline-offset-2 transition-colors text-center"
            >
              Edit research context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Screen Assembly Component ───────────────────────────────────────────

export default function WelcomeOnboardingPage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const router = useRouter();

  const [setupData, setSetupData] = useState<SetupData>({
    orcidConnected: false,
    orcidName: "",
    orcidId: "",
    interests: [],
    topics: [],
    publications: [],
  });

  const steps: Screen[] = [
    "welcome",
    "orcid",
    "interests",
    "topics",
    "publications",
    "review",
    "complete",
  ];
  const currentStep = steps.indexOf(screen);

  const goTo = (s: Screen) => setScreen(s);

  const updateSetup = (patch: Partial<SetupData>) =>
    setSetupData((prev) => ({ ...prev, ...patch }));

  return (
    <div className="min-h-screen bg-surface-base font-sans select-none text-ink-primary">
      {screen !== "welcome" && screen !== "complete" && (
        <StepIndicator
          steps={["ORCID", "Interests", "Topics", "Publications", "Review"]}
          current={currentStep - 1}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full"
        >
          {screen === "welcome" && (
            <SetupWelcome
              onStart={() => goTo("orcid")}
              onSkip={() => setShowExitConfirm(true)}
            />
          )}

          {screen === "orcid" && (
            <ConnectORCID
              setupData={setupData}
              updateSetup={updateSetup}
              onBack={() => goTo("welcome")}
              onContinue={() => goTo("interests")}
              onSkip={() => goTo("interests")}
            />
          )}

          {screen === "interests" && (
            <ResearchInterests
              setupData={setupData}
              updateSetup={updateSetup}
              onBack={() => goTo("orcid")}
              onContinue={() => goTo("topics")}
              onSkip={() => setShowExitConfirm(true)}
            />
          )}

          {screen === "topics" && (
            <ResearchTopics
              setupData={setupData}
              updateSetup={updateSetup}
              onBack={() => goTo("interests")}
              onContinue={() => goTo("publications")}
              onSkip={() => setShowExitConfirm(true)}
            />
          )}

          {screen === "publications" && (
            <ImportPublications
              setupData={setupData}
              updateSetup={updateSetup}
              onBack={() => goTo("topics")}
              onContinue={() => goTo("review")}
              onSkip={() => goTo("review")}
            />
          )}

          {screen === "review" && (
            <ReviewContext
              setupData={setupData}
              onBack={() => goTo("publications")}
              onContinue={() => goTo("complete")}
              onEdit={(step) => goTo(step)}
            />
          )}

          {screen === "complete" && (
            <SetupComplete
              setupData={setupData}
              onEdit={() => goTo("review")}
              onFinish={() => setIsProvisioning(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <WorkspaceProvisioningModal
        isOpen={isProvisioning}
        onComplete={() => router.push("/dashboard")}
        destinationUrl="/dashboard"
        userName={setupData.orcidName || "Dr. Alex Rivera"}
      />

      {showExitConfirm && (
        <ExitConfirmModal
          onConfirm={() => router.push("/dashboard")}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}
    </div>
  );
}
