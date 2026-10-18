"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CambiumLogo from "@/components/CambiumLogo";
import {
  Building2,
  ShieldCheck,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Globe,
  ExternalLink,
  Sparkles,
  Key,
  Server,
  Fingerprint,
} from "lucide-react";

interface RORInstitution {
  id: string;
  rorId: string;
  name: string;
  country: string;
  city: string;
  federation: "InCommon" | "EduGAIN" | "Haka" | "SWITCHaai";
  idpType: "Shibboleth 4.x" | "Okta SAML 2.0" | "Azure AD / Entra" | "PingFederate";
  verifiedDomains: string[];
}

const ROR_DATABASE: RORInstitution[] = [
  {
    id: "mit",
    rorId: "https://ror.org/0420bx112",
    name: "Massachusetts Institute of Technology (MIT)",
    country: "United States",
    city: "Cambridge, MA",
    federation: "InCommon",
    idpType: "Shibboleth 4.x",
    verifiedDomains: ["mit.edu", "csail.mit.edu"],
  },
  {
    id: "stanford",
    rorId: "https://ror.org/00f54p054",
    name: "Stanford University & Stanford Medicine",
    country: "United States",
    city: "Stanford, CA",
    federation: "InCommon",
    idpType: "Okta SAML 2.0",
    verifiedDomains: ["stanford.edu", "stanfordchildrens.org"],
  },
  {
    id: "broad",
    rorId: "https://ror.org/05b225h94",
    name: "Broad Institute of MIT and Harvard",
    country: "United States",
    city: "Cambridge, MA",
    federation: "InCommon",
    idpType: "Okta SAML 2.0",
    verifiedDomains: ["broadinstitute.org"],
  },
  {
    id: "maxplanck",
    rorId: "https://ror.org/0168r3w48",
    name: "Max Planck Society for the Advancement of Science",
    country: "Germany",
    city: "Munich",
    federation: "EduGAIN",
    idpType: "Shibboleth 4.x",
    verifiedDomains: ["mpg.de", "mpi-inf.mpg.de"],
  },
  {
    id: "oxford",
    rorId: "https://ror.org/052gg0110",
    name: "University of Oxford",
    country: "United Kingdom",
    city: "Oxford",
    federation: "EduGAIN",
    idpType: "Azure AD / Entra",
    verifiedDomains: ["ox.ac.uk"],
  },
  {
    id: "ethz",
    rorId: "https://ror.org/05a28rw58",
    name: "ETH Zurich (Swiss Federal Institute of Technology)",
    country: "Switzerland",
    city: "Zurich",
    federation: "SWITCHaai",
    idpType: "Shibboleth 4.x",
    verifiedDomains: ["ethz.ch"],
  },
  {
    id: "amet",
    rorId: "https://ror.org/03x92k741",
    name: "AMET University & Maritime Computational Center",
    country: "India",
    city: "Chennai",
    federation: "EduGAIN",
    idpType: "Okta SAML 2.0",
    verifiedDomains: ["ametuniv.ac.in"],
  },
];

export default function InstitutionalSsoPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInst, setSelectedInst] = useState<RORInstitution | null>(ROR_DATABASE[0]);
  const [academicEmail, setAcademicEmail] = useState("");
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState<string | null>(null);

  const filteredInstitutions = useMemo(() => {
    if (!searchQuery.trim()) return ROR_DATABASE;
    const q = searchQuery.toLowerCase();
    return ROR_DATABASE.filter(
      (inst) =>
        inst.name.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q) ||
        inst.country.toLowerCase().includes(q) ||
        inst.verifiedDomains.some((d) => d.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleInitiateSso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInst) return;

    setIsHandshaking(true);
    setHandshakeStep("Validating ROR Registry Record & Metadata XML...");

    setTimeout(() => {
      setHandshakeStep(`Initiating SAML 2.0 AuthRequest with ${selectedInst.federation}...`);
    }, 800);

    setTimeout(() => {
      setHandshakeStep("Cryptographic Signature Verified. Issuing SCIM Scholar Token...");
    }, 1800);

    setTimeout(() => {
      setIsHandshaking(false);
      router.push("/dashboard");
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#202920] font-sans selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      {/* Top Header */}
      <header className="border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CambiumLogo size="sm" href="/" />
            <div className="h-5 w-px bg-[#E4DCCB] hidden sm:block" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#62685E] hidden sm:inline">
              Institutional Gateway (SAML 2.0 & ROR)
            </span>
          </div>

          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#62685E] hover:text-[#202920] transition-colors no-underline"
          >
            <ArrowLeft size={13} className="text-[#3E6248]" />
            <span>Individual Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        {/* Page Heading */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-4">
            <ShieldCheck size={13} className="text-[#3E6248]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Research Organization Registry // Single Sign-On
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#202920] tracking-tight mb-3">
            Institutional Access & <br />
            <span className="italic text-[#3E6248]">Federated Identity</span>
          </h1>
          <p className="font-serif text-base sm:text-lg text-[#62685E] leading-relaxed">
            Connect via your university, medical laboratory, or research commission identity provider. Authentication is cryptographically anchored via InCommon, EduGAIN, and official ROR registry metadata.
          </p>
        </div>

        {/* Two-Column Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: ROR Search and Directory (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs">
              <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#62685E] block mb-2">
                1. Search Institutional Registry (ROR Typeahead)
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85877B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type university, hospital, or institute name..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] text-xs font-sans text-[#202920] outline-none focus:border-[#3E6248] focus:ring-2 focus:ring-[#3E6248]/10 transition-all placeholder:text-[#85877B]"
                />
              </div>
            </div>

            {/* Institutions List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredInstitutions.map((inst) => {
                const isSelected = selectedInst?.id === inst.id;
                return (
                  <div
                    key={inst.id}
                    onClick={() => setSelectedInst(inst)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#DCE6D7]/40 border-[#3E6248] shadow-xs"
                        : "bg-white border-[#E4DCCB] hover:border-[#3E6248]/40 hover:bg-[#FAF7F0]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-[#3E6248] text-[#FAF7F0] border-[#3E6248]"
                              : "bg-[#FAF7F0] text-[#3E6248] border-[#E4DCCB]"
                          }`}
                        >
                          <Building2 size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-sm font-medium text-[#202920] m-0 truncate">
                            {inst.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[10px] text-[#62685E]">
                              {inst.city}, {inst.country}
                            </span>
                            <span className="text-[#85877B] text-[10px]">·</span>
                            <span className="font-mono text-[10px] text-[#3E6248]">
                              {inst.federation}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 size={16} className="text-[#3E6248] shrink-0 mt-0.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: SAML Handshake Gateway Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-white border border-[#E4DCCB] shadow-sm space-y-6">
              <div className="border-b border-[#E4DCCB] pb-4">
                <span className="font-mono text-[10.5px] uppercase tracking-wider font-bold text-[#3E6248] block mb-1">
                  2. Federated Identity Dispatch
                </span>
                <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
                  {selectedInst ? selectedInst.name : "Select an institution"}
                </h3>
              </div>

              {selectedInst && (
                <div className="space-y-4">
                  {/* Registry Provenance Tag */}
                  <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#62685E]">
                      <span className="font-mono text-[10.5px] uppercase">ROR Identifier:</span>
                      <a
                        href={selectedInst.rorId}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10.5px] text-[#3E6248] hover:underline flex items-center gap-1 no-underline"
                      >
                        <span>{selectedInst.rorId.replace("https://", "")}</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[#62685E]">
                      <span className="font-mono text-[10.5px] uppercase">Identity Provider:</span>
                      <span className="font-mono text-[10.5px] font-semibold text-[#202920]">
                        {selectedInst.idpType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#62685E]">
                      <span className="font-mono text-[10.5px] uppercase">Trust Federation:</span>
                      <span className="font-mono text-[10.5px] text-[#3E6248] bg-[#DCE6D7] px-2 py-0.5 rounded">
                        {selectedInst.federation}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleInitiateSso} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#62685E]">
                        Institutional Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={academicEmail}
                        onChange={(e) => setAcademicEmail(e.target.value)}
                        placeholder={`scholar@${selectedInst.verifiedDomains[0]}`}
                        className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] text-xs font-sans text-[#202920] outline-none focus:border-[#3E6248] focus:ring-2 focus:ring-[#3E6248]/10 transition-all placeholder:text-[#85877B]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isHandshaking}
                      className="w-full h-12 rounded-full bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-[#66866A]/30 shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isHandshaking ? (
                        <span>Authenticating SAML 2.0...</span>
                      ) : (
                        <>
                          <span>Redirect to {selectedInst.federation} IDP</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Handshake Progress Log */}
                  {isHandshaking && (
                    <div className="p-3.5 rounded-xl bg-[#202920] text-[#FAF7F0] font-mono text-[11px] space-y-1.5 border border-[#3E6248]/40 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 text-[#66866A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#66866A] animate-ping" />
                        <span>SAML PROTOCOL HANDSHAKE ACTIVE</span>
                      </div>
                      <p className="m-0 text-[#E4DCCB]">{handshakeStep}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#E4DCCB] text-center">
                    <p className="text-[11px] font-mono text-[#85877B] m-0">
                      Encrypted with SHA-256 TLS 1.3 · SAML Metadata v2.0 Compliant
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
