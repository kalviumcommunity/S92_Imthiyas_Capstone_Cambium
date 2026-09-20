import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import { QueryProvider } from "@/lib/query-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${manrope.variable} ${sourceSerif4.variable}`}
    >
      <body className="min-h-screen flex flex-col justify-between bg-[#F7F6F1] text-[#17201D] font-sans antialiased">
        <QueryProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-client-id"}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </GoogleOAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
