/**
 * CRC (Cyclic Redundancy Check) Implementations
 * Based on various open source implementations
 */

import { bytesToHex, stringToBytes, numberToBytes } from '../utils/encoding';
import type { HashOptions, HashFunction } from '../types';

// CRC-32 polynomial: 0xEDB88320 (reversed)
const CRC32_POLYNOMIAL = 0xEDB88320;

// Pre-computed CRC-32 lookup table
const CRC32_TABLE: number[] = (() => {
  const table = new Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (crc >>> 1) ^ CRC32_POLYNOMIAL : crc >>> 1;
    }
    table[i] = crc;
  }
  return table;
})();

// CRC-16 polynomial: 0xA001 (reversed)
const CRC16_POLYNOMIAL = 0xA001;

// Pre-computed CRC-16 lookup table
const CRC16_TABLE: number[] = (() => {
  const table = new Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (crc >>> 1) ^ CRC16_POLYNOMIAL : crc >>> 1;
    }
    table[i] = crc;
  }
  return table;
})();

// CRC-8 polynomial: 0x07
const CRC8_POLYNOMIAL = 0x07;

// Pre-computed CRC-8 lookup table
const CRC8_TABLE: number[] = (() => {
  const table = new Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (crc >>> 1) ^ CRC8_POLYNOMIAL : crc >>> 1;
    }
    table[i] = crc;
  }
  return table;
})();

// CRC-64-ECMA polynomial: 0x42F0E1EBA9EA3693
const CRC64_POLYNOMIAL = 0x42F0E1EBA9EA3693n;

// Pre-computed CRC-64 lookup table
const CRC64_TABLE: bigint[] = (() => {
  const table = new Array<bigint>(256);
  for (let i = 0; i < 256; i++) {
    let crc = BigInt(i);
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1n) ? (crc >> 1n) ^ CRC64_POLYNOMIAL : crc >> 1n;
    }
    table[i] = crc;
  }
  return table;
})();

// CRC-32 implementation
export function crc32(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let crc = 0xFFFFFFFF;

  for (let i = 0; i < data.length; i++) {
    crc = CRC32_TABLE[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }

  crc ^= 0xFFFFFFFF; // Final XOR

  const result = numberToBytes(crc, 4);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// CRC-16 implementation
export function crc16(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let crc = 0xFFFF;

  for (let i = 0; i < data.length; i++) {
    crc = CRC16_TABLE[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }

  crc ^= 0xFFFF; // Final XOR (sometimes not applied, depends on variant)

  const result = numberToBytes(crc, 2);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// CRC-8 implementation
export function crc8(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let crc = 0x00;

  for (let i = 0; i < data.length; i++) {
    crc = CRC8_TABLE[(crc ^ data[i]) & 0xFF];
  }

  const result = numberToBytes(crc, 1);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// CRC-64 implementation
export function crc64(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let crc = 0xFFFFFFFFFFFFFFFFn;

  for (let i = 0; i < data.length; i++) {
    crc = CRC64_TABLE[Number((crc ^ BigInt(data[i])) & 0xFFn)] ^ (crc >> 8n);
  }

  crc ^= 0xFFFFFFFFFFFFFFFFn; // Final XOR

  const result = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    result[i] = Number((crc >> BigInt(i * 8)) & 0xFFn);
  }

  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

// Internet Checksum (RFC 1071)
export function internetChecksum(input: string | Uint8Array, options: HashOptions = {}): string {
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  let sum = 0;

  // Process 16-bit words
  for (let i = 0; i < data.length; i += 2) {
    const word = (data[i] << 8) | (data[i + 1] || 0);
    sum += word;

    // Add carry to sum
    if (sum > 0xFFFF) {
      sum = (sum & 0xFFFF) + 1;
    }
  }

  // Take one's complement
  sum = ~sum & 0xFFFF;

  const result = numberToBytes(sum, 2);
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

export const crc: HashFunction = crc32;