import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://cambium-research.vercel.app");
  const lastModified = new Date();

  const publicRoutes = [
    { url: `${baseUrl}`, lastModified, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/discover`, lastModified, changeFrequency: "hourly" as const, priority: 0.95 },
    { url: `${baseUrl}/opportunities`, lastModified, changeFrequency: "hourly" as const, priority: 0.95 },
    { url: `${baseUrl}/publications`, lastModified, changeFrequency: "daily" as const, priority: 0.85 },
    { url: `${baseUrl}/community`, lastModified, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/changelog`, lastModified, changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${baseUrl}/help`, lastModified, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/compliance`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/careers`, lastModified, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/status`, lastModified, changeFrequency: "always" as const, priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/disclaimer`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return publicRoutes;
}

