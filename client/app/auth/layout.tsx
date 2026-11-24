import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Secure enterprise authentication portal and session verification gateway for scholars and institutional researchers accessing Cambium Research.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
