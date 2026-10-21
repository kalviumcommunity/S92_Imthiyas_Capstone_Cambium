"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getOutboxQueue,
  removeOutboxAction,
  OutboxAction,
  getCachedOpportunities,
} from "./offlineStorage";
import { toggleBookmark } from "@/lib/api";

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [outboxCount, setOutboxCount] = useState<number>(0);
  const [cachedCount, setCachedCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Refresh counts
  const refreshCounts = useCallback(async () => {
    try {
      const outbox = await getOutboxQueue();
      setOutboxCount(outbox.length);

      const cached = await getCachedOpportunities();
      setCachedCount(cached.length);
    } catch {
      // IndexedDB might not be available during SSR
    }
  }, []);

  // Process pending outbox actions
  const syncOutbox = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;

    try {
      setIsSyncing(true);
      const queue = await getOutboxQueue();
      if (queue.length === 0) {
        setIsSyncing(false);
        return;
      }

      console.log(`[OfflineSync] Processing ${queue.length} pending actions...`);

      for (const item of queue) {
        try {
          if (item.action === "TOGGLE_BOOKMARK" && item.payload?.opportunityId) {
            await toggleBookmark(item.payload.opportunityId);
          }
          // Remove processed action
          await removeOutboxAction(item.id);
        } catch (itemErr) {
          console.error(`[OfflineSync] Action failed for ${item.id}:`, itemErr);
          // If network error, stop processing rest
          if (!navigator.onLine) break;
        }
      }

      setLastSyncTime(new Date());
      await refreshCounts();
    } catch (err) {
      console.error("[OfflineSync] Error during outbox sync:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshCounts]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);
    refreshCounts();

    // Register Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV !== "test") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[ServiceWorker] Registered with scope:", registration.scope);
        })
        .catch((err) => {
          console.warn("[ServiceWorker] Registration failed:", err);
        });

      // Listen to messages from SW
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "SYNC_OUTBOX_TRIGGERED") {
          syncOutbox();
        }
      });
    }

    const handleOnline = () => {
      setIsOnline(true);
      syncOutbox();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [refreshCounts, syncOutbox]);

  return {
    isOnline,
    outboxCount,
    cachedCount,
    isSyncing,
    lastSyncTime,
    syncOutbox,
    refreshCounts,
  };
}
