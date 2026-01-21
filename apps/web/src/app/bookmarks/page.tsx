"use client";

import { ItemGrid } from "@/components/item-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarks } from "@/hooks/use-bookmark";
import { useDebounce } from "@/hooks/use-debounce";
import { HASH_TOOLS, type HashToolResource } from "@/lib/hash-metadata";
import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";

export default function BookmarksPageClient() {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    bookmarkedItems,
    toggleBookmark,
    clearBookmarks,
    isLoading: isBookmarkLoading,
  } = useBookmarks();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const items = useMemo<HashToolResource[]>(() => {
    if (bookmarkedItems.length === 0) return [];
    const bookmarkedSet = new Set(bookmarkedItems);
    return HASH_TOOLS.filter((t) => bookmarkedSet.has(t.id));
  }, [bookmarkedItems]);

  const filteredItems = useMemo<HashToolResource[]>(() => {
    if (!debouncedSearchQuery) return items;
    const q = debouncedSearchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [items, debouncedSearchQuery]);

  const handleClearBookmarks = useCallback(() => {
    clearBookmarks();
    setShowClearDialog(false);
    setSearchQuery("");
  }, [clearBookmarks]);

  if (isBookmarkLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-8 sm:h-12 w-full max-w-96" />
            <Skeleton className="h-4 sm:h-6 w-full max-w-64" />
            <div className="flex items-center gap-2 sm:gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-2" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 sm:h-10 w-full max-w-md" />
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4"
              >
                <div className="space-y-2">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-4 sm:h-5 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 sm:h-4 w-full" />
                  <Skeleton className="h-3 sm:h-4 w-5/6" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-md" />
                  <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-md" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-0">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20 sm:w-24" />
              <Skeleton className="h-8 sm:h-10 w-[60px] sm:w-[70px]" />
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
              <Skeleton className="h-4 w-12 sm:w-16" />
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Bookmarks"
        description="Your saved hash tools"
        breadcrumbs={[{ label: "Bookmarks", href: "/bookmarks" }]}
        actions={
          <div className="space-y-3 sm:space-y-4 w-full">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span>
                {items.length}{" "}
                {items.length === 1 ? "bookmark" : "bookmarks"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
              <div className="w-full sm:flex-1 p-2 max-w-md">
                <Input
                  type="text"
                  placeholder="Search your bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {items.length > 0 && (
                <div className="p-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowClearDialog(true)}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    Clear All
                  </Button>
                </div>
              )}
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
        Showing {filteredItems.length} of {items.length} items
      </div>

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Bookmarks?</DialogTitle>
            <DialogDescription>
              This will remove all your bookmarked items. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearBookmarks}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

