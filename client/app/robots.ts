import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cambium.research";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/discover",
          "/opportunities",
          "/publications",
          "/community",
          "/pricing",
          "/about",
          "/changelog",
          "/help",
          "/status",
          "/compliance",
          "/privacy",
          "/terms",
          "/disclaimer",
          "/public_logo/",
        ],
        disallow: [
          "/dashboard",
          "/workspace",
          "/workspace/",
          "/graph",
          "/intelligence",
          "/profile",
          "/settings",
          "/messages",
          "/notifications",
          "/portfolio",
          "/lab",
          "/reader",
          "/audit",
          "/api/",
          "/auth/",
          "/sign-in",
          "/sign-up",
          "/reset-password",
          "/forgot-password",
          "/403",
          "/404",
          "/429",
          "/error-500",
        ],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot"],
        allow: ["/", "/discover", "/opportunities", "/publications", "/help", "/about"],
        disallow: ["/dashboard", "/workspace", "/settings", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
