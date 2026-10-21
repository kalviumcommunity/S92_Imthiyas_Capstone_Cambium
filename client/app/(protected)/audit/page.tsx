"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import VirtualizedAuditLedger, { generate10kAuditEvents, VirtualAuditEvent } from "@/components/ui/VirtualizedAuditLedger";
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  UserCheck,
  Lock,
  Unlock,
  RefreshCw,
  Copy,
  ExternalLink,
  ChevronRight,
  Database,
  Building,
  Zap,
} from "lucide-react";

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: { name: string; email: string; role: string; institution: string };
  action: string;
  target: string;
  ipAddress: string;
  sha256: string;
  status: "Success" | "Flagged" | "Blocked" | "Audited";
  severity: "Low" | "Medium" | "High" | "Critical";
}

const AUDIT_LOGS: AuditEvent[] = [
  {
    id: "evt-90182",
    timestamp: "2026-10-06 15:42:19 UTC",
    actor: {
      name: "Imthiyas (PI)",
      email: "imthiyas@cambium.mit.edu",
      role: "Principal Investigator",
      institution: "MIT CSAIL (ROR: 0428wax08)",
    },
    action: "SAML.Assertion.Generate",
    target: "Shibboleth Federated Gateway · Session #8831",
    ipAddress: "18.24.112.44 (Cambridge, MA)",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "Success",
    severity: "Low",
  },
  {
    id: "evt-90181",
    timestamp: "2026-10-06 14:18:02 UTC",
    actor: {
      name: "Dr. Elena Rodriguez",
      email: "e.rodriguez@stanford.edu",
      role: "Reviewer & Post-Doc",
      institution: "Stanford Medicine (ROR: 00f54p054)",
    },
    action: "IRB.Protocol.AmendSign",
    target: "Protocol IRB-2026-0891 (Amendment v2.2)",
    ipAddress: "171.67.215.200 (Palo Alto, CA)",
    sha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    status: "Success",
    severity: "Medium",
  },
  {
    id: "evt-90180",
    timestamp: "2026-10-06 13:05:44 UTC",
    actor: {
      name: "Autonomous RAG Sync Service",
      email: "service-rag@cambium.internal",
      role: "Service Principal",
      institution: "Cambium Enterprise Cloud",
    },
    action: "FAIR.Dataset.IndexIngest",
    target: "Zenodo-Record-1049281 (Proteomics Cryo-EM 42GB)",
    ipAddress: "10.240.0.12 (US-East Private VPC)",
    sha256: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    status: "Success",
    severity: "Low",
  },
  {
    id: "evt-90179",
    timestamp: "2026-10-06 11:22:15 UTC",
    actor: {
      name: "Unauthenticated Endpoint Probe",
      email: "anonymous@tor-exit.net",
      role: "Guest",
      institution: "Unknown / External ASN 4128",
    },
    action: "API.Key.RevokeAttempt",
    target: "POST /v1/org/mit-csail/credentials",
    ipAddress: "185.220.101.5 (Frankfurt, DE)",
    sha256: "9c56cc51b374c3ba189210d5b55470fa5e29eed9797b15d00a142911b32ee619",
    status: "Blocked",
    severity: "Critical",
  },
  {
    id: "evt-90178",
    timestamp: "2026-10-06 09:14:33 UTC",
    actor: {
      name: "Marcus Vance",
      email: "m.vance@broadinstitute.org",
      role: "Compliance Officer",
      institution: "Broad Institute (ROR: 05gq5hk82)",
    },
    action: "Grant.Disbursement.Approve",
    target: "NIH R01-EB034912 (Q3 Tranche $284,000)",
    ipAddress: "69.173.112.9 (Cambridge, MA)",
    sha256: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    status: "Success",
    severity: "High",
  },
];

interface RolePermission {
  role: string;
  description: string;
  memberCount: number;
  permissions: {
    name: string;
    allowed: boolean;
  }[];
}

const ROLES_RBAC: RolePermission[] = [
  {
    role: "Principal Investigator (PI)",
    description: "Full oversight of lab protocols, grant budgets, and manuscript co-authorship credentials.",
    memberCount: 4,
    permissions: [
      { name: "Sign IRB Ethical Protocol Amendments", allowed: true },
      { name: "Authorize Grant Fund Disbursements", allowed: true },
      { name: "Export Patient De-Identified Data", allowed: true },
      { name: "Modify SAML/SSO Directory Mapping", allowed: true },
      { name: "Invite External Peer Reviewers", allowed: true },
      { name: "Purge Lab Artifacts / Datasets", allowed: false },
    ],
  },
  {
    role: "Post-Doc / Senior Scientist",
    description: "Execute computational pipelines, author manuscripts, and submit initial IRB filings.",
    memberCount: 12,
    permissions: [
      { name: "Sign IRB Ethical Protocol Amendments", allowed: false },
      { name: "Authorize Grant Fund Disbursements", allowed: false },
      { name: "Export Patient De-Identified Data", allowed: true },
      { name: "Modify SAML/SSO Directory Mapping", allowed: false },
      { name: "Invite External Peer Reviewers", allowed: true },
      { name: "Purge Lab Artifacts / Datasets", allowed: false },
    ],
  },
  {
    role: "Institutional Reviewer (Double-Blind)",
    description: "Restricted to blinded manuscript annotations, CRediT checks, and COPE dispute filings.",
    memberCount: 8,
    permissions: [
      { name: "Sign IRB Ethical Protocol Amendments", allowed: false },
      { name: "Authorize Grant Fund Disbursements", allowed: false },
      { name: "Export Patient De-Identified Data", allowed: false },
      { name: "Modify SAML/SSO Directory Mapping", allowed: false },
      { name: "Invite External Peer Reviewers", allowed: false },
      { name: "Purge Lab Artifacts / Datasets", allowed: false },
    ],
  },
  {
    role: "Lab Compliance Officer",
    description: "Audits SMART IRB reliance agreements, data transfer compliance, and HIPAA de-identification.",
    memberCount: 2,
    permissions: [
      { name: "Sign IRB Ethical Protocol Amendments", allowed: true },
      { name: "Authorize Grant Fund Disbursements", allowed: false },
      { name: "Export Patient De-Identified Data", allowed: true },
      { name: "Modify SAML/SSO Directory Mapping", allowed: false },
      { name: "Invite External Peer Reviewers", allowed: true },
      { name: "Purge Lab Artifacts / Datasets", allowed: false },
    ],
  },
];

export default function EnterpriseAuditRbacPage() {
  const [activeTab, setActiveTab] = useState<"logs" | "rbac">("logs");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [isExporting, setIsExporting] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isVirtualized, setIsVirtualized] = useState(false);
  const [tenThousandEvents] = useState<VirtualAuditEvent[]>(() => generate10kAuditEvents());

  const filteredLogs = AUDIT_LOGS.filter((log) => {
    const matchesSearch =
      !searchFilter ||
      log.actor.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.action.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.target.toLowerCase().includes(searchFilter.toLowerCase()) ||
      log.sha256.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesSeverity =
      selectedSeverity === "All" || log.severity === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] font-sans p-6 sm:p-10 selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DCCB] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-3">
              <ShieldCheck size={13} className="text-[#3E6248]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Security & Institutional Governance // SOC-2 & HIPAA
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] tracking-tight m-0">
              Enterprise Audit Ledger & RBAC Center
            </h1>
            <p className="font-serif text-base text-[#62685E] mt-2 max-w-2xl leading-relaxed">
              Cryptographically verified ledger tracking every institutional interaction, SAML handshake, dataset egress, and granular permission enforcement across university workspaces.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsExporting(true);
                setTimeout(() => setIsExporting(false), 1200);
              }}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF7F0] border border-[#E4DCCB] text-[#202920] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download size={13} />
              {isExporting ? "Compiling JSON-LD..." : "Export Audit CSV"}
            </button>
            <div className="px-3.5 py-2 rounded-full bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/30 text-xs font-mono font-medium flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              Merkle Tree Root: Verified
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-[#E4DCCB] pb-1">
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "logs"
                ? "border-[#3E6248] text-[#3E6248]"
                : "border-transparent text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <FileText size={14} />
            Immutable Audit Trail ({AUDIT_LOGS.length})
          </button>
          <button
            onClick={() => setActiveTab("rbac")}
            className={`px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "rbac"
                ? "border-[#3E6248] text-[#3E6248]"
                : "border-transparent text-[#62685E] hover:text-[#202920]"
            }`}
          >
            <KeyRound size={14} />
            RBAC Roles & Matrix ({ROLES_RBAC.length})
          </button>
        </div>

        {/* View 1: Audit Trail Ledger */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="p-4 rounded-xl bg-white border border-[#E4DCCB] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#62685E]" size={14} />
                <input
                  type="text"
                  placeholder="Filter by actor, action type, IP, or SHA-256 hash..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E4DCCB] bg-[#FAF7F0] text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248]"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsVirtualized(!isVirtualized)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isVirtualized
                      ? "bg-[#3E6248] text-white border-[#3E6248] shadow-xs"
                      : "bg-[#FAF7F0] text-[#202920] border-[#E4DCCB] hover:border-[#3E6248]"
                  }`}
                >
                  <Layers size={13} />
                  <span>{isVirtualized ? "Standard View (5 Events)" : "Stream 10,000 Records (Virtualized)"}</span>
                </button>

                <span className="text-xs font-mono text-[#62685E]">Severity:</span>
                {["All", "Low", "Medium", "High", "Critical"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                      selectedSeverity === sev
                        ? "bg-[#3E6248] text-white font-semibold"
                        : "bg-[#FAF7F0] text-[#62685E] hover:bg-[#E4DCCB]"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditionally Render Virtualized Ledger or Standard Table */}
            {isVirtualized ? (
              <VirtualizedAuditLedger events={tenThousandEvents} searchTerm={searchFilter} />
            ) : (
              /* Event Table */
              <div className="bg-white rounded-2xl border border-[#E4DCCB] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead>
                      <tr className="bg-[#FAF7F0] border-b border-[#E4DCCB] text-[#62685E] font-mono uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 font-semibold">Timestamp / Event ID</th>
                        <th className="py-3 px-4 font-semibold">Actor & Institution</th>
                        <th className="py-3 px-4 font-semibold">Action & Target</th>
                        <th className="py-3 px-4 font-semibold">IP & Location</th>
                        <th className="py-3 px-4 font-semibold">SHA-256 Hash</th>
                        <th className="py-3 px-4 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4DCCB]/60">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono">
                            <div className="text-[#202920] font-semibold">{log.timestamp}</div>
                            <div className="text-[10px] text-[#62685E] mt-0.5">{log.id}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#202920]">{log.actor.name}</div>
                            <div className="text-[11px] text-[#62685E] font-mono mt-0.5">{log.actor.institution}</div>
                            <div className="text-[10px] text-[#3E6248] font-mono">{log.actor.role}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-medium text-[#202920] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E4DCCB] inline-block">
                              {log.action}
                            </div>
                            <div className="text-[11px] text-[#62685E] font-serif mt-1 max-w-xs truncate">
                              {log.target}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#62685E]">
                            {log.ipAddress}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-[#62685E]">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate max-w-[120px]">{log.sha256}</span>
                              <button
                                onClick={() => handleCopy(log.sha256)}
                                className="text-[#62685E] hover:text-[#3E6248] p-1 cursor-pointer"
                                title="Copy SHA-256"
                              >
                                <Copy size={11} />
                              </button>
                              {copiedHash === log.sha256 && (
                                <span className="text-[9px] text-[#3E6248] font-bold">Copied!</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                                log.status === "Success"
                                  ? "bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/30"
                                  : log.status === "Blocked"
                                  ? "bg-[#FEE2E2] text-[#991B1B] border border-[#EF4444]/30"
                                  : "bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/30"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View 2: RBAC Matrix */}
        {activeTab === "rbac" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ROLES_RBAC.map((role, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E4DCCB] space-y-4 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                          {role.role}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] text-[10px] font-mono text-[#62685E]">
                          {role.memberCount} Active Members
                        </span>
                      </div>
                      <p className="text-xs text-[#62685E] font-sans mt-1 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  {/* Permissions Checklist */}
                  <div className="space-y-2 pt-2 border-t border-[#E4DCCB]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#62685E] font-semibold mb-1">
                      Institutional Scope:
                    </div>
                    {role.permissions.map((perm, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-[#FAF7F0] border border-[#E4DCCB]/60 text-xs font-mono"
                      >
                        <span className="text-[#202920]">{perm.name}</span>
                        {perm.allowed ? (
                          <span className="flex items-center gap-1 text-[10px] text-[#3E6248] font-bold">
                            <CheckCircle2 size={12} /> Allowed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-[#62685E] opacity-60">
                            <Lock size={12} /> Restricted
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
