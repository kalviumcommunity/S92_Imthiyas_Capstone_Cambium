import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function MatchBar({ score }: { score: number }) {
  const label = score >= 80 ? "Strong match" : score >= 60 ? "Good match" : "Partial match";
  const color = score >= 80 ? "bg-sage" : score >= 60 ? "bg-navy" : "bg-amber";
  const textColor = score >= 80 ? "text-sage" : score >= 60 ? "text-navy" : "text-amber";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${textColor}`}>{label}</span>
        <span className="text-xs text-ink-3">{score}% match</span>
      </div>
      <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function DeadlineBadge({ daysLeft, date }: { daysLeft: number; date: string }) {
  const urgent = daysLeft <= 7;
  const soon = daysLeft <= 21;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
        urgent
          ? "bg-crimson-light text-crimson"
          : soon
          ? "bg-amber-light text-amber"
          : "bg-surface-2 text-ink-2"
      }`}
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      {urgent ? `${daysLeft}d left` : `Deadline · ${date}`}
    </span>
  );
}

function EligibilityBadge({ eligible }: { eligible: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
        eligible ? "bg-sage-light text-sage" : "bg-surface-3 text-ink-3"
      }`}
    >
      {eligible ? (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 13l4 4L19 7"/>
        </svg>
      ) : (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      )}
      {eligible ? "You are eligible" : "Not eligible"}
    </span>
  );
}

function ApplicationProgress({ stage, stages }: { stage: number; stages: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-0 mb-2">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`relative flex flex-col items-center`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 ${
                  i < stage
                    ? "bg-sage border-sage text-white"
                    : i === stage
                    ? "bg-navy border-navy text-white"
                    : "bg-surface border-line text-ink-3"
                }`}
              >
                {i < stage ? (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-[9px] absolute -bottom-5 whitespace-nowrap font-medium ${i === stage ? "text-navy" : "text-ink-3"}`}>
                {s}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className={`h-0.5 w-12 ${i < stage ? "bg-sage" : "bg-line"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedOpportunity() {
  return (
    <div className="bg-surface border border-line rounded-xl p-6 max-w-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-navy-light border border-navy/10 flex items-center justify-center">
            <span className="text-navy font-bold text-sm">WT</span>
          </div>
          <div>
            <p className="text-xs text-ink-3">Wellcome Trust</p>
            <p className="text-[10px] text-ink-3">London, UK</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DeadlineBadge daysLeft={20} date="Sep 18" />
          <button className="text-ink-3 hover:text-navy transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      </div>

      <h3 className="font-serif text-ink text-lg font-medium leading-snug mb-2">
        Early Career Research Fellowship — Medical Imaging AI
      </h3>
      <p className="text-sm text-ink-3 leading-relaxed mb-4">
        A prestigious fellowship supporting early-career researchers developing AI solutions for medical imaging. Includes a two-year funding package, institutional affiliation, and mentorship from senior researchers.
      </p>

      <MatchBar score={92} />

      <div className="grid grid-cols-3 gap-3 my-5">
        {[
          { label: "Type", val: "Fellowship" },
          { label: "Duration", val: "2 years" },
          { label: "Funding", val: "£45,000/yr" },
        ].map(({ label, val }) => (
          <div key={label} className="bg-surface-2 rounded-lg p-3">
            <p className="text-[10px] text-ink-3 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-ink">{val}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-5">
        <EligibilityBadge eligible />
        <span className="text-xs text-ink-3">·</span>
        <span className="text-xs text-ink-3">Medical Imaging · Machine Learning</span>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 py-2 text-sm border border-line text-ink-2 hover:border-line-2 hover:text-ink rounded-md transition-colors font-medium">
          Save for later
        </button>
        <button className="flex-1 py-2 text-sm bg-navy text-white hover:bg-navy-mid rounded-md transition-colors font-medium">
          Start application →
        </button>
      </div>
    </div>
  );
}

function DeadlineTimeline() {
  const items = [
    { label: "Letter of Intent", date: "Aug 25", done: true },
    { label: "Full Application", date: "Sep 18", done: false, current: true },
    { label: "Review Period", date: "Oct–Nov", done: false },
    { label: "Decisions", date: "Dec 5", done: false },
  ];
  return (
    <div className="flex items-start gap-0 max-w-xl">
      {items.map((item, i) => (
        <div key={item.label} className="flex-1 flex flex-col items-center">
          <div className="flex items-center w-full">
            {i > 0 && <div className={`h-0.5 flex-1 ${item.done || items[i - 1].done ? "bg-navy" : "bg-line"}`} />}
            <div
              className={`w-4 h-4 rounded-full flex-shrink-0 border-2 ${
                item.done
                  ? "bg-sage border-sage"
                  : item.current
                  ? "bg-navy border-navy"
                  : "bg-surface border-line"
              }`}
            />
            {i < items.length - 1 && <div className={`h-0.5 flex-1 ${item.done ? "bg-navy" : "bg-line"}`} />}
          </div>
          <p className={`text-[10px] mt-2 text-center font-medium ${item.current ? "text-navy" : item.done ? "text-sage" : "text-ink-3"}`}>
            {item.label}
          </p>
          <p className="text-[9px] text-ink-3 mt-0.5">{item.date}</p>
        </div>
      ))}
    </div>
  );
}

export default function OpportunitySection() {
  return (
    <SectionWrapper
      id="opportunity"
      number="08"
      title="Opportunity Components"
      description="Components for discovering and applying to research opportunities — fellowships, grants, positions, and collaborations."
    >
      <ComponentGroup label="Featured Opportunity" note="Full opportunity card with match score">
        <FeaturedOpportunity />
      </ComponentGroup>

      <ComponentGroup label="Deadline Badges" note="Urgency levels based on time remaining" row wrap>
        <div className="flex flex-col gap-2">
          <DeadlineBadge daysLeft={3} date="Sep 5" />
          <span className="text-[10px] text-ink-3">Urgent (&lt;7 days)</span>
        </div>
        <div className="flex flex-col gap-2">
          <DeadlineBadge daysLeft={14} date="Sep 18" />
          <span className="text-[10px] text-ink-3">Soon (&lt;21 days)</span>
        </div>
        <div className="flex flex-col gap-2">
          <DeadlineBadge daysLeft={45} date="Oct 15" />
          <span className="text-[10px] text-ink-3">Upcoming</span>
        </div>
      </ComponentGroup>

      <ComponentGroup label="Match Indicators" note="Research alignment scoring">
        <div className="space-y-4 max-w-xs">
          <MatchBar score={92} />
          <MatchBar score={68} />
          <MatchBar score={41} />
        </div>
      </ComponentGroup>

      <ComponentGroup label="Eligibility Badges" row>
        <EligibilityBadge eligible />
        <EligibilityBadge eligible={false} />
      </ComponentGroup>

      <ComponentGroup label="Deadline Timeline" note="Visual progress through application stages">
        <DeadlineTimeline />
      </ComponentGroup>

      <ComponentGroup label="Application Progress" note="Multi-step application status">
        <div className="space-y-8 max-w-lg">
          <ApplicationProgress stage={1} stages={["Intent", "Application", "Review", "Decision"]} />
          <ApplicationProgress stage={3} stages={["Intent", "Application", "Review", "Decision"]} />
        </div>
      </ComponentGroup>
    </SectionWrapper>
  );
}
