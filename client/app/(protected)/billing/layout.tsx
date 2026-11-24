import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing & Quota",
  description:
    "Manage subscription tiers, institutional compute allowances, payment methods, and downloadable invoice history for your Cambium Research lab.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
