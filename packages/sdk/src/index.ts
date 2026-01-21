/**
 * ilovehash SDK - Comprehensive Hashing Library
 * Tree-shaking friendly exports
 */

// Core utilities
export * from './types';
export * from './utils/encoding';

// Cryptographic hashes
export * from './crypto/index';

// Checksum algorithms
export * from './checksum/index';

// Similarity hashes
export * from './similarity/index';

// Non-cryptographic hashes
export * from './non-crypto/index';

// Individual algorithm exports for granular tree-shaking
export * as sha2 from './algorithms/sha2';
export * as legacy from './algorithms/legacy';
export * as blake2 from './algorithms/blake2';
export * as blake1 from './algorithms/blake1';
export * as hmac from './algorithms/hmac';
export * as hkdf from './algorithms/hkdf';
export * as pbkdf2 from './algorithms/pbkdf2';
export * as scrypt from './algorithms/scrypt';
export * as sha3Addons from './algorithms/sha3-addons';

// Individual SHA-3 addon exports
export { cshake128, cshake256, kt128, kt256 } from './algorithms/sha3-addons';

// Individual BLAKE1 variants for compatibility
export { blake224 as blake1_224, blake256 as blake1_256, blake384 as blake1_384, blake512 as blake1_512 } from './algorithms/blake1';

// Convenience re-exports
export { sha224, sha256, sha384, sha512, sha512_224, sha512_256 } from './algorithms/sha2';
export { sha3_224, sha3_256, sha3_384, sha3_512, shake128, shake256 } from './algorithms/sha3';
export { keccak_224, keccak_256, keccak_384, keccak_512 } from './algorithms/sha3';
export { blake2b, blake2s } from './algorithms/blake2';
export { blake3, blake3_keyed, blake3_derive_key } from './algorithms/blake3';
// MAC and KDF functions are available through namespace imports
export { argon2d, argon2i, argon2id, verifyArgon2d, verifyArgon2i, verifyArgon2id } from './algorithms/argon2';
export { crc32, crc16, crc8, crc64, internetChecksum } from './algorithms/crc';
export { fletcher4, fletcher8, fletcher16, fletcher32, fletcher64 } from './algorithms/fletcher';
export { xxhash32, xxhash64, xxhash128 } from './algorithms/xxhash';
export { murmurhash as murmurhash32, murmurhash128 } from './algorithms/murmurhash';
export { fnv1, fnv1a, fnv1_64, fnv1a_64 } from './algorithms/fnv';
export { sha1, md5, ripemd160 } from './algorithms/legacy';