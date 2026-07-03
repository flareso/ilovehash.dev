import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPageClient from "./page-client";
import {
  getHashCategoryDetails,
  hashCategorySlugToName,
  HASH_TOOLS,
} from "@/lib/hash-metadata";
import { createSeoMetadata } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = hashCategorySlugToName(category);
  const tools = HASH_TOOLS.filter((tool) => tool.category === categoryName);

  if (tools.length === 0) {
    return createSeoMetadata({
      title: "Hash Category Not Found",
      description: "The requested hash algorithm category was not found.",
      path: `/hashes/${category}`,
      noIndex: true,
    });
  }

  const details = getHashCategoryDetails(categoryName);
  const examples = tools
    .slice(0, 4)
    .map((tool) => tool.name)
    .join(", ");

  return createSeoMetadata({
    title: `${categoryName} Hash Functions`,
    description: `${details.description} Browse ${tools.length} ${categoryName.toLowerCase()} hash tools including ${examples}.`,
    path: `/hashes/${category}`,
    keywords: [
      `${categoryName.toLowerCase()} hash functions`,
      `${categoryName.toLowerCase()} hash generator`,
      `${categoryName.toLowerCase()} hash algorithms`,
      ...tools.slice(0, 8).map((tool) => tool.name),
    ],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryName = hashCategorySlugToName(category);

  if (!HASH_TOOLS.some((tool) => tool.category === categoryName)) {
    notFound();
  }

  return <CategoryPageClient params={Promise.resolve({ category })} />;
}
