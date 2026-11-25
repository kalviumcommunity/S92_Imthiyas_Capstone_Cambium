import { create } from "zustand";
import { clearFrontendQueryCache } from "../query-client";
import { useSubscriptionStore } from "./useSubscriptionStore";

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
  photo?: string | null;
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

const SESSION_WINDOW_DAYS = 30; // 30-day enterprise remember me window

export function clearScopedUserCaches(): void {
  clearFrontendQueryCache();
  useSubscriptionStore.getState().resetStore();
  if (typeof window !== "undefined") {
    localStorage.removeItem("cambium_workspace_drafts_v2");
    localStorage.removeItem("cambium_bookmarks");
  }
}

export const useAuthStore = create<AuthState>((set, get) => {
  let initialToken: string | null = null;
  let initialUser: UserProfile | null = null;

  if (typeof window !== "undefined") {
    const expiry = localStorage.getItem("cambium_session_expiry");
    const isExpired = expiry ? Date.now() > Number(expiry) : false;

    if (isExpired) {
      localStorage.removeItem("cambium_token");
      localStorage.removeItem("cambium_user");
      localStorage.removeItem("cambium_session_expiry");
      document.cookie = "cambium_token=; path=/; max-age=0; SameSite=Lax";
    } else {
      initialToken = localStorage.getItem("cambium_token");
      const storedUser = localStorage.getItem("cambium_user");
      if (storedUser) {
        try {
          initialUser = JSON.parse(storedUser);
          if (initialUser && (initialUser.fullName === "Verified Scholar" || initialUser.name === "Verified Scholar")) {
            initialUser.fullName = initialUser.email && !initialUser.email.includes("scholar@cambium")
              ? initialUser.email.split("@")[0]
              : "Scholar";
            initialUser.name = initialUser.fullName;
          }
        } catch {
          initialUser = null;
        }
      }
    }
  }

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: Boolean(initialToken),
    setAuth: (user, token) => {
      const prevUserId = get().user?.id;
      const sanitizedUser: UserProfile = user
        ? {
            ...user,
            fullName: user.fullName || user.name || user.username || "Scholar",
            name: user.name || user.fullName || user.username || "Scholar",
          }
        : ({} as UserProfile);

      if (prevUserId && sanitizedUser.id && prevUserId !== sanitizedUser.id) {
        clearScopedUserCaches();
      }

      if (typeof window !== "undefined") {
        const maxAgeSeconds = SESSION_WINDOW_DAYS * 24 * 60 * 60;
        localStorage.setItem("cambium_token", token);
        localStorage.setItem("cambium_access_token", token);
        localStorage.setItem("cambium_user", JSON.stringify(sanitizedUser));
        localStorage.setItem("cambium_session_expiry", String(Date.now() + maxAgeSeconds * 1000));
        document.cookie = `cambium_token=${token}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
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
      set({ user: sanitizedUser, isAuthenticated: Boolean(sanitizedUser) });
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
      clearScopedUserCaches();
      if (typeof window !== "undefined") {
        localStorage.removeItem("cambium_token");
        localStorage.removeItem("cambium_access_token");
        localStorage.removeItem("cambium_refresh_token");
        localStorage.removeItem("cambium_user");
        localStorage.removeItem("cambium_session_expiry");
        localStorage.removeItem("cambium_onboarding_completed");
        document.cookie = "cambium_token=; path=/; max-age=0; SameSite=Lax";
      }
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
