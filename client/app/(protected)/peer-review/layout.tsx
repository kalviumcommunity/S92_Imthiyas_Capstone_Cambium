import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peer Review",
  description:
    "Participate in open scientific peer review, structured manuscript evaluations, and transparent methodology audits adhering to COPE ethics.",
  alternates: {
    canonical: "/peer-review",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
