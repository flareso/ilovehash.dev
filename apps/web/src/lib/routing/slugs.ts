/**
 * Generic slug utilities (routing-safe, no domain knowledge).
 */

export function toKebabSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // keep spaces + hyphens
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function categoryNameToSlug(categoryName: string): string {
  return toKebabSlug(categoryName);
}

export function titleToSlug(title: string): string {
  return toKebabSlug(title);
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function createCategorySlugMap(
  categories: string[],
): Record<string, string> {
  const map: Record<string, string> = {};
  categories.forEach((category) => {
    map[category] = categoryNameToSlug(category);
  });
  return map;
}

export function createSlugToCategoryMap(
  categories: string[],
): Record<string, string> {
  const map: Record<string, string> = {};
  categories.forEach((category) => {
    map[categoryNameToSlug(category)] = category;
  });
  return map;
}

