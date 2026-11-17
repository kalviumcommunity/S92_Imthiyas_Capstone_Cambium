"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Layers,
  Sparkles,
  Search,
  ArrowRight,
  ExternalLink,
  BookOpen,
  DollarSign,
  AlertCircle,
  FileText,
  Download,
  Share2,
  Check,
  TrendingUp,
  Cpu,
  Dna,
  Stethoscope,
  Globe,
  Award,
} from "lucide-react";
import { fetchScholarlyWorks, ScholarlyWork } from "@/lib/scholarly-api";

export interface LandscapeStratumItem {
  id: string;
  title: string;
  subtitle: string;
  year?: number;
  authorsOrAgency?: string;
  metrics: string;
  tags: string[];
  description: string;
  externalUrl?: string;
  grantAmount?: string;
  gapSignificance?: "CRITICAL" | "MODERATE" | "EMERGING";
}

export interface DomainLandscape {
  domainId: string;
  domainName: string;
  iconName: string;
  tagline: string;
  strata: {
    foundations: LandscapeStratumItem[];
    preprints: LandscapeStratumItem[];
    researchGaps: LandscapeStratumItem[];
    grants: LandscapeStratumItem[];
  };
}

const PRESET_DOMAINS: DomainLandscape[] = [
  {
    domainId: "clinical-ai",
    domainName: "Low-Resource Clinical AI & Medical Imaging",
    iconName: "Stethoscope",
    tagline: "Bridging foundation models to multi-modal radiological diagnosis with sub-millimeter anatomical precision.",
    strata: {
      foundations: [
        {
          id: "fnd-1",
          title: "U-Net: Convolutional Networks for Biomedical Image Segmentation",
          subtitle: "Ronneberger et al. · MICCAI",
          year: 2015,
          authorsOrAgency: "Ronneberger, Fischer, & Brox",
          metrics: "68,400+ citations · Foundational Architecture",
          tags: ["Biomedical CNN", "Skip Connections", "Segmentation"],
          description: "Seminal symmetric encoder-decoder architecture providing the gold-standard baseline for 2D/3D biomedical image segmentation.",
          externalUrl: "https://arxiv.org/abs/1505.04597",
        },
        {
          id: "fnd-2",
          title: "Vision Transformers for Dense Radiographic Prediction",
          subtitle: "Dosovitskiy et al. · ICLR",
          year: 2021,
          authorsOrAgency: "Dosovitskiy, Beyer, Kolesnikov et al.",
          metrics: "34,200+ citations · Transformer Paradigm",
          tags: ["Self-Attention", "ViT", "Global Context"],
          description: "Demonstrated that pure transformer backbones can achieve state-of-the-art visual feature representation when pretrained on large corpora.",
          externalUrl: "https://arxiv.org/abs/2010.11929",
        },
      ],
      preprints: [
        {
          id: "prp-1",
          title: "Med-Zero: Zero-Shot Multi-Center 3D MRI Synthesis via Masked Flow Matching",
          subtitle: "Zhang et al. · arXiv:2502.04910",
          year: 2025,
          authorsOrAgency: "Zhang, Rodriguez, & Imthiyas",
          metrics: "Velocity: +380 reads/week · Continuous Flow",
          tags: ["Flow Matching", "Cross-Hospital", "MRI Harmonization"],
          description: "Generates high-fidelity 3.0T MRI priors from noisy 0.5T low-field point-of-care scans with provable anatomical volume conservation.",
          externalUrl: "https://arxiv.org/abs/2502.04910",
        },
        {
          id: "prp-2",
          title: "Self-Supervised Anatomic Tokens for Heterogeneous Histopathology Slides",
          subtitle: "Patel & Thorne · bioRxiv 2025.01",
          year: 2025,
          authorsOrAgency: "Patel, Thorne, & Chen",
          metrics: "Velocity: +240 reads/week · Gigapixel Pathology",
          tags: ["Histopathology", "Sparse Attention", "WSI"],
          description: "Hierarchical token reduction enabling gigapixel whole-slide classification on consumer GPUs with 98.4% AUROC.",
          externalUrl: "https://biorxiv.org",
        },
      ],
      researchGaps: [
        {
          id: "gap-1",
          title: "Catastrophic Domain Shift Across 0.5T to 7.0T Scanner Hardware",
          subtitle: "Empirical Divergence in Slice-Thickness Artifacts",
          gapSignificance: "CRITICAL",
          metrics: "Consensus: Contested (41% disagreement across 14 trials)",
          tags: ["Hardware Bias", "Scanner Drift", "Out-of-Distribution"],
          description: "Current models degrade by up to 34% Dice score when evaluating on low-cost scanners in rural clinics due to phase-encoding noise.",
        },
        {
          id: "gap-2",
          title: "Lack of Counterfactual Explanations for Surgical Margin Risk",
          subtitle: "Black-Box Confidence Failure in Intraoperative Margins",
          gapSignificance: "MODERATE",
          metrics: "Clinical Review Consensus: High Uncertainty",
          tags: ["Explainable AI", "Surgical Margin", "Safety Assurance"],
          description: "Surgeons require actionable boundary rationale rather than raw probability heatmaps to justify tissue excision during oncology resection.",
        },
      ],
      grants: [
        {
          id: "grt-1",
          title: "NIH R01: Robust Deep Learning for Point-of-Care Diagnostic Ultrasound & MRI",
          subtitle: "National Institute of Biomedical Imaging and Bioengineering (NIBIB)",
          grantAmount: "$1,850,000 over 4 Years",
          authorsOrAgency: "NIH / DHHS · CFDA 93.286",
          metrics: "RFP Active · Deadline: Oct 15, 2026",
          tags: ["Point-of-Care", "Low-Resource Diagnostics", "Hardware Invariance"],
          description: "Funds multi-center clinical trials validating machine learning models that remain invariant to equipment vendor and field strength.",
          externalUrl: "/opportunities",
        },
        {
          id: "grt-2",
          title: "ARPA-H Precision Surgical Guidance Initiative",
          subtitle: "Advanced Research Projects Agency for Health",
          grantAmount: "$3,400,000 Cooperative Agreement",
          authorsOrAgency: "ARPA-H Health Science Office",
          metrics: "Open Broad Agency Announcement",
          tags: ["Intraoperative Imaging", "Zero-Latency Inference", "Oncology"],
          description: "Supports cross-disciplinary consortia developing real-time intraoperative margin detection with verified clinical utility.",
          externalUrl: "/opportunities",
        },
      ],
    },
  },
  {
    domainId: "rna-structure",
    domainName: "RNA Secondary Structure & Foundation Models",
    iconName: "Dna",
    tagline: "Inferring dynamic riboswitch conformations, catalytic RNA motifs, and therapeutic RNA delivery vehicles.",
    strata: {
      foundations: [
        {
          id: "fnd-rna-1",
          title: "ViennaRNA Package 2.0: Dynamic Programming for Nucleic Acid Thermodynamics",
          subtitle: "Lorenz et al. · Algorithms for Molecular Biology",
          year: 2011,
          authorsOrAgency: "Lorenz, Bernhart, Honer zu Siederdissen et al.",
          metrics: "12,100+ citations · Thermodynamic Gold Standard",
          tags: ["Minimum Free Energy", "Partition Function", "Dynamic Programming"],
          description: "The classic algorithmic benchmark predicting base-pairing probability matrices from nearest-neighbor thermodynamic parameters.",
        },
        {
          id: "fnd-rna-2",
          title: "AlphaFold 3 Multimer Biomolecular Complex Prediction",
          subtitle: "Abramson et al. · Nature",
          year: 2024,
          authorsOrAgency: "Abramson, Adler, Dunger et al.",
          metrics: "2,840+ citations · All-Atom Diffusion",
          tags: ["RNA-Protein", "All-Atom", "Diffusion Architecture"],
          description: "Unified architecture predicting 3D coordinates of proteins, RNA, DNA, and chemical ligands with sub-angstrom accuracy.",
        },
      ],
      preprints: [
        {
          id: "prp-rna-1",
          title: "Ribo-Flow: Generative 3D Riboswitch Ensembles via Riemannian Flow Matching",
          subtitle: "Vance et al. · bioRxiv 2025.02",
          year: 2025,
          authorsOrAgency: "Vance, Thorne, & Chen",
          metrics: "Velocity: +420 reads/week · Conformational States",
          tags: ["Riboswitches", "Riemannian Flow", "Multi-State RNA"],
          description: "Captures kinetic transition states between active and inactive ligand-bound riboswitch aptamers directly from chemical probing profiles.",
        },
      ],
      researchGaps: [
        {
          id: "gap-rna-1",
          title: "Modeling Post-Transcriptional Chemical Modifications (m6A, Pseudouridine)",
          subtitle: "Standard Sequence Encoders Ignore Epitranscriptomic Topology",
          gapSignificance: "CRITICAL",
          metrics: "Literature Gap: Less than 8% of models support modified bases",
          tags: ["Epitranscriptomics", "m6A", "Modified Nucleotides"],
          description: "Over 170 chemical modifications alter RNA folding free energy, yet 92% of deep learning encoders assume a naive 4-letter alphabet (A, C, G, U).",
        },
      ],
      grants: [
        {
          id: "grt-rna-1",
          title: "NSF Molecular Foundations for Biotechnology (MFB): RNA Engineering",
          subtitle: "National Science Foundation · BIO/ENG Directorate",
          grantAmount: "$2,200,000 over 3 Years",
          authorsOrAgency: "NSF Division of Molecular and Cellular Biosciences",
          metrics: "Proposal Window Active · NSF 25-512",
          tags: ["RNA Therapeutics", "Epitranscriptomics", "Biotechnology"],
          description: "Accelerating predictive algorithms for de novo therapeutic mRNA and non-coding RNA structural dynamics.",
          externalUrl: "/opportunities",
        },
      ],
    },
  },
  {
    domainId: "quantum-ml",
    domainName: "Quantum Machine Learning & Optimization",
    iconName: "Cpu",
    tagline: "Exploring quantum neural tangents, parameterized circuits, and error-mitigated variational quantum eigensolvers.",
    strata: {
      foundations: [
        {
          id: "fnd-q-1",
          title: "Barren Plateaus in Quantum Neural Network Training Landscapes",
          subtitle: "McClean et al. · Nature Communications",
          year: 2018,
          authorsOrAgency: "McClean, Boixo, Smelyanskiy et al.",
          metrics: "1,980+ citations · Theoretical Barrier",
          tags: ["Barren Plateaus", "Gradient Vanishing", "Haar Measure"],
          description: "Proved that random quantum circuits suffer exponential gradient vanishing, imposing strict inductive bias constraints.",
        },
      ],
      preprints: [
        {
          id: "prp-q-1",
          title: "Equivariant Quantum Tensor Networks for Strongly Correlated Materials",
          subtitle: "Schumacher et al. · arXiv:2501.12984",
          year: 2025,
          authorsOrAgency: "Schumacher, Imthiyas, & Garcia",
          metrics: "Velocity: +190 reads/week · Permutation Symmetry",
          tags: ["Equivariance", "MPS", "Fermionic Simulation"],
          description: "Enforces point-group and particle-number conservation inside ansatz circuits, bypassing barren plateaus on 127-qubit QPUs.",
        },
      ],
      researchGaps: [
        {
          id: "gap-q-1",
          title: "Coherence-Time Bottlenecks in NISQ Real-Time Error Mitigation",
          subtitle: "Extrapolation Calibration Adds Excessive Circuit Overhead",
          gapSignificance: "CRITICAL",
          metrics: "Hardware Barrier: Zero-Noise Extrapolation triples circuit count",
          tags: ["NISQ", "Zero-Noise Extrapolation", "Qubit Fidelity"],
          description: "Current error mitigation methods scale exponentially with circuit depth, prohibiting deep quantum circuit evaluation on current hardware.",
        },
      ],
      grants: [
        {
          id: "grt-q-1",
          title: "DOE Office of Science: Quantum Algorithm & Testbed Development",
          subtitle: "Department of Energy · Advanced Scientific Computing Research (ASCR)",
          grantAmount: "$4,500,000 over 5 Years",
          authorsOrAgency: "U.S. Department of Energy",
          metrics: "Solicitation DE-FOA-0003180",
          tags: ["Quantum Algorithms", "Error Mitigation", "ASCR"],
          description: "Developing scalable variational algorithms for chemistry and materials simulation on heterogeneous quantum-classical testbeds.",
          externalUrl: "/opportunities",
        },
      ],
    },
  },
];

export function ResearchLandscapeExplorer() {
  const router = useRouter();
  const [selectedDomainId, setSelectedDomainId] = useState<string>("clinical-ai");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [activeStratum, setActiveStratum] = useState<"all" | "foundations" | "preprints" | "researchGaps" | "grants">("all");
  const [liveQuery, setLiveQuery] = useState<string>("");
  const [liveWorks, setLiveWorks] = useState<ScholarlyWork[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const currentDomain = useMemo(() => {
    return PRESET_DOMAINS.find((d) => d.domainId === selectedDomainId) || PRESET_DOMAINS[0];
  }, [selectedDomainId]);

  const handleLiveOpenAlexSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveQuery.trim()) return;
    setIsSearchingLive(true);
    try {
      const works = await fetchScholarlyWorks({ query: liveQuery.trim(), limit: 4 });
      setLiveWorks(works);
    } catch {
      setLiveWorks([]);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handleExportLandscape = () => {
    const data = {
      domain: currentDomain.domainName,
      tagline: currentDomain.tagline,
      exportedAt: new Date().toISOString(),
      strata: currentDomain.strata,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cambium-research-landscape-${currentDomain.domainId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyShareLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full flex flex-col space-y-6 text-ink-primary">
      {/* Header Banner */}
      <div className="p-6 rounded-xl border border-edge-default bg-surface-raised shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-edge-default">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss-50 border border-moss-200/80 text-moss-800 text-xs font-mono font-semibold tracking-wide">
              <Compass size={14} className="text-moss-700" />
              <span>RESEARCH LANDSCAPE EXPLORER</span>
              <span className="w-1.5 h-1.5 rounded-full bg-moss-600 animate-pulse" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink-primary tracking-tight">
              Evolutionary Knowledge & Funding Strata
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-3xl leading-relaxed">
              Maps how foundational breakthroughs evolve through current preprints, isolate structural research gaps, and unlock active grant RFPs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportLandscape}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-edge-default bg-surface-base hover:bg-surface-sunken text-xs font-medium text-ink-primary transition-all shadow-xs"
              title="Export complete landscape manifest as JSON"
            >
              <Download size={14} className="text-ink-secondary" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-edge-default bg-surface-base hover:bg-surface-sunken text-xs font-medium text-ink-primary transition-all shadow-xs"
              title="Share landscape view link"
            >
              {copiedLink ? <Check size={14} className="text-moss-600" /> : <Share2 size={14} className="text-ink-secondary" />}
              <span>{copiedLink ? "Link Copied" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Domain Selection Tabs */}
        <div className="pt-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-tertiary mr-1">
            Domain:
          </span>
          {PRESET_DOMAINS.map((domain) => (
            <button
              key={domain.domainId}
              type="button"
              onClick={() => {
                setSelectedDomainId(domain.domainId);
                setLiveWorks([]);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDomainId === domain.domainId
                  ? "bg-moss-700 text-white shadow-xs"
                  : "bg-surface-base border border-edge-default text-ink-secondary hover:text-ink-primary hover:border-edge-strong"
              }`}
            >
              {domain.domainId === "clinical-ai" && <Stethoscope size={13} />}
              {domain.domainId === "rna-structure" && <Dna size={13} />}
              {domain.domainId === "quantum-ml" && <Cpu size={13} />}
              <span>{domain.domainName}</span>
            </button>
          ))}
        </div>

        {/* Domain Tagline */}
        <div className="mt-3 px-3.5 py-2 rounded-md bg-surface-sunken/60 border border-edge-default/60 flex items-center justify-between text-xs text-ink-secondary">
          <span className="italic">{currentDomain.tagline}</span>
          <span className="text-ink-tertiary font-mono">4 Stratified Horizons</span>
        </div>
      </div>

      {/* Stratum Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1.5 bg-surface-raised p-1 rounded-lg border border-edge-default">
          {(
            [
              { id: "all", label: "All 4 Strata" },
              { id: "foundations", label: "1. Foundations" },
              { id: "preprints", label: "2. Preprints" },
              { id: "researchGaps", label: "3. Research Gaps" },
              { id: "grants", label: "4. Sponsoring Grants" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveStratum(t.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeStratum === t.id
                  ? "bg-moss-600 text-white shadow-xs"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Live OpenAlex Query Injector */}
        <form onSubmit={handleLiveOpenAlexSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <input
              type="text"
              value={liveQuery}
              onChange={(e) => setLiveQuery(e.target.value)}
              placeholder="Query live OpenAlex corpus..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-edge-default bg-surface-raised text-xs text-ink-primary placeholder:text-ink-tertiary focus:border-moss-600 focus:outline-none w-56 sm:w-64"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingLive || !liveQuery.trim()}
            className="px-3 py-1.5 rounded-lg bg-moss-600 hover:bg-moss-700 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-xs"
          >
            {isSearchingLive ? "Fetching..." : "Fetch Live"}
          </button>
        </form>
      </div>

      {/* Live OpenAlex Ingestion Banner if returned */}
      {liveWorks.length > 0 && (
        <div className="p-4 rounded-xl border border-moss-300 bg-moss-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-moss-900">
              <Sparkles size={14} className="text-moss-700" />
              <span>Live OpenAlex Ingestion ({liveWorks.length} Verified Papers)</span>
            </div>
            <button
              type="button"
              onClick={() => setLiveWorks([])}
              className="text-xs text-ink-tertiary hover:text-ink-primary"
            >
              Clear
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveWorks.map((work) => (
              <div
                key={work.id}
                className="p-3 rounded-lg border border-moss-200 bg-surface-raised space-y-1.5 shadow-xs"
              >
                <div className="text-xs font-semibold text-ink-primary line-clamp-1">
                  {work.title}
                </div>
                <div className="text-[11px] text-ink-secondary">
                  {Array.isArray(work.authors) ? work.authors.slice(0, 3).join(", ") : work.authors} ({work.year}) · {work.venue || "Scholarly Archive"}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-moss-700">
                    {work.cited || 0} Citations
                  </span>
                  <a
                    href={work.doi ? `https://doi.org/${work.doi}` : `/discover?q=${encodeURIComponent(work.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-moss-700 hover:underline"
                  >
                    <span>View Record</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Evolutionary Strata Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stratum 1: Foundations */}
        {(activeStratum === "all" || activeStratum === "foundations") && (
          <div className="flex flex-col space-y-3">
            <div className="p-3 rounded-lg bg-surface-raised border border-edge-default flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-primary uppercase tracking-wider">
                <BookOpen size={14} className="text-amber" />
                <span>1. Foundations</span>
              </div>
              <span className="text-[10px] font-mono text-ink-tertiary">High-Citation Baseline</span>
            </div>

            <div className="space-y-3 flex-1">
              {currentDomain.strata.foundations.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-edge-default hover:border-amber/40 bg-surface-raised transition-all shadow-xs space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-light text-amber border border-amber/20">
                      {item.year || "Foundational"}
                    </span>
                    <span className="text-[11px] font-mono text-ink-tertiary">
                      {item.metrics}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-ink-primary leading-snug group-hover:text-amber transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-surface-sunken border border-edge-default text-ink-tertiary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-edge-default/60 flex items-center justify-between">
                    <span className="text-[11px] text-ink-tertiary">
                      {item.authorsOrAgency}
                    </span>
                    <Link
                      href={`/discover?q=${encodeURIComponent(item.title)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-amber hover:underline"
                    >
                      <span>Explore</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stratum 2: Preprints & Emerging Frontiers */}
        {(activeStratum === "all" || activeStratum === "preprints") && (
          <div className="flex flex-col space-y-3">
            <div className="p-3 rounded-lg bg-surface-raised border border-edge-default flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-primary uppercase tracking-wider">
                <TrendingUp size={14} className="text-iris" />
                <span>2. Emerging Preprints</span>
              </div>
              <span className="text-[10px] font-mono text-ink-tertiary">arXiv / bioRxiv Velocity</span>
            </div>

            <div className="space-y-3 flex-1">
              {currentDomain.strata.preprints.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-edge-default hover:border-iris/40 bg-surface-raised transition-all shadow-xs space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-iris-light text-iris border border-iris/20">
                      Recent Frontier
                    </span>
                    <span className="text-[11px] font-mono text-ink-tertiary">
                      {item.metrics}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-ink-primary leading-snug group-hover:text-iris transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-surface-sunken border border-edge-default text-ink-tertiary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-edge-default/60 flex items-center justify-between">
                    <span className="text-[11px] text-ink-tertiary">
                      {item.authorsOrAgency}
                    </span>
                    <Link
                      href={`/agent-reader?q=${encodeURIComponent(item.title)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-iris hover:underline"
                    >
                      <span>Read AI</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stratum 3: Structural Research Gaps */}
        {(activeStratum === "all" || activeStratum === "researchGaps") && (
          <div className="flex flex-col space-y-3">
            <div className="p-3 rounded-lg bg-surface-raised border border-edge-default flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-primary uppercase tracking-wider">
                <AlertCircle size={14} className="text-rose-600" />
                <span>3. Research Gaps</span>
              </div>
              <span className="text-[10px] font-mono text-ink-tertiary">Unresolved Bottlenecks</span>
            </div>

            <div className="space-y-3 flex-1">
              {currentDomain.strata.researchGaps.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-rose-200/80 hover:border-rose-300 bg-surface-raised transition-all shadow-xs space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {item.gapSignificance || "UNSOLVED GAP"}
                    </span>
                    <span className="text-[10px] font-mono text-ink-tertiary">
                      Empirical Void
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-ink-primary leading-snug group-hover:text-rose-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-surface-sunken border border-edge-default text-ink-tertiary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-edge-default/60 flex items-center justify-between">
                    <span className="text-[11px] text-ink-tertiary font-mono">
                      {item.metrics}
                    </span>
                    <Link
                      href={`/intelligence`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 hover:underline"
                    >
                      <span>Synthesize</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stratum 4: Sponsoring Grants & RFP Alignment */}
        {(activeStratum === "all" || activeStratum === "grants") && (
          <div className="flex flex-col space-y-3">
            <div className="p-3 rounded-lg bg-surface-raised border border-edge-default flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-primary uppercase tracking-wider">
                <DollarSign size={14} className="text-moss-700" />
                <span>4. Sponsoring Grants</span>
              </div>
              <span className="text-[10px] font-mono text-ink-tertiary">Active Capital RFPs</span>
            </div>

            <div className="space-y-3 flex-1">
              {currentDomain.strata.grants.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-moss-200 hover:border-moss-400 bg-surface-raised transition-all shadow-xs space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-moss-50 text-moss-700 border border-moss-200">
                      {item.grantAmount || "Funded RFP"}
                    </span>
                    <span className="text-[11px] font-mono text-ink-tertiary">
                      {item.metrics}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-ink-primary leading-snug group-hover:text-moss-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded bg-surface-sunken border border-edge-default text-ink-tertiary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-edge-default/60 flex items-center justify-between">
                    <span className="text-[11px] text-ink-tertiary">
                      {item.authorsOrAgency}
                    </span>
                    <Link
                      href={item.externalUrl || "/opportunities"}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-moss-700 hover:underline"
                    >
                      <span>Apply RFP</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Synthesis Call-to-Action Bar */}
      <div className="p-4 rounded-xl bg-surface-raised border border-edge-default flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-moss-50 border border-moss-200/80 flex items-center justify-center shrink-0">
            <Layers size={20} className="text-moss-700" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink-primary">
              Ready to address one of these {currentDomain.domainName} gaps?
            </div>
            <div className="text-xs text-ink-secondary">
              Inject this entire evolutionary stratum directly into your grant proposal draft or research workspace.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const draftData = `Domain: ${currentDomain.domainName}\nIdentified Gap: ${currentDomain.strata.researchGaps[0]?.title}\nTarget Grant: ${currentDomain.strata.grants[0]?.title}`;
              localStorage.setItem("cambium_injected_landscape", draftData);
              router.push("/workspace");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-moss-600 hover:bg-moss-700 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <FileText size={14} />
            <span>Inject Into Proposal Draft</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
