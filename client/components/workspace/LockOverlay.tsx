"use client";

import React, { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useSocket } from "@/lib/hooks/useSocket";

interface LockOverlayProps {
  roomId: string;
  sectionId: string;
  children: React.ReactNode;
  currentUserId?: string;
}

export function LockOverlay({
  roomId,
  sectionId,
  children,
  currentUserId,
}: LockOverlayProps) {
  const [lockedBy, setLockedBy] = useState<{ userId: string; userName: string } | null>(null);
  const { onEvent } = useSocket({ namespace: "/chat" });

  useEffect(() => {
    const unsubLock = onEvent("section_locked", (data: any) => {
      if (data.room === roomId && data.sectionId === sectionId) {
        setLockedBy({ userId: data.userId, userName: data.userName });
      }
    });

    const unsubUnlock = onEvent("section_unlocked", (data: any) => {
      if (data.sectionId === sectionId) {
        setLockedBy(null);
      }
    });

    return () => {
      unsubLock();
      unsubUnlock();
    };
  }, [roomId, sectionId, onEvent]);

  const isLockedByOther = lockedBy && lockedBy.userId !== currentUserId;

  return (
    <div className="relative">
      {children}
      {isLockedByOther && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-[2px] transition-all">
          <div className="flex items-center gap-2 rounded-lg border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#131C15] px-3.5 py-1.5 shadow-lg">
            <Lock size={14} className="text-[#8A5A12] dark:text-[#FBBF24]" />
            <span className="text-xs font-mono text-[#202920] dark:text-[#EDEAE2]">
              Locked by <strong>{lockedBy.userName}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
