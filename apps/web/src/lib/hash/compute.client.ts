/**
 * Client-side hash computation utilities
 * This file contains all the client-side hash computation logic
 */

import { Buffer } from "buffer";
import * as sdk from "@ilovehash/sdk";

export interface HashResult {
  hash: string;
  algorithm: string;
  format: string;
  inputLength: number;
  outputLength: number;
  category: string;
  executionTime?: number; // in milliseconds
  error?: string;
}

/**
 * Compute hash using the SDK directly in the browser
 */
export async function computeHashClient(
  algorithm: string,
  input: string,
  format: "hex" | "base64" = "hex",
): Promise<HashResult> {

  // Compute hash using the SDK directly
  let hash: string;
  const data = input;

  // Handle different algorithms - this mirrors the server-side logic
  switch (algorithm) {
    // SHA-2 family
    case "sha224": hash = sdk.sha224(data); break;
    case "sha256": hash = sdk.sha256(data); break;
    case "sha384": hash = sdk.sha384(data); break;
    case "sha512": hash = sdk.sha512(data); break;
    case "sha512-224": hash = sdk.sha512_224(data); break;
    case "sha512-256": hash = sdk.sha512_256(data); break;

    // SHA-3 family
    case "sha3-224": hash = sdk.sha3_224(data); break;
    case "sha3-256": hash = sdk.sha3_256(data); break;
    case "sha3-384": hash = sdk.sha3_384(data); break;
    case "sha3-512": hash = sdk.sha3_512(data); break;
    case "shake128": hash = sdk.shake128(data, 256); break;
    case "shake256": hash = sdk.shake256(data, 256); break;

    // SHA-3 addon functions
    case "cshake128": hash = Buffer.from(sdk.cshake128(data, { dkLen: 32 })).toString('hex'); break;
    case "cshake256": hash = Buffer.from(sdk.cshake256(data, { dkLen: 32 })).toString('hex'); break;
    case "turboshake128": hash = Buffer.from(sdk.turboshake128(data, { dkLen: 32 })).toString('hex'); break;
    case "turboshake256": hash = Buffer.from(sdk.turboshake256(data, { dkLen: 32 })).toString('hex'); break;
    case "tuplehash256": hash = Buffer.from(sdk.tuplehash256([data], { dkLen: 32 })).toString('hex'); break;
    case "parallelhash256": hash = Buffer.from(sdk.parallelhash256(data, { dkLen: 32 })).toString('hex'); break;
    case "kt128": hash = Buffer.from(sdk.kt128(data, { dkLen: 16 })).toString('hex'); break;
    case "kt256": hash = Buffer.from(sdk.kt256(data, { dkLen: 32 })).toString('hex'); break;

    // Keccak
    case "keccak-224": hash = sdk.keccak_224(data); break;
    case "keccak-256": hash = sdk.keccak_256(data); break;
    case "keccak-384": hash = sdk.keccak_384(data); break;
    case "keccak-512": hash = sdk.keccak_512(data); break;

    // BLAKE2
    case "blake2b512": hash = sdk.blake2b(data); break;
    case "blake2s256": hash = sdk.blake2s(data); break;

    // BLAKE3
    case "blake3": hash = sdk.blake3(data); break;

    // BLAKE1 (legacy)
    case "blake1-224": hash = sdk.blake224(data); break;
    case "blake1-256": hash = sdk.blake256(data); break;
    case "blake1-384": hash = sdk.blake384(data); break;
    case "blake1-512": hash = sdk.blake512(data); break;

    // Legacy hashes
    case "md5": hash = sdk.md5(data); break;
    case "sha1": hash = sdk.sha1(data); break;
    case "ripemd160": hash = sdk.ripemd160(data); break;

    // CRC and checksums
    case "crc-32": hash = sdk.crc32(data); break;
    case "crc-16": hash = sdk.crc16(data); break;
    case "crc-8": hash = sdk.crc8(data); break;
    case "crc-64": hash = sdk.crc64(data); break;
    case "internet-checksum": hash = sdk.internetChecksum(data); break;
    case "fletcher-4": hash = sdk.fletcher4(data); break;
    case "fletcher-8": hash = sdk.fletcher8(data); break;
    case "fletcher-16": hash = sdk.fletcher16(data); break;
    case "fletcher-32": hash = sdk.fletcher32(data); break;

    // Non-crypto hashes
    case "murmurhash": hash = sdk.murmurhash32(data); break;
    case "murmurhash128": hash = sdk.murmurhash128(data); break;
    case "fnv-1": hash = sdk.fnv1(data); break;
    case "fnv-1a": hash = sdk.fnv1a(data); break;
    case "fnv-1-64": hash = sdk.fnv1_64(data); break;
    case "fnv-1a-64": hash = sdk.fnv1a_64(data); break;
    case "xxhash32": hash = sdk.xxhash32(data); break;
    case "xxhash64": hash = sdk.xxhash64(data); break;
    case "xxhash128": hash = sdk.xxhash128(data); break;

    // Password hashing (simplified - async)
    case "argon2i": hash = await sdk.argon2i(input, { salt: "salt12345678901234567890123456789012", iterations: 2, memory: 65536, parallelism: 1 }); break;
    case "argon2d": hash = await sdk.argon2d(input, { salt: "salt12345678901234567890123456789012", iterations: 2, memory: 65536, parallelism: 1 }); break;
    case "argon2id": hash = await sdk.argon2id(input, { salt: "salt12345678901234567890123456789012", iterations: 2, memory: 65536, parallelism: 1 }); break;
    case "scrypt": hash = sdk.scrypt.scrypt(input, "salt12345678901234567890123456789012", 16384, 8, 1, 64); break;
    case "pbkdf2": hash = sdk.pbkdf2Sha256(input, "salt12345678901234567890123456789012", 10000, 32); break;

    // Similarity hashes
    case "simhash": hash = sdk.simhash(data); break;
    case "minhash": hash = sdk.minhash(data); break;
    case "bbitminhash": hash = sdk.bbitMinhash(data); break;
    case "superminhash": hash = sdk.superminhash(data); break;
    case "nilsimsa": hash = sdk.nilsimsa(data); break;
    case "imatch": hash = sdk.imatch(data, { lexicon: ["test", "words", "for", "demo"] }); break;

    // MAC and KDF functions
    case "hmac": hash = sdk.hmacSha256("key12345678901234567890123456789012", data); break;
    case "hkdf": hash = sdk.hkdfSha256("ikm12345678901234567890123456789012", "salt12345678901234567890123456789012", "info", 32); break;

    default:
      throw new Error(`Algorithm ${algorithm} not implemented`);
  }

  // Convert to requested format if needed
  if (format === "base64" && hash) {
    hash = Buffer.from(hash, "hex").toString("base64");
  }

  return {
    hash,
    algorithm,
    format,
    inputLength: input.length,
    outputLength: hash.length / (format === "hex" ? 2 : 1), // Approximate for hex vs base64
    category: "", // This will be filled by the calling component
  };
}

/**
 * Compute hash with timing measurement
 * Wraps computeHashClient to measure execution time
 */
export async function computeHashWithTiming(
  algorithm: string,
  input: string,
  format: "hex" | "base64" = "hex",
): Promise<HashResult> {
  const startTime = performance.now();
  try {
    const result = await computeHashClient(algorithm, input, format);
    const endTime = performance.now();
    return {
      ...result,
      executionTime: endTime - startTime,
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      hash: "",
      algorithm,
      format,
      inputLength: input.length,
      outputLength: 0,
      category: "",
      executionTime: endTime - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}