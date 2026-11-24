import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Follow the latest platform releases, retrieval engine upgrades, and collaborative workspace improvements shipped to the Cambium Research platform.",
  alternates: {
    canonical: "/changelog",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
