import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Stay informed with real-time alerts on grant application deadlines, co-author mentions, manuscript peer reviews, and citation tracking on Cambium.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
