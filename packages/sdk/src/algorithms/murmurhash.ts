/**
 * MurmurHash Implementation
 * Based on murmurhash3js and Gary Court's implementation
 * MIT License
 */

import { bytesToHex, stringToBytes, numberToBytes } from '../utils/encoding';
import type { HashOptions, HashFunction } from '../types';

// MurmurHash3 constants
const MURMUR_C1 = 0xCC9E2D51;
const MURMUR_C2 = 0x1B873593;
const MURMUR_R1 = 15;
const MURMUR_R2 = 13;
const MURMUR_M = 5;
const MURMUR_N = 0xE6546B64;

// MurmurHash3 x86 32-bit
export function murmurhash(input: string | Uint8Array, seed = 0, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let h1 = seed;
  const len = data.length;

  // Process 4-byte chunks
  const numBlocks = Math.floor(len / 4);
  for (let i = 0; i < numBlocks; i++) {
    let k1 = (data[i * 4] & 0xFF) |
             ((data[i * 4 + 1] & 0xFF) << 8) |
             ((data[i * 4 + 2] & 0xFF) << 16) |
             ((data[i * 4 + 3] & 0xFF) << 24);

    k1 = Math.imul(k1, MURMUR_C1);
    k1 = (k1 << MURMUR_R1) | (k1 >>> (32 - MURMUR_R1));
    k1 = Math.imul(k1, MURMUR_C2);

    h1 ^= k1;
    h1 = (h1 << MURMUR_R2) | (h1 >>> (32 - MURMUR_R2));
    h1 = Math.imul(h1, MURMUR_M) + MURMUR_N;
  }

  // Handle remaining bytes
  let k1 = 0;
  const remainder = len % 4;
  const offset = numBlocks * 4;

  switch (remainder) {
    case 3:
      k1 ^= (data[offset + 2] & 0xFF) << 16;
      /* falls through */
    case 2:
      k1 ^= (data[offset + 1] & 0xFF) << 8;
      /* falls through */
    case 1:
      k1 ^= (data[offset] & 0xFF);
      k1 = Math.imul(k1, MURMUR_C1);
      k1 = (k1 << MURMUR_R1) | (k1 >>> (32 - MURMUR_R1));
      k1 = Math.imul(k1, MURMUR_C2);
      h1 ^= k1;
  }

  // Finalization
  h1 ^= len;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85EBCA6B);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xC2B2AE35);
  h1 ^= h1 >>> 16;

  // Ensure unsigned 32-bit result
  h1 = h1 >>> 0;

  const result = numberToBytes(h1, 4);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// MurmurHash3 x86 128-bit
export function murmurhash128(input: string | Uint8Array, seed = 0, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let h1 = seed;
  let h2 = seed;
  let h3 = seed;
  let h4 = seed;
  const len = data.length;

  // Process 16-byte chunks
  const numBlocks = Math.floor(len / 16);
  for (let i = 0; i < numBlocks; i++) {
    let k1 = (data[i * 16] & 0xFF) |
             ((data[i * 16 + 1] & 0xFF) << 8) |
             ((data[i * 16 + 2] & 0xFF) << 16) |
             ((data[i * 16 + 3] & 0xFF) << 24);
    let k2 = (data[i * 16 + 4] & 0xFF) |
             ((data[i * 16 + 5] & 0xFF) << 8) |
             ((data[i * 16 + 6] & 0xFF) << 16) |
             ((data[i * 16 + 7] & 0xFF) << 24);
    let k3 = (data[i * 16 + 8] & 0xFF) |
             ((data[i * 16 + 9] & 0xFF) << 8) |
             ((data[i * 16 + 10] & 0xFF) << 16) |
             ((data[i * 16 + 11] & 0xFF) << 24);
    let k4 = (data[i * 16 + 12] & 0xFF) |
             ((data[i * 16 + 13] & 0xFF) << 8) |
             ((data[i * 16 + 14] & 0xFF) << 16) |
             ((data[i * 16 + 15] & 0xFF) << 24);

    k1 = Math.imul(k1, MURMUR_C1);
    k1 = (k1 << MURMUR_R1) | (k1 >>> (32 - MURMUR_R1));
    k1 = Math.imul(k1, MURMUR_C2);
    h1 ^= k1;
    h1 = (h1 << MURMUR_R2) | (h1 >>> (32 - MURMUR_R2));
    h1 = Math.imul(h1, MURMUR_M) + MURMUR_N;

    k2 = Math.imul(k2, MURMUR_C1);
    k2 = (k2 << MURMUR_R1) | (k2 >>> (32 - MURMUR_R1));
    k2 = Math.imul(k2, MURMUR_C2);
    h2 ^= k2;
    h2 = (h2 << MURMUR_R2) | (h2 >>> (32 - MURMUR_R2));
    h2 = Math.imul(h2, MURMUR_M) + MURMUR_N;

    k3 = Math.imul(k3, MURMUR_C1);
    k3 = (k3 << MURMUR_R1) | (k3 >>> (32 - MURMUR_R1));
    k3 = Math.imul(k3, MURMUR_C2);
    h3 ^= k3;
    h3 = (h3 << MURMUR_R2) | (h3 >>> (32 - MURMUR_R2));
    h3 = Math.imul(h3, MURMUR_M) + MURMUR_N;

    k4 = Math.imul(k4, MURMUR_C1);
    k4 = (k4 << MURMUR_R1) | (k4 >>> (32 - MURMUR_R1));
    k4 = Math.imul(k4, MURMUR_C2);
    h4 ^= k4;
    h4 = (h4 << MURMUR_R2) | (h4 >>> (32 - MURMUR_R2));
    h4 = Math.imul(h4, MURMUR_M) + MURMUR_N;
  }

  // Handle remaining bytes
  const remainder = len % 16;
  const offset = numBlocks * 16;
  let k1 = 0, k2 = 0, k3 = 0, k4 = 0;

  switch (Math.floor(remainder / 4)) {
    case 3:
      k4 ^= (data[offset + 10] & 0xFF) << 16;
      k4 ^= (data[offset + 11] & 0xFF) << 8;
      k4 ^= (data[offset + 9] & 0xFF);
      k4 = Math.imul(k4, MURMUR_C1);
      k4 = (k4 << MURMUR_R1) | (k4 >>> (32 - MURMUR_R1));
      k4 = Math.imul(k4, MURMUR_C2);
      h4 ^= k4;
      /* falls through */
    case 2:
      k3 ^= (data[offset + 6] & 0xFF) << 16;
      k3 ^= (data[offset + 7] & 0xFF) << 8;
      k3 ^= (data[offset + 5] & 0xFF);
      k3 = Math.imul(k3, MURMUR_C1);
      k3 = (k3 << MURMUR_R1) | (k3 >>> (32 - MURMUR_R1));
      k3 = Math.imul(k3, MURMUR_C2);
      h3 ^= k3;
      /* falls through */
    case 1:
      k2 ^= (data[offset + 2] & 0xFF) << 16;
      k2 ^= (data[offset + 3] & 0xFF) << 8;
      k2 ^= (data[offset + 1] & 0xFF);
      k2 = Math.imul(k2, MURMUR_C1);
      k2 = (k2 << MURMUR_R1) | (k2 >>> (32 - MURMUR_R1));
      k2 = Math.imul(k2, MURMUR_C2);
      h2 ^= k2;
      /* falls through */
    case 0:
      k1 ^= (data[offset] & 0xFF);
      k1 = Math.imul(k1, MURMUR_C1);
      k1 = (k1 << MURMUR_R1) | (k1 >>> (32 - MURMUR_R1));
      k1 = Math.imul(k1, MURMUR_C2);
      h1 ^= k1;
  }

  // Finalization
  h1 ^= len;
  h2 ^= len;
  h3 ^= len;
  h4 ^= len;

  h1 += h2;
  h1 += h3;
  h1 += h4;
  h2 += h1;
  h3 += h1;
  h4 += h1;

  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85EBCA6B);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xC2B2AE35);
  h1 ^= h1 >>> 16;

  h2 ^= h2 >>> 16;
  h2 = Math.imul(h2, 0x85EBCA6B);
  h2 ^= h2 >>> 13;
  h2 = Math.imul(h2, 0xC2B2AE35);
  h2 ^= h2 >>> 16;

  h3 ^= h3 >>> 16;
  h3 = Math.imul(h3, 0x85EBCA6B);
  h3 ^= h3 >>> 13;
  h3 = Math.imul(h3, 0xC2B2AE35);
  h3 ^= h3 >>> 16;

  h4 ^= h4 >>> 16;
  h4 = Math.imul(h4, 0x85EBCA6B);
  h4 ^= h4 >>> 13;
  h4 = Math.imul(h4, 0xC2B2AE35);
  h4 ^= h4 >>> 16;

  h1 += h2;
  h1 += h3;
  h1 += h4;
  h2 += h1;
  h3 += h1;
  h4 += h1;

  // Combine into 128-bit result (little-endian)
  const result = new Uint8Array(16);
  result[0] = h1 & 0xFF;
  result[1] = (h1 >>> 8) & 0xFF;
  result[2] = (h1 >>> 16) & 0xFF;
  result[3] = (h1 >>> 24) & 0xFF;
  result[4] = h2 & 0xFF;
  result[5] = (h2 >>> 8) & 0xFF;
  result[6] = (h2 >>> 16) & 0xFF;
  result[7] = (h2 >>> 24) & 0xFF;
  result[8] = h3 & 0xFF;
  result[9] = (h3 >>> 8) & 0xFF;
  result[10] = (h3 >>> 16) & 0xFF;
  result[11] = (h3 >>> 24) & 0xFF;
  result[12] = h4 & 0xFF;
  result[13] = (h4 >>> 8) & 0xFF;
  result[14] = (h4 >>> 16) & 0xFF;
  result[15] = (h4 >>> 24) & 0xFF;

  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// HashFunction-compatible wrapper (defaults seed=0)
export const murmur: HashFunction = (input, options) => murmurhash(input, 0, options);
murmur.sync = (input, options) => murmurhash(input, 0, options);