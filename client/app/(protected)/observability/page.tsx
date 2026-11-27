"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  BarChart3,
  Cpu,
  Building2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Database,
  Clock,
  Layers,
} from "lucide-react";
import {
  getProductAnalyticsDashboard,
  getEngineeringHealthDashboard,
  getAiObservabilityDashboard,
  getInstitutionUsageDashboard,
} from "@/lib/api";

type DashboardTab = "product" | "engineering" | "ai" | "institution";

export default function ObservabilityPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("product");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [productData, setProductData] = useState<any>(null);
  const [engineeringData, setEngineeringData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [institutionData, setInstitutionData] = useState<any>(null);

  const loadTabData = useCallback(async (tab: DashboardTab) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (tab === "product") {
        setProductData(await getProductAnalyticsDashboard(30));
      } else if (tab === "engineering") {
        setEngineeringData(await getEngineeringHealthDashboard());
      } else if (tab === "ai") {
        setAiData(await getAiObservabilityDashboard(24));
      } else if (tab === "institution") {
        setInstitutionData(await getInstitutionUsageDashboard(30));
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Telemetry endpoint unavailable or requires elevated role");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTabData(activeTab);
  }, [activeTab, loadTabData]);

  const tabs: Array<{ id: DashboardTab; label: string; icon: React.ReactNode }> = [
    { id: "product", label: "Product Intelligence", icon: <BarChart3 size={18} /> },
    { id: "engineering", label: "Engineering Health", icon: <Activity size={18} /> },
    { id: "ai", label: "AI & RAG Quality", icon: <Cpu size={18} /> },
    { id: "institution", label: "Institutional Usage", icon: <Building2 size={18} /> },
  ];

  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] p-6 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DCCB] dark:border-[#28382C] pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7] dark:bg-[#1E2B21] text-[#3E6248] dark:text-[#4ADE80] text-xs font-mono uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>Privacy-Preserving Operations</span>
            </div>
            <h1 className="font-serif text-3xl font-normal text-[#202920] dark:text-[#EDEAE2] m-0">
              Product Analytics &amp; Observability
            </h1>
            <p className="text-sm text-[#62685E] dark:text-[#9DA39A] m-0">
              Verified domain funnels, API health SLOs, AI cost attribution, and institutional aggregates excluding synthetic test traffic.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadTabData(activeTab)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] text-xs font-mono font-semibold cursor-pointer border-0 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Refreshing..." : "Refresh Metrics"}</span>
          </button>
        </header>

        <nav
          role="tablist"
          aria-label="Observability Dashboards"
          className="flex flex-wrap gap-2"
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                  selected
                    ? "bg-[#3E6248] text-[#FAF7F0] border-[#3E6248]"
                    : "bg-white dark:bg-[#151F17] text-[#202920] dark:text-[#EDEAE2] border-[#E4DCCB] dark:border-[#28382C] hover:bg-[#DCE6D7]/40"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {errorMsg && (
          <div
            role="alert"
            className="p-4 rounded-2xl border border-[#A33B32]/40 bg-white dark:bg-[#151F17] text-sm text-[#A33B32] dark:text-[#F87171] flex items-center gap-3"
          >
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === "product" && productData && (
          <section aria-label="Product Intelligence Dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="DAU / WAU / MAU"
                value={`${productData.activitySummary.dau} / ${productData.activitySummary.wau} / ${productData.activitySummary.mau}`}
                hint={`Stickiness: ${productData.activitySummary.stickinessRatio}`}
              />
              <MetricCard
                label="Researcher Activation"
                value={`${productData.activation.activationRatePct}%`}
                hint={`${productData.activation.activatedUsers} / ${productData.activation.eligibleSignups} eligible (14d window)`}
              />
              <MetricCard
                label="Institutional Users"
                value={String(productData.activitySummary.institutionalActiveUsers)}
                hint={`${productData.activitySummary.activeOrganizations} active orgs`}
              />
              <MetricCard
                label="Test Events Excluded"
                value={String(productData.metadata.excludedEventCount)}
                hint={`${productData.metadata.totalIncludedEvents} verified human events`}
              />
            </div>

            <div className="bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-xl font-normal m-0">
                Discovery-to-Collaboration Funnel (Distinct Human Accounts, 30d)
              </h2>
              <div className="space-y-3">
                {productData.funnel.map((step: any) => {
                  const maxVal = Math.max(
                    1,
                    ...productData.funnel.map((f: any) => f.distinctUsers || 0),
                  );
                  const pct = Math.round(((step.distinctUsers || 0) / maxVal) * 100);
                  return (
                    <div key={step.eventName} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span>
                          {step.stage} ({step.eventName})
                        </span>
                        <span className="font-semibold">{step.distinctUsers}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#FAF7F0] dark:bg-[#0E140F] overflow-hidden border border-[#E4DCCB] dark:border-[#28382C]">
                        <div
                          className="h-full bg-[#3E6248] dark:bg-[#4ADE80]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] rounded-2xl p-6 space-y-3">
              <h2 className="font-serif text-xl font-normal m-0">
                Retention Cohorts (D1 / D7 / D30)
              </h2>
              {productData.cohorts.length === 0 ? (
                <p className="text-sm text-[#62685E] dark:text-[#9DA39A]">
                  No signed-up human cohorts recorded inside the active lookback window.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-[#E4DCCB] dark:border-[#28382C] text-[#62685E] dark:text-[#9DA39A]">
                        <th className="py-2 pr-4">Cohort Date</th>
                        <th className="py-2 pr-4">Signed Up</th>
                        <th className="py-2 pr-4">D1</th>
                        <th className="py-2 pr-4">D7</th>
                        <th className="py-2 pr-4">D30</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.cohorts.map((row: any) => (
                        <tr key={row.cohortDate} className="border-b border-[#E4DCCB]/50 dark:border-[#28382C]/50">
                          <td className="py-2 pr-4">{row.cohortDate}</td>
                          <td className="py-2 pr-4">{row.signedUp}</td>
                          <td className="py-2 pr-4">{row.d1RetainedPct}%</td>
                          <td className="py-2 pr-4">{row.d7RetainedPct}%</td>
                          <td className="py-2 pr-4">{row.d30RetainedPct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "engineering" && engineeringData && (
          <section aria-label="Engineering Health Dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="API p95 Latency"
                value={`${engineeringData.telemetry.p95LatencyMs} ms`}
                hint={`p50=${engineeringData.telemetry.p50LatencyMs}ms · p99=${engineeringData.telemetry.p99LatencyMs}ms`}
              />
              <MetricCard
                label="API Error Rate"
                value={`${engineeringData.telemetry.errorRatePercent}%`}
                hint={`${engineeringData.telemetry.totalErrors} errors / ${engineeringData.telemetry.totalRequests} reqs`}
              />
              <MetricCard
                label="DB Active / Locks"
                value={`${engineeringData.database.activeConnections}/${engineeringData.database.maxConnections}`}
                hint={`locks=${engineeringData.database.waitingLocksCount} · slow=${engineeringData.database.slowQueriesCount}`}
              />
              <MetricCard
                label="Queue Dead / Age"
                value={`${engineeringData.queues?.summary?.dead ?? 0} dead`}
                hint={`mode=${engineeringData.queues?.mode} · oldest=${engineeringData.queues?.summary?.oldestPendingAgeSeconds ?? 0}s`}
              />
            </div>

            <div className="bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] rounded-2xl p-6 space-y-3">
              <h2 className="font-serif text-xl font-normal m-0">Active Alert Rules</h2>
              {engineeringData.alerts.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-[#3E6248] dark:text-[#4ADE80]">
                  <CheckCircle2 size={18} />
                  <span>All monitored API, PostgreSQL, Queue, Circuit Breaker, and AI budgets nominal.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {engineeringData.alerts.map((a: any) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl border border-[#E4DCCB] dark:border-[#28382C] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold mr-2">[{a.severity}]</span>
                        <span>{a.title}: {a.summary}</span>
                      </div>
                      <span className="text-[#62685E] dark:text-[#9DA39A]">
                        {a.metricValue} ({a.runbookId})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] rounded-2xl p-6 space-y-3">
              <h2 className="font-serif text-xl font-normal m-0">
                Recent Frontend Error Reports ({engineeringData.clientErrors.countLast24h} in 24h)
              </h2>
              {engineeringData.clientErrors.recent.length === 0 ? (
                <p className="text-sm text-[#62685E] dark:text-[#9DA39A]">
                  Zero sanitized UI route errors captured in telemetry store.
                </p>
              ) : (
                <ul className="space-y-2 list-none p-0 m-0 text-xs font-mono">
                  {engineeringData.clientErrors.recent.map((err: any) => (
                    <li
                      key={err.id}
                      className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0E140F] border border-[#E4DCCB] dark:border-[#28382C]"
                    >
                      <strong>{err.route}</strong> · {err.errorName} — {err.sanitizedMessage}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {activeTab === "ai" && aiData && (
          <section aria-label="AI and RAG Observability Dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="AI Calls (24h)"
                value={String(aiData.runtime.totalCalls)}
                hint={`fallback=${aiData.runtime.outcomes.fallbackRatePct}% · fail=${aiData.runtime.outcomes.failureRatePct}%`}
              />
              <MetricCard
                label="AI Latency (p95)"
                value={`${aiData.runtime.latency.p95LatencyMs} ms`}
                hint={`avg=${aiData.runtime.latency.avgLatencyMs} ms`}
              />
              <MetricCard
                label="Est. Cost (24h)"
                value={`$${aiData.runtime.tokensAndCost.totalEstimatedCostUsd}`}
                hint={`$${aiData.runtime.tokensAndCost.costPerSuccessfulWorkflowUsd}/success workflow`}
              />
              <MetricCard
                label={`Eval Recall@3 (${aiData.offlineEvaluation.datasetVersion})`}
                value={`${aiData.offlineEvaluation.recallAt3Pct}%`}
                hint={`Citation=${aiData.offlineEvaluation.citationCompletenessPct}% · Abstain=${aiData.offlineEvaluation.abstentionAccuracyPct}%`}
              />
            </div>

            <div className="bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] rounded-2xl p-6 space-y-3">
              <h2 className="font-serif text-xl font-normal m-0">
                Retrieval &amp; Pricing Transparency
              </h2>
              <p className="text-xs font-mono text-[#62685E] dark:text-[#9DA39A] m-0">
                {aiData.runtime.tokensAndCost.pricingNote}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#0E140F] border border-[#E4DCCB] dark:border-[#28382C]">
                  <div className="text-[#62685E] dark:text-[#9DA39A]">Avg Chunks Retrieved</div>
                  <div className="text-lg font-semibold">{aiData.runtime.retrievalQuality.avgChunksRetrieved}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#0E140F] border border-[#E4DCCB] dark:border-[#28382C]">
                  <div className="text-[#62685E] dark:text-[#9DA39A]">Avg Citations / Chat</div>
                  <div className="text-lg font-semibold">{aiData.runtime.retrievalQuality.avgCitationsPerChat}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#0E140F] border border-[#E4DCCB] dark:border-[#28382C]">
                  <div className="text-[#62685E] dark:text-[#9DA39A]">Eval Precision@3</div>
                  <div className="text-lg font-semibold">{aiData.offlineEvaluation.precisionAt3Pct}%</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "institution" && institutionData && (
          <section aria-label="Institutional Usage Dashboard" className="space-y-6">
            <div className="bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif text-xl font-normal m-0">
                  Organization Usage Summary (k &ge; {institutionData.minCohortThreshold} Anonymity Gate)
                </h2>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FAF7F0] dark:bg-[#0E140F] border border-[#E4DCCB] dark:border-[#28382C]">
                  Active Researchers: {institutionData.activeResearchersCount}
                </span>
              </div>

              {institutionData.privacySuppressed ? (
                <div className="p-4 rounded-xl bg-[#FAF7F0] dark:bg-[#0E140F] border border-[#E4DCCB] dark:border-[#28382C] text-sm flex items-start gap-3">
                  <Database size={18} className="shrink-0 mt-0.5 text-[#3E6248] dark:text-[#4ADE80]" />
                  <div>
                    <div className="font-semibold">Subgroup Breakdown Suppressed</div>
                    <p className="text-xs text-[#62685E] dark:text-[#9DA39A] mt-1 mb-0">
                      {institutionData.suppressionReason}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MetricCard
                    label="Workspaces Created"
                    value={String(institutionData.summary.workspacesCreated)}
                    hint={`${institutionData.summary.collaborationsAccepted} collaborations accepted`}
                  />
                  <MetricCard
                    label="Opportunities Saved"
                    value={String(institutionData.summary.opportunitiesSaved)}
                    hint={`${institutionData.summary.opportunitiesSearched} searches executed`}
                  />
                  <MetricCard
                    label="Documents & AI Workflows"
                    value={String(institutionData.summary.documentsUploaded)}
                    hint={`${institutionData.summary.aiWorkflowsCompleted} AI assistant runs`}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {!loading &&
          !errorMsg &&
          !productData &&
          !engineeringData &&
          !aiData &&
          !institutionData && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] text-sm text-[#62685E] dark:text-[#9DA39A] flex items-center gap-3">
              <Clock size={18} />
              <span>Select a telemetry domain tab above to query live metrics.</span>
            </div>
          )}

        <footer className="text-xs font-mono text-[#62685E] dark:text-[#9DA39A] flex items-center gap-2 pt-2">
          <Layers size={14} />
          <span>Zero raw research manuscripts, prompts, credentials, or emails persisted in analytics or observability stores.</span>
        </footer>
      </div>
    </div>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-white dark:bg-[#151F17] border border-[#E4DCCB] dark:border-[#28382C] rounded-2xl p-5 space-y-1.5">
      <div className="text-xs font-mono uppercase tracking-wider text-[#62685E] dark:text-[#9DA39A]">
        {label}
      </div>
      <div className="font-serif text-2xl font-semibold text-[#202920] dark:text-[#EDEAE2]">
        {value}
      </div>
      <div className="text-xs text-[#62685E] dark:text-[#9DA39A]">{hint}</div>
    </div>
  );
}
