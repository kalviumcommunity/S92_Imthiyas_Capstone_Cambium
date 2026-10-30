"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOptimisticCompliance, ProtocolEntity } from "@/lib/hooks/useOptimisticQueries";
import {
  ShieldAlert,
  FileCheck,
  GitCompare,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Download,
  Filter,
  Users,
  Eye,
  FileText,
  Sparkles,
  Zap,
  UploadCloud,
} from "lucide-react";
import { uploadArtifact } from "@/lib/api";

export default function ComplianceWorkspacePage() {
  const [activeTab, setActiveTab] = useState<"protocols" | "icf-diff" | "reliance">("protocols");
  const { protocols, updateProtocolStatus, isUpdating } = useOptimisticCompliance();
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolEntity>(protocols[0] || {} as any);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedProtocolNames, setUploadedProtocolNames] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleProtocolUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const art = await uploadArtifact(file);
      setUploadedProtocolNames((prev) => [art.originalName, ...prev]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExportIrbPack = () => {
    const pack = {
      title: "SMART IRB Harmonized Protocol Dossier",
      institution: "Massachusetts Institute of Technology & Cambium Research Consortia",
      exportedAt: new Date().toISOString(),
      activeProtocols: protocols.map((p) => ({
        id: p.id,
        protocolNumber: p.protocolNumber,
        title: p.title,
        status: p.status,
        riskCategory: p.riskCategory,
        pi: p.pi,
        board: p.board,
        expiration: p.expiration,
        multiSite: p.multiSite,
        participatingSitesCount: p.participatingSitesCount,
      })),
      relianceAgreement: {
        network: "SMART IRB National Reliance Framework",
        status: "Active Ceded Review",
        signatories: ["MIT COUHES", "Harvard Medical School IRB", "Stanford HRPP"],
      },
    };
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smart_irb_reliance_pack_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmitAmendment = () => {
    setActiveTab("icf-diff");
    const targetTitle = selectedProtocol?.title || "IRB-2026-0819";
    alert(`Amendment workflow initiated for ${targetTitle}. Reviewing ICF v2.2 side-by-side diff.`);
  };

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] font-sans p-6 sm:p-10 selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DCCB] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-3">
              <ShieldAlert size={13} className="text-[#3E6248]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Regulatory Oversight // Institutional Review Board
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] tracking-tight m-0">
              IRB & Ethical Compliance Workspace
            </h1>
            <p className="font-serif text-base text-[#62685E] mt-2 max-w-2xl leading-relaxed">
              Maintain regulatory adherence across multi-center clinical trials, manage SMART IRB reliance agreements, and review informed consent version diffs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleProtocolUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-[#3E6248] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud size={13} />
              <span>{isUploading ? "Ingesting..." : "Upload Protocol PDF"}</span>
            </button>
            <button
              onClick={handleExportIrbPack}
              className="px-4 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-[#202920] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Export SMART IRB Pack</span>
            </button>
            <button
              onClick={handleSubmitAmendment}
              className="px-5 py-2.5 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] font-sans text-xs uppercase tracking-wider font-semibold transition-all border border-[#66866A]/30 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Submit Amendment</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-[#E4DCCB] pb-3">
          {[
            { id: "protocols", label: "Active Protocols (3)", icon: FileCheck },
            { id: "icf-diff", label: "Informed Consent Diff (ICF v2.2)", icon: GitCompare },
            { id: "reliance", label: "Multi-Site Reliance Agreements", icon: Building },
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

        {/* ─── TAB 1: PROTOCOLS OVERVIEW ─── */}
        {activeTab === "protocols" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  Active Human Subject Protocols
                </span>
                <span className="text-3xl font-serif text-[#202920] font-normal">3 Active</span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">
                  All protocols verified under Common Rule (45 CFR 46) & HIPAA Safe Harbor.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  SMART IRB Participating Sites
                </span>
                <span className="text-3xl font-serif text-[#3E6248] font-normal">18 Hospital Nodes</span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">
                  Ceded review across 4 national consortium centers and 2 clinical hospitals.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  Next Annual Continuing Review
                </span>
                <span className="text-3xl font-serif text-[#805B43] font-normal">152 Days</span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">
                  Protocol IRB-2025-1108 scheduled for Mass General review board in March 2027.
                </p>
              </div>
            </div>

            {/* Protocol List Table */}
            <div className="bg-white border border-[#E4DCCB] rounded-3xl overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-[#E4DCCB] flex items-center justify-between">
                <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                  Approved Research Protocols & Delegations
                </h3>
                <span className="font-mono text-xs text-[#85877B]">
                  Regulatory Authority: OHRP & FDA 21 CFR Part 50
                </span>
              </div>

              <div className="divide-y divide-[#E4DCCB]">
                {protocols.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProtocol(p)}
                    className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF7F0]/70 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#3E6248] bg-[#DCE6D7] px-2.5 py-0.5 rounded-full border border-[#66866A]/30">
                          {p.protocolNumber}
                        </span>
                        <span className="text-xs font-mono text-[#85877B]">{p.board}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F2EBDD] text-[#805B43]">
                          {p.riskCategory}
                        </span>
                        {p.optimisticBadge && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse border border-emerald-300 font-bold">
                            <Zap size={10} />
                            Optimistic Update Active
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-base sm:text-lg font-normal text-[#202920] m-0">
                        {p.title}
                      </h4>
                      <p className="text-xs text-[#62685E] m-0 font-sans">
                        Principal Investigator: {p.pi}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="sm:text-right">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold ${
                          p.status === "Approved" ? "text-[#3E6248]" : p.status === "Under Amendment Review" ? "text-amber-700" : "text-blue-700"
                        }`}>
                          <CheckCircle2 size={12} />
                          {p.status}
                        </span>
                        <span className="block text-[11px] font-mono text-[#85877B] mt-0.5">
                          Expires: {p.expiration}
                        </span>
                      </div>

                      {/* Interactive Optimistic Status Controls */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateProtocolStatus({ id: p.id, status: "Approved" });
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all cursor-pointer ${
                            p.status === "Approved"
                              ? "bg-[#3E6248] text-white border-[#3E6248]"
                              : "bg-white text-[#62685E] border-[#E4DCCB] hover:border-[#3E6248]"
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateProtocolStatus({ id: p.id, status: "Under Amendment Review" });
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all cursor-pointer ${
                            p.status === "Under Amendment Review"
                              ? "bg-amber-600 text-white border-amber-600"
                              : "bg-white text-[#62685E] border-[#E4DCCB] hover:border-amber-600"
                          }`}
                        >
                          Amend
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateProtocolStatus({ id: p.id, status: "Annual Renewal Due" });
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all cursor-pointer ${
                            p.status === "Annual Renewal Due"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-[#62685E] border-[#E4DCCB] hover:border-blue-600"
                          }`}
                        >
                          Renew
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab("icf-diff");
                          }}
                          className="px-2 py-0.5 rounded border border-[#E4DCCB] text-[10px] font-mono hover:border-[#3E6248] hover:bg-white text-[#202920] transition-colors cursor-pointer"
                        >
                          ICF Diff
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: INFORMED CONSENT FORM (ICF) VERSION CONTROL DIFF ─── */}
        {activeTab === "icf-diff" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-white border border-[#E4DCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#3E6248] font-bold">
                  Side-by-Side Informed Consent Comparison (ICF Diff Engine)
                </span>
                <h3 className="font-serif text-lg text-[#202920] font-normal m-0 mt-1">
                  Comparing Protocol IRB-2026-0891: Version 2.1 (Approved) vs. Version 2.2 (Proposed Amendment)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-[#DCE6D7] text-[#3E6248] px-2.5 py-1 rounded-md border border-[#66866A]/30">
                  +3 Additions
                </span>
                <span className="text-xs font-mono bg-[#FBF2F0] text-[#B33D35] px-2.5 py-1 rounded-md border border-[#B33D35]/30">
                  -2 Redactions
                </span>
              </div>
            </div>

            {/* Split Screen Diff Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Pane: Approved v2.1 */}
              <div className="p-6 rounded-3xl bg-white border border-[#E4DCCB] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-3">
                  <span className="font-mono text-xs font-bold text-[#85877B]">
                    APPROVED BASELINE (v2.1 · Nov 10, 2025)
                  </span>
                  <span className="text-[10px] font-mono bg-[#E4DCCB] text-[#202920] px-2 py-0.5 rounded">
                    Active in Field
                  </span>
                </div>
                <div className="font-serif text-sm text-[#202920] leading-relaxed space-y-3">
                  <p>
                    <strong>Section 4.1 — Data Storage & De-Identification:</strong> Your imaging and genetic samples will be stripped of direct identifiers (Name, Medical Record Number, Date of Birth). All derived computational weights will be stored on university servers located at MIT CSAIL.
                  </p>
                  <p className="bg-[#FBF2F0] text-[#B33D35] p-2 rounded line-through border border-[#B33D35]/20">
                    "Under no circumstances will multi-institutional decentralized nodes participate in federated gradient sharing without written secondary re-consent."
                  </p>
                  <p>
                    <strong>Section 6.2 — Voluntary Withdrawal:</strong> You may request the revocation of your clinical data at any point prior to the publication of aggregate statistical models.
                  </p>
                </div>
              </div>

              {/* Right Pane: Proposed Amendment v2.2 */}
              <div className="p-6 rounded-3xl bg-white border-2 border-[#3E6248] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-3">
                  <span className="font-mono text-xs font-bold text-[#3E6248]">
                    PROPOSED AMENDMENT (v2.2 · Pending IRB Approval)
                  </span>
                  <span className="text-[10px] font-mono bg-[#DCE6D7] text-[#3E6248] px-2 py-0.5 rounded font-bold">
                    Pending Ceded Review
                  </span>
                </div>
                <div className="font-serif text-sm text-[#202920] leading-relaxed space-y-3">
                  <p>
                    <strong>Section 4.1 — Data Storage & De-Identification:</strong> Your imaging and genetic samples will be stripped of direct identifiers (Name, Medical Record Number, Date of Birth). All derived computational weights will be stored on university servers located at MIT CSAIL.
                  </p>
                  <p className="bg-[#DCE6D7] text-[#293E30] p-2 rounded border border-[#66866A]/40">
                    "Decentralized federated learning nodes may calculate zero-knowledge gradient updates across verified hospital network consortiums, provided zero raw patient pixels leave the hospital firewall."
                  </p>
                  <p>
                    <strong>Section 6.2 — Voluntary Withdrawal:</strong> You may request the revocation of your clinical data at any point prior to the publication of aggregate statistical models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: MULTI-SITE RELIANCE AGREEMENTS ─── */}
        {activeTab === "reliance" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white border border-[#E4DCCB] rounded-3xl p-6 shadow-2xs space-y-6">
              <div className="border-b border-[#E4DCCB] pb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#3E6248] font-bold block mb-1">
                  SMART IRB Master Reliance Agreement Matrix
                </span>
                <h3 className="font-serif text-xl font-normal text-[#202920] m-0">
                  Participating Consortia & Reliance Determinations
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    institution: "Brigham and Women's Hospital",
                    role: "Relying Site (Ceded Review)",
                    board: "Mass General Brigham IRB",
                    status: "Reliance Executed",
                    signatory: "Dr. Sarah Lin (Institutional Official)",
                    date: "Signed Jan 12, 2026",
                  },
                  {
                    institution: "Broad Institute of MIT and Harvard",
                    role: "Reviewing IRB (Lead Board)",
                    board: "MIT COUHES Lead Authority",
                    status: "Lead Master Agreement",
                    signatory: "Prof. D. Marcus (IRB Chair)",
                    date: "Approved Aug 14, 2025",
                  },
                  {
                    institution: "Charité – Universitätsmedizin Berlin",
                    role: "EU Participating Cohort (GDPR Article 89)",
                    board: "Charité Ethikkommission",
                    status: "Reliance Executed",
                    signatory: "Prof. Klaus Becker",
                    date: "Signed Feb 20, 2026",
                  },
                  {
                    institution: "Stanford University Medical Center",
                    role: "Relying Site (Ceded Review)",
                    board: "Stanford Research Compliance Office",
                    status: "In Progress (Legal Review)",
                    signatory: "Office of Sponsored Research",
                    date: "Pending Signature",
                  },
                ].map((site, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-medium text-[#202920] m-0">
                        {site.institution}
                      </h4>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#DCE6D7] text-[#3E6248] font-bold">
                        {site.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#62685E] m-0 font-sans">
                      {site.role} · {site.board}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#85877B] pt-2 border-t border-[#E4DCCB]">
                      <span>{site.signatory}</span>
                      <span>{site.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
