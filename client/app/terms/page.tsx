import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LegalViewer } from "@/components/legal/LegalViewer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms and conditions governing scholar access, collaborative research tools, and institutional subscriptions on Cambium Research.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F0]" />}>
      <LegalViewer initialTab="terms" />
    </Suspense>
  );
}
