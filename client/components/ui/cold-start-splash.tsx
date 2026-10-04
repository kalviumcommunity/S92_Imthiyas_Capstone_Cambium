"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface ColdStartSplashProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

const BOOT_LOGS = [
  { time: "0.012s", label: "HYDRATING_SCHOLAR_RUNTIME", status: "OK" },
  { time: "0.042s", label: "COMPILING_FIBONACCI_TOPOLOGY", status: "MOUNTED" },
  { time: "0.078s", label: "AIR_GAP_ENCRYPTED_ENCLAVE", status: "SECURED" },
  { time: "0.115s", label: "SYNCHRONIZING_RELATIONAL_MESH", status: "100%" },
  { time: "0.150s", label: "CAMBIUM_RESEARCH_OS", status: "READY" },
];

export function ColdStartSplash({ onComplete, minDurationMs = 1200 }: ColdStartSplashProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const intervals = [
      setTimeout(() => setActiveStep(1), 160),
      setTimeout(() => setActiveStep(2), 340),
      setTimeout(() => setActiveStep(3), 560),
      setTimeout(() => setActiveStep(4), 820),
      setTimeout(() => {
        if (onComplete) onComplete();
      }, minDurationMs),
    ];

    return () => intervals.forEach((i) => clearTimeout(i));
  }, [onComplete, minDurationMs]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F0] font-sans select-none">
      {/* Background Subtle Coordinate Mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(#E4DCCB 1px, transparent 1px), radial-gradient(#E4DCCB 1px, #FAF7F0 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />

      {/* Center Console Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        {/* Breathing Logo Container */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 rounded-full bg-[#3E6248]/10 blur-md animate-pulse" />
          <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] p-2 flex items-center justify-center shadow-md relative z-10">
            <img
              src="/logo.svg"
              alt="CAMBIUM Research Mark"
              className="w-full h-full object-contain animate-spin-slow"
              style={{ animationDuration: "12s" }}
            />
          </div>
        </div>

        {/* Wordmark */}
        <div className="text-center mb-6">
          <h1 className="font-sans font-bold tracking-[-0.03em] text-[#202920] text-[18px] uppercase m-0 leading-none">
            CAMBIUM <span className="font-light text-[#3E6248]">RESEARCH</span>
          </h1>
          <p className="text-[11px] font-mono tracking-widest text-[#85877B] uppercase mt-2 m-0">
            SCHOLARLY RUNTIME HYDRATION
          </p>
        </div>

        {/* Terminal Boot Log */}
        <div className="w-full bg-white/80 backdrop-blur-xs border border-[#E4DCCB] rounded-xl p-3.5 shadow-2xs font-mono text-[11px] space-y-1.5">
          {BOOT_LOGS.map((log, index) => {
            const isVisible = index <= activeStep;
            const isCurrent = index === activeStep;
            return (
              <div
                key={log.label}
                className={`flex items-center justify-between transition-opacity duration-150 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#85877B]">{log.time}</span>
                  <span className={isCurrent ? "text-[#3E6248] font-bold" : "text-[#202920]"}>
                    {log.label}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    log.status === "READY"
                      ? "bg-[#DCE6D7] text-[#3E6248]"
                      : "bg-[#F2EBDD] text-[#62685E]"
                  }`}
                >
                  {log.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Hardware Telemetry */}
        <div className="flex items-center gap-4 mt-6 text-[10.5px] font-mono text-[#85877B]">
          <span>CORE: V8-EDGE</span>
          <span>·</span>
          <span>LATENCY: 4ms</span>
          <span>·</span>
          <span className="text-[#3E6248]">AIR-GAP: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
