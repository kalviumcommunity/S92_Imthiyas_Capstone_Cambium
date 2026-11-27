import type { Metadata, Viewport } from "next";
import { Manrope, Plus_Jakarta_Sans, Newsreader, JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/query-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/lib/theme-provider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import OfflineSyncBanner from "@/components/OfflineSyncBanner";
import { CookieConsent } from "@/components/CookieConsent";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-brand",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-data",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cambium-research.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F0" },
    { media: "(prefers-color-scheme: dark)", color: "#141E16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cambium Research · Knowledge compounds. Cambium connects it.",
    template: "%s · Cambium Research",
  },
  description:
    "Discover 250M+ scientific publications, track active grants, and synthesize cross-disciplinary literature in one unified scholarly workspace.",
  applicationName: "Cambium Research",
  authors: [{ name: "Shaik Mohamed Imthiyas T", url: siteUrl }],
  creator: "Shaik Mohamed Imthiyas T",
  publisher: "Cambium Research",
  keywords: [
    "Cambium Research",
    "Cambium",
    "research opportunities",
    "grant discovery",
    "literature synthesis",
    "open science",
    "citation graph",
    "academic identity",
    "peer review",
    "scholarly operating system",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "8WczNCeJBLme0XokQUIsLUcB3ObTJg-E167D0HuR3sU",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Cambium Research",
    title: "Cambium Research · Knowledge compounds. Cambium connects it.",
    description:
      "Discover 250M+ scientific publications, track active grants, and synthesize cross-disciplinary literature in one unified scholarly workspace.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Cambium Research · The Enterprise Research Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cambium Research · Knowledge compounds. Cambium connects it.",
    description:
      "Discover 250M+ scientific publications, track active grants, and synthesize cross-disciplinary literature in one unified scholarly workspace.",
    images: ["/opengraph-image"],
    creator: "@cambiumresearch",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/public_logo/cambium-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/public_logo/cambium-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/public_logo/favicon.svg", type: "image/svg+xml" },
      { url: "/public_logo/favicon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/public_logo/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Cambium Research",
      alternateName: ["Cambium", "Cambium OS"],
      description:
        "Discover 250M+ scientific publications, track active grants, and synthesize cross-disciplinary literature in one unified scholarly workspace.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Cambium Research",
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      sameAs: [
        "https://github.com/shaikimthiyas/cambium-research", // TODO: replace with live URL
        "https://www.linkedin.com/in/shaik-mohamed-imthiyas/", // TODO: replace with live URL
      ],
      description: "AI-Powered Research Opportunity Discovery and Intelligence Platform for Global Scholarship.",
      founder: {
        "@type": "Person",
        name: "Shaik Mohamed Imthiyas T",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#application`,
      name: "Cambium Research Platform",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: "The Enterprise Operating System for Modern Scholarship.",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${plusJakartaSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Anti-FOUC inline script for instant zero-flash theme rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('cambium-theme');
                  var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-canvas text-ink-primary font-sans antialiased transition-colors duration-200">
        <QueryProvider>
          <LanguageProvider>
            <ThemeProvider>
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-client-id"}>
                {children}
                <OfflineSyncBanner />
                <CookieConsent />
                <WebVitalsReporter />
              </GoogleOAuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
