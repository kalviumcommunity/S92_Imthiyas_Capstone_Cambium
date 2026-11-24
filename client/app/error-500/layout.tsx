import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Fault",
  description:
    "A temporary internal fault occurred while processing this research operation. Your underlying workspace artifacts and notebook data remain protected.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
