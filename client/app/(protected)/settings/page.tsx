"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Dna,
  Bell,
  Lock,
  Plug,
  Brain,
  Shield,
  Sun,
  Check,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Trash,
  Download,
  Menu,
  Users2,
  History,
  GitCompare,
  FileText,
  ArrowRight,
  UploadCloud,
  RefreshCw,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArtifactDropzone } from "@/components/ui/artifact-dropzone";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E6248] ${
        checked ? "bg-[#3E6248]" : "bg-[#E4DCCB]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  message,
  visible,
  onHide,
}: {
  message: string;
  visible: boolean;
  onHide: () => void;
}) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 3200);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-2.5 rounded-full bg-[#202920] border border-[#3E6248]/40 px-5 py-3 text-xs font-mono tracking-wider text-white shadow-2xl transition-all duration-200 ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <Check size={14} className="text-[#66866A]" />
      {message}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-serif text-[26px] sm:text-[30px] font-normal tracking-[-0.01em] text-[#202920] m-0">
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-xs text-[#62685E] mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Field row ────────────────────────────────────────────────────────────────
function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <label className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-[#62685E]">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-[#85877B] m-0 leading-relaxed">{hint}</p>}
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="h-px bg-[#E4DCCB] my-7" />;
}

// ─── Toggle row ───────────────────────────────────────────────────────────────
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 pb-5">
      <div>
        <div className="font-sans text-sm font-medium text-ink-primary">
          {label}
        </div>
        {description && (
          <div className="text-xs text-ink-secondary mt-1 leading-relaxed">
            {description}
          </div>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────
function IntegrationCard({
  name,
  description,
  logo,
  connected,
  onToggle,
}: {
  name: string;
  description: string;
  logo: React.ReactNode;
  connected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#E4DCCB] bg-white shadow-sm hover:border-[#3E6248]/50 transition-colors">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E4DCCB] bg-[#FAF7F0]">
          {logo}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#202920]">{name}</span>
            {connected && (
              <span className="rounded bg-[#3E6248]/10 border border-[#3E6248]/20 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-[#3E6248]">
                Connected
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-xs leading-relaxed text-[#62685E]">
            {description}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
          connected
            ? "border-[#E4DCCB] text-[#62685E] hover:bg-[#FAF7F0]"
            : "border-[#3E6248] bg-[#3E6248] text-white hover:bg-[#293E30]"
        }`}
      >
        {connected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}

// ─── Masked API Key Input ─────────────────────────────────────────────────────
function ApiKeyInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  return (
    <FieldRow label={label}>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-ink-secondary hover:text-ink-primary bg-transparent border-none cursor-pointer"
          title={show ? "Hide key" : "Reveal key"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </FieldRow>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV: NavItem[] = [
  { id: "account", label: "Account", icon: <User size={15} /> },
  { id: "organization", label: "Team & RBAC", icon: <Users2 size={15} /> },
  { id: "audit", label: "Audit Logs & Diff", icon: <History size={15} /> },
  { id: "export", label: "Data Portability", icon: <UploadCloud size={15} /> },
  { id: "identity", label: "Research Identity", icon: <Dna size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  { id: "privacy", label: "Privacy", icon: <Lock size={15} /> },
  { id: "integrations", label: "Integrations", icon: <Plug size={15} /> },
  { id: "ai", label: "AI & Intelligence", icon: <Brain size={15} /> },
  { id: "security", label: "Security & 2FA", icon: <Shield size={15} /> },
  { id: "appearance", label: "Appearance", icon: <Sun size={15} /> },
];

// ─── Logos (inline SVG) ───────────────────────────────────────────────────────
const OrcidLogo = () => (
  <svg width="20" height="20" viewBox="0 0 256 256" fill="none">
    <circle cx="128" cy="128" r="128" fill="#A6CE39" />
    <rect x="87" y="60" width="22" height="136" rx="4" fill="white" />
    <circle cx="98" cy="44" r="13" fill="white" />
    <path
      d="M130 60h40c33 0 56 23 56 68s-23 68-56 68h-40V60z"
      fill="white"
    />
    <path
      d="M148 80h18c22 0 38 17 38 48s-16 48-38 48h-18V80z"
      fill="#A6CE39"
    />
  </svg>
);

const GithubLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const NotionLogo = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="currentColor">
    <path d="M6 11.2c1.7 1.4 2.4 1.3 5.6 1.1l30.5-1.8c.6 0 .1-.6-.1-.7l-5-3.6c-.9-.8-2.1-1.5-4.4-1.3L4.8 7.3c-.9.1-1.1.6-.7 1l2 2.9zm2.2 8.3v32.1c0 1.7.8 2.4 2.7 2.3l33.6-1.9c1.9-.1 2.1-1.3 2.1-2.7V17.5c0-1.4-.6-2.1-1.9-2l-34.6 2c-1.4.1-1.9.8-1.9 2zm32.6 1.6c.2 1 0 2-.9 2.1l-1.5.2V40c-1.2-.7-2.3-1.5-3.2-2.5l-9-14.4v16.5l2.8.6s0 2.1-2.9 2.2l-8-.1c-.2-1 .4-2.1 1.4-2.3l2.2-.6V24L19.5 23c-.2-1 .4-2.4 2.2-2.5l8.6-.5 9.4 14.8V21.3l-2.4-.2c-.2-1.3.6-2.3 1.9-2.4l8.6-.3zm22.3-1.3L38.5 22c-1.8.1-2.2 1.3-2.2 2.8V50c0 1.3.5 2.1 1.9 2l26.3-1.5c1.5-.1 1.9-.9 1.9-2.2V21.9c0-1.2-.5-2.1-1.9-2z" />
  </svg>
);

// ─── Section: Account ─────────────────────────────────────────────────────────
function AccountSection({ showToast }: { showToast: (m: string) => void }) {
  const [name, setName] = useState("Dr. Miriam Osei");
  const [email, setEmail] = useState("m.osei@princeton.edu");
  const [institution, setInstitution] = useState("Princeton University");
  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Account"
        subtitle="Manage your personal information and institutional affiliation."
      />
      <FieldRow label="Full Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FieldRow>
      <FieldRow label="Email Address">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FieldRow>
      <FieldRow label="Institution">
        <Input
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
      </FieldRow>
      <div className="flex justify-end mt-2">
        <Button
          onClick={() => showToast("Account details saved.")}
          className="bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider rounded-full px-5 h-9 border-none shadow-sm"
        >
          Save changes →
        </Button>
      </div>

      <Divider />

      <div className="mb-7">
        <h3 className="font-serif text-lg font-normal text-[#202920] m-0 mb-1.5">
          Billing & Subscriptions
        </h3>
        <p className="font-sans text-xs text-[#62685E] leading-relaxed mb-4">
          Manage your subscription plan, view institutional grants, and monitor synthetic cognition usage.
        </p>
        <Button variant="outline" className="border-[#E4DCCB] text-[#202920] hover:bg-[#FAF7F0] rounded-full text-xs font-mono uppercase tracking-wider h-8" asChild>
          <Link href="/billing">
            View Billing & Usage →
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Section: Research Identity ───────────────────────────────────────────────
function IdentitySection({ showToast }: { showToast: (m: string) => void }) {
  const [orcid, setOrcid] = useState("0000-0002-1825-0097");
  const [interests, setInterests] = useState(
    "Computational genomics, RNA secondary structure, evolutionary biology"
  );
  const pubs = [
    {
      title: "Deep learning approaches for predicting RNA folding landscapes",
      year: 2024,
      source: "imported",
    },
    {
      title:
        "Comparative analysis of CRISPR off-target effects across model organisms",
      year: 2023,
      source: "imported",
    },
    {
      title: "Notes on transcription factor binding in non-model organisms",
      year: 2022,
      source: "manual",
    },
  ];
  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Research Identity"
        subtitle="Your verified scholarly profile, ORCID integration, and publication corpus."
      />
      <FieldRow
        label="ORCID iD"
        hint="Your persistent digital identifier for scholarly work."
      >
        <div className="flex gap-2">
          <Input
            value={orcid}
            onChange={(e) => setOrcid(e.target.value)}
            placeholder="0000-0000-0000-0000"
            className="border-[#E4DCCB] bg-white text-[#202920] focus-visible:ring-[#3E6248]/20 focus-visible:border-[#3E6248]"
          />
          <Button variant="ghost" size="icon" className="text-[#85877B] hover:text-[#202920]">
            <ExternalLink size={16} />
          </Button>
        </div>
      </FieldRow>
      <FieldRow label="Research Interests">
        <textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          rows={3}
          className="flex w-full rounded-lg border border-[#E4DCCB] bg-white px-3 py-2 text-sm text-[#202920] placeholder:text-[#85877B] outline-none focus:border-[#3E6248] focus:ring-2 focus:ring-[#3E6248]/15 transition-all resize-y leading-relaxed font-sans"
        />
      </FieldRow>
      <Divider />
      <div className="mb-3.5">
        <div className="mb-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#62685E]">
          Publications
        </div>
        <div className="flex flex-col gap-2.5">
          {pubs.map((p, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-[#E4DCCB] bg-white shadow-sm"
            >
              <div>
                <div className="text-[13px] font-medium text-[#202920] leading-snug font-sans">
                  {p.title}
                </div>
                <div className="mt-1 text-xs text-[#85877B] font-mono">{p.year}</div>
              </div>
              <span
                className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase ${
                  p.source === "imported"
                    ? "bg-[#3E6248]/10 text-[#3E6248] border border-[#3E6248]/20"
                    : "bg-[#E4DCCB]/40 text-[#62685E]"
                }`}
              >
                {p.source === "imported" ? "Imported" : "Manual"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2.5">
          <Button variant="ghost" size="sm" className="h-7 text-xs font-mono uppercase tracking-wider text-[#3E6248] hover:bg-[#FAF7F0] px-2">
            + Add publication manually
          </Button>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          onClick={() => showToast("Research identity updated.")}
          className="bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider rounded-full px-5 h-9 border-none shadow-sm"
        >
          Save changes →
        </Button>
      </div>
    </div>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────
function NotificationsSection({ showToast }: { showToast: (m: string) => void }) {
  const [s, setS] = useState({
    digest: true,
    collab: true,
    mentions: false,
    paperUpdates: true,
    systemAlerts: false,
  });
  const [freq, setFreq] = useState("daily");
  const set = (k: keyof typeof s) => (v: boolean) =>
    setS((p) => ({ ...p, [k]: v }));
  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Notifications"
        subtitle="Control how and when Cambium reaches out to you."
      />
      <ToggleRow
        label="Weekly research digest"
        description="A curated summary of activity in your research areas."
        checked={s.digest}
        onChange={set("digest")}
      />
      <ToggleRow
        label="Collaboration requests"
        description="When someone invites you to a project or workspace."
        checked={s.collab}
        onChange={set("collab")}
      />
      <ToggleRow
        label="Mentions & comments"
        description="When someone references your work or leaves a comment."
        checked={s.mentions}
        onChange={set("mentions")}
      />
      <ToggleRow
        label="Paper & dataset updates"
        description="New versions of papers you've saved or cited."
        checked={s.paperUpdates}
        onChange={set("paperUpdates")}
      />
      <ToggleRow
        label="System & platform alerts"
        description="Important platform updates and policy notices."
        checked={s.systemAlerts}
        onChange={set("systemAlerts")}
      />
      <Divider />
      <FieldRow
        label="Email Frequency"
        hint="How often should Cambium send email notifications?"
      >
        <select
          value={freq}
          onChange={(e) => setFreq(e.target.value)}
          className="flex h-10 w-full appearance-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-strong"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2366716C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            paddingRight: "40px",
          }}
        >
          <option value="instant">Instant</option>
          <option value="daily">Daily digest</option>
          <option value="off">Off — in-app only</option>
        </select>
      </FieldRow>
      <div className="flex justify-end mt-4">
        <Button
          onClick={() => showToast("Notification preferences saved.")}
          className="bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider rounded-full px-5 h-9 border-none shadow-sm"
        >
          Save changes →
        </Button>
      </div>
    </div>
  );
}

// ─── Section: Privacy ─────────────────────────────────────────────────────────
function PrivacySection({ showToast }: { showToast: (m: string) => void }) {
  const [s, setS] = useState({
    profilePublic: true,
    showInstitution: true,
    showPublications: false,
    allowSearch: true,
  });
  const set = (k: keyof typeof s) => (v: boolean) =>
    setS((p) => ({ ...p, [k]: v }));
  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Privacy & Data Sovereignty"
        subtitle="Decide what scholarly peers and institutional networks can see about your research."
      />
      <ToggleRow
        label="Public researcher profile"
        description="Anyone within the Cambium network can view your public scholar profile."
        checked={s.profilePublic}
        onChange={set("profilePublic")}
      />
      <ToggleRow
        label="Show institutional affiliation"
        description="Display your current university or laboratory affiliation on your profile."
        checked={s.showInstitution}
        onChange={set("showInstitution")}
      />
      <ToggleRow
        label="Show publication list"
        description="Make your imported and indexed publications visible to other researchers."
        checked={s.showPublications}
        onChange={set("showPublications")}
      />
      <ToggleRow
        label="Appear in researcher discovery"
        description="Let other scholars discover and cite your profile via graph search."
        checked={s.allowSearch}
        onChange={set("allowSearch")}
      />
      <div className="flex justify-end mb-7 mt-4">
        <Button
          onClick={() => showToast("Privacy settings saved.")}
          className="bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider rounded-full px-5 h-9 border-none shadow-sm"
        >
          Save changes →
        </Button>
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl border border-[#E4DCCB] bg-white shadow-sm">
          <div className="mb-1 text-sm font-semibold text-[#202920]">
            Export Your Research Corpus
          </div>
          <div className="mb-3 text-xs leading-relaxed text-[#62685E]">
            Download a verified JSON/BibTeX archive of your Cambium corpus including notes, saved papers, synthesis drafts, and activity history.
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-[#E4DCCB] text-[#202920] hover:bg-[#FAF7F0] rounded-full text-xs font-mono uppercase tracking-wider h-8"
          >
            <Download size={13} className="mr-1.5 text-[#3E6248]" />
            Request Archive (.zip)
          </Button>
        </div>
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/40">
          <div className="mb-1 text-sm font-semibold text-red-700">
            Decommission Scholar Account
          </div>
          <div className="mb-3 text-xs leading-relaxed text-[#62685E]">
            Permanently removes your researcher identity and all associated private workspaces. This action cannot be reversed.
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-red-700 border-red-300 hover:bg-red-100 rounded-full text-xs font-mono uppercase tracking-wider h-8"
          >
            <Trash size={13} className="mr-1.5" />
            Delete Scholar Account
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Integrations ────────────────────────────────────────────────────
function IntegrationsSection() {
  const [connected, setConnected] = useState<Record<string, boolean>>({
    orcid: true,
    github: false,
    notion: false,
  });
  const toggle = (id: string) =>
    setConnected((p) => ({ ...p, [id]: !p[id] }));
  const items = [
    {
      id: "orcid",
      name: "ORCID",
      logo: <OrcidLogo />,
      description:
        "Sync publications, affiliations, and scholarly identity from your ORCID record.",
    },
    {
      id: "github",
      name: "GitHub",
      logo: <GithubLogo />,
      description:
        "Link repositories to research projects and cite software contributions.",
    },
    {
      id: "notion",
      name: "Notion",
      logo: <NotionLogo />,
      description:
        "Import notes and documents from Notion workspaces into your research library.",
    },
  ];
  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Scholarly Integrations"
        subtitle="Connect external citation repositories, version control, and note graphs."
      />
      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <IntegrationCard
            key={it.id}
            name={it.name}
            description={it.description}
            logo={it.logo}
            connected={connected[it.id]}
            onToggle={() => toggle(it.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Section: AI & Intelligence ───────────────────────────────────────────────
function AISection({ showToast }: { showToast: (m: string) => void }) {
  const [s, setS] = useState({
    usePapers: true,
    useNotes: true,
    useActivity: false,
    personalizedRecs: true,
  });
  const set = (k: keyof typeof s) => (v: boolean) =>
    setS((p) => ({ ...p, [k]: v }));
  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Synthetic Cognition & AI"
        subtitle="Configure how Cambium's neural assistants reason over your private corpus."
      />
      <div className="mb-6 rounded-xl border border-[#E4DCCB] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-[10px] tracking-wider uppercase text-[#3E6248] font-semibold">
            PRIVACY GUARANTEE
          </span>
        </div>
        <div className="text-xs leading-relaxed text-[#62685E]">
          Cambium uses specialized cognitive models to surface relevant literature, draft synthesis summaries, and trace citations. Your data is isolated to your private research session.
        </div>
      </div>
      <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#62685E]">
        Context Boundaries
      </div>
      <ToggleRow
        label="Use saved papers as context"
        description="Your saved and annotated papers inform AI suggestions and summaries."
        checked={s.usePapers}
        onChange={set("usePapers")}
      />
      <ToggleRow
        label="Use research notes as context"
        description="Notes and highlights are used to personalize AI-generated content."
        checked={s.useNotes}
        onChange={set("useNotes")}
      />
      <ToggleRow
        label="Use browsing activity"
        description="Your in-app activity patterns help refine recommendations."
        checked={s.useActivity}
        onChange={set("useActivity")}
      />
      <ToggleRow
        label="Personalized recommendations"
        description="AI surfaces papers and researchers based on your stated interests."
        checked={s.personalizedRecs}
        onChange={set("personalizedRecs")}
      />
      <Divider />
      <div className="mb-5">
        <div className="mb-1.5 font-serif text-base font-normal text-[#202920]">
          Custom LLM Inference Providers
        </div>
        <p className="mb-5 text-xs leading-relaxed text-[#62685E]">
          Optionally supply your own API keys to run inference on dedicated high-context models. Keys are stored encrypted and never logged.
        </p>
        <ApiKeyInput label="Anthropic" placeholder="sk-ant- ···" />
        <ApiKeyInput label="OpenAI" placeholder="sk- ···" />
        <ApiKeyInput label="Google Gemini" placeholder="AIza ···" />
      </div>
      <div className="flex justify-end mt-4">
        <Button
          onClick={() => showToast("AI preferences saved.")}
          className="bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider rounded-full px-5 h-9 border-none shadow-sm"
        >
          Save changes →
        </Button>
      </div>
    </div>
  );
}

// ─── Section: Security ────────────────────────────────────────────────────────
function SecuritySection({ showToast }: { showToast: (m: string) => void }) {
  const [twoFa, setTwoFa] = useState(false);
  const sessions = [
    {
      device: "MacBook Pro — Chrome",
      location: "Princeton, NJ",
      lastSeen: "Active now",
      current: true,
    },
    {
      device: "iPhone 15 Pro — Safari",
      location: "New York, NY",
      lastSeen: "2 hours ago",
      current: false,
    },
    {
      device: "Linux Workstation — Firefox",
      location: "Cambridge, MA",
      lastSeen: "3 days ago",
      current: false,
    },
  ];
  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Security & Access"
        subtitle="Manage authentication, multi-factor verification, and active sessions."
      />
      <div className="mb-6 p-4 rounded-xl border border-[#E4DCCB] bg-white shadow-sm">
        <div className="mb-1 text-sm font-semibold text-[#202920]">
          Password
        </div>
        <div className="mb-3 text-xs text-[#85877B]">
          Last modified 142 days ago.
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-[#E4DCCB] text-[#202920] hover:bg-[#FAF7F0] rounded-full text-xs font-mono uppercase tracking-wider h-8"
          onClick={() => showToast("Password reset email dispatched.")}
        >
          Send password reset email →
        </Button>
      </div>
      <Divider />
      <ToggleRow
        label="Two-factor authentication (2FA)"
        description="Add a second verification step via authenticator app. Recommended for academic credentials."
        checked={twoFa}
        onChange={(v) => {
          setTwoFa(v);
          showToast(v ? "2FA enabled." : "2FA disabled.");
        }}
      />
      <Divider />
      <div>
        <div className="mb-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#62685E]">
          Active Research Sessions
        </div>
        <div className="flex flex-col gap-2.5">
          {sessions.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#E4DCCB] bg-white shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#202920] font-sans">
                  {s.device}
                  {s.current && (
                    <span className="rounded bg-[#3E6248]/10 border border-[#3E6248]/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[#3E6248]">
                      This session
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-[#85877B] font-mono">
                  {s.location} · {s.lastSeen}
                </div>
              </div>
              {!s.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-mono uppercase tracking-wider"
                  onClick={() => showToast("Session revoked.")}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Appearance ──────────────────────────────────────────────────────
function AppearanceSection({ showToast }: { showToast: (m: string) => void }) {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("light");
  const opts: {
    id: "system" | "light" | "dark";
    label: string;
    desc: string;
  }[] = [
    {
      id: "system",
      label: "System",
      desc: "Adapts automatically to your operating system appearance.",
    },
    { id: "light", label: "Parchment & Minerals (Light)", desc: "Default Cambium living materials editorial theme." },
    { id: "dark", label: "Deep Forest (Dark)", desc: "Low-light research environment with muted contrast." },
  ];
  return (
    <div className="animate-fade-in">
      <SectionTitle
        title="Appearance & Canvas"
        subtitle="Choose your preferred research reading environment."
      />
      <div className="flex flex-col gap-2.5 mb-7">
        {opts.map((o) => (
          <label
            key={o.id}
            onClick={() => setTheme(o.id)}
            className={`flex cursor-pointer items-center justify-between rounded-xl border p-[14px_16px] transition-colors ${
              theme === o.id
                ? "border-[#3E6248] bg-white shadow-sm ring-1 ring-[#3E6248]/30"
                : "border-[#E4DCCB] bg-white hover:border-[#3E6248]/40"
            }`}
          >
            <div>
              <div className="text-sm font-semibold text-[#202920]">
                {o.label}
              </div>
              <div className="mt-0.5 text-xs text-[#62685E]">{o.desc}</div>
            </div>
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                theme === o.id
                  ? "border-[#3E6248] bg-[#3E6248]"
                  : "border-[#E4DCCB] bg-transparent"
              }`}
            >
              {theme === o.id && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
          </label>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => showToast("Appearance preference saved.")}
          className="bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider rounded-full px-5 h-9 border-none shadow-sm"
        >
          Save changes →
        </Button>
      </div>
    </div>
  );
}

// ─── Section: Organization & RBAC ─────────────────────────────────────────────
function OrganizationSection({ showToast }: { showToast: (m: string) => void }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Postdoctoral Fellow");

  const [members, setMembers] = useState([
    {
      id: "m-1",
      name: "Dr. Miriam Osei",
      email: "m.osei@princeton.edu",
      role: "Principal Investigator",
      status: "Active",
      tfa: true,
      initials: "MO",
    },
    {
      id: "m-2",
      name: "Dr. Elena Rostova",
      email: "elena.rostova@arch.ethz.ch",
      role: "Senior Scientist",
      status: "Active",
      tfa: true,
      initials: "ER",
    },
    {
      id: "m-3",
      name: "Marcus Thorne, PhD",
      email: "thorne@fas.harvard.edu",
      role: "Senior Scientist",
      status: "Active",
      tfa: true,
      initials: "MT",
    },
    {
      id: "m-4",
      name: "Dr. Aris Vance",
      email: "a.vance@ox.ac.uk",
      role: "Postdoctoral Fellow",
      status: "Active",
      tfa: false,
      initials: "AV",
    },
    {
      id: "m-5",
      name: "Shaik Mohamed Imthiyas",
      email: "shaik@cambium.research",
      role: "Principal Investigator",
      status: "Active",
      tfa: true,
      initials: "SI",
    },
    {
      id: "m-6",
      name: "Prof. David K. Miller",
      email: "d.miller@mit.edu",
      role: "External Reviewer",
      status: "Invited",
      tfa: false,
      initials: "DM",
    },
  ]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setMembers((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: inviteEmail.split("@")[0].replace(".", " "),
        email: inviteEmail.trim(),
        role: inviteRole,
        status: "Invited",
        tfa: false,
        initials: inviteEmail.slice(0, 2).toUpperCase(),
      },
    ]);

    showToast(`Invitation dispatched to ${inviteEmail} (${inviteRole}).`);
    setInviteEmail("");
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <SectionTitle
          title="Team & Role-Based Access Control (RBAC)"
          subtitle="Manage laboratory researchers, assign granular permissions, and administer multi-seat enterprise licenses."
        />

        {/* License Tier Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E4DCCB] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#3E6248] bg-[#DCE6D7] px-2.5 py-0.5 rounded-full">
                Institutional License Tier
              </span>
              <span className="font-mono text-xs text-[#85877B]">
                EduGAIN / InCommon SSO
              </span>
            </div>
            <h3 className="font-serif text-lg font-normal text-[#202920] m-0">
              Living Architecture Lab & Consortium
            </h3>
            <p className="font-sans text-xs text-[#62685E] mt-1 m-0">
              14 of 25 active scholar seats utilized · Annual institutional renewal due August 2027
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => showToast("Seat allocation request routed to university administrator.")}
              className="border-[#E4DCCB] text-[#202920] hover:bg-[#FAF7F0] rounded-full text-xs font-mono uppercase tracking-wider h-8"
            >
              Request Additional Seats
            </Button>
          </div>
        </div>

        {/* Invite Member Box */}
        <div className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#E4DCCB] mb-8">
          <h4 className="font-serif text-base font-normal text-[#202920] mb-2">
            Invite Scholar or Lab Collaborator
          </h4>
          <p className="font-sans text-xs text-[#62685E] mb-4">
            Invited members gain access to shared literature repositories, synthesis graphs, and collaborative notebook drafts.
          </p>

          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="collaborator@university.edu"
              className="flex-1 bg-white border-[#E4DCCB] h-10 text-xs font-sans"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="bg-white border border-[#E4DCCB] rounded-xl px-3 h-10 text-xs font-sans text-[#202920] focus:outline-none focus:border-[#3E6248]"
            >
              <option value="Principal Investigator">Principal Investigator (Admin)</option>
              <option value="Senior Scientist">Senior Scientist (Editor)</option>
              <option value="Postdoctoral Fellow">Postdoctoral Fellow (Contributor)</option>
              <option value="External Reviewer">External Reviewer (Viewer)</option>
            </select>
            <Button
              type="submit"
              className="bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider rounded-xl px-5 h-10 shrink-0 border-none shadow-sm"
            >
              Send Invite →
            </Button>
          </form>
        </div>

        {/* Active Members Table */}
        <div className="rounded-2xl border border-[#E4DCCB] bg-white overflow-hidden shadow-2xs mb-8">
          <div className="px-6 py-4 border-b border-[#E4DCCB] bg-[#FAF7F0]/60 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#202920]">
              Active Lab Members ({members.length})
            </span>
            <span className="font-mono text-[11px] text-[#85877B]">
              Role Matrix Enforced
            </span>
          </div>

          <div className="divide-y divide-[#E4DCCB]/60">
            {members.map((member) => (
              <div
                key={member.id}
                className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F0]/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#E4DCCB] flex items-center justify-center font-mono text-xs font-bold text-[#3E6248] shrink-0">
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[15px] font-medium text-[#202920] truncate">
                        {member.name}
                      </span>
                      {member.tfa && (
                        <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          2FA Active
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-[#62685E] truncate m-0">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                      member.role === "Principal Investigator"
                        ? "bg-purple-100 text-purple-900 border border-purple-200"
                        : member.role === "Senior Scientist"
                        ? "bg-[#DCE6D7] text-[#293E30] border border-[#66866A]/30"
                        : member.role === "Postdoctoral Fellow"
                        ? "bg-blue-50 text-blue-900 border border-blue-200"
                        : "bg-stone-100 text-stone-700 border border-stone-200"
                    }`}
                  >
                    {member.role}
                  </span>

                  <span
                    className={`font-mono text-[10px] font-semibold uppercase ${
                      member.status === "Active" ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Granular Permission Matrix Reference */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB]">
          <h4 className="font-serif text-base font-normal text-[#202920] mb-2">
            Institutional RBAC Permission Matrix
          </h4>
          <p className="font-sans text-xs text-[#62685E] mb-4">
            Roles dictate write capabilities, publication signing authority, and billing access across the platform.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans text-left">
              <thead>
                <tr className="border-b border-[#E4DCCB] text-[#85877B] font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-2 pr-4">Permission Capability</th>
                  <th className="py-2 px-3 text-center">PI (Admin)</th>
                  <th className="py-2 px-3 text-center">Sr. Scientist</th>
                  <th className="py-2 px-3 text-center">Postdoc</th>
                  <th className="py-2 px-3 text-center">Reviewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DCCB]/60 text-[#202920]">
                <tr>
                  <td className="py-2.5 pr-4 font-medium">Create & Edit Research Notebooks</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-[#85877B]">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium">Mutate Shared Knowledge Graph</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-amber-700">Draft Only</td>
                  <td className="py-2.5 px-3 text-center text-[#85877B]">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium">Submit Grants & Funding Opportunities</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-amber-700">Review</td>
                  <td className="py-2.5 px-3 text-center text-[#85877B]">—</td>
                  <td className="py-2.5 px-3 text-center text-[#85877B]">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium">Manage Seats, SSO & Security Audit Logs</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-[#85877B]">—</td>
                  <td className="py-2.5 px-3 text-center text-[#85877B]">—</td>
                  <td className="py-2.5 px-3 text-center text-[#85877B]">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Audit Logs & Version History ────────────────────────────────────
function AuditSection({ showToast }: { showToast: (m: string) => void }) {
  const [selectedDiff, setSelectedDiff] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>("all");

  const auditEvents = [
    {
      id: "ev-1",
      timestamp: "2026-10-04 14:22:18 UTC",
      actor: "Dr. Miriam Osei (PI)",
      event: "NOTEBOOK_MUTATED",
      target: "RNA_Folding_Landscape.nb",
      ip: "128.112.48.12",
      badge: "Diff Available",
    },
    {
      id: "ev-2",
      timestamp: "2026-10-04 11:05:42 UTC",
      actor: "Dr. Elena Rostova",
      event: "ROLE_PERMISSION_UPDATED",
      target: "Member: Prof. David K. Miller (Reviewer)",
      ip: "129.132.0.18",
      badge: "Governance",
    },
    {
      id: "ev-3",
      timestamp: "2026-10-03 19:40:11 UTC",
      actor: "Shaik Mohamed Imthiyas",
      event: "WORKSPACE_SNAPSHOT_EXPORT",
      target: "Living_Architecture_Complete.bib",
      ip: "103.21.244.2",
      badge: "Export",
    },
    {
      id: "ev-4",
      timestamp: "2026-10-03 16:12:00 UTC",
      actor: "System Auth Service",
      event: "INSTITUTIONAL_SSO_LOGIN",
      target: "EduGAIN SAML Authenticated (MIT CSAIL)",
      ip: "18.23.4.19",
      badge: "Authentication",
    },
    {
      id: "ev-5",
      timestamp: "2026-10-02 09:14:33 UTC",
      actor: "Marcus Thorne, PhD",
      event: "ROLLBACK_RESTORE_EXECUTED",
      target: "Quantum_Topology_v2.3",
      ip: "140.247.0.1",
      badge: "Rollback",
    },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <SectionTitle
          title="Audit Logs & Version History"
          subtitle="Verifiable, tamper-evident log of changes across research artifacts, hypotheses, and team permissions."
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {["all", "edits", "governance", "exports", "auth"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                filterType === type
                  ? "bg-[#3E6248] text-white shadow-2xs"
                  : "bg-white text-[#62685E] border border-[#E4DCCB] hover:text-[#202920]"
              }`}
            >
              {type === "all" ? "All Telemetry Events" : type}
            </button>
          ))}
        </div>

        {/* Audit Log Table */}
        <div className="rounded-2xl border border-[#E4DCCB] bg-white overflow-hidden shadow-2xs mb-8">
          <div className="px-6 py-4 border-b border-[#E4DCCB] bg-[#FAF7F0]/60 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#202920]">
              Chronological Audit Trail
            </span>
            <span className="font-mono text-[11px] text-[#85877B]">
              PostgreSQL Telemetry Ledger
            </span>
          </div>

          <div className="divide-y divide-[#E4DCCB]/60">
            {auditEvents.map((evt) => (
              <div
                key={evt.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F0]/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#202920]">
                      {evt.event}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#E4DCCB] text-[#62685E]">
                      {evt.badge}
                    </span>
                  </div>
                  <p className="font-serif text-sm text-[#3E6248] font-medium m-0">
                    {evt.target}
                  </p>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#85877B]">
                    <span>Actor: {evt.actor}</span>
                    <span>·</span>
                    <span>IP: {evt.ip}</span>
                    <span>·</span>
                    <span>{evt.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDiff(true)}
                    className="border-[#E4DCCB] text-[#202920] hover:bg-[#FAF7F0] rounded-full text-xs font-mono uppercase tracking-wider h-8"
                  >
                    Inspect Diff
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side Diff Viewer Card */}
        {selectedDiff && (
          <div className="p-6 rounded-2xl bg-white border border-[#E4DCCB] shadow-md space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCB]">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#3E6248] uppercase tracking-widest block">
                  Side-by-Side Version Diff
                </span>
                <h4 className="font-serif text-lg font-normal text-[#202920] m-0">
                  RNA_Folding_Landscape.nb (v2.4 vs v2.3 Snapshot)
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    showToast("Workspace successfully restored to Snapshot v2.3.");
                    setSelectedDiff(false);
                  }}
                  className="bg-[#3E6248] hover:bg-[#293E30] text-white text-xs font-mono uppercase tracking-wider rounded-full px-4 h-8 border-none shadow-xs"
                >
                  Rollback to v2.3
                </Button>
                <button
                  onClick={() => setSelectedDiff(false)}
                  className="p-1 text-[#85877B] hover:text-[#202920] bg-transparent border-0 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Previous version (v2.3) */}
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 space-y-2">
                <div className="font-bold text-red-900 border-b border-red-200 pb-1">
                  v2.3 (Previous Snapshot)
                </div>
                <div className="text-red-800 leading-relaxed">
                  - In classical CNN sequence models, quadratic complexity bounded attention window to 512 tokens.
                  <br />
                  - Off-target effects were estimated solely using heuristic alignment matrices.
                </div>
              </div>

              {/* Current version (v2.4) */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-900 border-b border-emerald-200 pb-1">
                  v2.4 (Current Active Version)
                </div>
                <div className="text-emerald-800 leading-relaxed">
                  + In hierarchical self-attention, linear sub-quadratic scaling extends context to 1,000,000 tokens with zero loss in retrieval precision.
                  <br />
                  + Off-target effects are now grounded against AlphaGenome thermodynamic binding maps.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section: Data Portability & Academic Import/Export ────────────────────────
function DataPortabilitySection({ showToast }: { showToast: (m: string) => void }) {
  const handleExport = (type: string) => {
    showToast(`Exporting complete workspace as ${type}... Check your scholar downloads.`);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <SectionTitle
          title="Data Portability & Research Sovereignty"
          subtitle="Maintain full provenance and open ownership of your scholarship. Ingest reference archives with zero lock-in or export complete workspaces in standard academic specifications."
        />

        {/* Clean Magnetic Artifact Ingestion Dropzone */}
        <div className="mb-8">
          <ArtifactDropzone
            label="Drag & drop Zotero (.json, .bib), Mendeley (.xml), or EndNote (.ris) reference libraries"
            acceptedFormats={[".json", ".bib", ".xml", ".ris", ".csv", ".pdf"]}
            onFileIngested={(file) => {
              showToast(`Imported ${file.name} (${file.size}): schemas normalized with 100% field parity.`);
            }}
          />
        </div>

        {/* Clean Export Actions (No Clunky Boxes) */}
        <div className="pt-6 border-t border-[#E4DCCB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-base font-normal text-[#202920] m-0">
              Export Complete Scholar Corpus
            </h4>
            <p className="font-sans text-xs text-[#62685E] mt-1 m-0">
              Download your full workspace, citation graphs, and drafted notes in standard open formats.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Button
              variant="outline"
              onClick={() => handleExport("BibTeX (.bib)")}
              className="border-[#E4DCCB] text-[#202920] hover:bg-white text-xs font-mono uppercase tracking-wider h-9 px-4 rounded-full shadow-2xs"
            >
              Export BibTeX (.bib)
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("RIS (.ris)")}
              className="border-[#E4DCCB] text-[#202920] hover:bg-white text-xs font-mono uppercase tracking-wider h-9 px-4 rounded-full shadow-2xs"
            >
              Export RIS (.ris)
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("Knowledge Graph (.json)")}
              className="border-[#E4DCCB] text-[#202920] hover:bg-white text-xs font-mono uppercase tracking-wider h-9 px-4 rounded-full shadow-2xs"
            >
              Export JSON Graph
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [active, setActive] = useState("account");
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    handler(); // initial set
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && NAV.some((n) => n.id === tab)) {
        setActive(tab);
      }
    }
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);
  const hideToast = useCallback(() => setToast((p) => ({ ...p, visible: false })), []);

  const activeNav = NAV.find((n) => n.id === active);

  const renderSection = () => {
    switch (active) {
      case "account":
        return <AccountSection showToast={showToast} />;
      case "organization":
        return <OrganizationSection showToast={showToast} />;
      case "audit":
        return <AuditSection showToast={showToast} />;
      case "export":
        return <DataPortabilitySection showToast={showToast} />;
      case "identity":
        return <IdentitySection showToast={showToast} />;
      case "notifications":
        return <NotificationsSection showToast={showToast} />;
      case "privacy":
        return <PrivacySection showToast={showToast} />;
      case "integrations":
        return <IntegrationsSection />;
      case "ai":
        return <AISection showToast={showToast} />;
      case "security":
        return <SecuritySection showToast={showToast} />;
      case "appearance":
        return <AppearanceSection showToast={showToast} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F0] font-sans overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-[#E4DCCB] bg-[#FAF7F0]/90 backdrop-blur-md px-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          {isMobile && (
            <button
              onClick={() => setMobileNavOpen((o) => !o)}
              className="flex p-1 text-[#62685E] hover:text-[#202920] bg-transparent border-none cursor-pointer"
            >
              <Menu size={18} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#66866A] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3E6248]">
              Account & Research Configuration
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-[#E4DCCB] shadow-2xs">
            <img src="/Profile.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex mx-auto w-full max-w-[1360px] flex-1 overflow-hidden relative">
        {/* Sidebar (stretched by ~20%) */}
        {(!isMobile || mobileNavOpen) && (
          <aside
            className={`flex-shrink-0 flex flex-col border-r border-[#E4DCCB] overflow-y-auto ${
              isMobile
                ? "fixed top-14 left-0 right-0 bottom-0 z-30 bg-[#FAF7F0] w-full p-4"
                : "w-[275px] bg-transparent py-8"
            }`}
          >
            <nav className="px-4 flex flex-col gap-1.5">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActive(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border-none px-4 py-2.5 text-left font-sans text-xs transition-colors cursor-pointer ${
                    active === item.id
                      ? "bg-white font-semibold text-[#202920] border border-[#E4DCCB] shadow-sm"
                      : "bg-transparent font-normal text-[#62685E] hover:bg-white/60 hover:text-[#202920]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`${
                        active === item.id ? "text-[#3E6248]" : "text-[#85877B]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.id === "export" && (
                    <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#3E6248] bg-[#DCE6D7] border border-[#66866A]/20 px-1.5 py-0.5 rounded-full font-bold">
                      Dropzone
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Content (stretched right side by an additional 10% to max-w-[1080px] for optimal alignment) */}
        <main
          className={`flex-1 min-w-0 overflow-y-auto w-full ${
            isMobile ? "p-6" : "p-10 max-w-[1080px]"
          }`}
        >
          {/* Mobile breadcrumb */}
          {isMobile && (
            <div className="mb-5 flex items-center gap-1.5 text-xs text-[#85877B]">
              <span>Settings</span>
              <ChevronRight size={12} className="text-[#85877B]" />
              <span className="font-medium text-[#202920]">
                {activeNav?.label}
              </span>
            </div>
          )}
          <div className="pb-20">
            {renderSection()}
          </div>
        </main>
      </div>

      <Toast message={toast.message} visible={toast.visible} onHide={hideToast} />
    </div>
  );
}
