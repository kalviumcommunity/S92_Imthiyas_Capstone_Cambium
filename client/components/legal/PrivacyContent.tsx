import React from "react";
import { ShieldCheck, AlertCircle, Lock } from "lucide-react";

export function PrivacyContent() {
  return (
    <div className="space-y-12">
      {/* Preamble */}
      <div className="border-b border-[#E4DCCB] pb-8">
        <p className="font-serif text-[17px] leading-relaxed text-[#202920]/90 mb-4">
          <strong className="font-semibold text-[#202920]">Cambium</strong> is an AI-powered Research Opportunity Discovery and Intelligence Platform designed to help researchers discover and organize research opportunities, scholarly information, and related resources.
        </p>
        <p className="font-serif text-[17px] leading-relaxed text-[#202920]/85 mb-4">
          This Privacy Policy explains how Cambium collects, uses, stores, shares, and otherwise processes personal data when you visit our website, create an account, use research discovery features, or contact us.
        </p>
        <div className="rounded-xl p-4 bg-[#FAF7F0] border border-[#3E6248]/30 flex items-start gap-3 mt-4">
          <ShieldCheck size={20} className="text-[#3E6248] shrink-0 mt-0.5" />
          <p className="font-sans text-sm text-[#202920] font-medium m-0 leading-relaxed">
            We aim to collect only the information reasonably necessary to operate and improve the Service, protect users, and meet our legal obligations.
          </p>
        </div>
      </div>

      {/* 1. Who is responsible for your data? */}
      <section id="privacy-responsible" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          1. Who is responsible for your data?
        </h2>
        <div className="bg-white rounded-xl p-5 border border-[#E4DCCB] shadow-2xs space-y-2 font-sans text-sm text-[#202920] mb-4">
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Data controller / responsible entity, as applicable:</strong> <span className="text-[#202920] font-medium">[Full legal name or registered entity]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Address:</strong> <span className="text-[#202920]">[Business or service address, where required]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Privacy contact:</strong> <span className="text-[#3E6248] font-mono">[Privacy email address]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">General support:</strong> <span className="text-[#3E6248] font-mono">[Support email]</span></div>
        </div>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          In this Policy, “Cambium,” “we,” “us,” and “our” refer to the operator identified above.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          The precise legal role of the operator depends on the applicable privacy law and the processing activity.
        </p>
      </section>

      {/* 2. Scope of this Policy */}
      <section id="privacy-scope" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          2. Scope of this Policy
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          This Policy applies to personal data processed through:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>The Cambium website and web application.</li>
          <li>Account registration and profile features, if enabled.</li>
          <li>Research-interest personalization and recommendations.</li>
          <li>Search, saved items, bookmarks, and deadline-tracking features, if enabled.</li>
          <li>AI-assisted research features, where offered.</li>
          <li>Customer support, feedback, and communications.</li>
          <li>Website security, diagnostics, and analytics, where implemented.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Third-party websites that Cambium links to are governed by their own privacy policies. Review those policies before providing them with personal information.
        </p>
      </section>

      {/* 3. Information we may collect */}
      <section id="privacy-collection" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          3. Information we may collect
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-6">
          The categories actually collected depend on the features you use and the current implementation of Cambium.
        </p>

        {/* Subsections A-G */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-[#E4DCCB]">
            <h3 className="font-sans text-base font-semibold text-[#202920] mb-2">
              A. Account and profile information
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90 mb-3">
              If account features are enabled, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-serif text-sm text-[#202920]/85 mb-3">
              <li>Name or display name.</li>
              <li>Email address.</li>
              <li>Authentication and account identifiers.</li>
              <li>Academic or professional profile information you choose to provide.</li>
              <li>Institution, affiliation, education, role, or professional background, where requested.</li>
              <li>Account preferences and settings.</li>
            </ul>
            <p className="font-sans text-xs text-[#85877B] italic">
              Do not provide information that is unnecessary for your use of Cambium.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E4DCCB]">
            <h3 className="font-sans text-base font-semibold text-[#202920] mb-2">
              B. Research interests and activity
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90 mb-3">
              To support discovery and personalization, Cambium may process:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-serif text-sm text-[#202920]/85 mb-3">
              <li>Research fields, topics, keywords, and interests.</li>
              <li>Search queries and applied filters.</li>
              <li>Viewed or saved opportunities and publications.</li>
              <li>Bookmarks, tracked deadlines, and recommendation interactions.</li>
              <li>Preferences used to organize or rank research resources.</li>
            </ul>
            <p className="font-serif text-sm leading-relaxed text-[#62685E]">
              Research interests and activity can reveal information about a person's professional or academic plans. We aim to use these data for the disclosed purposes and restrict access appropriately.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E4DCCB]">
            <h3 className="font-sans text-base font-semibold text-[#202920] mb-2">
              C. Prompts and AI interactions
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90 mb-3">
              If you use AI-assisted features, Cambium may process:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-serif text-sm text-[#202920]/85 mb-3">
              <li>Prompts and questions you submit.</li>
              <li>Context supplied to generate a response.</li>
              <li>Research records retrieved to answer a query.</li>
              <li>Generated summaries, recommendations, classifications, or explanations.</li>
              <li>Feedback you provide on AI outputs.</li>
              <li>Technical metadata necessary to operate the feature.</li>
            </ul>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90 mb-2">
              Before submitting confidential, unpublished, restricted, or personal research material, review the feature-specific disclosures and the applicable AI provider's terms and privacy practices.
            </p>
            <p className="font-sans text-xs text-[#3E6248] font-medium bg-[#DCE6D7]/40 p-2.5 rounded-lg border border-[#66866A]/20">
              We will not claim that prompts are never retained, used for model training, or shared with providers unless the relevant provider arrangements and technical configuration support that claim.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E4DCCB]">
            <h3 className="font-sans text-base font-semibold text-[#202920] mb-2">
              D. Technical and usage information
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90 mb-3">
              Depending on the website configuration, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-serif text-sm text-[#202920]/85 mb-3">
              <li>IP address and approximate network-derived location.</li>
              <li>Browser, device, operating system, and language information.</li>
              <li>Request timestamps and diagnostic logs.</li>
              <li>Pages or features accessed and interaction events.</li>
              <li>Security, error, and performance information.</li>
              <li>Cookie identifiers and similar technologies, where used.</li>
            </ul>
            <p className="font-serif text-sm leading-relaxed text-[#62685E]">
              The information collected depends on the actual hosting, analytics, security, and application configuration.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E4DCCB]">
            <h3 className="font-sans text-base font-semibold text-[#202920] mb-2">
              E. Communications and support
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90">
              If you contact us, we may process your email address, message content, attachments you provide, and information needed to respond to your request.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E4DCCB]">
            <h3 className="font-sans text-base font-semibold text-[#202920] mb-2">
              F. Information from external sources
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90 mb-3">
              Cambium may process scholarly metadata and research opportunity information from third-party sources. Some records may refer to identifiable researchers or authors.
            </p>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90 mb-2">
              Where applicable, information may include names, institutional affiliations, publication details, identifiers, abstracts, citations, and links to original sources.
            </p>
            <p className="font-sans text-xs text-[#85877B] italic">
              The fact that information is publicly accessible does not automatically mean it is free of privacy, copyright, database, or reuse restrictions.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E4DCCB]">
            <h3 className="font-sans text-base font-semibold text-[#202920] mb-2">
              G. Payments
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90 mb-2">
              If Cambium introduces paid features, payment information may be processed by a payment provider. The information we receive may include transaction identifiers, billing details, subscription status, and payment-related records.
            </p>
            <p className="font-serif text-sm leading-relaxed text-[#62685E]">
              The exact information collected will depend on the payment method and provider. We will update this Policy before or when such processing begins, as required by law.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How we use information */}
      <section id="privacy-usage" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          4. How we use information
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Subject to applicable law, we may use personal data to:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Create and maintain accounts.</li>
          <li>Provide search, discovery, bookmarking, and deadline features.</li>
          <li>Personalize research results and recommendations.</li>
          <li>Process AI-assisted requests and return relevant results.</li>
          <li>Save user preferences and maintain requested functionality.</li>
          <li>Communicate service notices and respond to support requests.</li>
          <li>Diagnose errors, monitor performance, and improve reliability.</li>
          <li>Detect fraud, abuse, unauthorized access, and security incidents.</li>
          <li>Maintain records and establish, exercise, or defend legal claims.</li>
          <li>Meet legal obligations and respond to valid legal requests.</li>
          <li>Understand aggregated service usage and improve product usability.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#62685E]">
          We do not claim that every purpose listed is active today. Processing is limited to purposes relevant to the features you use and the actual operation of Cambium.
        </p>
      </section>

      {/* 5. Legal grounds for processing */}
      <section id="privacy-legal-grounds" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          5. Legal grounds for processing
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Where applicable law requires a legal basis, Cambium will rely on the appropriate basis for the relevant processing activity.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Depending on the jurisdiction and context, this may include:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Your consent.</li>
          <li>Performance of a contract or steps requested before entering into a contract.</li>
          <li>Compliance with a legal obligation.</li>
          <li>Legitimate interests, where recognized by law and where those interests are not overridden by applicable rights.</li>
          <li>Another lawful basis permitted by applicable law.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Where processing relies on consent, you may withdraw it through the available settings or by contacting us, subject to legal requirements. Withdrawal does not invalidate processing lawfully carried out before withdrawal.
        </p>
        <div className="rounded-xl p-4 bg-[#FAF7F0] border-l-4 border-l-[#3E6248] border border-[#E4DCCB] text-sm font-sans text-[#202920]">
          <strong>DPDP Act Compliance (India):</strong> For processing subject to India's Digital Personal Data Protection Act, 2023 and the applicable rules and commencement provisions, Cambium will provide the notices, obtain consent where required, and support applicable rights and obligations as legally required.
        </div>
      </section>

      {/* 6. How AI processing works */}
      <section id="privacy-ai-processing" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          6. How AI processing works
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium's intended intelligence layer may use retrieval, ranking, embeddings, language models, or other machine-learning techniques to help users discover relevant research information.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Depending on the feature, your query or relevant context may be processed by Cambium's own infrastructure and/or an external AI service provider.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Where an external provider is used, processing may involve transmitting the minimum necessary query, context, or retrieved information to that provider to generate the requested result.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          The providers, data regions, retention settings, and training policies may differ by integration. Before launching a feature, Cambium should document the actual provider and configuration and disclose material processing as required.
        </p>
        <div className="rounded-xl p-4 bg-amber-50/60 border border-amber-300 text-xs font-mono text-[#8A5A12] leading-relaxed mb-4">
          <strong>Important Disclosure:</strong> We do not promise that no AI provider receives prompts, that prompts are never retained, or that user data is never used for model improvement unless those statements are verified for every relevant provider and configuration.
        </div>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          AI outputs may be inaccurate or incomplete. Do not treat an AI-generated recommendation as a verified funding, publication, legal, academic, or institutional decision.
        </p>
      </section>

      {/* 7. Cookies and similar technologies */}
      <section id="privacy-cookies" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          7. Cookies and similar technologies
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Cambium may use cookies or similar technologies to:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Maintain authentication and sessions.</li>
          <li>Protect the Service against abuse.</li>
          <li>Remember preferences.</li>
          <li>Measure performance or usage, if analytics are enabled.</li>
          <li>Support functionality provided by third parties.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Strictly necessary technologies may be required for core functionality. Where consent is required for optional analytics, advertising, or other non-essential technologies, those technologies should not be activated before the required consent is obtained.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You may be able to manage cookies through your browser or a Cambium preference interface, if provided. Blocking certain cookies may affect functionality.
        </p>
        <div className="rounded-xl p-4 bg-[#FAF7F0] border border-[#E4DCCB] text-xs font-mono text-[#85877B] leading-relaxed">
          <strong>Deployment Note:</strong> Before publication, list the actual cookies and trackers used by the production website and configure any required consent mechanism.
        </div>
      </section>

      {/* 8. When we share information */}
      <section id="privacy-sharing" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          8. When we share information
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We may share personal data only where reasonably necessary for the disclosed purposes, permitted by law, and subject to appropriate safeguards.
        </p>

        <div className="space-y-4 mb-4">
          <div className="bg-white rounded-xl p-4 border border-[#E4DCCB]">
            <h3 className="font-sans text-sm font-semibold text-[#202920] mb-2">A. Service providers</h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90 mb-2">
              Depending on the implemented architecture, service providers may support hosting and content delivery, database and application infrastructure, authentication, AI inference and retrieval, email and notifications, monitoring, diagnostics, and security, analytics (if enabled), and payments (if introduced).
            </p>
            <p className="font-sans text-xs text-[#85877B]">
              Providers should receive only the information necessary for their assigned purpose and be subject to appropriate contractual, technical, and organizational safeguards.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E4DCCB]">
            <h3 className="font-sans text-sm font-semibold text-[#202920] mb-2">B. Research and content providers</h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90">
              When you follow an external link, query a third-party source, or use a feature that retrieves information from an external provider, information may be exchanged with that provider as necessary for the requested action. External providers may independently process information under their own policies.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E4DCCB]">
            <h3 className="font-sans text-sm font-semibold text-[#202920] mb-2">C. Legal and safety purposes</h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90">
              We may disclose information when reasonably necessary to comply with applicable law, respond to valid legal process, protect rights and safety, investigate abuse, or prevent fraud and security incidents.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E4DCCB]">
            <h3 className="font-sans text-sm font-semibold text-[#202920] mb-2">D. Business transfers</h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90">
              If Cambium is involved in a merger, acquisition, restructuring, financing, or transfer of assets, relevant information may be transferred subject to applicable law and appropriate safeguards.
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E4DCCB]">
            <h3 className="font-sans text-sm font-semibold text-[#202920] mb-2">E. With your direction</h3>
            <p className="font-serif text-sm leading-relaxed text-[#202920]/90">
              We may share information when you explicitly request or authorize a sharing action, such as using an integration or making content available to another person.
            </p>
          </div>
        </div>

        <div className="rounded-xl p-4 bg-[#FAF7F0] border-l-4 border-l-[#3E6248] border border-[#E4DCCB] text-sm font-sans text-[#202920]">
          <strong className="text-[#3E6248]">Core Policy:</strong> We do not sell personal data as a business model. If the Service's data-sharing practices materially change, this Policy must be updated and any required notice or consent obtained.
        </div>
      </section>

      {/* 9. International data transfers */}
      <section id="privacy-transfers" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          9. International data transfers
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium and its providers may operate in different countries. Where personal data is transferred internationally, we will use the transfer mechanisms, safeguards, notices, or permissions required by applicable law.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          The countries in which information is processed depend on the actual infrastructure and provider configuration. Cambium should publish or make available relevant transfer information when required.
        </p>
      </section>

      {/* 10. Data retention */}
      <section id="privacy-retention" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          10. Data retention
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          We retain personal data only for as long as reasonably necessary for the purposes described in this Policy, unless a longer period is required or permitted by law.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Retention periods may depend on:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Whether your account remains active.</li>
          <li>The type of information and feature involved.</li>
          <li>Security and fraud-prevention requirements.</li>
          <li>Legal, accounting, and dispute-resolution obligations.</li>
          <li>Backup and disaster-recovery cycles.</li>
          <li>Provider-specific retention behavior.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          When information is no longer required, we will delete it, anonymize it, or otherwise handle it in accordance with applicable law and our retention procedures.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Deletion from active systems may not immediately remove all copies from backups, logs, or systems that are subject to a documented retention cycle. Where applicable, such copies should be protected and removed according to that cycle.
        </p>
        <div className="rounded-xl p-4 bg-[#FAF7F0] border border-[#E4DCCB] text-xs font-mono text-[#85877B]">
          Cambium must establish actual retention periods and deletion procedures before making precise deletion-time promises.
        </div>
      </section>

      {/* 11. Your privacy rights */}
      <section id="privacy-rights" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          11. Your privacy rights
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Depending on your location and applicable law, you may have rights to:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Request access to personal data.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion or erasure.</li>
          <li>Withdraw consent where processing relies on consent.</li>
          <li>Object to or restrict certain processing.</li>
          <li>Request portability of data where applicable.</li>
          <li>Opt out of certain optional communications.</li>
          <li>Lodge a complaint with the relevant data protection authority.</li>
          <li>Exercise other rights provided by applicable law.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Some rights are subject to legal exceptions and verification requirements.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          To submit a request, contact <strong className="font-mono text-[#3E6248]">[Privacy email address]</strong>. We may ask for information reasonably necessary to verify your identity and protect your account. We will respond within the period required by applicable law.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          If your request concerns data controlled by a third-party publisher, repository, funder, or external website, we may direct you to that source or assist where reasonably possible. Cambium cannot guarantee that it can modify records controlled independently by another provider.
        </p>
      </section>

      {/* 12. Account access, correction, and deletion */}
      <section id="privacy-account-access" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          12. Account access, correction, and deletion
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Where account-management features are available, you may be able to update your profile and preferences directly.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          For access, correction, deletion, or other privacy requests, contact <span className="font-mono text-[#3E6248]">[Privacy email address]</span> if the required control is not available within the Service.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Deleting an account may result in the removal of associated profile information, saved items, preferences, and other account-linked content, subject to applicable law, legitimate retention requirements, technical constraints, and any applicable institutional agreement.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Content that has been lawfully shared with others or information independently controlled by third parties may not be removable from those parties' systems through Cambium.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          We will not represent account deletion as complete erasure from every backup, third-party provider, or independently controlled source unless that can be verified.
        </p>
      </section>

      {/* 13. Security */}
      <section id="privacy-security" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          13. Security
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We use or intend to implement appropriate technical and organizational safeguards designed to protect personal data against unauthorized access, alteration, disclosure, loss, or destruction.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Depending on the system and processing activity, safeguards may include access controls, least-privilege permissions, encryption in transit, secure credential management, monitoring, backups, vulnerability management, and restricted access to operational data.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          No internet service can guarantee absolute security. We therefore cannot promise that unauthorized access or loss will never occur.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Security claims must reflect the safeguards actually deployed. If a personal-data incident occurs, we will take appropriate response measures and provide notifications where required by applicable law.
        </p>
      </section>

      {/* 14. Children's privacy */}
      <section id="privacy-children" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          14. Children's privacy
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium is designed primarily for researchers and other users capable of lawfully using a professional research service.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium is not intended to collect children's personal data unlawfully or to bypass age-related consent requirements.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          If applicable law requires parental or guardian consent, age verification, or additional protections, those requirements must be satisfied before the relevant processing occurs.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          If you believe a child has provided personal data in circumstances that violate applicable law or this Policy, contact <span className="font-mono text-[#3E6248]">[Privacy email address]</span>.
        </p>
      </section>

      {/* 15. Third-party links and services */}
      <section id="privacy-third-party" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          15. Third-party links and services
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may link to publishers, funders, journals, research repositories, institutional websites, APIs, and other external services.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We do not control their independent privacy practices. Once you leave Cambium or interact directly with an external provider, its policies and terms may apply.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Review the provider's privacy and licensing terms before submitting information or reusing content.
        </p>
      </section>

      {/* 16. Automated processing and recommendations */}
      <section id="privacy-automated" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          16. Automated processing and recommendations
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may use automated systems to rank, filter, categorize, or recommend research opportunities based on information such as your research interests, search activity, or available metadata.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          These systems are designed to assist discovery, not to make binding academic, funding, employment, or publication decisions about you.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Recommendations may be incomplete, may not reflect every relevant opportunity, and may change as data and ranking methods change.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Where applicable law grants rights relating to automated decision-making or profiling, Cambium will provide the notices and mechanisms required by that law.
        </p>
      </section>

      {/* 17. Changes to this Policy */}
      <section id="privacy-changes" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          17. Changes to this Policy
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We may update this Policy as Cambium's features, providers, data practices, or legal obligations change.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          The updated version will display a revised “Last updated” date. If a material change requires advance notice or consent, we will provide it as required by law.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          The version published on this page applies from its stated effective date, subject to any mandatory legal requirements.
        </p>
      </section>

      {/* 18. Contact and complaints */}
      <section id="privacy-contact" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          18. Contact and complaints
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          For questions, requests, or complaints about privacy, contact:
        </p>
        <div className="bg-white rounded-xl p-5 border border-[#E4DCCB] shadow-2xs space-y-2 font-sans text-sm text-[#202920] mb-4">
          <div className="font-semibold text-base font-serif text-[#202920]">Cambium Privacy Contact</div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Email:</strong> <span className="text-[#3E6248] font-mono">[Privacy email address]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Operator:</strong> <span className="text-[#202920]">[Full legal name or registered entity]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Address:</strong> <span className="text-[#202920]">[Address, where required]</span></div>
        </div>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          If applicable law provides a right to complain to a data protection authority, you may exercise that right through the appropriate authority in your jurisdiction.
        </p>
      </section>

      {/* Publication note */}
      <div className="pt-8 border-t border-[#E4DCCB]">
        <div className="rounded-xl p-4 bg-[#FAF7F0] border border-[#E4DCCB] text-xs font-mono text-[#85877B] leading-relaxed">
          <strong className="text-[#202920] font-sans">Publication note:</strong> Before publishing, confirm the legal operator, privacy contact, actual data categories, AI providers, hosting regions, analytics and cookie behavior, retention periods, account-deletion behavior, and applicable legal requirements. Remove or revise any statement that does not accurately describe the live product.
        </div>
      </div>
    </div>
  );
}
