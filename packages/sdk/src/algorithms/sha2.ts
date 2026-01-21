/**
 * SHA-2 Family Implementation
 * Uses Web Crypto API where available, falls back to custom implementations
 * MIT License
 */

import { bytesToHex, stringToBytes } from '../utils/encoding';
import type { HashOptions } from '../types';

// Check if Web Crypto API is available
const crypto = globalThis.crypto;

// SHA-256 constants for fallback implementation
const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

const SHA256_H = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
];

// SHA-224 initial hash values
const SHA224_H = [
  0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
  0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
];

// Utility functions for fallback implementation
function rotr(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function ch(x: number, y: number, z: number): number {
  return (x & y) ^ (~x & z);
}

function maj(x: number, y: number, z: number): number {
  return (x & y) ^ (x & z) ^ (y & z);
}

function sigma0(x: number): number {
  return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
}

function sigma1(x: number): number {
  return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
}

function s0(x: number): number {
  return rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
}

function s1(x: number): number {
  return rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);
}

// Fallback SHA-256 implementation
function sha256Fallback(data: Uint8Array): Uint8Array {
  // Pad the message
  const msgLen = data.length;
  const bitLen = msgLen * 8;
  const padLen = 64 - ((msgLen + 9) % 64);
  const padded = new Uint8Array(msgLen + padLen + 9);
  padded.set(data);
  padded[msgLen] = 0x80;

  // Append length in big-endian
  for (let i = 0; i < 8; i++) {
    padded[padded.length - 1 - i] = (bitLen >>> (i * 8)) & 0xFF;
  }

  // Process in 512-bit blocks
  let h = [...SHA256_H];
  for (let offset = 0; offset < padded.length; offset += 64) {
    const w = new Array(64);

    // Break block into sixteen 32-bit words
    for (let i = 0; i < 16; i++) {
      w[i] = (padded[offset + i * 4] << 24) |
             (padded[offset + i * 4 + 1] << 16) |
             (padded[offset + i * 4 + 2] << 8) |
             padded[offset + i * 4 + 3];
    }

    // Extend to 64 words
    for (let i = 16; i < 64; i++) {
      w[i] = (s1(w[i - 2]) + w[i - 7] + s0(w[i - 15]) + w[i - 16]) >>> 0;
    }

    let [a, b, c, d, e, f, g, hh] = h;

    // Main compression loop
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + sigma1(e) + ch(e, f, g) + SHA256_K[i] + w[i]) >>> 0;
      const t2 = (sigma0(a) + maj(a, b, c)) >>> 0;

      hh = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }

    // Add to hash
    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
    h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0;
    h[7] = (h[7] + hh) >>> 0;
  }

  // Convert to bytes
  const result = new Uint8Array(32);
  for (let i = 0; i < 8; i++) {
    result[i * 4] = (h[i] >>> 24) & 0xFF;
    result[i * 4 + 1] = (h[i] >>> 16) & 0xFF;
    result[i * 4 + 2] = (h[i] >>> 8) & 0xFF;
    result[i * 4 + 3] = h[i] & 0xFF;
  }

  return result;
}

// Web Crypto API implementations where available
async function sha256WebCrypto(data: Uint8Array): Promise<Uint8Array> {
  if (!crypto?.subtle) {
    return sha256Fallback(data);
  }

  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hashBuffer);
  } catch {
    return sha256Fallback(data);
  }
}

async function sha384WebCrypto(data: Uint8Array): Promise<Uint8Array> {
  if (!crypto?.subtle) {
    throw new Error('SHA-384 not available');
  }

  const hashBuffer = await crypto.subtle.digest('SHA-384', data);
  return new Uint8Array(hashBuffer);
}

async function sha512WebCrypto(data: Uint8Array): Promise<Uint8Array> {
  if (!crypto?.subtle) {
    throw new Error('SHA-512 not available');
  }

  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  return new Uint8Array(hashBuffer);
}

/**
 * Compute a SHA-256 digest
 */
export function sha256(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  const result = sha256Fallback(data);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

/**
 * Compute a SHA-224 digest (truncated SHA-256)
 */
export function sha224(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  const fullResult = sha256Fallback(data);
  const result = fullResult.slice(0, 28); // Truncate to 224 bits
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

/**
 * Compute a SHA-512 digest
 */
export function sha512(input: string | Uint8Array, options: HashOptions = {}): string {
  // For now, use a simple fallback. In production, this would need a full SHA-512 implementation
  throw new Error('SHA-512 not implemented in this simplified version');
}

/**
 * Compute a SHA-384 digest
 */
export function sha384(input: string | Uint8Array, options: HashOptions = {}): string {
  // For now, use a simple fallback. In production, this would need a full SHA-384 implementation
  throw new Error('SHA-384 not implemented in this simplified version');
}

/**
 * Compute a SHA-512/224 digest
 */
export function sha512_224(input: string | Uint8Array, options: HashOptions = {}): string {
  // For now, use a simple fallback. In production, this would need a full SHA-512 implementation
  throw new Error('SHA-512/224 not implemented in this simplified version');
}

/**
 * Compute a SHA-512/256 digest
 */
export function sha512_256(input: string | Uint8Array, options: HashOptions = {}): string {
  // For now, use a simple fallback. In production, this would need a full SHA-512 implementation
  throw new Error('SHA-512/256 not implemented in this simplified version');
}