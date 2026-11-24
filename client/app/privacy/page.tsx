import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LegalViewer } from "@/components/legal/LegalViewer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Cambium Research collects, processes, and protects personal scholar information, research telemetry, and data privacy rights.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F0]" />}>
      <LegalViewer initialTab="privacy" />
    </Suspense>
  );
}
