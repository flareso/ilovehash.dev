import type { Metadata } from "next";
import HashesPageClient from "./page-client";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Hash Generator and Algorithm Tools",
  description:
    "Generate, verify, and compare MD5, SHA-1, SHA-256, SHA-3, BLAKE2, BLAKE3, CRC, xxHash, Argon2, and more hash algorithms locally in your browser.",
  path: "/",
  keywords: [
    "hash generator",
    "hash calculator",
    "sha256 generator",
    "md5 generator",
    "checksum calculator",
    "hash algorithm tools",
  ],
});

export default function HomePage() {
  return <HashesPageClient />;
}
