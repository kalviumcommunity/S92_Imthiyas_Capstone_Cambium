import React from "react";
import { AlertCircle, Scale } from "lucide-react";

export function TermsContent() {
  return (
    <div className="space-y-12">
      {/* Preamble */}
      <div className="border-b border-[#E4DCCB] pb-8">
        <p className="font-serif text-lg leading-relaxed text-[#202920]/90 mb-4">
          Welcome to <strong className="font-semibold text-[#202920]">Cambium</strong>.
        </p>
        <p className="font-serif text-[17px] leading-relaxed text-[#202920]/85 mb-4">
          These Terms of Service (“Terms”) govern your access to and use of Cambium, an AI-powered Research Opportunity Discovery and Intelligence Platform (“Cambium,” “Service,” “we,” “us,” or “our”).
        </p>
        <p className="font-serif text-[17px] leading-relaxed text-[#202920]/85 mb-4">
          Cambium helps researchers discover, explore, organize, and evaluate research opportunities and scholarly information, including grants, calls for papers, journals, research publications, research trends, and related resources.
        </p>
        <div className="rounded-xl p-4 bg-[#FAF7F0] border border-[#3E6248]/30 flex items-start gap-3 mt-4">
          <Scale size={20} className="text-[#3E6248] shrink-0 mt-0.5" />
          <p className="font-sans text-sm text-[#202920] font-medium m-0 leading-relaxed">
            By accessing or using Cambium, you agree to these Terms. If you do not agree, do not use the Service.
          </p>
        </div>
      </div>

      {/* 1. Who operates Cambium */}
      <section id="who-operates" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          1. Who operates Cambium
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium is operated by:
        </p>
        <div className="bg-white rounded-xl p-5 border border-[#E4DCCB] shadow-2xs space-y-2 font-sans text-sm text-[#202920]">
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Operator:</strong> <span className="text-[#202920] font-medium">[Full legal name or registered entity]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Address:</strong> <span className="text-[#202920]">[Business or service address, where legally required]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Contact:</strong> <span className="text-[#3E6248] font-mono">[Support email]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Legal inquiries:</strong> <span className="text-[#3E6248] font-mono">[Legal contact email]</span></div>
        </div>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mt-4">
          References to “Cambium” in these Terms refer to the operator identified above and the Cambium service operated by that person or entity.
        </p>
      </section>

      {/* 2. Eligibility and accounts */}
      <section id="eligibility-accounts" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          2. Eligibility and accounts
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You must have the legal capacity to agree to these Terms under the laws applicable to you.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          If you use Cambium on behalf of a university, research institution, company, or other organization, you represent that you are authorized to accept these Terms on its behalf where applicable.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Certain features may require an account. If account registration is offered, you agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Provide accurate information and keep it reasonably up to date.</li>
          <li>Protect your credentials and notify us of suspected unauthorized access.</li>
          <li>Use your account only for lawful purposes.</li>
          <li>Not impersonate another person or misrepresent your institutional affiliation.</li>
          <li>Not create accounts or access the Service in violation of applicable law or these Terms.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You are responsible for activity conducted through your account, except to the extent applicable law provides otherwise or the activity results from circumstances for which you are not legally responsible.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          We may introduce individual, team, institutional, or other account types. Additional terms may apply to specific offerings.
        </p>
      </section>

      {/* 3. What Cambium provides */}
      <section id="what-cambium-provides" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          3. What Cambium provides
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Cambium is designed to support research discovery and informed decision-making. Depending on the features available at the time, the Service may include:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Discovery of research grants and funding opportunities.</li>
          <li>Calls for papers, conferences, journals, and publication-related information.</li>
          <li>Research publications, scholarly metadata, and related links.</li>
          <li>Search, filtering, categorization, and relevance ranking.</li>
          <li>Research profiles and interest-based personalization.</li>
          <li>Bookmarks, saved opportunities, and deadline tracking.</li>
          <li>Research trend exploration and AI-assisted recommendations.</li>
          <li>Future features such as semantic retrieval, research intelligence, and collaborative or institutional workspaces.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Features may change as Cambium develops. We may introduce, modify, suspend, or discontinue features, subject to applicable law and any separate contractual commitments.
        </p>
        <div className="rounded-xl p-4 bg-white border border-[#E4DCCB] text-sm font-sans text-[#62685E] leading-relaxed">
          <strong className="text-[#202920]">Platform Role:</strong> Cambium is a discovery and decision-support tool. It does not guarantee that any particular opportunity, publication venue, funder, researcher, or collaboration will be suitable or available.
        </div>
      </section>

      {/* 4. Research information and third-party sources */}
      <section id="third-party-sources" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          4. Research information and third-party sources
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may obtain, reference, index, process, or display information from third-party websites, scholarly databases, public APIs, funders, publishers, journals, universities, repositories, and other sources.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Such information may include titles, abstracts, metadata, eligibility criteria, funding amounts, application deadlines, publication details, links, and other opportunity-related information.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Third-party information:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>May be incomplete, delayed, inaccurate, outdated, duplicated, or changed by its original provider.</li>
          <li>May be subject to separate copyright, database rights, licenses, access conditions, or terms of service.</li>
          <li>May be withdrawn, restricted, or become unavailable without notice.</li>
          <li>May not be independently verified by Cambium in every instance.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Where practical, Cambium may identify a source, provide a link to the original page, display relevant dates, or indicate the source of an item. You should consult the authoritative source before relying on information for an important decision.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          A listing on Cambium does not imply endorsement by the funder, publisher, journal, institution, author, or other source.
        </p>
      </section>

      {/* 5. AI-assisted features */}
      <section id="ai-assisted-features" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          5. AI-assisted features
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may use artificial intelligence, machine learning, semantic retrieval, ranking systems, language models, or other automated methods to support search, discovery, personalization, summarization, classification, and recommendations.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          AI-generated or AI-assisted outputs may be inaccurate, incomplete, misleading, outdated, or unsuitable for your specific research needs. They may omit relevant context, misinterpret source material, or produce statements that are not supported by the available evidence.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You agree to treat AI outputs as assistance rather than verified fact. Where available, inspect the cited or linked source material and independently verify important claims.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Cambium does not guarantee that:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Every recommendation will be relevant to your research.</li>
          <li>Every relevant opportunity will be discovered.</li>
          <li>Every summary accurately captures the original material.</li>
          <li>Every source, citation, eligibility condition, or deadline is correct.</li>
          <li>AI-generated content is original, exhaustive, or free from errors.</li>
        </ul>
        <div className="rounded-xl p-4 bg-[#FAF7F0] border-l-4 border-l-[#3E6248] border border-[#E4DCCB] text-sm font-sans text-[#202920]">
          <strong>Notice:</strong> AI features are not a substitute for professional, academic, legal, financial, ethical, or institutional judgment.
        </div>
      </section>

      {/* 6. Research decisions and opportunity verification */}
      <section id="research-decisions" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          6. Research decisions and opportunity verification
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You remain responsible for your research decisions and for determining whether an opportunity or publication venue is appropriate for you.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Before acting on information found through Cambium, independently verify, as applicable:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Application and submission deadlines, including time zones.</li>
          <li>Eligibility requirements and geographic restrictions.</li>
          <li>Funding amounts, conditions, and availability.</li>
          <li>Required documents and application procedures.</li>
          <li>Publication fees, peer-review policies, indexing claims, and journal legitimacy.</li>
          <li>Conference legitimacy, submission requirements, and relevant dates.</li>
          <li>Institutional, funder, ethics committee, and regulatory requirements.</li>
          <li>The accuracy, provenance, licensing, and suitability of source material.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Cambium does not submit grant applications, guarantee funding, guarantee publication, certify journal quality, or act as a funder, publisher, academic institution, or research ethics authority unless a specific written agreement expressly states otherwise.
        </p>
      </section>

      {/* 7. Acceptable use */}
      <section id="acceptable-use" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          7. Acceptable use
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          You may use Cambium only for lawful research discovery, academic, educational, professional, and other purposes permitted by the Service.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          You must not:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Violate applicable law, sanctions, or third-party rights.</li>
          <li>Use Cambium to infringe copyright, database rights, privacy rights, or intellectual property rights.</li>
          <li>Scrape, harvest, copy, or systematically extract Service data in violation of applicable law, these Terms, or relevant source licenses.</li>
          <li>Circumvent access controls, rate limits, authentication, or security measures.</li>
          <li>Probe, scan, or test the vulnerability of the Service without authorization.</li>
          <li>Introduce malware, malicious code, or harmful payloads.</li>
          <li>Interfere with the Service, its infrastructure, or other users.</li>
          <li>Reverse engineer or attempt to extract protected source code, model weights, or confidential system components, except where such restriction is prohibited by applicable law.</li>
          <li>Use the Service to distribute unlawful, deceptive, defamatory, or malicious content.</li>
          <li>Misrepresent the provenance of research findings, AI outputs, or third-party content.</li>
          <li>Use Cambium or its outputs to build a competing dataset or service in violation of applicable rights, licenses, or law.</li>
          <li>Attempt to access another user's account, private workspace, saved material, or personal data without authorization.</li>
          <li>Use automated access in a manner that overloads the Service or violates published technical restrictions.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Nothing in these Terms removes rights that applicable law does not permit us to restrict.
        </p>
      </section>

      {/* 8. User content and research materials */}
      <section id="user-content" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          8. User content and research materials
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Depending on available features, you may submit or store profile information, research interests, notes, search queries, bookmarks, uploaded materials, prompts, feedback, or other content (“User Content”).
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You retain ownership of your User Content to the extent you own it and applicable law recognizes that ownership.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You grant Cambium a limited, non-exclusive license to host, store, reproduce, process, transmit, and display your User Content only as reasonably necessary to provide, secure, maintain, and improve the features you use, comply with law, and enforce these Terms.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4 font-semibold text-[#202920]">
          This license does not transfer ownership of your original work to Cambium.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You represent that you have the rights and permissions necessary to submit the content and authorize the processing described above.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Do not submit confidential, unpublished, restricted, personal, or institutionally sensitive research material unless you have the necessary authority and have reviewed the relevant privacy, security, and AI-processing disclosures.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          If Cambium introduces public sharing, collaboration, or institutional workspaces, visibility and access will depend on the relevant feature settings and applicable terms. Do not assume that material is private unless the Service explicitly identifies it as private.
        </p>
      </section>

      {/* 9. Intellectual property */}
      <section id="intellectual-property" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          9. Intellectual property
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium's software, interface, branding, design, original documentation, and other original Service materials are owned by or licensed to the operator, subject to applicable law and third-party rights.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Except as permitted by law or expressly authorized in writing, you may not copy, redistribute, modify, sell, sublicense, or commercially exploit protected parts of the Service.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Third-party publications, metadata, logos, names, abstracts, datasets, and other materials remain subject to their respective rights and licenses. Their appearance on Cambium does not transfer ownership or grant you permission to reuse them beyond the rights available under applicable law or license.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          You must comply with relevant attribution requirements, source terms, and license restrictions.
        </p>
      </section>

      {/* 10. Third-party services and links */}
      <section id="third-party-services" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          10. Third-party services and links
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may link to or integrate with external services, websites, APIs, repositories, authentication providers, AI providers, analytics providers, or infrastructure providers.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Those services are operated independently and may have their own terms, privacy policies, availability, and restrictions.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium does not control every third-party service and is not responsible for its independent content, policies, security, or availability, except where applicable law provides otherwise.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Your use of a third-party service is governed by its applicable terms.
        </p>
      </section>

      {/* 11. Privacy */}
      <section id="privacy" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          11. Privacy
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Your use of Cambium is also governed by the Cambium Privacy Policy, which explains how personal data is handled.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          The Privacy Policy is incorporated into these Terms by reference to the extent permitted by applicable law.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          If a separate data processing agreement or institutional agreement applies to your use of Cambium, its terms govern the matters expressly addressed by that agreement.
        </p>
      </section>

      {/* 12. Service availability and changes */}
      <section id="service-availability" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          12. Service availability and changes
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We aim to provide a useful and reliable service, but we do not guarantee uninterrupted, error-free, or continuously available operation.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          The Service may be unavailable or limited because of maintenance, updates, infrastructure failures, security incidents, third-party outages, data-provider changes, network issues, or circumstances beyond our reasonable control.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We may update the Service to improve security, performance, functionality, usability, or compliance.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Where a material change requires notice under applicable law or a separate agreement, we will provide that notice as required.
        </p>
      </section>

      {/* 13. Free features, subscriptions, and payments */}
      <section id="subscriptions-payments" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          13. Free features, subscriptions, and payments
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may initially offer free features and may introduce paid plans, subscriptions, usage limits, institutional plans, or other commercial offerings in the future.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Unless a paid offering is expressly presented to you, these Terms do not themselves create a payment obligation.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Before purchasing a paid offering, you will be shown the applicable price, billing frequency, included features, taxes where applicable, renewal terms, cancellation process, and any additional conditions required by law.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Where subscriptions are offered, cancellation, refunds, renewals, and billing disputes will be handled according to the applicable plan terms and mandatory consumer protection law.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          We will not treat a future paid feature as an existing contractual commitment merely because it appears on a roadmap.
        </p>
      </section>

      {/* 14. Suspension and termination */}
      <section id="suspension-termination" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          14. Suspension and termination
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          You may stop using Cambium at any time. If account deletion is available, you may use the provided process or contact <span className="font-mono text-[#3E6248]">[Support email]</span>.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          We may restrict, suspend, or terminate access where reasonably necessary to:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Address a material breach of these Terms.</li>
          <li>Prevent fraud, abuse, security incidents, or unlawful activity.</li>
          <li>Protect users, third parties, or the Service.</li>
          <li>Comply with a legal obligation or valid legal process.</li>
          <li>Address non-payment for a paid offering, subject to applicable law and the relevant contract.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Where appropriate and legally permitted, we will provide notice and an opportunity to resolve the issue.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Termination does not automatically eliminate obligations or rights that accrued before termination.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Sections that by their nature should survive termination will continue to apply, including applicable intellectual property provisions, disclaimers, liability limitations, dispute provisions, and outstanding payment obligations.
        </p>
      </section>

      {/* 15. Disclaimers */}
      <section id="disclaimers" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          15. Disclaimers
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          To the maximum extent permitted by applicable law, Cambium is provided on an “as available” basis.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We do not warrant that the Service will always be uninterrupted, secure, error-free, complete, accurate, or suitable for every research purpose.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We do not guarantee the availability, legitimacy, eligibility, success, funding outcome, publication outcome, or suitability of any third-party opportunity or resource.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Nothing in these Terms excludes a warranty, consumer right, or statutory protection that cannot lawfully be excluded or limited.
        </p>
      </section>

      {/* 16. Limitation of liability */}
      <section id="limitation-liability" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          16. Limitation of liability
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          To the maximum extent permitted by applicable law, Cambium and its operator will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, funding, business opportunities, goodwill, data, or anticipated research outcomes arising from or related to use of the Service.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          This includes reliance on inaccurate or outdated research information, missed deadlines, third-party content, AI-generated outputs, or the unavailability of external services, subject to any liability that cannot lawfully be excluded.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          To the maximum extent permitted by applicable law, the aggregate liability of the operator for claims arising from the Service will be limited to the greater of:
        </p>
        <div className="bg-white rounded-xl p-5 border border-[#E4DCCB] space-y-2 font-serif text-[16px] leading-relaxed text-[#202920] mb-4">
          <div>(a) the amount you paid directly to Cambium for the Service during the twelve months before the event giving rise to the claim; or</div>
          <div>(b) <strong className="font-sans font-semibold">INR 1,000</strong>, where permitted by law.</div>
        </div>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          This limitation does not apply where prohibited by law and does not exclude liability that cannot lawfully be excluded, including applicable liability for fraud, willful misconduct, or other non-excludable obligations.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          If you are a consumer in a jurisdiction that does not permit a particular limitation, that limitation applies only to the extent legally permitted.
        </p>
      </section>

      {/* 17. Indemnification */}
      <section id="indemnification" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          17. Indemnification
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          To the extent permitted by applicable law, you are responsible for claims arising from your unlawful use of Cambium, your material breach of these Terms, or your infringement of third-party rights through content you submit.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Nothing in this section requires you to indemnify Cambium for losses caused by Cambium's own unlawful conduct, negligence where liability cannot be excluded, or other non-excludable obligations.
        </p>
      </section>

      {/* 18. Changes to these Terms */}
      <section id="changes-to-terms" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          18. Changes to these Terms
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We may revise these Terms as Cambium evolves, laws change, or new features are introduced.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          The updated version will be published with a revised “Last updated” date. Where required by law, we will provide advance notice or obtain consent before material changes take effect.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Continued use after revised Terms become effective may constitute acceptance where permitted by law. If you do not agree to a material change, you should stop using the affected Service.
        </p>
      </section>

      {/* 19. Governing law and disputes */}
      <section id="governing-law" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          19. Governing law and disputes
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          These Terms are governed by the laws of <span className="font-mono text-[#3E6248]">[Jurisdiction]</span>, without prejudice to mandatory legal protections that apply to you.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Disputes will be handled by the courts or dispute-resolution process of <span className="font-mono text-[#3E6248]">[Venue]</span>, subject to applicable law and any non-waivable consumer rights.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Before initiating formal proceedings, the parties may attempt to resolve a dispute through good-faith communication using <span className="font-mono text-[#3E6248]">[Legal contact email]</span>. This does not limit any statutory rights or urgent legal remedies.
        </p>
        <div className="rounded-xl p-4 bg-[#FAF7F0] border-l-4 border-l-amber-600 border border-[#E4DCCB] text-xs font-mono text-[#8A5A12] flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>Do not publish this section until the operator's jurisdiction and appropriate dispute provisions have been confirmed.</span>
        </div>
      </section>

      {/* 20. General provisions */}
      <section id="general-provisions" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          20. General provisions
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          If a provision of these Terms is held unenforceable, the remaining provisions will continue to apply to the extent legally permitted.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Our failure to enforce a provision is not a waiver of our rights.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You may not transfer your rights or obligations under these Terms where the transfer is prohibited by law or requires our consent. We may transfer the Service or these Terms as part of a lawful restructuring, subject to applicable law and user rights.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          These Terms, together with the Privacy Policy and any applicable additional terms, form the agreement governing your use of Cambium, except where a separate written agreement expressly supersedes them.
        </p>
      </section>

      {/* 21. Contact */}
      <section id="contact" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          21. Contact
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          For questions about these Terms, contact:
        </p>
        <div className="bg-white rounded-xl p-5 border border-[#E4DCCB] shadow-2xs space-y-2 font-sans text-sm text-[#202920]">
          <div className="font-semibold text-base font-serif text-[#202920]">Cambium Legal</div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Email:</strong> <span className="text-[#3E6248] font-mono">[Legal contact email]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Operator:</strong> <span className="text-[#202920]">[Full legal name or registered entity]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Address:</strong> <span className="text-[#202920]">[Address, where required]</span></div>
        </div>
      </section>

      {/* Publication note */}
      <div className="pt-8 border-t border-[#E4DCCB]">
        <div className="rounded-xl p-4 bg-[#FAF7F0] border border-[#E4DCCB] text-xs font-mono text-[#85877B] leading-relaxed">
          <strong className="text-[#202920] font-sans">Publication note:</strong> Replace every bracketed placeholder and verify that the provisions match Cambium's actual features, operational practices, and legal jurisdiction before publication.
        </div>
      </div>
    </div>
  );
}
