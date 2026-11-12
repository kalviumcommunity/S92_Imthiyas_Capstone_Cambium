"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useBrowserStorageValue, writeBrowserStorageValue } from "@/lib/hooks/use-browser-storage";
import { useHydrated } from "@/lib/hooks/use-hydrated";

export type Theme = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "cambium-theme";
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

function subscribeToSystemTheme(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getSystemThemeSnapshot(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSystemThemeSnapshot(): ResolvedTheme {
  return "light";
}

function applyThemeToDOM(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.style.colorScheme = resolved;

  const activeFavicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]:not([media])');
  if (activeFavicon) {
    activeFavicon.href =
      resolved === "dark" ? "/public_logo/favicon-dark.svg" : "/public_logo/favicon-light.svg";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const storedTheme = useBrowserStorageValue("local", STORAGE_KEY);
  const [fallbackTheme, setFallbackTheme] = useState<Theme | null>(null);
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    getServerSystemThemeSnapshot
  );
  const hydrated = useHydrated();

  const theme = fallbackTheme ?? (isTheme(storedTheme) ? storedTheme : "system");
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    applyThemeToDOM(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      writeBrowserStorageValue("local", STORAGE_KEY, newTheme);
      setFallbackTheme(null);
    } catch (error) {
      console.error("[ThemeProvider] Unable to persist theme preference:", error);
      setFallbackTheme(newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const contextValue = useMemo(
    () => ({
      theme,
      resolvedTheme: hydrated ? resolvedTheme : "light",
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, hydrated, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
