import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account preferences, active research sessions, and GDPR Article 20 data portability.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
