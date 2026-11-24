import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Cambium Research team for institutional partnerships, campus licensing, technical support, and general research inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
