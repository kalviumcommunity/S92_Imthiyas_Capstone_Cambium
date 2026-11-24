import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance",
  description:
    "Cambium Research is performing scheduled infrastructure maintenance and database optimizations. All scholarly systems will be restored shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
