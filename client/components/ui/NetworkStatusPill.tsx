"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  Server,
  ShieldCheck,
  Radio,
  Layers,
  X,
} from "lucide-react";
import { useSocket, SocketConnectionState } from "@/lib/hooks/useSocket";
import { getPendingSyncMutations } from "@/lib/storage/offline-store";

interface NetworkStatusPillProps {
  className?: string;
  showLatency?: boolean;
}

export function NetworkStatusPill({
  className = "",
  showLatency = true,
}: NetworkStatusPillProps) {
  const { connectionState, latencyMs, pingGateway } = useSocket({ namespace: "/chat" });
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkPending = async () => {
      try {
        const pending = await getPendingSyncMutations();
        setPendingCount(pending.length);
      } catch {
        // Safe IndexedDB check
      }
    };

    checkPending();
    const interval = setInterval(checkPending, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleManualPing = async () => {
    setIsPinging(true);
    await pingGateway();
    setIsPinging(false);
  };

  const getStatusBadge = () => {
    switch (connectionState) {
      case "CONNECTED":
        return {
          dotClass: "bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.6)]",
          label: showLatency && latencyMs ? `${latencyMs}ms` : "Live",
          title: `Connected to Cambium Edge Network · Latency: ${latencyMs || "Optimal"}`,
          pillClass:
            "border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] text-[#202920] dark:text-[#EDEAE2]",
        };
      case "CONNECTING":
      case "RECONNECTING":
        return {
          dotClass: "bg-amber-400 animate-pulse",
          label: "Reconnecting",
          title: "Restoring real-time WebSocket connection to gateway...",
          pillClass:
            "border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200",
        };
      case "OFFLINE":
      default:
        return {
          dotClass: "bg-red-500",
          label: pendingCount > 0 ? `Offline (${pendingCount})` : "Offline",
          title: "Offline · Local mutations safely buffered in offline queue",
          pillClass:
            "border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200",
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        title={badge.title}
        aria-label={badge.title}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all hover:scale-105 cursor-pointer shadow-2xs ${badge.pillClass} ${className}`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${badge.dotClass}`} aria-hidden="true" />
        <span className="font-semibold tracking-tight">{badge.label}</span>
      </button>

      {/* Network Telemetry & Diagnostics Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="network-diag-title"
          className="fixed inset-0 z-50 bg-[#202920]/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4DCCB] dark:border-[#233327] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3E6248] text-white flex items-center justify-center">
                  <Activity size={16} />
                </div>
                <div>
                  <h3
                    id="network-diag-title"
                    className="font-serif text-base font-bold text-[#202920] dark:text-[#EDEAE2]"
                  >
                    Network Telemetry & Edge Gateway
                  </h3>
                  <p className="text-[11px] text-[#62685E] dark:text-[#A3B899] font-mono">
                    Computer Networking · Distributed Observability
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#85877B] hover:text-[#202920] dark:hover:text-white text-sm cursor-pointer p-1"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B]">
                <div className="text-[10px] text-[#85877B] uppercase flex items-center gap-1 mb-1">
                  <Radio size={11} className="text-[#3E6248] dark:text-[#4ADE80]" />
                  Transport
                </div>
                <div className="font-bold text-[#202920] dark:text-[#EDEAE2]">
                  {connectionState === "CONNECTED" ? "WebSocket (Socket.io)" : "Polling / SSE"}
                </div>
                <div className="text-[10px] text-[#62685E] dark:text-[#A3B899] mt-0.5">
                  HTTP/2 Multiplexed
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B]">
                <div className="text-[10px] text-[#85877B] uppercase flex items-center gap-1 mb-1">
                  <Server size={11} className="text-[#3E6248] dark:text-[#4ADE80]" />
                  Roundtrip (RTT)
                </div>
                <div className="font-bold text-[#3E6248] dark:text-[#4ADE80]">
                  {latencyMs ? `${latencyMs} ms` : "Measuring..."}
                </div>
                <div className="text-[10px] text-[#62685E] dark:text-[#A3B899] mt-0.5">
                  Edge Gateway Ping
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B]">
                <div className="text-[10px] text-[#85877B] uppercase flex items-center gap-1 mb-1">
                  <ShieldCheck size={11} className="text-[#3E6248] dark:text-[#4ADE80]" />
                  Security Tier
                </div>
                <div className="font-bold text-[#202920] dark:text-[#EDEAE2]">TLSv1.3 Strict</div>
                <div className="text-[10px] text-[#62685E] dark:text-[#A3B899] mt-0.5">
                  HSTS · CSP Level 3
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#E4DCCB] dark:border-[#233327] bg-white dark:bg-[#18231B]">
                <div className="text-[10px] text-[#85877B] uppercase flex items-center gap-1 mb-1">
                  <Layers size={11} className="text-[#3E6248] dark:text-[#4ADE80]" />
                  Offline Queue
                </div>
                <div className="font-bold text-[#202920] dark:text-[#EDEAE2]">
                  {pendingCount} Pending
                </div>
                <div className="text-[10px] text-[#62685E] dark:text-[#A3B899] mt-0.5">
                  FIFO IndexedDB
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleManualPing}
                disabled={isPinging}
                className="flex-1 py-2 px-3 rounded-xl bg-[#3E6248] hover:bg-[#202920] text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RefreshCw size={13} className={isPinging ? "animate-spin" : ""} />
                <span>{isPinging ? "Pinging Gateway..." : "Run Latency Probe"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default NetworkStatusPill;
