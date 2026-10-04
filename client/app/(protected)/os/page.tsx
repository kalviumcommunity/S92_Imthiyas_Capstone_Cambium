"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Search,
  Bell,
  Calendar as CalendarIcon,
  FolderPlus,
  Clock,
  ExternalLink,
  Check,
  ChevronRight,
  Plus,
  Trash2,
  Sliders,
  Shield,
  Download,
  Globe,
  Sparkles,
  BookOpen,
  Users,
  Award,
  FileText,
  Bookmark,
  MoreVertical,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CalendarView = "week" | "month" | "agenda";
type SavedTab = "all" | "papers" | "researchers" | "opportunities" | "projects" | "topics";
type PrefTab =
  | "appearance"
  | "notifications"
  | "interests"
  | "privacy"
  | "integrations"
  | "export"
  | "security"
  | "language";

// ─── Data ─────────────────────────────────────────────────────────────────────

const WEEK_EVENTS = [
  { id: 1, day: 1, start: 9, duration: 1, label: "Literature Review", type: "research" },
  { id: 2, day: 1, start: 11.5, duration: 1, label: "Lab Meeting", type: "meeting" },
  { id: 3, day: 2, start: 10, duration: 1.5, label: "Experiment Run", type: "experiment" },
  { id: 4, day: 3, start: 9, duration: 1, label: "Writing Session", type: "research" },
  { id: 5, day: 3, start: 14, duration: 1, label: "Collaborator Meeting", type: "meeting" },
  { id: 6, day: 4, start: 11, duration: 0.75, label: "Paper Review", type: "research" },
  { id: 7, day: 4, start: 15, duration: 1, label: "Grant Review", type: "deadline" },
  { id: 8, day: 5, start: 9, duration: 2, label: "Friday Paper Review", type: "research" },
];

const AGENDA_EVENTS = [
  {
    date: "Today, Aug 13",
    items: [
      { time: "09:00", label: "Literature Review", type: "research", duration: "1h" },
      { time: "11:30", label: "Lab Meeting", type: "meeting", duration: "1h" },
      { time: "14:00", label: "Experiment Run", type: "experiment", duration: "1.5h" },
    ],
  },
  {
    date: "Tomorrow, Aug 14",
    items: [
      { time: "10:00", label: "Writing Session", type: "research", duration: "2h" },
      { time: "15:00", label: "Collaborator Meeting", type: "meeting", duration: "1h" },
    ],
  },
  {
    date: "Sep 18",
    items: [
      { time: "All day", label: "Early Career Research Fellowship deadline", type: "deadline", duration: "" },
    ],
  },
  {
    date: "Oct 04",
    items: [
      { time: "All day", label: "MICCAI 2026 Paper Submission", type: "deadline", duration: "" },
    ],
  },
];

const EVENT_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  research: { bg: "bg-moss-50", text: "text-moss-700", dot: "bg-moss-600", border: "border-moss-200" },
  meeting: { bg: "bg-iris-light", text: "text-iris", dot: "bg-iris", border: "border-iris/20" },
  experiment: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-600", border: "border-purple-200" },
  deadline: { bg: "bg-amber-light", text: "text-amber", dot: "bg-amber", border: "border-amber/20" },
  personal: { bg: "bg-surface-sunken", text: "text-ink-secondary", dot: "bg-ink-tertiary", border: "border-edge-default" },
};

const COLLECTIONS = [
  { id: 1, name: "Medical Imaging", desc: "Core literature for imaging research", items: "42 papers · 8 researchers · 3 datasets", updated: "2h ago", color: "bg-moss-50 border-moss-200 text-moss-700" },
  { id: 2, name: "Foundation Models", desc: "Large-scale pretrained model literature", items: "28 papers · 5 researchers", updated: "1d ago", color: "bg-iris-light border-iris/20 text-iris" },
  { id: 3, name: "Papers to Read", desc: "Reading queue", items: "14 papers", updated: "3h ago", color: "bg-surface-sunken border-edge-default text-ink-primary" },
  { id: 4, name: "Potential Collaborators", desc: "Researchers to reach out to", items: "9 researchers · 3 labs", updated: "4d ago", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { id: 5, name: "Funding Opportunities", desc: "Active grants and fellowships", items: "6 grants · 4 fellowships", updated: "2d ago", color: "bg-amber-light border-amber/20 text-amber" },
  { id: 6, name: "Conference Shortlist", desc: "Target venues for 2026", items: "8 conferences", updated: "1w ago", color: "bg-crimson-light border-crimson/20 text-crimson" },
];

const SAVED_ITEMS = [
  { id: 1, title: "Foundation Models for Medical Image Understanding", type: "paper", saved: "2 hours ago", context: "Relates to your Medical Imaging project", tab: "papers" },
  { id: 2, title: "Early Career Research Fellowship 2026", type: "opportunity", saved: "Yesterday", context: "Matches your career stage and research area", tab: "opportunities" },
  { id: 3, title: "Dr. Elena Rodriguez", type: "researcher", saved: "Monday", context: "Expertise overlaps with your Federated Learning work", tab: "researchers" },
  { id: 4, title: "Segment Anything for Medical Imaging: A Systematic Review", type: "paper", saved: "3 days ago", context: "Saved because it relates to your Medical Imaging project", tab: "papers" },
  { id: 5, title: "Low-Resource Medical Image Segmentation", type: "project", saved: "1 week ago", context: "Active collaboration project", tab: "projects" },
  { id: 6, title: "Federated Learning for Clinical Data", type: "paper", saved: "1 week ago", context: "Core to your Federated Learning collection", tab: "papers" },
  { id: 7, title: "Prof. James Chen", type: "researcher", saved: "2 weeks ago", context: "Potential collaborator in Computer Vision", tab: "researchers" },
  { id: 8, title: "NIH R01 Grant — Biomedical Imaging", type: "opportunity", saved: "3 weeks ago", context: "Matches your funding profile", tab: "opportunities" },
];

const NOTIFS_INITIAL = [
  { id: 1, text: "Dr. Elena Rodriguez commented on your research update in Low-Resource Medical Image Segmentation.", time: "5 min ago", category: "Collaboration", read: false },
  { id: 2, text: "A new fellowship matches your Medical Imaging research profile.", time: "1h ago", category: "Opportunities", read: false },
  { id: 3, text: "Your collaborator added 3 references to Low-Resource Medical Image Segmentation.", time: "3h ago", category: "Research", read: false },
  { id: 4, text: "MICCAI 2026 submission deadline is 52 days away.", time: "Yesterday", category: "Deadlines", read: false },
  { id: 5, text: "Prof. James Chen accepted your connection request.", time: "2 days ago", category: "Collaboration", read: true },
  { id: 6, text: "Your paper citation count increased by 12 this week.", time: "3 days ago", category: "Research", read: true },
];

const ROUTINES_INITIAL = [
  { id: 1, name: "Morning literature review", duration: "30 min", schedule: "Every weekday", active: true },
  { id: 2, name: "Weekly research planning", duration: "45 min", schedule: "Monday", active: true },
  { id: 3, name: "Friday paper review", duration: "60 min", schedule: "Friday", active: false },
];

const PREF_TABS: { id: PrefTab; label: string }[] = [
  { id: "appearance", label: "Appearance" },
  { id: "notifications", label: "Notifications" },
  { id: "interests", label: "Research interests" },
  { id: "privacy", label: "Privacy" },
  { id: "integrations", label: "Integrations" },
  { id: "export", label: "Export & Data" },
  { id: "security", label: "Security" },
  { id: "language", label: "Language" },
];

const NOTIF_PREFS = [
  { id: "reccs", label: "Research recommendations" },
  { id: "opps", label: "Opportunity alerts" },
  { id: "deadlines", label: "Deadline reminders" },
  { id: "collab", label: "Collaboration activity" },
  { id: "papers", label: "Paper updates" },
  { id: "messages", label: "Messages" },
  { id: "mentions", label: "Mentions" },
  { id: "product", label: "Product updates" },
];

const INTEGRATIONS = [
  { name: "ORCID", connected: true, detail: "0000-0002-1234-5678" },
  { name: "Google Scholar", connected: true, detail: "View profile" },
  { name: "GitHub", connected: false, detail: "" },
  { name: "LinkedIn", connected: false, detail: "" },
  { name: "ResearchGate", connected: true, detail: "View profile" },
  { name: "Semantic Scholar", connected: false, detail: "" },
  { name: "Calendar", connected: true, detail: "Google Calendar" },
];

// ─── Primitive Helpers ────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paper: { label: "Paper", cls: "bg-moss-50 text-moss-700 border border-moss-200" },
    opportunity: { label: "Opportunity", cls: "bg-amber-light text-amber border border-amber/20" },
    researcher: { label: "Researcher", cls: "bg-iris-light text-iris border border-iris/20" },
    project: { label: "Project", cls: "bg-purple-50 text-purple-700 border border-purple-200" },
    topic: { label: "Topic", cls: "bg-surface-sunken text-ink-secondary border border-edge-default" },
  };
  const t = map[type] || { label: type, cls: "bg-surface-sunken text-ink-secondary border border-edge-default" };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${t.cls}`}>
      {t.label}
    </span>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="font-serif text-[26px] text-ink-primary leading-tight font-normal">
          {title}
        </h2>
        {subtitle && <p className="text-ink-tertiary text-xs sm:text-[13px] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 ${
        on ? "bg-moss-600" : "bg-edge-default"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 mt-0.5 ml-0.5 ${
          on ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SegControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-md border border-edge-default p-0.5 bg-surface-sunken inline-flex">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors duration-150 ${
            value === o.id
              ? "bg-surface-raised text-ink-primary shadow-xs border border-edge-default/60"
              : "text-ink-tertiary hover:text-ink-primary"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Calendars ────────────────────────────────────────────────────────────────

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const DAYS = ["Mon 10", "Tue 11", "Wed 12", "Thu 13", "Fri 14"];

function WeekCalendar() {
  const totalHours = HOURS.length;
  const rowH = 48;

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: 620 }}>
        {/* Day headers */}
        <div className="flex border-b border-edge-default">
          <div className="w-16 shrink-0" />
          {DAYS.map((d, i) => (
            <div
              key={i}
              className={`flex-1 text-center py-2.5 text-[11px] font-bold tracking-wider uppercase ${
                i === 3 ? "text-moss-700" : "text-ink-tertiary"
              }`}
            >
              <span
                className={
                  i === 3
                    ? "inline-block px-2.5 py-0.5 rounded-full bg-moss-50 border border-moss-200 text-moss-700"
                    : ""
                }
              >
                {d}
              </span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="relative flex">
          {/* Time labels */}
          <div className="w-16 shrink-0 select-none">
            {HOURS.map((h) => (
              <div key={h} style={{ height: rowH }} className="relative">
                <span className="absolute -top-2 right-3 text-[10px] text-ink-tertiary font-mono">
                  {h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map((_, dayIdx) => (
            <div
              key={dayIdx}
              className="flex-1 relative border-l border-edge-default"
              style={{ height: totalHours * rowH }}
            >
              {/* Hour lines */}
              {HOURS.map((_, hi) => (
                <div
                  key={hi}
                  style={{ top: hi * rowH, height: rowH }}
                  className="absolute inset-x-0 border-b border-edge-default border-dashed opacity-40 pointer-events-none"
                />
              ))}

              {/* Events */}
              {WEEK_EVENTS.filter((e) => e.day - 1 === dayIdx).map((ev) => {
                const top = (ev.start - HOURS[0]) * rowH;
                const height = ev.duration * rowH - 2;
                const col = EVENT_COLORS[ev.type] || EVENT_COLORS.personal;
                return (
                  <div
                    key={ev.id}
                    style={{ top, height }}
                    className={`absolute left-1 right-1 rounded border px-2 py-1 overflow-hidden cursor-pointer transition-shadow hover:shadow-xs ${col.bg} ${col.text} ${col.border}`}
                  >
                    <p className="text-[11px] font-semibold truncate leading-tight">
                      {ev.label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />
                      <span className="text-[10px] opacity-80 capitalize">{ev.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgendaCalendar() {
  return (
    <div className="space-y-6">
      {AGENDA_EVENTS.map((group) => (
        <div key={group.date}>
          <p className="text-[11px] font-bold tracking-wider uppercase text-ink-tertiary mb-2">
            {group.date}
          </p>
          <div className="space-y-1.5">
            {group.items.map((item, i) => {
              const col = EVENT_COLORS[item.type] || EVENT_COLORS.personal;
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 py-2.5 px-3.5 rounded-md border border-edge-default hover:border-moss-300 hover:bg-moss-50/40 bg-surface-raised transition-colors duration-150 cursor-pointer shadow-xs"
                >
                  <span className="text-[11px] text-ink-tertiary w-14 shrink-0 font-mono font-medium">
                    {item.time}
                  </span>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${col.dot}`} />
                  <span className="text-xs sm:text-[13px] text-ink-primary font-medium flex-1 truncate">
                    {item.label}
                  </span>
                  {item.duration && (
                    <span className="text-[11px] text-ink-tertiary font-mono">{item.duration}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthCalendar() {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] uppercase text-ink-tertiary py-1 border-b border-edge-default">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {/* Leading blanks for month start */}
        <div className="h-16 rounded border border-transparent bg-transparent" />
        <div className="h-16 rounded border border-transparent bg-transparent" />
        <div className="h-16 rounded border border-transparent bg-transparent" />
        {daysInMonth.map((day) => {
          const isToday = day === 13;
          const hasEvent = [10, 11, 12, 13, 14, 18, 26].includes(day);
          return (
            <div
              key={day}
              className={`h-16 p-1.5 rounded-md border transition-all cursor-pointer flex flex-col justify-between ${
                isToday
                  ? "bg-moss-50 border-moss-300 shadow-xs"
                  : "bg-surface-raised border-edge-default hover:border-edge-strong"
              }`}
            >
              <span
                className={`text-[11px] font-semibold ${
                  isToday ? "text-moss-700" : "text-ink-secondary"
                }`}
              >
                {day}
              </span>
              {hasEvent && (
                <div className="flex gap-1 items-center justify-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-moss-600" />
                  {day === 13 && <span className="w-1.5 h-1.5 rounded-full bg-amber" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Preferences Component ────────────────────────────────────────────────────

function PreferencesPanel() {
  const [tab, setTab] = useState<PrefTab>("appearance");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_PREFS.map((p) => [p.id, p.id !== "product"]))
  );
  const [interests, setInterests] = useState([
    "Medical Imaging",
    "Computer Vision",
    "Machine Learning",
    "Federated Learning",
    "Deep Learning",
  ]);
  const [newInterestInput, setNewInterestInput] = useState("");
  const [showAddInterest, setShowAddInterest] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<"public" | "members" | "private">("members");
  const [activityVisibility, setActivityVisibility] = useState<"show" | "limit" | "hide">("show");
  const [collabAvailability, setCollabAvailability] = useState<"available" | "selective" | "unavailable">("selective");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => setSaveState("saved"), 600);
    setTimeout(() => setSaveState("idle"), 2400);
  };

  const removeInterest = (item: string) => {
    setInterests(interests.filter((x) => x !== item));
  };

  const addInterest = () => {
    if (newInterestInput.trim() && !interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
      setNewInterestInput("");
      setShowAddInterest(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Pref Sidebar */}
      <div className="w-full md:w-[200px] shrink-0">
        <nav className="space-y-0.5">
          {PREF_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 ${
                tab === t.id
                  ? "bg-moss-50 text-moss-700 font-semibold border border-moss-200 shadow-xs"
                  : "text-ink-secondary hover:bg-surface-sunken hover:text-ink-primary border border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Pref Content */}
      <div className="flex-1 min-w-0">
        {tab === "appearance" && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-ink-tertiary mb-3">
                Theme
              </p>
              <SegControl
                value={theme}
                options={[
                  { id: "light", label: "Light" },
                  { id: "dark", label: "Dark" },
                  { id: "system", label: "System" },
                ]}
                onChange={setTheme}
              />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-ink-tertiary mb-3">
                Density
              </p>
              <SegControl
                value={density}
                options={[
                  { id: "comfortable", label: "Comfortable" },
                  { id: "compact", label: "Compact" },
                ]}
                onChange={setDensity}
              />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-ink-tertiary mb-2">
                Typography
              </p>
              <p className="text-xs text-ink-secondary">
                Global SSOT: <span className="font-serif font-bold text-ink-primary">Source Serif 4</span> (Headings) &{" "}
                <span className="font-sans font-semibold text-ink-primary">Manrope</span> (UI & Body).
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-ink-tertiary mb-3">
                Accessibility
              </p>
              <div className="space-y-3 max-w-md">
                {["Reduced motion", "Larger text", "High contrast"].map((opt) => (
                  <div key={opt} className="flex items-center justify-between">
                    <span className="text-xs text-ink-primary font-medium">{opt}</span>
                    <Toggle on={false} onToggle={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div className="space-y-2 max-w-lg">
            {NOTIF_PREFS.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-2.5 border-b border-edge-default last:border-0"
              >
                <span className="text-xs text-ink-primary font-medium">{p.label}</span>
                <Toggle
                  on={notifToggles[p.id]}
                  onToggle={() =>
                    setNotifToggles((t) => ({ ...t, [p.id]: !t[p.id] }))
                  }
                />
              </div>
            ))}
          </div>
        )}

        {tab === "interests" && (
          <div>
            <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
              Your research interests guide Cambium&apos;s intelligent recommendations, literature matching, and fellowship discovery.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.map((interest) => (
                <div
                  key={interest}
                  className="flex items-center gap-2 bg-moss-50 border border-moss-200 text-moss-700 rounded-full px-3 py-1 text-xs font-semibold"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="hover:text-crimson transition-colors"
                    aria-label={`Remove ${interest}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {!showAddInterest ? (
                <button
                  type="button"
                  onClick={() => setShowAddInterest(true)}
                  className="flex items-center gap-1.5 border border-dashed border-edge-default text-ink-secondary hover:border-moss-600 hover:text-moss-700 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                >
                  <Plus size={12} />
                  Add interest
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addInterest()}
                    placeholder="E.g. Multimodal AI"
                    className="h-7 px-2.5 rounded-full border border-moss-300 text-xs bg-surface-raised text-ink-primary outline-none focus:ring-1 focus:ring-moss-600"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="h-7 px-2.5 rounded-full bg-moss-600 text-white text-xs font-medium"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddInterest(false)}
                    className="h-7 px-2 text-ink-tertiary hover:text-ink-primary text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "privacy" && (
          <div className="space-y-6">
            {[
              {
                label: "Profile visibility",
                value: profileVisibility,
                options: [
                  { id: "public", label: "Public" },
                  { id: "members", label: "Members" },
                  { id: "private", label: "Private" },
                ],
                onChange: setProfileVisibility as (v: string) => void,
              },
              {
                label: "Research activity",
                value: activityVisibility,
                options: [
                  { id: "show", label: "Show" },
                  { id: "limit", label: "Limit" },
                  { id: "hide", label: "Hide" },
                ],
                onChange: setActivityVisibility as (v: string) => void,
              },
              {
                label: "Collaboration availability",
                value: collabAvailability,
                options: [
                  { id: "available", label: "Available" },
                  { id: "selective", label: "Selective" },
                  { id: "unavailable", label: "Unavailable" },
                ],
                onChange: setCollabAvailability as (v: string) => void,
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs font-semibold text-ink-primary mb-2">{item.label}</p>
                <SegControl
                  value={item.value}
                  options={item.options as { id: string; label: string }[]}
                  onChange={item.onChange}
                />
              </div>
            ))}
          </div>
        )}

        {tab === "integrations" && (
          <div className="space-y-2 max-w-lg">
            {INTEGRATIONS.map((intg) => (
              <div
                key={intg.name}
                className="flex items-center justify-between py-2.5 border-b border-edge-default last:border-0"
              >
                <div>
                  <p className="text-xs font-semibold text-ink-primary">{intg.name}</p>
                  {intg.detail && (
                    <p className="text-[11px] text-ink-tertiary mt-0.5">{intg.detail}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {intg.connected ? (
                    <>
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-moss-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-moss-600" />
                        Connected
                      </span>
                      <button
                        type="button"
                        className="text-xs text-ink-tertiary hover:text-crimson transition-colors"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="text-xs text-moss-700 font-semibold hover:underline"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "export" && (
          <div className="space-y-2 max-w-md">
            {[
              "Export my research data (JSON)",
              "Download references (BibTeX)",
              "Export collections (CSV)",
              "Export workspace portfolio (PDF)",
              "Download account data archive",
            ].map((action) => (
              <button
                key={action}
                type="button"
                className="w-full flex items-center justify-between py-2.5 border-b border-edge-default last:border-0 group hover:text-moss-700 transition-colors"
              >
                <span className="text-xs text-ink-primary group-hover:text-moss-700 font-medium">
                  {action}
                </span>
                <Download size={14} className="text-ink-tertiary group-hover:text-moss-700" />
              </button>
            ))}
            <div className="mt-8 pt-6 border-t border-edge-default">
              <p className="text-xs font-bold tracking-wider uppercase text-crimson mb-2">
                Danger zone
              </p>
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-crimson/30 text-crimson text-xs font-semibold hover:bg-crimson-light transition-colors"
              >
                Delete account
              </button>
            </div>
          </div>
        )}

        {tab === "security" && (
          <div className="space-y-6 max-w-lg">
            {[
              { label: "Password", action: "Change password" },
              { label: "Two-factor authentication", action: "Enable 2FA" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2.5 border-b border-edge-default"
              >
                <span className="text-xs text-ink-primary font-medium">{item.label}</span>
                <button
                  type="button"
                  className="text-xs text-moss-700 font-semibold hover:underline"
                >
                  {item.action}
                </button>
              </div>
            ))}
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-ink-tertiary mb-3">
                Active sessions
              </p>
              <div className="space-y-2">
                {[
                  { label: "Chrome on Windows", meta: "Active now · Chennai, India", current: true },
                  { label: "Safari on iPhone", meta: "2 days ago · Chennai, India", current: false },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-surface-sunken border border-edge-default text-xs"
                  >
                    <div>
                      <p className="font-semibold text-ink-primary">{s.label}</p>
                      <p className="text-[11px] text-ink-tertiary mt-0.5">{s.meta}</p>
                    </div>
                    {s.current ? (
                      <span className="text-[11px] text-moss-700 font-semibold">Current</span>
                    ) : (
                      <button
                        type="button"
                        className="text-xs text-ink-tertiary hover:text-crimson transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "language" && (
          <div className="max-w-xs">
            <p className="text-xs text-ink-secondary mb-2 font-medium">Display language</p>
            <select className="w-full text-xs text-ink-primary bg-surface-raised border border-edge-default rounded-md px-3 py-2 outline-none focus:border-moss-600">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Deutsch</option>
              <option>Français</option>
              <option>日本語</option>
            </select>
          </div>
        )}

        {/* Save button */}
        {tab !== "export" && tab !== "security" && (
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-moss-600 hover:bg-moss-700 text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
            >
              Save preferences
            </button>
            {saveState === "saving" && (
              <span className="text-xs text-ink-tertiary">Saving…</span>
            )}
            {saveState === "saved" && (
              <span className="text-xs text-moss-700 font-semibold flex items-center gap-1.5">
                <Check size={13} />
                Saved
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Research Activity Contribution Heatmap ──────────────────────────────────
function ResearchActivityHeatmap() {
  const weeks = 52;
  const days = 7;
  const getLevel = (w: number, d: number) => {
    const val = (Math.sin(w * 0.38) + Math.cos(d * 0.72) + Math.sin(w * 0.14 + d * 0.9)) / 3;
    if (val > 0.42) return 4;
    if (val > 0.18) return 3;
    if (val > -0.06) return 2;
    if (val > -0.32) return 1;
    return 0;
  };

  const levelColors = [
    "bg-[#FAF7F0] border-[#E4DCCB]",
    "bg-[#DCE6D7] border-[#DCE6D7]",
    "bg-[#A3C4A8] border-[#A3C4A8]",
    "bg-[#66866A] border-[#66866A]",
    "bg-[#3E6248] border-[#293E30]",
  ];

  return (
    <div className="p-6 rounded-2xl border border-[#E4DCCB] bg-white shadow-2xs">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <div>
          <h4 className="font-serif text-base sm:text-lg font-normal text-[#202920] m-0">
            Scholarly Velocity & Output Momentum
          </h4>
          <p className="text-xs text-[#62685E] font-sans mt-0.5 m-0">
            1,482 verified synthesis actions, hypothesis iterations, and citation annotations in the past 12 months
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#3E6248] bg-[#DCE6D7] px-3 py-1 rounded-full border border-[#66866A]/30 font-semibold">
            ✦ Velocity: 4.1 actions/day
          </span>
          <span className="text-[#62685E] hidden sm:inline">
            Top Domain: Climate ML
          </span>
        </div>
      </div>

      {/* Grid container with horizontal scroll */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-1 min-w-[760px]">
          {/* Month labels */}
          <div className="flex text-[10px] font-mono text-[#85877B] pl-7 justify-between pr-4 mb-1">
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
          </div>

          <div className="flex gap-2 items-center">
            {/* Day of week labels - adjusted height for 3-5% cell expansion */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-[#85877B] h-[92px] pr-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* 52 columns of 7 days (height expanded by 3-5% to h-[13px] w-[13px]) */}
            <div className="flex gap-[3.5px]">
              {Array.from({ length: weeks }).map((_, w) => (
                <div key={w} className="flex flex-col gap-[3.5px]">
                  {Array.from({ length: days }).map((_, d) => {
                    const level = getLevel(w, d);
                    return (
                      <div
                        key={d}
                        title={`Week ${w + 1}, Day ${d + 1}: ${level * 3 + (level > 0 ? 1 : 0)} research contributions`}
                        className={`w-[13px] h-[13px] rounded-[2.5px] border transition-transform hover:scale-125 hover:z-10 cursor-pointer ${levelColors[level]}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer legend */}
      <div className="flex items-center justify-between text-xs text-[#85877B] mt-4 pt-3 border-t border-[#E4DCCB]">
        <span>Verified SSOT research momentum tracked across active workspaces</span>
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span>Less</span>
          {levelColors.map((cls, i) => (
            <div key={i} className={`w-3 h-3 rounded-[2px] border ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Personal OS Page Component ──────────────────────────────────────────

export default function PersonalResearchOSPage() {
  const [calView, setCalView] = useState<CalendarView>("week");
  const [savedTab, setSavedTab] = useState<SavedTab>("all");
  const [notifs, setNotifs] = useState(NOTIFS_INITIAL);
  const [routines, setRoutines] = useState(ROUTINES_INITIAL);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const filteredSaved =
    savedTab === "all"
      ? SAVED_ITEMS
      : SAVED_ITEMS.filter((s) => s.tab === savedTab);

  const filteredSearch = searchQuery.trim()
    ? SAVED_ITEMS.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "/" && !searchOpen && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  return (
    <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden bg-surface-base text-ink-primary font-sans select-none">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-6 sm:px-10 h-14 border-b border-edge-default shrink-0 bg-surface-base/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="text-[11px] font-bold tracking-[0.12em] text-moss-700 uppercase">
            Personal Research OS
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-moss-50 text-moss-700 border border-moss-200 font-mono">
            /app/os
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search */}
          {searchOpen ? (
            <div className="relative">
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                placeholder="Search your research world…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Escape" && (setSearchOpen(false), setSearchQuery(""))
                }
                className="w-72 h-8 pl-8 pr-3 rounded-md border border-moss-300 bg-surface-raised text-xs text-ink-primary outline-none focus:ring-2 focus:ring-moss-600/20 shadow-xs"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-ink-tertiary" />
              {searchQuery && filteredSearch.length > 0 && (
                <div className="absolute top-10 right-0 w-80 bg-surface-raised border border-edge-default rounded-lg shadow-elevation3 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  {filteredSearch.map((item) => (
                    <div
                      key={item.id}
                      className="px-3.5 py-2 hover:bg-surface-sunken cursor-pointer flex items-center gap-2.5 text-xs"
                    >
                      <TypeBadge type={item.type} />
                      <span className="text-xs text-ink-primary truncate font-medium">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-edge-default text-ink-tertiary text-xs hover:border-edge-strong hover:text-ink-primary bg-surface-raised transition-colors shadow-xs"
            >
              <Search size={13} />
              <span>Search</span>
              <span className="ml-1 text-[10px] bg-surface-sunken px-1.5 py-0.5 rounded font-mono text-ink-tertiary border border-edge-default">
                /
              </span>
            </button>
          )}

          {/* Notifications */}
          <button
            type="button"
            className="relative h-8 w-8 flex items-center justify-center rounded-md border border-edge-default text-ink-tertiary hover:text-ink-primary hover:border-edge-strong bg-surface-raised transition-colors shadow-xs"
            aria-label="Notifications"
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-moss-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Badge */}
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-moss-100 border border-moss-300 flex items-center justify-center hover:opacity-90 transition-opacity"
            title="Imthiyas (Profile)"
          >
            <span className="text-moss-700 text-[11px] font-bold font-sans">IM</span>
          </Link>
        </div>
      </header>

      {/* ── Scrollable Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-10 py-10">
          {/* Page Hero Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl sm:text-[46px] text-[#202920] leading-[1.12] font-normal mb-3">
              Your research,
              <br />
              <span className="italic text-[#3E6248]">organized around you.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#62685E] max-w-2xl font-sans leading-relaxed">
              A unified personal research environment bringing your calendar, collections, routines, and research assets into one living surface.
            </p>
          </div>

          {/* ── AI Intelligence Strip ── */}
          <div className="mb-12 px-5 py-4 rounded-lg border border-moss-200/80 bg-moss-50 flex items-start gap-3.5 shadow-xs">
            <div className="w-5 h-5 rounded-full bg-moss-600 flex items-center justify-center shrink-0 mt-0.5 text-white">
              <Sparkles size={11} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold tracking-wide text-moss-700 uppercase mb-1.5">
                Research intelligence
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-moss-700/90 font-medium">
                <p>• You have 7 saved papers related to your current Medical Imaging project.</p>
                <p>• Two upcoming deadlines overlap with your planned paper schedule.</p>
                <p>• You haven&apos;t reviewed your &apos;Foundation Models&apos; collection in 18 days.</p>
              </div>
            </div>
          </div>

          {/* ── Section 01: Today ── */}
          <section className="mb-14" id="today">
            <SectionHeading
              title="Today"
              subtitle="Here's what deserves your attention."
            />
            <div className="flex items-stretch gap-3.5 flex-wrap sm:flex-nowrap">
              {/* Date Card */}
              <div className="flex flex-col justify-center px-5 py-4 rounded-lg border border-edge-default bg-surface-raised min-w-[140px] shadow-xs">
                <p className="text-[10px] font-bold tracking-widest uppercase text-ink-tertiary mb-1">
                  Thursday
                </p>
                <p className="font-serif text-2xl sm:text-[28px] text-ink-primary leading-none font-normal">
                  August 13
                </p>
              </div>

              {/* Stats Row */}
              {[
                { label: "Research tasks", value: "3 remaining", color: "text-ink-primary" },
                { label: "Upcoming deadline", value: "MICCAI 2026", sub: "Paper submission · Oct 4", color: "text-amber" },
                { label: "Saved reading", value: "4 papers", color: "text-iris" },
                { label: "Unread messages", value: "2", color: "text-ink-primary" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex-1 min-w-[130px] flex flex-col justify-between p-4 rounded-lg border border-edge-default bg-surface-raised hover:border-edge-strong transition-colors shadow-xs cursor-pointer"
                >
                  <p className="text-[11px] text-ink-tertiary font-semibold">{stat.label}</p>
                  <p className={`text-[15px] font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  {stat.sub && (
                    <p className="text-[11px] text-ink-tertiary mt-0.5 truncate">{stat.sub}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 02: Calendar ── */}
          <section className="mb-14" id="calendar">
            <SectionHeading
              title="Research Calendar"
              action={
                <div className="flex items-center gap-1 p-0.5 bg-surface-sunken rounded-md border border-edge-default">
                  {(["week", "month", "agenda"] as CalendarView[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCalView(v)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold capitalize transition-all ${
                        calView === v
                          ? "bg-surface-raised text-ink-primary shadow-xs border border-edge-default/60"
                          : "text-ink-tertiary hover:text-ink-primary"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              }
            />

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {Object.entries({
                research: "Research",
                meeting: "Meeting",
                experiment: "Experiment",
                deadline: "Deadline",
              }).map(([type, label]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${EVENT_COLORS[type].dot}`} />
                  <span className="text-[11px] text-ink-secondary font-medium">{label}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-edge-default overflow-hidden bg-surface-raised shadow-xs">
              <div className="p-5">
                {calView === "week" && <WeekCalendar />}
                {calView === "agenda" && <AgendaCalendar />}
                {calView === "month" && <MonthCalendar />}
              </div>
            </div>

            {/* ── Heading: Research Activity & Contribution Streak ── */}
            <div className="mt-10 mb-4 pt-6 border-t border-[#E4DCCB]/70 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] text-[#3E6248] text-[10px] font-mono tracking-wider uppercase font-semibold mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E6248] animate-pulse" />
                  Scholarly Cadence & Output Ledger
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#202920] m-0">
                  Research Contribution & Activity Streak
                </h3>
                <p className="text-xs text-[#62685E] font-sans mt-1 m-0">
                  Continuous record of laboratory output, hypotheses, citations, literature synthesis, and peer reviews.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#3E6248] bg-[#DCE6D7] px-3.5 py-1.5 rounded-full border border-[#66866A]/30 font-semibold text-xs shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3E6248]" />
                  🔥 18-Day Active Streak
                </span>
              </div>
            </div>

            {/* Research Velocity & Momentum Contribution Grid */}
            <ResearchActivityHeatmap />
          </section>

          {/* ── Section 03: Collections ── */}
          <section className="mb-14" id="collections">
            <SectionHeading
              title="Collections"
              subtitle="Your personal research libraries."
              action={
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-edge-default hover:border-moss-300 text-xs font-semibold text-ink-secondary hover:text-moss-700 bg-surface-raised transition-colors shadow-xs"
                >
                  <Plus size={12} />
                  New collection
                </button>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {COLLECTIONS.map((col) => (
                <div
                  key={col.id}
                  className="flex flex-col justify-between p-5 rounded-lg border border-edge-default bg-surface-raised hover:border-edge-strong hover:shadow-sm transition-all duration-150 cursor-pointer group"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center border shrink-0 ${col.color}`}
                      >
                        <BookOpen size={15} />
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-ink-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-primary group-hover:text-moss-700 transition-colors">
                        {col.name}
                      </p>
                      <p className="text-xs text-ink-secondary mt-1 line-clamp-2">
                        {col.desc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-2 border-t border-edge-default/60 flex items-center justify-between">
                    <p className="text-[11px] text-ink-tertiary font-medium">{col.items}</p>
                    <span className="text-[11px] text-moss-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Open →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 04: Saved Research ── */}
          <section className="mb-14" id="saved">
            <SectionHeading title="Saved research" />
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-5 border-b border-edge-default overflow-x-auto">
              {(["all", "papers", "researchers", "opportunities", "projects", "topics"] as SavedTab[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSavedTab(t)}
                    className={`px-4 py-2 text-xs font-semibold capitalize border-b-2 -mb-px transition-colors duration-150 whitespace-nowrap ${
                      savedTab === t
                        ? "text-moss-700 border-moss-600 font-bold"
                        : "text-ink-tertiary border-transparent hover:text-ink-primary"
                    }`}
                  >
                    {t}
                  </button>
                )
              )}
            </div>

            <div className="space-y-1.5">
              {filteredSaved.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between py-3 px-4 rounded-lg bg-surface-raised hover:bg-surface-sunken border border-edge-default/60 hover:border-edge-strong transition-all duration-150 group cursor-pointer shadow-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <TypeBadge type={item.type} />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] text-ink-primary font-semibold truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-ink-tertiary mt-0.5 italic truncate">
                        {item.context}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-[11px] text-ink-tertiary">{item.saved}</span>
                    <button
                      type="button"
                      className="text-ink-tertiary hover:text-crimson opacity-0 group-hover:opacity-100 transition-all p-1"
                      aria-label="Remove saved item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredSaved.length === 0 && (
                <div className="text-center py-12 border border-dashed border-edge-default rounded-lg">
                  <p className="text-sm font-semibold text-ink-primary mb-1">Nothing saved yet.</p>
                  <p className="text-xs text-ink-tertiary">
                    Save papers, researchers and opportunities to build your personal research library.
                  </p>
                  <Link
                    href="/discover"
                    className="inline-block mt-4 px-4 py-1.5 rounded-md border border-edge-default text-xs font-semibold text-moss-700 hover:bg-moss-50 transition-colors shadow-xs"
                  >
                    Discover research
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* ── Section 05: Activity ── */}
          <section className="mb-14" id="activity">
            <SectionHeading
              title="Activity"
              action={
                unreadCount > 0 ? (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-semibold text-moss-700 hover:underline"
                  >
                    Mark all as read
                  </button>
                ) : undefined
              }
            />
            <div className="space-y-1.5">
              {notifs.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3.5 py-3 px-4 rounded-lg transition-colors duration-150 group border ${
                    notif.read
                      ? "border-edge-default/60 bg-surface-raised"
                      : "border-moss-200 bg-moss-50/40 shadow-xs"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      notif.read ? "bg-edge-default" : "bg-moss-600"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-[13px] text-ink-primary leading-snug font-medium">
                      {notif.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-ink-tertiary">
                      <span className="font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.2 rounded bg-surface-sunken border border-edge-default">
                        {notif.category}
                      </span>
                      <span>{notif.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => markRead(notif.id)}
                        className="text-[11px] text-ink-secondary hover:text-moss-700 px-2 py-1 rounded hover:bg-moss-50 transition-colors font-medium"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-[11px] text-ink-secondary hover:text-moss-700 px-2 py-1 rounded hover:bg-moss-50 transition-colors font-medium"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 06: Research Routines ── */}
          <section className="mb-14" id="routines">
            <SectionHeading
              title="Research routines"
              action={
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-edge-default hover:border-moss-300 text-xs font-semibold text-ink-secondary hover:text-moss-700 bg-surface-raised transition-colors shadow-xs"
                >
                  <Plus size={12} />
                  Create routine
                </button>
              }
            />

            {/* AI Suggestion */}
            <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-lg border border-iris/20 bg-iris-light text-iris">
              <Sparkles size={14} className="mt-0.5 shrink-0" />
              <p className="text-xs leading-snug font-medium">
                You&apos;ve been reviewing papers every morning. Would you like to create a recurring{" "}
                <strong className="font-semibold text-iris">Literature Review</strong> routine?{" "}
                <button type="button" className="underline hover:no-underline font-bold">
                  Create routine
                </button>{" "}
                ·{" "}
                <button type="button" className="underline hover:no-underline font-normal">
                  Dismiss
                </button>
              </p>
            </div>

            <div className="space-y-2">
              {routines.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-3.5 px-5 rounded-lg border border-edge-default bg-surface-raised hover:border-edge-strong transition-colors duration-150 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <Toggle
                      on={r.active}
                      onToggle={() =>
                        setRoutines((rs) =>
                          rs.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x))
                        )
                      }
                    />
                    <div>
                      <p
                        className={`text-xs sm:text-sm font-semibold ${
                          r.active ? "text-ink-primary" : "text-ink-tertiary line-through"
                        }`}
                      >
                        {r.name}
                      </p>
                      <p className="text-[11px] text-ink-tertiary mt-0.5 font-medium">
                        {r.duration} · {r.schedule}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-ink-tertiary hover:text-ink-primary transition-colors p-1"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 07: Preferences ── */}
          <section className="mb-20" id="preferences">
            <SectionHeading
              title="Preferences"
              subtitle="Shape Cambium around the way you work."
            />
            <div className="rounded-lg border border-edge-default overflow-hidden bg-surface-raised shadow-xs">
              <div className="p-6">
                <PreferencesPanel />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
