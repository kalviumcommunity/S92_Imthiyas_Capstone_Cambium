import React from "react";
import { PageHeaderSkeleton, TableSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function AuditLoading() {
  return (
    <div className="flex-1 min-w-0 h-screen overflow-y-auto bg-[#FAF7F0] p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeaderSkeleton badgeWidth="w-72" titleWidth="w-96" />

        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Skeleton className="h-6 w-36 rounded-md" variant="sage" />
            <Skeleton className="h-6 w-44 rounded-md" />
          </div>
          <Skeleton className="h-9 w-64 rounded-xl" />
        </div>

        <TableSkeleton rows={6} cols={6} />
      </div>
    </div>
  );
}
