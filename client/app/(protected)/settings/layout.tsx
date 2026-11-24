import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage your account preferences, notification rules, privacy controls, institutional integrations, and GDPR Article 20 data portability on Cambium.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
