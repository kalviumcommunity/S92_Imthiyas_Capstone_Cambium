import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import Literature",
  description:
    "Upload scientific PDFs, research datasets, and literature artifacts to extract citations and index full-text content into your workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
