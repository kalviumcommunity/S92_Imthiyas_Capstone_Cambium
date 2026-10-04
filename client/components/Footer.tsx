"use client";

import React from "react";
import Link from "next/link";
import CambiumLogo from "@/components/CambiumLogo";

export default function Footer() {
  const cols = [
    {
      heading: "Product",
      links: [
        { label: "Discover", href: "/discover" },
        { label: "Research", href: "/publications" },
        { label: "Opportunities", href: "/opportunities" },
        { label: "Workspace", href: "/workspace" },
        { label: "Portfolio", href: "/portfolio" },
      ],
    },
    {
      heading: "Research",
      links: [
        { label: "Papers", href: "/publications" },
        { label: "Journals", href: "/publications" },
        { label: "Conferences", href: "/discover" },
        { label: "Grants", href: "/opportunities" },
        { label: "Collaborations", href: "/discover" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Documentation", href: "/help" },
        { label: "Research Guide", href: "/help" },
        { label: "Help Center", href: "/help" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#FAF7F0] border-t border-[#E4DCCB] px-6 sm:px-12 lg:px-20 pt-16 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-14">
          {/* Brand */}
          <div className="space-y-3">
            <CambiumLogo size="md" href="/" />
            <p className="font-sans text-xs text-[#62685E] leading-relaxed max-w-[220px]">
              The Research Operating System.
            </p>
          </div>

          {/* Link columns */}
          {cols.map(({ heading, links }) => (
            <div key={heading} className="space-y-4">
              <div className="font-mono text-xs font-bold tracking-[0.08em] text-[#3E6248] uppercase">
                {heading}
              </div>
              <div className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-sans text-xs text-[#62685E] hover:text-[#3E6248] transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-[#E4DCCB] flex-wrap gap-4">
          <span className="font-mono text-xs text-[#85877B]">
            © 2026 Cambium Research. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: "Terms of Service", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "AI Disclaimer", href: "/disclaimer" },
              { label: "Security & Help", href: "/help" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-xs text-[#62685E] hover:text-[#3E6248] transition-colors no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
