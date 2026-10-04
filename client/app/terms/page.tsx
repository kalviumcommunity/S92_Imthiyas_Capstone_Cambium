import React, { Suspense } from "react";
import { LegalViewer } from "@/components/legal/LegalViewer";

export const metadata = {
  title: "Terms of Service | Cambium Research",
  description:
    "Review the Terms of Service governing your access to and use of Cambium AI-powered Research Opportunity Discovery Platform.",
};

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F0]" />}>
      <LegalViewer initialTab="terms" />
    </Suspense>
  );
}
