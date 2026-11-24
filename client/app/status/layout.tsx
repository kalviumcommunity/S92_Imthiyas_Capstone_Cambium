import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status",
  description:
    "Monitor live uptime, API gateway latency, database cluster health, and real-time operational metrics across Cambium Research infrastructure.",
  alternates: {
    canonical: "/status",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
