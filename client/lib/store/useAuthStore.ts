import { create } from "zustand";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  name?: string;
  role?: string;
  institution?: string;
  department?: string;
  graduation?: string;
  headline?: string;
  bio?: string;
  orcid?: string;
  researchInterests?: Array<{ id: string; name: string; slug: string }> | string[];
  interests?: string[];
  topics?: string[];
  onboardingCompleted?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  setUser: (user: UserProfile) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
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
      const sanitizedUser: UserProfile = user
        ? {
            ...user,
            fullName: user.fullName || user.name || user.username || "Scholar",
            name: user.name || user.fullName || user.username || "Scholar",
          }
        : ({} as UserProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("cambium_token", token);
        localStorage.setItem("cambium_user", JSON.stringify(sanitizedUser));
      }
      set({ user: sanitizedUser, token, isAuthenticated: true });
    },
    setUser: (user) => {
      const sanitizedUser: UserProfile = user
        ? {
            ...user,
            fullName: user.fullName || user.name || user.username || "Scholar",
            name: user.name || user.fullName || user.username || "Scholar",
          }
        : ({} as UserProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("cambium_user", JSON.stringify(sanitizedUser));
      }
      set({ user: sanitizedUser, isAuthenticated: !!sanitizedUser });
    },
    updateUser: (patch) => {
      set((state) => {
        if (!state.user) return state;
        const updated: UserProfile = { ...state.user, ...patch };
        if (typeof window !== "undefined") {
          localStorage.setItem("cambium_user", JSON.stringify(updated));
        }
        return { user: updated };
      });
    },
    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cambium_token");
        localStorage.removeItem("cambium_user");
        localStorage.removeItem("cambium_onboarding_completed");
      }
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
