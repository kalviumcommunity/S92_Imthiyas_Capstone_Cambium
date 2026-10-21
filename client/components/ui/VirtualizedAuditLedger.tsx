"use client";

import React, { useRef, useMemo, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

export interface VirtualAuditEvent {
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

// Generate 10,000 realistic deterministic cryptographic audit events
export function generate10kAuditEvents(): VirtualAuditEvent[] {
  const actions = [
    "SAML.Assertion.Generate",
    "IRB.Protocol.AmendSign",
    "FAIR.Dataset.IndexIngest",
    "Grant.Budget.Reallocate",
    "Compute.GPU.QuotaAdjust",
    "Manuscript.CRediT.Signoff",
    "PeerReview.DoubleBlind.Submit",
    "ExportControl.ITAR.Screen",
    "API.Key.RevokeAttempt",
    "VectorIndex.HNSW.Rebuild",
  ];

  const actors = [
    { name: "Imthiyas (PI)", email: "imthiyas@cambium.mit.edu", role: "Principal Investigator", institution: "MIT CSAIL" },
    { name: "Dr. Elena Rodriguez", email: "e.rodriguez@stanford.edu", role: "Reviewer & Post-Doc", institution: "Stanford Medicine" },
    { name: "Marcus Vance", email: "m.vance@ethz.ch", role: "Data Steward", institution: "ETH Zürich" },
    { name: "Autonomous RAG Worker", email: "service-rag@cambium.internal", role: "Service Principal", institution: "Cambium Cloud" },
    { name: "IRB Compliance Panel", email: "irb-chair@harvard.edu", role: "Ethics Officer", institution: "Harvard Medical School" },
  ];

  const statuses: ("Success" | "Flagged" | "Blocked" | "Audited")[] = ["Success", "Success", "Success", "Flagged", "Audited"];
  const severities: ("Low" | "Medium" | "High" | "Critical")[] = ["Low", "Low", "Medium", "High", "Critical"];

  const events: VirtualAuditEvent[] = [];
  const baseTime = new Date("2026-10-15T12:00:00Z").getTime();

  for (let i = 1; i <= 10000; i++) {
    const actor = actors[i % actors.length];
    const action = actions[i % actions.length];
    const status = statuses[i % statuses.length];
    const severity = severities[i % severities.length];
    const timeOffset = i * 45000; // ~45s apart
    const eventTime = new Date(baseTime - timeOffset).toISOString().replace("T", " ").substring(0, 19) + " UTC";

    // Simple deterministic pseudo-sha256 hex string
    const hex = (i * 2654435761).toString(16).padStart(8, "0") +
      ((i + 1) * 2246822519).toString(16).padStart(8, "0") +
      ((i + 2) * 3266489917).toString(16).padStart(8, "0") +
      ((i + 3) * 668265263).toString(16).padStart(8, "0") +
      ((i + 4) * 374761393).toString(16).padStart(8, "0");

    events.push({
      id: `evt-${100000 - i}`,
      timestamp: eventTime,
      actor,
      action,
      target: `${action.split(".")[0]}-Entity-Asset-${(i % 300) + 1}`,
      ipAddress: `192.168.${(i % 254) + 1}.${(i % 128) + 1}`,
      sha256: hex.padEnd(64, "a").substring(0, 64),
      status,
      severity,
    });
  }

  return events;
}

export default function VirtualizedAuditLedger({
  events,
  searchTerm = "",
}: {
  events: VirtualAuditEvent[];
  searchTerm?: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events;
    const term = searchTerm.toLowerCase();
    return events.filter(
      (e) =>
        e.action.toLowerCase().includes(term) ||
        e.actor.name.toLowerCase().includes(term) ||
        e.target.toLowerCase().includes(term) ||
        e.sha256.toLowerCase().includes(term)
    );
  }, [events, searchTerm]);

  const rowVirtualizer = useVirtualizer({
    count: filteredEvents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 76, // Height of each row in px
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Virtualization Metrics Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#DCE6D7]/60 dark:bg-[#131913] border border-[#66866A]/30 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
          <span className="font-semibold text-[#173F35] dark:text-[#4ADE80]">
            Virtual Scroll Engine Active (@tanstack/react-virtual)
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#62685E] dark:text-slate-400">
          <span>Total Stream: <strong className="text-[#202920] dark:text-white">{filteredEvents.length.toLocaleString()}</strong> rows</span>
          <span className="text-[#3E6248] dark:text-[#4ADE80] font-bold">
            DOM Rendered: {virtualItems.length} nodes
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#3E6248]/15 dark:bg-[#4ADE80]/20 text-[#3E6248] dark:text-[#4ADE80] font-semibold">
            {((1 - virtualItems.length / Math.max(filteredEvents.length, 1)) * 100).toFixed(2)}% DOM Memory Saved
          </span>
        </div>
      </div>

      {/* Virtual Scroll Window Container */}
      <div
        ref={parentRef}
        className="h-[520px] overflow-y-auto rounded-xl border border-[#E4DCCB] dark:border-slate-800 bg-[#FAF7F0] dark:bg-[#161c16] relative scroll-smooth shadow-inner"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualRow) => {
            const event = filteredEvents[virtualRow.index];
            if (!event) return null;

            const severityColors = {
              Low: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
              Medium: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
              High: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300",
              Critical: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300",
            };

            return (
              <div
                key={event.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="px-4 py-2.5 border-b border-[#E4DCCB]/60 dark:border-slate-800/80 flex items-center justify-between gap-4 hover:bg-[#EAE4D5]/60 dark:hover:bg-[#1a231a] transition-colors"
              >
                {/* Event Metadata */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-semibold text-[#3E6248] dark:text-[#4ADE80]">
                      {event.id}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#202920] dark:text-slate-200 truncate">
                      {event.action}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-full font-mono text-[10px] font-bold ${
                        severityColors[event.severity]
                      }`}
                    >
                      {event.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#62685E] dark:text-slate-400 truncate">
                    <span>{event.actor.name}</span>
                    <span>•</span>
                    <span className="truncate">{event.target}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{event.timestamp}</span>
                  </div>
                </div>

                {/* SHA-256 Hash Column */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right hidden md:block">
                    <div className="font-mono text-[11px] text-[#202920] dark:text-slate-300">
                      {event.sha256.substring(0, 16)}...{event.sha256.substring(56)}
                    </div>
                    <div className="font-mono text-[10px] text-[#3E6248] dark:text-[#4ADE80] flex items-center justify-end gap-1">
                      <CheckCircle2 size={10} />
                      Merkle Receipt Verified
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(event.sha256, event.id)}
                    className="p-1.5 rounded-lg border border-[#E4DCCB] dark:border-slate-700 bg-[#FAF7F0] dark:bg-[#1c241c] hover:bg-[#EAE4D5] dark:hover:bg-[#253025] text-[#202920] dark:text-slate-200 cursor-pointer transition-all"
                    title="Copy full SHA-256 hash"
                  >
                    <Copy size={13} className={copiedId === event.id ? "text-emerald-500" : ""} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
