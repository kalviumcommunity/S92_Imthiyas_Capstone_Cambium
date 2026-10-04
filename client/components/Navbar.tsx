"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CambiumLogo from "@/components/CambiumLogo";
import {
  Compass,
  Bookmark,
  LogOut,
  PlusCircle,
  LogIn,
  ExternalLink,
  BookOpen,
  Users,
} from "lucide-react";

interface NavbarProps {
  onOpenCreate?: () => void;
}

export default function Navbar({ onOpenCreate }: NavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { name: "Discover", href: "/discover" },
    { name: "Workspace", href: "/workspace" },
    { name: "Research", href: "/publications" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Portfolio", href: "/portfolio" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-raised/90 backdrop-blur-md border-b border-edge-default transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Official Logo */}
        <CambiumLogo size="md" badge="OS" href="/" />

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary font-semibold bg-accent/50"
                    : "text-ink-muted hover:text-foreground hover:bg-accent/30"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {onOpenCreate && isAuthenticated && (
            <Button
              onClick={onOpenCreate}
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs h-9"
            >
              <PlusCircle className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Post Opportunity</span>
            </Button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card hover:bg-accent/40 text-xs text-foreground transition-colors"
              >
                <Avatar className="w-6 h-6 border border-border overflow-hidden">
                  <img src="/Profile.png" alt="User Profile" className="w-full h-full object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {user?.fullName ? user.fullName[0].toUpperCase() : "R"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium truncate max-w-[100px]">
                  {(user?.fullName && !/maya|chen/i.test(user.fullName)) ? user.fullName : "Imthiyas"}
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={logout}
                title="Sign Out"
                className="text-ink-muted hover:text-error"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-xs h-9 font-medium">
                <Link href="/sign-in">Sign in</Link>
              </Button>

              <Button asChild size="sm" className="text-xs h-9 font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/sign-up">Create your research identity</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
