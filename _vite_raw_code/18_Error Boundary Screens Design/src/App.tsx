import { useState, useEffect, useRef } from "react";

type Screen = "404" | "500";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  dOpacity: number;
  r: number;
}

function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 48;
    nodesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      opacity: 0.15 + Math.random() * 0.35,
      dOpacity: (Math.random() - 0.5) * 0.002,
      r: 2 + Math.random() * 2.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.opacity += n.dOpacity;
        if (n.opacity < 0.08 || n.opacity > 0.55) n.dOpacity *= -1;
        if (n.x < -40) n.x = canvas.width + 40;
        if (n.x > canvas.width + 40) n.x = -40;
        if (n.y < -40) n.y = canvas.height + 40;
        if (n.y > canvas.height + 40) n.y = -40;
      });

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(23,63,53,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(23,63,53,${n.opacity})`;
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
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function ErrorScreen({ type }: { type: Screen }) {
  const is404 = type === "404";

  const code = is404 ? "404" : "500";
  const headline = is404 ? "Research artifact not found." : "System disruption.";
  const subtext = is404
    ? "The paper, dataset, or profile you are looking for has been moved or does not exist."
    : "Our servers are experiencing an interruption. Your research data remains securely saved.";
  const primaryLabel = is404 ? "Return to Workspace" : "Reload page";
  const ghostLabel = is404 ? "Search Cambium" : "Check system status";

  return (
    <div
      className="relative z-10 flex flex-col items-center justify-center text-center px-6"
      style={{ maxWidth: "448px", width: "100%" }}
    >
      {/* Eyebrow code */}
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "12px",
          letterSpacing: "0.2em",
          color: "var(--color-muted)",
          fontWeight: 500,
          marginBottom: "20px",
          display: "block",
        }}
      >
        {code}
      </span>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(28px, 5vw, 36px)",
          fontWeight: 300,
          lineHeight: 1.22,
          color: "var(--color-text)",
          marginBottom: "16px",
          letterSpacing: "-0.01em",
        }}
      >
        {headline}
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "15px",
          lineHeight: 1.65,
          color: "var(--color-muted)",
          marginBottom: "36px",
          maxWidth: "360px",
        }}
      >
        {subtext}
      </p>

      {/* Divider */}
      <div
        style={{
          width: "40px",
          height: "1px",
          background: "var(--color-border)",
          marginBottom: "36px",
        }}
      />

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        <button
          style={{
            background: "var(--color-primary)",
            color: "#FFFFFF",
            fontFamily: "var(--font-ui)",
            fontSize: "14px",
            fontWeight: 600,
            padding: "10px 24px",
            borderRadius: "8px",
            border: "1px solid var(--color-primary)",
            cursor: "pointer",
            letterSpacing: "0.01em",
            transition: "background 0.18s, opacity 0.18s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-sage)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary)")
          }
          onClick={() => is404 ? undefined : window.location.reload()}
        >
          {primaryLabel}
        </button>

        <button
          style={{
            background: "transparent",
            color: "var(--color-primary)",
            fontFamily: "var(--font-ui)",
            fontSize: "14px",
            fontWeight: 600,
            padding: "10px 24px",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            cursor: "pointer",
            letterSpacing: "0.01em",
            transition: "border-color 0.18s, background 0.18s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-primary)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(23,63,53,0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          {ghostLabel}
        </button>
      </div>

      {/* Cambium wordmark */}
      <div
        style={{
          marginTop: "64px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          opacity: 0.35,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" fill="#173F35" />
          <circle cx="2" cy="4" r="1.5" fill="#173F35" />
          <circle cx="14" cy="4" r="1.5" fill="#173F35" />
          <circle cx="2" cy="12" r="1.5" fill="#173F35" />
          <circle cx="14" cy="12" r="1.5" fill="#173F35" />
          <line x1="8" y1="8" x2="2" y2="4" stroke="#173F35" strokeWidth="0.8" />
          <line x1="8" y1="8" x2="14" y2="4" stroke="#173F35" strokeWidth="0.8" />
          <line x1="8" y1="8" x2="2" y2="12" stroke="#173F35" strokeWidth="0.8" />
          <line x1="8" y1="8" x2="14" y2="12" stroke="#173F35" strokeWidth="0.8" />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Cambium
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("404");

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center"
      style={{ background: "var(--color-bg)" }}
    >
      <NetworkBackground />

      {/* Toggle — for preview only */}
      <div
        className="fixed top-5 right-5 z-20 flex"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {(["404", "500"] as Screen[]).map((s) => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "12px",
              fontWeight: 600,
              padding: "7px 16px",
              background: screen === s ? "var(--color-primary)" : "transparent",
              color: screen === s ? "#fff" : "var(--color-muted)",
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
              letterSpacing: "0.04em",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <ErrorScreen type={screen} />
    </div>
  );
}
