"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/api";

export interface RealtimeAlert {
  id: string;
  type: "deadline" | "ingestion" | "mention" | "system" | "collaboration";
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
  refreshAlerts: () => Promise<void>;
}

function resolveRealtimeUrls() {
  const isBrowser = typeof window !== "undefined";
  const isLocal =
    isBrowser &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const defaultApi = isLocal
    ? "http://localhost:5000/api"
    : "https://cambium-api-ufj3.onrender.com/api";
  const defaultSocket = isLocal
    ? "http://localhost:5000"
    : "https://cambium-api-ufj3.onrender.com";
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || defaultApi).replace(/\/$/, "");
  const socketUrl = (
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_WS_URL ||
    defaultSocket
  ).replace(/\/api(?:\/v1)?\/?$/, "");
  return { apiBase, socketUrl };
}

const { apiBase: API_BASE, socketUrl: SOCKET_URL } = resolveRealtimeUrls();

export function useRealtimeEvents(initialRoom: string = "general"): RealtimeState {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isSseConnected, setIsSseConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeRoom, setActiveRoom] = useState<string | null>(initialRoom);
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const refreshAlerts = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token =
      localStorage.getItem("cambium_token") || localStorage.getItem("cambium_access_token");
    if (!token) return;

    try {
      const res = await getMyNotifications({ limit: 30, offset: 0 });
      const mapped: RealtimeAlert[] = (res.data || []).map((n) => ({
        id: n.id,
        type:
          n.type === "WORKSPACE_INVITE" || n.type === "COMMENT" || n.type === "MENTION"
            ? "collaboration"
            : n.type === "OPPORTUNITY_MATCH"
            ? "deadline"
            : "system",
        title: n.title || "Cambium Notification",
        message: n.message,
        timestamp: n.createdAt,
        read: Boolean(n.isRead),
        link: n.link || "/notifications",
      }));
      setAlerts(mapped);
      setUnreadCount(res.unreadCount);
    } catch {
      // Backend unreachable; keep current state cleanly without synthetic errors
    }
  }, []);

  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  // 1. Authenticated Server-Sent Events (SSE) Listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token =
      localStorage.getItem("cambium_token") || localStorage.getItem("cambium_access_token");
    if (!token) return;

    try {
      const v1Base = API_BASE.endsWith("/v1")
        ? API_BASE
        : `${API_BASE.replace(/\/api$/, "")}/api/v1`;
      const sseUrl = `${v1Base}/events/stream`;
      const eventSource = new EventSource(sseUrl, { withCredentials: true });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsSseConnected(true);
      };

      const handleNotificationEvent = (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          const item: RealtimeAlert = {
            id: payload.id || `sse-${Date.now()}`,
            type: "collaboration",
            title: payload.title || "Live Dispatch",
            message: payload.message || "",
            timestamp: payload.createdAt || new Date().toISOString(),
            read: false,
            link: payload.link || "/notifications",
          };
          setAlerts((prev) => (prev.some((a) => a.id === item.id) ? prev : [item, ...prev]));
          setUnreadCount((c) => c + 1);
        } catch {
          // ignore non-json pings
        }
      };

      eventSource.addEventListener("notification", handleNotificationEvent);
      eventSource.addEventListener("grant_alert", handleNotificationEvent);
      eventSource.addEventListener("badge_count", (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          if (typeof payload.unreadCount === "number") {
            setUnreadCount(payload.unreadCount);
          }
        } catch {
          // ignore
        }
      });

      eventSource.onerror = () => {
        setIsSseConnected(false);
      };

      return () => {
        eventSource.close();
      };
    } catch {
      setIsSseConnected(false);
    }
  }, []);

  // 2. Authenticated Socket.io Client for Collaboration & Live Notification Push
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token =
      localStorage.getItem("cambium_token") || localStorage.getItem("cambium_access_token");
    if (!token) return;

    try {
      const socket = io(`${SOCKET_URL}/chat`, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnectionAttempts: 8,
        reconnectionDelay: 1000,
        autoConnect: true,
        withCredentials: true,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        setIsSocketConnected(true);
        if (activeRoom) {
          socket.emit("join_room", { room: activeRoom });
        }
        refreshAlerts();
      });

      socket.on("disconnect", () => {
        setIsSocketConnected(false);
      });

      socket.on("connect_error", () => {
        setIsSocketConnected(false);
      });

      socket.on("notification_created", (data: any) => {
        const mapped: RealtimeAlert = {
          id: data?.id || data?.eventId || `ws-${Date.now()}`,
          type:
            data?.type === "WORKSPACE_INVITE" || data?.type === "COMMENT"
              ? "collaboration"
              : "system",
          title: data?.title || data?.payload?.title || "Workspace Update",
          message: data?.message || data?.payload?.message || "New research activity recorded.",
          timestamp: data?.createdAt || new Date().toISOString(),
          read: false,
          link: data?.link || "/notifications",
        };
        setAlerts((prev) => (prev.some((a) => a.id === mapped.id) ? prev : [mapped, ...prev]));
        setUnreadCount((c) => c + 1);
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
          if (prev.some((m) => m.id === mapped.id)) return prev;
          return [...prev, mapped];
        });
      });

      return () => {
        socket.disconnect();
      };
    } catch {
      setIsSocketConnected(false);
    }
  }, [activeRoom, refreshAlerts]);

  const joinRoom = useCallback((room: string) => {
    setActiveRoom(room);
    if (socketRef.current?.connected) {
      socketRef.current.emit("join_room", { room });
    }
  }, []);

  const sendMessage = useCallback(
    (content: string, room?: string) => {
      const targetRoom = room || activeRoom || "general";
      if (socketRef.current?.connected) {
        socketRef.current.emit("send_message", {
          room: targetRoom,
          message: content,
        });
      }
    },
    [activeRoom],
  );

  const markAlertRead = useCallback(async (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationRead(id);
    } catch {
      // Handled gracefully
    }
  }, []);

  const clearAlerts = useCallback(async () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      // Handled gracefully
    }
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
    refreshAlerts,
  };
}
