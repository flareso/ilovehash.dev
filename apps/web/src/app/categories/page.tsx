"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHashCategoryDetails, HASH_TOOLS, type HashToolResource } from "@/lib/hash-metadata";
import { categoryNameToSlug } from "@/lib/routing/slugs";
import { motion } from "motion/react";
import Link from "next/link";
import { useMemo } from "react";

export default function CategoriesPageClient() {
  const categories = useMemo(() => {
    const byCategory = new Map<string, HashToolResource[]>();
    for (const tool of HASH_TOOLS) {
      const existing = byCategory.get(tool.category) ?? [];
      existing.push(tool);
      byCategory.set(tool.category, existing);
    }

    return Array.from(byCategory.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([title, items]) => ({
        title,
        slug: categoryNameToSlug(title),
        items,
        description: getHashCategoryDetails(title).description,
      }));
  }, []);

  const groupedCategories = useMemo(() => {
    const filteredCategories = categories
      .filter((category) => category.items.length > 0) // Only show categories with algorithms
      .map((category) => ({
        ...category,
        itemCount: category.items.length,
        details: getHashCategoryDetails(category.title),
      }));

    // Group by context
    const useCategories = filteredCategories.filter(
      (cat) => cat.details.context === "use",
    );
    const algoCategories = filteredCategories.filter(
      (cat) => cat.details.context === "algo",
    );

    return { useCategories, algoCategories };
  }, [categories]);

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Hash Categories"
        description="Explore different families of cryptographic and non-cryptographic hash algorithms"
        breadcrumbs={[{ label: "Categories", href: "/categories" }]}
      />

      {/* Use-case based categories */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary">Use Cases</h2>
          <p className="text-muted-foreground">
            Categories organized by application and security requirements
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Order: Cryptographic, Checksum, Password, Similarity, Non-cryptographic */}
          {[
            groupedCategories.useCategories.find(
              (cat) => cat.title === "Cryptographic",
            ),
            groupedCategories.useCategories.find((cat) => cat.title === "Checksum"),
            groupedCategories.useCategories.find((cat) => cat.title === "Password"),
            groupedCategories.useCategories.find(
              (cat) => cat.title === "Similarity",
            ),
            groupedCategories.useCategories.find(
              (cat) => cat.title === "Non-cryptographic",
            ),
          ]
            .filter(
              (category): category is NonNullable<typeof category> =>
                category !== undefined,
            )
            .map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/hashes/${category.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden hover:border-primary/20">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors leading-tight break-words flex-1 min-w-0">
                            {category.title}
                          </CardTitle>
                          <motion.div
                            className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                            whileHover={{ x: 2 }}
                          >
                            →
                          </motion.div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words leading-relaxed mb-2">
                          {category.details.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {category.details.features}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 p-4 sm:p-6 flex-1 flex items-end">
                        <div className="flex items-center justify-between gap-2 w-full">
                          <Badge
                            variant="secondary"
                            className="text-xs flex-shrink-0"
                          >
                            {category.itemCount}{" "}
                            {category.itemCount === 1
                              ? "algorithm"
                              : "algorithms"}
                          </Badge>
                          <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                            View category →
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Algorithm family based categories */}
      <div className="space-y-6 mt-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary">Algorithm Families</h2>
          <p className="text-muted-foreground">
            Categories organized by cryptographic standards and security levels
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Order: SHA-2, SHA-3, BLAKE2, SHAKE, LSH, Modern */}
          {[
            groupedCategories.algoCategories.find((cat) => cat.title === "SHA-2"),
            groupedCategories.algoCategories.find((cat) => cat.title === "SHA-3"),
            groupedCategories.algoCategories.find(
              (cat) => cat.title === "BLAKE2",
            ),
            groupedCategories.algoCategories.find((cat) => cat.title === "SHAKE"),
            groupedCategories.algoCategories.find(
              (cat) => cat.title === "Locality-Sensitive Hashing (LSH) Family",
            ),
            groupedCategories.algoCategories.find((cat) => cat.title === "Modern"),
          ]
            .filter(
              (category): category is NonNullable<typeof category> =>
                category !== undefined,
            )
            .map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/hashes/${category.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden hover:border-primary/20">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors leading-tight break-words flex-1 min-w-0">
                            {category.title}
                          </CardTitle>
                          <motion.div
                            className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                            whileHover={{ x: 2 }}
                          >
                            →
                          </motion.div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground break-words leading-relaxed mb-2">
                          {category.details.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {category.details.features}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 p-4 sm:p-6 flex-1 flex items-end">
                        <div className="flex items-center justify-between gap-2 w-full">
                          <Badge
                            variant="secondary"
                            className="text-xs flex-shrink-0"
                          >
                            {category.itemCount}{" "}
                            {category.itemCount === 1
                              ? "algorithm"
                              : "algorithms"}
                          </Badge>
                          <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                            View category →
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}

