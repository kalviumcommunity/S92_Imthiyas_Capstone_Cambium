import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paper Synthesis",
  description:
    "Inspect manuscripts with citation-grounded synthesis, methodology auditing, and direct DOI traceability—built for verifiable academic review.",
  alternates: {
    canonical: "/agent-reader",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
