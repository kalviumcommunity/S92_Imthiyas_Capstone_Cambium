"use client";

import React from "react";
import { useOfflineSync } from "@/lib/offline/useOfflineSync";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { WifiOff, RefreshCw, CheckCircle2, Database } from "lucide-react";

export default function OfflineBanner() {
  const { isOnline, outboxCount, cachedCount, isSyncing, syncOutbox } = useOfflineSync();
  const { t } = useLanguage();

  if (isOnline && outboxCount === 0) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full py-2 px-4 border-b text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
        !isOnline
          ? "bg-[#A36A4F]/15 border-[#A36A4F]/30 text-[#A36A4F] dark:bg-[#A36A4F]/20 dark:text-[#E8A588]"
          : "bg-[#DCE6D7] border-[#66866A]/40 text-[#173F35] dark:bg-[#1f2e21] dark:text-[#4ADE80]"
      }`}
    >
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <WifiOff size={14} className="shrink-0 animate-pulse text-[#A36A4F] dark:text-[#E8A588]" />
        ) : (
          <Database size={14} className="shrink-0 text-[#3E6248] dark:text-[#4ADE80]" />
        )}
        <span className="font-semibold">
          {!isOnline
            ? t("common.offline", "Offline Mode Active (Field Research)")
            : `${outboxCount} changes stored locally`}
        </span>
        <span className="hidden sm:inline text-xs opacity-85">
          {!isOnline
            ? t("common.offline_desc", "Local IndexedDB active. Changes will auto-sync when online.")
            : "Ready to push to Cambium Cloud"}
        </span>
        {cachedCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-mono text-[10px]">
            {cachedCount} cached grants
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {outboxCount > 0 && (
          <button
            type="button"
            onClick={syncOutbox}
            disabled={!isOnline || isSyncing}
            className="px-2.5 py-1 rounded bg-[#3E6248] text-[#FAF7F0] hover:bg-[#2e4a36] disabled:opacity-50 font-mono text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw size={11} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing..." : t("common.sync_now", "Sync Pending Outbox")}
          </button>
        )}
      </div>
    </div>
  );
}
