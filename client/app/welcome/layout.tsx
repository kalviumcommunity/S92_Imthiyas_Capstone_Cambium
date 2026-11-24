import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description:
    "Get started with Cambium Research. Configure your scholar identity, select research horizons, and initiate cross-disciplinary discovery.",
  alternates: {
    canonical: "/welcome",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
