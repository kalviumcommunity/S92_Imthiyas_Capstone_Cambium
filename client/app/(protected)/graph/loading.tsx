import React from "react";
import { GraphConstellationSkeleton } from "@/components/ui/skeleton";

export default function GraphLoading() {
  return (
    <div className="flex-1 min-w-0 h-screen overflow-hidden flex flex-col bg-[#FAF7F0] font-sans">
      <GraphConstellationSkeleton />
    </div>
  );
}
