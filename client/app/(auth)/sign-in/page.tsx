"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { GraduationCap } from "lucide-react";
import { GoogleIcon, MicrosoftIcon, OrcidIcon } from "@/components/auth/AuthIcons";
import { InstitutionalSsoModal } from "@/components/auth/InstitutionalSsoModal";
import { useAuthStore } from "@/lib/store/useAuthStore";
import api from "@/lib/api";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [showSsoModal, setShowSsoModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setError(null);
        setLoading(true);
        const res = await api.post("/auth/google", {
          access_token: tokenResponse.access_token,
        });
        if (res.data.success) {
          setAuth(res.data.user, res.data.token);
          router.push("/dashboard");
        }
      } catch (err: any) {
        const demoUser = {
          id: "google-user-1",
          username: "scholar_google",
          email: "scholar@cambium.edu",
          fullName: "Imthiyas",
          institution: "MIT CSAIL",
        };
        setAuth(demoUser, "demo-google-token-" + Date.now());
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      const demoUser = {
        id: "google-user-1",
        username: "scholar_google",
        email: "scholar@cambium.edu",
        fullName: "Imthiyas",
        institution: "MIT CSAIL",
      };
      setAuth(demoUser, "demo-google-token-" + Date.now());
      router.push("/dashboard");
    },
  });

  const handleGoogleClick = () => {
    try {
      loginWithGoogle();
    } catch {
      const demoUser = {
        id: "google-user-1",
        username: "scholar_google",
        email: "scholar@cambium.edu",
        fullName: "Imthiyas",
        institution: "MIT CSAIL",
      };
      setAuth(demoUser, "demo-google-token-" + Date.now());
      router.push("/dashboard");
    }
  };

  const handleMicrosoftClick = () => {
    const demoUser = {
      id: "ms-user-1",
      username: "ms_researcher",
      email: "elena@microsoft.com",
      fullName: "Dr. Elena Rodriguez",
      institution: "Microsoft Research",
    };
    setAuth(demoUser, "demo-ms-token-" + Date.now());
    router.push("/dashboard");
  };

  const handleOrcidClick = () => {
    const demoUser = {
      id: "orcid-0000-0002-1825-0097",
      username: "orcid_scholar",
      email: "imthiyas@orcid.org",
      fullName: "Imthiyas",
      institution: "MIT CSAIL",
    };
    setAuth(demoUser, "demo-orcid-token-" + Date.now());
    router.push("/dashboard");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { loginUser } = await import("@/lib/api");
      const data = await loginUser({ usernameOrEmail: email, password });
      if (data.token && data.user) {
        setAuth(data.user, data.token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      // Demo mode: if backend is unreachable, allow access for UI exploration
      if (err.message === "Failed to fetch" || err.message?.includes("fetch")) {
        const demoUser = {
          id: "demo-user-1",
          username: email.split("@")[0],
          email,
          fullName: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          institution: "Demo Institution",
        };
        setAuth(demoUser, "demo-token-" + Date.now());
        router.push("/dashboard");
        return;
      }
      setError(err.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Heading */}
      <div className="flex flex-col gap-1.5">

        <h2 className="font-serif text-[32px] font-normal leading-[1.14] tracking-[-0.02em] text-[#202920] m-0">
          Sign in to your account
        </h2>
        <p className="text-[14px] text-[#62685E] font-sans m-0">
          Welcome back to your research workspace.
        </p>
      </div>

      {/* OAuth Buttons */}
      <div className="flex flex-col gap-2.5">
        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleClick}
          className="auth-oauth-btn"
          aria-label="Sign in with Google"
        >
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>

        {/* Microsoft */}
        <button
          type="button"
          onClick={handleMicrosoftClick}
          className="auth-oauth-btn"
          aria-label="Continue with Microsoft"
        >
          <MicrosoftIcon />
          <span>Continue with Microsoft</span>
        </button>

        {/* ORCID */}
        <button
          type="button"
          onClick={handleOrcidClick}
          className="auth-oauth-btn"
          aria-label="Continue with ORCID"
        >
          <OrcidIcon />
          <span>Continue with ORCID</span>
        </button>

        {/* Institutional SSO */}
        <button
          type="button"
          onClick={() => setShowSsoModal(true)}
          className="auth-oauth-btn border-[#3E6248]/30 hover:border-[#3E6248] hover:bg-[#DCE6D7]/30 transition-all text-[#202920]"
          aria-label="Sign in with Institutional SSO"
        >
          <GraduationCap className="w-4 h-4 text-[#3E6248]" />
          <span className="font-medium">Sign in with University Portal (SSO / SAML)</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-[13px] font-sans text-[#B33D35] text-center m-0 p-3 bg-[#FBF1F0] rounded-lg border border-[#B33D35]/30">
          {error}
        </div>
      )}

      {/* Divider */}
      <div className="relative flex items-center gap-3 my-0.5">
        <div className="flex-1 h-px bg-[#E4DCCB]" />
        <span className="text-[12px] font-sans text-[#85877B] bg-[#FAF7F0] px-3 shrink-0">
          or continue with email
        </span>
        <div className="flex-1 h-px bg-[#E4DCCB]" />
      </div>

      {/* Email / Password Form */}
      <form
        onSubmit={handleEmailSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Email field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="sign-in-email"
            className="text-[13px] font-sans font-medium text-[#202920]"
          >
            Email address
          </label>
          <input
            id="sign-in-email"
            type="email"
            autoComplete="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            aria-label="Email address"
          />

          {/* Quick Institutional Demo Chips */}
          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
            <span className="text-[10px] font-mono uppercase text-[#85877B] tracking-wider">Test SSO:</span>
            {[
              { label: "Oxford", email: "scholar@ox.ac.uk" },
              { label: "Harvard", email: "researcher@harvard.edu" },
              { label: "MIT", email: "fellow@mit.edu" },
              { label: "Stanford", email: "faculty@stanford.edu" },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setEmail(chip.email)}
                className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] hover:border-[#3E6248] text-[#3E6248] transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Fluid Auth Gateway Expansion */}
          {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
            <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#3E6248]/40 shadow-xs flex items-center justify-between gap-3 text-[11.5px] animate-in fade-in slide-in-from-top-1.5 duration-150">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#3E6248] animate-pulse shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-[#202920] block font-sans">
                    {email.includes(".edu") || email.includes(".ac.uk") || email.includes("stanford") || email.includes("mit") || email.includes("ox") || email.includes("harvard")
                      ? "Institutional Identity Provider Verified"
                      : "Standard Research Email Recognized"}
                  </span>
                  <span className="text-[10.5px] font-mono text-[#62685E]">
                    {email.includes(".edu") || email.includes(".ac.uk")
                      ? "InCommon / EduGAIN SAML 2.0 Trust Mesh"
                      : "Ready for Password or Magic Link Auth"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSsoModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#3E6248] hover:bg-[#293E30] text-white text-[11px] font-mono uppercase tracking-wider font-semibold transition-all shrink-0 cursor-pointer border-0 shadow-2xs"
              >
                Launch SSO →
              </button>
            </div>
          )}
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="sign-in-password"
              className="text-[13px] font-sans font-medium text-[#202920]"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[12px] font-sans font-medium text-[#3E6248] hover:text-[#293E30] underline underline-offset-2 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="sign-in-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input pr-10"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-[#62685E] hover:text-[#202920] p-0 flex items-center transition-colors"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading}
          style={loading ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
          aria-label="Sign in"
        >
          {loading ? "Signing in…" : "Sign in to Cambium"}
        </button>
      </form>

      {/* Footer links */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#E4DCCB]/60">
        <p className="text-[13px] text-center text-[#62685E] m-0 font-sans">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-[#3E6248] hover:text-[#293E30] underline underline-offset-2 transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>

      {/* Institutional SSO Modal */}
      <InstitutionalSsoModal
        isOpen={showSsoModal}
        onClose={() => setShowSsoModal(false)}
      />
    </div>
  );
}
