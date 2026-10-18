import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "parchment" | "sand" | "sage" | "card";
}

/**
 * Base Enterprise Human-Crafted Skeleton Primitive.
 * Features organic Living Materials tones with staggered optical pulses.
 */
export function Skeleton({
  className = "",
  variant = "sand",
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    parchment: "bg-[#FAF7F0] border border-[#E4DCCB]/60",
    sand: "bg-[#E4DCCB]/65",
    sage: "bg-[#DCE6D7]/60",
    card: "bg-white border border-[#E4DCCB]",
  };

  return (
    <div
      className={`rounded-lg animate-pulse ${variantStyles[variant]} ${className}`}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Academic Paper / Preprint Card Skeleton.
 */
export function PaperCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" variant="sage" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-5/6 rounded-lg" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-4/5 rounded" />
      </div>
      <div className="pt-3 border-t border-[#E4DCCB]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <Skeleton className="h-8 w-24 rounded-xl" variant="sage" />
      </div>
    </div>
  );
}

/**
 * Enterprise Data & Audit Table Skeleton.
 */
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl bg-white border border-[#E4DCCB] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[#FAF7F0] border-b border-[#E4DCCB] grid grid-cols-5 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24 rounded" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-[#E4DCCB]/60">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4.5 grid grid-cols-5 gap-4 items-center">
            <div className="space-y-1">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
            <Skeleton className="h-6 w-28 rounded-lg" variant="parchment" />
            <Skeleton className="h-4 w-32 rounded" />
            <div className="flex justify-end">
              <Skeleton className="h-5 w-20 rounded-full" variant="sage" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * KPI & Telemetry Metrics Grid Skeleton.
 */
export function MetricsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border border-[#E4DCCB] space-y-2">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-3 w-28 rounded" variant="sage" />
        </div>
      ))}
    </div>
  );
}

/**
 * 2D Constellation Graph Skeleton.
 */
export function GraphConstellationSkeleton() {
  return (
    <div className="flex-1 flex flex-col bg-[#FAF7F0] overflow-hidden relative">
      <div className="p-4 border-b border-[#E4DCCB] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" variant="sage" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-3 w-64 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-44 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" variant="sage" />
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="relative w-[500px] h-[400px] flex items-center justify-center">
          {/* Orbiting nodes */}
          <Skeleton className="absolute w-16 h-16 rounded-full" variant="sage" />
          <Skeleton className="absolute -top-4 left-10 w-12 h-12 rounded-full" />
          <Skeleton className="absolute -bottom-6 right-16 w-14 h-14 rounded-full" variant="sage" />
          <Skeleton className="absolute top-14 -right-8 w-11 h-11 rounded-full" />
          <Skeleton className="absolute -bottom-4 -left-6 w-13 h-13 rounded-full" />
        </div>
      </div>

      <div className="p-4 border-t border-[#E4DCCB] bg-white flex items-center justify-between">
        <Skeleton className="h-4 w-80 rounded" />
        <Skeleton className="h-4 w-48 rounded" />
      </div>
    </div>
  );
}

/**
 * Split-Screen Academic Manuscript + RAG Studio Skeleton.
 */
export function ManuscriptReaderSkeleton() {
  return (
    <div className="flex-1 flex divide-x divide-[#E4DCCB] bg-[#FAF7F0] overflow-hidden">
      {/* Left Manuscript Pane */}
      <div className="flex-1 flex flex-col p-8 space-y-6 overflow-hidden">
        <div className="max-w-2xl mx-auto w-full bg-white p-10 rounded-2xl border border-[#E4DCCB] space-y-6">
          <div className="space-y-2 border-b border-[#E4DCCB] pb-4">
            <Skeleton className="h-3 w-40 rounded" />
            <Skeleton className="h-7 w-5/6 rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded" variant="sage" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-20 w-full rounded-xl" variant="parchment" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
        </div>
      </div>

      {/* Right AI Reasoning Studio Pane */}
      <div className="w-[480px] bg-white flex flex-col p-6 space-y-6 shrink-0">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-5 w-24 rounded-full" variant="sage" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-9 rounded-lg" />
          <Skeleton className="h-9 rounded-lg" />
          <Skeleton className="h-9 rounded-lg" />
        </div>
        <div className="space-y-4 flex-1">
          <Skeleton className="h-24 rounded-xl" variant="parchment" />
          <Skeleton className="h-16 rounded-xl ml-12" variant="sage" />
          <Skeleton className="h-32 rounded-xl" variant="parchment" />
        </div>
        <Skeleton className="h-14 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Universal Page Skeleton Wrapper for Protected Modules.
 */
export function PageHeaderSkeleton({
  badgeWidth = "w-36",
  titleWidth = "w-72",
  hasActions = true,
}: {
  badgeWidth?: string;
  titleWidth?: string;
  hasActions?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4DCCB] pb-6">
      <div>
        <Skeleton className={`h-6 ${badgeWidth} rounded-full mb-3`} variant="sage" />
        <Skeleton className={`h-10 ${titleWidth} rounded-xl`} />
        <Skeleton className="h-4 w-96 max-w-full rounded mt-2.5" />
      </div>
      {hasActions && (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" variant="sage" />
        </div>
      )}
    </div>
  );
}
