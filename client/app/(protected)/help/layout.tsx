import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Explore comprehensive documentation, guides, and troubleshooting for Cambium Research workspaces, literature synthesis, and citation indexing.",
  alternates: {
    canonical: "/help",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
