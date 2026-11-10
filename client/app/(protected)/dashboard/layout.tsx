import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Real-time research telemetry, active grant tracking, and live scholarly literature feed.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
