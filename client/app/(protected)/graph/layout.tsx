import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Graph",
  description: "2D relational knowledge constellation connecting papers, authors, and conceptual research bridges.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
