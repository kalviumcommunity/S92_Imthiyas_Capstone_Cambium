import { useState, useEffect, useRef } from "react";

const NAV_SECTIONS = [
  { id: "data-collection", label: "1. Data We Collect" },
  { id: "how-we-use", label: "2. How We Use Data" },
  { id: "data-sharing", label: "3. Data Sharing" },
  { id: "data-retention", label: "4. Data Retention" },
  { id: "your-rights", label: "5. Your Rights" },
  { id: "cookies", label: "6. Cookies & Tracking" },
  { id: "security", label: "7. Security" },
  { id: "children", label: "8. Children's Privacy" },
  { id: "changes", label: "9. Changes to This Policy" },
  { id: "contact", label: "10. Contact Us" },
];

const TERMS_SECTIONS = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "license", label: "2. License to Use" },
  { id: "intellectual-property", label: "3. Intellectual Property" },
  { id: "user-content", label: "4. User Content" },
  { id: "prohibited", label: "5. Prohibited Conduct" },
  { id: "termination", label: "6. Termination" },
  { id: "disclaimers", label: "7. Disclaimers" },
  { id: "liability", label: "8. Limitation of Liability" },
  { id: "indemnification", label: "9. Indemnification" },
  { id: "governing-law", label: "10. Governing Law" },
];

type Page = "privacy" | "terms";

function CambiumLogo() {
  return (
    <span
      className="text-xl font-semibold tracking-tight"
      style={{ fontFamily: "'Source Serif 4', serif", color: "#17201D" }}
    >
      Cambium
    </span>
  );
}

function Sidebar({
  sections,
  activeId,
}: {
  sections: { id: string; label: string }[];
  activeId: string;
}) {
  return (
    <nav className="sticky top-24 h-fit">
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#66716C" }}
      >
        On this page
      </p>
      <ul className="space-y-1">
        {sections.map((s) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block text-sm py-1 pr-2 transition-colors duration-150"
                style={{
                  color: isActive ? "#173F35" : "#66716C",
                  fontWeight: isActive ? 700 : 400,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-2xl mt-10 mb-4 scroll-mt-24"
      style={{ fontFamily: "'Source Serif 4', serif", color: "#17201D" }}
    >
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-base mb-4"
      style={{
        fontFamily: "'Manrope', sans-serif",
        lineHeight: 1.7,
        color: "#17201D",
      }}
    >
      {children}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul
      className="list-disc pl-5 mb-4 space-y-2"
      style={{
        fontFamily: "'Manrope', sans-serif",
        fontSize: "1rem",
        lineHeight: 1.7,
        color: "#17201D",
      }}
    >
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function PrivacyContent() {
  return (
    <>
      <SectionHeading id="data-collection">1. Data We Collect</SectionHeading>
      <Body>
        Cambium collects information you provide directly, information generated
        as you use our platform, and information from third-party sources. We
        are deliberate about what we collect and why — we never gather data
        speculatively or sell it to advertisers.
      </Body>
      <BulletList
        items={[
          "Account information: name, email address, profile photo, and organization name provided at sign-up.",
          "Workspace content: documents, comments, annotations, linked resources, and any other material you create or import into Cambium.",
          "Usage data: feature interactions, session durations, navigation paths, and performance telemetry used to improve the product.",
          "Device and connection data: browser type, operating system, IP address, and time-zone, collected automatically on each session.",
          "Payment information: billing address and last four digits of the card on file, processed by our PCI-compliant payment provider. Full card numbers are never stored on our servers.",
        ]}
      />
      <Body>
        We do not collect biometric identifiers, precise geolocation beyond
        country-level inference, or any sensitive categories of personal data
        as defined under GDPR Article 9 unless you explicitly provide them in
        workspace content.
      </Body>

      <SectionHeading id="how-we-use">2. How We Use Data</SectionHeading>
      <Body>
        We use the information described above to deliver, maintain, and improve
        the Cambium platform. Specifically:
      </Body>
      <BulletList
        items={[
          "Providing and personalizing the service — rendering your workspace, syncing content across devices, and surfacing relevant features based on how you work.",
          "Communications — sending transactional emails (password resets, invoice receipts, security alerts) and, where you have opted in, product announcements.",
          "Safety and fraud prevention — detecting unauthorized access, investigating abuse reports, and enforcing our Terms of Service.",
          "Analytics and product development — understanding aggregate usage patterns to prioritize roadmap decisions. This analysis operates on anonymized or pseudonymized datasets wherever possible.",
          "Legal compliance — fulfilling obligations under applicable law, responding to lawful requests from public authorities, and protecting our legal rights.",
        ]}
      />
      <Body>
        We rely on the following lawful bases under GDPR: contract performance
        for core service delivery, legitimate interests for security and
        analytics, and consent for marketing communications.
      </Body>

      <SectionHeading id="data-sharing">3. Data Sharing</SectionHeading>
      <Body>
        Cambium does not sell, rent, or trade your personal information. We
        share data only in the following circumstances:
      </Body>
      <BulletList
        items={[
          "Service providers: vetted sub-processors who help us operate the platform (cloud hosting, email delivery, error monitoring, payment processing). Each is bound by data processing agreements aligned with GDPR requirements.",
          "Organization administrators: if your account is provisioned under an organization plan, workspace administrators can access usage reports and manage seat assignments.",
          "Business transfers: in the event of a merger, acquisition, or asset sale, data may be transferred to the successor entity, subject to equivalent privacy protections.",
          "Legal requirements: when disclosure is required by law, court order, or to protect the safety of users or the public.",
        ]}
      />

      <SectionHeading id="data-retention">4. Data Retention</SectionHeading>
      <Body>
        We retain your account data for as long as your account is active or as
        needed to provide you with our services. When you delete your account,
        we initiate deletion of your personal data within 30 days, with full
        purge from backup systems within 90 days thereafter. Certain records may
        be retained longer to comply with legal obligations (e.g., tax records
        for seven years) or to resolve ongoing disputes.
      </Body>
      <Body>
        Workspace content you delete is removed from our primary systems within
        72 hours. Deleted content may persist in versioned snapshots for up to
        30 days before permanent removal.
      </Body>

      <SectionHeading id="your-rights">5. Your Rights</SectionHeading>
      <Body>
        Depending on your jurisdiction, you may have the following rights
        regarding your personal data:
      </Body>
      <BulletList
        items={[
          "Access: request a copy of the personal data we hold about you.",
          "Rectification: ask us to correct inaccurate or incomplete data.",
          "Erasure: request deletion of your personal data where there is no overriding legitimate interest or legal obligation for us to retain it.",
          "Portability: receive your data in a structured, machine-readable format.",
          "Restriction: ask us to pause processing of your data in certain circumstances.",
          "Objection: object to processing based on legitimate interests, including profiling.",
          "Withdraw consent: where processing is based on consent, withdraw it at any time without affecting prior processing.",
        ]}
      />
      <Body>
        To exercise any of these rights, contact our Privacy Team at
        privacy@cambium.app. We will respond within 30 days. EEA and UK
        residents may also lodge a complaint with their local supervisory
        authority.
      </Body>

      <SectionHeading id="cookies">6. Cookies & Tracking</SectionHeading>
      <Body>
        Cambium uses a minimal set of cookies and similar technologies. We do
        not use third-party advertising cookies. Our cookies fall into three
        categories:
      </Body>
      <BulletList
        items={[
          "Strictly necessary: session authentication tokens and CSRF protection cookies required for the platform to function. These cannot be disabled.",
          "Functional: preference cookies that remember your display settings (theme, sidebar state, notification preferences) across sessions.",
          "Analytics: first-party event tracking via our own telemetry pipeline. No data is shared with advertising networks.",
        ]}
      />
      <Body>
        You can manage functional and analytics cookies through your account
        Settings → Privacy. Disabling analytics cookies does not affect your
        ability to use Cambium.
      </Body>

      <SectionHeading id="security">7. Security</SectionHeading>
      <Body>
        We implement industry-standard technical and organizational measures to
        protect your data against unauthorized access, alteration, disclosure,
        or destruction. These include AES-256 encryption at rest, TLS 1.3 in
        transit, role-based access controls for internal staff, annual
        third-party penetration testing, and SOC 2 Type II certification.
      </Body>
      <Body>
        No method of transmission over the internet is 100% secure. If you
        discover a potential vulnerability, please report it responsibly to
        security@cambium.app. We maintain a coordinated disclosure program and
        will acknowledge your report within 48 hours.
      </Body>

      <SectionHeading id="children">8. Children's Privacy</SectionHeading>
      <Body>
        Cambium is not directed to children under the age of 16. We do not
        knowingly collect personal information from children. If we become aware
        that a child under 16 has provided us with personal information, we will
        take steps to delete it promptly. If you believe a child has submitted
        personal information to us, please contact privacy@cambium.app.
      </Body>

      <SectionHeading id="changes">9. Changes to This Policy</SectionHeading>
      <Body>
        We may update this Privacy Policy from time to time. When we make
        material changes, we will notify you by email and display a prominent
        notice in the Cambium interface at least 14 days before changes take
        effect. The "Last updated" date at the top of this page reflects the
        most recent revision. Continued use of the platform after the effective
        date constitutes acceptance of the revised policy.
      </Body>

      <SectionHeading id="contact">10. Contact Us</SectionHeading>
      <Body>
        For questions about this Privacy Policy or our data practices, please
        contact:
      </Body>
      <div
        className="text-sm leading-relaxed p-5 rounded-lg border mb-8"
        style={{
          fontFamily: "'Manrope', sans-serif",
          background: "#FFFFFF",
          borderColor: "#DDE2DE",
          color: "#17201D",
        }}
      >
        <p className="font-semibold mb-1">Cambium Privacy Team</p>
        <p>Cambium Technologies, Inc.</p>
        <p>340 Pine Street, Suite 800</p>
        <p>San Francisco, CA 94104</p>
        <p className="mt-2">
          <a
            href="mailto:privacy@cambium.app"
            style={{ color: "#173F35", textDecoration: "underline" }}
          >
            privacy@cambium.app
          </a>
        </p>
      </div>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <SectionHeading id="acceptance">1. Acceptance of Terms</SectionHeading>
      <Body>
        By accessing or using Cambium — including any associated mobile
        applications, APIs, or browser extensions — you agree to be bound by
        these Terms of Service and our Privacy Policy. If you are accepting on
        behalf of an organization, you represent that you have authority to bind
        that organization. If you do not agree to these terms, do not use the
        service.
      </Body>

      <SectionHeading id="license">2. License to Use</SectionHeading>
      <Body>
        Subject to your compliance with these Terms, Cambium grants you a
        limited, non-exclusive, non-transferable, revocable license to access
        and use the platform for your internal business or personal purposes.
        This license does not include the right to:
      </Body>
      <BulletList
        items={[
          "Resell, sublicense, or otherwise commercialize any part of the service.",
          "Copy or adapt the software underlying the platform.",
          "Reverse engineer, decompile, or disassemble any component of Cambium.",
          "Access Cambium through automated means (bots, scrapers, crawlers) except as expressly permitted by our API documentation.",
        ]}
      />

      <SectionHeading id="intellectual-property">
        3. Intellectual Property
      </SectionHeading>
      <Body>
        Cambium and its licensors retain all right, title, and interest in and
        to the platform, including all software, designs, trademarks, and
        documentation. These Terms do not grant you any ownership rights.
        "Cambium," the Cambium logotype, and related marks are trademarks of
        Cambium Technologies, Inc. You may not use our trademarks without prior
        written permission.
      </Body>

      <SectionHeading id="user-content">4. User Content</SectionHeading>
      <Body>
        You retain ownership of all documents, data, and other content you
        create or upload to Cambium ("User Content"). By using the platform, you
        grant Cambium a worldwide, royalty-free license to host, store,
        transmit, and display your User Content solely to the extent necessary
        to provide the service to you.
      </Body>
      <Body>
        You are solely responsible for your User Content and represent that you
        have all rights necessary to grant the above license, and that your
        content does not violate any third-party rights or applicable law.
      </Body>

      <SectionHeading id="prohibited">5. Prohibited Conduct</SectionHeading>
      <Body>You agree not to use Cambium to:</Body>
      <BulletList
        items={[
          "Violate any applicable law or regulation.",
          "Infringe the intellectual property or privacy rights of others.",
          "Upload or transmit malicious code, viruses, or any software designed to disrupt or damage systems.",
          "Impersonate any person or entity or misrepresent your affiliation.",
          "Attempt to gain unauthorized access to any part of the platform or another user's account.",
          "Use the service in a way that places an unreasonable load on our infrastructure.",
          "Harvest or scrape user data without authorization.",
        ]}
      />
      <Body>
        Violation of these prohibitions may result in immediate suspension or
        termination of your account, and may expose you to civil or criminal
        liability.
      </Body>

      <SectionHeading id="termination">6. Termination</SectionHeading>
      <Body>
        You may delete your account at any time from Settings → Account →
        Delete Account. Cambium may suspend or terminate your access at any
        time, with or without cause, upon notice where practicable. Provisions
        that by their nature should survive termination (including Intellectual
        Property, Disclaimers, Limitation of Liability, and Indemnification)
        will remain in effect after termination.
      </Body>

      <SectionHeading id="disclaimers">7. Disclaimers</SectionHeading>
      <Body>
        THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
        OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
        Cambium does not warrant that the service will be uninterrupted,
        error-free, or free of viruses or other harmful components. We make no
        guarantees regarding the accuracy or completeness of any content
        available through the platform.
      </Body>

      <SectionHeading id="liability">
        8. Limitation of Liability
      </SectionHeading>
      <Body>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CAMBIUM AND ITS
        OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
        INCLUDING LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS INTERRUPTION,
        ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR YOUR USE OF THE
        PLATFORM, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </Body>
      <Body>
        In no event shall Cambium's aggregate liability exceed the greater of
        (a) one hundred US dollars ($100) or (b) the total fees paid by you to
        Cambium in the twelve months preceding the claim.
      </Body>

      <SectionHeading id="indemnification">9. Indemnification</SectionHeading>
      <Body>
        You agree to indemnify, defend, and hold harmless Cambium and its
        officers, directors, employees, agents, and licensors from and against
        any claims, liabilities, damages, losses, and expenses (including
        reasonable attorneys' fees) arising out of your violation of these
        Terms, your User Content, or your use of the platform in a manner that
        causes harm to a third party.
      </Body>

      <SectionHeading id="governing-law">10. Governing Law</SectionHeading>
      <Body>
        These Terms are governed by the laws of the State of California, without
        regard to conflict of law principles. Any dispute arising under or in
        connection with these Terms shall be subject to the exclusive
        jurisdiction of the state and federal courts located in San Francisco
        County, California. If you are accessing the platform from a jurisdiction
        with mandatory consumer protection laws that differ from California law,
        those local laws may apply.
      </Body>
      <div
        className="text-sm leading-relaxed p-5 rounded-lg border mb-8"
        style={{
          fontFamily: "'Manrope', sans-serif",
          background: "#FFFFFF",
          borderColor: "#DDE2DE",
          color: "#17201D",
        }}
      >
        <p className="font-semibold mb-1">Questions about these Terms?</p>
        <p>
          Contact us at{" "}
          <a
            href="mailto:legal@cambium.app"
            style={{ color: "#173F35", textDecoration: "underline" }}
          >
            legal@cambium.app
          </a>{" "}
          or write to Cambium Technologies, Inc., 340 Pine Street, Suite 800,
          San Francisco, CA 94104.
        </p>
      </div>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("privacy");
  const [activeId, setActiveId] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const sections = page === "privacy" ? NAV_SECTIONS : TERMS_SECTIONS;

  useEffect(() => {
    setActiveId(sections[0]?.id ?? "");
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    const headings = document.querySelectorAll("h2[id]");
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [page]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F7F6F1", color: "#17201D" }}
    >
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b"
        style={{
          backgroundColor: "#F7F6F1",
          borderColor: "#DDE2DE",
          height: "64px",
        }}
      >
        <CambiumLogo />
        <a
          href="#"
          className="text-sm px-4 py-2 rounded-md border transition-colors duration-150"
          style={{
            fontFamily: "'Manrope', sans-serif",
            borderColor: "#DDE2DE",
            color: "#17201D",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "transparent";
          }}
        >
          ← Back to Workspace
        </a>
      </header>

      {/* Page selector */}
      <div
        className="flex gap-0 border-b"
        style={{ borderColor: "#DDE2DE", backgroundColor: "#F7F6F1" }}
      >
        <div className="max-w-screen-xl mx-auto w-full flex px-8">
          {(["privacy", "terms"] as Page[]).map((p) => {
            const label =
              p === "privacy" ? "Privacy Policy" : "Terms of Service";
            const active = page === p;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="px-5 py-3 text-sm font-medium transition-colors duration-150 border-b-2"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  borderBottomColor: active ? "#173F35" : "transparent",
                  color: active ? "#173F35" : "#66716C",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-screen-xl mx-auto flex gap-16 px-8 pt-12 pb-24">
        {/* Sidebar */}
        <aside className="hidden lg:block" style={{ width: "250px", flexShrink: 0 }}>
          <Sidebar sections={sections} activeId={activeId} />
        </aside>

        {/* Content */}
        <main ref={contentRef} style={{ maxWidth: "65ch", flex: "1 1 0" }}>
          {/* Page header */}
          <div className="pb-4 mb-2 border-b" style={{ borderColor: "#DDE2DE" }}>
            <h1
              className="text-4xl mb-3"
              style={{
                fontFamily: "'Source Serif 4', serif",
                color: "#17201D",
                fontWeight: 600,
              }}
            >
              {page === "privacy" ? "Privacy Policy" : "Terms of Service"}
            </h1>
            <p
              className="text-xs"
              style={{ fontFamily: "'Manrope', sans-serif", color: "#66716C" }}
            >
              Last updated: September 2026
            </p>
          </div>

          {/* Intro */}
          <p
            className="text-base mt-6 mb-2"
            style={{
              fontFamily: "'Manrope', sans-serif",
              lineHeight: 1.7,
              color: "#66716C",
            }}
          >
            {page === "privacy"
              ? 'This Privacy Policy describes how Cambium Technologies, Inc. (“Cambium,” “we,” “us,” or “our”) collects, uses, and shares information about you when you use our products and services.'
              : “These Terms of Service (\”Terms\”) govern your access to and use of Cambium’s products and services. Please read them carefully before using the platform.”}
          </p>

          {/* Section content */}
          {page === "privacy" ? <PrivacyContent /> : <TermsContent />}
        </main>
      </div>
    </div>
  );
}
