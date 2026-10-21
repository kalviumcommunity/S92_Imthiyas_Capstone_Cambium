import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] p-6 sm:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <Skeleton className="h-6 w-44 rounded-full mx-auto" variant="sage" />
          <Skeleton className="h-10 w-96 rounded-xl mx-auto" />
          <Skeleton className="h-4 w-80 rounded mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-3xl bg-white border border-[#E4DCCB] space-y-6 animate-pulse">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-10 w-44 rounded-xl" />
              <div className="space-y-3 pt-4 border-t border-[#E4DCCB]">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-4 w-full rounded" />
                ))}
              </div>
              <Skeleton className="h-12 w-full rounded-2xl" variant="sage" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
