import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grant Proposals",
  description:
    "Draft, review, and track institutional grant proposals with automated compliance checks and multi-investigator milestone management on Cambium.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
