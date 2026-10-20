"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOptimisticLab, LabProjectEntity } from "@/lib/hooks/useOptimisticQueries";
import {
  Building2,
  Users,
  Cpu,
  Layers,
  FileText,
  DollarSign,
  Plus,
  ShieldCheck,
  Server,
  Activity,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Database,
  BarChart3,
  Zap,
} from "lucide-react";

interface LabMember {
  name: string;
  role: string;
  orcid: string;
  activeProjects: number;
  avatarColor: string;
}

const LAB_MEMBERS: LabMember[] = [
  {
    name: "Imthiyas",
    role: "Principal Investigator (PI)",
    orcid: "0009-0004-9812-4112",
    activeProjects: 4,
    avatarColor: "bg-[#3E6248]",
  },
  {
    name: "Dr. Elena Rodriguez",
    role: "Post-Doctoral Fellow",
    orcid: "0000-0002-1825-0097",
    activeProjects: 3,
    avatarColor: "bg-[#173F35]",
  },
  {
    name: "Marcus Vance",
    role: "Senior Computational Biologist",
    orcid: "0000-0001-9281-3341",
    activeProjects: 2,
    avatarColor: "bg-[#A36A4F]",
  },
  {
    name: "Sarah Lindqvist",
    role: "Doctoral Researcher",
    orcid: "0000-0003-4412-8921",
    activeProjects: 2,
    avatarColor: "bg-[#66866A]",
  },
];

export default function UniversityLabWorkspacePage() {
  const [activeTab, setActiveTab] = useState<"projects" | "compute" | "members">("projects");
  const { projects, addProject, updateProjectStage, isAdding } = useOptimisticLab();

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] font-sans p-6 sm:p-10 selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DCCB] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-3">
              <Building2 size={13} className="text-[#3E6248]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Institutional Hub // MIT CSAIL & Broad Institute
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] tracking-tight m-0">
              Cambium Neuro-Symbolic Bio-Intelligence Lab
            </h1>
            <p className="font-serif text-base text-[#62685E] mt-2 max-w-2xl leading-relaxed">
              Multi-tenant laboratory workspace managing shared computational clusters, joint grant allocations, collaborative manuscript drafts, and institutional compliance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/grants"
              className="px-4 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-[#202920] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign size={13} />
              View Lab Grants
            </Link>
            <button
              type="button"
              onClick={() => {
                addProject({
                  title: `Neuro-Symbolic Deductive Assay v${projects.length + 1}`,
                  lead: "Imthiyas (PI)",
                  stage: "In Review",
                  targetVenue: "Nature Machine Intelligence",
                  datasetSize: "28.4 GB",
                });
              }}
              className="px-4 py-2.5 rounded-full bg-[#3E6248] hover:bg-[#173F35] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={13} />
              {isAdding ? "Registering..." : "New Lab Project"}
            </button>
          </div>
        </div>

        {/* Lab Metrics Dashboard Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs">
            <div className="text-[11px] font-mono uppercase text-[#62685E]">
              Total Grant Funding
            </div>
            <div className="font-serif text-2xl font-semibold text-[#202920] mt-1">
              $3,450,000
            </div>
            <div className="text-[10px] font-mono text-[#3E6248] mt-1">
              Active NIH & NSF Grants
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs">
            <div className="text-[11px] font-mono uppercase text-[#62685E]">
              Active Manuscripts
            </div>
            <div className="font-serif text-2xl font-semibold text-[#202920] mt-1">
              7 Articles
            </div>
            <div className="text-[10px] font-mono text-[#3E6248] mt-1">
              3 in Peer Review
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs">
            <div className="text-[11px] font-mono uppercase text-[#62685E]">
              Shared GPU Compute
            </div>
            <div className="font-serif text-2xl font-semibold text-[#202920] mt-1">
              8x H100 SXM5
            </div>
            <div className="text-[10px] font-mono text-[#3E6248] mt-1">
              74% Cluster Utilization
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs">
            <div className="text-[11px] font-mono uppercase text-[#62685E]">
              Institutional Affiliation
            </div>
            <div className="font-serif text-lg font-semibold text-[#202920] mt-1">
              MIT CSAIL
            </div>
            <div className="text-[10px] font-mono text-[#62685E] mt-1">
              ROR: 0428wax08
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 border-b border-[#E4DCCB] pb-1">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "projects"
                ? "border-[#3E6248] text-[#3E6248]"
                : "border-transparent text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <Layers size={14} />
            Shared Projects & Manuscripts ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("compute")}
            className={`px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "compute"
                ? "border-[#3E6248] text-[#3E6248]"
                : "border-transparent text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <Cpu size={14} />
            HPC Compute & Cluster Quotas
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "members"
                ? "border-[#3E6248] text-[#3E6248]"
                : "border-transparent text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <Users size={14} />
            Lab Roster & Scholars ({LAB_MEMBERS.length})
          </button>
        </div>

        {/* Tab 1: Shared Projects */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#3E6248]/40 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DCE6D7] text-[#3E6248] text-[10px] font-mono font-semibold">
                      {proj.stage}
                    </span>
                    <span className="text-xs font-mono text-[#62685E]">
                      Target: {proj.targetVenue}
                    </span>
                    {proj.optimisticBadge && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse border border-emerald-300 font-bold">
                        <Zap size={10} />
                        Optimistic (Instant Update)
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                    {proj.title}
                  </h3>
                  <div className="text-xs font-mono text-[#62685E] flex items-center gap-3">
                    <span>Lead: {proj.lead}</span>
                    <span>·</span>
                    <span>Dataset: {proj.datasetSize}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
                  {/* Optimistic Stage Progression Buttons */}
                  <div className="flex items-center gap-1 bg-[#FAF7F0] p-1 rounded-xl border border-[#E4DCCB]">
                    {(["In Review", "Experimental Assay", "Preprint Published"] as const).map((stg) => (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => updateProjectStage({ id: proj.id, stage: stg })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                          proj.stage === stg
                            ? "bg-[#3E6248] text-white shadow-xs"
                            : "text-[#62685E] hover:text-[#202920]"
                        }`}
                      >
                        {stg.split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  <Link
                    href="/agent-reader"
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-xs font-mono text-[#202920] flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles size={13} />
                    Inspect
                  </Link>
                  <Link
                    href="/graph"
                    className="px-3 py-1.5 rounded-xl bg-[#3E6248] hover:bg-[#173F35] text-white text-xs font-mono flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    Graph <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Compute Allocations */}
        {activeTab === "compute" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                    MIT SuperCloud Partition (SLURM)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#DCE6D7] text-[#3E6248] font-mono text-[10px] font-semibold">
                    Healthy
                  </span>
                </div>
                <p className="text-xs text-[#62685E]">
                  Dedicated 8x NVIDIA H100 SXM5 GPU node allocated via NSF Grant OAC-2311492.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-[#202920] mb-1">
                      <span>GPU Memory Utilization (640 GB Total)</span>
                      <span>473 GB (74%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] overflow-hidden">
                      <div className="h-full bg-[#3E6248] rounded-full" style={{ width: "74%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-[#202920] mb-1">
                      <span>Scratch Storage Quota (10 TB)</span>
                      <span>4.8 TB (48%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] overflow-hidden">
                      <div className="h-full bg-[#66866A] rounded-full" style={{ width: "48%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                    Active Queued SLURM Jobs
                  </h3>
                  <span className="text-xs font-mono text-[#62685E]">3 Running</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[#202920]">job-89102 · diffusion_prior_train.py</div>
                      <div className="text-[10px] text-[#62685E]">User: imthiyas · 4x H100 · 14h elapsed</div>
                    </div>
                    <span className="text-[#3E6248] font-bold">RUNNING</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[#202920]">job-89101 · cryoem_tilt_reconstruct</div>
                      <div className="text-[10px] text-[#62685E]">User: elena_r · 2x H100 · 3h elapsed</div>
                    </div>
                    <span className="text-[#3E6248] font-bold">RUNNING</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Lab Roster */}
        {activeTab === "members" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {LAB_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${member.avatarColor} text-white flex items-center justify-center font-serif font-bold text-sm`}
                  >
                    {member.name[0]}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-normal text-[#202920] m-0">
                      {member.name}
                    </h3>
                    <div className="text-[11px] font-mono text-[#3E6248]">{member.role}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E4DCCB] text-xs font-mono text-[#62685E] space-y-1">
                  <div className="flex items-center justify-between">
                    <span>ORCID:</span>
                    <span className="text-[#202920]">{member.orcid}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Projects:</span>
                    <span className="text-[#202920]">{member.activeProjects} Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
