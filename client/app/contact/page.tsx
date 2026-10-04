"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Building,
  HelpCircle,
  MessageSquare,
  Database,
  Briefcase,
} from "lucide-react";

const INQUIRY_TYPES = [
  "General inquiry",
  "Product feedback",
  "Data correction or source issue",
  "Partnership or institutional inquiry",
  "Careers or contribution",
  "Other",
];

function ContactContent() {
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get("type");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState(
    preselectedType === "careers"
      ? "Careers or contribution"
      : preselectedType === "data"
      ? "Data correction or source issue"
      : "General inquiry"
  );
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [organization, setOrganization] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessageId, setSubmittedMessageId] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid academic or professional email";
    }
    if (!subject.trim()) errs.subject = "Subject is required";
    if (!message.trim()) {
      errs.message = "Message cannot be empty";
    } else if (message.trim().length < 15) {
      errs.message = "Please provide at least 15 characters of detail";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate reliable dispatch pipeline
    setTimeout(() => {
      setIsSubmitting(false);
      const referenceId = `CAMBIUM-REQ-${Date.now().toString().slice(-6)}`;
      setSubmittedMessageId(referenceId);
    }, 700);
  };

  const handleReset = () => {
    setFullName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setOrganization("");
    setSubmittedMessageId(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#202920] selection:bg-[#3E6248]/20 selection:text-[#173F35]">
      <PublicHeader />

      {/* ─── SECTION 01: HERO ─── */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16 border-b border-[#E4DCCB]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE6D7]/60 border border-[#66866A]/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                Contact Cambium
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-normal leading-[1.12] tracking-tight text-[#202920] mb-6">
              Let&apos;s talk <span className="italic text-[#3E6248]">research</span>.
            </h1>

            <p className="font-serif text-lg sm:text-xl leading-relaxed text-[#62685E] mb-4">
              Questions, feedback, ideas, or a potential collaboration? We&apos;d like to hear from you.
            </p>

            <p className="font-serif text-base leading-relaxed text-[#85877B]">
              Cambium is being built to make research discovery more connected and useful. Your feedback can help us understand what researchers need, where discovery breaks down, and what we should build next.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 02: CONTACT CATEGORIES ─── */}
      <section className="py-16 sm:py-20 border-b border-[#E4DCCB] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
              Direct Channels
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] mt-2">
              How can we help?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. General inquiries */}
            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#3E6248]">
                  <HelpCircle size={18} />
                  <span className="font-sans font-semibold text-sm text-[#202920]">General inquiries</span>
                </div>
                <p className="font-serif text-xs text-[#62685E] leading-relaxed mb-4">
                  Questions about Cambium, its features, availability, or direction.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4DCCB]/60">
                <a
                  href="mailto:hello@cambium.research"
                  className="font-mono text-xs text-[#3E6248] font-medium hover:underline flex items-center gap-1.5"
                >
                  <Mail size={12} />
                  <span>hello@cambium.research</span>
                </a>
              </div>
            </div>

            {/* 2. Product feedback */}
            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#3E6248]">
                  <MessageSquare size={18} />
                  <span className="font-sans font-semibold text-sm text-[#202920]">Product feedback</span>
                </div>
                <p className="font-serif text-xs text-[#62685E] leading-relaxed mb-4">
                  Found something confusing, have an idea, or want to suggest a feature? Tell us what would make your research workflow better.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4DCCB]/60">
                <a
                  href="mailto:feedback@cambium.research"
                  className="font-mono text-xs text-[#3E6248] font-medium hover:underline flex items-center gap-1.5"
                >
                  <Mail size={12} />
                  <span>feedback@cambium.research</span>
                </a>
              </div>
            </div>

            {/* 3. Data corrections and source issues */}
            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#3E6248]">
                  <Database size={18} />
                  <span className="font-sans font-semibold text-sm text-[#202920]">Data corrections & source issues</span>
                </div>
                <p className="font-serif text-xs text-[#62685E] leading-relaxed mb-4">
                  Found an incorrect opportunity, outdated deadline, broken link, or duplicate record? Please include URLs and a short explanation.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4DCCB]/60">
                <a
                  href="mailto:data@cambium.research"
                  className="font-mono text-xs text-[#3E6248] font-medium hover:underline flex items-center gap-1.5"
                >
                  <Mail size={12} />
                  <span>data@cambium.research</span>
                </a>
              </div>
            </div>

            {/* 4. Partnerships and institutions */}
            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[#3E6248]">
                  <Building size={18} />
                  <span className="font-sans font-semibold text-sm text-[#202920]">Partnerships & institutions</span>
                </div>
                <p className="font-serif text-xs text-[#62685E] leading-relaxed mb-4">
                  Interested in research collaboration, institutional use, data integrations, or exploring a partnership with Cambium?
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4DCCB]/60">
                <a
                  href="mailto:partnerships@cambium.research"
                  className="font-mono text-xs text-[#3E6248] font-medium hover:underline flex items-center gap-1.5"
                >
                  <Mail size={12} />
                  <span>partnerships@cambium.research</span>
                </a>
              </div>
            </div>

            {/* 5. Careers and contributing */}
            <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] flex flex-col justify-between hover:border-[#3E6248]/50 transition-colors md:col-span-2 lg:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#3E6248]">
                    <Briefcase size={18} />
                    <span className="font-sans font-semibold text-sm text-[#202920]">Careers and contributing</span>
                  </div>
                  <Link
                    href="/careers"
                    className="font-mono text-[11px] text-[#3E6248] hover:underline uppercase tracking-wider"
                  >
                    View Careers Page →
                  </Link>
                </div>
                <p className="font-serif text-xs text-[#62685E] leading-relaxed mb-4">
                  Interested in helping build Cambium or contributing your skills to the project? Explore our open contribution framework or write to us with a short introduction.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4DCCB]/60">
                <a
                  href="mailto:careers@cambium.research"
                  className="font-mono text-xs text-[#3E6248] font-medium hover:underline flex items-center gap-1.5"
                >
                  <Mail size={12} />
                  <span>careers@cambium.research</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 03 & 04: MESSAGE FORM & PRIVACY NOTE ─── */}
      <section className="py-20 sm:py-28 border-b border-[#E4DCCB] bg-[#FAF7F0]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Guidance & Privacy Note */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
                  Send a Dispatch
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920] mt-2 mb-4">
                  Send us a message.
                </h2>
                <p className="font-serif text-[16px] leading-relaxed text-[#62685E]">
                  We welcome thoughtful questions, constructive feedback, and ideas grounded in real research needs.
                </p>
              </div>

              {/* Section 04: A note before you write */}
              <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-[#8A5A12]">
                  <ShieldAlert size={18} />
                  <span className="font-sans font-semibold text-xs uppercase tracking-wider text-[#202920]">
                    A Note Before You Write
                  </span>
                </div>
                <p className="font-serif text-xs leading-relaxed text-[#62685E]">
                  Please do not include passwords, confidential unpublished research, sensitive personal information, or restricted documents unless we have explicitly established a suitable process for receiving them.
                </p>
              </div>

              {/* Research Protocol Badge */}
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E4DCCB] text-[11px] font-mono text-[#85877B] space-y-1">
                <div>Cambium Research Desk</div>
                <div>Standard response window: within 24-48 business hours</div>
              </div>
            </div>

            {/* Right Interactive Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E4DCCB] shadow-sm">
                {submittedMessageId ? (
                  <div className="py-10 text-center space-y-5 animate-in fade-in duration-300">
                    <div className="w-14 h-14 rounded-full bg-[#DCE6D7] text-[#3E6248] flex items-center justify-center mx-auto">
                      <CheckCircle2 size={30} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl font-normal text-[#202920]">
                        Message received.
                      </h3>
                      <p className="font-serif text-sm text-[#62685E] max-w-md mx-auto">
                        Thank you for reaching out. We have logged your transmission under reference{" "}
                        <strong className="font-mono text-[#202920]">{submittedMessageId}</strong>. Our team will review and respond promptly.
                      </p>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={handleReset}
                        className="px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-[#3E6248] bg-[#FAF7F0] border border-[#E4DCCB] hover:bg-[#DCE6D7] transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Full Name */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#62685E] mb-2 font-semibold">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors({ ...errors, fullName: "" });
                        }}
                        placeholder="e.g. Dr. Miriam Osei"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans bg-[#FAF7F0]/60 text-[#202920] placeholder-[#85877B] focus:outline-none focus:ring-1 focus:ring-[#3E6248] transition-all ${
                          errors.fullName ? "border-red-400 bg-red-50/20" : "border-[#E4DCCB]"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-600 mt-1 font-sans">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#62685E] mb-2 font-semibold">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        placeholder="e.g. m.osei@princeton.edu"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans bg-[#FAF7F0]/60 text-[#202920] placeholder-[#85877B] focus:outline-none focus:ring-1 focus:ring-[#3E6248] transition-all ${
                          errors.email ? "border-red-400 bg-red-50/20" : "border-[#E4DCCB]"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1 font-sans">{errors.email}</p>
                      )}
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#62685E] mb-2 font-semibold">
                        Inquiry Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E4DCCB] text-sm font-sans bg-[#FAF7F0]/60 text-[#202920] focus:outline-none focus:ring-1 focus:ring-[#3E6248]"
                      >
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Website or Organization (Optional) */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#62685E] mb-2">
                        Website or Organization <span className="text-xs text-[#85877B] normal-case">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Stanford Bio-AI Lab"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E4DCCB] text-sm font-sans bg-[#FAF7F0]/60 text-[#202920] placeholder-[#85877B] focus:outline-none focus:ring-1 focus:ring-[#3E6248]"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#62685E] mb-2 font-semibold">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value);
                          if (errors.subject) setErrors({ ...errors, subject: "" });
                        }}
                        placeholder="Brief summary of your inquiry"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans bg-[#FAF7F0]/60 text-[#202920] placeholder-[#85877B] focus:outline-none focus:ring-1 focus:ring-[#3E6248] transition-all ${
                          errors.subject ? "border-red-400 bg-red-50/20" : "border-[#E4DCCB]"
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-600 mt-1 font-sans">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message Body */}
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#62685E] mb-2 font-semibold">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors({ ...errors, message: "" });
                        }}
                        placeholder="Please write your detailed feedback, inquiry, or correction..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-sans bg-[#FAF7F0]/60 text-[#202920] placeholder-[#85877B] focus:outline-none focus:ring-1 focus:ring-[#3E6248] transition-all resize-y ${
                          errors.message ? "border-red-400 bg-red-50/20" : "border-[#E4DCCB]"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-600 mt-1 font-sans">{errors.message}</p>
                      )}
                    </div>

                    {/* Consent Notice */}
                    <div className="pt-2 text-xs font-serif text-[#85877B] leading-relaxed">
                      By submitting this form, you acknowledge that Cambium will process the information you provide to respond to your inquiry, in accordance with our{" "}
                      <Link href="/privacy" className="text-[#3E6248] underline font-medium">
                        Privacy Policy
                      </Link>
                      .
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] py-3.5 px-6 rounded-full font-sans text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-[#66866A]/30"
                      >
                        {isSubmitting ? (
                          <span>Transmitting Message...</span>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 05: STAY CONNECTED ─── */}
      <section className="py-20 sm:py-24 border-b border-[#E4DCCB] bg-white text-center">
        <div className="max-w-2xl mx-auto px-6 sm:px-10 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#3E6248] font-semibold">
            The Living Platform
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#202920]">
            Cambium is evolving.
          </h2>
          <p className="font-serif text-[17px] text-[#62685E] leading-relaxed">
            As the platform develops, we aim to share meaningful product updates, research-discovery improvements, and opportunities to participate.
          </p>
          <div className="pt-4">
            <Link
              href="/opportunities"
              className="bg-[#FAF7F0] hover:bg-[#DCE6D7] text-[#202920] px-7 py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-wider border border-[#E4DCCB] transition-colors inline-flex items-center gap-2 no-underline"
            >
              <span>Explore Cambium</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 06: FOOTER ─── */}
      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F0]" />}>
      <ContactContent />
    </Suspense>
  );
}
