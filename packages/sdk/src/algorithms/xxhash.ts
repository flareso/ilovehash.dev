/**
 * xxHash Implementation
 * Based on xxhashjs and official xxHash specification
 * MIT License
 */

import { bytesToHex, stringToBytes, numberToBytes } from '../utils/encoding';
import type { HashOptions, HashFunction } from '../types';

// xxHash constants
const XXH_PRIME32_1 = 0x9E3779B1;
const XXH_PRIME32_2 = 0x85EBCA77;
const XXH_PRIME32_3 = 0xC2B2AE3D;
const XXH_PRIME32_4 = 0x27D4EB2F;
const XXH_PRIME32_5 = 0x165667B1;

const XXH_PRIME64_1 = 0x9E3779B185EBCA87n;
const XXH_PRIME64_2 = 0xC2B2AE3D27D4EB4Fn;
const XXH_PRIME64_3 = 0x165667B19E3779F9n;
const XXH_PRIME64_4 = 0x85EBCA77C2B2AE63n;
const XXH_PRIME64_5 = 0x27D4EB2F165667C5n;

// xxHash32 round function
function xxh32Round(acc: number, input: number): number {
  acc += input * XXH_PRIME32_2;
  acc = rotateLeft(acc, 13);
  acc *= XXH_PRIME32_1;
  return acc;
}

// xxHash32 avalanche function
function xxh32Avalanche(acc: number): number {
  acc ^= acc >>> 15;
  acc *= XXH_PRIME32_2;
  acc ^= acc >>> 13;
  acc *= XXH_PRIME32_3;
  acc ^= acc >>> 16;
  return acc;
}

// xxHash32 implementation
export function xxhash32(input: string | Uint8Array, seed = 0, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let h32 = 0;

  if (data.length >= 16) {
    let v1 = seed + XXH_PRIME32_1 + XXH_PRIME32_2;
    let v2 = seed + XXH_PRIME32_2;
    let v3 = seed;
    let v4 = seed - XXH_PRIME32_1;

    let p = 0;
    const limit = data.length - 16;
    do {
      v1 = xxh32Round(v1, (data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]);
      p += 4;
      v2 = xxh32Round(v2, (data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]);
      p += 4;
      v3 = xxh32Round(v3, (data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]);
      p += 4;
      v4 = xxh32Round(v4, (data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]);
      p += 4;
    } while (p <= limit);

    h32 = rotateLeft(v1, 1) + rotateLeft(v2, 7) + rotateLeft(v3, 12) + rotateLeft(v4, 18);
  } else {
    h32 = seed + XXH_PRIME32_5;
  }

  h32 += data.length;

  let p = 0;
  while (p + 4 <= data.length) {
    h32 += ((data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]) * XXH_PRIME32_3;
    h32 = rotateLeft(h32, 17) * XXH_PRIME32_4;
    p += 4;
  }

  while (p < data.length) {
    h32 += data[p] * XXH_PRIME32_5;
    h32 = rotateLeft(h32, 11) * XXH_PRIME32_1;
    p++;
  }

  h32 = xxh32Avalanche(h32);

  const result = numberToBytes(h32 >>> 0, 4);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// xxHash64 round function
function xxh64Round(acc: bigint, input: bigint): bigint {
  acc += input * XXH_PRIME64_2;
  acc = rotateLeft64(acc, 31);
  acc *= XXH_PRIME64_1;
  return acc;
}

// xxHash64 merge function
function xxh64MergeRound(acc: bigint, val: bigint): bigint {
  val = xxh64Round(0n, val);
  acc ^= val;
  acc = acc * XXH_PRIME64_1 + XXH_PRIME64_4;
  return acc;
}

// xxHash64 avalanche function
function xxh64Avalanche(acc: bigint): bigint {
  acc ^= acc >> 33n;
  acc *= XXH_PRIME64_2;
  acc ^= acc >> 29n;
  acc *= XXH_PRIME64_3;
  acc ^= acc >> 32n;
  return acc;
}

// Rotate left for 64-bit values
function rotateLeft64(value: bigint, amount: number): bigint {
  return ((value << BigInt(amount)) | (value >> (64n - BigInt(amount)))) & 0xFFFFFFFFFFFFFFFFn;
}

// Rotate left for 32-bit values
function rotateLeft(value: number, amount: number): number {
  return ((value << amount) | (value >>> (32 - amount))) >>> 0;
}

// xxHash64 implementation
export function xxhash64(input: string | Uint8Array, seed = 0n, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let h64 = 0n;

  if (data.length >= 32) {
    let v1 = seed + XXH_PRIME64_1 + XXH_PRIME64_2;
    let v2 = seed + XXH_PRIME64_2;
    let v3 = seed;
    let v4 = seed - XXH_PRIME64_1;

    let p = 0;
    const limit = data.length - 32;
    do {
      v1 = xxh64Round(v1, BigInt((data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]));
      p += 4;
      v2 = xxh64Round(v2, BigInt((data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]));
      p += 4;
      v3 = xxh64Round(v3, BigInt((data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]));
      p += 4;
      v4 = xxh64Round(v4, BigInt((data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]));
      p += 4;
    } while (p <= limit);

    h64 = rotateLeft64(v1, 1) + rotateLeft64(v2, 7) + rotateLeft64(v3, 12) + rotateLeft64(v4, 18);

    h64 = xxh64MergeRound(h64, v1);
    h64 = xxh64MergeRound(h64, v2);
    h64 = xxh64MergeRound(h64, v3);
    h64 = xxh64MergeRound(h64, v4);
  } else {
    h64 = seed + XXH_PRIME64_5;
  }

  h64 += BigInt(data.length);

  let p = 0;
  while (p + 8 <= data.length) {
    const k1 = BigInt((data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]) |
              (BigInt((data[p + 4] << 24) | (data[p + 5] << 16) | (data[p + 6] << 8) | data[p + 7]) << 32n);
    h64 ^= xxh64Round(0n, k1);
    h64 = rotateLeft64(h64, 27) * XXH_PRIME64_1 + XXH_PRIME64_4;
    p += 8;
  }

  if (p + 4 <= data.length) {
    const k1 = BigInt((data[p] << 24) | (data[p + 1] << 16) | (data[p + 2] << 8) | data[p + 3]);
    h64 ^= k1 * XXH_PRIME64_1;
    h64 = rotateLeft64(h64, 23) * XXH_PRIME64_2 + XXH_PRIME64_3;
    p += 4;
  }

  while (p < data.length) {
    h64 ^= BigInt(data[p]) * XXH_PRIME64_5;
    h64 = rotateLeft64(h64, 11) * XXH_PRIME64_1;
    p++;
  }

  h64 = xxh64Avalanche(h64);

  const result = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    result[i] = Number((h64 >> BigInt(i * 8)) & 0xFFn);
  }

  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// xxHash128 implementation (simplified)
export function xxhash128(input: string | Uint8Array, seed = 0n, options: HashOptions = {}): string {
  // For simplicity, concatenate two xxHash64 calls with different seeds
  const hash1 = xxhash64(input, seed);
  const hash2 = xxhash64(input, seed + 1n);
  const result = hash2 + hash1; // Little-endian concatenation

  return options.encoding === 'base64' ? btoa(String.fromCharCode(...hexToBytes(result))) : result;
}

// Helper function for xxhash128
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export const xxhash: HashFunction = (input: string | Uint8Array, options: HashOptions = {}): string => {
  const outputLength = options.outputLength || 8;
  if (outputLength <= 4) {
    return xxhash32(input, 0, options);
  } else if (outputLength <= 8) {
    return xxhash64(input, 0n, options);
  } else {
    return xxhash128(input, 0n, options);
  }
};