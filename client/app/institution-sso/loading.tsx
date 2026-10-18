import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstitutionSsoLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] p-6 sm:p-12 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center border-b border-[#E4DCCB] pb-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-5 w-32 rounded-md" />
      </div>

      <div className="max-w-xl mx-auto w-full my-auto py-12 space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-6 w-48 rounded-full mx-auto" variant="sage" />
          <Skeleton className="h-10 w-80 rounded-xl mx-auto" />
          <Skeleton className="h-4 w-96 rounded mx-auto" />
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#E4DCCB] space-y-5 animate-pulse">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-12 w-full rounded-2xl" variant="parchment" />
          <Skeleton className="h-12 w-full rounded-2xl" variant="sage" />
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full border-t border-[#E4DCCB] pt-4 text-center">
        <Skeleton className="h-4 w-64 rounded mx-auto" />
      </div>
    </div>
  );
}
