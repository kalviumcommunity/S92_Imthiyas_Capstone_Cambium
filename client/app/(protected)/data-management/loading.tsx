import React from "react";
import { PageHeaderSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function DataManagementLoading() {
  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeaderSkeleton badgeWidth="w-72" titleWidth="w-96" />

        {/* FAIR Maturity Banner Skeleton */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] flex flex-col md:flex-row justify-between gap-6 animate-pulse">
          <div className="flex items-center gap-5">
            <Skeleton className="w-16 h-16 rounded-2xl" variant="sage" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-64 rounded-lg" />
              <Skeleton className="h-4 w-96 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-20 h-14 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Tab pill skeletons */}
        <div className="flex gap-4 border-b border-[#E4DCCB] pb-2">
          <Skeleton className="h-6 w-40 rounded-md" variant="sage" />
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-6 w-44 rounded-md" />
        </div>

        {/* Dataset list skeletons */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-[#E4DCCB] space-y-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" variant="sage" />
                    <Skeleton className="h-4 w-40 rounded" />
                  </div>
                  <Skeleton className="h-6 w-96 rounded-lg" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E4DCCB]/60">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-4 w-32 rounded" variant="sage" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
