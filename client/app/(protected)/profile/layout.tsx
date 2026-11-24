import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholar Profile",
  description:
    "Manage your verified scholar identity, ORCID record synchronization, institutional affiliations, co-author networks, and public research portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
