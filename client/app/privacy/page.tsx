import React, { Suspense } from "react";
import { LegalViewer } from "@/components/legal/LegalViewer";

export const metadata = {
  title: "Privacy Policy | Cambium Research",
  description:
    "Learn how Cambium collects, processes, and protects your personal research data and scholarly interactions.",
};

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F0]" />}>
      <LegalViewer initialTab="terms" />
    </Suspense>
  );
}
