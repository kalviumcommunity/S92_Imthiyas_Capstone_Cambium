"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Layers,
  Brain,
  LayoutGrid,
  Sparkles,
  BookOpen,
  Briefcase,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  Pin,
  PinOff,
  Search,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import CambiumLogo from "@/components/CambiumLogo";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string;
  hasChevron?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Workspace", href: "/workspace", icon: Layers },
  { label: "Intelligence", href: "/intelligence", icon: Brain },
  { label: "Personal OS", href: "/os", icon: LayoutGrid },
  { label: "Opportunities", href: "/opportunities", icon: Sparkles, badge: "New" },
  { label: "Publications", href: "/publications", icon: BookOpen, hasChevron: true },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Notifications", href: "/notifications", icon: Bell, badge: "3" },
];

export default function GlobalSidebar() {
  const pathname = usePathname() || "";
  const user = useAuthStore((state) => state.user);

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize pinned state from localStorage
  useEffect(() => {
    try {
      const savedPin = localStorage.getItem("cambium_sidebar_pinned");
      if (savedPin === "true") setIsPinned(true);
    } catch {
      // ignore
    }
  }, []);

  const togglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("cambium_sidebar_pinned", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 180);
  };

  const isOpen = isPinned || isHovered;

  const isActive = (href: string) => {
    if (pathname === href || pathname === `/app${href}`) return true;
    if (pathname.startsWith(href + "/") || pathname.startsWith(`/app${href}/`)) return true;
    return false;
  };

  // User display metadata
  const rawName = user?.fullName || "Imthiyas";
  let displayName = rawName;
  if (/maya|chen/i.test(displayName)) {
    displayName = "Imthiyas";
  } else {
    displayName = displayName.replace(/\s*\([^)]*\)/g, "").trim() || "Imthiyas";
  }
  const displaySubtitle =
    user?.institution && !/maya|chen/i.test(user.institution)
      ? user.institution
      : user?.email && !/maya|chen/i.test(user.email)
      ? user.email
      : "MIT CSAIL · Postdoc";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "IM";

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative h-[calc(100vh-20px)] my-2.5 ml-2.5 flex flex-col justify-between select-none z-30 flex-shrink-0 bg-[#FAF7F0] border border-[#E4DCCB] rounded-[26px] shadow-[0_4px_24px_rgba(32,41,32,0.06)] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? "w-[250px]" : "w-[68px]"
      }`}
      aria-label="Enterprise Scholarly Navigation"
    >
      {/* Top Header */}
      <div className="flex flex-col">
        {/* Brand / Logo Row */}
        <div
          className={`h-16 flex items-center border-b border-[#E4DCCB]/70 px-3.5 transition-all ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isOpen ? (
            <CambiumLogo size="sm" href="/dashboard" />
          ) : (
            <Link
              href="/dashboard"
              title="CAMBIUM Research Dashboard"
              className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] p-1 flex items-center justify-center shadow-xs transition-transform hover:scale-105 shrink-0 overflow-hidden"
            >
              <img
                src="/logo.svg"
                alt="CAMBIUM Research"
                className="w-full h-full object-contain"
              />
            </Link>
          )}

          {/* Pin Toggle Button (Visible when open) */}
          {isOpen && (
            <button
              onClick={togglePin}
              title={isPinned ? "Unpin sidebar (collapse to strip)" : "Pin sidebar open"}
              className="p-1.5 rounded-lg text-[#62685E] hover:text-[#202920] hover:bg-[#F2EBDD] transition-colors border-0 bg-transparent cursor-pointer"
            >
              {isPinned ? (
                <Pin className="w-3.5 h-3.5 text-[#3E6248] fill-[#3E6248]" />
              ) : (
                <PinOff className="w-3.5 h-3.5 text-[#85877B]" />
              )}
            </button>
          )}
        </div>

        {/* Global Command Palette Trigger */}
        <div className="px-2 pt-2 pb-1">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-command-palette"));
              }
            }}
            title={!isOpen ? "Command Palette (⌘K)" : undefined}
            className={`w-full flex items-center rounded-xl text-[13px] bg-white border border-[#E4DCCB] text-[#62685E] hover:text-[#202920] hover:border-[#3E6248]/40 hover:bg-[#FAF7F0] transition-all cursor-pointer shadow-2xs ${
              isOpen ? "px-3 py-2 justify-between" : "w-11 h-11 mx-auto justify-center"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Search size={16} className="text-[#3E6248] shrink-0" />
              {isOpen && <span className="font-sans font-medium text-xs">Search Cambium...</span>}
            </div>
            {isOpen && (
              <kbd className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAF7F0] border border-[#E4DCCB] text-[#85877B]">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)] no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isOpen ? item.label : undefined}
                className={`flex items-center rounded-xl text-[13.5px] transition-all duration-200 group no-underline relative ${
                  isOpen ? "px-3 py-2.5 justify-between" : "w-11 h-11 mx-auto justify-center"
                } ${
                  active
                    ? "bg-[#DCE6D7] text-[#202920] font-semibold shadow-xs"
                    : "text-[#62685E] hover:text-[#202920] hover:bg-[#F2EBDD] font-medium"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={19}
                    className={`shrink-0 transition-colors ${
                      active
                        ? "text-[#3E6248]"
                        : "text-[#62685E] group-hover:text-[#202920]"
                    }`}
                  />
                  {isOpen && (
                    <span className="truncate tracking-[-0.01em]">
                      {item.label}
                    </span>
                  )}
                </div>

                {isOpen && (
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E4DCCB] text-[#3E6248] font-mono">
                        {item.badge}
                      </span>
                    )}
                    {item.hasChevron && (
                      <ChevronRight size={14} className="text-[#85877B] group-hover:text-[#202920] transition-colors" />
                    )}
                  </div>
                )}

                {/* Collapsed Indicator dot for active */}
                {!isOpen && active && (
                  <span className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-[#3E6248]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section (Settings, Help & Profile Card) */}
      <div className="p-2 border-t border-[#E4DCCB]/70 flex flex-col gap-1">
        {/* Help Center */}
        <Link
          href="/help"
          title={!isOpen ? "Help Center" : undefined}
          className={`flex items-center rounded-xl text-[13px] transition-all duration-200 text-[#62685E] hover:text-[#202920] hover:bg-[#F2EBDD] font-medium no-underline ${
            isOpen ? "px-3 py-2 gap-3" : "w-11 h-11 mx-auto justify-center"
          }`}
        >
          <HelpCircle size={18} className="shrink-0 text-[#85877B]" />
          {isOpen && <span className="truncate">Help & Support</span>}
        </Link>

        {/* Settings (Directly above profile like in photo) */}
        <Link
          href="/settings"
          title={!isOpen ? "Settings" : undefined}
          className={`flex items-center rounded-xl text-[13px] transition-all duration-200 text-[#62685E] hover:text-[#202920] hover:bg-[#F2EBDD] font-medium no-underline ${
            isActive("/settings")
              ? "bg-[#DCE6D7] text-[#202920] font-semibold"
              : ""
          } ${
            isOpen ? "px-3 py-2 gap-3" : "w-11 h-11 mx-auto justify-center"
          }`}
        >
          <Settings size={18} className="shrink-0 text-[#85877B]" />
          {isOpen && <span className="truncate">Settings</span>}
        </Link>

        {/* Divider above Profile */}
        <div className="h-[1px] bg-[#E4DCCB]/80 my-1 mx-1" />

        {/* Profile Avatar & Info Card */}
        <Link
          href="/profile"
          title={!isOpen ? displayName : undefined}
          className={`flex items-center rounded-xl transition-all duration-200 hover:bg-[#F2EBDD] group no-underline ${
            isOpen ? "p-2 gap-2.5 justify-between" : "w-11 h-11 mx-auto justify-center"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar Circle with /Profile.png */}
            <div className="w-8 h-8 rounded-full bg-[#DCE6D7] border border-[#66866A]/40 overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <img
                src="/Profile.png"
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerText = initials;
                }}
              />
            </div>

            {isOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[#202920] truncate leading-tight group-hover:text-[#3E6248] transition-colors">
                  {displayName}
                </span>
                <span className="text-[11px] text-[#85877B] truncate leading-tight mt-0.5 font-sans">
                  {displaySubtitle}
                </span>
              </div>
            )}
          </div>

          {isOpen && (
            <ChevronRight
              size={14}
              className="text-[#85877B] group-hover:text-[#202920] transition-colors shrink-0"
            />
          )}
        </Link>
      </div>
    </aside>
  );
}
