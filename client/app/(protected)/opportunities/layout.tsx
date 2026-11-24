import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Track active research grants, fellowships, and calls for papers from NSF, NIH, Horizon Europe, and private philanthropic foundations worldwide.",
  alternates: {
    canonical: "/opportunities",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
