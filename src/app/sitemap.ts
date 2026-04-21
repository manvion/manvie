import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://manvie.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/shop`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${BASE_URL}/try-on`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/stylist`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/cart`, priority: 0.5, changeFrequency: "always" as const },
    { url: `${BASE_URL}/checkout`, priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const productIds = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const productPages = productIds.map((id) => ({
    url: `${BASE_URL}/product/${id}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
    lastModified: new Date(),
  }));

  return [...staticPages, ...productPages].map((page) => ({
    ...page,
    lastModified: new Date(),
  }));
}
