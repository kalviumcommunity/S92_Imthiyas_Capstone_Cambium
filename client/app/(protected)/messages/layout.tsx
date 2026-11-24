import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Collaborate with co-authors, lab colleagues, and peer review working groups through secure end-to-end encrypted scholarly direct messaging on Cambium.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
