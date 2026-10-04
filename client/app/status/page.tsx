"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight, Play, ExternalLink } from "lucide-react";

type StatusCode = "200" | "201" | "404" | "500";

interface StatusItem {
  code: StatusCode;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  exampleUrl: string;
  previewRoute?: string;
  samplePayload: Record<string, any>;
}

const STATUS_ITEMS: Record<StatusCode, StatusItem> = {
  "200": {
    code: "200",
    title: "200 OK — Successful Query & Synthesis",
    badge: "Success · Standard Response",
    badgeColor: "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/40",
    description: "Returned when a GET/POST request successfully resolves entity records, scholarly graph nodes, or system telemetry.",
    exampleUrl: "GET /api (Health Check) & GET /api/research-opportunities",
    previewRoute: "/dashboard",
    samplePayload: {
      status: "Active",
      code: 200,
      service: "Cambium Core Platform API",
      version: "2.0.0",
      database: "PostgreSQL (Normalized 3NF + pgvector)",
      timestamp: "2026-10-04T12:26:00.000Z",
      data: {
        totalOpportunities: 48,
        activeResearchers: 1420,
        graphNodes: 84200,
        syncStatus: "Synchronized",
      },
    },
  },
  "201": {
    code: "201",
    title: "201 Created — Resource & Artifact Created",
    badge: "Success · Resource Instantiated",
    badgeColor: "bg-[#DCE6D7] text-[#3E6248] border-[#66866A]/40",
    description: "Returned upon successful creation of a new research user, minted DOI, workspace document, or grant bookmark.",
    exampleUrl: "POST /api/auth/register & POST /api/bookmarks",
    previewRoute: "/workspace",
    samplePayload: {
      status: "Created",
      code: 201,
      message: "Research Artifact Successfully Instantiated & Verified",
      timestamp: "2026-10-04T12:26:00.000Z",
      artifact: {
        id: "art_cambium_9841",
        doi: "10.1038/CAMBIUM-2026.04",
        title: "Foundation Models for Medical Image Understanding",
        provenance: "Cryptographically Verified",
        author: "Imthiyas",
      },
    },
  },
  "404": {
    code: "404",
    title: "404 Not Found — Research Artifact Missing",
    badge: "Client Error · Horizon Not Found",
    badgeColor: "bg-[#F2EBDD] text-[#8A5A12] border-[#8A5A12]/30",
    description: "Rendered when a paper, researcher handle, or workspace document is missing or moved. Features constellation physics canvas.",
    exampleUrl: "GET /non-existent-research-path",
    previewRoute: "/404",
    samplePayload: {
      statusCode: 404,
      error: "Not Found",
      message: "Research artifact or horizon not found in current namespace.",
      suggestion: "Return to Workspace or Discover to explore 240M+ cataloged papers.",
    },
  },
  "500": {
    code: "500",
    title: "500 Internal Error — Signal Interruption",
    badge: "Server Error · Interruption Caught",
    badgeColor: "bg-[#FDE8E8] text-[#9B1C1C] border-[#F8B4B4]",
    description: "Catch-all error boundary with interactive animated particle physics, allowing one-click retry without data loss.",
    exampleUrl: "GET /500",
    previewRoute: "/500",
    samplePayload: {
      statusCode: 500,
      error: "Internal Server Interruption",
      digest: "cambium_err_5819_signal_break",
      message: "Our servers are experiencing an interruption. Your research data remains securely saved.",
      recoverable: true,
    },
  },
};

export default function StatusHubPage() {
  const [selectedCode, setSelectedCode] = useState<StatusCode>("200");
  const [simulating, setSimulating] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);

  const current = STATUS_ITEMS[selectedCode];

  function runSimulation() {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setLastExecuted(`Simulated ${current.code} response at ${new Date().toLocaleTimeString()}`);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans pb-24 text-[#202920]">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md px-6 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3E6248] animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#3E6248]">
            Cambium System Status & Endpoints Explorer
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-[#62685E] hover:text-[#202920] no-underline font-mono uppercase tracking-wider"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-8 pt-10">
        {/* Title area */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7] border border-[#66866A]/30 text-[#3E6248] text-[11px] font-mono tracking-wider uppercase mb-3 font-semibold">
            HTTP Status Registry · 200 · 201 · 404 · 500
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] m-0 mb-2">
            Status Codes & Endpoint Handlers
          </h1>
          <p className="text-sm text-[#62685E] font-sans max-w-2xl leading-relaxed">
            Directly test, inspect, and preview all operational and error status pages implemented in Cambium Research.
          </p>
        </div>

        {/* Code Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {(["200", "201", "404", "500"] as StatusCode[]).map((code) => {
            const item = STATUS_ITEMS[code];
            const isSelected = selectedCode === code;
            return (
              <button
                key={code}
                onClick={() => setSelectedCode(code)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-[#3E6248] shadow-md ring-2 ring-[#3E6248]/15"
                    : "bg-white/60 border-[#E4DCCB] hover:bg-white hover:border-[#66866A]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#202920]">
                    {code}
                  </span>
                  {code === "200" || code === "201" ? (
                    <CheckCircle2 size={16} className="text-[#3E6248]" />
                  ) : code === "404" ? (
                    <AlertTriangle size={16} className="text-[#8A5A12]" />
                  ) : (
                    <XCircle size={16} className="text-[#9B1C1C]" />
                  )}
                </div>
                <div className="text-xs font-semibold text-[#62685E] font-sans truncate">
                  {code === "200" ? "OK" : code === "201" ? "Created" : code === "404" ? "Not Found" : "Server Error"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Status Detail Card */}
        <div className="bg-white border border-[#E4DCCB] rounded-3xl p-6 sm:p-8 shadow-2xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DCCB]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
                  {current.badge}
                </span>
                <span className="text-xs font-mono text-[#85877B]">{current.exampleUrl}</span>
              </div>
              <h2 className="font-serif text-2xl font-normal text-[#202920] m-0">
                {current.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runSimulation}
                disabled={simulating}
                className="px-4 py-2 rounded-full bg-[#3E6248] hover:bg-[#202920] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border-none"
              >
                <Play size={12} fill="currentColor" />
                <span>{simulating ? "Executing..." : "Execute Query"}</span>
              </button>

              {current.previewRoute && (
                <Link
                  href={current.previewRoute}
                  className="px-4 py-2 rounded-full bg-[#FAF7F0] hover:bg-[#E4DCCB] border border-[#E4DCCB] text-[#202920] text-xs font-mono uppercase tracking-wider font-semibold transition-all no-underline flex items-center gap-1.5"
                >
                  <span>Open Page</span>
                  <ExternalLink size={12} />
                </Link>
              )}
            </div>
          </div>

          <div className="py-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#85877B] font-bold mb-2">
              Behavior & Purpose
            </h3>
            <p className="text-sm text-[#62685E] font-sans leading-relaxed mb-6">
              {current.description}
            </p>

            <h3 className="text-xs font-mono uppercase tracking-wider text-[#85877B] font-bold mb-2 flex items-center justify-between">
              <span>Live Response Payload (JSON)</span>
              {lastExecuted && <span className="text-[#3E6248] font-normal">{lastExecuted}</span>}
            </h3>
            <div className="rounded-2xl bg-[#202920] p-5 text-[#FAF7F0] font-mono text-xs overflow-x-auto shadow-inner border border-[#3E6248]/30">
              <pre className="m-0 leading-relaxed">
                {JSON.stringify(current.samplePayload, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Quick Links List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/404"
            className="p-5 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#66866A] transition-all no-underline group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-bold text-[#202920] group-hover:text-[#3E6248]">
                View 404 Page Directly →
              </span>
              <span className="text-xs font-mono text-[#85877B]">/404</span>
            </div>
            <p className="text-xs text-[#62685E] m-0">
              Displays interactive particle constellation canvas with "Research artifact not found".
            </p>
          </Link>

          <Link
            href="/500"
            className="p-5 rounded-2xl bg-white border border-[#E4DCCB] hover:border-[#66866A] transition-all no-underline group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-bold text-[#202920] group-hover:text-[#3E6248]">
                View 500 Error Page Directly →
              </span>
              <span className="text-xs font-mono text-[#85877B]">/500</span>
            </div>
            <p className="text-xs text-[#62685E] m-0">
              Displays interactive particle physics canvas with "500 — System disruption" & reset.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
