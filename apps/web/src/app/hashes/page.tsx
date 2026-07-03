import type { Metadata } from "next";
import HashesPageClient from "../page-client";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "All Hash Generators",
  description:
    "Browse every available hash generator and checksum tool, including MD5, SHA-1, SHA-256, SHA-3, BLAKE2, BLAKE3, CRC, xxHash, Argon2, and more.",
  path: "/hashes",
  keywords: [
    "all hash generators",
    "hash tools",
    "checksum tools",
    "cryptographic hash tools",
    "hash algorithm list",
  ],
});

export default function HashesPage() {
  return <HashesPageClient />;
}
