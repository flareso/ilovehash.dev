/**
 * SimHash (Charikar-style fingerprint) for near-duplicate detection.
 *
 * Ported/adapted from `xblanc33/simhash-js` (MIT).
 * This implementation produces a 32-bit SimHash.
 */
import { bytesToHex, bytesToString } from '../utils/encoding';
import type { HashOptions } from '../types';

export interface SimHashOptions extends HashOptions {
  /** Tokenize into fixed-size character shingles (default: 4) */
  kshingles?: number;
  /** Use up to N features (default: 128) */
  maxFeatures?: number;
}

function encodeU32BE(x: number, options: HashOptions): string {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setUint32(0, x >>> 0, false);
  const out = new Uint8Array(buf);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...out)) : bytesToHex(out);
}

// Jenkins lookup3 (Bob Jenkins) as used by simhash-js.
function rot(x: number, k: number): number {
  return (x << k) | (x >>> (32 - k));
}

function mix(a: number, b: number, c: number): [number, number, number] {
  a -= c;
  a ^= rot(c, 4);
  c += b;
  b -= a;
  b ^= rot(a, 6);
  a += c;
  c -= b;
  c ^= rot(b, 8);
  b += a;
  a -= c;
  a ^= rot(c, 16);
  c += b;
  b -= a;
  b ^= rot(a, 19);
  a += c;
  c -= b;
  c ^= rot(b, 4);
  b += a;
  return [a, b, c];
}

function finalMix(a: number, b: number, c: number): [number, number, number] {
  c ^= b;
  c -= rot(b, 14);
  a ^= c;
  a -= rot(c, 11);
  b ^= a;
  b -= rot(a, 25);
  c ^= b;
  c -= rot(b, 16);
  a ^= c;
  a -= rot(c, 4);
  b ^= a;
  b -= rot(a, 14);
  c ^= b;
  c -= rot(b, 24);
  return [a, b, c];
}

function lookup3(str: string, pc = 0, pb = 0): number {
  let length = str.length;
  let a = (0xdeadbeef + length + pc) | 0;
  let b = a;
  let c = (a + pb) | 0;

  let offset = 0;
  while (length > 12) {
    a = (a + (str.charCodeAt(offset + 0) & 0xff)) | 0;
    a = (a + ((str.charCodeAt(offset + 1) & 0xff) << 8)) | 0;
    a = (a + ((str.charCodeAt(offset + 2) & 0xff) << 16)) | 0;
    a = (a + ((str.charCodeAt(offset + 3) & 0xff) << 24)) | 0;

    b = (b + (str.charCodeAt(offset + 4) & 0xff)) | 0;
    b = (b + ((str.charCodeAt(offset + 5) & 0xff) << 8)) | 0;
    b = (b + ((str.charCodeAt(offset + 6) & 0xff) << 16)) | 0;
    b = (b + ((str.charCodeAt(offset + 7) & 0xff) << 24)) | 0;

    c = (c + (str.charCodeAt(offset + 8) & 0xff)) | 0;
    c = (c + ((str.charCodeAt(offset + 9) & 0xff) << 8)) | 0;
    c = (c + ((str.charCodeAt(offset + 10) & 0xff) << 16)) | 0;
    c = (c + ((str.charCodeAt(offset + 11) & 0xff) << 24)) | 0;

    [a, b, c] = mix(a, b, c);
    length -= 12;
    offset += 12;
  }

  switch (length) {
    case 12:
      c = (c + ((str.charCodeAt(offset + 11) & 0xff) << 24)) | 0;
    // falls through
    case 11:
      c = (c + ((str.charCodeAt(offset + 10) & 0xff) << 16)) | 0;
    // falls through
    case 10:
      c = (c + ((str.charCodeAt(offset + 9) & 0xff) << 8)) | 0;
    // falls through
    case 9:
      c = (c + (str.charCodeAt(offset + 8) & 0xff)) | 0;
    // falls through
    case 8:
      b = (b + ((str.charCodeAt(offset + 7) & 0xff) << 24)) | 0;
    // falls through
    case 7:
      b = (b + ((str.charCodeAt(offset + 6) & 0xff) << 16)) | 0;
    // falls through
    case 6:
      b = (b + ((str.charCodeAt(offset + 5) & 0xff) << 8)) | 0;
    // falls through
    case 5:
      b = (b + (str.charCodeAt(offset + 4) & 0xff)) | 0;
    // falls through
    case 4:
      a = (a + ((str.charCodeAt(offset + 3) & 0xff) << 24)) | 0;
    // falls through
    case 3:
      a = (a + ((str.charCodeAt(offset + 2) & 0xff) << 16)) | 0;
    // falls through
    case 2:
      a = (a + ((str.charCodeAt(offset + 1) & 0xff) << 8)) | 0;
    // falls through
    case 1:
      a = (a + (str.charCodeAt(offset + 0) & 0xff)) | 0;
      break;
    case 0:
      return c >>> 0;
  }

  [a, b, c] = finalMix(a, b, c);
  return c >>> 0;
}

function tokenize(input: string, kshingles: number): string[] {
  if (kshingles <= 0) throw new Error('kshingles must be > 0');
  const size = input.length;
  if (size <= kshingles) return [input];
  const out: string[] = [];
  for (let i = 0; i < size; i += kshingles) out.push(i + kshingles < size ? input.slice(i, i + kshingles) : input.slice(i));
  return out;
}

/**
 * Compute a 32-bit SimHash and return it as a hex/base64 digest.
 */
export function simhash(input: string | Uint8Array, options: SimHashOptions = {}): string {
  const str = typeof input === 'string' ? input : bytesToString(input);
  const kshingles = options.kshingles ?? 4;
  const maxFeatures = options.maxFeatures ?? 128;

  const tokens = tokenize(str, kshingles);
  const feats = new Uint32Array(tokens.length);
  for (let i = 0; i < tokens.length; i++) feats[i] = lookup3(tokens[i]!, 0, 0);

  // Keep up to maxFeatures smallest hashes.
  const arr = Array.from(feats);
  arr.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const use = arr.length > maxFeatures ? arr.slice(0, maxFeatures) : arr;

  let out = 0;
  for (let bit = 0; bit < 32; bit++) {
    const mask = 1 << bit;
    let weight = 0;
    for (let i = 0; i < use.length; i++) weight += (use[i]! & mask) !== 0 ? 1 : -1;
    if (weight > 0) out |= mask;
  }
  return encodeU32BE(out >>> 0, options);
}

/**
 * Compute Hamming distance between two 32-bit simhashes (hex digests or numbers).
 */
export function simhashHammingDistance(a: string | number, b: string | number): number {
  const x = typeof a === 'string' ? (parseInt(a, 16) >>> 0) : (a >>> 0);
  const y = typeof b === 'string' ? (parseInt(b, 16) >>> 0) : (b >>> 0);
  let v = (x ^ y) >>> 0;
  let dist = 0;
  while (v) {
    dist++;
    v &= v - 1;
  }
  return dist;
}

/**
 * Similarity score in [0,1] based on normalized Hamming distance for 32-bit simhashes.
 */
export function simhashSimilarity(a: string | number, b: string | number): number {
  return 1 - simhashHammingDistance(a, b) / 32;
}

