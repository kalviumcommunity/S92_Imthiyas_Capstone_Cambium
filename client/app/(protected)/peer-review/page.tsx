"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldAlert,
  Users2,
  CheckCircle2,
  EyeOff,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Download,
  Scale,
  Sparkles,
  Search,
} from "lucide-react";

const CREDIT_ROLES = [
  "Conceptualization",
  "Data curation",
  "Formal analysis",
  "Funding acquisition",
  "Investigation",
  "Methodology",
  "Project administration",
  "Resources",
  "Software",
  "Supervision",
  "Validation",
  "Visualization",
  "Writing – original draft",
  "Writing – review & editing",
];

const CO_AUTHORS = [
  { name: "Imthiyas", roleTitle: "Lead Principal Investigator" },
  { name: "Dr. Elena Rodriguez", roleTitle: "Senior Computational Biologist" },
  { name: "Dr. Arjun Rao", roleTitle: "Postdoctoral Research Fellow" },
  { name: "Prof. David Marcus", roleTitle: "Faculty Sponsor & Lab Director" },
];

export default function PeerReviewAdminPage() {
  const [activeTab, setActiveTab] = useState<"reviewer-desk" | "credit-matrix" | "cope-workflow">("reviewer-desk");
  const [reviewVerdict, setReviewVerdict] = useState<"accept" | "minor" | "major" | "reject" | null>("minor");
  
  // Matrix state: authorIndex -> roleIndex -> "lead" | "supporting" | "none"
  const [matrixState, setMatrixState] = useState<Record<string, "lead" | "supporting" | "none">>({
    "0-0": "lead",
    "0-2": "lead",
    "0-5": "lead",
    "0-8": "lead",
    "0-12": "lead",
    "1-1": "lead",
    "1-2": "supporting",
    "1-10": "lead",
    "2-4": "lead",
    "2-11": "lead",
    "3-3": "lead",
    "3-9": "lead",
    "3-13": "lead",
  });

  const toggleRole = (authorIdx: number, roleIdx: number) => {
    const key = `${authorIdx}-${roleIdx}`;
    setMatrixState((prev) => {
      const current = prev[key] || "none";
      const next = current === "none" ? "lead" : current === "lead" ? "supporting" : "none";
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] font-sans p-6 sm:p-10 selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DCCB] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-3">
              <Scale size={13} className="text-[#3E6248]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Editorial Board // COPE Compliant Review Engine
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] tracking-tight m-0">
              Peer Review & Misconduct Administration
            </h1>
            <p className="font-serif text-base text-[#62685E] mt-2 max-w-2xl leading-relaxed">
              Enforce strict double-blind referee anonymity, resolve Committee on Publication Ethics (COPE) integrity investigations, and calibrate 14-role CRediT author matrices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#E4DCCB] font-mono text-xs text-[#3E6248] font-bold shadow-2xs">
              COPE Member · Ref #8841-CP
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-[#E4DCCB] pb-3">
          {[
            { id: "reviewer-desk", label: "Double-Blind Reviewer Workspace", icon: EyeOff },
            { id: "credit-matrix", label: "CRediT 14-Role Taxonomy Matrix", icon: Users2 },
            { id: "cope-workflow", label: "COPE Integrity & Plagiarism Auditing", icon: ShieldAlert },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer border ${
                  active
                    ? "bg-[#3E6248] text-[#FAF7F0] border-[#3E6248] shadow-xs"
                    : "bg-white text-[#62685E] border-[#E4DCCB] hover:text-[#202920] hover:bg-[#FAF7F0]"
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── TAB 1: DOUBLE-BLIND REVIEWER DESK ─── */}
        {activeTab === "reviewer-desk" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Blinded Manuscript Overview (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-[#E4DCCB] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#66866A] animate-pulse" />
                    <span className="font-mono text-xs uppercase font-bold text-[#3E6248]">
                      Manuscript ID: CAMBIUM-MS-9204 (Blinded)
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#85877B] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E4DCCB]">
                    Double-Blind Mask Active
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#202920] m-0">
                    Emergent Topological Invariants in Deep RNA Folding Landscapes
                  </h3>
                  <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] font-mono text-xs text-[#62685E]">
                    <span>Authors: [BLINDED FOR PEER REVIEW · INSTITUTIONAL AFFILIATION SALTED]</span>
                  </div>
                </div>

                <div className="space-y-3 font-serif text-sm text-[#202920] leading-relaxed">
                  <p>
                    <strong>Abstract:</strong> We demonstrate that sparse attention networks naturally isolate second-order topological invariants when predicting non-canonical pseudoknot configurations. Benchmark evaluations across 1,420 experimental PDB crystal structures reveal a 34% reduction in RMSD variance over classical thermodynamics.
                  </p>
                  <p className="text-xs text-[#62685E] font-sans">
                    Submitted to: <em>Nature Computational Science</em> · Track: AI in Structural Biology · Version: R1
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E4DCCB] flex items-center justify-between">
                  <span className="font-mono text-xs text-[#85877B]">
                    Code & Data: Zenodo DOI Verified (Anonymized Repo)
                  </span>
                  <Link
                    href="/reader"
                    className="text-xs font-mono text-[#3E6248] hover:underline flex items-center gap-1 no-underline font-semibold"
                  >
                    <span>Open in Academic Reader</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* Reviewer Scorecard & Verdict (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-[#E4DCCB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-[#E4DCCB] pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#3E6248] font-bold block mb-1">
                    Confidential Referee Scorecard
                  </span>
                  <h4 className="font-serif text-lg font-normal text-[#202920] m-0">
                    Evaluation & Editorial Recommendation
                  </h4>
                </div>

                {/* Criteria Sliders */}
                <div className="space-y-3">
                  {[
                    { label: "Originality & Novelty", score: "8.5 / 10" },
                    { label: "Statistical Soundness", score: "9.0 / 10" },
                    { label: "Code & Artifact Reproducibility", score: "9.5 / 10" },
                    { label: "Literature Thoroughness", score: "8.0 / 10" },
                  ].map((crit, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#E4DCCB]/60">
                      <span className="font-sans text-[#202920]">{crit.label}</span>
                      <span className="font-mono font-bold text-[#3E6248]">{crit.score}</span>
                    </div>
                  ))}
                </div>

                {/* Final Decision Selector */}
                <div className="space-y-2">
                  <label className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#62685E] block">
                    Editorial Recommendation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "accept", label: "Accept As Is", color: "text-[#3E6248]" },
                      { id: "minor", label: "Minor Revision", color: "text-[#3E6248]" },
                      { id: "major", label: "Major Revision", color: "text-[#805B43]" },
                      { id: "reject", label: "Reject", color: "text-[#B33D35]" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setReviewVerdict(btn.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                          reviewVerdict === btn.id
                            ? "bg-[#202920] text-white border-[#202920] shadow-xs"
                            : "bg-[#FAF7F0] text-[#62685E] border-[#E4DCCB] hover:border-[#202920]"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] font-sans text-xs font-semibold uppercase tracking-wider transition-all border border-[#66866A]/30 shadow-xs cursor-pointer">
                  Submit Encrypted Evaluation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: CREDIT 14-ROLE TAXONOMY MATRIX ─── */}
        {activeTab === "credit-matrix" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white border border-[#E4DCCB] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="border-b border-[#E4DCCB] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#3E6248] font-bold block mb-1">
                    CRediT (Contributor Roles Taxonomy) NISO Z39.104 Standard
                  </span>
                  <h3 className="font-serif text-xl font-normal text-[#202920] m-0">
                    Author Contribution Calibration Matrix
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#3E6248]" /> Lead Role
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#DCE6D7] border border-[#66866A]" /> Supporting
                  </span>
                </div>
              </div>

              {/* Responsive Table Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E4DCCB] bg-[#FAF7F0]">
                      <th className="p-3 font-mono font-bold text-[#202920] sticky left-0 bg-[#FAF7F0]">
                        Scientific Role
                      </th>
                      {CO_AUTHORS.map((author, aIdx) => (
                        <th key={aIdx} className="p-3 font-serif font-normal text-[#202920] min-w-[140px]">
                          <span className="font-bold block">{author.name}</span>
                          <span className="font-mono text-[10px] text-[#62685E] block font-normal">
                            {author.roleTitle}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4DCCB]">
                    {CREDIT_ROLES.map((role, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[#FAF7F0]/40 transition-colors">
                        <td className="p-3 font-mono text-[11.5px] font-semibold text-[#202920] sticky left-0 bg-white">
                          {role}
                        </td>
                        {CO_AUTHORS.map((_, aIdx) => {
                          const key = `${aIdx}-${rIdx}`;
                          const state = matrixState[key] || "none";
                          return (
                            <td key={aIdx} className="p-3 text-center">
                              <button
                                onClick={() => toggleRole(aIdx, rIdx)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold mx-auto cursor-pointer border transition-all ${
                                  state === "lead"
                                    ? "bg-[#3E6248] text-white border-[#3E6248] shadow-xs"
                                    : state === "supporting"
                                    ? "bg-[#DCE6D7] text-[#293E30] border-[#66866A]"
                                    : "bg-transparent text-[#85877B] border-[#E4DCCB] hover:border-[#3E6248]"
                                }`}
                                title={`Toggle contribution for ${role}`}
                              >
                                {state === "lead" ? "L" : state === "supporting" ? "S" : "—"}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: COPE INTEGRITY & PLAGIARISM WORKFLOWS ─── */}
        {activeTab === "cope-workflow" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  Crossref Similarity Index
                </span>
                <span className="text-3xl font-serif text-[#3E6248] font-normal">3.8% Similarity</span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">Verified below 15% COPE investigation threshold.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  Image Manipulation Check
                </span>
                <span className="text-3xl font-serif text-[#202920] font-normal">0 Discrepancies</span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">Electrophoresis & confocal micrographs verified clean.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  Conflicts of Interest Disclosed
                </span>
                <span className="text-3xl font-serif text-[#3E6248] font-normal">Compliant</span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">ICMJE disclosure statements signed by all 4 authors.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E4DCCB] shadow-2xs space-y-4">
              <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                Committee on Publication Ethics (COPE) Protocol Escalation Flow
              </h3>
              <p className="text-xs text-[#62685E] font-sans leading-relaxed">
                If suspicion of undisclosed duplicate submission, fabricated telemetry, or authorship disputes arises, initiate the formal protocol below.
              </p>
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] flex items-center justify-between">
                <span className="font-mono text-xs text-[#202920]">
                  COPE Flowchart 04: "Suspected fabricated data in a submitted manuscript"
                </span>
                <button className="px-4 py-2 rounded-full border border-[#B33D35] text-[#B33D35] text-xs font-mono uppercase font-semibold hover:bg-[#FBF2F0] cursor-pointer">
                  Initiate Formal Ethics Inquiry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
