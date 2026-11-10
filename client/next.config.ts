import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

// Resilient tracing root: If monorepo parent package.json exists, use parent; inside standalone container context use __dirname
const tracingRoot = fs.existsSync(path.join(__dirname, "..", "package.json"))
  ? path.join(__dirname, "..")
  : __dirname;

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  trailingSlash: false,
  outputFileTracingRoot: tracingRoot,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
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
    // Robust CSP: Supports both Next.js HMR Fast Refresh WebSockets in dev and strict Zero-Trust production
    const connectSrc =
      "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* wss: https:";

    const cspHeader = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      connectSrc,
      "frame-ancestors 'none'",
    ].join("; ");

    return [
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
