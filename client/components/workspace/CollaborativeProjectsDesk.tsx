"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Folder,
  Users,
  Plus,
  GitCommit,
  BookOpen,
  DollarSign,
  ExternalLink,
  Bot,
  Layers,
  Copy,
  Check,
  Sparkles,
  Award,
  X,
  Clock,
  Shield,
  Share2,
} from "lucide-react";

export interface ProjectMemberDisplay {
  name: string;
  institution: string;
  role: string;
  initials: string;
  avatarColor: string;
  status: "ACCEPTED" | "INVITED";
}

export interface ProjectActivityDisplay {
  time: string;
  actor: string;
  action: string;
  details: string;
}

export interface CollaborativeProject {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "UNDER_REVIEW" | "SUBMITTED" | "ARCHIVED";
  visibility: "PUBLIC" | "LAB_ONLY" | "PRIVATE";
  targetGrant: {
    funder: string;
    program: string;
    budget: string;
    daysLeft: number;
  };
  members: ProjectMemberDisplay[];
  linkedDois: {
    doi: string;
    title: string;
    citations: number;
  }[];
  activityChangelog: ProjectActivityDisplay[];
}

const INITIAL_PROJECTS: CollaborativeProject[] = [
  {
    id: "proj-1",
    title: "Multimodal Neuro-Symbolic NIH R01 Proposal",
    description:
      "A joint multi-institutional research initiative constraining generative biomedical diffusion models with formal Horn-clause logic for safe clinical translation.",
    status: "ACTIVE",
    visibility: "LAB_ONLY",
    targetGrant: {
      funder: "National Institutes of Health (NIH)",
      program: "R01 Epigenetic Nanoparticle Delivery",
      budget: "$2,500,000",
      daysLeft: 28,
    },
    members: [
      {
        name: "Imthiyas",
        institution: "MIT CSAIL & Cambium Labs",
        role: "Lead PI",
        initials: "IM",
        avatarColor: "#202920",
        status: "ACCEPTED",
      },
      {
        name: "Dr. Elena Vance",
        institution: "Stanford University · Bio-X",
        role: "Co-PI & Clinical Lead",
        initials: "EV",
        avatarColor: "#3E6248",
        status: "ACCEPTED",
      },
      {
        name: "Dr. Elena Rodriguez",
        institution: "University of Cambridge",
        role: "Data Analyst / Statistician",
        initials: "ER",
        avatarColor: "#6B5A7A",
        status: "ACCEPTED",
      },
      {
        name: "Prof. Marcus Thorne",
        institution: "Harvard Medical School",
        role: "Internal Peer Reviewer",
        initials: "MT",
        avatarColor: "#173F35",
        status: "ACCEPTED",
      },
    ],
    linkedDois: [
      {
        doi: "10.1016/j.cels.2025.04.002",
        title: "Neuro-Symbolic Deductive Inference Over Large Chemical Spaces",
        citations: 142,
      },
      {
        doi: "10.1038/s42256-026-00812-4",
        title: "Foundation Models for Medical Image Understanding & Zero-Shot Clinical Synthesis",
        citations: 384,
      },
    ],
    activityChangelog: [
      {
        time: "10:42 AM",
        actor: "Dr. Elena Vance",
        action: "ACCEPTED_INVITE",
        details: "Joined workspace as Co-PI & Clinical Lead via signed viral invitation.",
      },
      {
        time: "Yesterday",
        actor: "Imthiyas",
        action: "LINKED_DOI",
        details: "Indexed Nature MI benchmark DOI 10.1016/j.cels.2025.04.002 into Literature Vault.",
      },
      {
        time: "Oct 28",
        actor: "Imthiyas",
        action: "WORKSPACE_INIT",
        details: "Initialized workspace repository with 14-role CRediT authorship governance.",
      },
    ],
  },
  {
    id: "proj-2",
    title: "Low-Resource Scientific Language Benchmarks",
    description:
      "Cross-validation suites and synthetic test splits evaluating tokenization efficiency and hallucination bounds in specialized chemistry and climate informatics.",
    status: "UNDER_REVIEW",
    visibility: "PUBLIC",
    targetGrant: {
      funder: "Cambium Research Foundation",
      program: "Open Science Accelerator Grant",
      budget: "$150,000",
      daysLeft: 12,
    },
    members: [
      {
        name: "Dr. Arjun Rao",
        institution: "IISc Bangalore",
        role: "Lead PI",
        initials: "AR",
        avatarColor: "#4A6B8A",
        status: "ACCEPTED",
      },
      {
        name: "Imthiyas",
        institution: "Cambium Labs",
        role: "Co-Author",
        initials: "IM",
        avatarColor: "#202920",
        status: "ACCEPTED",
      },
    ],
    linkedDois: [
      {
        doi: "10.5555/3295222.3295349",
        title: "Attention Is All You Need",
        citations: 135400,
      },
    ],
    activityChangelog: [
      {
        time: "Oct 29",
        actor: "Dr. Arjun Rao",
        action: "SUBMITTED_DRAFT",
        details: "Submitted synthetic test splits for internal peer review desk audit.",
      },
    ],
  },
];

export function CollaborativeProjectsDesk() {
  const [projects, setProjects] = useState<CollaborativeProject[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("proj-1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDoiModalOpen, setIsDoiModalOpen] = useState(false);

  // Form states
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectFunder, setNewProjectFunder] = useState("");
  const [newProjectBudget, setNewProjectBudget] = useState("");

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Co-PI & Clinical Lead");
  const [generatedInviteLink, setGeneratedInviteLink] = useState("");

  const [doiInput, setDoiInput] = useState("");
  const [doiTitleInput, setDoiTitleInput] = useState("");

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleInitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProj: CollaborativeProject = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim() || "Collaborative multi-investigator workspace.",
      status: "ACTIVE",
      visibility: "LAB_ONLY",
      targetGrant: {
        funder: newProjectFunder.trim() || "National Science Foundation",
        program: "Cyberinfrastructure for Science",
        budget: newProjectBudget.trim() || "$1,200,000",
        daysLeft: 60,
      },
      members: [
        {
          name: "Imthiyas",
          institution: "MIT CSAIL & Cambium Labs",
          role: "Lead PI",
          initials: "IM",
          avatarColor: "#202920",
          status: "ACCEPTED",
        },
      ],
      linkedDois: [],
      activityChangelog: [
        {
          time: "Just now",
          actor: "Imthiyas",
          action: "WORKSPACE_INIT",
          details: "Initialized workspace repository with 14-role CRediT authorship governance.",
        },
      ],
    };

    setProjects([newProj, ...projects]);
    setSelectedProjectId(newProj.id);
    setIsInitModalOpen(false);
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewProjectFunder("");
    setNewProjectBudget("");
    triggerToast("Collaborative Research Workspace initialized ✓");
  };

  const handleInviteCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const token = Math.random().toString(36).substring(2, 10);
    const link = `https://cambium.research/join?invite=${token}&project=${activeProject.id}`;
    setGeneratedInviteLink(link);

    const newMember: ProjectMemberDisplay = {
      name: inviteName.trim(),
      institution: inviteEmail.trim() || "Partner University",
      role: inviteRole,
      initials: inviteName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      avatarColor: "#3E6248",
      status: "INVITED",
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              members: [...p.members, newMember],
              activityChangelog: [
                {
                  time: "Just now",
                  actor: "Imthiyas",
                  action: "INVITED_MEMBER",
                  details: `Generated signed CRediT invitation for ${newMember.name} as ${newMember.role}.`,
                },
                ...p.activityChangelog,
              ],
            }
          : p
      )
    );

    triggerToast(`Signed CRediT invitation generated for ${newMember.name} ✓`);
  };

  const handleLinkDoi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doiInput.trim()) return;

    const newDoiItem = {
      doi: doiInput.trim(),
      title: doiTitleInput.trim() || `Research Manuscript (${doiInput.trim()})`,
      citations: 24,
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              linkedDois: [...p.linkedDois, newDoiItem],
              activityChangelog: [
                {
                  time: "Just now",
                  actor: "Imthiyas",
                  action: "LINKED_DOI",
                  details: `Linked DOI reference ${newDoiItem.doi} to Proposal Vault.`,
                },
                ...p.activityChangelog,
              ],
            }
          : p
      )
    );

    setIsDoiModalOpen(false);
    setDoiInput("");
    setDoiTitleInput("");
    triggerToast("DOI indexed into Project Literature Vault ✓");
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#FAF7F0] p-6 text-[#202920] font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E4DCCB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/30">
              <Folder size={18} />
            </span>
            <h2 className="font-serif text-xl font-bold text-[#202920] m-0">
              Collaborative Research Repositories (GitHub-Style)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/30 font-semibold">
              CRediT 14-Role Matrix
            </span>
          </div>
          <p className="text-xs text-[#62685E] mt-1">
            Co-PI authorship governance, shared OpenAlex literature vaults, real-time activity changelog & tokenized viral invites.
          </p>
        </div>

        <button
          onClick={() => setIsInitModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#3E6248] hover:bg-[#202920] text-white text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0 self-start md:self-auto"
        >
          <Plus size={14} />
          Initialize Research Workspace
        </button>
      </div>

      {/* Main Repositories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr] gap-6">
        {/* Left Column: Projects List */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-[#62685E] uppercase tracking-wider font-semibold">
            Active Research Repositories ({projects.length})
          </div>

          {projects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? "bg-white border-[#3E6248] ring-1 ring-[#3E6248] shadow-sm"
                    : "bg-white border-[#E4DCCB] hover:border-[#66866A]/60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      proj.status === "ACTIVE"
                        ? "bg-[#DCE6D7] text-[#3E6248]"
                        : "bg-[#FEF3C7] text-[#B45309]"
                    }`}
                  >
                    {proj.status}
                  </span>
                  <span className="text-[10.5px] font-mono text-[#85877B]">
                    {proj.targetGrant.daysLeft}d left
                  </span>
                </div>

                <h3 className="font-bold text-xs text-[#202920] mb-1 line-clamp-1">
                  {proj.title}
                </h3>
                <p className="text-[11px] text-[#62685E] line-clamp-2 mb-3">
                  {proj.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#E4DCCB]/60 text-[11px] font-mono text-[#62685E]">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {proj.members.map((m, idx) => (
                      <div
                        key={idx}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white text-[9px] font-bold text-white flex items-center justify-center"
                        style={{ backgroundColor: m.avatarColor }}
                        title={`${m.name} (${m.role})`}
                      >
                        {m.initials}
                      </div>
                    ))}
                  </div>
                  <span>{proj.linkedDois.length} Papers Vaulted</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Repository Dashboard & Details */}
        <div className="space-y-6">
          {/* Active Project Card */}
          <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-serif text-lg font-bold text-[#202920] m-0">
                    {activeProject.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#DCE6D7] text-[#3E6248] font-bold">
                    {activeProject.visibility}
                  </span>
                </div>
                <p className="text-xs text-[#62685E] leading-relaxed max-w-2xl">
                  {activeProject.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setIsInviteModalOpen(true);
                    setGeneratedInviteLink("");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#202920] text-white text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Users size={13} />
                  Invite Collaborator (CRediT)
                </button>
                <button
                  onClick={() => setIsDoiModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-[#E4DCCB] bg-[#FAF7F0] hover:bg-white text-xs font-mono text-[#202920] flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen size={13} className="text-[#3E6248]" />
                  Link DOI
                </button>
              </div>
            </div>

            {/* Target Grant Meta Bar */}
            <div className="bg-[#FAF7F0] border border-[#E4DCCB] rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <div className="text-[10px] text-[#85877B] uppercase">Target Funder</div>
                <div className="font-bold text-[#202920] mt-0.5">
                  {activeProject.targetGrant.funder}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#85877B] uppercase">Program Track</div>
                <div className="font-semibold text-[#3E6248] mt-0.5 truncate">
                  {activeProject.targetGrant.program}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#85877B] uppercase">Target Award</div>
                <div className="font-bold text-[#202920] mt-0.5">
                  {activeProject.targetGrant.budget}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#85877B] uppercase">Submission Window</div>
                <div className="font-bold text-[#B33D35] mt-0.5 flex items-center gap-1">
                  <Clock size={12} />
                  {activeProject.targetGrant.daysLeft} Days Remaining
                </div>
              </div>
            </div>

            {/* CRediT Authorship Team Roster */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase font-bold text-[#202920] flex items-center gap-1.5">
                  <Award size={14} className="text-[#3E6248]" />
                  CRediT Authorship Roster ({activeProject.members.length} Members)
                </h4>
                <span className="text-[11px] font-mono text-[#62685E]">
                  National Academies Standard (14 Taxonomy Roles)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeProject.members.map((member, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] flex items-start gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#202920] truncate">
                          {member.name}
                        </span>
                        <span
                          className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                            member.status === "ACCEPTED"
                              ? "bg-[#DCE6D7] text-[#3E6248]"
                              : "bg-[#FEF3C7] text-[#B45309]"
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#62685E] truncate mt-0.5">
                        {member.institution}
                      </p>
                      <div className="mt-1 text-[11px] font-mono font-semibold text-[#3E6248]">
                        CRediT: {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Literature & Artifact Vault */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase font-bold text-[#202920] flex items-center gap-1.5">
                  <BookOpen size={14} className="text-[#1D4ED8]" />
                  Shared Proposal Literature Vault ({activeProject.linkedDois.length} Linked DOIs)
                </h4>
                <Link
                  href="/agent-reader"
                  className="text-xs font-mono text-[#1D4ED8] hover:underline"
                >
                  Multi-Agent Audit ↗
                </Link>
              </div>

              <div className="space-y-2">
                {activeProject.linkedDois.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#E4DCCB] bg-white flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[#202920] truncate">{item.title}</div>
                      <div className="text-[11px] font-mono text-[#62685E] mt-0.5 flex items-center gap-2">
                        <span>DOI: {item.doi}</span>
                        <span>·</span>
                        <span>{item.citations} Citations</span>
                      </div>
                    </div>
                    <Link
                      href={`/agent-reader?doi=${item.doi}`}
                      className="px-2.5 py-1 rounded bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-[11px] font-mono font-semibold shrink-0 no-underline"
                    >
                      Audit Proofs ↗
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Git-like Activity Changelog */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono uppercase font-bold text-[#202920] flex items-center gap-1.5">
                  <GitCommit size={14} className="text-[#3E6248]" />
                  Immutable Activity Changelog (Git-Style Commits)
                </h4>
                <span className="text-[11px] font-mono text-[#85877B]">
                  SHA-256 Cryptographic Verification
                </span>
              </div>

              <div className="border border-[#E4DCCB] rounded-xl divide-y divide-[#E4DCCB] bg-[#FAF7F0] text-xs font-mono">
                {activeProject.activityChangelog.map((log, i) => (
                  <div key={i} className="p-3 flex items-start gap-3">
                    <span className="text-[10.5px] text-[#85877B] w-20 shrink-0 font-semibold">
                      {log.time}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-[#202920]">{log.actor}</strong>
                        <span className="text-[10px] px-1.5 py-0.2 bg-[#DCE6D7] text-[#3E6248] rounded font-bold">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#62685E] font-sans mt-0.5">
                        {log.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Modal 1: Initialize Project ─── */}
      {isInitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E4DCCB] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4DCCB]">
              <h3 className="font-serif text-base font-bold text-[#202920] m-0">
                Initialize Research Workspace
              </h3>
              <button
                onClick={() => setIsInitModalOpen(false)}
                className="text-[#85877B] hover:text-[#202920] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInitProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  Project Proposal Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Multimodal Foundation Models for Oncology..."
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] focus:outline-none focus:border-[#3E6248]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  Research Description & Aims
                </label>
                <textarea
                  placeholder="Summary of specific aims, institutional partners, and clinical targets..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] h-20 resize-none focus:outline-none focus:border-[#3E6248]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#62685E] mb-1">
                    Target Funder
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NIH / NSF / DARPA"
                    value={newProjectFunder}
                    onChange={(e) => setNewProjectFunder(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#62685E] mb-1">
                    Target Budget
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $2,000,000"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4DCCB]">
                <button
                  type="button"
                  onClick={() => setIsInitModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#62685E] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#3E6248] text-white text-xs font-mono font-semibold cursor-pointer shadow-xs"
                >
                  Initialize Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal 2: Invite Collaborator with CRediT Role ─── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E4DCCB] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4DCCB]">
              <h3 className="font-serif text-base font-bold text-[#202920] m-0">
                Invite Collaborator (14-Role CRediT Standard)
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-[#85877B] hover:text-[#202920] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteCollaborator} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  Scholar Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Priya Sharma"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] focus:outline-none focus:border-[#3E6248]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  Institutional Email or Handle
                </label>
                <input
                  type="email"
                  placeholder="e.g. p.sharma@oxford.ac.uk"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  CRediT Authorship Taxonomy Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920] bg-white"
                >
                  <option value="Lead PI">Lead PI (Project Administration & Funding)</option>
                  <option value="Co-PI & Clinical Lead">Co-PI & Clinical Validation Lead</option>
                  <option value="Co-Author">Co-Author (Methodology & Investigation)</option>
                  <option value="Data Analyst / Statistician">
                    Data Analyst / Formal Verification Statistician
                  </option>
                  <option value="Internal Peer Reviewer">
                    Internal Peer Reviewer (Critical Proof Audit)
                  </option>
                  <option value="Methodology Contributor">Methodology & Software Contributor</option>
                </select>
              </div>

              {generatedInviteLink && (
                <div className="p-3 bg-[#FAF7F0] border border-[#3E6248]/40 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-[#3E6248] uppercase flex items-center gap-1">
                    <Sparkles size={12} />
                    Tokenized Viral Invitation Link (Zero-CAC PLG)
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedInviteLink}
                      className="flex-1 px-2.5 py-1 text-[11px] font-mono bg-white border border-[#E4DCCB] rounded text-[#202920]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedInviteLink);
                        triggerToast("Signed invite link copied to clipboard ✓");
                      }}
                      className="px-3 py-1 bg-[#3E6248] text-white text-[11px] font-mono font-semibold rounded cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4DCCB]">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#62685E] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#3E6248] text-white text-xs font-mono font-semibold cursor-pointer shadow-xs"
                >
                  Generate Signed CRediT Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal 3: Link DOI Reference ─── */}
      {isDoiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E4DCCB] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4DCCB]">
              <h3 className="font-serif text-base font-bold text-[#202920] m-0">
                Link DOI Reference to Vault
              </h3>
              <button
                onClick={() => setIsDoiModalOpen(false)}
                className="text-[#85877B] hover:text-[#202920] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLinkDoi} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  Digital Object Identifier (DOI)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10.1016/j.cels.2025.04.002"
                  value={doiInput}
                  onChange={(e) => setDoiInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#202920] focus:outline-none focus:border-[#3E6248]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#62685E] mb-1">
                  Paper / Preprint Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neuro-Symbolic Deductive Inference..."
                  value={doiTitleInput}
                  onChange={(e) => setDoiTitleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E4DCCB] text-xs text-[#202920]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4DCCB]">
                <button
                  type="button"
                  onClick={() => setIsDoiModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-[#E4DCCB] text-xs font-mono text-[#62685E] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#3E6248] text-white text-xs font-mono font-semibold cursor-pointer shadow-xs"
                >
                  Link to Literature Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#202920] text-[#FAF7F0] px-4 py-2.5 rounded-xl text-xs font-mono shadow-xl border border-white/10 flex items-center gap-2">
          <Sparkles size={14} className="text-[#4ADE80]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default CollaborativeProjectsDesk;
