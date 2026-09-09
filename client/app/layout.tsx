import type { Metadata } from "next";
import { QueryProvider } from "@/lib/query-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cambium — AI-Powered Research Opportunity Discovery & Intelligence Platform",
  description:
    "Unified research intelligence system aggregating grants, Calls for Papers, journals, and fellowships on an authoritative PostgreSQL + pgvector foundation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col justify-between antialiased">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
