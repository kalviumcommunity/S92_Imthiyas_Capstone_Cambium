import React from "react";
import { Sparkles, Compass, CheckCircle2, ShieldAlert } from "lucide-react";

export function DisclaimerContent() {
  return (
    <div className="space-y-12">
      {/* Preamble */}
      <div className="border-b border-[#E4DCCB] pb-8">
        <p className="font-serif text-[17px] leading-relaxed text-[#202920]/90 mb-4">
          <strong className="font-semibold text-[#202920]">Cambium</strong> helps researchers discover research opportunities, scholarly information, funding resources, publication venues, and related research signals. This page explains the limitations of information and AI-assisted features available through Cambium.
        </p>
        <p className="font-serif text-[17px] leading-relaxed text-[#202920]/85 mb-4">
          This Disclaimer supplements the Cambium Terms of Service. If there is a conflict, the Terms of Service govern general use of the platform, while this page explains the specific limitations of research information and AI-assisted outputs, subject to applicable law.
        </p>
        <div className="rounded-xl p-4 bg-[#FAF7F0] border border-[#3E6248]/30 flex items-start gap-3 mt-4">
          <Compass size={20} className="text-[#3E6248] shrink-0 mt-0.5" />
          <p className="font-sans text-sm text-[#202920] font-medium m-0 leading-relaxed">
            Cambium is an intelligent discovery accelerator. Critical academic, institutional, and funding decisions must always be corroborated with primary authoritative authorities.
          </p>
        </div>
      </div>

      {/* 1. Research discovery, not a guarantee */}
      <section id="disclaimer-discovery" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          1. Research discovery, not a guarantee
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium is a research discovery and decision-support platform. It helps you find and organize information; it does not guarantee that every relevant opportunity will be identified or that every displayed result is complete, current, or suitable for you.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Search results, recommendations, rankings, summaries, and related information depend on the sources, metadata, retrieval methods, and features available at the time.
        </p>
        <div className="bg-white rounded-xl p-4 border border-[#E4DCCB] text-sm font-sans text-[#62685E]">
          A result's absence from Cambium does not mean the opportunity does not exist. Its presence does not mean the opportunity is legitimate, open, suitable, or endorsed by Cambium.
        </div>
      </section>

      {/* 2. Verify information with the original source */}
      <section id="disclaimer-verify" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          2. Verify information with the original source
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Research opportunities and scholarly records may change after they are indexed or displayed.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Before relying on any result, verify the relevant details directly with the responsible funder, publisher, journal, conference organizer, institution, or original source. In particular, verify:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>Application, submission, and registration deadlines.</li>
          <li>Time zones and deadline extensions.</li>
          <li>Eligibility, geographic restrictions, and required qualifications.</li>
          <li>Funding amounts, availability, award conditions, and application requirements.</li>
          <li>Journal scope, indexing claims, publication fees, editorial policies, and peer-review practices.</li>
          <li>Conference legitimacy, submission requirements, and event details.</li>
          <li>Publication metadata, licensing, retraction notices, and source updates.</li>
          <li>Any other fact that could materially affect a research or funding decision.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 font-medium">
          A link, listing, summary, or recommendation on Cambium is not a substitute for the authoritative source.
        </p>
      </section>

      {/* 3. AI-generated and AI-assisted outputs */}
      <section id="disclaimer-ai-outputs" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          3. AI-generated and AI-assisted outputs
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may use AI to support search, ranking, summarization, classification, recommendations, semantic retrieval, or other research-discovery tasks.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          AI systems can produce inaccurate, incomplete, outdated, misleading, or unsupported statements. They may misinterpret a source, omit an important condition, combine information incorrectly, or present uncertain conclusions too confidently.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          AI-generated content should therefore be treated as a starting point for investigation, not as verified research evidence.
        </p>
        <div className="rounded-xl p-4 bg-[#FAF7F0] border-l-4 border-l-[#3E6248] border border-[#E4DCCB] text-sm font-sans text-[#202920]">
          Where citations or source links are provided, check that the linked material actually supports the associated claim. A citation's presence does not by itself prove that a generated statement is correct.
        </div>
      </section>

      {/* 4. Recommendations are not endorsements */}
      <section id="disclaimer-endorsements" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          4. Recommendations are not endorsements
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may rank or recommend opportunities based on available metadata, stated interests, search behavior, relevance signals, or other criteria.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          A high ranking does not guarantee quality, legitimacy, eligibility, funding probability, publication success, or research impact.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          A low ranking does not mean an opportunity is unimportant or unsuitable.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Unless expressly stated otherwise, recommendations are not endorsements by Cambium of a funder, journal, conference, publisher, institution, researcher, or commercial service.
        </p>
      </section>

      {/* 5. No guarantee of research, funding, or publication outcomes */}
      <section id="disclaimer-no-guarantee" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          5. No guarantee of research, funding, or publication outcomes
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-3">
          Cambium does not guarantee:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 font-serif text-[16px] leading-[1.75] text-[#202920]/90 mb-4">
          <li>That you will receive a grant, scholarship, award, or other funding.</li>
          <li>That a paper will be accepted, published, or cited.</li>
          <li>That a journal or conference will meet your requirements.</li>
          <li>That you will find a suitable collaborator.</li>
          <li>That a research trend or recommendation will lead to a successful outcome.</li>
          <li>That every relevant opportunity will be discovered before its deadline.</li>
          <li>That any research, academic, professional, or commercial result will follow from using the platform.</li>
        </ul>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Outcomes depend on factors beyond Cambium's control, including your qualifications, the quality of your work, competition, external evaluation, funding availability, and the policies of third parties.
        </p>
      </section>

      {/* 6. No professional or institutional advice */}
      <section id="disclaimer-no-advice" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          6. No professional or institutional advice
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium does not replace advice or decisions from qualified professionals, supervisors, research offices, funding bodies, institutional authorities, ethics committees, legal advisers, or other relevant experts.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          You are responsible for determining whether your planned research or application complies with applicable law, institutional policy, ethical requirements, funding conditions, and publication rules.
        </p>
        <div className="rounded-xl p-4 bg-white border border-[#E4DCCB] text-sm font-sans text-[#62685E]">
          Do not treat Cambium's outputs as legal advice, financial advice, medical advice, research ethics approval, or an official institutional determination.
        </div>
      </section>

      {/* 7. Third-party information and intellectual property */}
      <section id="disclaimer-third-party" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          7. Third-party information and intellectual property
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may display, index, process, or link to third-party metadata, abstracts, publications, funding announcements, journal information, and other research resources.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Those materials may be owned by third parties or subject to copyright, database rights, contractual restrictions, open-access licenses, or other terms.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Public accessibility does not automatically authorize copying, redistribution, commercial reuse, or unrestricted AI processing.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Users are responsible for respecting applicable rights and licenses when downloading, reproducing, distributing, or otherwise using third-party materials.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Cambium's display of a record does not transfer ownership or grant rights beyond those actually available under applicable law or license.
        </p>
      </section>

      {/* 8. Availability and changes */}
      <section id="disclaimer-availability" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          8. Availability and changes
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Third-party sources may change their content, access conditions, APIs, or availability without notice. Information may be delayed, withdrawn, or temporarily unavailable.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Cambium may update its indexing, ranking, and recommendation methods over time. As a result, results and recommendations may differ between searches or over time.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          We aim to improve the reliability of research discovery, but we do not guarantee uninterrupted access to every source or feature.
        </p>
      </section>

      {/* 9. Report an issue */}
      <section id="disclaimer-report" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          9. Report an issue
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          If you find a potentially incorrect deadline, broken source link, misleading record, duplicate listing, inaccurate AI-generated statement, or other material problem, please contact:
        </p>
        <div className="bg-white rounded-xl p-5 border border-[#E4DCCB] shadow-2xs space-y-2 font-sans text-sm text-[#202920] mb-4">
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Email:</strong> <span className="text-[#3E6248] font-mono">[Support or research-data contact email]</span></div>
          <div><strong className="text-[#62685E] font-mono text-xs uppercase tracking-wider">Subject:</strong> <span className="text-[#202920] font-mono text-xs font-semibold">Cambium — Research Information Correction</span></div>
        </div>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          Where possible, include the relevant Cambium page, the original source URL, a description of the issue, and supporting information.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          We may investigate and correct, annotate, restrict, or remove information where appropriate. We cannot guarantee that every reported issue will be resolved within a particular period or that a third-party source will make a corresponding correction.
        </p>
        <p className="font-sans text-xs text-[#85877B] italic">
          Please do not include confidential research material or unnecessary personal information in a report.
        </p>
      </section>

      {/* 10. Limitation and applicable law */}
      <section id="disclaimer-limitation" className="scroll-mt-28">
        <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-[#202920] mb-4 pb-2 border-b border-[#E4DCCB]/60">
          10. Limitation and applicable law
        </h2>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90 mb-4">
          This Disclaimer should be read together with the Cambium Terms of Service and Privacy Policy.
        </p>
        <p className="font-serif text-[16px] leading-[1.8] text-[#202920]/90">
          Nothing in this Disclaimer excludes or limits liability, warranties, consumer rights, or other protections that cannot lawfully be excluded or limited under applicable law.
        </p>
      </section>

      {/* Cambium's Guiding Principle Banner */}
      <div className="pt-8 border-t border-[#E4DCCB]">
        <div className="rounded-2xl p-6 sm:p-7 bg-[#FAF7F0] border-2 border-[#3E6248]/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#3E6248]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#3E6248]">
              Cambium's Guiding Principle
            </span>
          </div>
          <blockquote className="font-serif text-xl sm:text-2xl italic text-[#202920] leading-snug m-0">
            “Discover broadly. Evaluate critically. Verify at the source. Make research decisions with informed judgment.”
          </blockquote>
        </div>
      </div>
    </div>
  );
}
