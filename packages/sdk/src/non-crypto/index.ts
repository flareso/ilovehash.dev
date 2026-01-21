/**
 * Non-Cryptographic Hash Functions
 */

// xxHash family
export { xxhash32, xxhash64, xxhash128, xxhash } from '../algorithms/xxhash';

// MurmurHash
export { murmurhash, murmurhash128, murmur } from '../algorithms/murmurhash';

// FNV
export { fnv1, fnv1a, fnv1_64, fnv1a_64, fnv } from '../algorithms/fnv';