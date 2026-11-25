"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Lock } from "lucide-react";
import CambiumLogo from "@/components/CambiumLogo";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check token expiry window & JWT exp claim consistently with Edge middleware
    const storedToken = localStorage.getItem("cambium_token") || localStorage.getItem("cambium_access_token");
    const activeToken = token || storedToken;
    const expiry = localStorage.getItem("cambium_session_expiry");
    let isExpired = expiry ? Date.now() > Number(expiry) : false;

    if (activeToken && !isExpired) {
      const parts = activeToken.split(".");
      if (parts.length === 3) {
        try {
          const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
          const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
          const payload = JSON.parse(atob(padded)) as { exp?: number };
          if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
            isExpired = true;
          }
        } catch {
          // Non-blocking fallback for non-JWT dev tokens
        }
      }
    }

    if (isExpired) {
      useAuthStore.getState().logout();
    }

    const hasValidToken = Boolean(activeToken && !isExpired);

    if (hasValidToken) {
      // Keep session cookie synchronized for Next.js edge middleware
      if (activeToken && !document.cookie.includes("cambium_token=")) {
        const maxAge = 30 * 24 * 60 * 60;
        document.cookie = `cambium_token=${activeToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
      }
      setIsAuthorized(true);
    } else {
      const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      const redirectUrl = encodeURIComponent(fullPath || "/dashboard");
      router.replace(`/sign-in?redirect=${redirectUrl}&notice=auth_required`);
    }
  }, [isAuthenticated, token, pathname, searchParams, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF7F0] dark:bg-[#0E140F] text-[#202920] dark:text-[#EDEAE2] p-6 transition-colors duration-200">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <CambiumLogo size="lg" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#DCE6D7] dark:bg-[#233527] text-[#3E6248] dark:text-[#4ADE80]">
            <Lock size={12} />
            <span>ENTERPRISE ACCESS GUARD</span>
          </div>
          <p className="text-xs sm:text-sm text-[#62685E] dark:text-[#9DA39A]">
            Verifying institutional credentials and session window...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

