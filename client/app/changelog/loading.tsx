import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChangelogLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] p-6 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 border-b border-[#E4DCCB] pb-6">
          <Skeleton className="h-6 w-36 rounded-full" variant="sage" />
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-2xl bg-white border border-[#E4DCCB] space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32 rounded-lg" variant="sage" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
              <Skeleton className="h-7 w-3/4 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
