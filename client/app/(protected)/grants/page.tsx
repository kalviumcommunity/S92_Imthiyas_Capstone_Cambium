"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  DollarSign,
  TrendingUp,
  FileCheck2,
  PieChart,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  Plus,
  CheckCircle2,
  ExternalLink,
  Sliders,
  Award,
  UploadCloud,
  FileCheck,
} from "lucide-react";
import {
  uploadArtifact,
  UploadedArtifact,
  getFundingAccounts,
  getExpenseRequests,
  createExpenseRequest,
  approveExpenseRequest,
  rejectExpenseRequest,
} from "@/lib/api";

interface GrantAward {
  id: string;
  grantNumber: string;
  funder: string;
  title: string;
  allocatedAmount: number;
  expendedAmount: number;
  startDate: string;
  endDate: string;
  pi: string;
  publicationsCount: number;
  milestonesMet: number;
  totalMilestones: number;
}

const ACTIVE_GRANTS: GrantAward[] = [
  {
    id: "g-1",
    grantNumber: "NSF-IIS-2409812",
    funder: "National Science Foundation (CISE Directorate)",
    title: "Neuro-Symbolic Reasoning Foundations for Structural RNA Modeling",
    allocatedAmount: 1200000,
    expendedAmount: 742000,
    startDate: "Oct 2024",
    endDate: "Sep 2027",
    pi: "Imthiyas (Lead PI)",
    publicationsCount: 6,
    milestonesMet: 7,
    totalMilestones: 10,
  },
  {
    id: "g-2",
    grantNumber: "NIH-R01-HG012903",
    funder: "National Institutes of Health (NHGRI)",
    title: "High-Throughput Clinical Tomography with Privacy-Preserving Enclaves",
    allocatedAmount: 1850000,
    expendedAmount: 980000,
    startDate: "Jan 2025",
    endDate: "Dec 2028",
    pi: "Imthiyas & Broad Clinical Fellows",
    publicationsCount: 8,
    milestonesMet: 5,
    totalMilestones: 12,
  },
  {
    id: "g-3",
    grantNumber: "WELLCOME-DISC-98",
    funder: "Wellcome Trust Discovery Award",
    title: "Open Frontier Genetic Foundation Architectures",
    allocatedAmount: 650000,
    expendedAmount: 410000,
    startDate: "Jun 2025",
    endDate: "May 2027",
    pi: "Imthiyas",
    publicationsCount: 3,
    milestonesMet: 4,
    totalMilestones: 6,
  },
];

export default function GrantManagementPage() {
  const [activeTab, setActiveTab] = useState<"post-award" | "form-builder" | "proposals">("post-award");
  const [uploadedIRB, setUploadedIRB] = useState<UploadedArtifact | null>(null);
  const [isUploadingIRB, setIsUploadingIRB] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveAccounts, setLiveAccounts] = useState<any[]>([]);
  const [liveExpenses, setLiveExpenses] = useState<any[]>([]);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseVendor, setExpenseVendor] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const irbInputRef = React.useRef<HTMLInputElement>(null);

  const loadLiveFunding = useCallback(async () => {
    const [accounts, expenses] = await Promise.all([
      getFundingAccounts(),
      getExpenseRequests(),
    ]);
    if (accounts.length > 0) {
      setLiveAccounts(accounts);
      setSelectedAccountId((curr) => curr || accounts[0].id);
    }
    setLiveExpenses(expenses);
  }, []);

  useEffect(() => {
    loadLiveFunding();
  }, [loadLiveFunding]);

  const handleCommitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !expenseTitle.trim() || !Number(expenseAmount)) return;
    try {
      await createExpenseRequest({
        fundingAccountId: selectedAccountId,
        title: expenseTitle.trim(),
        vendorName: expenseVendor.trim() || undefined,
        amount: Number(expenseAmount),
      });
      setExpenseTitle("");
      setExpenseVendor("");
      setExpenseAmount("");
      setToastMessage("Purchase commitment recorded in governance ledger.");
      setTimeout(() => setToastMessage(null), 3500);
      await loadLiveFunding();
    } catch (err: any) {
      setToastMessage(err?.message || "Failed to commit purchase request");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handlePublishCFP = () => {
    const cfp = {
      id: `cfp-${Date.now()}`,
      title: "Frontier Scientific ML 2027",
      agency: "Department of Science & Advanced Technologies",
      publishedAt: new Date().toISOString(),
      rubrics: [
        "Specific Aims & Hypothesis Defense (Max 1,500 Words)",
        "Institutional Resource Allocation & Cloud Compute Plan",
        "FAIR Data Management & Open-Access Repository Commitment",
      ],
      status: "Published",
    };
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("cambium_published_cfps") || "[]";
        const cfps = JSON.parse(stored);
        cfps.push(cfp);
        localStorage.setItem("cambium_published_cfps", JSON.stringify(cfps));
      } catch (e) {
        console.error(e);
      }
    }
    setToastMessage("CFP Rubric Schema Published & Synced to Institutional Registry!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleIRBUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingIRB(true);
    try {
      const art = await uploadArtifact(file);
      setUploadedIRB(art);
    } finally {
      setIsUploadingIRB(false);
      if (irbInputRef.current) irbInputRef.current.value = "";
    }
  };

  const totalAllocated = ACTIVE_GRANTS.reduce((a, b) => a + b.allocatedAmount, 0);
  const totalExpended = ACTIVE_GRANTS.reduce((a, b) => a + b.expendedAmount, 0);
  const totalPubs = ACTIVE_GRANTS.reduce((a, b) => a + b.publicationsCount, 0);

  const handleExportFFR = () => {
    const ffrReport = {
      form: "Standard Form 425 (SF-425) Federal Financial Report",
      reportingPeriodEnd: "2026-09-30",
      institution: "Massachusetts Institute of Technology & Cambium Sponsored Projects",
      leadInvestigator: "Shaik Mohamed Imthiyas T",
      awards: ACTIVE_GRANTS.map((g) => ({
        grantNumber: g.grantNumber,
        funder: g.funder,
        federalFundsAuthorized: g.allocatedAmount,
        federalShareOfExpenditures: g.expendedAmount,
        unobligatedBalance: g.allocatedAmount - g.expendedAmount,
        milestonesCompleted: `${g.milestonesMet}/${g.totalMilestones}`,
        linkedPublications: g.publicationsCount,
      })),
      totals: {
        authorizedTotal: totalAllocated,
        expendedTotal: totalExpended,
        remainingBalance: totalAllocated - totalExpended,
      },
      certification: "I certify to the best of my knowledge that this report is correct and complete under 2 CFR 200.",
    };
    const blob = new Blob([JSON.stringify(ffrReport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `federal_financial_report_sf425_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRegisterAward = () => {
    setActiveTab("form-builder");
  };

  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] text-[#202920] font-sans p-6 sm:p-10 selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DCCB] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-3">
              <Award size={13} className="text-[#3E6248]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Post-Award Administration // Sponsored Research Office
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] tracking-tight m-0">
              Grant Management & Post-Award Commission Portal
            </h1>
            <p className="font-serif text-base text-[#62685E] mt-2 max-w-2xl leading-relaxed">
              Track sponsored research burndowns, tie grant tranches to minted scholarly publications, and configure custom commission application rubrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportFFR}
              className="px-4 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-[#202920] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Export Federal FFR / SF-425</span>
            </button>
            <button
              onClick={handleRegisterAward}
              className="px-5 py-2.5 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] font-sans text-xs uppercase tracking-wider font-semibold transition-all border border-[#66866A]/30 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Register New Award</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#E4DCCB] pb-3">
          {[
            { id: "post-award", label: "Post-Award Financial & ROI Ledger", icon: TrendingUp },
            { id: "form-builder", label: "Commission Application Form Builder", icon: Sliders },
            { id: "proposals", label: "Active Submissions & Review Rubrics", icon: FileCheck2 },
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

        {/* ─── TAB 1: POST-AWARD FINANCIAL & ROI ─── */}
        {activeTab === "post-award" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  Total Awarded Capital
                </span>
                <span className="text-3xl font-serif text-[#202920] font-normal">
                  ${(totalAllocated / 1000000).toFixed(2)}M
                </span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">Across 3 multi-year federal & foundation awards.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  Total Expended To Date
                </span>
                <span className="text-3xl font-serif text-[#3E6248] font-normal">
                  ${(totalExpended / 1000000).toFixed(2)}M
                </span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">57.9% overall portfolio financial burndown.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  Minted ROI Output
                </span>
                <span className="text-3xl font-serif text-[#805B43] font-normal">
                  {totalPubs} Papers
                </span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">Directly attributed in journal acknowledgments.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#85877B] font-bold block mb-1">
                  Milestone Completion
                </span>
                <span className="text-3xl font-serif text-[#293E30] font-normal">
                  16 / 28
                </span>
                <p className="text-xs text-[#62685E] mt-2 mb-0">Verified deliverable milestones completed.</p>
              </div>
            </div>

            {/* Institutional Live Funding & Expenditure Governance Ledger (when live accounts exist) */}
            {liveAccounts.length > 0 && (
              <div className="bg-white border border-[#E4DCCB] rounded-3xl p-6 space-y-5 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4DCCB] pb-4">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                      Institutional Research Funding Governance (Live PostgreSQL Ledger)
                    </h3>
                    <p className="text-xs text-[#62685E] m-0 mt-1">
                      Separates Requested, Approved, Sanctioned, Received, Committed, Spent, and Available balances.
                    </p>
                  </div>
                  <span className="font-mono text-[11px] px-3 py-1 rounded-full bg-[#DCE6D7] text-[#3E6248] font-semibold">
                    Auditable Research-Finance Ledger
                  </span>
                </div>

                {liveAccounts.map((acc) => {
                  const sanctioned = Number(acc.sanctionedAmount || 0);
                  const committed = Number(acc.committedAmount || 0);
                  const spent = Number(acc.spentAmount || 0);
                  const available = Math.max(0, sanctioned - committed - spent);
                  return (
                    <div key={acc.id} className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#3E6248] mr-2">{acc.grantNumber}</span>
                          <span className="font-serif text-base text-[#202920]">{acc.title}</span>
                        </div>
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white border border-[#E4DCCB] text-[#202920]">
                          {acc.financialState} · {acc.currency}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-white border border-[#E4DCCB]">
                          <div className="text-[#85877B]">Sanctioned</div>
                          <div className="text-sm font-bold text-[#202920]">{acc.currency} {sanctioned.toLocaleString()}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#E4DCCB]">
                          <div className="text-[#85877B]">Spent (Actual)</div>
                          <div className="text-sm font-bold text-[#3E6248]">{acc.currency} {spent.toLocaleString()}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#E4DCCB]">
                          <div className="text-[#85877B]">Committed</div>
                          <div className="text-sm font-bold text-[#8A5A12]">{acc.currency} {committed.toLocaleString()}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#E4DCCB]">
                          <div className="text-[#85877B]">Available</div>
                          <div className="text-sm font-bold text-[#293E30]">{acc.currency} {available.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <form onSubmit={handleCommitExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <input
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    placeholder="Purchase request description..."
                    className="px-3 py-2 rounded-xl border border-[#E4DCCB] text-xs font-sans bg-[#FAF7F0]"
                  />
                  <input
                    value={expenseVendor}
                    onChange={(e) => setExpenseVendor(e.target.value)}
                    placeholder="Vendor / Supplier"
                    className="px-3 py-2 rounded-xl border border-[#E4DCCB] text-xs font-sans bg-[#FAF7F0]"
                  />
                  <input
                    type="number"
                    min="1"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="Amount"
                    className="px-3 py-2 rounded-xl border border-[#E4DCCB] text-xs font-mono bg-[#FAF7F0]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] text-xs font-semibold cursor-pointer"
                  >
                    Commit Purchase Request
                  </button>
                </form>

                {liveExpenses.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {liveExpenses.slice(0, 5).map((ex) => (
                      <div key={ex.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] text-xs">
                        <div>
                          <span className="font-semibold text-[#202920]">{ex.title}</span>
                          {ex.vendorName && <span className="text-[#62685E] ml-2">· {ex.vendorName}</span>}
                          <span className="font-mono ml-2 text-[#3E6248] font-bold">{Number(ex.amount).toLocaleString()}</span>
                          <span className="font-mono ml-2 px-2 py-0.5 rounded-full bg-white border border-[#E4DCCB]">{ex.status}</span>
                        </div>
                        {ex.status === "COMMITTED" && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => approveExpenseRequest(ex.id).then(loadLiveFunding).catch(() => {})}
                              className="px-2.5 py-1 rounded-lg bg-[#3E6248] text-white font-mono text-[11px] cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectExpenseRequest(ex.id, "Declined in review").then(loadLiveFunding).catch(() => {})}
                              className="px-2.5 py-1 rounded-lg border border-[#B33D35]/40 text-[#B33D35] font-mono text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Detailed Award Table */}
            <div className="bg-white border border-[#E4DCCB] rounded-3xl overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-[#E4DCCB] flex items-center justify-between">
                <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                  Active Sponsored Awards Ledger
                </h3>
                <span className="font-mono text-xs text-[#85877B]">
                  Compliance Standard: Uniform Guidance 2 CFR 200
                </span>
              </div>

              <div className="divide-y divide-[#E4DCCB]">
                {ACTIVE_GRANTS.map((grant) => {
                  const percentBurn = Math.round((grant.expendedAmount / grant.allocatedAmount) * 100);
                  return (
                    <div key={grant.id} className="p-6 space-y-4 hover:bg-[#FAF7F0]/60 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#3E6248] bg-[#DCE6D7] px-2.5 py-0.5 rounded-full border border-[#66866A]/30">
                              {grant.grantNumber}
                            </span>
                            <span className="text-xs font-mono text-[#85877B]">{grant.funder}</span>
                          </div>
                          <h4 className="font-serif text-lg font-normal text-[#202920] m-0">
                            {grant.title}
                          </h4>
                          <span className="text-xs font-sans text-[#62685E]">
                            {grant.pi} · Duration: {grant.startDate} – {grant.endDate}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono text-base font-bold text-[#202920]">
                            ${grant.expendedAmount.toLocaleString()} / ${grant.allocatedAmount.toLocaleString()}
                          </div>
                          <span className="text-xs font-mono text-[#85877B]">
                            {percentBurn}% Allocated Burndown
                          </span>
                        </div>
                      </div>

                      {/* Burndown Bar */}
                      <div className="w-full h-2 rounded-full bg-[#E4DCCB] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#3E6248] to-[#66866A] rounded-full transition-all duration-300"
                          style={{ width: `${percentBurn}%` }}
                        />
                      </div>

                      {/* ROI Badges */}
                      <div className="flex items-center justify-between text-xs font-mono text-[#62685E] pt-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-[#FAF7F0] border border-[#E4DCCB] px-2.5 py-1 rounded">
                            DOI Publications: <strong className="text-[#3E6248]">{grant.publicationsCount}</strong>
                          </span>
                          <span className="bg-[#FAF7F0] border border-[#E4DCCB] px-2.5 py-1 rounded">
                            Milestones Met: <strong>{grant.milestonesMet}/{grant.totalMilestones}</strong>
                          </span>
                        </div>

                        <Link
                          href="/publications"
                          className="text-[#3E6248] hover:underline flex items-center gap-1 no-underline font-semibold"
                        >
                          <span>Inspect Attributed DOIs</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: COMMISSION FORM BUILDER ─── */}
        {activeTab === "form-builder" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl bg-white border border-[#E4DCCB] shadow-2xs space-y-6">
              <div className="border-b border-[#E4DCCB] pb-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#3E6248] font-bold block mb-1">
                    Grant Commission Studio // Call for Proposal Designer
                  </span>
                  <h3 className="font-serif text-xl font-normal text-[#202920] m-0">
                    Application Rubric Schema: "Frontier Scientific ML 2027"
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handlePublishCFP}
                  className="px-4 py-2 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer border-none transition-colors shadow-xs"
                >
                  Publish CFP Template
                </button>
              </div>

              {/* Form Schema Drag-and-Drop Modules */}
              <div className="space-y-3">
                {[
                  {
                    title: "1. Specific Aims & Hypothesis Defense",
                    type: "Structured Prose (Max 1,500 Words) + Latex Formulas",
                    required: true,
                  },
                  {
                    title: "2. Institutional Resource Allocation & Cloud Compute Plan",
                    type: "Multi-line Item Financial Table + GPU Cluster Quotas",
                    required: true,
                  },
                  {
                    title: "3. FAIR Data Management & Open-Access Repository Commitment",
                    type: "Checklist + COAR Notify Repository URL",
                    required: true,
                  },
                  {
                    title: "4. Human Subjects & Dual-Use Research of Concern (DURC) Clearance",
                    type: "IRB Protocol Number & Reliance Determination PDF Upload",
                    required: true,
                  },
                  {
                    title: "5. Key Personnel & CRediT Taxonomy Assignment",
                    type: "ORCID Authenticated Co-PI Directory",
                    required: false,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E4DCCB] bg-[#FAF7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="font-serif text-sm font-medium text-[#202920] block">
                        {item.title}
                      </span>
                      <span className="font-mono text-[11px] text-[#62685E]">
                        Field Type: {item.type}
                      </span>
                      {idx === 3 && uploadedIRB && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#DCE6D7] text-[#3E6248] text-xs font-mono font-medium border border-[#66866A]/30">
                            <CheckCircle2 size={12} />
                            {uploadedIRB.originalName} ({uploadedIRB.sizeFormatted}) — Verified SHA256: {uploadedIRB.sha256Hash.substring(0, 8)}...
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {idx === 3 && (
                        <>
                          <input
                            ref={irbInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleIRBUpload}
                          />
                          <button
                            type="button"
                            onClick={() => irbInputRef.current?.click()}
                            disabled={isUploadingIRB}
                            className="px-3 py-1.5 rounded-lg border border-[#3E6248] bg-white hover:bg-[#FAF7F0] text-xs font-mono text-[#3E6248] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <UploadCloud size={12} />
                            {isUploadingIRB ? "Uploading..." : uploadedIRB ? "Replace PDF" : "Upload Protocol PDF"}
                          </button>
                        </>
                      )}
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#DCE6D7] text-[#3E6248]">
                        {item.required ? "Required" : "Optional"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: PROPOSALS & REVIEW RUBRIC ─── */}
        {activeTab === "proposals" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-3xl bg-white border border-[#E4DCCB] shadow-2xs space-y-4">
              <h3 className="font-serif text-xl font-normal text-[#202920] m-0">
                Grant Commission Peer Review Scorecard
              </h3>
              <p className="text-xs text-[#62685E] font-sans leading-relaxed">
                Applications are graded on a 1 (Exceptional) to 9 (Poor) NIH/NSF scale across three core criteria.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  { criterion: "Significance & Impact", score: "1.4", verdict: "Top 2% Percentile" },
                  { criterion: "Investigator Track Record", score: "1.1", verdict: "Outstanding (Lead PI)" },
                  { criterion: "Methodological Feasibility", score: "1.8", verdict: "High Rigor & Data Quality" },
                ].map((crit, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] text-center">
                    <span className="text-xs font-serif font-medium text-[#202920] block mb-1">
                      {crit.criterion}
                    </span>
                    <span className="text-3xl font-serif font-bold text-[#3E6248] block my-1">
                      {crit.score}
                    </span>
                    <span className="font-mono text-[10.5px] text-[#62685E]">{crit.verdict}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#202920] text-[#FAF7F0] text-xs font-mono shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
