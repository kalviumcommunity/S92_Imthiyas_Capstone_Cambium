import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence",
  description: "Deep citation radar and multi-source research intelligence powered by grounded citations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
