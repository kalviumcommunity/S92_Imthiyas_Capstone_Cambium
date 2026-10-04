"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Compass, Sparkles } from "lucide-react";

export function CambiumSpatialTransition() {
  const pathname = usePathname();
  const [transitioning, setTransitioning] = useState(false);
  const [targetLabel, setTargetLabel] = useState("");

  useEffect(() => {
    // Determine friendly label from route
    let label = "Living Knowledge Mesh";
    if (pathname.includes("workspace")) label = "Scholar Workspace & Synthesis Engine";
    else if (pathname.includes("opportunities")) label = "Frontier Opportunity Engine";
    else if (pathname.includes("discover")) label = "Global Literature Discovery Cluster";
    else if (pathname.includes("notifications")) label = "Scholarly Message & Peer Network";
    else if (pathname.includes("settings")) label = "Research Identity & RBAC Matrix";
    else if (pathname.includes("billing")) label = "Institutional Grants & Compute Meter";
    else if (pathname.includes("portfolio")) label = "Verified Scholar Portfolio & Provenance";

    setTargetLabel(label);
    setTransitioning(true);

    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!transitioning) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9990] pointer-events-none flex items-center justify-center overflow-hidden animate-in fade-in duration-200"
    >
      {/* Expanding Concentric Vascular Rings (Cambium Living Tissue) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Ring 1 */}
        <div
          className="w-48 h-48 rounded-full border border-[#66866A]/40 bg-[#FAF7F0]/30 backdrop-blur-xs animate-ping"
          style={{ animationDuration: "1.4s", animationIterationCount: 1 }}
        />
        {/* Ring 2 */}
        <div
          className="w-96 h-96 rounded-full border border-dashed border-[#3E6248]/30 animate-ping"
          style={{ animationDuration: "1.8s", animationIterationCount: 1, animationDelay: "150ms" }}
        />
      </div>

      {/* Floating Spatial Orientation Indicator Pill */}
      <div className="relative z-10 px-5 py-2.5 rounded-full bg-[#1B231D]/90 border border-[#3E6248] text-[#FAF7F0] shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
        <div className="w-5 h-5 rounded-full bg-[#FAF7F0] p-0.5 flex items-center justify-center shrink-0">
          <img src="/logo.svg" alt="Cambium Mark" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#66866A] font-semibold">
            Spatial Context Shift
          </span>
          <span className="font-serif text-xs font-medium text-[#FAF7F0]">
            {targetLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
