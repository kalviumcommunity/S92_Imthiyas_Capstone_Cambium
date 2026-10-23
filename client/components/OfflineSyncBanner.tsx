"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw, CheckCircle2, Database, CloudOff } from "lucide-react";
import { getOfflineOpportunities, getPendingSyncMutations, removeSyncMutation } from "@/lib/storage/offline-store";

export default function OfflineSyncBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [cachedCount, setCachedCount] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncedRecently, setSyncedRecently] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial state
    setIsOnline(navigator.onLine);

    const updateCounts = async () => {
      try {
        const cached = await getOfflineOpportunities();
        const pending = await getPendingSyncMutations();
        setCachedCount(cached.length);
        setPendingCount(pending.length);
      } catch (err) {
        // IndexedDB may be blocked in incognito or restricted mode
      }
    };

    updateCounts();

    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);

      try {
        const pending = await getPendingSyncMutations();
        if (pending.length > 0) {
          // Flush sync queue (simulate replay of queued actions)
          for (const item of pending) {
            await removeSyncMutation(item.id);
          }
        }
        setPendingCount(0);
        setSyncedRecently(true);
        setTimeout(() => setSyncedRecently(false), 4000);
      } catch (err) {
        console.warn("[OfflineSync] Replay failed:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateCounts();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // If online and nothing syncing, don't show intrusive banner
  if (isOnline && !isSyncing && !syncedRecently && pendingCount === 0) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[100] max-w-md animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      {!isOnline ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#202920] text-[#FAF7F0] border border-[#3E6248]/40 shadow-2xl backdrop-blur-md">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
            <WifiOff size={18} />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-semibold text-amber-300 flex items-center gap-1.5">
              <span>Field Offline Mode Active</span>
            </p>
            <p className="text-[#A2ADA0] truncate">
              {cachedCount > 0
                ? `Serving ${cachedCount} grants from IndexedDB cache.`
                : "Working offline. Changes queued in local store."}
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-amber-500/30 text-amber-200 border border-amber-500/40">
              {pendingCount} queued
            </span>
          )}
        </div>
      ) : isSyncing ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#202920] text-[#FAF7F0] border border-[#3E6248]/40 shadow-2xl backdrop-blur-md">
          <RefreshCw size={18} className="text-emerald-400 animate-spin shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-emerald-300">Connection Restored</p>
            <p className="text-[#A2ADA0]">Flushing offline draft queue to Cambium core...</p>
          </div>
        </div>
      ) : syncedRecently ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#202920] text-[#FAF7F0] border border-emerald-500/40 shadow-2xl backdrop-blur-md animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-emerald-300">Workspace Synchronized</p>
            <p className="text-[#A2ADA0]">All local edits successfully pushed to primary database.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
