import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover",
  description: "Explore 250M+ open scientific publications, researchers, and emerging topics across global scholarship.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
