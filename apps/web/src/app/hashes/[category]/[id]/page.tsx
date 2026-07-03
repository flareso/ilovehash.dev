import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HashToolPageClient from "./page-client";
import {
  hashCategorySlugToName,
  HASH_ALGORITHMS,
  HASH_TOOLS,
} from "@/lib/hash-metadata";
import { createSeoMetadata } from "@/lib/seo";

type HashToolPageProps = {
  params: Promise<{
    category: string;
    id: string;
  }>;
};

function toolIntent(toolName: string, category: string): string {
  if (category === "Password") return `${toolName} password hash generator`;
  if (category === "Checksum") return `${toolName} checksum calculator`;
  if (category === "Similarity") return `${toolName} similarity hash tool`;
  if (category === "Non-cryptographic") return `${toolName} hash function tool`;
  return `${toolName} hash generator`;
}

export async function generateMetadata({
  params,
}: HashToolPageProps): Promise<Metadata> {
  const { category, id } = await params;
  const categoryName = hashCategorySlugToName(category);
  const tool = HASH_TOOLS.find(
    (candidate) => candidate.id === id && candidate.category === categoryName,
  );

  if (!tool) {
    return createSeoMetadata({
      title: "Hash Tool Not Found",
      description: "The requested hash tool was not found.",
      path: `/hashes/${category}/${id}`,
      noIndex: true,
    });
  }

  const algorithm = HASH_ALGORITHMS[id];
  const intent = toolIntent(tool.name, tool.category);
  const output = algorithm?.outputLength
    ? ` Produces ${algorithm.outputLength * 8}-bit output by default.`
    : "";
  const securityNote = algorithm?.legacy
    ? " Includes security guidance for legacy and deprecated usage."
    : "";

  return createSeoMetadata({
    title: `${tool.name} ${tool.category === "Checksum" ? "Checksum Calculator" : "Hash Generator"}`,
    description: `${tool.description}. Use this ${intent} to compute and verify digests locally in your browser.${output}${securityNote}`,
    path: tool.url,
    keywords: [
      intent,
      `${tool.name} calculator`,
      `${tool.name} online`,
      `${tool.name} digest`,
      `${tool.name} checksum`,
      tool.category,
    ],
  });
}

export default async function HashToolPage({ params }: HashToolPageProps) {
  const { category, id } = await params;
  const categoryName = hashCategorySlugToName(category);

  if (
    !HASH_TOOLS.some(
      (tool) => tool.id === id && tool.category === categoryName,
    )
  ) {
    notFound();
  }

  return <HashToolPageClient params={Promise.resolve({ category, id })} />;
}
