import React, { Suspense } from "react";
import { LegalViewer } from "@/components/legal/LegalViewer";

export const metadata = {
  title: "AI & Research Information Disclaimer | Cambium Research",
  description:
    "Review the operational disclosures, verification standards, and limitations of AI-generated scholarly research outputs on Cambium.",
};

export default function DisclaimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F0]" />}>
      <LegalViewer initialTab="disclaimer" />
    </Suspense>
  );
}
