// Hash algorithm metadata - safe for client components
// This file contains only static data and pure functions

// Type for hash algorithm configuration
export interface HashAlgorithm {
  name: string;
  description: string;
  category: string;
  nodeCryptoName?: string; // For Node.js built-in algorithms
  npmPackage?: string; // For external packages
  outputLength?: number; // Expected output length in bytes
  isSlow?: boolean; // For algorithms that should warn about performance
  legacy?: boolean; // For deprecated algorithms that should be avoided
  demo?: boolean; // Demo/simplified implementation (not cryptographically accurate)
}

// Hash tool interfaces
export interface HashTool {
  id: string;
  name: string;
  description: string;
  category: string;
  algorithm: string;
}

export type HashToolResource = HashTool & {
  url: string;
  date: string;
};

// Category interfaces
export type HashCategoryContext = "use" | "algo";

export interface HashCategoryDetails {
  description: string;
  features: string;
  context: HashCategoryContext;
}

// Comprehensive list of hash algorithms (static definitions).
const RAW_HASH_ALGORITHMS: Record<string, Omit<HashAlgorithm, "demo">> = {
  // Node.js built-in cryptographic hashes
  md5: {
    name: "MD5",
    description: "Compute an MD5 digest (deprecated, avoid for security)",
    category: "Cryptographic",
    nodeCryptoName: "md5",
    outputLength: 16,
    legacy: true,
  },
  sha1: {
    name: "SHA-1",
    description: "Compute a SHA-1 digest (deprecated, avoid for security)",
    category: "Cryptographic",
    nodeCryptoName: "sha1",
    outputLength: 20,
    legacy: true,
  },
  sha224: {
    name: "SHA-224",
    description: "Compute a SHA-224 digest",
    category: "SHA-2",
    nodeCryptoName: "sha224",
    outputLength: 28,
  },
  sha256: {
    name: "SHA-256",
    description: "Compute a SHA-256 digest",
    category: "SHA-2",
    nodeCryptoName: "sha256",
    outputLength: 32,
  },
  sha384: {
    name: "SHA-384",
    description: "Compute a SHA-384 digest",
    category: "SHA-2",
    nodeCryptoName: "sha384",
    outputLength: 48,
  },
  sha512: {
    name: "SHA-512",
    description: "Compute a SHA-512 digest",
    category: "SHA-2",
    nodeCryptoName: "sha512",
    outputLength: 64,
  },
  "sha512-224": {
    name: "SHA-512/224",
    description: "Compute a SHA-512/224 truncated digest",
    category: "SHA-2",
    nodeCryptoName: "sha512-224",
    outputLength: 28,
  },
  "sha512-256": {
    name: "SHA-512/256",
    description: "Compute a SHA-512/256 truncated digest",
    category: "SHA-2",
    nodeCryptoName: "sha512-256",
    outputLength: 32,
  },
  ripemd160: {
    name: "RIPEMD-160",
    description: "Compute a RIPEMD-160 digest",
    category: "Cryptographic",
    nodeCryptoName: "ripemd160",
    outputLength: 20,
  },

  // SHA-3 family
  "sha3-224": {
    name: "SHA-3-224",
    description: "Compute a SHA-3-224 digest",
    category: "SHA-3",
    nodeCryptoName: "sha3-224",
    outputLength: 28,
  },
  "sha3-256": {
    name: "SHA-3-256",
    description: "Compute a SHA-3-256 digest",
    category: "SHA-3",
    nodeCryptoName: "sha3-256",
    outputLength: 32,
  },
  "sha3-384": {
    name: "SHA-3-384",
    description: "Compute a SHA-3-384 digest",
    category: "SHA-3",
    nodeCryptoName: "sha3-384",
    outputLength: 48,
  },
  "sha3-512": {
    name: "SHA-3-512",
    description: "Compute a SHA-3-512 digest",
    category: "SHA-3",
    nodeCryptoName: "sha3-512",
    outputLength: 64,
  },

  // Keccak family (underlying sponge construction for SHA-3)
  "keccak-224": {
    name: "Keccak-224",
    description: "Compute a Keccak-224 digest (underlying SHA-3 construction)",
    category: "Cryptographic",
    outputLength: 28,
  },
  "keccak-256": {
    name: "Keccak-256",
    description: "Compute a Keccak-256 digest (underlying SHA-3 construction)",
    category: "Cryptographic",
    outputLength: 32,
  },
  "keccak-384": {
    name: "Keccak-384",
    description: "Compute a Keccak-384 digest (underlying SHA-3 construction)",
    category: "Cryptographic",
    outputLength: 48,
  },
  "keccak-512": {
    name: "Keccak-512",
    description: "Compute a Keccak-512 digest (underlying SHA-3 construction)",
    category: "Cryptographic",
    outputLength: 64,
  },

  // Extendable output functions
  shake128: {
    name: "SHAKE128",
    description: "Compute a SHAKE128 extendable output",
    category: "SHAKE",
    nodeCryptoName: "shake128",
    outputLength: 32,
  },
  shake256: {
    name: "SHAKE256",
    description: "Compute a SHAKE256 extendable output",
    category: "SHAKE",
    nodeCryptoName: "shake256",
    outputLength: 32,
  },

  // BLAKE2 family
  blake2b512: {
    name: "BLAKE2b-512",
    description: "Compute a BLAKE2b-512 digest",
    category: "BLAKE2",
    nodeCryptoName: "blake2b512",
    outputLength: 64,
  },
  blake2s256: {
    name: "BLAKE2s-256",
    description: "Compute a BLAKE2s-256 digest",
    category: "BLAKE2",
    nodeCryptoName: "blake2s256",
    outputLength: 32,
  },

  // BLAKE1 family (legacy, use BLAKE2 or BLAKE3 instead)
  "blake1-224": {
    name: "BLAKE-224",
    description: "Compute a BLAKE-224 digest (legacy, prefer BLAKE2/BLAKE3)",
    category: "Cryptographic",
    outputLength: 28,
    legacy: true,
  },
  "blake1-256": {
    name: "BLAKE-256",
    description: "Compute a BLAKE-256 digest (legacy, prefer BLAKE2/BLAKE3)",
    category: "Cryptographic",
    outputLength: 32,
    legacy: true,
  },
  "blake1-384": {
    name: "BLAKE-384",
    description: "Compute a BLAKE-384 digest (legacy, prefer BLAKE2/BLAKE3)",
    category: "Cryptographic",
    outputLength: 48,
    legacy: true,
  },
  "blake1-512": {
    name: "BLAKE-512",
    description: "Compute a BLAKE-512 digest (legacy, prefer BLAKE2/BLAKE3)",
    category: "Cryptographic",
    outputLength: 64,
    legacy: true,
  },

  // Non-cryptographic hashes (pure JavaScript implementations)
  murmurhash: {
    name: "MurmurHash",
    description: "Non-cryptographic hash function",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  djb2: {
    name: "DJB2",
    description: "Bernstein's hash djb2",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  sdbm: {
    name: "SDBM",
    description: "SDBM hash function",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  "fnv-1": {
    name: "FNV-1",
    description: "Fowler–Noll–Vo hash function (FNV-1)",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  "fnv-1a": {
    name: "FNV-1a",
    description: "Fowler–Noll–Vo hash function (FNV-1a)",
    category: "Non-cryptographic",
    outputLength: 4,
  },

  // Checksum algorithms (pure JavaScript implementations)
  "crc-32": {
    name: "CRC-32",
    description: "Cyclic redundancy check (32-bit)",
    category: "Checksum",
    outputLength: 4,
  },
  adler32: {
    name: "Adler-32",
    description: "Adler-32 checksum algorithm",
    category: "Checksum",
    outputLength: 4,
  },
  "crc-16": {
    name: "CRC-16",
    description: "Cyclic redundancy check (16-bit)",
    category: "Checksum",
    outputLength: 2,
  },
  "crc-8": {
    name: "CRC-8",
    description: "Cyclic redundancy check (8-bit)",
    category: "Checksum",
    outputLength: 1,
  },
  "crc-64": {
    name: "CRC-64",
    description: "Cyclic redundancy check (64-bit)",
    category: "Checksum",
    outputLength: 8,
  },

  // Modern cryptographic algorithms (external packages)
  blake3: {
    name: "BLAKE3",
    description: "Next-generation BLAKE3 hash function",
    category: "Modern",
    npmPackage: "blake3",
    outputLength: 32,
  },

  // SHA-3 addon functions (advanced XOF and customization)
  cshake128: {
    name: "cSHAKE128",
    description: "Customizable SHAKE128 with domain separation",
    category: "Modern",
    outputLength: 32,
  },
  cshake256: {
    name: "cSHAKE256",
    description: "Customizable SHAKE256 with domain separation",
    category: "Modern",
    outputLength: 32,
  },
  turboshake128: {
    name: "TurboSHAKE128",
    description: "TurboSHAKE128 with domain separation byte",
    category: "Modern",
    outputLength: 32,
  },
  turboshake256: {
    name: "TurboSHAKE256",
    description: "TurboSHAKE256 with domain separation byte",
    category: "Modern",
    outputLength: 32,
  },
  tuplehash256: {
    name: "TupleHash",
    description: "TupleHash for hashing ordered sequences",
    category: "Modern",
    outputLength: 32,
  },
  parallelhash256: {
    name: "ParallelHash",
    description: "ParallelHash for large data with parallelism parameter",
    category: "Modern",
    outputLength: 32,
  },
  kt128: {
    name: "KangarooTwelve (128-bit)",
    description: "KangarooTwelve tree hashing (128-bit output)",
    category: "Modern",
    outputLength: 16,
  },
  kt256: {
    name: "KangarooTwelve (256-bit)",
    description: "KangarooTwelve tree hashing (256-bit output)",
    category: "Modern",
    outputLength: 32,
  },

  // Similarity algorithms
  simhash: {
    name: "SimHash",
    description: "Locality-sensitive hash for similarity detection",
    category: "Similarity",
    outputLength: 8,
  },
  minhash: {
    name: "MinHash",
    description: "Min-wise independent permutations for Jaccard similarity",
    category: "Similarity",
    outputLength: 8,
  },
  bbitminhash: {
    name: "b-bit MinHash",
    description: "Space-efficient variant of MinHash for Jaccard similarity",
    category: "Similarity",
    outputLength: 8,
  },
  superminhash: {
    name: "SuperMinHash",
    description: "Improved MinHash algorithm (Ertl 2017) for better accuracy",
    category: "Similarity",
    outputLength: 8,
  },
  nilsimsa: {
    name: "Nilsimsa",
    description: "Locality-sensitive hash for text/spam detection",
    category: "Similarity",
    outputLength: 32,
  },
  imatch: {
    name: "I-Match",
    description: "Lexicon-based duplicate detection algorithm",
    category: "Similarity",
    outputLength: 8,
  },


  // Additional non-cryptographic hashes
  "jenkins-one-at-a-time": {
    name: "Jenkins One-at-a-Time",
    description: "Bob Jenkins' One-at-a-Time hash",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  "pearson": {
    name: "Pearson Hash",
    description: "Pearson hashing using lookup table",
    category: "Non-cryptographic",
    outputLength: 1,
  },
  "bernstein": {
    name: "Bernstein Hash",
    description: "Daniel J. Bernstein's hash function",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  "elf-hash": {
    name: "ELF Hash",
    description: "Executable and Linkable Format hash (PJW hash)",
    category: "Non-cryptographic",
    outputLength: 4,
  },

  // More checksum algorithms
  "internet-checksum": {
    name: "Internet Checksum",
    description: "RFC 1071 Internet checksum algorithm",
    category: "Checksum",
    outputLength: 2,
  },
  "fletcher-4": {
    name: "Fletcher-4",
    description: "Fletcher checksum (4-bit)",
    category: "Checksum",
    outputLength: 1,
  },
  "fletcher-8": {
    name: "Fletcher-8",
    description: "Fletcher checksum (8-bit)",
    category: "Checksum",
    outputLength: 1,
  },
  "fletcher-16": {
    name: "Fletcher-16",
    description: "Fletcher checksum (16-bit)",
    category: "Checksum",
    outputLength: 2,
  },
  "fletcher-32": {
    name: "Fletcher-32",
    description: "Fletcher checksum (32-bit)",
    category: "Checksum",
    outputLength: 4,
  },

  // Additional algorithms from master list
  // Note: Removed universal-hash as it's not implemented
  "zobrist": {
    name: "Zobrist Hash",
    description: "Zobrist hashing for board games",
    category: "Non-cryptographic",
    outputLength: 8,
  },
  "tabulation": {
    name: "Tabulation Hash",
    description: "Tabulation hashing with high independence",
    category: "Non-cryptographic",
    outputLength: 8,
  },

  argon2i: {
    name: "Argon2i",
    description: "Memory-hard password hashing (data-independent)",
    category: "Password",
    npmPackage: "argon2",
    isSlow: true,
    outputLength: 32,
  },
  argon2d: {
    name: "Argon2d",
    description: "Memory-hard password hashing (data-dependent)",
    category: "Password",
    npmPackage: "argon2",
    isSlow: true,
    outputLength: 32,
  },
  argon2id: {
    name: "Argon2id",
    description: "Hybrid Argon2 (combines Argon2i and Argon2d)",
    category: "Password",
    npmPackage: "argon2",
    isSlow: true,
    outputLength: 32,
  },

  has160: {
    name: "HAS-160",
    description: "Hash Algorithm Standard 160-bit",
    category: "Cryptographic",
    outputLength: 20,
    legacy: true,
  },
  gost: {
    name: "GOST",
    description: "Russian GOST R 34.11-2012 hash function",
    category: "Cryptographic",
    npmPackage: "gost-crypto",
    outputLength: 32,
    legacy: true,
  },
  streebog: {
    name: "Streebog",
    description: "Russian Streebog hash function",
    category: "Cryptographic",
    npmPackage: "streebog",
    outputLength: 32,
    legacy: true,
  },

  // Specialized hash functions
  "luhn": {
    name: "Luhn Algorithm",
    description: "Luhn algorithm for checksum validation",
    category: "Checksum",
    outputLength: 1,
  },
  "verhoeff": {
    name: "Verhoeff Algorithm",
    description: "Verhoeff algorithm for decimal number validation",
    category: "Checksum",
    outputLength: 1,
  },
  "damm": {
    name: "Damm Algorithm",
    description: "Damm algorithm for decimal number validation",
    category: "Checksum",
    outputLength: 1,
  },

  // More non-cryptographic hashes
  "rs-hash": {
    name: "RS Hash",
    description: "Robert Sedgwick's hash function",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  "js-hash": {
    name: "JS Hash",
    description: "Justin Sobel's hash function",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  "bkdr-hash": {
    name: "BKDR Hash",
    description: "Brian Kernighan and Dennis Ritchie's hash function",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  "dek-hash": {
    name: "DEK Hash",
    description: "Donald Knuth's hash function variant",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  "ap-hash": {
    name: "AP Hash",
    description: "Arash Partow's hash function",
    category: "Non-cryptographic",
    outputLength: 4,
  },
  murmurhash128: {
    name: "MurmurHash128",
    description: "MurmurHash with 128-bit output - fast non-cryptographic hash",
    category: "Non-cryptographic",
    outputLength: 16,
  },
  "fnv-1-64": {
    name: "FNV-1 (64-bit)",
    description: "Fowler–Noll–Vo hash function (FNV-1, 64-bit)",
    category: "Non-cryptographic",
    outputLength: 8,
  },
  "fnv-1a-64": {
    name: "FNV-1a (64-bit)",
    description: "Fowler–Noll–Vo hash function (FNV-1a, 64-bit)",
    category: "Non-cryptographic",
    outputLength: 8,
  },

  // xxHash family - extremely popular high-performance hashes
  "xxhash32": {
    name: "xxHash32",
    description: "xxHash with 32-bit output - extremely fast non-cryptographic hash",
    category: "Non-cryptographic",
    npmPackage: "xxhash-wasm",
    outputLength: 4,
  },
  "xxhash64": {
    name: "xxHash64",
    description: "xxHash with 64-bit output - extremely fast non-cryptographic hash",
    category: "Non-cryptographic",
    npmPackage: "xxhash-wasm",
    outputLength: 8,
  },
  "xxhash128": {
    name: "xxHash128",
    description: "xxHash with 128-bit output - extremely fast non-cryptographic hash",
    category: "Non-cryptographic",
    npmPackage: "xxhash-wasm",
    outputLength: 16,
  },

  // Additional high-performance hashes
  "cityhash": {
    name: "CityHash",
    description: "Google's CityHash - fast string hashing",
    category: "Non-cryptographic",
    npmPackage: "cityhash",
    outputLength: 8,
  },
  "farmhash": {
    name: "FarmHash",
    description: "Google's FarmHash - high-performance hashing",
    category: "Non-cryptographic",
    npmPackage: "farmhash",
    outputLength: 8,
  },
  "metrohash": {
    name: "MetroHash",
    description: "Very fast non-cryptographic hash function",
    category: "Non-cryptographic",
    npmPackage: "metrohash",
    outputLength: 8,
  },
  "t1ha": {
    name: "T1HA",
    description: "Fast Positive Hash (T1HA) algorithm",
    category: "Non-cryptographic",
    npmPackage: "t1ha",
    outputLength: 8,
  },

  // High-performance cryptographic hashes
  "highwayhash": {
    name: "HighwayHash",
    description: "Google's HighwayHash - fast cryptographic hash",
    category: "Modern",
    npmPackage: "highwayhash",
    outputLength: 8,
  },
  "siphash": {
    name: "SipHash",
    description: "SipHash - cryptographically secure PRF",
    category: "Modern",
    npmPackage: "siphash",
    outputLength: 8,
  },

  // Additional cryptographic primitives
  "poly1305": {
    name: "Poly1305",
    description: "Poly1305 one-time authenticator",
    category: "Modern",
    npmPackage: "poly1305-js",
    outputLength: 16,
  },
  "cmac": {
    name: "CMAC",
    description: "Cipher-based Message Authentication Code",
    category: "Modern",
    npmPackage: "crypto-js", // or specialized package
    outputLength: 16,
  },

  // More password hashing (different from bcrypt)
  scrypt: {
    name: "Scrypt",
    description: "Scrypt memory-hard password hashing",
    category: "Password",
    npmPackage: "scrypt-js",
    isSlow: true,
    outputLength: 32,
  },
  pbkdf2: {
    name: "PBKDF2",
    description: "Password-Based Key Derivation Function 2",
    category: "Password",
    isSlow: true,
    outputLength: 32,
  },

  // MAC and KDF functions
  hmac: {
    name: "HMAC",
    description: "Hash-based Message Authentication Code",
    category: "Modern",
    outputLength: 32,
  },
  hkdf: {
    name: "HKDF",
    description: "HMAC-based Key Derivation Function",
    category: "Modern",
    outputLength: 32,
  },

  // Competition cryptographic hashes (moved to Modern)
  cubehash: {
    name: "CubeHash",
    description: "CubeHash cryptographic hash function",
    category: "Modern",
    outputLength: 32,
  },
  echo: {
    name: "ECHO",
    description: "ECHO cryptographic hash function",
    category: "Modern",
    outputLength: 32,
  },
  skein: {
    name: "Skein",
    description: "Skein cryptographic hash function",
    category: "Modern",
    outputLength: 32,
  },
  "blue-midnight-wish": {
    name: "Blue Midnight Wish",
    description: "Blue Midnight Wish cryptographic hash function",
    category: "Modern",
    outputLength: 32,
  },
  grøstl: {
    name: "Grøstl",
    description: "Grøstl cryptographic hash function",
    category: "Modern",
    outputLength: 32,
  },


  // Deprecated cryptographic algorithms (pure JavaScript implementations)
  md2: {
    name: "MD2",
    description: "Compute an MD2 digest (deprecated)",
    category: "Cryptographic",
    outputLength: 16,
    legacy: true,
  },
  md4: {
    name: "MD4",
    description: "Compute an MD4 digest (deprecated)",
    category: "Cryptographic",
    outputLength: 16,
    legacy: true,
  },
};

export const HASH_ALGORITHMS: Record<string, HashAlgorithm> = Object.fromEntries(
  Object.entries(RAW_HASH_ALGORITHMS).map(([id, cfg]) => [
    id,
    {
      ...cfg,
      demo: !("nodeCryptoName" in cfg),
    },
  ]),
);

// Get algorithms by category (client-safe function)
export function getAlgorithmsByCategory(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  Object.keys(HASH_ALGORITHMS).forEach(algo => {
    const category = HASH_ALGORITHMS[algo].category;
    if (!result[category]) result[category] = [];
    result[category].push(algo);
  });
  return result;
}

// Category details
/**
 * Single source of truth for category copy + grouping.
 * (Moved from `src/app/categories/page.tsx`.)
 */
export const HASH_CATEGORY_DETAILS: Record<string, HashCategoryDetails> = {
  // Use-based categories (what you use them for)
  Cryptographic: {
    description:
      "Secure hash functions for cryptographic applications including digital signatures, certificates, blockchain, and secure communications.",
    features: "High security, collision resistance, preimage resistance",
    context: "use",
  },
  Password: {
    description:
      "Specialized hash functions designed for password hashing with features like salt support and intentionally slow computation.",
    features: "Password security, salt support, computational hardness",
    context: "use",
  },
  Checksum: {
    description:
      "Error-detection algorithms for verifying data integrity. Includes CRC variants, Fletcher checksums, and other validation methods.",
    features: "Error detection, fast, various bit lengths",
    context: "use",
  },
  Similarity: {
    description:
      "Locality-sensitive hash functions used for similarity detection, duplicate finding, and nearest neighbor searches.",
    features: "Similarity detection, probabilistic, specialized use cases",
    context: "use",
  },
  "Non-cryptographic": {
    description:
      "Fast hash functions designed for non-cryptographic purposes like hash tables, checksums, and data integrity verification.",
    features: "High speed, good distribution, non-cryptographic",
    context: "use",
  },

  // Algorithm family categories (specific algorithm families)
  "SHA-2": {
    description:
      "Modern cryptographic hash functions recommended for security applications. Includes SHA-256, SHA-384, and SHA-512 with truncated variants.",
    features: "High security, standardized, widely adopted",
    context: "algo",
  },
  "SHA-3": {
    description:
      "Next-generation cryptographic hash functions based on the Keccak algorithm. Offers better security margins and flexible output sizes.",
    features: "Future-proof, quantum-resistant design, extendable output",
    context: "algo",
  },
  SHAKE: {
    description:
      "Extendable-output functions (XOF) from the SHA-3 family. Can produce hash outputs of any desired length.",
    features: "Variable output length, SHA-3 based, flexible",
    context: "algo",
  },
  BLAKE2: {
    description:
      "High-performance cryptographic hash functions optimized for speed while maintaining security. Excellent for performance-critical applications.",
    features: "Fast, secure, customizable output size",
    context: "algo",
  },
  Modern: {
    description:
      "Next-generation hash functions with improved security and performance characteristics compared to older standards.",
    features: "Latest technology, enhanced security, optimized",
    context: "algo",
  },
};

// Category utility functions
export function getHashCategoryDetails(title: string): HashCategoryDetails {
  return (
    HASH_CATEGORY_DETAILS[title] || {
      description: `${title} hash algorithms for various computing applications.`,
      features: "Specialized hashing functionality",
      context: "algo",
    }
  );
}

const ALL_CATEGORY_TITLES = Object.keys(getAlgorithmsByCategory());

export function hashCategoryNameToSlug(categoryName: string): string {
  // Simple slug conversion (can be enhanced if needed)
  return categoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // keep spaces + hyphens
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function hashCategorySlugToName(slug: string): string {
  // Create a reverse map for slug to category conversion
  const slugToCategoryMap: Record<string, string> = {};
  ALL_CATEGORY_TITLES.forEach(category => {
    slugToCategoryMap[hashCategoryNameToSlug(category)] = category;
  });
  return slugToCategoryMap[slug] || slug;
}

export function getAllHashCategoryTitles(): string[] {
  return [...ALL_CATEGORY_TITLES];
}

// Hash tools generation
const TODAY = "2026-01-19";

// Generate tools from implemented algorithms
export const HASH_TOOLS: HashToolResource[] = Object.keys(HASH_ALGORITHMS).map(
  (algo) => {
    const config = HASH_ALGORITHMS[algo];
    const categorySlug = hashCategoryNameToSlug(config.category);

    return {
      id: algo,
      name: config.name,
      description: config.description,
      category: config.category,
      algorithm: algo,
      url: `/hashes/${categorySlug}/${algo}`,
      date: TODAY,
    };
  },
);