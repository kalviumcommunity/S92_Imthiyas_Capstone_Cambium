import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Audit",
  description:
    "Inspect cryptographic audit trails, SHA-256 provenance chains, IRB compliance attestations, and immutable security event ledgers on Cambium Research.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
