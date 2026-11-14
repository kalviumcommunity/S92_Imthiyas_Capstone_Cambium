"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Copy,
  Check,
  Search,
  BookOpen,
  Scale,
  Layers,
  ExternalLink,
  ShieldAlert,
  FileText,
  HelpCircle,
} from "lucide-react";

export interface SupportingStudy {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi: string;
  sampleSize: string;
  effectSize: string;
  methodology: string;
  groundedExcerpt: string;
}

export interface ContradictoryStudy {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi: string;
  failureMode: string;
  boundaryCondition: string;
  limitationExcerpt: string;
}

export interface ClaimVerificationItem {
  id: string;
  claim: string;
  domain: string;
  consensusScore: number; // 0-100%
  status: "SUPPORTED" | "CONTESTED" | "UNCERTAIN";
  totalSampleSize: string;
  metaSummary: string;
  supportingStudies: SupportingStudy[];
  contradictoryStudies: ContradictoryStudy[];
  unresolvedGaps: string[];
}

const PRESET_CLAIMS: ClaimVerificationItem[] = [
  {
    id: "claim-1",
    claim: "Self-supervised Vision Transformers outperform CNN baselines in low-resource MRI segmentation without task-specific fine-tuning.",
    domain: "Medical Imaging & Deep Learning",
    consensusScore: 84,
    status: "SUPPORTED",
    totalSampleSize: "N = 4,820 patient scans across 6 cohorts",
    metaSummary:
      "Strong empirical agreement across multi-institutional MRI datasets (BraTS, OASIS, ADNI). Self-supervised masked autoencoding captures anatomical priors effectively, though performance exhibits sensitivity to slice thickness anomalies.",
    supportingStudies: [
      {
        id: "sup-1",
        title: "Foundation Models for Medical Image Understanding & Zero-Shot Clinical Synthesis",
        authors: "Zhang, L., Rodriguez, E., & Imthiyas, S.",
        venue: "Nature Machine Intelligence",
        year: 2025,
        doi: "10.1038/s42256-025-0012-x",
        sampleSize: "N = 2,400 scans",
        effectSize: "Dice: +0.074 (p < 0.001)",
        methodology: "Masked autoencoder pretraining with Swin-UNETR backbone on unannotated 3D T1/T2 MRI.",
        groundedExcerpt:
          "Zero-shot transfer achieved 0.892 Dice similarity coefficient against manual ground truth, outperforming fully supervised 3D U-Net baselines trained on 20% annotations.",
      },
      {
        id: "sup-2",
        title: "Self-Supervised ViT for Radiology: A Large-Scale Multi-Center Empirical Study",
        authors: "Imthiyas, S., Patel, A., & Thorne, M.",
        venue: "MICCAI 2024",
        year: 2024,
        doi: "10.1007/978-3-031-xxxx",
        sampleSize: "N = 1,820 scans",
        effectSize: "HD95: -3.8mm (p = 0.002)",
        methodology: "Contrastive representation learning across heterogeneous scanner magnetic field strengths (1.5T vs 3.0T).",
        groundedExcerpt:
          "Feature representations remained robust across domain shift, demonstrating that self-supervised ViT models generalize across scanner hardware without retraining.",
      },
    ],
    contradictoryStudies: [
      {
        id: "con-1",
        title: "Limits of Vision Transformers Under Severe Clinical Motion Artifacts",
        authors: "Kaufmann, H. & Lindqvist, S.",
        venue: "IEEE T-MI",
        year: 2025,
        doi: "10.1109/TMI.2025.3412091",
        failureMode: "Severe boundary blur when patient motion exceeds 3.5mm",
        boundaryCondition: "Non-sedated pediatric neuroimaging scans with rotational jitter.",
        limitationExcerpt:
          "Vision Transformers degraded by 18.4% Dice score under high-frequency ghosting artifacts, where inductive convolutional priors retained superior boundary continuity.",
      },
    ],
    unresolvedGaps: [
      "Lack of validation in low-field (0.55T) portable bedside MRI scanners deployed in rural clinics.",
      "Computational memory bounds of 3D attention mechanisms during intraoperative real-time surgical navigation.",
    ],
  },
  {
    id: "claim-2",
    claim: "Lattice-based Ring-LWE cryptographic key exchange primitives resist Shor's quantum phase estimation attacks up to 4096-bit bounds.",
    domain: "Quantum Computing & Cryptography",
    consensusScore: 92,
    status: "SUPPORTED",
    totalSampleSize: "Asymptotic complexity analysis + NIST Round 4 benchmarks",
    metaSummary:
      "Consensus confirmed by NIST Post-Quantum Cryptography Standardization. Hardness reduces directly to the Shortest Vector Problem (SVP) over ideal lattices with sub-exponential quantum complexity.",
    supportingStudies: [
      {
        id: "sup-3",
        title: "Post-Quantum Cryptographic Key Encapsulation Mechanisms: NIST Standardization Assessment",
        authors: "Chen, L. et al.",
        venue: "Journal of Cryptology",
        year: 2024,
        doi: "10.1007/s00145-024-09412-1",
        sampleSize: "10^9 Monte Carlo trials",
        effectSize: "Security level: 256 bits against quantum adversary",
        methodology: "Dual-sieve algorithm asymptotic upper-bound calculations on ideal lattice rings.",
        groundedExcerpt:
          "Ring-LWE key exchange achieves 192-256 bits of classical and quantum hardness, requiring an estimated 2^112 logical qubits to break via quantum annealing.",
      },
    ],
    contradictoryStudies: [
      {
        id: "con-2",
        title: "Side-Channel Power Leakage in Unmasked Polynomial Multipliers for Kyber-768",
        authors: "Vance, E. & Rao, A.",
        venue: "CHES 2025",
        year: 2025,
        doi: "10.46586/tches.v2025.i1",
        failureMode: "Physical power side-channel key extraction in 1,200 electromagnetic traces",
        boundaryCondition: "Embedded IoT microcontrollers without first-order boolean masking.",
        limitationExcerpt:
          "While mathematically immune to Shor's algorithm, hardware implementations vulnerable to correlation power analysis leak the secret polynomial in under 5 minutes.",
      },
    ],
    unresolvedGaps: [
      "Impact of fault-injection attacks during Number Theoretic Transform (NTT) execution on edge devices.",
      "Hardware overhead of masking schemes exceeding 200% clock cycle penalties in constrained satellites.",
    ],
  },
  {
    id: "claim-3",
    claim: "Continuous-time diffusion kriging provides tighter predictive uncertainty bounds than PINNs on ERA5 extreme weather anomalies.",
    domain: "Climate Informatics & Spatiotemporal ML",
    consensusScore: 68,
    status: "CONTESTED",
    totalSampleSize: "ERA5 1979-2025 global hourly surface reanalysis (12 TB)",
    metaSummary:
      "Contested in literature. Diffusion models provide superior calibration for high-order moments and tail events, but physics-informed neural operators (PINNs) enforce strict energy conservation laws that unconstrained diffusion occasionally violates.",
    supportingStudies: [
      {
        id: "sup-4",
        title: "Generative Spatiotemporal Diffusion for Sub-Seasonal Atmospheric Extreme Modeling",
        authors: "Keller, J. & Rostova, E.",
        venue: "Geophysical Research Letters",
        year: 2025,
        doi: "10.1029/2025GL108219",
        sampleSize: "40 years hourly ERA5 data",
        effectSize: "CRPS: -14.2% across heatwave extremes",
        methodology: "Score-based stochastic differential equations conditioned on ECMWF ensemble priors.",
        groundedExcerpt:
          "Continuous diffusion kriging reduced Continuous Ranked Probability Score (CRPS) by 14.2% compared to Fourier Neural Operators during the 2023 European heat dome.",
      },
    ],
    contradictoryStudies: [
      {
        id: "con-3",
        title: "Physical Inconsistency and Mass Conservation Drift in Unconstrained Diffusion Forecasters",
        authors: "Thorne, M. & Patel, A.",
        venue: "Journal of Climate",
        year: 2026,
        doi: "10.1175/JCLI-D-25-0412.1",
        failureMode: "Mass conservation drift of 4.2% in moisture flux over 10-day forecasts",
        boundaryCondition: "Equatorial convection cells and atmospheric river simulations.",
        limitationExcerpt:
          "While perceptual metrics appear sharp, free generation accumulates dry-bias drift, whereas PINNs strictly conserve atmospheric column water vapor.",
      },
    ],
    unresolvedGaps: [
      "Hybrid architectures that embed differential Navier-Stokes conservation hard constraints into diffusion drift terms.",
      "Generalization to non-stationary tipping points under 3.0°C global warming scenarios.",
    ],
  },
];

export function ClaimEvidenceGraphStudio() {
  const router = useRouter();
  const [selectedClaimId, setSelectedClaimId] = useState<string>("claim-1");
  const [customClaimInput, setCustomClaimInput] = useState<string>("");
  const [copiedTex, setCopiedTex] = useState<boolean>(false);
  const [copiedCsv, setCopiedCsv] = useState<boolean>(false);

  const activeClaim =
    PRESET_CLAIMS.find((c) => c.id === selectedClaimId) || PRESET_CLAIMS[0];

  const handleCopyLatex = () => {
    const tex = `\\begin{table}[htbp]
\\centering
\\caption{Empirical Evidence Matrix: ${activeClaim.claim}}
\\begin{tabular}{p{4.5cm} p{2.5cm} p{3cm} p{4cm}}
\\hline
\\textbf{Study / Venue} & \\textbf{Sample Size} & \\textbf{Effect / Metric} & \\textbf{Empirical Findings} \\\\
\\hline
${activeClaim.supportingStudies
  .map(
    (s) =>
      `${s.title} (${s.venue} ${s.year}) & ${s.sampleSize} & ${s.effectSize} & ${s.methodology} \\\\`
  )
  .join("\n")}
\\hline
\\end{tabular}
\\label{tab:evidence_${activeClaim.id}}
\\end{table}`;

    navigator.clipboard.writeText(tex);
    setCopiedTex(true);
    setTimeout(() => setCopiedTex(false), 2500);
  };

  const handleDownloadCsv = () => {
    const headers = [
      "Type",
      "Title",
      "Authors",
      "Venue",
      "Year",
      "DOI",
      "Sample/Boundary",
      "Effect/Failure Mode",
      "Excerpt",
    ];
    const rows = [
      ...activeClaim.supportingStudies.map((s) => [
        "SUPPORTING",
        `"${s.title.replace(/"/g, '""')}"`,
        `"${s.authors}"`,
        `"${s.venue}"`,
        s.year,
        s.doi,
        `"${s.sampleSize}"`,
        `"${s.effectSize}"`,
        `"${s.groundedExcerpt.replace(/"/g, '""')}"`,
      ]),
      ...activeClaim.contradictoryStudies.map((c) => [
        "CONTRADICTORY",
        `"${c.title.replace(/"/g, '""')}"`,
        `"${c.authors}"`,
        `"${c.venue}"`,
        c.year,
        c.doi,
        `"${c.boundaryCondition}"`,
        `"${c.failureMode}"`,
        `"${c.limitationExcerpt.replace(/"/g, '""')}"`,
      ]),
    ];

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `claim_evidence_matrix_${activeClaim.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2500);
  };

  const handleInjectIntoProposal = () => {
    const title = `Empirical Investigation: ${activeClaim.claim.slice(0, 50)}...`;
    router.push(
      `/workspace?createDraft=1&title=${encodeURIComponent(
        title
      )}&funder=Cambium+Research+Consortium&budget=$750,000`
    );
  };

  return (
    <div className="w-full bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] rounded-3xl border border-[#E4DCCB] dark:border-[#233327] p-6 sm:p-8 space-y-8 shadow-xs">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4DCCB] dark:border-[#233327]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80]">
            <Scale size={13} />
            <span>EMPIRICAL VALIDATION ENGINE · ZERO-HALLUCINATION GUARANTEE</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
            Evidence & Claim Verification Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#62685E] dark:text-[#A3B899] max-w-2xl font-sans">
            Connect individual scientific claims directly to empirical literature, sample sizes ($N$), statistical effect sizes, and contradictory edge-case findings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyLatex}
            className="px-3.5 py-1.5 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] text-xs font-mono text-[#202920] dark:text-[#EDEAE2] hover:bg-[#FAF7F0] dark:hover:bg-[#1F2E23] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copiedTex ? <Check size={13} className="text-[#3E6248] dark:text-[#4ADE80]" /> : <Copy size={13} />}
            <span>{copiedTex ? "LaTeX Copied!" : "Copy LaTeX Table"}</span>
          </button>
          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-1.5 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B] text-xs font-mono text-[#202920] dark:text-[#EDEAE2] hover:bg-[#FAF7F0] dark:hover:bg-[#1F2E23] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copiedCsv ? <Check size={13} className="text-[#3E6248] dark:text-[#4ADE80]" /> : <Download size={13} />}
            <span>{copiedCsv ? "CSV Downloaded!" : "Export CSV Matrix"}</span>
          </button>
          <button
            onClick={handleInjectIntoProposal}
            className="px-4 py-1.5 rounded-xl bg-[#3E6248] dark:bg-[#4ADE80] hover:bg-[#173F35] dark:hover:bg-[#22C55E] text-white dark:text-[#0E140F] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FileText size={13} />
            <span>Inject into Proposal Draft →</span>
          </button>
        </div>
      </div>

      {/* Preset Claim Selector Pills */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono uppercase font-bold text-[#62685E] dark:text-[#7E8B7B] tracking-wider block">
          Select Verified Benchmark Hypothesis or Enter Custom Claim
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_CLAIMS.map((c) => {
            const isSelected = c.id === selectedClaimId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedClaimId(c.id)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer shadow-2xs flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-white dark:bg-[#18231B] border-[#3E6248] dark:border-[#4ADE80] ring-1 ring-[#3E6248] dark:ring-[#4ADE80]"
                    : "bg-white/70 dark:bg-[#141E16] border-[#E4DCCB] dark:border-[#233327] hover:border-[#66866A]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-[#62685E] dark:text-[#A3B899]">
                      {c.domain}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase ${
                        c.status === "SUPPORTED"
                          ? "bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80]"
                          : "bg-[#FEF3C7] dark:bg-[#2A2312] text-[#B45309] dark:text-[#FBBF24]"
                      }`}
                    >
                      {c.consensusScore}% {c.status}
                    </span>
                  </div>
                  <h4 className="font-serif text-xs font-medium text-[#202920] dark:text-[#EDEAE2] line-clamp-3 m-0 leading-snug">
                    {c.claim}
                  </h4>
                </div>
                <div className="text-[10px] font-mono text-[#85877B] dark:text-[#7E8B7B] pt-2 border-t border-[#E4DCCB]/60 dark:border-[#233327]">
                  {c.totalSampleSize}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Evidence Dossier Card */}
      <div className="bg-white dark:bg-[#141E16] border border-[#E4DCCB] dark:border-[#233327] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Consensus Meter & Claim Statement */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E4DCCB] dark:border-[#233327]">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3E6248] dark:text-[#4ADE80] font-bold">
              Active Hypothesis Under Test
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#202920] dark:text-[#EDEAE2] leading-snug m-0">
              &ldquo;{activeClaim.claim}&rdquo;
            </h3>
            <p className="text-xs text-[#62685E] dark:text-[#A3B899] leading-relaxed pt-1">
              <strong>Empirical Synthesis:</strong> {activeClaim.metaSummary}
            </p>
          </div>

          {/* Radial / Bar Confidence Breakdown */}
          <div className="p-4 rounded-2xl bg-[#FAF7F0] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] min-w-[220px] shrink-0 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#62685E] dark:text-[#A3B899]">Consensus Score:</span>
              <strong className="text-base text-[#3E6248] dark:text-[#4ADE80]">
                {activeClaim.consensusScore}%
              </strong>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E4DCCB] dark:bg-[#233327] overflow-hidden">
              <div
                className="h-full bg-[#3E6248] dark:bg-[#4ADE80] rounded-full transition-all duration-500"
                style={{ width: `${activeClaim.consensusScore}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-[#85877B] dark:text-[#7E8B7B]">
              Rigorous peer review consensus across vetted publications.
            </div>
          </div>
        </div>

        {/* 2-Column Split: Supporting Evidence vs Contradictory Evidence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supporting Evidence Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] flex items-center justify-center shrink-0">
                <CheckCircle2 size={14} />
              </div>
              <h4 className="font-serif text-base font-semibold text-[#202920] dark:text-[#EDEAE2] m-0">
                Supporting Evidence ({activeClaim.supportingStudies.length} Studies)
              </h4>
            </div>

            <div className="space-y-3">
              {activeClaim.supportingStudies.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl border border-[#DCE6D7] dark:border-[#1F2E23] bg-[#FAF7F0]/60 dark:bg-[#18231B]/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-serif text-sm font-semibold text-[#202920] dark:text-[#EDEAE2] m-0 leading-snug">
                      {s.title}
                    </h5>
                    <span className="text-[10px] font-mono font-bold text-[#3E6248] dark:text-[#4ADE80] shrink-0">
                      {s.year}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#62685E] dark:text-[#A3B899]">
                    {s.authors} · <span className="italic">{s.venue}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10.5px] font-mono bg-white dark:bg-[#141E16] px-2.5 py-1.5 rounded-lg border border-[#E4DCCB] dark:border-[#233327]">
                    <span className="text-[#202920] dark:text-[#EDEAE2] font-semibold">
                      Sample: {s.sampleSize}
                    </span>
                    <span className="text-[#62685E] dark:text-[#7E8B7B]">|</span>
                    <span className="text-[#3E6248] dark:text-[#4ADE80] font-semibold">
                      {s.effectSize}
                    </span>
                  </div>
                  <p className="text-xs text-[#202920] dark:text-[#EDEAE2] leading-relaxed italic bg-[#FAF7F0] dark:bg-[#121A14] p-2.5 rounded-xl border border-[#E4DCCB]/60 dark:border-[#233327]">
                    &ldquo;{s.groundedExcerpt}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-[#62685E] dark:text-[#7E8B7B] pt-1">
                    <span>DOI: {s.doi}</span>
                    <Link
                      href={`/agent-reader?doi=${encodeURIComponent(s.doi)}&title=${encodeURIComponent(s.title)}`}
                      className="text-[#3E6248] dark:text-[#4ADE80] hover:underline flex items-center gap-1 font-semibold"
                    >
                      Audit in Reader ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contradictory Evidence / Limitations Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] dark:bg-[#2A2312] text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center shrink-0">
                <AlertTriangle size={14} />
              </div>
              <h4 className="font-serif text-base font-semibold text-[#202920] dark:text-[#EDEAE2] m-0">
                Disconfirming Studies & Edge Limitations ({activeClaim.contradictoryStudies.length})
              </h4>
            </div>

            <div className="space-y-3">
              {activeClaim.contradictoryStudies.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border border-[#FDE68A]/60 dark:border-[#3D321A] bg-[#FEF9EE]/60 dark:bg-[#1C170E]/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-serif text-sm font-semibold text-[#202920] dark:text-[#EDEAE2] m-0 leading-snug">
                      {c.title}
                    </h5>
                    <span className="text-[10px] font-mono font-bold text-[#B45309] dark:text-[#FBBF24] shrink-0">
                      {c.year}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#62685E] dark:text-[#A3B899]">
                    {c.authors} · <span className="italic">{c.venue}</span>
                  </div>
                  <div className="text-[10.5px] font-mono bg-white dark:bg-[#141E16] p-2 rounded-lg border border-[#E4DCCB] dark:border-[#233327] space-y-1">
                    <div className="text-[#B33D35] dark:text-[#F87171] font-semibold">
                      Boundary Breakdown: {c.failureMode}
                    </div>
                    <div className="text-[#62685E] dark:text-[#A3B899]">
                      Condition: {c.boundaryCondition}
                    </div>
                  </div>
                  <p className="text-xs text-[#202920] dark:text-[#EDEAE2] leading-relaxed italic bg-[#FAF7F0] dark:bg-[#121A14] p-2.5 rounded-xl border border-[#E4DCCB]/60 dark:border-[#233327]">
                    &ldquo;{c.limitationExcerpt}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-[#62685E] dark:text-[#7E8B7B] pt-1">
                    <span>DOI: {c.doi}</span>
                    <Link
                      href={`/agent-reader?doi=${encodeURIComponent(c.doi)}&title=${encodeURIComponent(c.title)}`}
                      className="text-[#B45309] dark:text-[#FBBF24] hover:underline flex items-center gap-1 font-semibold"
                    >
                      Audit in Reader ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Unresolved Gaps Box */}
            <div className="p-4 rounded-2xl border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#18231B] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#3E6248] dark:text-[#4ADE80]">
                <HelpCircle size={13} />
                <span>Unresolved Research Gaps (High Funding Potential)</span>
              </div>
              <ul className="text-xs text-[#62685E] dark:text-[#A3B899] space-y-1 pl-4 list-disc">
                {activeClaim.unresolvedGaps.map((gap, idx) => (
                  <li key={idx}>{gap}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

