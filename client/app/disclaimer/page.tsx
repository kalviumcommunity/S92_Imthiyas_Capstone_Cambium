import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LegalViewer } from "@/components/legal/LegalViewer";

export const metadata: Metadata = {
  title: "Scholarly Disclaimer",
  description:
    "Review operational disclosures, evidence verification standards, and AI methodology limitations across Cambium Research scientific tools.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F0]" />}>
      <LegalViewer initialTab="disclaimer" />
    </Suspense>
  );
}
