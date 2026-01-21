"use client";

import { ItemGrid } from "@/components/item-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getHashCategoryDetails,
  hashCategorySlugToName,
  HASH_TOOLS,
  type HashToolResource,
} from "@/lib/hash-metadata";
import { motion } from "motion/react";
import { use, useMemo, useState } from "react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPageClient({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    bookmarkedItems,
    toggleBookmark,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const categorySlug = resolvedParams.category;
  const categoryName = hashCategorySlugToName(categorySlug);

  const items = useMemo<HashToolResource[]>(() => {
    return HASH_TOOLS.filter((tool) => tool.category === categoryName);
  }, [categoryName]);

  const filteredItems = useMemo<HashToolResource[]>(() => {
    if (!debouncedSearchQuery) return items;
    const q = debouncedSearchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [items, debouncedSearchQuery]);

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title={categoryName}
        description={getHashCategoryDetails(categoryName).description}
        breadcrumbs={[
          { label: "Hashes", href: "/hashes" },
          { label: categoryName, href: `/hashes/${categorySlug}` },
        ]}
        actions={
          <div className="space-y-3 sm:space-y-4 w-full">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span>
                {items.length} {items.length === 1 ? "algorithm" : "algorithms"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Category</span>
            </div>
            <div className="w-full p-2 max-w-md">
              <Input
                type="text"
                placeholder="Search within this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        }
      />

      <div className="min-h-screen mb-6 sm:mb-8">
        <ItemGrid
          items={filteredItems}
          bookmarkedItems={bookmarkedItems}
          onBookmark={toggleBookmark}
          isBookmarkLoading={isBookmarkLoading}
        />
      </div>

      <div className="text-xs sm:text-sm text-muted-foreground text-center mt-4 sm:mt-6">
        Showing {filteredItems.length} of {items.length} algorithms
      </div>

      {filteredItems.length === 0 && debouncedSearchQuery && (
        <div className="text-center py-8 sm:py-12 px-4">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base break-words">
            No algorithms found for "{debouncedSearchQuery}"
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
            className="text-sm sm:text-base"
          >
            Clear search
          </Button>
        </div>
      )}
    </motion.div>
  );
}

