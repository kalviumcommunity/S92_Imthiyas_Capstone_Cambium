import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your verified Cambium Research account to discover funding opportunities, synthesize literature, and collaborate across institutions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
