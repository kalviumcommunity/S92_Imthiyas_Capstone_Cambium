"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CambiumLogo from "@/components/CambiumLogo";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <CambiumLogo size="md" href="/" />

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`font-sans text-[14px] font-[450] tracking-[-0.01em] transition-colors duration-200 relative py-1 no-underline ${
                  isActive
                    ? "text-[#202920] font-semibold after:absolute after:bottom-[-24px] after:left-0 after:w-full after:h-[2px] after:bg-[#3E6248]"
                    : "text-[#62685E] hover:text-[#202920]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Action Threshold */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/sign-in"
            className="font-sans text-[14px] font-medium text-[#62685E] hover:text-[#202920] transition-colors no-underline"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] px-5 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wide uppercase shadow-sm shadow-[#3E6248]/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-1.5 text-center no-underline border border-[#66866A]/30"
          >
            <span>Enter Workspace</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#202920] bg-transparent border-0 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E4DCCB] bg-[#FAF7F0] px-6 py-5 flex flex-col gap-4">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-sans text-base py-1 no-underline ${
                  isActive ? "text-[#3E6248] font-bold" : "text-[#202920]"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[#E4DCCB] flex flex-col gap-3">
            <Link
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="font-sans text-sm text-[#62685E] py-1 no-underline"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#3E6248] text-[#FAF7F0] px-5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase text-center no-underline"
            >
              Enter Workspace →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
