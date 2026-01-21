/**
 * I-Match (lexicon-based duplicate / near-duplicate detection signature).
 *
 * Note: I-Match requires a (precomputed) lexicon built from a corpus.
 * This implementation hashes the lexicon-intersection terms using SHA-1.
 */
import type { HashOptions } from '../types';
import { inputToString, tokenizeWords } from './_similarity';
import { sha1 } from './legacy';

export interface IMatchOptions extends HashOptions {
  /** Primary lexicon terms (required) */
  lexicon: Iterable<string>;
  /** Optional secondary lexicon used when intersection is too small */
  secondaryLexicon?: Iterable<string>;
  /** Minimum intersection size before adding secondary terms (default: 3) */
  minIntersection?: number;
}

function toLowerSet(it: Iterable<string>): Set<string> {
  const s = new Set<string>();
  for (const v of it) s.add(v.toLowerCase());
  return s;
}

/**
 * Compute I-Match signature.
 */
export function imatch(input: string | Uint8Array, options: IMatchOptions): string {
  const str = inputToString(input);
  const minIntersection = options.minIntersection ?? 3;
  if (!Number.isInteger(minIntersection) || minIntersection < 0) throw new Error('minIntersection must be an integer >= 0');

  const lex = toLowerSet(options.lexicon);
  const sec = options.secondaryLexicon ? toLowerSet(options.secondaryLexicon) : undefined;

  const tokens = tokenizeWords(str);
  const uniq = new Set(tokens);

  const picked: string[] = [];
  for (const t of uniq) if (lex.has(t)) picked.push(t);

  if (sec && picked.length < minIntersection) {
    for (const t of uniq) if (sec.has(t) && !lex.has(t)) picked.push(t);
  }

  picked.sort();
  const payload = picked.join('\0');
  return sha1(payload, options);
}

