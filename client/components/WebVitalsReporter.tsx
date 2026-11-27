"use client";

import { useReportWebVitals } from "next/web-vitals";

export type CwvRating = "good" | "needs-improvement" | "poor";

export interface RecordedWebVital {
  name: string;
  value: number;
  rating: CwvRating;
  id: string;
  recordedAt: string;
}

export function classifyWebVital(name: string, value: number): CwvRating {
  if (name === "LCP") {
    if (value <= 2500) return "good";
    if (value <= 4000) return "needs-improvement";
    return "poor";
  }
  if (name === "INP") {
    if (value <= 200) return "good";
    if (value <= 500) return "needs-improvement";
    return "poor";
  }
  if (name === "CLS") {
    if (value <= 0.1) return "good";
    if (value <= 0.25) return "needs-improvement";
    return "poor";
  }
  if (name === "TTFB") {
    if (value <= 800) return "good";
    if (value <= 1800) return "needs-improvement";
    return "poor";
  }
  return "good";
}

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined") return;
    const win = window as Window & {
      __CAMBIUM_WEB_VITALS__?: Record<string, RecordedWebVital>;
    };
    if (!win.__CAMBIUM_WEB_VITALS__) {
      win.__CAMBIUM_WEB_VITALS__ = {};
    }
    win.__CAMBIUM_WEB_VITALS__[metric.name] = {
      name: metric.name,
      value: Number(metric.value.toFixed(3)),
      rating: classifyWebVital(metric.name, metric.value),
      id: metric.id,
      recordedAt: new Date().toISOString(),
    };
  });

  return null;
}
