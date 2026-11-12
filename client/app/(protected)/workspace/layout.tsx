import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Collaborative research canvas, literature synthesis, and structured note taking.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

