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
        if (initialUser && initialUser.fullName) {
          if (/maya|chen/i.test(initialUser.fullName) || /\(0000|\(google/i.test(initialUser.fullName)) {
            initialUser.fullName = "Imthiyas";
            if (initialUser.email && /maya/i.test(initialUser.email)) {
              initialUser.email = "imthiyas@orcid.org";
            }
            localStorage.setItem("cambium_user", JSON.stringify(initialUser));
          }
        }
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
      const sanitizedUser = user
        ? {
            ...user,
            fullName: user.fullName
              ? (/maya|chen/i.test(user.fullName)
                  ? "Imthiyas"
                  : user.fullName.replace(/\s*\([^)]*\)/g, "").trim() || "Imthiyas")
              : "Imthiyas",
          }
        : user;
      if (typeof window !== "undefined") {
        localStorage.setItem("cambium_token", token);
        localStorage.setItem("cambium_user", JSON.stringify(sanitizedUser));
      }
      set({ user: sanitizedUser, token, isAuthenticated: true });
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
