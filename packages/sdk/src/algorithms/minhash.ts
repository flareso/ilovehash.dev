/**
 * MinHash (min-wise independent permutations) for estimating Jaccard similarity.
 *
 * Adapted from `Callidon/bloom-filters` MinHash sketch (MIT).
 */
import { bytesToHex } from '../utils/encoding';
import type { HashOptions } from '../types';
import { fnv1a32, inputToString, makeShingles, type ShingleType, xorshift32 } from './_similarity';

export interface MinHashOptions extends HashOptions {
  /** Signature size / number of permutations (default: 128) */
  numPermutations?: number;
  /** RNG seed used to generate hash functions (default: 1) */
  seed?: number;
  /** How to build shingles from input (default: 'word') */
  shingleType?: ShingleType;
  /** Shingle size in tokens/chars (default: 3) */
  shingleSize?: number;
}

function encodeBytes(out: Uint8Array, options: HashOptions): string {
  if (options.encoding === 'base64') return btoa(String.fromCharCode(...out));
  return bytesToHex(out);
}

function signatureToBytesBE(sig: Uint32Array): Uint8Array {
  const buf = new ArrayBuffer(sig.length * 4);
  const view = new DataView(buf);
  for (let i = 0; i < sig.length; i++) view.setUint32(i * 4, sig[i]!, false);
  return new Uint8Array(buf);
}

function buildHashFunctions(k: number, seed: number): { a: Uint32Array; b: Uint32Array } {
  const next = xorshift32(seed);
  const a = new Uint32Array(k);
  const b = new Uint32Array(k);
  for (let i = 0; i < k; i++) {
    // Ensure 'a' is odd to avoid losing low bits under multiplication.
    a[i] = (next() | 1) >>> 0;
    b[i] = next() >>> 0;
  }
  return { a, b };
}

/**
 * Compute MinHash signature as a Uint32Array.
 */
export function minhashSignature(input: string | Uint8Array, options: MinHashOptions = {}): Uint32Array {
  const str = inputToString(input);
  const shingleType = options.shingleType ?? 'word';
  const shingleSize = options.shingleSize ?? 3;
  const k = options.numPermutations ?? 128;
  const seed = options.seed ?? 1;
  if (!Number.isInteger(k) || k <= 0) throw new Error('numPermutations must be a positive integer');

  const shingles = makeShingles(str, shingleType, shingleSize);
  const sig = new Uint32Array(k);
  sig.fill(0xffffffff);
  const { a, b } = buildHashFunctions(k, seed);

  for (let s = 0; s < shingles.length; s++) {
    const x = fnv1a32(shingles[s]!);
    for (let i = 0; i < k; i++) {
      const h = (Math.imul(a[i]!, x) + b[i]!) >>> 0;
      if (h < sig[i]!) sig[i] = h;
    }
  }
  return sig;
}

/**
 * Compute MinHash digest (signature encoded as bytes).
 */
export function minhash(input: string | Uint8Array, options: MinHashOptions = {}): string {
  const sig = minhashSignature(input, options);
  return encodeBytes(signatureToBytesBE(sig), options);
}

/**
 * Estimate Jaccard similarity between two MinHash signatures.
 * Both signatures must have the same length and be produced with the same parameters.
 */
export function minhashJaccard(sigA: Uint32Array, sigB: Uint32Array): number {
  if (sigA.length !== sigB.length) throw new Error('MinHash signatures must have the same length');
  if (sigA.length === 0) throw new Error('MinHash signature length must be > 0');
  let eq = 0;
  for (let i = 0; i < sigA.length; i++) if (sigA[i] === sigB[i]) eq++;
  return eq / sigA.length;
}

