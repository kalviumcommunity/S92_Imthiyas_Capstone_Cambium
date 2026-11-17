import { create } from 'zustand';

export interface PresenceUser {
  id: string;
  name: string;
  avatar?: string;
  joinedAt: string;
  roomId: string;
}

interface PresenceState {
  rooms: Record<string, PresenceUser[]>;
  addUserToRoom: (roomId: string, user: PresenceUser) => void;
  removeUserFromRoom: (roomId: string, userId: string) => void;
  getUsersInRoom: (roomId: string) => PresenceUser[];
  clearRoom: (roomId: string) => void;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  rooms: {},

  addUserToRoom: (roomId, user) => {
    set((state) => {
      const existing = state.rooms[roomId] || [];
      const filtered = existing.filter((u) => u.id !== user.id);
      return { rooms: { ...state.rooms, [roomId]: [...filtered, { ...user, roomId }] } };
    });
  },

  removeUserFromRoom: (roomId, userId) => {
    set((state) => {
      const existing = state.rooms[roomId] || [];
      return { rooms: { ...state.rooms, [roomId]: existing.filter((u) => u.id !== userId) } };
    });
  },

  getUsersInRoom: (roomId) => {
    return get().rooms[roomId] || [];
  },

  clearRoom: (roomId) => {
    set((state) => {
      const { [roomId]: _, ...rest } = state.rooms;
      return { rooms: rest };
    });
  },
}));
