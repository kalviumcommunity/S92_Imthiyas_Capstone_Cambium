import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Management",
  description:
    "Configure FAIR data sharing plans, research artifact registries, and cryptographic provenance chains for lab compliance on Cambium Research.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
