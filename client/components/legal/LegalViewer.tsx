"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CambiumLogo from "@/components/CambiumLogo";
import { LegalWatermarks, LegalTabType } from "./LegalWatermarks";
import { TermsContent } from "./TermsContent";
import { PrivacyContent } from "./PrivacyContent";
import { DisclaimerContent } from "./DisclaimerContent";
import {
  FileText,
  Shield,
  Sparkles,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Search,
  ExternalLink,
} from "lucide-react";

interface SectionMeta {
  id: string;
  label: string;
}

const TERMS_SECTIONS: SectionMeta[] = [
  { id: "who-operates", label: "1. Who operates Cambium" },
  { id: "eligibility-accounts", label: "2. Eligibility and accounts" },
  { id: "what-cambium-provides", label: "3. What Cambium provides" },
  { id: "third-party-sources", label: "4. Research info & third-party sources" },
  { id: "ai-assisted-features", label: "5. AI-assisted features" },
  { id: "research-decisions", label: "6. Research decisions & verification" },
  { id: "acceptable-use", label: "7. Acceptable use" },
  { id: "user-content", label: "8. User content & research materials" },
  { id: "intellectual-property", label: "9. Intellectual property" },
  { id: "third-party-services", label: "10. Third-party services and links" },
  { id: "privacy", label: "11. Privacy" },
  { id: "service-availability", label: "12. Service availability and changes" },
  { id: "subscriptions-payments", label: "13. Free features & payments" },
  { id: "suspension-termination", label: "14. Suspension and termination" },
  { id: "disclaimers", label: "15. Disclaimers" },
  { id: "limitation-liability", label: "16. Limitation of liability" },
  { id: "indemnification", label: "17. Indemnification" },
  { id: "changes-to-terms", label: "18. Changes to these Terms" },
  { id: "governing-law", label: "19. Governing law and disputes" },
  { id: "general-provisions", label: "20. General provisions" },
  { id: "contact", label: "21. Contact" },
];

const PRIVACY_SECTIONS: SectionMeta[] = [
  { id: "privacy-responsible", label: "1. Who is responsible for your data" },
  { id: "privacy-scope", label: "2. Scope of this Policy" },
  { id: "privacy-collection", label: "3. Information we may collect" },
  { id: "privacy-usage", label: "4. How we use information" },
  { id: "privacy-legal-grounds", label: "5. Legal grounds for processing" },
  { id: "privacy-ai-processing", label: "6. How AI processing works" },
  { id: "privacy-cookies", label: "7. Cookies & similar technologies" },
  { id: "privacy-sharing", label: "8. When we share information" },
  { id: "privacy-transfers", label: "9. International data transfers" },
  { id: "privacy-retention", label: "10. Data retention" },
  { id: "privacy-rights", label: "11. Your privacy rights" },
  { id: "privacy-account-access", label: "12. Account access & deletion" },
  { id: "privacy-security", label: "13. Security" },
  { id: "privacy-children", label: "14. Children's privacy" },
  { id: "privacy-third-party", label: "15. Third-party links & services" },
  { id: "privacy-automated", label: "16. Automated recommendations" },
  { id: "privacy-changes", label: "17. Changes to this Policy" },
  { id: "privacy-contact", label: "18. Contact and complaints" },
];

const DISCLAIMER_SECTIONS: SectionMeta[] = [
  { id: "disclaimer-discovery", label: "1. Research discovery, not a guarantee" },
  { id: "disclaimer-verify", label: "2. Verify info with original source" },
  { id: "disclaimer-ai-outputs", label: "3. AI-generated & assisted outputs" },
  { id: "disclaimer-endorsements", label: "4. Recommendations not endorsements" },
  { id: "disclaimer-no-guarantee", label: "5. No guarantee of outcomes" },
  { id: "disclaimer-no-advice", label: "6. No professional or institutional advice" },
  { id: "disclaimer-third-party", label: "7. Third-party info & IP" },
  { id: "disclaimer-availability", label: "8. Availability and changes" },
  { id: "disclaimer-report", label: "9. Report an issue" },
  { id: "disclaimer-limitation", label: "10. Limitation & applicable law" },
];

interface LegalViewerProps {
  initialTab?: LegalTabType;
}

export function LegalViewer({ initialTab = "terms" }: LegalViewerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sections =
    activeTab === "terms"
      ? TERMS_SECTIONS
      : activeTab === "privacy"
      ? PRIVACY_SECTIONS
      : DISCLAIMER_SECTIONS;

  const filteredSections = sections.filter((s) =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (tab: LegalTabType) => {
    setActiveTab(tab);
    setActiveSectionId("");
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Sync route URL
    const targetUrl =
      tab === "terms" ? "/terms" : tab === "privacy" ? "/privacy" : "/disclaimer";
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", targetUrl);
    }
  };

  // Scrollspy observer for active section in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(sections[i].id);
          return;
        }
      }
      if (sections.length > 0 && window.scrollY < 200) {
        setActiveSectionId(sections[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab, sections]);

  return (
    <div className="relative min-h-screen bg-[#FAF7F0] text-[#202920] selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      {/* ─── Ultra-low Opacity Background Watermark Icons (blended seamlessly into parchment) ─── */}
      <LegalWatermarks tab={activeTab} />

      {/* ─── Top Global Navigation Bar ─── */}
      <header className="sticky top-0 z-40 bg-[#FAF7F0]/90 backdrop-blur-md border-b border-[#E4DCCB] px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <CambiumLogo size="sm" showWordmark={true} href="/dashboard" />
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#E4DCCB]">
            <span className="w-2 h-2 rounded-full bg-[#3E6248] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#62685E] font-medium">
              Governance, Terms & Compliance
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#202920] hover:text-[#3E6248] bg-white hover:bg-[#F2EBDD] border border-[#E4DCCB] px-4 py-2 rounded-full transition-all shadow-2xs no-underline cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back to Workspace</span>
          </Link>
        </div>
      </header>

      {/* ─── Tabs Switcher Bar (Terms FIRST, Privacy, AI Disclaimer) ─── */}
      <div className="sticky top-16 z-30 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E4DCCB] shadow-2xs">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 flex items-center overflow-x-auto no-scrollbar gap-2 sm:gap-4 py-1.5">
          {/* Tab 1: Terms of Service (FIRST) */}
          <button
            onClick={() => handleTabChange("terms")}
            className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-sans font-medium transition-all rounded-xl cursor-pointer border ${
              activeTab === "terms"
                ? "bg-white text-[#202920] font-semibold border-[#E4DCCB] shadow-sm ring-1 ring-[#3E6248]/20"
                : "bg-transparent text-[#62685E] hover:text-[#202920] hover:bg-white/50 border-transparent"
            }`}
          >
            <FileText
              size={16}
              className={activeTab === "terms" ? "text-[#3E6248]" : "text-[#85877B]"}
            />
            <span>Terms of Service</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E]">
              21 Sec
            </span>
          </button>

          {/* Tab 2: Privacy Policy */}
          <button
            onClick={() => handleTabChange("privacy")}
            className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-sans font-medium transition-all rounded-xl cursor-pointer border ${
              activeTab === "privacy"
                ? "bg-white text-[#202920] font-semibold border-[#E4DCCB] shadow-sm ring-1 ring-[#3E6248]/20"
                : "bg-transparent text-[#62685E] hover:text-[#202920] hover:bg-white/50 border-transparent"
            }`}
          >
            <Shield
              size={16}
              className={activeTab === "privacy" ? "text-[#3E6248]" : "text-[#85877B]"}
            />
            <span>Privacy Policy</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E]">
              18 Sec
            </span>
          </button>

          {/* Tab 3: AI & Research Information Disclaimer */}
          <button
            onClick={() => handleTabChange("disclaimer")}
            className={`flex items-center gap-2.5 px-5 py-3 text-xs sm:text-sm font-sans font-medium transition-all rounded-xl cursor-pointer border ${
              activeTab === "disclaimer"
                ? "bg-white text-[#202920] font-semibold border-[#E4DCCB] shadow-sm ring-1 ring-[#3E6248]/20"
                : "bg-transparent text-[#62685E] hover:text-[#202920] hover:bg-white/50 border-transparent"
            }`}
          >
            <Sparkles
              size={16}
              className={activeTab === "disclaimer" ? "text-[#3E6248]" : "text-[#85877B]"}
            />
            <span>AI & Research Information Disclaimer</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E]">
              10 Sec
            </span>
          </button>
        </div>
      </div>

      {/* ─── Main Content Container (Stretched wider layout for optimal editorial reading) ─── */}
      <div className="relative z-10 max-w-[1360px] mx-auto px-6 sm:px-10 py-10 sm:py-14">
        <div className="flex gap-12 lg:gap-16">
          {/* ─── Sticky Sidebar: Table of Contents & Quick Section Jump ─── */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-36 bg-white/70 backdrop-blur-xs border border-[#E4DCCB] rounded-2xl p-5 shadow-2xs max-h-[calc(100vh-170px)] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCB] mb-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E6248]">
                  Table of Contents
                </span>
                <span className="text-[10px] font-mono text-[#85877B]">
                  {sections.length} sections
                </span>
              </div>

              {/* Quick filter input */}
              <div className="relative mb-3">
                <Search size={13} className="absolute left-3 top-2.5 text-[#85877B]" />
                <input
                  type="text"
                  placeholder="Filter sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F0] border border-[#E4DCCB] rounded-lg text-[#202920] placeholder-[#85877B] focus:outline-none focus:ring-1 focus:ring-[#3E6248]"
                />
              </div>

              {/* Section links */}
              <nav className="overflow-y-auto pr-1 space-y-1 flex-1 font-sans text-xs">
                {filteredSections.map((sec) => {
                  const isActive = activeSectionId === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`block py-1.5 px-2.5 rounded-lg transition-all no-underline text-left ${
                        isActive
                          ? "bg-[#DCE6D7]/60 text-[#3E6248] font-semibold border-l-2 border-l-[#3E6248]"
                          : "text-[#62685E] hover:text-[#202920] hover:bg-[#FAF7F0]"
                      }`}
                    >
                      {sec.label}
                    </a>
                  );
                })}
              </nav>

              {/* Bottom quick citation box */}
              <div className="pt-3 border-t border-[#E4DCCB] mt-3">
                <div className="text-[10px] font-mono text-[#85877B] flex items-center justify-between">
                  <span>Cambium Legal Vault</span>
                  <span className="text-[#3E6248] font-semibold">2026.1</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── Main Content Document Body (Stretched wider to max-w-[960px]) ─── */}
          <main className="flex-1 min-w-0 max-w-[960px]">
            {/* Document Header Card */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E4DCCB] shadow-2xs mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="font-mono text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-[#DCE6D7] text-[#3E6248] border border-[#66866A]/30">
                  {activeTab === "terms"
                    ? "Contractual Framework"
                    : activeTab === "privacy"
                    ? "Data Protection & Privacy"
                    : "Intelligence Transparency & Risk"}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-[#85877B] px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E4DCCB]">
                  <Calendar size={12} />
                  <span>Effective: DD Month YYYY</span>
                </span>
                <span className="font-mono text-xs text-[#85877B] px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E4DCCB]">
                  Last updated: DD Month YYYY
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#202920] tracking-tight leading-tight m-0 mb-4">
                {activeTab === "terms" && "Terms of Service"}
                {activeTab === "privacy" && "Privacy Policy"}
                {activeTab === "disclaimer" && "AI & Research Information Disclaimer"}
              </h1>

              <p className="font-serif text-base sm:text-lg text-[#62685E] leading-relaxed m-0">
                {activeTab === "terms" &&
                  "These Terms govern your access to and use of Cambium, an AI-powered Research Opportunity Discovery and Intelligence Platform."}
                {activeTab === "privacy" &&
                  "This Privacy Policy explains how Cambium processes personal data when you visit our website, create an account, use research discovery features, or contact us."}
                {activeTab === "disclaimer" &&
                  "This Disclaimer supplements the Cambium Terms of Service and outlines the operational limitations of research data, third-party opportunities, and AI-assisted outputs."}
              </p>
            </div>

            {/* Document Full Text Content */}
            <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E4DCCB] shadow-sm">
              {activeTab === "terms" && <TermsContent />}
              {activeTab === "privacy" && <PrivacyContent />}
              {activeTab === "disclaimer" && <DisclaimerContent />}
            </div>

            {/* Bottom Navigation Pager */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E4DCCB]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#85877B]">Explore Related Policies:</span>
              </div>
              <div className="flex items-center gap-3">
                {activeTab !== "terms" && (
                  <button
                    onClick={() => handleTabChange("terms")}
                    className="text-xs font-mono uppercase tracking-wider text-[#3E6248] hover:text-[#202920] bg-white border border-[#E4DCCB] px-4 py-2 rounded-full cursor-pointer hover:bg-[#FAF7F0] transition-colors"
                  >
                    ← Terms of Service
                  </button>
                )}
                {activeTab !== "privacy" && (
                  <button
                    onClick={() => handleTabChange("privacy")}
                    className="text-xs font-mono uppercase tracking-wider text-[#3E6248] hover:text-[#202920] bg-white border border-[#E4DCCB] px-4 py-2 rounded-full cursor-pointer hover:bg-[#FAF7F0] transition-colors"
                  >
                    Privacy Policy
                  </button>
                )}
                {activeTab !== "disclaimer" && (
                  <button
                    onClick={() => handleTabChange("disclaimer")}
                    className="text-xs font-mono uppercase tracking-wider text-[#3E6248] hover:text-[#202920] bg-white border border-[#E4DCCB] px-4 py-2 rounded-full cursor-pointer hover:bg-[#FAF7F0] transition-colors"
                  >
                    AI Disclaimer →
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
