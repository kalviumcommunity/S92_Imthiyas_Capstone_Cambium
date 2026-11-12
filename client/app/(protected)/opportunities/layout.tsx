import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities & Grants",
  description: "Discover active research grants, fellowships, and calls for papers from NSF, NIH, and global institutions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

