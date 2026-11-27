import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

// Resilient tracing root: If monorepo parent package.json exists, use parent; inside standalone container context use cwd
const cwd = process.cwd();
const tracingRoot = fs.existsSync(path.join(cwd, "..", "package.json"))
  ? path.resolve(cwd, "..")
  : cwd;

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  reactStrictMode: true,
  trailingSlash: false,
  outputFileTracingRoot: tracingRoot,
  images: {
    unoptimized: process.env.VERCEL !== "1",
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/app/:path*",
        destination: "/:path*",
        permanent: false,
      },
      {
        source: "/500",
        destination: "/error-500",
        permanent: false,
      },
    ];
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    const apiOrigin = process.env.NEXT_PUBLIC_API_URL
      ? (() => {
          try {
            return new URL(process.env.NEXT_PUBLIC_API_URL).origin;
          } catch {
            return "";
          }
        })()
      : "";

    // Robust CSP: Restrictive allowlist in production; permits Next.js HMR & local endpoints in dev
    const connectSrc = isProd
      ? [
          "connect-src 'self'",
          apiOrigin,
          "https://*.onrender.com",
          "https://*.supabase.co",
          "wss://*.supabase.co",
          "https://accounts.google.com",
          "https://api.openalex.org",
          "https://api.crossref.org",
          "https://export.arxiv.org",
          "https://eutils.ncbi.nlm.nih.gov",
        ]
          .filter(Boolean)
          .join(" ")
      : "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* wss: https:";

    const scriptSrc = isProd
      ? "script-src 'self' 'unsafe-inline' blob: https://accounts.google.com https://apis.google.com"
      : "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://accounts.google.com https://apis.google.com";

    const cspHeader = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      connectSrc,
      "frame-src 'self' https://accounts.google.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        // Cache bust public_logo so new SVG branding is immediately served without CDN cache lag
        source: "/public_logo/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        // Immutable CDN/browser caching for heavy canvas background assets
        source: "/backgrounds/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Apply security headers to HTML pages while strictly bypassing Next.js static asset pipelines
        source: "/((?!_next/static|_next/image|favicon.ico|public_logo).*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
