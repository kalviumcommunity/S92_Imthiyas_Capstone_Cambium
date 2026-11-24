import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Set a new secure password for your Cambium Research account to restore verified institutional access and collaborative workspace research features.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
