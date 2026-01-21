/**
 * b-bit MinHash (store only the lowest b bits of each MinHash value).
 *
 * Based on b-bit minwise hashing (Li & König).
 */
import { bytesToHex } from '../utils/encoding';
import type { HashOptions } from '../types';
import type { MinHashOptions } from './minhash';
import { minhashSignature } from './minhash';

export interface BBitMinHashOptions extends MinHashOptions {
  /** Number of lowest bits to keep per permutation (default: 8) */
  b?: number;
}

function encodeBytes(out: Uint8Array, options: HashOptions): string {
  if (options.encoding === 'base64') return btoa(String.fromCharCode(...out));
  return bytesToHex(out);
}

function maskForBits(b: number): number {
  if (!Number.isInteger(b) || b <= 0 || b > 31) throw new Error('b must be an integer in [1, 31]');
  return (1 << b) - 1;
}

function packBbits(values: Uint32Array, b: number): Uint8Array {
  const totalBits = values.length * b;
  const out = new Uint8Array(Math.ceil(totalBits / 8));
  const mask = maskForBits(b) >>> 0;
  for (let i = 0; i < values.length; i++) {
    const v = (values[i]! & mask) >>> 0;
    const base = i * b;
    for (let bit = 0; bit < b; bit++) {
      if ((v >>> bit) & 1) {
        const idx = base + bit;
        out[idx >> 3] |= 1 << (idx & 7);
      }
    }
  }
  return out;
}

/**
 * Compute the truncated b-bit signature (each entry is in [0, 2^b)).
 */
export function bbitMinhashSignature(input: string | Uint8Array, options: BBitMinHashOptions = {}): Uint32Array {
  const b = options.b ?? 8;
  const mask = maskForBits(b) >>> 0;
  const sig = minhashSignature(input, options);
  for (let i = 0; i < sig.length; i++) sig[i] = (sig[i]! & mask) >>> 0;
  return sig;
}

/**
 * Compute b-bit MinHash digest (packed bits).
 */
export function bbitMinhash(input: string | Uint8Array, options: BBitMinHashOptions = {}): string {
  const b = options.b ?? 8;
  const sig = bbitMinhashSignature(input, options);
  return encodeBytes(packBbits(sig, b), options);
}

/**
 * Count equal entries between two b-bit signatures.
 */
export function bbitMinhashEqualFraction(sigA: Uint32Array, sigB: Uint32Array): number {
  if (sigA.length !== sigB.length) throw new Error('b-bit MinHash signatures must have the same length');
  if (sigA.length === 0) throw new Error('b-bit MinHash signature length must be > 0');
  let eq = 0;
  for (let i = 0; i < sigA.length; i++) if (sigA[i] === sigB[i]) eq++;
  return eq / sigA.length;
}

/**
 * Estimate Jaccard similarity from b-bit signatures using the standard correction:
 *   R ≈ (E - 2^{-b}) / (1 - 2^{-b})
 * where E is the fraction of equal b-bit entries.
 */
export function bbitMinhashJaccardEstimate(sigA: Uint32Array, sigB: Uint32Array, b: number): number {
  const E = bbitMinhashEqualFraction(sigA, sigB);
  const p = 1 / 2 ** b;
  const denom = 1 - p;
  if (denom <= 0) return 0;
  const est = (E - p) / denom;
  // Clamp to [0, 1] for robustness.
  return est < 0 ? 0 : est > 1 ? 1 : est;
}

