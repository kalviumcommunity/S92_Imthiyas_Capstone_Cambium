import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

// ─── Icons (inline SVG, no external deps) ────────────────────────────────────
const Icon = {
  user: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  dna: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1-1"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m6.5 12.5 1 1"/><path d="m16.5 10.5 1 1"/><path d="m10 16 1.5 1.5"/>
    </svg>
  ),
  bell: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  lock: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  plug: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2Z"/>
    </svg>
  ),
  brain: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  shield: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  sun: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  chevronRight: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  external: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  copy: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  eye: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  eyeOff: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  trash: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  download: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  monitor: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
};

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle" onClick={() => onChange(!checked)}>
      <input type="checkbox" checked={checked} onChange={() => {}} />
      <div className="toggle-track" />
      <div className="toggle-thumb" style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }} />
    </label>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, visible, onHide }: { message: string; visible: boolean; onHide: () => void }) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 3200);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#173F35",
        color: "#fff",
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        fontWeight: 500,
        padding: "12px 18px",
        borderRadius: 6,
        boxShadow: "0 4px 20px rgba(23,63,53,0.22)",
        transform: visible ? "translateY(0)" : "translateY(16px)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.22s ease, transform 0.22s ease",
      }}
    >
      <span style={{ color: "#DCEBE4" }}>{Icon.check}</span>
      {message}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "#17201D", margin: 0, letterSpacing: "-0.01em" }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "#66716C", margin: "6px 0 0", lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Field row ────────────────────────────────────────────────────────────────
function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
      <label style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "#66716C", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: 12, color: "#66716C", margin: 0, lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Input({ type = "text", value, onChange, placeholder, disabled }: {
  type?: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        fontFamily: "var(--font-ui)", fontSize: 14, color: "#17201D",
        background: disabled ? "#F7F6F1" : "#fff",
        border: "1px solid #DDE2DE", borderRadius: 5,
        padding: "9px 12px", width: "100%",
        transition: "border-color 0.15s, box-shadow 0.15s",
        cursor: disabled ? "not-allowed" : "text",
        opacity: disabled ? 0.7 : 1,
      }}
    />
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: "#DDE2DE", margin: "28px 0" }} />;
}

// ─── Toggle row ───────────────────────────────────────────────────────────────
function ToggleRow({ label, description, checked, onChange }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, paddingBottom: 20 }}>
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 500, color: "#17201D" }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: "#66716C", marginTop: 3, lineHeight: 1.5 }}>{description}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
function Button({ children, variant = "primary", onClick, danger, small }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void; danger?: boolean; small?: boolean;
}) {
  const base: React.CSSProperties = {
    fontFamily: "var(--font-ui)", fontWeight: 600,
    fontSize: small ? 12 : 13, borderRadius: 5, cursor: "pointer",
    padding: small ? "6px 12px" : "9px 18px",
    transition: "opacity 0.15s, background 0.15s",
    border: "1px solid transparent", display: "inline-flex", alignItems: "center", gap: 6,
    whiteSpace: "nowrap",
  };
  if (danger) return (
    <button onClick={onClick} style={{ ...base, background: "transparent", border: "1px solid #C94C4C", color: "#C94C4C" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#FFF5F5")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >{children}</button>
  );
  if (variant === "primary") return (
    <button onClick={onClick} style={{ ...base, background: "#173F35", color: "#fff", borderColor: "#173F35" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#285C4D")}
      onMouseLeave={e => (e.currentTarget.style.background = "#173F35")}
    >{children}</button>
  );
  if (variant === "secondary") return (
    <button onClick={onClick} style={{ ...base, background: "#fff", color: "#17201D", border: "1px solid #DDE2DE" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#F7F6F1")}
      onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
    >{children}</button>
  );
  return (
    <button onClick={onClick} style={{ ...base, background: "transparent", color: "#285C4D", border: "1px solid transparent", padding: small ? "4px 8px" : "7px 12px" }}
      onMouseEnter={e => (e.currentTarget.style.background = "#DCEBE4")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >{children}</button>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────
function IntegrationCard({
  name, description, logo, connected, onToggle,
}: {
  name: string; description: string; logo: React.ReactNode;
  connected: boolean; onToggle: () => void;
}) {
  return (
    <div style={{
      border: "1px solid #DDE2DE", borderRadius: 8, padding: "18px 20px",
      background: "#fff", display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8, border: "1px solid #DDE2DE",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#F7F6F1", flexShrink: 0,
        }}>
          {logo}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#17201D" }}>{name}</span>
            {connected && (
              <span style={{
                fontSize: 11, fontWeight: 600, color: "#285C4D",
                background: "#DCEBE4", borderRadius: 4, padding: "2px 7px",
                letterSpacing: "0.03em",
              }}>Connected</span>
            )}
          </div>
          <p style={{ fontSize: 12, color: "#66716C", margin: "3px 0 0", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {description}
          </p>
        </div>
      </div>
      <Button variant={connected ? "secondary" : "primary"} small onClick={onToggle}>
        {connected ? "Disconnect" : "Connect"}
      </Button>
    </div>
  );
}

// ─── Masked API Key Input ─────────────────────────────────────────────────────
function ApiKeyInput({ label, placeholder }: { label: string; placeholder: string }) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  return (
    <FieldRow label={label}>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          style={{
            fontFamily: "var(--font-ui)", fontSize: 14, color: "#17201D",
            background: "#fff", border: "1px solid #DDE2DE", borderRadius: 5,
            padding: "9px 40px 9px 12px", width: "100%",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
        />
        <button
          onClick={() => setShow(s => !s)}
          style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#66716C", padding: 2,
          }}
          title={show ? "Hide key" : "Reveal key"}
        >
          {show ? Icon.eyeOff : Icon.eye}
        </button>
      </div>
    </FieldRow>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV: NavItem[] = [
  { id: "account", label: "Account", icon: Icon.user },
  { id: "identity", label: "Research Identity", icon: Icon.dna },
  { id: "notifications", label: "Notifications", icon: Icon.bell },
  { id: "privacy", label: "Privacy", icon: Icon.lock },
  { id: "integrations", label: "Integrations", icon: Icon.plug },
  { id: "ai", label: "AI & Intelligence", icon: Icon.brain },
  { id: "security", label: "Security", icon: Icon.shield },
  { id: "appearance", label: "Appearance", icon: Icon.sun },
];

// ─── Logos (inline SVG) ───────────────────────────────────────────────────────
const OrcidLogo = () => (
  <svg width="20" height="20" viewBox="0 0 256 256" fill="none">
    <circle cx="128" cy="128" r="128" fill="#A6CE39"/>
    <rect x="87" y="60" width="22" height="136" rx="4" fill="white"/>
    <circle cx="98" cy="44" r="13" fill="white"/>
    <path d="M130 60h40c33 0 56 23 56 68s-23 68-56 68h-40V60z" fill="white"/>
    <path d="M148 80h18c22 0 38 17 38 48s-16 48-38 48h-18V80z" fill="#A6CE39"/>
  </svg>
);

const GithubLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#17201D">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const NotionLogo = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="#17201D">
    <path d="M6 11.2c1.7 1.4 2.4 1.3 5.6 1.1l30.5-1.8c.6 0 .1-.6-.1-.7l-5-3.6c-.9-.8-2.1-1.5-4.4-1.3L4.8 7.3c-.9.1-1.1.6-.7 1l2 2.9zm2.2 8.3v32.1c0 1.7.8 2.4 2.7 2.3l33.6-1.9c1.9-.1 2.1-1.3 2.1-2.7V17.5c0-1.4-.6-2.1-1.9-2l-34.6 2c-1.4.1-1.9.8-1.9 2zm32.6 1.6c.2 1 0 2-.9 2.1l-1.5.2V40c-1.2-.7-2.3-1.5-3.2-2.5l-9-14.4v16.5l2.8.6s0 2.1-2.9 2.2l-8-.1c-.2-1 .4-2.1 1.4-2.3l2.2-.6V24L19.5 23c-.2-1 .4-2.4 2.2-2.5l8.6-.5 9.4 14.8V21.3l-2.4-.2c-.2-1.3.6-2.3 1.9-2.4l8.6-.3zm22.3-1.3L38.5 22c-1.8.1-2.2 1.3-2.2 2.8V50c0 1.3.5 2.1 1.9 2l26.3-1.5c1.5-.1 1.9-.9 1.9-2.2V21.9c0-1.2-.5-2.1-1.9-2z"/>
  </svg>
);

// ─── Section: Account ─────────────────────────────────────────────────────────
function AccountSection({ showToast }: { showToast: (m: string) => void }) {
  const [name, setName] = useState("Dr. Miriam Osei");
  const [email, setEmail] = useState("m.osei@princeton.edu");
  const [institution, setInstitution] = useState("Princeton University");
  return (
    <div>
      <SectionTitle title="Account" subtitle="Manage your personal information and institutional affiliation." />
      <FieldRow label="Full Name">
        <Input value={name} onChange={setName} />
      </FieldRow>
      <FieldRow label="Email Address">
        <Input type="email" value={email} onChange={setEmail} />
      </FieldRow>
      <FieldRow label="Institution">
        <Input value={institution} onChange={setInstitution} />
      </FieldRow>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <Button onClick={() => showToast("Account details saved.")}>Save changes</Button>
      </div>
    </div>
  );
}

// ─── Section: Research Identity ───────────────────────────────────────────────
function IdentitySection({ showToast }: { showToast: (m: string) => void }) {
  const [orcid, setOrcid] = useState("0000-0002-1825-0097");
  const [interests, setInterests] = useState("Computational genomics, RNA secondary structure, evolutionary biology");
  const pubs = [
    { title: "Deep learning approaches for predicting RNA folding landscapes", year: 2024, source: "imported" },
    { title: "Comparative analysis of CRISPR off-target effects across model organisms", year: 2023, source: "imported" },
    { title: "Notes on transcription factor binding in non-model organisms", year: 2022, source: "manual" },
  ];
  return (
    <div>
      <SectionTitle title="Research Identity" subtitle="Your scholarly profile and publication record." />
      <FieldRow label="ORCID iD" hint="Your persistent digital identifier for scholarly work.">
        <div style={{ display: "flex", gap: 8 }}>
          <Input value={orcid} onChange={setOrcid} placeholder="0000-0000-0000-0000" />
          <Button variant="ghost" small><span style={{ color: "#66716C" }}>{Icon.external}</span></Button>
        </div>
      </FieldRow>
      <FieldRow label="Research Interests">
        <textarea
          value={interests}
          onChange={e => setInterests(e.target.value)}
          rows={3}
          style={{
            fontFamily: "var(--font-ui)", fontSize: 14, color: "#17201D",
            background: "#fff", border: "1px solid #DDE2DE", borderRadius: 5,
            padding: "9px 12px", width: "100%", resize: "vertical", lineHeight: 1.6,
          }}
        />
      </FieldRow>
      <Divider />
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "#66716C", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 14 }}>
          Publications
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pubs.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "12px 14px", border: "1px solid #DDE2DE", borderRadius: 6, background: "#fff" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#17201D", lineHeight: 1.4 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#66716C", marginTop: 3 }}>{p.year}</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, flexShrink: 0,
                color: p.source === "imported" ? "#285C4D" : "#66716C",
                background: p.source === "imported" ? "#DCEBE4" : "#F0F0EE",
                borderRadius: 4, padding: "2px 8px", letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}>
                {p.source === "imported" ? "Imported" : "Manual"}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button variant="ghost" small>+ Add publication manually</Button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => showToast("Research identity updated.")}>Save changes</Button>
      </div>
    </div>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────
function NotificationsSection({ showToast }: { showToast: (m: string) => void }) {
  const [s, setS] = useState({ digest: true, collab: true, mentions: false, paperUpdates: true, systemAlerts: false });
  const [freq, setFreq] = useState("daily");
  const set = (k: keyof typeof s) => (v: boolean) => setS(p => ({ ...p, [k]: v }));
  return (
    <div>
      <SectionTitle title="Notifications" subtitle="Control how and when Cambium reaches out to you." />
      <ToggleRow label="Weekly research digest" description="A curated summary of activity in your research areas." checked={s.digest} onChange={set("digest")} />
      <ToggleRow label="Collaboration requests" description="When someone invites you to a project or workspace." checked={s.collab} onChange={set("collab")} />
      <ToggleRow label="Mentions & comments" description="When someone references your work or leaves a comment." checked={s.mentions} onChange={set("mentions")} />
      <ToggleRow label="Paper & dataset updates" description="New versions of papers you've saved or cited." checked={s.paperUpdates} onChange={set("paperUpdates")} />
      <ToggleRow label="System & platform alerts" description="Important platform updates and policy notices." checked={s.systemAlerts} onChange={set("systemAlerts")} />
      <Divider />
      <FieldRow label="Email Frequency" hint="How often should Cambium send email notifications?">
        <select
          value={freq}
          onChange={e => setFreq(e.target.value)}
          style={{
            fontFamily: "var(--font-ui)", fontSize: 14, color: "#17201D",
            background: "#fff", border: "1px solid #DDE2DE", borderRadius: 5,
            padding: "9px 12px", cursor: "pointer", appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2366716C' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
          }}
        >
          <option value="instant">Instant</option>
          <option value="daily">Daily digest</option>
          <option value="off">Off — in-app only</option>
        </select>
      </FieldRow>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => showToast("Notification preferences saved.")}>Save changes</Button>
      </div>
    </div>
  );
}

// ─── Section: Privacy ─────────────────────────────────────────────────────────
function PrivacySection({ showToast }: { showToast: (m: string) => void }) {
  const [s, setS] = useState({ profilePublic: true, showInstitution: true, showPublications: false, allowSearch: true });
  const set = (k: keyof typeof s) => (v: boolean) => setS(p => ({ ...p, [k]: v }));
  return (
    <div>
      <SectionTitle title="Privacy" subtitle="Decide what others can see about you and your work." />
      <ToggleRow label="Public profile" description="Anyone with a Cambium account can view your researcher profile." checked={s.profilePublic} onChange={set("profilePublic")} />
      <ToggleRow label="Show institutional affiliation" description="Display your institution on your public profile." checked={s.showInstitution} onChange={set("showInstitution")} />
      <ToggleRow label="Show publication list" description="Make your publications visible to other researchers." checked={s.showPublications} onChange={set("showPublications")} />
      <ToggleRow label="Appear in researcher search" description="Let other users find you via search and discovery features." checked={s.allowSearch} onChange={set("allowSearch")} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
        <Button onClick={() => showToast("Privacy settings saved.")}>Save changes</Button>
      </div>
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#17201D", marginBottom: 4 }}>Export your data</div>
          <div style={{ fontSize: 12, color: "#66716C", marginBottom: 12, lineHeight: 1.5 }}>
            Download a full archive of your Cambium data including notes, saved papers, and activity history.
          </div>
          <Button variant="secondary" small>
            {Icon.download} Request data export
          </Button>
        </div>
        <div style={{ paddingTop: 4 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#C94C4C", marginBottom: 4 }}>Delete account</div>
          <div style={{ fontSize: 12, color: "#66716C", marginBottom: 12, lineHeight: 1.5 }}>
            Permanently removes your account and all associated data. This action cannot be undone.
          </div>
          <Button danger small>
            {Icon.trash} Delete my account
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
  const toggle = (id: string) => setConnected(p => ({ ...p, [id]: !p[id] }));
  const items = [
    {
      id: "orcid", name: "ORCID", logo: <OrcidLogo />,
      description: "Sync publications, affiliations, and scholarly identity from your ORCID record.",
    },
    {
      id: "github", name: "GitHub", logo: <GithubLogo />,
      description: "Link repositories to research projects and cite software contributions.",
    },
    {
      id: "notion", name: "Notion", logo: <NotionLogo />,
      description: "Import notes and documents from Notion workspaces into your research library.",
    },
  ];
  return (
    <div>
      <SectionTitle title="Integrations" subtitle="Connect external tools and services to your Cambium workspace." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(it => (
          <IntegrationCard key={it.id} name={it.name} description={it.description} logo={it.logo}
            connected={connected[it.id]} onToggle={() => toggle(it.id)} />
        ))}
      </div>
    </div>
  );
}

// ─── Section: AI & Intelligence ───────────────────────────────────────────────
function AISection({ showToast }: { showToast: (m: string) => void }) {
  const [s, setS] = useState({
    usePapers: true, useNotes: true, useActivity: false, personalizedRecs: true,
  });
  const set = (k: keyof typeof s) => (v: boolean) => setS(p => ({ ...p, [k]: v }));
  return (
    <div>
      <SectionTitle title="AI & Intelligence" subtitle="Configure how Cambium's AI features use your research context." />
      <div style={{ background: "#F7F6F1", border: "1px solid #DDE2DE", borderRadius: 6, padding: "14px 16px", marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#66716C", lineHeight: 1.6 }}>
          Cambium uses AI to surface relevant literature, summarize documents, and assist with writing. You control which data informs these features.
        </div>
      </div>
      <div style={{ marginBottom: 8, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "#66716C", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        Data context
      </div>
      <ToggleRow label="Use saved papers as context" description="Your saved and annotated papers inform AI suggestions and summaries." checked={s.usePapers} onChange={set("usePapers")} />
      <ToggleRow label="Use research notes as context" description="Notes and highlights are used to personalize AI-generated content." checked={s.useNotes} onChange={set("useNotes")} />
      <ToggleRow label="Use browsing activity" description="Your in-app activity patterns help refine recommendations." checked={s.useActivity} onChange={set("useActivity")} />
      <ToggleRow label="Personalized recommendations" description="AI surfaces papers and researchers based on your stated interests." checked={s.personalizedRecs} onChange={set("personalizedRecs")} />
      <Divider />
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 400, color: "#17201D", marginBottom: 6 }}>AI Providers</div>
        <p style={{ fontSize: 12, color: "#66716C", marginBottom: 20, lineHeight: 1.5 }}>
          Optionally supply your own API keys to use a specific provider. Keys are stored encrypted and never shared.
        </p>
        <ApiKeyInput label="Anthropic" placeholder="sk-ant- ···" />
        <ApiKeyInput label="OpenAI" placeholder="sk- ···" />
        <ApiKeyInput label="Gemini" placeholder="AIza ···" />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => showToast("AI preferences saved.")}>Save changes</Button>
      </div>
    </div>
  );
}

// ─── Section: Security ────────────────────────────────────────────────────────
function SecuritySection({ showToast }: { showToast: (m: string) => void }) {
  const [twoFa, setTwoFa] = useState(false);
  const sessions = [
    { device: "MacBook Pro — Chrome", location: "Princeton, NJ", lastSeen: "Active now", current: true },
    { device: "iPhone 15 Pro — Safari", location: "New York, NY", lastSeen: "2 hours ago", current: false },
    { device: "Linux — Firefox", location: "Cambridge, MA", lastSeen: "3 days ago", current: false },
  ];
  return (
    <div>
      <SectionTitle title="Security" subtitle="Manage authentication, two-factor security, and active sessions." />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#17201D", marginBottom: 4 }}>Password</div>
        <div style={{ fontSize: 12, color: "#66716C", marginBottom: 12 }}>
          Last changed 142 days ago.
        </div>
        <Button variant="secondary" small onClick={() => showToast("Password reset email sent.")}>
          Send password reset email
        </Button>
      </div>
      <Divider />
      <ToggleRow
        label="Two-factor authentication"
        description="Add a second verification step when signing in. Recommended."
        checked={twoFa}
        onChange={v => { setTwoFa(v); showToast(v ? "2FA enabled." : "2FA disabled."); }}
      />
      <Divider />
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "#66716C", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 14 }}>
          Active sessions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sessions.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 14px", border: "1px solid #DDE2DE", borderRadius: 6, background: "#fff" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#17201D", display: "flex", alignItems: "center", gap: 8 }}>
                  {s.device}
                  {s.current && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#285C4D", background: "#DCEBE4", borderRadius: 4, padding: "1px 6px" }}>
                      This device
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#66716C", marginTop: 2 }}>{s.location} · {s.lastSeen}</div>
              </div>
              {!s.current && (
                <Button variant="ghost" small danger onClick={() => showToast("Session revoked.")}>Revoke</Button>
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
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const opts: { id: "system" | "light" | "dark"; label: string; desc: string }[] = [
    { id: "system", label: "System", desc: "Follows your device's current setting." },
    { id: "light", label: "Light", desc: "Always uses the light interface." },
    { id: "dark", label: "Dark", desc: "Always uses the dark interface." },
  ];
  return (
    <div>
      <SectionTitle title="Appearance" subtitle="Choose your preferred interface theme." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {opts.map(o => (
          <label key={o.id} onClick={() => setTheme(o.id)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", border: `1px solid ${theme === o.id ? "#285C4D" : "#DDE2DE"}`,
            borderRadius: 6, background: theme === o.id ? "#F4FAF7" : "#fff", cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#17201D" }}>{o.label}</div>
              <div style={{ fontSize: 12, color: "#66716C", marginTop: 2 }}>{o.desc}</div>
            </div>
            <div style={{
              width: 16, height: 16, borderRadius: "50%", border: `2px solid ${theme === o.id ? "#285C4D" : "#DDE2DE"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: theme === o.id ? "#285C4D" : "transparent", flexShrink: 0,
            }}>
              {theme === o.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
            </div>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => showToast("Appearance preference saved.")}>Save changes</Button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("account");
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);
  const hideToast = useCallback(() => setToast(p => ({ ...p, visible: false })), []);

  const activeNav = NAV.find(n => n.id === active);

  const renderSection = () => {
    switch (active) {
      case "account": return <AccountSection showToast={showToast} />;
      case "identity": return <IdentitySection showToast={showToast} />;
      case "notifications": return <NotificationsSection showToast={showToast} />;
      case "privacy": return <PrivacySection showToast={showToast} />;
      case "integrations": return <IntegrationsSection />;
      case "ai": return <AISection showToast={showToast} />;
      case "security": return <SecuritySection showToast={showToast} />;
      case "appearance": return <AppearanceSection showToast={showToast} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F1", fontFamily: "var(--font-ui)" }}>
      {/* Header */}
      <header style={{
        height: 52, borderBottom: "1px solid #DDE2DE", background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isMobile && (
            <button
              onClick={() => setMobileNavOpen(o => !o)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#66716C", padding: 4, display: "flex" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 400, color: "#173F35", letterSpacing: "-0.01em" }}>
            Cambium
          </span>
          <span style={{ fontSize: 12, color: "#DDE2DE" }}>·</span>
          <span style={{ fontSize: 13, color: "#66716C" }}>Settings</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#DCEBE4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#173F35" }}>MO</span>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", minHeight: "calc(100vh - 52px)" }}>
        {/* Sidebar */}
        {(!isMobile || mobileNavOpen) && (
          <aside style={{
            width: isMobile ? "100%" : 220,
            borderRight: isMobile ? "none" : "1px solid #DDE2DE",
            background: isMobile ? "#fff" : "transparent",
            padding: isMobile ? "12px 0" : "32px 0",
            flexShrink: 0,
            position: isMobile ? "fixed" : "sticky",
            top: isMobile ? 52 : undefined,
            left: 0, right: 0,
            zIndex: isMobile ? 30 : undefined,
            height: isMobile ? "auto" : "calc(100vh - 52px)",
            overflowY: "auto",
            boxShadow: isMobile ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
            borderBottom: isMobile ? "1px solid #DDE2DE" : "none",
          }}>
            <nav style={{ padding: "0 12px" }}>
              {NAV.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActive(item.id); setMobileNavOpen(false); }}
                  style={{
                    width: "100%", textAlign: "left", background: active === item.id ? "#DCEBE4" : "transparent",
                    border: "none", borderRadius: 6, padding: "9px 12px",
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 13,
                    fontWeight: active === item.id ? 600 : 400,
                    color: active === item.id ? "#173F35" : "#66716C",
                    marginBottom: 2, transition: "background 0.12s, color 0.12s",
                  }}
                  onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = "#F0F4F2"; }}
                  onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ opacity: active === item.id ? 1 : 0.65 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Content */}
        <main style={{
          flex: 1, minWidth: 0, padding: isMobile ? "24px 16px" : "40px 48px",
          maxWidth: isMobile ? "100%" : 680,
        }}>
          {/* Mobile breadcrumb */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, color: "#66716C", fontSize: 12 }}>
              <span>Settings</span>
              <span style={{ color: "#DDE2DE" }}>{Icon.chevronRight}</span>
              <span style={{ color: "#17201D", fontWeight: 500 }}>{activeNav?.label}</span>
            </div>
          )}
          {renderSection()}
        </main>
      </div>

      <Toast message={toast.message} visible={toast.visible} onHide={hideToast} />
    </div>
  );
}
