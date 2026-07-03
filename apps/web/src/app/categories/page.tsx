import type { Metadata } from "next";
import CategoriesPageClient from "./page-client";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Hash Algorithm Categories",
  description:
    "Browse cryptographic hashes, checksums, password hashing algorithms, non-cryptographic hashes, similarity hashes, SHA-2, SHA-3, BLAKE2, and modern hash families.",
  path: "/categories",
  keywords: [
    "hash algorithm categories",
    "cryptographic hashes",
    "checksum algorithms",
    "password hashing algorithms",
    "non cryptographic hash functions",
  ],
});

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
