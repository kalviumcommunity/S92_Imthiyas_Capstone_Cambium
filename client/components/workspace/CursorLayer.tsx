"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "@/lib/hooks/useSocket";

export interface RemoteCursor {
  userId: string;
  userName: string;
  x: number;
  y: number;
  color?: string;
}

interface CursorLayerProps {
  roomId: string;
  containerRef: React.RefObject<HTMLElement | null>;
}

export function CursorLayer({ roomId, containerRef }: CursorLayerProps) {
  const [cursors, setCursors] = useState<Record<string, RemoteCursor>>({});
  const { onEvent, socket } = useSocket({ namespace: "/chat" });

  useEffect(() => {
    const unsub = onEvent("cursor_moved", (data: RemoteCursor & { room: string }) => {
      if (data.room !== roomId) return;
      setCursors((prev) => ({
        ...prev,
        [data.userId]: data,
      }));
    });

    return () => {
      unsub();
    };
  }, [roomId, onEvent]);

  // Clean stale cursors
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors((prev) => {
        const next = { ...prev };
        return next;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
      {Object.values(cursors).map((c) => (
        <div
          key={c.userId}
          className="absolute flex items-center gap-1 transition-all duration-75"
          style={{
            transform: `translate(${c.x}px, ${c.y}px)`,
          }}
        >
          <svg
            className="h-4 w-4 drop-shadow"
            viewBox="0 0 24 24"
            fill={c.color || "#3E6248"}
            stroke="white"
            strokeWidth="1.5"
          >
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L5.5 3.21z" />
          </svg>
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold text-white shadow"
            style={{ backgroundColor: c.color || "#3E6248" }}
          >
            {c.userName}
          </span>
        </div>
      ))}
    </div>
  );
}
