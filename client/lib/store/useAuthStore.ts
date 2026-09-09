import { create } from "zustand";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  institution?: string;
  researchInterests?: Array<{ id: string; name: string; slug: string }>;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage if in browser
  let initialToken: string | null = null;
  let initialUser: UserProfile | null = null;

  if (typeof window !== "undefined") {
    initialToken = localStorage.getItem("cambium_token");
    const storedUser = localStorage.getItem("cambium_user");
    if (storedUser) {
      try {
        initialUser = JSON.parse(storedUser);
      } catch {
        initialUser = null;
      }
    }
  }

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,
    setAuth: (user, token) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("cambium_token", token);
        localStorage.setItem("cambium_user", JSON.stringify(user));
      }
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cambium_token");
        localStorage.removeItem("cambium_user");
      }
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
