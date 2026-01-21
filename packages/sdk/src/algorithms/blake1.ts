/**
 * Blake1 legacy hash function, one of SHA3 proposals.
 * Rarely used. Check out blake2 or blake3 instead.
 * https://www.aumasson.jp/blake/blake.pdf
 *
 * In the best case, there are 0 allocations.
 *
 * Differences from blake2:
 *
 * - BE instead of LE
 * - Paddings, similar to MD5, RIPEMD, SHA1, SHA2, but:
 *     - length flag is located before actual length
 *     - padding block is compressed differently (no lengths)
 * Instead of msg[sigma[k]], we have `msg[sigma[k]] ^ constants[sigma[k-1]]`
 * (-1 for g1, g2 without -1)
 * - Salt is XOR-ed into constants instead of state
 * - Salt is XOR-ed with output in `compress`
 * - Additional rows (+64 bytes) in SIGMA for new rounds
 * - Different round count:
 *     - 14 / 10 rounds in blake256 / blake2s
 *     - 16 / 12 rounds in blake512 / blake2b
 * - blake512: G1b: rotr 24 -> 25, G2b: rotr 63 -> 11
 * - Salt is XOR-ed into constants instead of state
 * - Salt is XOR-ed with output in `compress`
 * - Additional rows (+64 bytes) in SIGMA for new rounds
 * - Different round count:
 *     - 14 / 10 rounds in blake256 / blake2s
 *     - 16 / 12 rounds in blake512 / blake2b
 * - blake512: G1b: rotr 24 -> 25, G2b: rotr 63 -> 11
 */

import { bytesToHex, stringToBytes } from '../utils/encoding';
import type { HashOptions } from '../types';

// BlakeOpts interface for salt support
export interface BlakeOpts extends HashOptions {
  salt?: Uint8Array;
}

// Import noble-hashes blake1 functions
import {
  blake224 as nobleBlake224,
  blake256 as nobleBlake256,
  blake384 as nobleBlake384,
  blake512 as nobleBlake512,
} from './_noble-blake1';

/**
 * Compute a BLAKE1-224 digest
 */
export function blake224(input: string | Uint8Array, options: BlakeOpts = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  const salt = options.salt;
  const result = nobleBlake224(data, salt ? { salt } : {});
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

/**
 * Compute a BLAKE1-256 digest
 */
export function blake256(input: string | Uint8Array, options: BlakeOpts = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  const salt = options.salt;
  const result = nobleBlake256(data, salt ? { salt } : {});
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

/**
 * Compute a BLAKE1-384 digest
 */
export function blake384(input: string | Uint8Array, options: BlakeOpts = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  const salt = options.salt;
  const result = nobleBlake384(data, salt ? { salt } : {});
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

/**
 * Compute a BLAKE1-512 digest
 */
export function blake512(input: string | Uint8Array, options: BlakeOpts = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  const salt = options.salt;
  const result = nobleBlake512(data, salt ? { salt } : {});
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}