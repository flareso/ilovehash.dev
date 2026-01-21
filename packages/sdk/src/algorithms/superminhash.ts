/**
 * SuperMinHash (Ertl 2017) for estimating Jaccard similarity.
 *
 * Implements Algorithm 3 (transformed, unoptimized) from:
 * "SuperMinHash — A New Minwise Hashing Algorithm for Jaccard Similarity Estimation"
 * by Otmar Ertl.
 */
import { bytesToHex } from '../utils/encoding';
import type { HashOptions } from '../types';
import { fnv1a32, inputToString, makeShingles, type ShingleType, xorshift32 } from './_similarity';

export interface SuperMinHashOptions extends HashOptions {
  /** Signature size m (default: 128) */
  signatureSize?: number;
  /** Global seed XORed into per-element RNG seed (default: 1) */
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

function float32SignatureToBytesBE(sig: Float32Array): Uint8Array {
  const buf = new ArrayBuffer(sig.length * 4);
  const view = new DataView(buf);
  for (let i = 0; i < sig.length; i++) view.setFloat32(i * 4, sig[i]!, false);
  return new Uint8Array(buf);
}

function superminhashFromValues(values: Iterable<number>, m: number, seed: number): Float64Array {
  const h = new Float64Array(m);
  h.fill(Number.POSITIVE_INFINITY);
  const p = new Int32Array(m);
  const q = new Int32Array(m);
  q.fill(-1);

  let i = 0;
  for (const d of values) {
    const next = xorshift32((d ^ seed) >>> 0);
    for (let j = 0; j < m; j++) {
      const r = next() / 4294967296; // [0, 1)
      const k = j + (next() % (m - j));

      if (q[j] !== i) {
        q[j] = i;
        p[j] = j;
      }
      if (q[k] !== i) {
        q[k] = i;
        p[k] = k;
      }
      // swap(p[j], p[k])
      const tmp = p[j];
      p[j] = p[k];
      p[k] = tmp;

      const idx = p[j]!;
      const v = j + r;
      if (v < h[idx]!) h[idx] = v;
    }
    i++;
  }
  return h;
}

/**
 * Compute SuperMinHash signature as Float64Array (values in [0, m) or +∞ for empty input).
 */
export function superminhashSignature(input: string | Uint8Array, options: SuperMinHashOptions = {}): Float64Array {
  const str = inputToString(input);
  const shingleType = options.shingleType ?? 'word';
  const shingleSize = options.shingleSize ?? 3;
  const m = options.signatureSize ?? 128;
  const seed = options.seed ?? 1;
  if (!Number.isInteger(m) || m <= 0) throw new Error('signatureSize must be a positive integer');

  const shingles = makeShingles(str, shingleType, shingleSize);
  const uniq = new Set<number>();
  for (let i = 0; i < shingles.length; i++) uniq.add(fnv1a32(shingles[i]!));
  return superminhashFromValues(uniq, m, seed);
}

/**
 * Compute SuperMinHash digest (Float32 signature encoded as bytes).
 */
export function superminhash(input: string | Uint8Array, options: SuperMinHashOptions = {}): string {
  const sig64 = superminhashSignature(input, options);
  const sig32 = new Float32Array(sig64.length);
  for (let i = 0; i < sig64.length; i++) sig32[i] = sig64[i]!;
  return encodeBytes(float32SignatureToBytesBE(sig32), options);
}

/**
 * Estimate Jaccard similarity between two SuperMinHash signatures.
 * Both signatures must have the same length and be produced with the same parameters.
 */
export function superminhashJaccard(sigA: Float64Array, sigB: Float64Array): number {
  if (sigA.length !== sigB.length) throw new Error('SuperMinHash signatures must have the same length');
  if (sigA.length === 0) throw new Error('SuperMinHash signature length must be > 0');
  let eq = 0;
  for (let i = 0; i < sigA.length; i++) if (sigA[i] === sigB[i]) eq++;
  return eq / sigA.length;
}

