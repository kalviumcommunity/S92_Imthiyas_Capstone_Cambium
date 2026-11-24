import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover",
  description:
    "Search 250M+ open scientific papers, datasets, and citation graphs across OpenAlex, Europe PMC, and Zenodo. Track emerging research velocity.",
  alternates: {
    canonical: "/discover",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
