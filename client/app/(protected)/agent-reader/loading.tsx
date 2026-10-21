import React from "react";
import { ManuscriptReaderSkeleton } from "@/components/ui/skeleton";

export default function AgentReaderLoading() {
  return (
    <div className="flex-1 min-w-0 h-screen overflow-hidden flex flex-col bg-[#FAF7F0] font-sans">
      <ManuscriptReaderSkeleton />
    </div>
  );
}
