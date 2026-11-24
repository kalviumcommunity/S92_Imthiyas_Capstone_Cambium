import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace",
  description:
    "Collaborative research workspace for live literature synthesis, grant proposal drafting, and interactive scientific notebook authoring.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
