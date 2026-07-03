import type { MetadataRoute } from "next";
import { getAllHashCategoryTitles, hashCategoryNameToSlug, HASH_TOOLS } from "@/lib/hash-metadata";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified },
    { url: `${SITE_URL}/hashes`, lastModified },
    { url: `${SITE_URL}/categories`, lastModified },
    { url: `${SITE_URL}/compare`, lastModified },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getAllHashCategoryTitles().map(
    (title) => ({
      url: `${SITE_URL}/hashes/${hashCategoryNameToSlug(title)}`,
      lastModified,
    }),
  );

  const toolRoutes: MetadataRoute.Sitemap = HASH_TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.url}`,
    lastModified,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
