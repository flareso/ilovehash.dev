/**
 * FNV (Fowler–Noll–Vo) Hash Implementation
 * Based on standard FNV-1 and FNV-1a algorithms
 */

import { bytesToHex, stringToBytes, numberToBytes } from '../utils/encoding';
import type { HashOptions, HashFunction } from '../types';

// FNV primes and offsets
const FNV_32_PRIME = 0x01000193;
const FNV_32_OFFSET = 0x811C9DC5;

const FNV_64_PRIME = 0x00000100000001B3n;
const FNV_64_OFFSET = 0xCBF29CE484222325n;

// FNV-1 32-bit
export function fnv1(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let hash = FNV_32_OFFSET;

  for (let i = 0; i < data.length; i++) {
    hash *= FNV_32_PRIME;
    hash ^= data[i];
    hash >>>= 0; // Ensure unsigned 32-bit
  }

  const result = numberToBytes(hash, 4);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// FNV-1a 32-bit
export function fnv1a(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let hash = FNV_32_OFFSET;

  for (let i = 0; i < data.length; i++) {
    hash ^= data[i];
    hash *= FNV_32_PRIME;
    hash >>>= 0; // Ensure unsigned 32-bit
  }

  const result = numberToBytes(hash, 4);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// FNV-1 64-bit
export function fnv1_64(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let hash = FNV_64_OFFSET;

  for (let i = 0; i < data.length; i++) {
    hash *= FNV_64_PRIME;
    hash ^= BigInt(data[i]);
  }

  const result = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    result[i] = Number((hash >> BigInt(i * 8)) & 0xFFn);
  }

  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// FNV-1a 64-bit
export function fnv1a_64(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let hash = FNV_64_OFFSET;

  for (let i = 0; i < data.length; i++) {
    hash ^= BigInt(data[i]);
    hash *= FNV_64_PRIME;
  }

  const result = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    result[i] = Number((hash >> BigInt(i * 8)) & 0xFFn);
  }

  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

export const fnv: HashFunction = fnv1a;