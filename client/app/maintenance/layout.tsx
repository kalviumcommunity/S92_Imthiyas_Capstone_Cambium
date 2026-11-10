import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planned Maintenance",
  description: "Scheduled maintenance window for Cambium research data infrastructure.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
