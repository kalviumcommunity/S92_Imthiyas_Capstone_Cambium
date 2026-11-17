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

    // Check token from store or directly from localStorage
    const storedToken = localStorage.getItem("cambium_token");
    const expiry = localStorage.getItem("cambium_session_expiry");
    const isExpired = expiry ? Date.now() > Number(expiry) : false;

    if (isExpired) {
      localStorage.removeItem("cambium_token");
      localStorage.removeItem("cambium_user");
      localStorage.removeItem("cambium_session_expiry");
      document.cookie = "cambium_token=; path=/; max-age=0; SameSite=Lax";
    }

    const hasValidToken = Boolean((token || storedToken) && !isExpired);

    if (!hasValidToken) {
      const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      const redirectUrl = encodeURIComponent(fullPath || "/dashboard");
      router.replace(`/sign-in?redirect=${redirectUrl}&notice=auth_required`);
    } else {
      setIsAuthorized(true);
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

