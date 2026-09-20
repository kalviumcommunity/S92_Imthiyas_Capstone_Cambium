import { useState } from "react";

function CambiumLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="28" height="28" rx="6" fill="#173F35" />
        <path d="M8 14C8 10.686 10.686 8 14 8C15.933 8 17.655 8.883 18.8 10.267L21 8.4C19.267 6.373 16.78 5 14 5C9.03 5 5 9.03 5 14C5 18.97 9.03 23 14 23C16.78 23 19.267 21.627 21 19.6L18.8 17.733C17.655 19.117 15.933 20 14 20C10.686 20 8 17.314 8 14Z" fill="#F7F6F1" />
      </svg>
      <span
        className="text-[13px] font-bold tracking-[0.2em] text-[#17201D]"
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        CAMBIUM
      </span>
    </div>
  );
}

const NODES = [
  { label: "Scientific ML", x: "18%", y: "18%", cls: "float-a" },
  { label: "Maya Chen", x: "62%", y: "10%", cls: "float-b" },
  { label: "Protein Folding", x: "72%", y: "38%", cls: "float-a" },
  { label: "Dr. Patel", x: "28%", y: "50%", cls: "float-c" },
  { label: "Climate Systems", x: "8%", y: "68%", cls: "float-b" },
  { label: "Quantum Bio", x: "55%", y: "62%", cls: "float-a" },
  { label: "Nature, 2024", x: "78%", y: "76%", cls: "float-c" },
  { label: "Graph Theory", x: "30%", y: "80%", cls: "float-b" },
];

const EDGES = [
  [0, 1], [1, 2], [0, 3], [3, 4], [3, 5], [2, 5], [5, 6], [5, 7],
];

function NetworkGraph() {
  return (
    <div className="relative w-full flex-1 min-h-[220px]" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {EDGES.map(([a, b], i) => {
          const na = NODES[a], nb = NODES[b];
          return (
            <line
              key={i}
              x1={na.x} y1={na.y}
              x2={nb.x} y2={nb.y}
              stroke="#173F35"
              strokeOpacity="0.18"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>
      {NODES.map((node) => (
        <div
          key={node.label}
          className={`absolute ${node.cls} select-none`}
          style={{ left: node.x, top: node.y, transform: "translate(-50%,-50%)" }}
        >
          <div
            className="px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
            style={{
              fontFamily: "Manrope, sans-serif",
              background: "#fff",
              border: "1px solid #DDE2DE",
              color: "#17201D",
              boxShadow: "0 1px 4px 0 rgba(23,63,53,0.07)",
            }}
          >
            {node.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="1" y="1" width="7.5" height="7.5" fill="#F25022" />
      <rect x="9.5" y="1" width="7.5" height="7.5" fill="#7FBA00" />
      <rect x="1" y="9.5" width="7.5" height="7.5" fill="#00A4EF" />
      <rect x="9.5" y="9.5" width="7.5" height="7.5" fill="#FFB900" />
    </svg>
  );
}

function OrcidIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0z" fill="#A6CE39" />
      <path d="M86.3 186.2H70.9V79.1h15.4v107.1zM108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h25.5c30.5 0 42.2-21.9 42.2-39.7C191.9 112 178 93 153.3 93h-29v79.4zm-48.2-117.5c0 5.5-4.5 9.9-9.9 9.9s-9.9-4.5-9.9-9.9 4.5-9.9 9.9-9.9 9.9 4.5 9.9 9.9z" fill="#fff" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden"
      style={{ fontFamily: "Manrope, sans-serif" }}
    >
      {/* Left Column */}
      <div
        className="hidden md:flex flex-col p-12 h-full"
        style={{ background: "#F7F6F1" }}
      >
        <CambiumLogo />

        <div className="flex flex-col flex-1 justify-center gap-8 mt-10">
          <div className="max-w-[480px]">
            <h1
              className="text-5xl leading-[1.12] tracking-tight mb-4"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: "#17201D" }}
            >
              Your research world,{" "}
              <em
                className="not-italic italic"
                style={{ color: "#173F35", fontStyle: "italic" }}
              >
                finally
              </em>{" "}
              connected.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#66716C" }}>
              Build your academic identity, organize your research, discover
              opportunities, and connect with researchers.
            </p>
          </div>

          <NetworkGraph />
        </div>

        <div className="mt-6">
          <span
            className="text-[11px] tracking-[0.25em] font-semibold uppercase"
            style={{ color: "#66716C" }}
          >
            Research Operating System
          </span>
        </div>
      </div>

      {/* Right Column */}
      <div
        className="flex flex-col items-center justify-center h-full px-6 py-10 overflow-y-auto"
        style={{ background: "#FFFFFF" }}
      >
        {/* Mobile logo */}
        <div className="md:hidden mb-8">
          <CambiumLogo />
        </div>

        <div className="w-full max-w-[400px] flex flex-col gap-6">
          {/* Heading */}
          <div className="flex flex-col gap-1.5">
            <h2
              className="text-3xl font-semibold leading-tight"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: "#17201D" }}
            >
              Create your Cambium account
            </h2>
            <p className="text-sm" style={{ color: "#66716C" }}>
              Your research identity starts here.
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-2.5">
            {[
              { label: "Continue with Google", Icon: GoogleIcon },
              { label: "Continue with Microsoft", Icon: MicrosoftIcon },
              { label: "Continue with ORCID", Icon: OrcidIcon },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                className="flex items-center justify-center gap-2.5 w-full h-10 rounded-md border text-sm font-medium transition-colors cursor-pointer"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #DDE2DE",
                  color: "#17201D",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F6F1")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
                aria-label={label}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "#DDE2DE" }} />
            <span
              className="text-xs px-2 shrink-0"
              style={{ color: "#66716C", background: "#FFFFFF" }}
            >
              or continue with email
            </span>
            <div className="flex-1 h-px" style={{ background: "#DDE2DE" }} />
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: "#17201D" }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-md border px-3 text-sm w-full outline-none transition-all"
                style={{
                  borderColor: "#DDE2DE",
                  color: "#17201D",
                  background: "#FFFFFF",
                  fontFamily: "Manrope, sans-serif",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#173F35";
                  e.currentTarget.style.boxShadow = "0 0 0 1px #173F35";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#DDE2DE";
                  e.currentTarget.style.boxShadow = "none";
                }}
                aria-label="Email address"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "#17201D" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-md border px-3 pr-10 text-sm w-full outline-none transition-all"
                  style={{
                    borderColor: "#DDE2DE",
                    color: "#17201D",
                    background: "#FFFFFF",
                    fontFamily: "Manrope, sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#173F35";
                    e.currentTarget.style.boxShadow = "0 0 0 1px #173F35";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#DDE2DE";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                  style={{ color: "#66716C" }}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#17201D")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#66716C")}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="h-10 rounded-md text-sm font-semibold w-full mt-1 transition-opacity cursor-pointer"
              style={{
                background: "#173F35",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              aria-label="Create your Cambium account"
            >
              Create account
            </button>
          </form>

          {/* Footer */}
          <div className="flex flex-col gap-2 pt-2">
            <p className="text-xs text-center" style={{ color: "#66716C" }}>
              Already have an account?{" "}
              <a
                href="#"
                className="underline font-medium transition-colors"
                style={{ color: "#17201D" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#173F35")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#17201D")}
              >
                Sign in
              </a>
            </p>
            <p className="text-xs text-center flex items-center justify-center gap-1" style={{ color: "#66716C" }}>
              <ShieldIcon />
              Your research information is protected.
            </p>
            <p className="text-xs text-center leading-relaxed" style={{ color: "#66716C" }}>
              By creating an account, you agree to Cambium&apos;s{" "}
              <a href="#" className="underline" style={{ color: "#66716C" }}>Terms</a>
              {" "}and{" "}
              <a href="#" className="underline" style={{ color: "#66716C" }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
