import { type HashToolResource } from "@/lib/hash-metadata";
import { HASH_ALGORITHMS } from "@/lib/hash-metadata";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import ItemCard from "./item-card";

interface ItemGridProps {
  items: HashToolResource[];
  bookmarkedItems: string[];
  onBookmark: (id: string) => void;
  isBookmarkLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onReset?: () => void;
}

export function ItemGrid({
  items,
  bookmarkedItems,
  onBookmark,
  isBookmarkLoading = false,
  emptyTitle = "No items found matching your criteria.",
  emptyDescription = "Try adjusting your search or filter settings.",
  onReset,
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 mb-4"
        >
          <svg
            className="w-8 h-8 text-neutral-500 dark:text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>
        <p className="text-muted-foreground text-lg font-medium">
          {emptyTitle}
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          {emptyDescription}
        </p>
        {onReset && (
          <Button type="button" variant="outline" className="mt-4" onClick={onReset}>
            Reset search
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <motion.div
          key={`grid`}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          layout
        >
          {items.map((item) => (
            <ItemCard
              key={`${item.id}`}
              id={item.id}
              title={item.name}
              description={item.description}
              url={item.url}
              category={item.category}
              date={item.date}
              legacy={HASH_ALGORITHMS[item.id]?.legacy || false}
              isBookmarked={bookmarkedItems.includes(item.id)}
              onBookmark={onBookmark}
              isBookmarkLoading={isBookmarkLoading}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}
