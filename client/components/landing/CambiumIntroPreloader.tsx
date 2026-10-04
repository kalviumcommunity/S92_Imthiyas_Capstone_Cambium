"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface CambiumIntroPreloaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function CambiumIntroPreloader({
  onComplete,
  forceShow = false,
}: CambiumIntroPreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0); // 0: Genesis spiral, 1: Connecting Nodes, 2: Typography Assembly, 3: Resolved

  useEffect(() => {
    if (!forceShow) {
      const shown = sessionStorage.getItem("cambium_intro_shown");
      if (shown === "true") {
        setVisible(false);
        if (onComplete) onComplete();
        return;
      }
    }

    sessionStorage.setItem("cambium_intro_shown", "true");

    const startTime = Date.now();
    const duration = 3200; // 3.2 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < 900) {
        setStep(0);
      } else if (elapsed < 1900) {
        setStep(1);
      } else if (elapsed < 2700) {
        setStep(2);
      } else {
        setStep(3);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadingOut(true);
        setTimeout(() => {
          setVisible(false);
          if (onComplete) onComplete();
        }, 500);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [forceShow, onComplete]);

  if (!visible) return null;

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#141A14] text-[#FAF7F0] flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none transition-all duration-700 font-sans ${
        fadingOut ? "opacity-0 scale-[1.01] blur-xs pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Precision Micro Topological Grid (Subtle, Enterprise, Non-AI) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(228,220,203,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(228,220,203,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Header Telemetry */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#1B231D] border border-[#3E6248]/50 flex items-center justify-center p-1">
            <img src="/logo.svg" alt="CAMBIUM Mark" className="w-full h-full object-contain" />
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#85877B]">
            Cambium Runtime · Kernel 2.4
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="text-[11px] font-mono tracking-wider uppercase px-3 py-1.5 rounded-full border border-[#3E6248]/40 bg-[#1B231D]/80 hover:bg-[#253228] text-[#DCE6D7] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Skip [Esc]</span>
          <ArrowRight size={11} className="text-[#66866A]" />
        </button>
      </div>

      {/* Centerpiece: Ultra-Clean Monumental Typography Assembly */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4 max-w-5xl mx-auto w-full">
        {/* Minimalist Dual Fibonacci Spiral Mark */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#1B231D] border border-[#3E6248] p-2.5 flex items-center justify-center shadow-lg transition-transform">
            <img
              src="/logo.svg"
              alt="CAMBIUM Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Monumental CAMBIUM RESEARCH Typography with Connected Structural Nodes */}
        <div className="relative overflow-visible py-3">
          {/* Crisp SVG Connecting Node Mesh */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible -top-2">
            <line
              x1="6%"
              y1="50%"
              x2="94%"
              y2="50%"
              stroke="#3E6248"
              strokeWidth="1"
              strokeDasharray="4 6"
              className="opacity-40"
            />
            {/* Minimal node ticks along the wordmark axis */}
            {[12, 28, 44, 60, 76, 88].map((pct, idx) => (
              <g key={idx}>
                <circle
                  cx={`${pct}%`}
                  cy="50%"
                  r={step >= 1 ? "2.5" : "1.5"}
                  fill={step >= 2 ? "#66866A" : "#3E6248"}
                  className="transition-all duration-500"
                />
              </g>
            ))}
          </svg>

          <h1 className="font-sans font-bold text-4xl sm:text-6xl md:text-7xl lg:text-[90px] tracking-[-0.04em] leading-none uppercase m-0 flex flex-wrap items-center justify-center gap-x-5 text-[#FAF7F0]">
            <span
              className="inline-block transition-all duration-700"
              style={{
                opacity: step >= 0 ? 1 : 0.2,
                transform: step >= 1 ? "translateY(0)" : "translateY(4px)",
              }}
            >
              CAMBIUM
            </span>
            <span
              className="font-light tracking-[0.04em] text-[#66866A] transition-all duration-700"
              style={{
                opacity: step >= 1 ? 1 : 0.2,
                transform: step >= 1 ? "translateY(0)" : "translateY(4px)",
              }}
            >
              RESEARCH
            </span>
          </h1>
        </div>

        {/* Minimal Understated Tagline */}
        <div className="mt-6 flex flex-col items-center gap-1.5">
          <p className="font-serif italic text-sm sm:text-base text-[#DCE6D7] m-0 font-normal">
            The Research Operating System.
          </p>
          <span className="font-mono text-[11px] text-[#66866A] tracking-[0.16em] uppercase">
            {step === 0 && "SYNCHRONIZING SCHOLARLY TOPOLOGY"}
            {step === 1 && "CONNECTING ACADEMIC MESH"}
            {step === 2 && "INITIALIZING RESEARCH WORKSPACE"}
            {step === 3 && "SYSTEM READY"}
          </span>
        </div>
      </div>

      {/* Bottom Minimal Hairline Progress Bar */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between gap-4 border-t border-[#3E6248]/30 pt-5">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#85877B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#66866A] inline-block" />
          <span>FIBONACCI MESH · VERIFIED SECURE</span>
        </div>

        {/* Clean Hairline Progress Meter */}
        <div className="flex items-center gap-3 w-48 sm:w-60">
          <div className="flex-1 h-[2px] bg-[#202920] overflow-hidden">
            <div
              className="h-full bg-[#66866A] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-[#85877B] shrink-0 w-8 text-right">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
