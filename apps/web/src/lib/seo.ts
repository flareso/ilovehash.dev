import type { Metadata } from "next";

export const SITE_URL = "https://www.ilovehash.dev";
export const SITE_NAME = "ilovehash.dev";

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type SeoMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createSeoMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  noIndex = false,
}: SeoMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: "/seo.png",
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} hash tools`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/seo.png"],
    },
  };
}
