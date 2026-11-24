import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Browse indexed scientific manuscripts, peer-reviewed articles, and research preprints verified with persistent DOI provenance and citations.",
  alternates: {
    canonical: "/publications",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
