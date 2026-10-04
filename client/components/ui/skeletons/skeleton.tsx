"use client";

import React from "react";

export function Skeleton({
  className = "",
  rounded = "md",
  style,
}: {
  className?: string;
  rounded?: "md" | "lg" | "xl" | "2xl" | "full";
  style?: React.CSSProperties;
}) {
  const r =
    rounded === "full"
      ? "rounded-full"
      : rounded === "2xl"
      ? "rounded-2xl"
      : rounded === "xl"
      ? "rounded-xl"
      : rounded === "lg"
      ? "rounded-lg"
      : "rounded-md";
  return (
    <div
      className={`bg-[#E4DCCB]/65 animate-pulse ${r} ${className}`}
      style={style}
    />
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="hidden lg:flex flex-col gap-3 p-4 border-r border-[#E4DCCB] bg-[#FAF7F0] w-[250px] shrink-0">
      <div className="flex items-center gap-3 mb-4 p-2">
        <Skeleton className="h-9 w-9" rounded="full" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-10 w-full mb-2" rounded="xl" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" rounded="xl" />
      ))}
    </aside>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E4DCCB] bg-white p-6 flex flex-col gap-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" rounded="full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4 mt-1" />
      <Skeleton className="h-3.5 w-full mt-1" />
      <Skeleton className="h-3.5 w-5/6" />
      <div className="flex items-center justify-between pt-4 mt-auto border-t border-[#E4DCCB]/60">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-20" rounded="full" />
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <main className="flex flex-col gap-5 p-6 overflow-hidden flex-1 max-w-[960px] shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <Skeleton className="h-9 w-28" rounded="full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </main>
  );
}

export function RightPanelSkeleton() {
  return (
    <aside className="hidden xl:flex flex-col gap-4 p-5 border-l border-[#E4DCCB] bg-[#FAF7F0] w-[320px] shrink-0">
      <Skeleton className="w-full h-[220px]" rounded="2xl" />
      <Skeleton className="w-full h-[260px]" rounded="2xl" />
    </aside>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0]">
      {/* Top bar skeleton */}
      <header className="flex items-center justify-between px-6 border-b border-[#E4DCCB] bg-white/80 h-14 shrink-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-2.5 w-2.5" rounded="full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" rounded="full" />
          <Skeleton className="h-8 w-24" rounded="full" />
        </div>
      </header>

      {/* Main container */}
      <div className="flex flex-1 overflow-hidden min-h-0 mx-auto w-full max-w-[1400px]">
        <SidebarSkeleton />
        <FeedSkeleton />
        <RightPanelSkeleton />
      </div>
    </div>
  );
}

export function DiscoverSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-32" rounded="full" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-12 w-full" rounded="xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <header className="h-14 border-b border-[#E4DCCB] bg-white/80 px-6 flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" rounded="full" />
          <Skeleton className="h-8 w-8" rounded="full" />
        </div>
      </header>
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
