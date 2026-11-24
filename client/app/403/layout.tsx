import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Forbidden",
  description:
    "You do not have the required institutional authorization or RBAC permissions to inspect this protected Cambium Research resource. Contact your lab PI.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
