import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description: "Personal research corpus, verified DOI minting, and citation telemetry.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
