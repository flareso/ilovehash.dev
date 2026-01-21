"use client";

import { ItemGrid } from "@/components/item-grid";
import { SearchFilterControls } from "@/components/search-filter-controls";
import { SubmitCTA } from "@/components/sections/cta-submit";
import Hero from "@/components/sections/hero";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { HASH_TOOLS, type HashToolResource } from "@/lib/hash-metadata";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

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
    let filtered = [...allItems];

    if (debouncedSearchQuery) {
      const lowercaseQuery = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercaseQuery) ||
          item.description.toLowerCase().includes(lowercaseQuery) ||
          item.category.toLowerCase().includes(lowercaseQuery),
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category),
      );
    }

    return filtered;
  }, [allItems, debouncedSearchQuery, selectedCategories]);

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.5 }}
      >
        <div className="space-y-6">
          {/* Search and Filter Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <SearchFilterControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categoryOptions={categoryOptions}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                sortOption="name-asc"
                onSortChange={() => {}} // Disabled for now since we have custom sorting
              />
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground text-center"
          >
            Showing {filteredItems.length} of {allItems.length} hash algorithms
          </motion.div>

          {/* Hash Grid - Show all items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ItemGrid
              items={filteredItems}
              bookmarkedItems={bookmarkedItems}
              onBookmark={toggleBookmark}
              isBookmarkLoading={isBookmarkLoading}
            />
          </motion.div>
        </div>
      </motion.div>

      <SubmitCTA />
    </motion.div>
  );
}

