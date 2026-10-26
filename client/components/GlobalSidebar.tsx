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
  ShieldAlert,
  DollarSign,
  FileCheck,
  Network,
  Bot,
  KeyRound,
  Database,
  Building2,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import CambiumLogo from "@/components/CambiumLogo";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string;
  hasChevron?: boolean;
  i18nKey?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home, i18nKey: "nav.dashboard" },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Constellation Graph", href: "/graph", icon: Network, badge: "2D", i18nKey: "nav.graph" },
  { label: "Agentic Reader", href: "/agent-reader", icon: Bot, badge: "AI", i18nKey: "nav.agent_reader" },
  { label: "Workspace", href: "/workspace", icon: Layers },
  { label: "Community Feed", href: "/community", icon: Users },
  { label: "Intelligence", href: "/intelligence", icon: Brain },
  { label: "Personal OS", href: "/os", icon: LayoutGrid, i18nKey: "nav.os" },
  { label: "Opportunities", href: "/opportunities", icon: Sparkles, i18nKey: "nav.opportunities" },
  { label: "Grants & Awards", href: "/grants", icon: DollarSign, i18nKey: "nav.grants" },
  { label: "Peer Review Desk", href: "/peer-review", icon: FileCheck, i18nKey: "nav.peer_review" },
  { label: "IRB Compliance", href: "/compliance", icon: ShieldAlert, i18nKey: "nav.compliance" },
  { label: "FAIR Data Bridge", href: "/data-management", icon: Database, i18nKey: "nav.data_management" },
  { label: "Lab Workspace", href: "/lab", icon: Building2, i18nKey: "nav.lab" },
  { label: "Security & Audit", href: "/audit", icon: KeyRound, i18nKey: "nav.audit" },
  { label: "Publications", href: "/publications", icon: BookOpen, hasChevron: true, i18nKey: "nav.publications" },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Notifications", href: "/notifications", icon: Bell, badge: "3" },
];

export default function GlobalSidebar() {
  const pathname = usePathname() || "";
  const user = useAuthStore((state) => state.user);
  const { t } = useLanguage();

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
  const displaySubtitle = user?.role
    ? `${user.role} · ${user.institution || "Cambium Research"}`
    : user?.institution && !/maya|chen/i.test(user.institution)
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
      className={`relative h-[calc(100vh-20px)] my-2.5 ml-2.5 flex flex-col justify-between select-none z-30 flex-shrink-0 bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] rounded-[26px] shadow-[0_4px_24px_rgba(32,41,32,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? "w-[250px]" : "w-[68px]"
      }`}
      aria-label="Enterprise Scholarly Navigation"
    >
      {/* Top Fixed Header (Brand & Search) */}
      <div className="flex-shrink-0 flex flex-col">
        {/* Brand / Logo Row */}
        <div
          className={`h-16 flex items-center border-b border-[#E4DCCB]/70 dark:border-[#233327]/70 px-3.5 transition-all ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isOpen ? (
            <CambiumLogo size="sm" href="/dashboard" />
          ) : (
            <Link
              href="/dashboard"
              title="CAMBIUM RESEARCH Dashboard"
              style={{ width: 36, height: 36, minWidth: 36, minHeight: 36 }}
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-[#FAF7F0] dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] p-0.5 flex items-center justify-center shadow-xs transition-transform hover:scale-105 shrink-0 overflow-hidden"
            >
              <img
                src="/public_logo/cambium-logo-light.svg"
                alt="CAMBIUM RESEARCH"
                style={{ width: "100%", height: "100%", maxWidth: 30, maxHeight: 30 }}
                className="w-full h-full object-contain max-w-full max-h-full block dark:hidden scale-[1.3] transition-transform"
              />
              <img
                src="/public_logo/cambium-logo-dark.svg"
                alt="CAMBIUM RESEARCH"
                style={{ width: "100%", height: "100%", maxWidth: 30, maxHeight: 30 }}
                className="w-full h-full object-contain max-w-full max-h-full hidden dark:block scale-[1.3] transition-transform"
              />
            </Link>
          )}

          {/* Pin Toggle Button (Visible when open) */}
          {isOpen && (
            <button
              onClick={togglePin}
              title={isPinned ? "Unpin sidebar (collapse to strip)" : "Pin sidebar open"}
              className="p-1.5 rounded-lg text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#18231B] transition-colors border-0 bg-transparent cursor-pointer"
            >
              {isPinned ? (
                <Pin className="w-3.5 h-3.5 text-[#3E6248] dark:text-[#4ADE80] fill-[#3E6248] dark:fill-[#4ADE80]" />
              ) : (
                <PinOff className="w-3.5 h-3.5 text-[#85877B] dark:text-[#7E8B7B]" />
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
            className={`w-full flex items-center rounded-xl text-[13px] bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:border-[#3E6248]/40 dark:hover:border-[#4ADE80]/40 hover:bg-[#FAF7F0] dark:hover:bg-[#1F2E23] transition-all cursor-pointer shadow-2xs ${
              isOpen ? "px-3 py-2 justify-between" : "w-11 h-11 mx-auto justify-center"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Search size={16} className="text-[#3E6248] dark:text-[#4ADE80] shrink-0" />
              {isOpen && <span className="font-sans font-medium text-xs">Search Cambium...</span>}
            </div>
            {isOpen && (
              <kbd className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327] text-[#85877B] dark:text-[#7E8B7B]">
                ⌘K
              </kbd>
            )}
          </button>
        </div>
      </div>

      {/* Middle Scrollable Navigation List (flex-1 min-h-0) */}
      <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 space-y-1 no-scrollbar">
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
                  ? "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#202920] dark:text-[#EDEAE2] font-semibold shadow-xs"
                  : "text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#18231B] font-medium"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  size={19}
                  className={`shrink-0 transition-colors ${
                    active
                      ? "text-[#3E6248] dark:text-[#4ADE80]"
                      : "text-[#62685E] dark:text-[#A3B899] group-hover:text-[#202920] dark:group-hover:text-[#EDEAE2]"
                  }`}
                />
                {isOpen && (
                  <span className="truncate tracking-[-0.01em]">
                    {item.i18nKey ? t(item.i18nKey, item.label) : item.label}
                  </span>
                )}
              </div>

              {isOpen && (
                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E4DCCB] dark:bg-[#233327] text-[#3E6248] dark:text-[#4ADE80] font-mono">
                      {item.badge}
                    </span>
                  )}
                  {item.hasChevron && (
                    <ChevronRight size={14} className="text-[#85877B] dark:text-[#7E8B7B] group-hover:text-[#202920] dark:group-hover:text-[#EDEAE2] transition-colors" />
                  )}
                </div>
              )}

              {/* Collapsed Indicator dot for active */}
              {!isOpen && active && (
                <span className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-[#3E6248] dark:bg-[#4ADE80]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Fixed Section (Help, Settings, Language, Profile Avatar) */}
      <div className="flex-shrink-0 mt-auto p-2 border-t border-[#E4DCCB]/70 dark:border-[#233327]/70 flex flex-col gap-1">
        {/* Help Center */}
        <Link
          href="/help"
          title={!isOpen ? "Help Center" : undefined}
          className={`flex items-center rounded-xl text-[13px] transition-all duration-200 text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#18231B] font-medium no-underline ${
            isOpen ? "px-3 py-2 gap-3" : "w-11 h-11 mx-auto justify-center"
          }`}
        >
          <HelpCircle size={18} className="shrink-0 text-[#85877B] dark:text-[#7E8B7B]" />
          {isOpen && <span className="truncate">{t("nav.help", "Help & Support")}</span>}
        </Link>

        {/* Settings (Directly above profile like in photo) */}
        <Link
          href="/settings"
          title={!isOpen ? "Settings" : undefined}
          className={`flex items-center rounded-xl text-[13px] transition-all duration-200 text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#F2EBDD] dark:hover:bg-[#18231B] font-medium no-underline ${
            isActive("/settings")
              ? "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#202920] dark:text-[#EDEAE2] font-semibold"
              : ""
          } ${
            isOpen ? "px-3 py-2 gap-3" : "w-11 h-11 mx-auto justify-center"
          }`}
        >
          <Settings size={18} className="shrink-0 text-[#85877B] dark:text-[#7E8B7B]" />
          {isOpen && <span className="truncate">{t("nav.settings", "Settings")}</span>}
        </Link>

        {/* Scholarly Language Selector */}
        <div className={`transition-all ${isOpen ? "px-1.5 py-0.5" : "w-11 h-11 mx-auto flex items-center justify-center my-0.5"}`}>
          <LanguageSelector compact={!isOpen} dropdownAlign={!isOpen ? "flyout-right" : "auto"} />
        </div>

        {/* Divider above Profile */}
        <div className="h-[1px] bg-[#E4DCCB]/80 dark:bg-[#233327]/80 my-1 mx-1" />

        {/* Profile Avatar & Info Card */}
        <Link
          href="/profile"
          title={!isOpen ? displayName : undefined}
          className={`flex items-center rounded-xl transition-all duration-200 hover:bg-[#F2EBDD] dark:hover:bg-[#18231B] group no-underline ${
            isOpen ? "p-2 gap-2.5 justify-between" : "w-11 h-11 mx-auto justify-center"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar Circle with /Profile.png */}
            <div
              style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, maxWidth: 32, maxHeight: 32 }}
              className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-[#DCE6D7] dark:bg-[#1A281E] border border-[#66866A]/40 dark:border-[#4ADE80]/40 overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs"
            >
              <img
                src="/Profile.png"
                alt={displayName}
                style={{ width: 32, height: 32, maxWidth: 32, maxHeight: 32, borderRadius: "50%", objectFit: "cover" }}
                className="w-full h-full object-cover max-w-full max-h-full block"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerText = initials;
                }}
              />
            </div>

            {isOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[#202920] dark:text-[#EDEAE2] truncate leading-tight group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors">
                  {displayName}
                </span>
                <span className="text-[11px] text-[#85877B] dark:text-[#7E8B7B] truncate leading-tight mt-0.5 font-sans">
                  {displaySubtitle}
                </span>
              </div>
            )}
          </div>

          {isOpen && (
            <ChevronRight
              size={14}
              className="text-[#85877B] dark:text-[#7E8B7B] group-hover:text-[#202920] dark:group-hover:text-[#EDEAE2] transition-colors shrink-0"
            />
          )}
        </Link>
      </div>
    </aside>
  );
}
