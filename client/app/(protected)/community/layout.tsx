import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Engage in cross-disciplinary scholarly discussions, open preprint peer review, and cooperative working groups across international labs.",
  alternates: {
    canonical: "/community",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
