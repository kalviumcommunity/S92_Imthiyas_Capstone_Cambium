import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

const initials = ["ER", "JK", "SP", "AC", "MB"];
const colors = ["bg-navy-light text-navy", "bg-iris-light text-iris", "bg-sage-light text-sage", "bg-amber-light text-amber", "bg-surface-3 text-ink-2"];

function InstitutionBadge({ name, verified, className = "" }: { name: string; verified?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] bg-surface-2 text-ink-2 rounded border border-line font-medium ${className}`}>
      {verified && (
        <svg className="w-3 h-3 text-navy flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      )}
      {name}
    </span>
  );
}

function Avatar({ initials: init, size = "md", status, color = 0 }: { initials: string; size?: "xs" | "sm" | "md" | "lg" | "xl"; status?: "online" | "away" | "offline"; color?: number }) {
  const sizes = { xs: "w-6 h-6 text-[9px]", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-xl" };
  const statusColors = { online: "bg-sage", away: "bg-amber", offline: "bg-surface-3 border border-line-2" };
  const indicatorSizes = { xs: "w-1.5 h-1.5", sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3", xl: "w-4 h-4" };
  return (
    <div className="relative inline-block">
      <div className={`${sizes[size]} ${colors[color]} rounded-full flex items-center justify-center font-bold`}>
        {init}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 ${indicatorSizes[size]} ${statusColors[status]} rounded-full ring-2 ring-white`} />
      )}
    </div>
  );
}

function AvatarGroup({ count = 5 }: { count?: number }) {
  return (
    <div className="flex -space-x-2.5">
      {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
        <div key={i} className="ring-2 ring-white rounded-full">
          <Avatar initials={initials[i]} size="sm" color={i} />
        </div>
      ))}
      {count > 4 && (
        <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-white flex items-center justify-center text-[10px] text-ink-3 font-medium ring-2 ring-white">
          +{count - 4}
        </div>
      )}
    </div>
  );
}

function ProfileMiniCard() {
  return (
    <div className="flex items-center gap-3 p-3 bg-surface border border-line rounded-lg hover:border-line-2 transition-colors cursor-pointer group w-72">
      <Avatar initials="ER" size="md" status="online" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink leading-tight">Dr. Elena Rodriguez</p>
        <p className="text-xs text-ink-3">Research Scientist · MIT</p>
      </div>
      <button className="text-xs text-navy font-medium opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        Follow
      </button>
    </div>
  );
}

function ResearcherProfileCard() {
  return (
    <div className="bg-surface border border-line rounded-xl p-5 w-80">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Avatar initials="ER" size="lg" />
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-sage rounded-full flex items-center justify-center ring-2 ring-white">
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-medium text-ink leading-tight">Dr. Elena Rodriguez</h3>
            <span className="text-[10px] bg-navy-light text-navy px-1.5 py-0.5 rounded font-medium">Verified</span>
          </div>
          <p className="text-xs text-ink-3 mt-0.5">Research Scientist · Privacy-Preserving AI</p>
          <InstitutionBadge name="MIT CSAIL" verified className="mt-1.5" />
        </div>
      </div>

      <p className="text-xs text-ink-2 leading-relaxed mb-4">
        Building privacy-preserving machine learning systems for healthcare applications. Interested in federated learning, differential privacy, and clinical AI.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {["Federated Learning", "Privacy", "Medical AI", "NLP"].map(t => (
          <span key={t} className="text-[10px] bg-surface-2 text-ink-3 px-2 py-0.5 rounded border border-line">
            {t}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Papers", val: "28" },
          { label: "Citations", val: "1.2k" },
          { label: "Projects", val: "6" },
        ].map(({ label, val }) => (
          <div key={label} className="text-center bg-surface-2 rounded-lg py-2">
            <p className="text-sm font-semibold text-ink">{val}</p>
            <p className="text-[10px] text-ink-3">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-1.5 text-xs border border-line text-ink-2 hover:border-navy hover:text-navy rounded-md transition-colors font-medium">
          Follow
        </button>
        <button className="flex-1 py-1.5 text-xs bg-navy text-white hover:bg-navy-mid rounded-md transition-colors font-medium">
          Connect
        </button>
        <button className="w-9 h-8 flex items-center justify-center border border-line rounded-md text-ink-3 hover:border-line-2 hover:text-ink transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function ProfileHeader() {
  return (
    <div className="bg-surface border border-line rounded-xl overflow-hidden max-w-2xl">
      <div className="h-24 bg-gradient-to-r from-navy to-navy-mid" />
      <div className="px-6 pb-5">
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="w-16 h-16 rounded-full bg-navy-light text-navy border-4 border-surface flex items-center justify-center text-lg font-bold">
            ER
          </div>
          <div className="flex gap-2 mb-0.5">
            <button className="px-3 py-1.5 text-xs border border-line text-ink-2 hover:border-line-2 rounded-md transition-colors font-medium">
              Message
            </button>
            <button className="px-3 py-1.5 text-xs bg-navy text-white hover:bg-navy-mid rounded-md transition-colors font-medium">
              Connect
            </button>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h2 className="font-serif text-lg font-medium text-ink">Dr. Elena Rodriguez</h2>
            <span className="text-[10px] bg-navy-light text-navy px-1.5 py-0.5 rounded font-medium">Verified researcher</span>
          </div>
          <p className="text-sm text-ink-3 mb-2">Research Scientist · Privacy-Preserving AI</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <InstitutionBadge name="MIT CSAIL" verified />
            <span className="inline-flex items-center gap-1 text-xs text-ink-3">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Cambridge, MA
            </span>
          </div>
          <div className="flex gap-5 text-sm">
            {[{ label: "Papers", val: "28" }, { label: "Citations", val: "1,247" }, { label: "h-index", val: "14" }].map(({ label, val }) => (
              <div key={label}>
                <span className="font-semibold text-ink">{val}</span>
                <span className="text-ink-3 ml-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSection() {
  return (
    <SectionWrapper
      id="profile"
      number="09"
      title="Profile Components"
      description="Researcher identity and academic profile components. Human, credible, and immediately informative."
    >
      <ComponentGroup label="Avatar" note="Sizes and presence indicators" row>
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size, i) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar initials="ER" size={size} status={i === 2 ? "online" : i === 3 ? "away" : undefined} color={0} />
            <span className="text-[9px] text-ink-3 uppercase tracking-widest">{size}</span>
          </div>
        ))}
      </ComponentGroup>

      <ComponentGroup label="Avatar Group" note="Collaborator stacks with overflow count" row>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <AvatarGroup count={3} />
            <span className="text-xs text-ink-3">3 collaborators</span>
          </div>
          <div className="flex items-center gap-4">
            <AvatarGroup count={6} />
            <span className="text-xs text-ink-3">6 collaborators</span>
          </div>
        </div>
      </ComponentGroup>

      <ComponentGroup label="Profile Mini Card" note="Compact profile for inline contexts">
        <ProfileMiniCard />
      </ComponentGroup>

      <ComponentGroup label="Researcher Card" note="Full researcher profile with metrics and actions">
        <ResearcherProfileCard />
      </ComponentGroup>

      <ComponentGroup label="Profile Header" note="Full profile header with banner">
        <ProfileHeader />
      </ComponentGroup>

      <ComponentGroup label="Institution Badges" note="Verified and unverified institutions" row wrap>
        <InstitutionBadge name="MIT CSAIL" verified />
        <InstitutionBadge name="Stanford HAI" verified />
        <InstitutionBadge name="University of Oxford" />
        <InstitutionBadge name="Independent researcher" />
      </ComponentGroup>

      <ComponentGroup label="Connection States" note="Follow and connection status" row wrap>
        {[
          { label: "Not following", cls: "border border-line text-ink-2 hover:border-navy hover:text-navy" },
          { label: "Following", cls: "bg-navy-light text-navy border border-navy/20" },
          { label: "Connected", cls: "bg-sage-light text-sage border border-sage/20" },
          { label: "Available", cls: "border border-sage text-sage" },
        ].map(({ label, cls }) => (
          <button key={label} className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${cls}`}>
            {label}
          </button>
        ))}
      </ComponentGroup>
    </SectionWrapper>
  );
}
