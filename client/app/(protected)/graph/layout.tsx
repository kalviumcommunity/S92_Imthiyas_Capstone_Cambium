import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Graph",
  description:
    "Explore relational citation networks, co-authorship graphs, and cross-disciplinary concept bridges visualised in real-time constellation space.",
  alternates: {
    canonical: "/graph",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
