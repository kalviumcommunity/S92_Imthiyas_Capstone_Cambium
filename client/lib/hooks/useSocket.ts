"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  namespace?: string;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (room: string, user: { id: string; name: string; avatar?: string }) => void;
  leaveRoom: (room: string, userId?: string) => void;
  sendMessage: (room: string, message: string, sender: { id: string; name: string; avatar?: string }) => void;
  sendTyping: (room: string, userId: string, userName: string, isTyping: boolean) => void;
  onEvent: (event: string, handler: (...args: any[]) => void) => () => void;
}

let globalSocket: Socket | null = null;

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { namespace = '/chat', autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(false);
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
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });
    }

    socketRef.current = globalSocket;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    globalSocket.on('connect', handleConnect);
    globalSocket.on('disconnect', handleDisconnect);

    if (globalSocket.connected) setIsConnected(true);

    return () => {
      globalSocket?.off('connect', handleConnect);
      globalSocket?.off('disconnect', handleDisconnect);
    };
  }, [namespace, autoConnect]);

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

  const onEvent = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => { socketRef.current?.off(event, handler); };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    onEvent,
  };
}
