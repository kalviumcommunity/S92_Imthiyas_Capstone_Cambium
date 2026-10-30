import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans, Newsreader, JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/query-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/lib/theme-provider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { UniversalThemeGearbox } from "@/components/ui/theme-toggle";
import OfflineSyncBanner from "@/components/OfflineSyncBanner";
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

export const metadata: Metadata = {
  title: "CAMBIUM RESEARCH — The Enterprise Research Operating System",
  description:
    "Discover ideas, build your academic identity, collaborate with researchers, explore opportunities, and organize the knowledge behind your work.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/public_logo/favicon.svg", type: "image/svg+xml" },
      { url: "/public_logo/favicon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/public_logo/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/public_logo/favicon.svg",
    apple: "/public_logo/favicon-dark.svg",
  },
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
        <title>CAMBIUM RESEARCH — The Enterprise Research Operating System</title>
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
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-canvas text-ink-primary font-sans antialiased transition-colors duration-200">
        <QueryProvider>
          <LanguageProvider>
            <ThemeProvider>
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-client-id"}>
                {children}
                <UniversalThemeGearbox />
                <OfflineSyncBanner />
              </GoogleOAuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
