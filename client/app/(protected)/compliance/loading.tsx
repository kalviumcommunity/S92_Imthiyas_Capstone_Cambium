import React from "react";
import { PageHeaderSkeleton, TableSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ComplianceLoading() {
  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeaderSkeleton
          badgeWidth="w-56"
          titleWidth="w-96"
        />

        {/* Tab pill skeletons */}
        <div className="flex gap-4 border-b border-[#E4DCCB] pb-2">
          <Skeleton className="h-6 w-32 rounded-md" variant="sage" />
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-6 w-36 rounded-md" />
        </div>

        {/* Protocol cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-[#E4DCCB] space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-28 rounded-full" variant="sage" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-32 rounded" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <div className="flex items-center gap-4 pt-2">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
