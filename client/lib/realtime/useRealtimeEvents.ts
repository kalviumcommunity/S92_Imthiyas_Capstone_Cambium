"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

export interface RealtimeAlert {
  id: string;
  type: "deadline" | "ingestion" | "mention" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ChatMessage {
  id: string;
  room: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  content: string;
  timestamp: string;
}

export interface RealtimeState {
  isSocketConnected: boolean;
  isSseConnected: boolean;
  unreadCount: number;
  alerts: RealtimeAlert[];
  messages: ChatMessage[];
  activeRoom: string | null;
  sendMessage: (content: string, room?: string) => void;
  joinRoom: (room: string) => void;
  markAlertRead: (id: string) => void;
  clearAlerts: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export function useRealtimeEvents(initialRoom: string = "general"): RealtimeState {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isSseConnected, setIsSseConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [activeRoom, setActiveRoom] = useState<string | null>(initialRoom);
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([
    {
      id: "alert-1",
      type: "deadline",
      title: "NSF Quantum Information Science RFP",
      message: "Submission deadline closes in 14 days (Nov 15, 2026).",
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      read: false,
      link: "/opportunities",
    },
    {
      id: "alert-2",
      type: "ingestion",
      title: "arXiv Ingestion Complete",
      message: "42 new preprints indexed under cs.AI and quant-ph.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: false,
      link: "/discover",
    },
    {
      id: "alert-3",
      type: "system",
      title: "Living Materials Engine v2.0 Active",
      message: "Dendrochronology cellular growth rings synced.",
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      read: true,
      link: "/changelog",
    },
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      room: "general",
      sender: {
        id: "dr-elena",
        name: "Dr. Elena Rostova",
        role: "Principal Investigator",
      },
      content: "Have you reviewed the quantum error correction deliverables for the Q3 NSF grant proposal?",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "msg-2",
      room: "general",
      sender: {
        id: "current-user",
        name: "Shaik Mohamed Imthiyas T",
        role: "Lead Architect",
      },
      content: "Yes, currently indexing the citations in the Agentic Reader with line-level proof anchors.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ]);

  const socketRef = useRef<Socket | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // 1. Server-Sent Events (SSE) Listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const sseUrl = `${API_BASE}/events/stream`;
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsSseConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "alert") {
            setAlerts((prev) => [data.payload, ...prev]);
            setUnreadCount((c) => c + 1);
          } else if (data.type === "unread_count") {
            setUnreadCount(data.count);
          }
        } catch {
          // ignore non-json pings
        }
      };

      eventSource.onerror = () => {
        setIsSseConnected(false);
        // EventSource will automatically retry in the background
      };

      return () => {
        eventSource.close();
      };
    } catch {
      // Offline fallback
      setIsSseConnected(false);
    }
  }, []);

  // 2. Socket.io Client for Bi-directional Chat & Collaboration
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const socket = io(`${SOCKET_URL}/chat`, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        setIsSocketConnected(true);
        if (activeRoom) {
          socket.emit("join_room", {
            room: activeRoom,
            user: { id: "current-user", name: "Imthiyas" },
          });
        }
      });

      socket.on("disconnect", () => {
        setIsSocketConnected(false);
      });

      socket.on("connect_error", () => {
        setIsSocketConnected(false);
      });

      socket.on("new_message", (data: any) => {
        const mapped: ChatMessage = {
          id: data.id || `msg-${Date.now()}`,
          room: data.room || "general",
          sender: data.sender || { id: "colleague", name: "Scholar", role: "Researcher" },
          content: data.message || data.content || "",
          timestamp: data.createdAt || data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => {
          if (prev.some((m) => m.id === mapped.id || (m.content === mapped.content && m.sender.id === mapped.sender.id))) {
            return prev;
          }
          return [...prev, mapped];
        });
      });

      return () => {
        socket.disconnect();
      };
    } catch {
      setIsSocketConnected(false);
    }
  }, [activeRoom]);

  const joinRoom = useCallback((room: string) => {
    setActiveRoom(room);
    if (socketRef.current?.connected) {
      socketRef.current.emit("join_room", { room });
    }
  }, []);

  const sendMessage = useCallback(
    (content: string, room?: string) => {
      const targetRoom = room || activeRoom || "general";
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        room: targetRoom,
        sender: {
          id: "current-user",
          name: "Shaik Mohamed Imthiyas T",
          role: "Lead Architect",
        },
        content,
        timestamp: new Date().toISOString(),
      };

      // Optimistic local update
      setMessages((prev) => [...prev, newMsg]);

      if (socketRef.current?.connected) {
        socketRef.current.emit("send_message", {
          room: targetRoom,
          message: content,
          sender: newMsg.sender,
        });
      }
    },
    [activeRoom]
  );

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  return {
    isSocketConnected,
    isSseConnected,
    unreadCount,
    alerts,
    messages,
    activeRoom,
    sendMessage,
    joinRoom,
    markAlertRead,
    clearAlerts,
  };
}
