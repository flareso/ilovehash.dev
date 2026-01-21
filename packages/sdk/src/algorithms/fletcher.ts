/**
 * Fletcher Checksum Implementations
 * Based on standard Fletcher algorithm implementations
 */

import { bytesToHex, stringToBytes, numberToBytes } from '../utils/encoding';
import type { HashOptions, HashFunction } from '../types';

// Fletcher-4 (4-bit checksum)
export function fletcher4(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let sum1 = 0;
  let sum2 = 0;
  const modulus = 15; // 2^4 - 1

  for (let i = 0; i < data.length; i++) {
    const nibble1 = data[i] >> 4;
    const nibble2 = data[i] & 0x0F;

    sum1 = (sum1 + nibble1) % modulus;
    sum2 = (sum2 + sum1) % modulus;

    sum1 = (sum1 + nibble2) % modulus;
    sum2 = (sum2 + sum1) % modulus;
  }

  const checksum = (sum2 << 4) | sum1;
  const result = numberToBytes(checksum, 1);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// Fletcher-8 (8-bit checksum)
export function fletcher8(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let sum1 = 0;
  let sum2 = 0;
  const modulus = 255; // 2^8 - 1

  for (let i = 0; i < data.length; i++) {
    sum1 = (sum1 + data[i]) % modulus;
    sum2 = (sum2 + sum1) % modulus;
  }

  const checksum = (sum2 << 8) | sum1;
  const result = numberToBytes(checksum, 2);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// Fletcher-16 (16-bit checksum)
export function fletcher16(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let sum1 = 0;
  let sum2 = 0;
  const modulus = 255; // Usually 255, but some implementations use 256

  for (let i = 0; i < data.length; i++) {
    sum1 = (sum1 + data[i]) % modulus;
    sum2 = (sum2 + sum1) % modulus;
  }

  const checksum = (sum2 << 8) | sum1;
  const result = numberToBytes(checksum, 2);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// Fletcher-32 (32-bit checksum)
export function fletcher32(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let sum1 = 0;
  let sum2 = 0;
  const modulus = 65535; // 2^16 - 1

  // Process data in 16-bit chunks
  for (let i = 0; i < data.length; i += 2) {
    const word = (data[i] << 8) | (data[i + 1] || 0);
    sum1 = (sum1 + word) % modulus;
    sum2 = (sum2 + sum1) % modulus;
  }

  const checksum = (sum2 << 16) | sum1;
  const result = numberToBytes(checksum, 4);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// Fletcher-64 (64-bit checksum)
export function fletcher64(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let sum1 = 0n;
  let sum2 = 0n;
  const modulus = 4294967295n; // 2^32 - 1

  // Process data in 32-bit chunks
  for (let i = 0; i < data.length; i += 4) {
    const word = BigInt((data[i] || 0) << 24) |
                 BigInt((data[i + 1] || 0) << 16) |
                 BigInt((data[i + 2] || 0) << 8) |
                 BigInt(data[i + 3] || 0);
    sum1 = (sum1 + word) % modulus;
    sum2 = (sum2 + sum1) % modulus;
  }

  const checksum = (sum2 << 32n) | sum1;
  const result = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    result[i] = Number((checksum >> BigInt(i * 8)) & 0xFFn);
  }

  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

export const fletcher: HashFunction = fletcher16;