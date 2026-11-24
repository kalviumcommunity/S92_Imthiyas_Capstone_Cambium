import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your Cambium Research account password securely with your registered institutional email address and verified two-factor session credentials.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
