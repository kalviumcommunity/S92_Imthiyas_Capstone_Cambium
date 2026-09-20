import SectionWrapper, { ComponentGroup } from "@/components/SectionWrapper";

function PresenceIndicator({ status }: { status: "online" | "away" | "busy" | "offline" }) {
  const colors = { online: "bg-sage", away: "bg-amber", busy: "bg-crimson", offline: "bg-surface-3 border border-line-2" };
  const labels = { online: "Online", away: "Away", busy: "Busy", offline: "Offline" };
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors[status]}`} />
      <span className="text-xs text-ink-2">{labels[status]}</span>
    </div>
  );
}

function ResearcherMatch() {
  return (
    <div className="bg-surface border border-line rounded-xl p-5 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <p className="text-xs font-medium text-navy">Suggested connection</p>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-navy-light text-navy flex items-center justify-center font-bold text-sm flex-shrink-0">
          ER
        </div>
        <div>
          <p className="text-sm font-medium text-ink">Dr. Elena Rodriguez</p>
          <p className="text-xs text-ink-3">Research Scientist · MIT CSAIL</p>
          <PresenceIndicator status="online" />
        </div>
      </div>

      <div className="bg-navy-light rounded-lg p-3 mb-4">
        <p className="text-xs text-navy-mid font-medium mb-2">3 shared research interests</p>
        <div className="flex flex-wrap gap-1.5">
          {["Federated Learning", "Medical AI", "Privacy"].map(t => (
            <span key={t} className="text-[10px] bg-white/60 text-navy px-2 py-0.5 rounded font-medium border border-navy/10">
              {t}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-3 mb-4 leading-relaxed">
        Dr. Rodriguez shares 3 research interests with you and recently published on federated learning in medical imaging — closely related to your current project.
      </p>

      <div className="flex gap-2">
        <button className="flex-1 py-1.5 text-xs border border-line text-ink-2 hover:border-line-2 rounded-md transition-colors font-medium">
          View profile
        </button>
        <button className="flex-1 py-1.5 text-xs bg-navy text-white hover:bg-navy-mid rounded-md transition-colors font-medium">
          Connect
        </button>
        <button className="py-1.5 px-2.5 text-xs border border-line text-ink-3 hover:border-line-2 rounded-md transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function MessagePreview() {
  const messages = [
    { from: "Dr. Elena Rodriguez", init: "ER", preview: "I saw your paper on differential privacy — would love to discuss collaboration on the healthcare angle.", time: "2h", read: false },
    { from: "Prof. James Kim", init: "JK", preview: "Thanks for connecting. Are you attending NeurIPS this year? I'm organizing a workshop on federated learning.", time: "1d", read: true },
    { from: "Dr. Sarah Patel", init: "SP", preview: "The dataset you shared is incredibly helpful. I've started preprocessing and will share results next week.", time: "3d", read: true },
  ];
  return (
    <div className="bg-surface border border-line rounded-lg overflow-hidden max-w-sm">
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Messages</p>
        <span className="text-[10px] bg-navy text-white px-1.5 py-0.5 rounded-full font-medium">1</span>
      </div>
      <div className="divide-y divide-line">
        {messages.map(({ from, init, preview, time, read }) => (
          <div key={from} className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-2 transition-colors cursor-pointer ${!read ? "bg-navy-light/30" : ""}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${!read ? "bg-navy text-white" : "bg-surface-2 text-ink-2"}`}>
              {init}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className={`text-xs ${!read ? "font-semibold text-ink" : "font-medium text-ink-2"} truncate`}>{from}</p>
                <span className="text-[10px] text-ink-3 flex-shrink-0">{time}</span>
              </div>
              <p className="text-[11px] text-ink-3 truncate mt-0.5 leading-relaxed">{preview}</p>
            </div>
            {!read && <span className="w-1.5 h-1.5 bg-navy rounded-full flex-shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageBubbles() {
  return (
    <div className="space-y-3 max-w-sm">
      <div className="flex items-end gap-2">
        <div className="w-7 h-7 rounded-full bg-surface-2 text-ink-3 flex items-center justify-center text-[10px] font-bold flex-shrink-0">ER</div>
        <div className="bg-surface-2 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-xs">
          <p className="text-sm text-ink leading-relaxed">I saw your work on federated learning — would love to discuss a potential collaboration.</p>
          <p className="text-[10px] text-ink-3 mt-1">2:14 PM</p>
        </div>
      </div>
      <div className="flex items-end justify-end gap-2">
        <div className="bg-navy rounded-2xl rounded-br-md px-4 py-2.5 max-w-xs">
          <p className="text-sm text-white leading-relaxed">That would be great! I'm working on cross-institutional datasets. Are you free for a call this week?</p>
          <p className="text-[10px] text-white/60 mt-1 text-right">2:16 PM · Delivered</p>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="w-7 h-7 rounded-full bg-surface-2 text-ink-3 flex items-center justify-center text-[10px] font-bold flex-shrink-0">ER</div>
        <div className="bg-surface-2 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-xs">
          <p className="text-sm text-ink leading-relaxed">Thursday works. I'll share the dataset overview beforehand.</p>
          <p className="text-[10px] text-ink-3 mt-1">2:18 PM</p>
        </div>
      </div>
    </div>
  );
}

function Comment() {
  return (
    <div className="space-y-3 max-w-md">
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-full bg-navy-light text-navy flex items-center justify-center text-xs font-bold flex-shrink-0">ER</div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-xs font-medium text-ink">Dr. Elena Rodriguez</p>
            <p className="text-[10px] text-ink-3">3 hours ago</p>
          </div>
          <div className="text-sm text-ink-2 leading-relaxed bg-surface-2 rounded-lg p-3 border border-line">
            The privacy budget allocation in Section 3.2 looks aggressive. Have you considered adaptive clipping strategies from the recent Kairouz et al. work?
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button className="text-[11px] text-ink-3 hover:text-navy flex items-center gap-1 transition-colors">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/></svg>
              6
            </button>
            <button className="text-[11px] text-ink-3 hover:text-ink transition-colors">Reply</button>
          </div>
          {/* Reply */}
          <div className="mt-3 ml-4 flex gap-2">
            <div className="w-6 h-6 rounded-full bg-surface-2 text-ink-3 flex items-center justify-center text-[9px] font-bold flex-shrink-0">JK</div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[11px] font-medium text-ink">Prof. James Kim</p>
                <p className="text-[10px] text-ink-3">1h ago</p>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">Good point — I'll reference the Kairouz paper in the revision and run additional ablations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem() {
  const activities = [
    { icon: "paper", actor: "Dr. Elena Rodriguez", action: "published a new paper", object: "Adaptive DP in Federated Learning", time: "2h ago", color: "text-navy" },
    { icon: "follow", actor: "Prof. James Kim", action: "started following your project", object: "Privacy-Preserving ML", time: "5h ago", color: "text-sage" },
    { icon: "comment", actor: "Dr. Sarah Patel", action: "commented on", object: "your hypothesis block", time: "1d ago", color: "text-ink-3" },
    { icon: "opp", actor: "Cambium", action: "found a new opportunity matching your profile", object: "NIH Data Science Fellowship", time: "2d ago", color: "text-amber" },
  ];
  const icons: Record<string, string> = {
    paper: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
    follow: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M20 8v6 M23 11h-6",
    comment: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    opp: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  };
  return (
    <div className="space-y-0 max-w-md border border-line rounded-lg overflow-hidden bg-surface divide-y divide-line">
      {activities.map(({ actor, action, object, time, icon, color }) => (
        <div key={actor + action} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-2 transition-colors">
          <div className={`mt-0.5 w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center flex-shrink-0 ${color}`}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d={icons[icon]}/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-2 leading-relaxed">
              <span className="font-medium text-ink">{actor}</span>{" "}{action}{" "}
              <span className="font-medium text-ink">{object}</span>
            </p>
            <p className="text-[10px] text-ink-3 mt-0.5">{time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CollaborationSection() {
  return (
    <SectionWrapper
      id="collaboration"
      number="10"
      title="Collaboration Components"
      description="Components for researcher discovery, messaging, and discussion. Human connections driven by research relevance."
    >
      <ComponentGroup label="Researcher Match" note="Suggested connection with shared interests">
        <ResearcherMatch />
      </ComponentGroup>
      <ComponentGroup label="Message Preview List" note="Conversation inbox">
        <MessagePreview />
      </ComponentGroup>
      <ComponentGroup label="Message Bubbles" note="Conversation thread">
        <MessageBubbles />
      </ComponentGroup>
      <ComponentGroup label="Comment & Thread" note="Inline discussion on research blocks">
        <Comment />
      </ComponentGroup>
      <ComponentGroup label="Activity Feed" note="Research activity stream">
        <ActivityItem />
      </ComponentGroup>
      <ComponentGroup label="Presence Indicators" row>
        <PresenceIndicator status="online" />
        <PresenceIndicator status="away" />
        <PresenceIndicator status="busy" />
        <PresenceIndicator status="offline" />
      </ComponentGroup>
    </SectionWrapper>
  );
}
