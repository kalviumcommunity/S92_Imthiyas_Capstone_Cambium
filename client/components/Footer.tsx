import React from "react";
import Link from "next/link";

export default function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Discovery Engine", href: "/opportunities" },
        { label: "Editorial Workspace", href: "/auth" },
        { label: "Academic Identity", href: "/auth" },
        { label: "Knowledge Topology", href: "/opportunities" },
        { label: "OpenAPI Swagger", href: "http://localhost:5000/api/docs" },
      ],
    },
    {
      title: "Research",
      links: [
        { label: "Grants & Fellowships", href: "/opportunities?type=grant" },
        { label: "Conference CFPs", href: "/opportunities?type=cfp" },
        { label: "High-Impact Journals", href: "/opportunities" },
        { label: "Preprint Index", href: "/opportunities" },
        { label: "Methodology Benchmarks", href: "/opportunities" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Cambium", href: "/" },
        { label: "Editorial Principles", href: "/" },
        { label: "Research Advisory Board", href: "/" },
        { label: "Academic Partnerships", href: "/" },
        { label: "Careers in Science AI", href: "/" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "PostgreSQL 3NF Schema", href: "http://localhost:5000/api/docs" },
        { label: "pgvector Indexing Docs", href: "http://localhost:5000/api/docs" },
        { label: "Citation Formats", href: "/" },
        { label: "Institutional Security", href: "/" },
        { label: "Developer Support", href: "mailto:support@cambium.research" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand Info (2 Columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Cambium Logo"
                className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
              />
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                CAMBIUM
              </span>
            </Link>

            <p className="text-xs text-ink-muted leading-relaxed max-w-sm">
              The research operating system unifying literature discovery,
              academic identity, collaborative manuscripts, and global funding
              calls onto an authoritative relational foundation.
            </p>

            <div className="pt-2 text-[11px] text-ink-muted">
              <span>Author: </span>
              <span className="font-semibold text-foreground">Shaik Mohamed Imthiyas T</span>
              <span className="block text-primary font-medium">Kalvium Community Capstone</span>
            </div>
          </div>

          {/* 4 Navigation Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-ink-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>© 2026 Cambium Research Systems. Engineered for rigorous academic inquiry.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Terms of Inquiry
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Ethical AI Charter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
