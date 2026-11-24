import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Cambium Research builds the enterprise operating system connecting open scholarship, citation verification, and academic opportunity.",
  alternates: {
    canonical: "/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
