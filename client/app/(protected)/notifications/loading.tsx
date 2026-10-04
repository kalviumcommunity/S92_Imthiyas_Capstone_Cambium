"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function NotificationsLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex justify-center bg-surface-base">
      <div className="w-full max-w-3xl bg-surface-raised min-h-screen border-x border-edge-default">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between px-6 pt-8 pb-0">
          <div className="h-7 w-20 bg-edge-default rounded animate-pulse" />
          <div className="h-5 w-24 bg-edge-default rounded animate-pulse" />
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="flex gap-4 px-6 mt-7 mb-4">
          <div className="h-5 w-12 bg-edge-default rounded animate-pulse" />
          <div className="h-5 w-16 bg-edge-default rounded animate-pulse" />
          <div className="h-5 w-20 bg-edge-default rounded animate-pulse" />
        </div>
        <div className="h-px w-full bg-edge-default mb-0" />

        {/* Notification List Skeleton */}
        <div className="flex flex-col">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-5 py-4 border-b border-edge-default"
            >
              {/* Unread dot */}
              <div className="flex items-center self-stretch w-3 shrink-0 pt-0.5" />
              
              {/* Avatar Skeleton */}
              <div className="w-9 h-9 rounded-full bg-edge-default shrink-0 animate-pulse" />
              
              {/* Text content Skeleton */}
              <div className="flex-1 min-w-0 pt-0.5 space-y-2">
                <div className="h-4 w-3/4 bg-edge-default rounded animate-pulse" />
                <div className="h-3 w-16 bg-edge-default rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
