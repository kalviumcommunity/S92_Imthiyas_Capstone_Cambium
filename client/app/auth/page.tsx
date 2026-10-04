"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  LoginFormValues,
  RegisterFormValues,
} from "@/lib/schemas/auth";
import { loginUser, registerUser } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import CambiumLogo from "@/components/CambiumLogo";
import { LogIn, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { setAuth } = useAuthStore();

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Register Form
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await loginUser(data);
      if (res.success && res.token && res.user) {
        setAuth(res.user, res.token);
        setSuccessMessage("Authenticated successfully! Redirecting...");
        setTimeout(() => {
          router.push("/opportunities");
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormValues) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        institution: data.institution || undefined,
        researchInterests: data.researchInterests
          ? data.researchInterests.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const res = await registerUser(payload);
      if (res.success && res.token && res.user) {
        setAuth(res.user, res.token);
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/opportunities");
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 font-sans">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-3">
          <CambiumLogo size="lg" href="/" />
        </div>
        <p className="text-xs text-ink-secondary mt-1">
          PostgreSQL-backed authentication with JWT session management.
        </p>
      </div>

      <div className="rounded-2xl p-6 bg-surface-raised border border-edge-default shadow-elevation-2">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-surface-sunken rounded-xl mb-6 border border-edge-default">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === "login"
                ? "bg-surface-raised text-ink-primary shadow-elevation-1 border border-edge-default"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("register");
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === "register"
                ? "bg-surface-raised text-ink-primary shadow-elevation-1 border border-edge-default"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-[#8C3225] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-moss-050 border border-moss-300 text-moss-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                Username or Email
              </label>
              <input
                {...registerLogin("usernameOrEmail")}
                placeholder="sarah_phd or sarah@mit.edu"
                className="w-full px-3.5 py-2.5 bg-surface-base border border-edge-default rounded-lg text-sm text-ink-primary placeholder-ink-tertiary focus:outline-none focus:border-edge-focus focus:ring-1 focus:ring-moss-600 transition-colors"
              />
              {loginErrors.usernameOrEmail && (
                <p className="text-xs text-[#8C3225] mt-1">
                  {loginErrors.usernameOrEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                {...registerLogin("password")}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-surface-base border border-edge-default rounded-lg text-sm text-ink-primary placeholder-ink-tertiary focus:outline-none focus:border-edge-focus focus:ring-1 focus:ring-moss-600 transition-colors"
              />
              {loginErrors.password && (
                <p className="text-xs text-[#8C3225] mt-1">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-surface-inverse hover:bg-moss-700 text-xs font-semibold text-surface-base rounded-lg shadow-elevation-1 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Workspace"}
            </button>
          </form>
        )}

        {/* Registration Form */}
        {tab === "register" && (
          <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1">
                  Username *
                </label>
                <input
                  {...registerRegister("username")}
                  placeholder="e.g. alan_turing"
                  className="w-full px-3 py-2 bg-surface-base border border-edge-default rounded-lg text-xs text-ink-primary placeholder-ink-tertiary focus:outline-none focus:border-edge-focus focus:ring-1 focus:ring-moss-600 transition-colors"
                />
                {regErrors.username && (
                  <p className="text-[11px] text-[#8C3225] mt-0.5">
                    {regErrors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-secondary mb-1">
                  Full Name *
                </label>
                <input
                  {...registerRegister("fullName")}
                  placeholder="Dr. Alan Turing"
                  className="w-full px-3 py-2 bg-surface-base border border-edge-default rounded-lg text-xs text-ink-primary placeholder-ink-tertiary focus:outline-none focus:border-edge-focus focus:ring-1 focus:ring-moss-600 transition-colors"
                />
                {regErrors.fullName && (
                  <p className="text-[11px] text-[#8C3225] mt-0.5">
                    {regErrors.fullName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                Email Address *
              </label>
              <input
                type="email"
                {...registerRegister("email")}
                placeholder="alan@cambridge.ac.uk"
                className="w-full px-3 py-2 bg-surface-base border border-edge-default rounded-lg text-xs text-ink-primary placeholder-ink-tertiary focus:outline-none focus:border-edge-focus focus:ring-1 focus:ring-moss-600 transition-colors"
              />
              {regErrors.email && (
                <p className="text-[11px] text-[#8C3225] mt-0.5">
                  {regErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                Password *
              </label>
              <input
                type="password"
                {...registerRegister("password")}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-surface-base border border-edge-default rounded-lg text-xs text-ink-primary placeholder-ink-tertiary focus:outline-none focus:border-edge-focus focus:ring-1 focus:ring-moss-600 transition-colors"
              />
              {regErrors.password && (
                <p className="text-[11px] text-[#8C3225] mt-0.5">
                  {regErrors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                Institution / University
              </label>
              <input
                {...registerRegister("institution")}
                placeholder="Cambridge University / MIT CSAIL"
                className="w-full px-3 py-2 bg-surface-base border border-edge-default rounded-lg text-xs text-ink-primary placeholder-ink-tertiary focus:outline-none focus:border-edge-focus focus:ring-1 focus:ring-moss-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                Research Interests (Comma separated)
              </label>
              <input
                {...registerRegister("researchInterests")}
                placeholder="Quantum Computing, AI, Cryptography"
                className="w-full px-3 py-2 bg-surface-base border border-edge-default rounded-lg text-xs text-ink-primary placeholder-ink-tertiary focus:outline-none focus:border-edge-focus focus:ring-1 focus:ring-moss-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-surface-inverse hover:bg-moss-700 text-xs font-semibold text-surface-base rounded-lg shadow-elevation-1 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Researcher Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
