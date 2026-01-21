/**
 * Cryptographic Hash Functions
 */

// SHA-2 family
export { sha224, sha256, sha384, sha512, sha512_224, sha512_256 } from '../algorithms/sha2';

// SHA-3 family
export { sha3_224, sha3_256, sha3_384, sha3_512, shake128, shake256, sha3 } from '../algorithms/sha3';

// Keccak family (underlying sponge construction for SHA-3)
export { keccak_224, keccak_256, keccak_384, keccak_512 } from '../algorithms/sha3';

// SHA-3 addons (advanced XOF functions)
export {
  cshake128, cshake256, turboshake128, turboshake256,
  tuplehash256, parallelhash256, kt128, kt256, keccakprg
} from '../algorithms/sha3-addons';

// BLAKE3
export { blake3, blake3_keyed, blake3_derive_key } from '../algorithms/blake3';

// Argon2 (password hashing)
export { argon2d, argon2i, argon2id, argon2, verifyArgon2d, verifyArgon2i, verifyArgon2id } from '../algorithms/argon2';

// BLAKE2 & BLAKE1 family
export { blake2b, blake2s } from '../algorithms/blake2';
export { blake224, blake256, blake384, blake512 } from '../algorithms/blake1';

// MAC functions
export { hmac, hmacSha256, hmacSha3, hmacBlake2b } from '../algorithms/hmac';

// KDF functions
export { hkdf, hkdfSha256, hkdfExtract as extract, hkdfExpand as expand } from '../algorithms/hkdf';
export { pbkdf2, pbkdf2Async, pbkdf2Sha256, pbkdf2Sha256Async } from '../algorithms/pbkdf2';
export { scrypt, scryptAsync } from '../algorithms/scrypt';

// Legacy hashes (deprecated, avoid for security)
export { sha1, md5, ripemd160 } from '../algorithms/legacy';