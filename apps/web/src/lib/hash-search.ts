import type { HashToolResource } from "@/lib/hash-metadata";

const HASH_ALIASES: Record<string, string[]> = {
  md5: ["message digest", "legacy hash", "insecure hash", "old checksum"],
  sha1: ["sha 1", "sha-1", "legacy sha", "git hash", "insecure hash"],
  sha224: ["sha 224", "sha-224"],
  sha256: ["sha 256", "sha-256", "sha2", "sha 2", "secure hash"],
  sha384: ["sha 384", "sha-384", "sha2", "sha 2"],
  sha512: ["sha 512", "sha-512", "sha2", "sha 2", "secure hash"],
  "sha3-256": ["sha3 256", "sha-3 256", "sha 3 256", "keccak standard"],
  blake3: ["blake 3", "fast cryptographic hash", "modern hash"],
  argon2id: ["argon2", "argon 2", "password hash", "password hashing"],
  "crc-32": ["crc32", "crc 32", "checksum", "zip checksum"],
  xxhash32: ["xxh32", "xx hash", "fast hash", "non crypto hash"],
  xxhash64: ["xxh64", "xx hash", "fast hash", "non crypto hash"],
  xxhash128: ["xxh128", "xx hash", "fast hash", "non crypto hash"],
};

export type SearchResult = {
  item: HashToolResource;
  score: number;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compact(value: string): string {
  return normalize(value).replace(/\s+/g, "");
}

function uniqueTerms(value: string): string[] {
  return Array.from(new Set(normalize(value).split(/\s+/).filter(Boolean)));
}

function searchableText(item: HashToolResource): string {
  return [
    item.id,
    item.name,
    item.category,
    item.description,
    ...(HASH_ALIASES[item.id] ?? []),
  ].join(" ");
}

function scoreItem(item: HashToolResource, query: string): number {
  const normalizedQuery = normalize(query);
  const compactQuery = compact(query);
  const terms = uniqueTerms(query);

  if (!normalizedQuery) return 1;

  const name = normalize(item.name);
  const compactName = compact(item.name);
  const id = normalize(item.id);
  const compactId = compact(item.id);
  const category = normalize(item.category);
  const description = normalize(item.description);
  const aliases = (HASH_ALIASES[item.id] ?? []).map(normalize);
  const text = normalize(searchableText(item));
  const compactText = compact(text);

  let score = 0;

  if (compactId === compactQuery) score += 120;
  if (compactName === compactQuery) score += 110;
  if (id === normalizedQuery) score += 90;
  if (name === normalizedQuery) score += 90;
  if (compactName.startsWith(compactQuery)) score += 70;
  if (compactId.startsWith(compactQuery)) score += 70;
  if (compactText.includes(compactQuery)) score += 45;
  if (category.includes(normalizedQuery)) score += 35;
  if (description.includes(normalizedQuery)) score += 25;
  if (aliases.some((alias) => alias.includes(normalizedQuery))) score += 45;

  for (const term of terms) {
    const compactTerm = compact(term);
    if (compactName.includes(compactTerm)) score += 18;
    if (compactId.includes(compactTerm)) score += 18;
    if (category.includes(term)) score += 10;
    if (description.includes(term)) score += 6;
    if (aliases.some((alias) => alias.includes(term))) score += 12;
  }

  return score;
}

export function searchHashTools(
  items: HashToolResource[],
  query: string,
): SearchResult[] {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return items.map((item) => ({ item, score: 1 }));
  }

  return items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.name.localeCompare(b.item.name);
    });
}
