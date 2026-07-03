"use client";

import { ItemGrid } from "@/components/item-grid";
import { SearchFilterControls } from "@/components/search-filter-controls";
import { SubmitCTA } from "@/components/sections/cta-submit";
import Hero from "@/components/sections/hero";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { HASH_TOOLS, type HashToolResource } from "@/lib/hash-metadata";
import { searchHashTools } from "@/lib/hash-search";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const QUICK_SEARCHES = [
  "SHA-256",
  "password",
  "checksum",
  "fast hash",
  "legacy",
  "non crypto",
];

export default function HashesPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const {
    bookmarkedItems,
    toggleBookmark,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  const allItems = useMemo<HashToolResource[]>(() => {
    return [...HASH_TOOLS].sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
  }, []);

  const categoryOptions = useMemo(() => {
    const titles = Array.from(new Set(allItems.map((item) => item.category))).sort(
      (a, b) => a.localeCompare(b),
    );
    return titles.map((title) => ({ label: title, value: title }));
  }, [allItems]);

  const filteredItems = useMemo<HashToolResource[]>(() => {
    let filtered = searchHashTools(allItems, debouncedSearchQuery).map(
      (result) => result.item,
    );

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category),
      );
    }

    return filtered;
  }, [allItems, debouncedSearchQuery, selectedCategories]);

  const hasActiveSearch =
    searchQuery.trim().length > 0 || selectedCategories.length > 0;

  const resetSearch = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />

      <motion.div
        className="my-8 sm:my-12"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-6">
          {/* Search and Filter Controls */}
          <motion.div initial={false} animate={{ opacity: 1 }}>
            <div className="space-y-3">
              <SearchFilterControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryOptions={categoryOptions}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                sortOption="name-asc"
                onSortChange={() => {}} // Disabled for now since we have custom sorting
              />
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="text-xs text-muted-foreground">
                  Popular:
                </span>
                {QUICK_SEARCHES.map((query) => (
                  <Button
                    key={query}
                    type="button"
                    variant={
                      searchQuery.toLowerCase() === query.toLowerCase()
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSearchQuery(query)}
                  >
                    {query}
                  </Button>
                ))}
                {hasActiveSearch && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetSearch}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground text-center"
          >
            Showing {filteredItems.length} of {allItems.length} hash algorithms
          </motion.div>

          {/* Hash Grid - Show all items */}
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
            <ItemGrid
              items={filteredItems}
              bookmarkedItems={bookmarkedItems}
              onBookmark={toggleBookmark}
              isBookmarkLoading={isBookmarkLoading}
              emptyTitle="No hash algorithms found"
              emptyDescription="Try a broader query like SHA, checksum, password, fast hash, or clear the category filter."
              onReset={hasActiveSearch ? resetSearch : undefined}
            />
          </motion.div>
        </div>
      </motion.div>

      <SubmitCTA />
    </motion.div>
  );
}
