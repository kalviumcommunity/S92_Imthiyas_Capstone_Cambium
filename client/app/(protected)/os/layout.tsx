import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research OS",
  description:
    "Enterprise research operating system orchestrating multi-agent literature synthesis, automated citation indexers, and reproducible lab workflows.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
