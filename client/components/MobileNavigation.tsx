"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Bell,
  Home,
  Compass,
  Sparkles,
  Bot,
  Layers,
  LogOut,
  Settings,
  User,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import CambiumLogo from "@/components/CambiumLogo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { NAV_ITEMS, type NavItem } from "@/components/GlobalSidebar";

export default function MobileNavigation() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { t } = useLanguage();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = (href: string) => {
    if (pathname === href || pathname === `/app${href}`) return true;
    if (pathname.startsWith(href + "/") || pathname.startsWith(`/app${href}/`)) return true;
    return false;
  };

  const handleOpenSearch = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    router.push("/sign-in");
  };

  const rawName = user?.fullName || user?.name || user?.username || "Scholar";
  const displayName = rawName.replace(/\s*\([^)]*\)/g, "").trim() || "Scholar";
  const displaySubtitle = user?.role
    ? `${user.role} · ${user.institution || "Cambium"}`
    : user?.institution || user?.email || "Verified Scholar";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SC";

  return (
    <>
      {/* ── Mobile Top Header (Fixed top, md:hidden) ─────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 w-full h-14 bg-[#FAF7F0]/95 dark:bg-[#0E140F]/95 backdrop-blur-md border-b border-[#E4DCCB] dark:border-[#233327] px-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <CambiumLogo size="sm" href="/dashboard" />
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Search */}
          <button
            type="button"
            onClick={handleOpenSearch}
            aria-label="Search Cambium"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#E4DCCB]/40 dark:hover:bg-[#233327]/50 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <Search size={18} />
          </button>

          {/* Notifications Shortcut */}
          <Link
            href="/notifications"
            aria-label="View notifications"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#E4DCCB]/40 dark:hover:bg-[#233327]/50 transition-colors no-underline relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#3E6248] dark:bg-[#4ADE80]" />
          </Link>

          {/* Theme Switcher */}
          <div className="flex items-center">
            <ThemeToggle variant="minimal" />
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[#202920] dark:text-[#EDEAE2] hover:bg-[#E4DCCB]/40 dark:hover:bg-[#233327]/50 transition-colors border-0 bg-transparent cursor-pointer ml-1"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ── Slide-over Mobile Navigation Drawer ─────────────────────────── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-[#0E140F]/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer Content */}
          <div className="relative w-[86vw] max-w-[340px] h-full bg-[#FAF7F0] dark:bg-[#131C15] border-r border-[#E4DCCB] dark:border-[#233327] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250 ease-out">
            {/* Drawer Header */}
            <div className="h-16 px-4 border-b border-[#E4DCCB] dark:border-[#233327] flex items-center justify-between">
              <CambiumLogo size="sm" href="/dashboard" />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#85877B] dark:text-[#7E8B7B] hover:text-[#202920] dark:hover:text-[#EDEAE2] hover:bg-[#E4DCCB]/50 dark:hover:bg-[#233327]/50 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scholar Identity Card */}
            <div className="p-4 border-b border-[#E4DCCB] dark:border-[#233327] bg-[#F2EBDD]/40 dark:bg-[#18231B]/40">
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 no-underline group"
              >
                <div className="w-10 h-10 rounded-full bg-[#3E6248] dark:bg-[#4ADE80] text-[#FAF7F0] dark:text-[#0E140F] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#202920] dark:text-[#EDEAE2] truncate group-hover:text-[#3E6248] dark:group-hover:text-[#4ADE80] transition-colors">
                    {displayName}
                  </div>
                  <div className="text-xs text-[#62685E] dark:text-[#A3B899] truncate font-mono">
                    {displaySubtitle}
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#85877B] dark:text-[#7E8B7B] shrink-0" />
              </Link>
            </div>

            {/* Quick Command Trigger in Drawer */}
            <div className="px-4 py-2.5 border-b border-[#E4DCCB]/60 dark:border-[#233327]/60">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  handleOpenSearch();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#18231B] border border-[#E4DCCB] dark:border-[#233327] text-[#62685E] dark:text-[#A3B899] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-[#3E6248] dark:text-[#4ADE80]" />
                  <span>Search all routes (⌘K)</span>
                </div>
                <kbd className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAF7F0] dark:bg-[#131C15] border border-[#E4DCCB] dark:border-[#233327]">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Scrollable Navigation Items */}
            <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] transition-colors no-underline min-h-[44px] ${
                      active
                        ? "bg-[#DCE6D7] dark:bg-[#1F2E23] text-[#202920] dark:text-[#EDEAE2] font-semibold"
                        : "text-[#62685E] dark:text-[#A3B899] hover:bg-[#F2EBDD] dark:hover:bg-[#18231B] hover:text-[#202920] dark:hover:text-[#EDEAE2] font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        size={19}
                        className={`shrink-0 ${
                          active
                            ? "text-[#3E6248] dark:text-[#4ADE80]"
                            : "text-[#62685E] dark:text-[#A3B899]"
                        }`}
                      />
                      <span className="truncate">
                        {item.i18nKey ? t(item.i18nKey, item.label) : item.label}
                      </span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          active
                            ? "bg-[#3E6248] dark:bg-[#4ADE80] text-white dark:text-[#0E140F]"
                            : "bg-[#E4DCCB] dark:bg-[#233327] text-[#62685E] dark:text-[#A3B899]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E4DCCB] dark:border-[#233327] bg-[#F2EBDD]/40 dark:bg-[#18231B]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#85877B] dark:text-[#7E8B7B] uppercase">
                  Language
                </span>
                <LanguageSelector />
              </div>

              <div className="pt-2 border-t border-[#E4DCCB]/60 dark:border-[#233327]/60 flex items-center justify-between">
                <Link
                  href="/settings"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2 text-xs text-[#62685E] dark:text-[#A3B899] hover:text-[#202920] dark:hover:text-[#EDEAE2] no-underline font-medium"
                >
                  <Settings size={14} />
                  <span>Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-[#B33D35] dark:text-[#F87171] hover:underline bg-transparent border-0 cursor-pointer p-0 font-medium"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Navigation Dock (Fixed bottom, md:hidden) ─────── */}
      <nav
        aria-label="Mobile quick actions"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#FAF7F0]/95 dark:bg-[#131C15]/95 backdrop-blur-md border-t border-[#E4DCCB] dark:border-[#233327] flex items-center justify-around px-2"
      >
        {[
          { label: "Dashboard", href: "/dashboard", icon: Home },
          { label: "Discover", href: "/discover", icon: Compass },
          { label: "Opportunities", href: "/opportunities", icon: Sparkles },
          { label: "Reader", href: "/agent-reader", icon: Bot },
          { label: "Workspace", href: "/workspace", icon: Layers },
        ].map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] no-underline transition-colors ${
                active
                  ? "text-[#3E6248] dark:text-[#4ADE80]"
                  : "text-[#85877B] dark:text-[#7E8B7B] hover:text-[#202920] dark:hover:text-[#EDEAE2]"
              }`}
            >
              <Icon size={18} className={active ? "scale-110 transition-transform" : ""} />
              <span className="text-[10px] font-sans font-medium mt-0.5 tracking-tight truncate max-w-[64px]">
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* Menu button to open full drawer */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] text-[#85877B] dark:text-[#7E8B7B] hover:text-[#202920] dark:hover:text-[#EDEAE2] bg-transparent border-0 cursor-pointer"
        >
          <Menu size={18} />
          <span className="text-[10px] font-sans font-medium mt-0.5 tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
}
