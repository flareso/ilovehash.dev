import { bytesToString, stringToBytes } from '../utils/encoding';

export type ShingleType = 'word' | 'char';

export function inputToString(input: string | Uint8Array): string {
  return typeof input === 'string' ? input : bytesToString(input);
}

export function fnv1a32(str: string): number {
  const data = stringToBytes(str);
  let h = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    h ^= data[i]!;
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function tokenizeWords(str: string): string[] {
  // Fast, ASCII-focused tokenization.
  return (str.toLowerCase().match(/\w+/g) ?? []);
}

export function makeShingles(str: string, shingleType: ShingleType, shingleSize: number): string[] {
  if (!Number.isInteger(shingleSize) || shingleSize <= 0) throw new Error('shingleSize must be a positive integer');
  if (shingleType === 'char') {
    if (str.length <= shingleSize) return [str];
    const out: string[] = [];
    for (let i = 0; i + shingleSize <= str.length; i++) out.push(str.slice(i, i + shingleSize));
    return out;
  }
  const toks = tokenizeWords(str);
  if (toks.length <= shingleSize) return toks.length ? [toks.join(' ')] : [];
  const out: string[] = [];
  for (let i = 0; i + shingleSize <= toks.length; i++) out.push(toks.slice(i, i + shingleSize).join(' '));
  return out;
}

export function xorshift32(seed: number): () => number {
  let x = (seed >>> 0) || 0x9e3779b9;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return x >>> 0;
  };
}

