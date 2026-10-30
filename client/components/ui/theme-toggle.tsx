"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Settings, Check, Sparkles } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme-provider";
import Link from "next/link";

interface ThemeToggleProps {
  variant?: "segmented" | "gearbox" | "minimal";
  className?: string;
  showLabels?: boolean;
}

/**
 * Cambium Segmented Theme Toggle Bar
 * Mathematically aligned optical grid, WCAG 2.2 AA target size, botanical feedback.
 */
export function ThemeToggle({
  variant = "segmented",
  className = "",
  showLabels = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isExpanded = isHovered || isFocused;

  if (!mounted) {
    if (variant === "minimal") {
      return (
        <button
          type="button"
          disabled
          aria-hidden="true"
          suppressHydrationWarning
          className={`inline-flex items-center justify-center p-2 rounded-full border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0]/80 dark:bg-[#18231B]/80 text-[#202920] dark:text-[#EDEAE2] min-h-[36px] min-w-[36px] shadow-2xs opacity-75 ${className}`}
        >
          <Sun size={16} className="text-[#3E6248] opacity-50" />
        </button>
      );
    }

    return (
      <div
        aria-hidden="true"
        suppressHydrationWarning
        className={`inline-flex items-center p-1 rounded-full border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0]/90 dark:bg-[#131C15]/90 min-h-[38px] min-w-[38px] ${className}`}
      >
        <div className="w-[30px] h-[30px] rounded-full bg-[#3E6248]/20 flex items-center justify-center">
          <Sun size={14} className="text-[#3E6248] opacity-50" />
        </div>
      </div>
    );
  }

  const options: { id: Theme; label: string; icon: React.ReactNode; tooltip: string }[] = [
    {
      id: "light",
      label: "Light",
      icon: <Sun size={14} className="transition-transform duration-200 group-hover:rotate-45 shrink-0" />,
      tooltip: "Living Materials (Warm Paper)",
    },
    {
      id: "system",
      label: "Auto",
      icon: <Laptop size={14} className="transition-transform duration-200 shrink-0" />,
      tooltip: "System Default (OS Synced)",
    },
    {
      id: "dark",
      label: "Dark",
      icon: <Moon size={14} className="transition-transform duration-200 group-hover:-rotate-12 shrink-0" />,
      tooltip: "Bioluminescent Botanical (Night)",
    },
  ];

  if (variant === "minimal") {
    return (
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={`inline-flex items-center justify-center p-2 rounded-full border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0]/80 dark:bg-[#18231B]/80 text-[#202920] dark:text-[#EDEAE2] hover:border-[#3E6248] dark:hover:border-[#4ADE80] transition-all min-h-[36px] min-w-[36px] cursor-pointer shadow-2xs ${className}`}
        title={`Current: ${theme} (Click to switch)`}
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <Moon size={16} className="text-[#4ADE80]" />
        ) : (
          <Sun size={16} className="text-[#3E6248]" />
        )}
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selection"
      suppressHydrationWarning
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
      className={`group/toggle relative inline-flex items-center p-1 rounded-full border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0]/90 dark:bg-[#131C15]/90 backdrop-blur-md shadow-2xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none cursor-pointer ${
        isExpanded ? "gap-1 px-1.5" : "gap-0 px-1"
      } ${className}`}
    >
      {options.map((opt) => {
        const isActive = theme === opt.id;
        const isVisible = isExpanded || isActive;

        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            suppressHydrationWarning
            aria-checked={isActive}
            tabIndex={isVisible ? 0 : -1}
            onClick={() => setTheme(opt.id)}
            title={opt.tooltip}
            className={`group relative flex items-center justify-center rounded-full text-xs font-sans font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none ${
              isVisible
                ? "h-[30px] min-h-[30px] opacity-100 scale-100 pointer-events-auto " +
                  (isExpanded
                    ? showLabels
                      ? "px-2.5 max-w-[90px]"
                      : "w-[30px] min-w-[30px] max-w-[30px] p-0"
                    : "w-[30px] min-w-[30px] max-w-[30px] p-0")
                : "w-0 min-w-0 max-w-0 p-0 m-0 opacity-0 scale-75 pointer-events-none overflow-hidden border-0"
            } ${
              isActive
                ? "bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] shadow-sm font-semibold"
                : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#E4DCCB]/50 dark:hover:bg-[#202D23]/60"
            }`}
          >
            {opt.icon}
            {showLabels && isExpanded && <span className="text-[11px] tracking-tight ml-1">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Universal Cambium Gearbox Widget
 * Floating quick theme switcher with detailed popover available everywhere across Cambium.
 */
export function UniversalThemeGearbox() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Keyboard escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const themes: {
    id: Theme;
    title: string;
    desc: string;
    icon: React.ReactNode;
    colorSwatch: string;
  }[] = [
    {
      id: "system",
      title: "System Preference",
      desc: "Synchronizes automatically with your OS light/dark schedule",
      icon: <Laptop size={15} />,
      colorSwatch: "linear-gradient(135deg, #FAF7F0 50%, #0E140F 50%)",
    },
    {
      id: "light",
      title: "Living Materials (Light)",
      desc: "Warm paper parchment canvas, forest ink, living canopy green",
      icon: <Sun size={15} />,
      colorSwatch: "#FAF7F0",
    },
    {
      id: "dark",
      title: "Bioluminescent Botanical (Dark)",
      desc: "Abyssal pine, luminescent bone prose, radiant emerald accents",
      icon: <Moon size={15} />,
      colorSwatch: "#0E140F",
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      suppressHydrationWarning
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden select-none"
    >
      {/* Popover Gearbox Menu */}
      {isOpen && (
        <div className="mb-3 w-80 rounded-2xl border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0] dark:bg-[#18231B] p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E4DCCB] dark:border-[#233327]">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] animate-pulse" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80]">
                Universal Theme Engine
              </span>
            </div>
            <Link
              href="/settings?tab=appearance"
              onClick={() => setIsOpen(false)}
              className="font-mono text-[10px] text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] flex items-center gap-1 no-underline"
            >
              <span>Settings</span>
              <span>→</span>
            </Link>
          </div>

          <div className="space-y-1.5">
            {themes.map((item) => {
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setTheme(item.id);
                  }}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? "border-[#3E6248] dark:border-[#4ADE80] bg-white dark:bg-[#202D23] shadow-xs"
                      : "border-transparent hover:border-[#E4DCCB] dark:hover:border-[#233327] hover:bg-white/60 dark:hover:bg-[#202D23]/40"
                  }`}
                >
                  {/* Visual Swatch Circle */}
                  <div
                    className="mt-0.5 w-6 h-6 rounded-full shrink-0 border border-[#E4DCCB] dark:border-[#233327] flex items-center justify-center shadow-2xs"
                    style={{ background: item.colorSwatch }}
                  >
                    <span
                      className={`text-[10px] ${
                        item.id === "dark"
                          ? "text-[#4ADE80]"
                          : item.id === "light"
                          ? "text-[#3E6248]"
                          : "text-[#62685E]"
                      }`}
                    >
                      {item.icon}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#202920] dark:text-[#EDEAE2]">
                        {item.title}
                      </span>
                      {isSelected && (
                        <Check size={14} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#62685E] dark:text-[#A3B899] line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between text-[10px] font-mono text-[#85877B] dark:text-[#7E8B7B]">
            <span>Active: {resolvedTheme.toUpperCase()}</span>
            <span>W3C DTCG / WCAG 2.2</span>
          </div>
        </div>
      )}

      {/* Floating Gearbox Trigger Button */}
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2 px-3 py-2.5 rounded-full border border-[#E4DCCB] dark:border-[#233327] bg-[#FAF7F0]/95 dark:bg-[#18231B]/95 text-[#202920] dark:text-[#EDEAE2] shadow-lg hover:shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer hover:border-[#3E6248] dark:hover:border-[#4ADE80]"
        aria-label="Universal Theme Gearbox"
        title="Cambium Universal Theme Engine"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E4DCCB]/60 dark:bg-[#202D23] text-[#3E6248] dark:text-[#4ADE80] transition-transform duration-300 group-hover:rotate-90">
          <Settings size={14} />
        </span>
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#3E6248] dark:text-[#4ADE80]">
          {theme === "system" ? `AUTO (${resolvedTheme})` : theme}
        </span>
      </button>
    </div>
  );
}
