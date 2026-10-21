import React from "react";
import { PageHeaderSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeaderSkeleton badgeWidth="w-56" titleWidth="w-80" />

        {/* Current Plan Overview Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#E4DCCB] space-y-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-8 w-64 rounded-xl" />
            </div>
            <Skeleton className="h-7 w-28 rounded-full" variant="sage" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E4DCCB]">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>

        {/* Tier Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-[#E4DCCB] space-y-4 animate-pulse">
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-8 w-36 rounded-lg" />
              <div className="space-y-2 pt-2 border-t border-[#E4DCCB]">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-4/5 rounded" />
                <Skeleton className="h-3.5 w-3/4 rounded" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" variant="sage" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
