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
  latencyMs: number | null;
  pingGateway: () => Promise<number | null>;
  joinRoom: (room: string, user: { id: string; name: string; avatar?: string }) => void;
  leaveRoom: (room: string, userId?: string) => void;
  sendMessage: (room: string, message: string, sender: { id: string; name: string; avatar?: string }) => void;
  sendTyping: (room: string, userId: string, userName: string, isTyping: boolean) => void;
  emitEvent: (event: string, data: any) => void;
  onEvent: (event: string, handler: (...args: any[]) => void) => () => void;
}

let globalSocket: Socket | null = null;

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { namespace = '/chat', autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<SocketConnectionState>('CONNECTING');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!autoConnect) return;

    const wsUrl = (process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
    const token = typeof window !== 'undefined' ? localStorage.getItem('cambium_access_token') : null;

    if (!globalSocket || !globalSocket.connected) {
      globalSocket = io(`${wsUrl}${namespace}`, {
        auth: token ? { token } : undefined,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        randomizationFactor: 0.5,
        reconnectionAttempts: 10,
        timeout: 10000,
      });
    }

    socketRef.current = globalSocket;

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionState('CONNECTED');
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
    globalSocket.on('presence_update', handlePresenceUpdate);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    if (globalSocket.connected) {
      setIsConnected(true);
      setConnectionState('CONNECTED');
    }

    return () => {
      globalSocket?.off('connect', handleConnect);
      globalSocket?.off('disconnect', handleDisconnect);
      globalSocket?.off('reconnect_attempt', handleReconnectAttempt);
      globalSocket?.off('reconnect_failed', handleReconnectFailed);
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
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/network/ping`, { cache: 'no-store' });
      if (res.ok) {
        const roundtrip = Date.now() - start;
        setLatencyMs(roundtrip);
        return roundtrip;
      }
    } catch {
      // Fallback local calculation
    }
    return null;
  }, []);

  // Periodic latency measurement every 45s
  useEffect(() => {
    if (!isConnected) return;
    pingGateway();
    const intervalId = setInterval(pingGateway, 45000);
    return () => clearInterval(intervalId);
  }, [isConnected, pingGateway]);

  const joinRoom = useCallback((room: string, user: { id: string; name: string; avatar?: string }) => {
    socketRef.current?.emit('join_room', { room, user });
  }, []);

  const leaveRoom = useCallback((room: string, userId?: string) => {
    socketRef.current?.emit('leave_room', { room, userId });
  }, []);

  const sendMessage = useCallback((room: string, message: string, sender: { id: string; name: string; avatar?: string }) => {
    socketRef.current?.emit('send_message', { room, message, sender });
  }, []);

  const sendTyping = useCallback((room: string, userId: string, userName: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { room, userId, userName, isTyping });
  }, []);

  const emitEvent = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const onEvent = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => { socketRef.current?.off(event, handler); };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connectionState,
    latencyMs,
    pingGateway,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    emitEvent,
    onEvent,
  };
}
