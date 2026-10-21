import React from "react";
import { PageHeaderSkeleton, MetricsGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function GrantsLoading() {
  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeaderSkeleton badgeWidth="w-64" titleWidth="w-96" />

        <MetricsGridSkeleton count={4} />

        {/* Tab pill skeletons */}
        <div className="flex gap-4 border-b border-[#E4DCCB] pb-2">
          <Skeleton className="h-6 w-36 rounded-md" variant="sage" />
          <Skeleton className="h-6 w-44 rounded-md" />
        </div>

        {/* Grant ledger cards */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-[#E4DCCB] space-y-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-24 rounded-full" variant="sage" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>
                  <Skeleton className="h-6 w-96 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-32 rounded-xl" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" variant="sand" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
