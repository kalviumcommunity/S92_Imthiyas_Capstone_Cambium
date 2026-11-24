import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Intelligence",
  description:
    "Synthesize emerging research horizons, grant funding forecasts, and citation momentum indicators across 250M+ verified global scientific publications.",
  alternates: {
    canonical: "/intelligence",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
