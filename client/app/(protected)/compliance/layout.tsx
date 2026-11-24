import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance",
  description:
    "Review research compliance protocols, IRB data governance, CRediT authorship taxonomy standards, and ethical research frameworks on Cambium.",
  alternates: {
    canonical: "/compliance",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
