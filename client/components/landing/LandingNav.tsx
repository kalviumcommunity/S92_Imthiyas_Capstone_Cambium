"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import CambiumLogo from "@/components/CambiumLogo";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-20 h-16 flex items-center gap-10">
        {/* Official Logo */}
        <CambiumLogo size="md" href="/" />

        {/* Nav links */}
        <nav className="hidden md:flex gap-8 ml-4">
          {["Discover", "Research", "Opportunities", "Community"].map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-tight"
            >
              {link}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-tight"
          >
            Sign in
          </Link>
          <Button asChild variant="primary">
            <Link href="/sign-up">Create your research identity</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-1 text-foreground"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Dropdown (simplified) */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 shadow-elevation2">
          {["Discover", "Research", "Opportunities", "Community"].map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          <Link
            href="/sign-in"
            className="text-sm font-medium text-foreground"
            onClick={() => setMenuOpen(false)}
          >
            Sign in
          </Link>
          <Button asChild variant="primary" className="w-full">
            <Link href="/sign-up">Create your research identity</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
