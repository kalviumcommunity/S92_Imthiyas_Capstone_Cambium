import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The requested scholarly paper, researcher profile, or workspace URL could not be located in the Cambium Research relational knowledge graph index.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
