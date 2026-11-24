import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cambium-research.vercel.app";
  const lastModified = new Date();

  const publicRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/discover`, lastModified, changeFrequency: "hourly", priority: 0.95 },
    { url: `${baseUrl}/opportunities`, lastModified, changeFrequency: "hourly", priority: 0.95 },
    { url: `${baseUrl}/agent-reader`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/publications`, lastModified, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/community`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/graph`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/intelligence`, lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/changelog`, lastModified, changeFrequency: "weekly", priority: 0.75 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/help`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/careers`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/compliance`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/peer-review`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/portfolio`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/reader`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/welcome`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/status`, lastModified, changeFrequency: "always", priority: 0.6 },
    { url: `${baseUrl}/institution-sso`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/disclaimer`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];

  return publicRoutes;
}
