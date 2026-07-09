import type { MetadataRoute } from "next";
import { getCategories, restaurants } from "@/lib/data";
import { absoluteUrl, getCategoryPath } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/restaurantes"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...getCategories().map((category) => ({
      url: absoluteUrl(getCategoryPath(category)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...restaurants.map((restaurant) => ({
      url: absoluteUrl(`/restaurantes/${restaurant.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
