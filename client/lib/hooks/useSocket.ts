"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePresenceStore } from '@/lib/store/usePresenceStore';

export type SocketConnectionState = 'CONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'OFFLINE';

interface UseSocketOptions {
  namespace?: string;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connectionState: SocketConnectionState;
  reconnectCount: number;
  latencyMs: number | null;
  pingGateway: () => Promise<number | null>;
  joinRoom: (room: string, user: { id: string; name: string; avatar?: string }) => void;
  leaveRoom: (room: string, userId?: string) => void;
  sendMessage: (room: string, message: string, sender: { id: string; name: string; avatar?: string }) => void;
  sendTyping: (room: string, userId: string, userName: string, isTyping: boolean) => void;
  lockSection: (room: string, sectionId: string) => void;
  unlockSection: (room: string, sectionId: string) => void;
  emitEvent: (event: string, data: any) => void;
  onEvent: (event: string, handler: (...args: any[]) => void) => () => void;
}

let globalSocket: Socket | null = null;
const joinedRoomsRegistry = new Map<string, { id: string; name: string; avatar?: string }>();
const seenEventIds = new Set<string>();

function trackSeenEvent(eventId?: string): boolean {
  if (!eventId) return false;
  if (seenEventIds.has(eventId)) return true;
  seenEventIds.add(eventId);
  if (seenEventIds.size > 500) {
    const first = seenEventIds.values().next().value;
    if (first) seenEventIds.delete(first);
  }
  return false;
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { namespace = '/chat', autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<SocketConnectionState>('CONNECTING');
  const [reconnectCount, setReconnectCount] = useState(0);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const hasConnectedOnceRef = useRef(false);

  useEffect(() => {
    if (!autoConnect) return;

    const isBrowser = typeof window !== 'undefined';
    const isLocal =
      isBrowser &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const defaultHost = isLocal ? 'http://localhost:5000' : 'https://cambium-api-ufj3.onrender.com';
    const rawUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL || defaultHost;
    const wsUrl = rawUrl.replace(/\/api(?:\/v1)?\/?$/, '');
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('cambium_token') || localStorage.getItem('cambium_access_token')
        : null;

    if (!token) {
      setConnectionState('OFFLINE');
      setIsConnected(false);
      return;
    }

    if (!globalSocket || (!globalSocket.connected && !globalSocket.active)) {
      globalSocket = io(`${wsUrl}${namespace}`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        randomizationFactor: 0.5,
        reconnectionAttempts: 12,
        timeout: 10000,
        withCredentials: true,
      });
    }

    socketRef.current = globalSocket;

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionState('CONNECTED');

      // Rejoin any active workspace rooms after connection recovery
      for (const [room, user] of joinedRoomsRegistry.entries()) {
        globalSocket?.emit('join_room', { room, user });
      }

      if (hasConnectedOnceRef.current) {
        setReconnectCount((c) => c + 1);
      }
      hasConnectedOnceRef.current = true;
    };

    const handleDisconnect = (reason: string) => {
      setIsConnected(false);
      setConnectionState(reason === 'io server disconnect' ? 'OFFLINE' : 'RECONNECTING');
    };

    const handleReconnectAttempt = () => {
      setConnectionState('RECONNECTING');
    };

    const handleReconnectFailed = () => {
      setConnectionState('OFFLINE');
    };

    const handleAuthError = () => {
      setIsConnected(false);
      setConnectionState('OFFLINE');
    };

    const handleOnline = () => {
      if (!globalSocket?.connected) {
        setConnectionState('CONNECTING');
        globalSocket?.connect();
      }
    };

    const handleOffline = () => {
      setConnectionState('OFFLINE');
      setIsConnected(false);
    };

    const handlePresenceUpdate = (data: { room: string; members: any[] }) => {
      if (data?.room && Array.isArray(data.members)) {
        usePresenceStore.getState().clearRoom(data.room);
        data.members.forEach((m) => {
          usePresenceStore.getState().addUserToRoom(data.room, {
            id: m.id || m.userId,
            name: m.name || m.fullName || 'Scholar',
            avatar: m.avatar,
            joinedAt: m.joinedAt || new Date().toISOString(),
            roomId: data.room,
          });
        });
      }
    };

    globalSocket.on('connect', handleConnect);
    globalSocket.on('disconnect', handleDisconnect);
    globalSocket.on('reconnect_attempt', handleReconnectAttempt);
    globalSocket.on('reconnect_failed', handleReconnectFailed);
    globalSocket.on('auth_error', handleAuthError);
    globalSocket.on('presence_update', handlePresenceUpdate);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    if (globalSocket.connected) {
      hasConnectedOnceRef.current = true;
      setIsConnected(true);
      setConnectionState('CONNECTED');
    }

    return () => {
      globalSocket?.off('connect', handleConnect);
      globalSocket?.off('disconnect', handleDisconnect);
      globalSocket?.off('reconnect_attempt', handleReconnectAttempt);
      globalSocket?.off('reconnect_failed', handleReconnectFailed);
      globalSocket?.off('auth_error', handleAuthError);
      globalSocket?.off('presence_update', handlePresenceUpdate);

      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [namespace, autoConnect]);

  const pingGateway = useCallback(async (): Promise<number | null> => {
    const start = Date.now();
    try {
      const isBrowser = typeof window !== 'undefined';
      const isLocal =
        isBrowser &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const fallbackBase = isLocal
        ? 'http://localhost:5000/api/v1'
        : 'https://cambium-api-ufj3.onrender.com/api/v1';
      const rawApi = (process.env.NEXT_PUBLIC_API_URL || fallbackBase).replace(/\/$/, '');
      const base = rawApi.endsWith('/v1') ? rawApi : `${rawApi.replace(/\/api$/, '')}/api/v1`;
      const res = await fetch(`${base}/network/ping`, { cache: 'no-store' });
      if (res.ok) {
        const roundtrip = Date.now() - start;
        setLatencyMs(roundtrip);
        return roundtrip;
      }
    } catch {
      // Non-blocking ping failure
    }
    return null;
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    pingGateway();
    const intervalId = setInterval(pingGateway, 45000);
    return () => clearInterval(intervalId);
  }, [isConnected, pingGateway]);

  const joinRoom = useCallback((room: string, user: { id: string; name: string; avatar?: string }) => {
    joinedRoomsRegistry.set(room, user);
    socketRef.current?.emit('join_room', { room, user });
  }, []);

  const leaveRoom = useCallback((room: string) => {
    joinedRoomsRegistry.delete(room);
    socketRef.current?.emit('leave_room', { room });
  }, []);

  const sendMessage = useCallback(
    (room: string, message: string, _sender: { id: string; name: string; avatar?: string }) => {
      socketRef.current?.emit('send_message', { room, message });
    },
    [],
  );

  const sendTyping = useCallback(
    (room: string, _userId: string, _userName: string, isTyping: boolean) => {
      socketRef.current?.emit('typing', { room, isTyping });
    },
    [],
  );

  const lockSection = useCallback((room: string, sectionId: string) => {
    socketRef.current?.emit('lock_section', { room, sectionId });
  }, []);

  const unlockSection = useCallback((room: string, sectionId: string) => {
    socketRef.current?.emit('unlock_section', { room, sectionId });
  }, []);

  const emitEvent = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const onEvent = useCallback((event: string, handler: (...args: any[]) => void) => {
    const wrapped = (data: any, ...rest: any[]) => {
      if (data && typeof data === 'object' && data.eventId && trackSeenEvent(data.eventId)) {
        return;
      }
      handler(data, ...rest);
    };
    socketRef.current?.on(event, wrapped);
    return () => {
      socketRef.current?.off(event, wrapped);
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connectionState,
    reconnectCount,
    latencyMs,
    pingGateway,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    lockSection,
    unlockSection,
    emitEvent,
    onEvent,
  };
}
