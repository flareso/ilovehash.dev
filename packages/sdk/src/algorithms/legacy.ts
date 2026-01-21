/**
 * Legacy Hash Functions Implementation
 * Based on noble-hashes
 * MIT License
 */

import { bytesToHex, stringToBytes } from '../utils/encoding';
import type { HashOptions } from '../types';

// Placeholder legacy hash implementations
// In a real implementation, these would use proper legacy algorithms

/**
 * SHA-1 hash function (deprecated, avoid for security) (placeholder implementation)
 */
export function sha1(input: string | Uint8Array, options: HashOptions = {}): string {
  // Placeholder - would need full SHA-1 implementation
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  // Simple hash for testing - NOT cryptographically secure
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data[i]) >>> 0;
  }
  const result = new Uint8Array(20);
  for (let i = 0; i < 20; i++) {
    result[i] = (hash >>> (i * 8)) & 0xFF;
  }
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

/**
 * MD5 hash function (deprecated, avoid for security) (placeholder implementation)
 */
export function md5(input: string | Uint8Array, options: HashOptions = {}): string {
  // Placeholder - would need full MD5 implementation
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  // Simple hash for testing - NOT cryptographically secure
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data[i]) >>> 0;
  }
  const result = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    result[i] = (hash >>> (i * 8)) & 0xFF;
  }
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}

/**
 * RIPEMD-160 hash function (placeholder implementation)
 */
export function ripemd160(input: string | Uint8Array, options: HashOptions = {}): string {
  // Placeholder - would need full RIPEMD-160 implementation
  const data = typeof input === 'string' ? stringToBytes(input) : input;
  // Simple hash for testing - NOT cryptographically secure
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data[i]) >>> 0;
  }
  const result = new Uint8Array(20);
  for (let i = 0; i < 20; i++) {
    result[i] = (hash >>> (i * 8)) & 0xFF;
  }
  return options.encoding === 'base64' ? btoa(String.fromCharCode(...result)) : bytesToHex(result);
}