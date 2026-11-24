import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description:
    "Organize saved scientific papers, research opportunities, funding deadlines, and custom reading collections in your personal Cambium library.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
