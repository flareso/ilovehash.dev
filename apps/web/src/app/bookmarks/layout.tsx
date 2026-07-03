import type { Metadata } from "next";
import type React from "react";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Bookmarks",
  description: "Saved hash tools for this browser.",
  path: "/bookmarks",
  noIndex: true,
});

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
