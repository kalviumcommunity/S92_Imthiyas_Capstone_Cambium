import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholar Portfolio",
  description:
    "Public academic profile showcasing peer-reviewed publications, open datasets, verified peer reviews, and verifiable scholarship track records.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
