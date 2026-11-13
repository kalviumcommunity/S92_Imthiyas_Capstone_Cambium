"use client";

import React, { useState, useMemo } from "react";
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

export interface CampusDepartment {
  id: string;
  campusName: string;
  departmentName: string;
  leadPI: string;
  totalFunding: string;
  activeArticles: string;
  gpuCluster: string;
  utilization: string;
  rorId: string;
  scratchStorage: string;
  slurmPartition: string;
  activeGrant: string;
}

export const CAMPUS_DEPARTMENTS: CampusDepartment[] = [
  {
    id: "mit_csail",
    campusName: "MIT CSAIL & Broad Institute",
    departmentName: "Cambium Neuro-Symbolic Bio-Intelligence Lab",
    leadPI: "Imthiyas (PI)",
    totalFunding: "$3,450,000",
    activeArticles: "7 Articles",
    gpuCluster: "8x H100 SXM5",
    utilization: "74% Utilization",
    rorId: "0428wax08",
    scratchStorage: "140 TB Lustre NVMe",
    slurmPartition: "MIT SuperCloud (SLURM-GPU-H100)",
    activeGrant: "NSF OAC-2311492 / NIH NIBIB R01",
  },
  {
    id: "harvard_biox",
    campusName: "Harvard Bio-X & Wyss Institute",
    departmentName: "Quantitative Systems Biology & Molecular Machine Intelligence",
    leadPI: "Dr. Elena Rodriguez (Co-PI)",
    totalFunding: "$4,200,000",
    activeArticles: "9 Articles",
    gpuCluster: "16x A100 80GB",
    utilization: "86% Utilization",
    rorId: "03vek6s52",
    scratchStorage: "200 TB Ceph Tier-1",
    slurmPartition: "Harvard FAS-RC (Cannon-GPU)",
    activeGrant: "ARPA-H Health Science / NIH R01",
  },
  {
    id: "stanford_sail",
    campusName: "Stanford AI Lab (SAIL) & Medical Consortia",
    departmentName: "Clinical Foundation Models & Planetary Digital Twins",
    leadPI: "Marcus Vance (Lead)",
    totalFunding: "$5,100,000",
    activeArticles: "12 Articles",
    gpuCluster: "12x H100 SXM5",
    utilization: "68% Utilization",
    rorId: "00f54p054",
    scratchStorage: "250 TB GPFS High-IOPS",
    slurmPartition: "Stanford Sherlock (GPU-H100-Multi)",
    activeGrant: "DOE ASCR / NSF Cyber-Physical #240891",
  },
];

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

  const [selectedDeptId, setSelectedDeptId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cambium_lab_selected_dept") || "mit_csail";
    }
    return "mit_csail";
  });

  const currentDept = useMemo(() => {
    return CAMPUS_DEPARTMENTS.find((d) => d.id === selectedDeptId) || CAMPUS_DEPARTMENTS[0];
  }, [selectedDeptId]);

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    if (typeof window !== "undefined") {
      localStorage.setItem("cambium_lab_selected_dept", deptId);
    }
  };

  const [members, setMembers] = useState<LabMember[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cambium_lab_members_v2");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return LAB_MEMBERS;
  });

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Doctoral Researcher");
  const [newMemberOrcid, setNewMemberOrcid] = useState("0009-0004-9812-");
  const [inviteFeedback, setInviteFeedback] = useState<string | null>(null);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newM: LabMember = {
      name: newMemberName.trim(),
      role: newMemberRole.trim(),
      orcid: newMemberOrcid.trim() || "0009-0004-xxxx-xxxx",
      activeProjects: 1,
      avatarColor: "bg-[#3E6248]",
    };

    const updated = [newM, ...members];
    setMembers(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("cambium_lab_members_v2", JSON.stringify(updated));
    }
    setIsInviteOpen(false);
    setNewMemberName("");
    setInviteFeedback(`Invited ${newM.name} to Cambium Lab Roster!`);
    setTimeout(() => setInviteFeedback(null), 3500);
  };

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] font-sans p-6 sm:p-10 selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Campus & Department Multi-Tenant Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-[#62685E] uppercase tracking-wider px-2 font-semibold">
              Institutional Partition:
            </span>
            {CAMPUS_DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => handleDeptChange(dept.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedDeptId === dept.id
                    ? "bg-[#3E6248] text-white shadow-xs"
                    : "bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E] hover:text-[#202920] hover:border-[#66866A]"
                }`}
              >
                {dept.campusName.split("&")[0].trim()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 text-[#3E6248] font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#3E6248] animate-pulse" />
            <span>Lead: {currentDept.leadPI}</span>
          </div>
        </div>

        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DCCB] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-3">
              <Building2 size={13} className="text-[#3E6248]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Institutional Hub // {currentDept.campusName}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] tracking-tight m-0">
              {currentDept.departmentName}
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
              {currentDept.totalFunding}
            </div>
            <div className="text-[10px] font-mono text-[#3E6248] mt-1">
              Active Consortia Grants
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs">
            <div className="text-[11px] font-mono uppercase text-[#62685E]">
              Active Manuscripts
            </div>
            <div className="font-serif text-2xl font-semibold text-[#202920] mt-1">
              {currentDept.activeArticles}
            </div>
            <div className="text-[10px] font-mono text-[#3E6248] mt-1">
              Continuous Dissemination
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs">
            <div className="text-[11px] font-mono uppercase text-[#62685E]">
              Shared GPU Compute
            </div>
            <div className="font-serif text-2xl font-semibold text-[#202920] mt-1">
              {currentDept.gpuCluster}
            </div>
            <div className="text-[10px] font-mono text-[#3E6248] mt-1">
              {currentDept.utilization}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-xs">
            <div className="text-[11px] font-mono uppercase text-[#62685E]">
              Institutional Affiliation
            </div>
            <div className="font-serif text-lg font-semibold text-[#202920] mt-1 truncate">
              {currentDept.campusName.split("&")[0].trim()}
            </div>
            <div className="text-[10px] font-mono text-[#62685E] mt-1">
              ROR: {currentDept.rorId}
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
                    {currentDept.slurmPartition}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#DCE6D7] text-[#3E6248] font-mono text-[10px] font-semibold">
                    Healthy · Active
                  </span>
                </div>
                <p className="text-xs text-[#62685E]">
                  Dedicated {currentDept.gpuCluster} GPU cluster allocated via {currentDept.activeGrant}.
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#202920] m-0">
                  Active Institutional Investigators ({members.length})
                </h3>
                <p className="text-xs text-[#62685E] mt-0.5">
                  CRediT-verified research personnel, doctoral fellows, and visiting scientists with active cluster credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInviteOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#3E6248] hover:bg-[#173F35] text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
              >
                <Plus size={14} />
                Invite Lab Member
              </button>
            </div>

            {inviteFeedback && (
              <div className="p-3 rounded-xl bg-[#DCE6D7] border border-[#66866A]/30 text-xs font-mono text-[#3E6248] flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{inviteFeedback}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {members.map((member, idx) => (
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

            {/* Invite Modal */}
            {isInviteOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <div className="bg-white border border-[#E4DCCB] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCB]">
                    <h3 className="font-serif text-lg font-bold text-[#202920] m-0">
                      Invite Research Colleague
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsInviteOpen(false)}
                      className="text-[#85877B] hover:text-[#202920] text-sm cursor-pointer border-0 bg-transparent"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddMember} className="space-y-3">
                    <div>
                      <label className="text-xs font-mono text-[#62685E] block mb-1">
                        Scholar Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="e.g. Dr. Alistair Finch"
                        className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-[#62685E] block mb-1">
                        Authorship / CRediT Role
                      </label>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248] bg-white"
                      >
                        <option value="Co-PI & Clinical Lead">Co-PI & Clinical Lead</option>
                        <option value="Post-Doctoral Fellow">Post-Doctoral Fellow</option>
                        <option value="Senior Computational Biologist">Senior Computational Biologist</option>
                        <option value="Doctoral Researcher">Doctoral Researcher</option>
                        <option value="Visiting Research Scholar">Visiting Research Scholar</option>
                        <option value="Data Analyst / Statistician">Data Analyst / Statistician</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-[#62685E] block mb-1">
                        ORCID iD
                      </label>
                      <input
                        type="text"
                        value={newMemberOrcid}
                        onChange={(e) => setNewMemberOrcid(e.target.value)}
                        placeholder="0009-0004-9812-4112"
                        className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#202920] focus:outline-none focus:border-[#3E6248]"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsInviteOpen(false)}
                        className="px-3.5 py-1.5 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#62685E] hover:bg-[#FAF7F0] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#173F35] text-white text-xs font-mono font-semibold cursor-pointer shadow-xs"
                      >
                        Send Lab Invitation
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
