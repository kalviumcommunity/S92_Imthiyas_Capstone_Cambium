import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Cambium Research. We are looking for systems engineers, retrieval specialists, and designers building modern infrastructure for science.",
  alternates: {
    canonical: "/careers",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
