import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Explore transparent compute pricing and institutional plans for scholars, independent labs, and university research federations using Cambium Research.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
