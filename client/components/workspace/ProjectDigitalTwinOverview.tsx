"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Database,
  Download,
  Share2,
  Sparkles,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Lock,
  Layers,
  Award,
  Check,
} from "lucide-react";

export interface ProjectMilestoneItem {
  id: string;
  stageNum: number;
  stageName: string;
  task: string;
  description: string;
  done: boolean;
  requiredForAudit: boolean;
}

export interface DatasetVaultEntry {
  id: string;
  name: string;
  size: string;
  samples: string;
  sha256: string;
  verified: boolean;
}

const INITIAL_MILESTONES: ProjectMilestoneItem[] = [
  {
    id: "m-1",
    stageNum: 1,
    stageName: "Hypothesis & Literature Synthesis",
    task: "Ingest 20+ Seminal Papers & Synthesize Conflicting Claims",
    description: "Map state-of-the-art baselines across MICCAI/Nature MI and establish empirical hypothesis.",
    done: true,
    requiredForAudit: true,
  },
  {
    id: "m-2",
    stageNum: 1,
    stageName: "Hypothesis & Literature Synthesis",
    task: "Formalize Specific Aims & Mathematical Problem Formulation",
    description: "Define objective function, constraints, and statistical power calculations (N >= 4,000).",
    done: true,
    requiredForAudit: true,
  },
  {
    id: "m-3",
    stageNum: 2,
    stageName: "Empirical Collection & Model Training",
    task: "Cryptographic Hashing of Multi-Site Patient Scans",
    description: "Generate SHA-256 manifest of BraTS & OASIS cohorts to guarantee immutable data provenance.",
    done: true,
    requiredForAudit: true,
  },
  {
    id: "m-4",
    stageNum: 2,
    stageName: "Empirical Collection & Model Training",
    task: "Train Foundation ViT Backbone with 5-Fold Stratified Cross-Validation",
    description: "Execute 100 epochs on GPU cluster; log loss curves and checkpoint weights.",
    done: true,
    requiredForAudit: true,
  },
  {
    id: "m-5",
    stageNum: 3,
    stageName: "Peer Review & Verification Audit",
    task: "Run Statistical p-value Replication & Permutation Test",
    description: "Demonstrate p < 0.001 effect size over 3D U-Net baseline with Bonferroni correction.",
    done: false,
    requiredForAudit: true,
  },
  {
    id: "m-6",
    stageNum: 3,
    stageName: "Peer Review & Verification Audit",
    task: "Internal Double-Blind Lab Critique & Safety Failure Mode Stress Test",
    description: "Evaluate model against 0.5T low-field scanner hardware drift and synthetic noise artifacts.",
    done: false,
    requiredForAudit: false,
  },
  {
    id: "m-7",
    stageNum: 4,
    stageName: "Compliance & Institutional Defense",
    task: "Export HIPAA/IRB De-Identification Compliance Attestation",
    description: "Institutional compliance officer signoff and verified anonymization audit ledger.",
    done: false,
    requiredForAudit: true,
  },
  {
    id: "m-8",
    stageNum: 5,
    stageName: "Dissemination & Grant Closeout",
    task: "Publish Open-Access Preprint & Deposit Code Capsule to Zenodo/GitHub",
    description: "Generate DOI, archive frozen Docker container, and submit final expenditure report.",
    done: false,
    requiredForAudit: true,
  },
];

const INITIAL_DATASETS: DatasetVaultEntry[] = [
  {
    id: "ds-1",
    name: "brats-2024-t1t2-norm.h5",
    size: "14.2 GB",
    samples: "2,400 3D MRI volumes",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    verified: true,
  },
  {
    id: "ds-2",
    name: "oasis-3-multisite-longitudinal.zst",
    size: "8.6 GB",
    samples: "1,820 longitudinal scans",
    sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    verified: true,
  },
  {
    id: "ds-3",
    name: "adni-clinical-eval-split.csv",
    size: "420 MB",
    samples: "600 held-out patient scans",
    sha256: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    verified: true,
  },
];

export function ProjectDigitalTwinOverview() {
  const router = useRouter();
  const [milestones, setMilestones] = useState<ProjectMilestoneItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cambium_digital_twin_milestones");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return INITIAL_MILESTONES;
  });

  const [filterStage, setFilterStage] = useState<number | "all">("all");
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cambium_digital_twin_milestones", JSON.stringify(milestones));
    }
  }, [milestones]);

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };

  const readinessScore = useMemo(() => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter((m) => m.done).length;
    return Math.round((completed / milestones.length) * 100);
  }, [milestones]);

  const auditReadiness = useMemo(() => {
    const required = milestones.filter((m) => m.requiredForAudit);
    const completedRequired = required.filter((m) => m.done).length;
    return Math.round((completedRequired / required.length) * 100);
  }, [milestones]);

  const handleExportStatus = () => {
    const payload = {
      project: "Multimodal Foundation Models for Low-Resource Clinical Imaging",
      institution: "MIT CSAIL & Cambium Scholarly Consortia",
      readinessScore: `${readinessScore}%`,
      auditReadiness: `${auditReadiness}%`,
      connectedGrant: {
        award: "NSF Cyber-Physical Systems Award #240891",
        budget: "$380,000",
        expended: "$214,500",
        remaining: "$165,500",
        daysRemaining: 184,
      },
      milestones,
      datasets: INITIAL_DATASETS,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cambium-project-digital-twin-status.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInjectIntoProposal = () => {
    const statusSummary = `PROJECT DIGITAL TWIN STATUS:\nReadiness: ${readinessScore}%\nCompleted Milestones: ${milestones.filter(m => m.done).length} / ${milestones.length}\nAudit Compliance: ${auditReadiness}%\nActive Grant: NSF Award #240891 ($165,500 remaining, 184 days)`;
    localStorage.setItem("cambium_injected_digital_twin", statusSummary);
    setCopiedStatus(true);
    setTimeout(() => {
      setCopiedStatus(false);
      router.push("/workspace");
    }, 1200);
  };

  const filteredMilestones = useMemo(() => {
    if (filterStage === "all") return milestones;
    return milestones.filter((m) => m.stageNum === filterStage);
  }, [milestones, filterStage]);

  return (
    <div className="w-full flex flex-col space-y-6 text-ink-primary select-none">
      {/* ── Top Header Banner ── */}
      <div className="p-6 rounded-2xl border border-edge-default bg-surface-raised shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-edge-default">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss-50 border border-moss-200/80 text-moss-800 text-xs font-mono font-semibold tracking-wide">
              <ShieldCheck size={14} className="text-moss-700" />
              <span>PROJECT DIGITAL TWIN · LIVING STATUS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-moss-600 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-ink-primary tracking-tight">
              Multimodal Foundation Models for Low-Resource Clinical Imaging
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
              Real-time mirror of project readiness, cryptographically vaulted datasets, grant burn rate, and institutional compliance milestones.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportStatus}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-edge-default bg-surface-base hover:bg-surface-sunken text-xs font-medium text-ink-primary transition-all shadow-xs"
              title="Export complete Digital Twin status manifest"
            >
              <Download size={14} className="text-ink-secondary" />
              <span>Export Report</span>
            </button>
            <button
              type="button"
              onClick={handleInjectIntoProposal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-moss-600 hover:bg-moss-700 text-white text-xs font-semibold transition-all shadow-xs"
              title="Inject current milestone readiness into active proposal draft"
            >
              {copiedStatus ? <Check size={14} /> : <FileText size={14} />}
              <span>{copiedStatus ? "Injected!" : "Inject to Proposal"}</span>
            </button>
          </div>
        </div>

        {/* ── 3 Key Telemetry Cards: Readiness, Grant Burn Rate, Dataset Cryptography ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Card 1: Project Readiness Score */}
          <div className="p-4 rounded-xl border border-edge-default bg-surface-base space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-tertiary">
                Readiness Score
              </span>
              <span className="text-xs font-mono font-semibold text-moss-700">
                {milestones.filter((m) => m.done).length} / {milestones.length} Tasks
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-ink-primary">
                {readinessScore}%
              </span>
              <span className="text-xs font-medium text-moss-700">
                {readinessScore >= 80 ? "Pre-Submission Ready" : readinessScore >= 50 ? "Execution Phase" : "Inception Phase"}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
              <div
                className="h-full bg-moss-600 transition-all duration-500 rounded-full"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <div className="text-[11px] text-ink-tertiary flex items-center justify-between pt-1">
              <span>Audit Compliance Gate:</span>
              <span className="font-mono font-semibold text-ink-secondary">{auditReadiness}% Pass</span>
            </div>
          </div>

          {/* Card 2: Connected Grant Budget & Countdown */}
          <div className="p-4 rounded-xl border border-edge-default bg-surface-base space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-tertiary">
                Active Grant Budget
              </span>
              <span className="text-[11px] font-mono text-moss-700 bg-moss-50 px-2 py-0.5 rounded border border-moss-200/60">
                NSF #240891
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-ink-primary">
                $165.5k
              </span>
              <span className="text-xs font-medium text-ink-tertiary">
                remaining of $380k
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
              <div
                className="h-full bg-amber transition-all duration-500 rounded-full"
                style={{ width: "56%" }}
              />
            </div>
            <div className="text-[11px] text-ink-tertiary flex items-center justify-between pt-1">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-ink-tertiary" />
                <span>Closeout Window:</span>
              </span>
              <span className="font-mono font-semibold text-ink-secondary">184 Days Left</span>
            </div>
          </div>

          {/* Card 3: Vaulted Dataset Cryptography */}
          <div className="p-4 rounded-xl border border-edge-default bg-surface-base space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-tertiary">
                Vaulted Datasets
              </span>
              <span className="text-[11px] font-mono text-moss-700 flex items-center gap-1">
                <Lock size={11} />
                <span>SHA-256 Intact</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-ink-primary">
                3
              </span>
              <span className="text-xs font-medium text-ink-tertiary">
                Cohorts (23.2 GB Total)
              </span>
            </div>
            <div className="text-[11px] text-ink-secondary font-mono bg-surface-sunken p-1.5 rounded border border-edge-default truncate">
              Root Hash: e3b0c44298fc1c14...b855
            </div>
            <div className="text-[11px] text-ink-tertiary flex items-center justify-between pt-1">
              <span>Provenance Verification:</span>
              <span className="font-semibold text-moss-700">100% Tamper-Proof</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5-Stage Milestone Progression Desk ── */}
      <div className="p-6 rounded-2xl border border-edge-default bg-surface-raised shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-edge-default">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-moss-700" />
            <h2 className="text-base font-semibold text-ink-primary">
              Lifecycle Milestones & Institutional Verification
            </h2>
          </div>

          {/* Stage Filters */}
          <div className="flex items-center gap-1 bg-surface-base p-1 rounded-lg border border-edge-default">
            {[
              { id: "all", label: "All" },
              { id: 1, label: "1. Hypothesize" },
              { id: 2, label: "2. Train" },
              { id: 3, label: "3. Review" },
              { id: 4, label: "4. Compliance" },
              { id: 5, label: "5. Disseminate" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilterStage(s.id as number | "all")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  filterStage === s.id
                    ? "bg-moss-600 text-white shadow-xs"
                    : "text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Checklist Table */}
        <div className="space-y-2.5">
          {filteredMilestones.map((m) => (
            <div
              key={m.id}
              onClick={() => toggleMilestone(m.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                m.done
                  ? "bg-moss-50/30 border-moss-200/80 hover:border-moss-300"
                  : "bg-surface-base border-edge-default hover:border-edge-strong"
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                  m.done
                    ? "bg-moss-600 border-moss-600 text-white"
                    : "border-edge-strong hover:border-moss-600 bg-surface-raised"
                }`}
                aria-label={`Toggle milestone ${m.task}`}
              >
                {m.done && <Check size={13} strokeWidth={2.5} />}
              </button>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-surface-sunken border border-edge-default text-ink-secondary">
                    Stage {m.stageNum} · {m.stageName}
                  </span>
                  {m.requiredForAudit && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-light text-amber border border-amber/20">
                      Audit Required
                    </span>
                  )}
                </div>
                <div
                  className={`text-sm font-semibold leading-snug transition-colors ${
                    m.done ? "text-ink-primary line-through opacity-75" : "text-ink-primary"
                  }`}
                >
                  {m.task}
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="shrink-0 self-center">
                <span
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                    m.done
                      ? "bg-moss-50 text-moss-700 border-moss-200"
                      : "bg-surface-sunken text-ink-tertiary border-edge-default"
                  }`}
                >
                  {m.done ? "COMPLETED" : "PENDING"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cryptographic Dataset Vault Ledger ── */}
      <div className="p-6 rounded-2xl border border-edge-default bg-surface-raised shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-edge-default">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-moss-700" />
            <h2 className="text-base font-semibold text-ink-primary">
              Immutable Dataset Manifest & Cryptographic Hashes
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-tertiary">
            W3C Verifiable Credentials Standard
          </span>
        </div>

        <div className="space-y-3">
          {INITIAL_DATASETS.map((ds) => (
            <div
              key={ds.id}
              className="p-3.5 rounded-xl border border-edge-default bg-surface-base flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold font-mono text-ink-primary">
                    {ds.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-sunken text-ink-tertiary">
                    {ds.size} · {ds.samples}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-ink-secondary flex items-center gap-1.5">
                  <Lock size={11} className="text-moss-600" />
                  <span className="text-ink-tertiary">SHA-256:</span>
                  <span className="truncate max-w-sm sm:max-w-md">{ds.sha256}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-moss-50 text-moss-700 border border-moss-200">
                  <CheckCircle2 size={12} />
                  <span>Tamper-Proof</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

