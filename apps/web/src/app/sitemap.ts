import type { MetadataRoute } from "next";
import { getAllHashCategoryTitles, hashCategoryNameToSlug, HASH_TOOLS } from "@/lib/hash-metadata";

const BASE_URL = "https://ilovehash.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified },
    { url: `${BASE_URL}/hashes`, lastModified },
    { url: `${BASE_URL}/categories`, lastModified },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getAllHashCategoryTitles().map(
    (title) => ({
      url: `${BASE_URL}/hashes/${hashCategoryNameToSlug(title)}`,
      lastModified,
    }),
  );

  const toolRoutes: MetadataRoute.Sitemap = HASH_TOOLS.map((tool) => ({
    url: `${BASE_URL}${tool.url}`,
    lastModified,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}

