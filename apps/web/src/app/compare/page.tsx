import type { Metadata } from "next";
import ComparePageClient from "./page-client";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Compare Hash Algorithms",
  description:
    "Compare hash algorithms by output, speed, category, and digest format. Benchmark MD5, SHA-256, SHA-3, BLAKE2, BLAKE3, CRC, and more in your browser.",
  path: "/compare",
  keywords: [
    "compare hash algorithms",
    "hash benchmark",
    "hash speed comparison",
    "md5 vs sha256",
    "sha256 vs blake3",
  ],
});

export default function ComparePage() {
  return <ComparePageClient />;
}
