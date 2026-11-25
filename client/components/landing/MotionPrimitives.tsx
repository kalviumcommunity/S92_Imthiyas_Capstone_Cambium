"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Hardware-accelerated top reading progress thread synced via requestAnimationFrame.
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const el = barRef.current;
      if (!el) return;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      el.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-transparent pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[#3E6248] via-[#4ADE80] to-[#3E6248] transition-transform duration-75 will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export type RevealVariant =
  | "fade-up"
  | "pop-scale"
  | "slide-left"
  | "slide-right"
  | "soft-fade";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  once?: boolean;
}

/**
 * Scroll-triggered entrance wrapper using IntersectionObserver + cubic-bezier deceleration.
 * Respects prefers-reduced-motion and renders immediately for elements already above the fold.
 */
export function ScrollReveal({
  children,
  variant = "fade-up",
  delayMs = 0,
  durationMs = 680,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let rafId = 0;
    const revealAsync = () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => setVisible(true));
    };

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      revealAsync();
      return () => {
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }

    const isRevealed = () => node.getBoundingClientRect().top < window.innerHeight * 0.96;

    if (isRevealed()) {
      revealAsync();
      return () => {
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || isRevealed()) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.02, rootMargin: "40px 0px -24px 0px" }
    );

    const onScroll = () => {
      if (isRevealed()) {
        setVisible(true);
        if (once) {
          observer.disconnect();
          window.removeEventListener("scroll", onScroll);
        }
      }
    };

    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [once]);

  const hiddenTransform =
    variant === "fade-up"
      ? "translate3d(0, 24px, 0)"
      : variant === "pop-scale"
      ? "translate3d(0, 20px, 0) scale(0.965)"
      : variant === "slide-left"
      ? "translate3d(-24px, 0, 0)"
      : variant === "slide-right"
      ? "translate3d(24px, 0, 0)"
      : "translate3d(0, 0, 0)";

  return (
    <div
      ref={ref}
      className={`cambium-scroll-reveal ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0) scale(1)" : hiddenTransform,
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${visible ? delayMs : 0}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

interface TypedPhraseProps {
  phrases: string[];
  className?: string;
  typingSpeedMs?: number;
  pauseMs?: number;
  loop?: boolean;
  showCaret?: boolean;
}

/**
 * Scroll-activated typewriter reveal for short UI labels, research queries, and terminal annotations.
 * Preserves full accessible text on aria-label while animating visually.
 */
export function TypedPhrase({
  phrases,
  className = "",
  typingSpeedMs = 34,
  pauseMs = 2200,
  loop = true,
  showCaret = true,
}: TypedPhraseProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charCount, setCharCount] = useState(phrases[0]?.length ?? 0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          setCharCount(0);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || phrases.length === 0) return;

    const current = phrases[phraseIdx] ?? "";

    if (!isDeleting && charCount < current.length) {
      const t = window.setTimeout(
        () => setCharCount((c) => c + 1),
        typingSpeedMs
      );
      return () => window.clearTimeout(t);
    }

    if (!isDeleting && charCount === current.length) {
      if (!loop && phraseIdx === phrases.length - 1) return;
      if (phrases.length === 1 && !loop) return;
      const t = window.setTimeout(() => setIsDeleting(true), pauseMs);
      return () => window.clearTimeout(t);
    }

    if (isDeleting && charCount > 0) {
      const t = window.setTimeout(
        () => setCharCount((c) => Math.max(0, c - 1)),
        Math.max(16, Math.round(typingSpeedMs * 0.55))
      );
      return () => window.clearTimeout(t);
    }

    if (isDeleting && charCount === 0) {
      const t = window.setTimeout(() => {
        setIsDeleting(false);
        setPhraseIdx((idx) => (idx + 1) % phrases.length);
      }, 220);
      return () => window.clearTimeout(t);
    }
  }, [inView, phrases, phraseIdx, charCount, isDeleting, typingSpeedMs, pauseMs, loop]);

  const activeText = (phrases[phraseIdx] ?? "").slice(0, charCount);

  return (
    <span
      ref={containerRef}
      aria-label={phrases[0] ?? ""}
      className={`inline-flex items-baseline ${className}`}
    >
      <span>{inView ? activeText : phrases[0]}</span>
      {showCaret && (
        <span
          aria-hidden="true"
          className="inline-block w-[1.5px] h-[0.95em] bg-[#4ADE80] ml-0.5 translate-y-[1px] cambium-caret-blink"
        />
      )}
    </span>
  );
}

interface CountUpMetricProps {
  target: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

/**
 * Counts cleanly from zero up to `target` with easeOutCubic deceleration on viewport entry.
 */
export function CountUpMetric({
  target,
  suffix = "",
  durationMs = 900,
  className = "",
}: CountUpMetricProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(target);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimatedRef.current) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        obs.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(target * eased));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setValue(target);
          }
        };
        window.requestAnimationFrame(step);
      },
      { threshold: 0.35 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [target, durationMs]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export interface GuidedTourStep {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
}

const DESK_TOUR_STEPS: GuidedTourStep[] = [
  { id: "hypothesis", xPercent: 18.5, yPercent: 26, label: "Create Hypothesis" },
  { id: "fellowship", xPercent: 32, yPercent: 52, label: "Inspect 94% Match" },
  { id: "calendar", xPercent: 91, yPercent: 25, label: "Open Deadline Radar" },
];

/**
 * Animated synthetic pointer + emerald click ripple inside the Live Research Desk preview.
 * Yields gracefully the moment the visitor hovers or clicks inside the desk container.
 */
export function GuidedDeskPointer({
  paused,
  onStepHighlight,
}: {
  paused: boolean;
  onStepHighlight?: (stepId: string | null) => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const [clicking, setClicking] = useState(false);
  const callbackRef = useRef(onStepHighlight);

  useEffect(() => {
    callbackRef.current = onStepHighlight;
  }, [onStepHighlight]);

  useEffect(() => {
    if (paused) {
      callbackRef.current?.(null);
      return;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const step = DESK_TOUR_STEPS[stepIdx];
    callbackRef.current?.(step.id);

    const tClick = window.setTimeout(() => setClicking(true), 680);
    const tRelease = window.setTimeout(() => setClicking(false), 1180);
    const tNext = window.setTimeout(
      () => setStepIdx((prev) => (prev + 1) % DESK_TOUR_STEPS.length),
      3100
    );

    return () => {
      window.clearTimeout(tClick);
      window.clearTimeout(tRelease);
      window.clearTimeout(tNext);
    };
  }, [paused, stepIdx]);

  if (paused) return null;

  const current = DESK_TOUR_STEPS[stepIdx];

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block absolute z-30 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        left: `${current.xPercent}%`,
        top: `${current.yPercent}%`,
      }}
    >
      {/* Expanding Click Ripple */}
      {clicking && (
        <span className="absolute -left-3 -top-3 w-7 h-7 rounded-full border-2 border-[#4ADE80] cambium-pointer-ripple" />
      )}

      {/* Clean Geometric Pointer Arrow */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        className={`drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)] transition-transform duration-150 ${
          clicking ? "scale-90" : "scale-100"
        }`}
      >
        <path
          d="M4 3L19 11.5L11.8 13.6L8.9 20.5L4 3Z"
          fill="#202920"
          stroke="#4ADE80"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      {/* Subtle Label Tag */}
      <span className="ml-4 -mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#202920]/95 border border-[#4ADE80]/50 text-[#FAF7F0] font-mono text-[9.5px] font-semibold shadow-lg whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
        {current.label}
      </span>
    </div>
  );
}
