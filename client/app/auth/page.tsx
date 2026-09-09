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
import { Sparkles, LogIn, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

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
    <div className="max-w-md mx-auto px-4 py-16">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Cambium Workspace</h1>
        <p className="text-xs text-slate-400 mt-1">
          PostgreSQL-backed authentication with JWT session management.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-2xl">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/80 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === "login"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
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
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username or Email
              </label>
              <input
                {...registerLogin("usernameOrEmail")}
                placeholder="sarah_phd or sarah@mit.edu"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {loginErrors.usernameOrEmail && (
                <p className="text-xs text-rose-400 mt-1">
                  {loginErrors.usernameOrEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                {...registerLogin("password")}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {loginErrors.password && (
                <p className="text-xs text-rose-400 mt-1">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-md shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
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
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Username *
                </label>
                <input
                  {...registerRegister("username")}
                  placeholder="e.g. alan_turing"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                {regErrors.username && (
                  <p className="text-[11px] text-rose-400 mt-0.5">
                    {regErrors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  {...registerRegister("fullName")}
                  placeholder="Dr. Alan Turing"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                {regErrors.fullName && (
                  <p className="text-[11px] text-rose-400 mt-0.5">
                    {regErrors.fullName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                {...registerRegister("email")}
                placeholder="alan@cambridge.ac.uk"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {regErrors.email && (
                <p className="text-[11px] text-rose-400 mt-0.5">
                  {regErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                {...registerRegister("password")}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {regErrors.password && (
                <p className="text-[11px] text-rose-400 mt-0.5">
                  {regErrors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Institution / University
              </label>
              <input
                {...registerRegister("institution")}
                placeholder="Cambridge University / MIT CSAIL"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Research Interests (Comma separated)
              </label>
              <input
                {...registerRegister("researchInterests")}
                placeholder="Quantum Computing, AI, Cryptography"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg shadow-md shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Researcher Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
