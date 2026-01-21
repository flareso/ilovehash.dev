import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/bookmarks"],
      },
    ],
    sitemap: "https://ilovehash.dev/sitemap.xml",
    host: "https://ilovehash.dev",
  };
}
