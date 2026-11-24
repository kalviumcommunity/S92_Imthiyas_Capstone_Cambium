import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rate Limit Exceeded",
  description:
    "Too many concurrent API requests were detected. Please pause briefly while the Cambium edge rate limiter restores your institutional access allowances.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
