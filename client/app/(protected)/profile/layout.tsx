import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholar Profile",
  description: "Verified academic identity, ORCID integration, and scholarly contributions portfolio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

