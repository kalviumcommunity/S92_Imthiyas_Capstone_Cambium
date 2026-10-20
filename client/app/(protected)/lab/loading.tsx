import React from "react";
import { PageHeaderSkeleton, MetricsGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function LabLoading() {
  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeaderSkeleton badgeWidth="w-64" titleWidth="w-96" />

        <MetricsGridSkeleton count={4} />

        {/* Tab pill skeletons */}
        <div className="flex gap-4 border-b border-[#E4DCCB] pb-2">
          <Skeleton className="h-6 w-44 rounded-md" variant="sage" />
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-6 w-40 rounded-md" />
        </div>

        {/* Project cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-[#E4DCCB] flex justify-between items-center animate-pulse">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-24 rounded-full" variant="sage" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
                <Skeleton className="h-6 w-96 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-32 rounded-xl" />
                <Skeleton className="h-9 w-32 rounded-xl" variant="sage" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
