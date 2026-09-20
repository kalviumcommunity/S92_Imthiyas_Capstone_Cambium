import { useState, useEffect, useRef } from "react";

type Screen = "forgot" | "check" | "success";

// ─── Animated Node Graph ───────────────────────────────────────────────────

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

function NodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // init nodes
    nodesRef.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 2.5 + Math.random() * 2,
    }));

    let pulse = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      pulse += 0.008;

      const nodes = nodesRef.current;

      // update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W()) n.vx *= -1;
        if (n.y < 0 || n.y > H()) n.vy *= -1;
      });

      const maxDist = 160;

      // draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            const pulseFactor = 0.7 + 0.3 * Math.sin(pulse + i * 0.4);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(23, 63, 53, ${alpha * pulseFactor})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // draw nodes
      nodes.forEach((n, i) => {
        const pulseFactor = 0.6 + 0.4 * Math.sin(pulse * 1.2 + i * 0.6);
        const alpha = 0.35 + 0.3 * pulseFactor;

        // glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3.5);
        grad.addColorStop(0, `rgba(23, 63, 53, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(23, 63, 53, 0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(23, 63, 53, ${alpha})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

// ─── Left Branding Panel ───────────────────────────────────────────────────

function BrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full bg-[#F7F6F1] overflow-hidden px-12 py-10">
      <NodeGraph />

      {/* Content over canvas */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#173F35] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="white" />
              <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide text-[#17201D]">Cambium</span>
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        <p className="font-display text-2xl font-semibold text-[#17201D] leading-snug max-w-[260px]">
          Securing your research identity
        </p>
        <p className="text-sm text-[#66716C] leading-relaxed max-w-[240px]">
          End-to-end encrypted credential management for academic institutions.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-xs text-[#66716C]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1L7.5 4.5H11L8.5 6.5L9.5 10L6 7.5L2.5 10L3.5 6.5L1 4.5H4.5L6 1Z" fill="#66716C" opacity="0.5" />
        </svg>
        <span>SOC 2 Type II · FERPA Compliant</span>
      </div>
    </div>
  );
}

// ─── Screen 1: Forgot Password ─────────────────────────────────────────────

function ForgotPassword({ onNext }: { onNext: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 900);
  };

  return (
    <div className="w-full max-w-[400px] space-y-8">
      <div className="space-y-2">
        <h2 className="font-display text-[28px] font-semibold text-[#17201D] leading-tight">
          Reset your password
        </h2>
        <p className="text-sm text-[#66716C] leading-relaxed">
          Enter your academic email to receive a secure reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#17201D] tracking-wide uppercase">
            Academic Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            className="w-full rounded-md border border-[#DDE2DE] bg-white px-3.5 py-2.5 text-sm text-[#17201D] placeholder:text-[#66716C] outline-none transition-all focus:ring-2 focus:ring-[#173F35] focus:ring-offset-1 focus:border-[#173F35]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#173F35] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0f2d25] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending…
            </span>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <button
        onClick={() => {}}
        className="flex items-center gap-1.5 text-sm text-[#66716C] hover:text-[#17201D] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to sign in
      </button>
    </div>
  );
}

// ─── Screen 2: Check Email ─────────────────────────────────────────────────

function CheckEmail({ onNext }: { onNext: () => void }) {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="w-full max-w-[400px] space-y-8">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-[#DCEBE4] flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
            stroke="#173F35"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-[28px] font-semibold text-[#17201D] leading-tight">
          Check your inbox
        </h2>
        <p className="text-sm text-[#66716C] leading-relaxed">
          We sent a secure link to your email. Click the link to securely reset your credentials.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onNext}
          className="w-full rounded-md border border-[#DDE2DE] bg-white px-4 py-2.5 text-sm font-semibold text-[#17201D] transition-all hover:bg-[#F7F6F1] active:scale-[0.99]"
        >
          Open email app
        </button>

        <div className="text-center">
          {resent ? (
            <span className="text-sm text-[#173F35] font-medium">Reset link sent!</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm text-[#66716C] hover:text-[#17201D] transition-colors underline underline-offset-2 decoration-[#DDE2DE]"
            >
              Didn't receive it? Click to resend.
            </button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-md border border-[#DDE2DE] bg-[#F7F6F1] px-4 py-3">
        <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="#66716C" strokeWidth="1.2" />
          <path d="M7 6.5V9.5M7 4.5V5" stroke="#66716C" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <p className="text-xs text-[#66716C] leading-relaxed">
          The link expires in 30 minutes. Check your spam folder if it doesn't arrive within a few minutes.
        </p>
      </div>
    </div>
  );
}

// ─── Screen 3: Reset Success ───────────────────────────────────────────────

function ResetSuccess() {
  return (
    <div className="w-full max-w-[400px] space-y-8">
      {/* Icon */}
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 rounded-full bg-[#173F35] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L4 7V12C4 16.42 7.56 20.55 12 21.93C16.44 20.55 20 16.42 20 12V7L12 3Z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 12L11 14L15 10"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* success pulse ring */}
        <div className="absolute inset-0 rounded-full bg-[#173F35] opacity-10 animate-ping" />
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-[28px] font-semibold text-[#17201D] leading-tight">
          Password reset complete
        </h2>
        <p className="text-sm text-[#66716C] leading-relaxed">
          Your research identity is secure. You can now sign in with your new password.
        </p>
      </div>

      <div className="space-y-4">
        <button className="w-full rounded-md bg-[#173F35] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0f2d25] active:scale-[0.99]">
          Return to sign in
        </button>

        <div className="flex items-center gap-2 text-xs text-[#66716C] justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#66716C" strokeWidth="1" />
            <path d="M4 6L5.5 7.5L8 4.5" stroke="#66716C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Session secured · All other sessions signed out
        </div>
      </div>
    </div>
  );
}

// ─── Layout Shell ──────────────────────────────────────────────────────────

const STEP_LABELS: Record<Screen, string> = {
  forgot: "Forgot password",
  check: "Check email",
  success: "Reset complete",
};

const SCREENS: Screen[] = ["forgot", "check", "success"];

export default function App() {
  const [screen, setScreen] = useState<Screen>("forgot");

  const currentIdx = SCREENS.indexOf(screen);

  return (
    <div className="min-h-screen bg-[#F7F6F1] flex flex-col">
      {/* Dev nav strip */}
      <div className="flex items-center justify-center gap-1.5 py-3 px-4 border-b border-[#DDE2DE] bg-white/60 backdrop-blur-sm">
        {SCREENS.map((s, i) => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              screen === s
                ? "bg-[#173F35] text-white"
                : "text-[#66716C] hover:text-[#17201D]"
            }`}
          >
            {i + 1}. {STEP_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Main 2-col layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — branding + graph */}
        <div className="flex-1 relative">
          <BrandPanel />
        </div>

        {/* Right — form card */}
        <div className="w-full lg:w-[520px] flex flex-col items-center justify-center px-8 py-12 bg-white border-l border-[#DDE2DE]">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-10 self-start lg:self-center">
            {SCREENS.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < currentIdx
                    ? "w-6 bg-[#173F35]"
                    : i === currentIdx
                    ? "w-6 bg-[#173F35]"
                    : "w-1.5 bg-[#DDE2DE]"
                }`}
              />
            ))}
          </div>

          {/* Screen content */}
          <div className="w-full flex justify-center">
            {screen === "forgot" && <ForgotPassword onNext={() => setScreen("check")} />}
            {screen === "check" && <CheckEmail onNext={() => setScreen("success")} />}
            {screen === "success" && <ResetSuccess />}
          </div>

          {/* Footer */}
          <p className="mt-12 text-xs text-[#66716C] self-center">
            © 2026 Cambium · Academic Identity Platform
          </p>
        </div>
      </div>
    </div>
  );
}
