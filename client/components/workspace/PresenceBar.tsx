"use client";

import React from 'react';
import { usePresenceStore } from '@/lib/store/usePresenceStore';

interface PresenceBarProps {
  roomId: string;
  maxVisible?: number;
  className?: string;
}

export function PresenceBar({ roomId, maxVisible = 5, className = '' }: PresenceBarProps) {
  const getUsersInRoom = usePresenceStore((s) => s.getUsersInRoom);
  const users = getUsersInRoom(roomId);

  if (users.length === 0) return null;

  const visible = users.slice(0, maxVisible);
  const overflow = users.length - maxVisible;

  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="group" aria-label={`${users.length} collaborator${users.length !== 1 ? 's' : ''} online`}>
      <div className="flex -space-x-2">
        {visible.map((user) => (
          <div
            key={user.id}
            className="relative w-7 h-7 rounded-full border-2 border-white dark:border-[#131C15] bg-[#3E6248] text-white text-xs font-semibold flex items-center justify-center uppercase ring-2 ring-[#4ADE80]/30"
            title={user.name}
            aria-label={user.name}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
            {/* Green presence dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#4ADE80] border border-white dark:border-[#131C15]" aria-hidden="true" />
          </div>
        ))}
        {overflow > 0 && (
          <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#131C15] bg-[#DCE6D7] dark:bg-[#1A281E] text-[#3E6248] dark:text-[#4ADE80] text-[10px] font-bold flex items-center justify-center">
            +{overflow}
          </div>
        )}
      </div>
      <span className="text-[11px] text-[#62685E] dark:text-[#A3B899] font-mono">
        {users.length} online
      </span>
    </div>
  );
}
