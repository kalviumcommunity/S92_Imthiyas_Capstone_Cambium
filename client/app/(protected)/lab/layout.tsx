import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Lab",
  description:
    "Coordinate research projects, manage shared laboratory datasets, track lab member allocations, and synchronize grant milestones on Cambium Research.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
