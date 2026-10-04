"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Check, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "success", duration = 3800 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      {/* Floating Toast Stack */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => {
          const isSuccess = t.variant === "success" || !t.variant;
          const isError = t.variant === "error";
          const isWarning = t.variant === "warning";
          const isInfo = t.variant === "info";

          const icon = isSuccess ? (
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#3E6248] flex items-center justify-center shrink-0">
              <Check size={14} className="stroke-[2.5]" />
            </div>
          ) : isError ? (
            <div className="w-6 h-6 rounded-full bg-red-100 text-[#A33B32] flex items-center justify-center shrink-0">
              <AlertCircle size={14} className="stroke-[2.5]" />
            </div>
          ) : isWarning ? (
            <div className="w-6 h-6 rounded-full bg-amber-100 text-[#8A5A12] flex items-center justify-center shrink-0">
              <AlertTriangle size={14} className="stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 text-[#365F8D] flex items-center justify-center shrink-0">
              <Info size={14} className="stroke-[2.5]" />
            </div>
          );

          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto bg-white border border-[#E4DCCB] rounded-2xl p-4 shadow-xl flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200"
            >
              {icon}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-serif text-[14px] font-semibold text-[#202920] leading-snug m-0">
                  {t.title}
                </p>
                {t.description && (
                  <p className="font-sans text-xs text-[#62685E] mt-1 leading-relaxed m-0">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-[#85877B] hover:text-[#202920] p-1 rounded-md transition-colors bg-transparent border-0 cursor-pointer -mt-1 -mr-1"
                aria-label="Dismiss toast"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Graceful fallback if invoked outside provider
    return {
      toast: (opts: Omit<ToastItem, "id">) => {
        if (typeof window !== "undefined") {
          console.log(`[Toast ${opts.variant || "info"}]: ${opts.title}`);
        }
      },
      dismiss: () => {},
    };
  }
  return ctx;
}
