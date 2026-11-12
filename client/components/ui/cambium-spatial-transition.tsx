"use client";

import { usePathname } from "next/navigation";
import { Compass, Sparkles } from "lucide-react";

export function CambiumSpatialTransition() {
  const pathname = usePathname() ?? "";
  const targetLabel = pathname.includes("workspace")
    ? "Scholar Workspace & Synthesis Engine"
    : pathname.includes("opportunities")
      ? "Frontier Opportunity Engine"
      : pathname.includes("discover")
        ? "Global Literature Discovery Cluster"
        : pathname.includes("notifications")
          ? "Scholarly Message & Peer Network"
          : pathname.includes("settings")
            ? "Research Identity & RBAC Matrix"
            : pathname.includes("billing")
              ? "Institutional Grants & Compute Meter"
              : pathname.includes("portfolio")
                ? "Verified Scholar Portfolio & Provenance"
                : "Living Knowledge Mesh";

  return (
    <div
      key={pathname}
      aria-hidden="true"
      className="cambium-spatial-transition fixed inset-0 z-[9990] pointer-events-none flex items-center justify-center overflow-hidden"
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
        <div className="w-5 h-5 rounded-full bg-[#FAF7F0] p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/public_logo/cambium-logo-light.svg" alt="Cambium Mark" className="w-full h-full object-contain transition-transform" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#A3C9A8] font-semibold">
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
