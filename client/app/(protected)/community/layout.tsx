import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description: "Academic social discussions, preprint peer reviews, and cross-lab scholar networking.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
