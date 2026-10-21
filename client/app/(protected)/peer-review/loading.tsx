import React from "react";
import { PageHeaderSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function PeerReviewLoading() {
  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeaderSkeleton badgeWidth="w-72" titleWidth="w-80" />

        {/* Tab switcher */}
        <div className="flex gap-4 border-b border-[#E4DCCB] pb-2">
          <Skeleton className="h-6 w-36 rounded-md" variant="sage" />
          <Skeleton className="h-6 w-44 rounded-md" />
          <Skeleton className="h-6 w-40 rounded-md" />
        </div>

        {/* Double-blind manuscript reviewer desk skeleton */}
        <div className="p-8 rounded-2xl bg-white border border-[#E4DCCB] space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-4">
            <div className="space-y-1">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-7 w-96 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-32 rounded-full" variant="sage" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E4DCCB]">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" variant="sage" />
          </div>
        </div>
      </div>
    </div>
  );
}
