import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manuscript Reader",
  description:
    "Read scientific papers with deep interactive margin citations, formula magnification, and methodology audits connected to live databases.",
  alternates: {
    canonical: "/reader",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
