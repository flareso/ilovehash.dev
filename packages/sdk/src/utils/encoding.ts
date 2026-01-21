/**
 * Convert Uint8Array to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to base64 string
 */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Uint8Array
 */
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Convert string to Uint8Array
 */
export function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Convert Uint8Array to string
 */
export function bytesToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

/**
 * Convert number to Uint8Array (big-endian)
 */
export function numberToBytes(num: number, byteLength = 4): Uint8Array {
  const bytes = new Uint8Array(byteLength);
  for (let i = byteLength - 1; i >= 0; i--) {
    bytes[i] = num & 0xff;
    num >>= 8;
  }
  return bytes;
}

/**
 * Convert Uint8Array to number (big-endian)
 */
export function bytesToNumber(bytes: Uint8Array): number {
  let num = 0;
  for (let i = 0; i < bytes.length; i++) {
    num = (num << 8) | bytes[i];
  }
  return num;
}

/**
 * Rotate left operation
 */
export function rotateLeft(value: number, amount: number, bits = 32): number {
  const mask = (1 << bits) - 1;
  return ((value << amount) | (value >>> (bits - amount))) & mask;
}

/**
 * Rotate right operation
 */
export function rotateRight(value: number, amount: number, bits = 32): number {
  const mask = (1 << bits) - 1;
  return ((value >>> amount) | (value << (bits - amount))) & mask;
}

/**
 * XOR operation for Uint8Arrays
 */
export function xorBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(Math.max(a.length, b.length));
  for (let i = 0; i < result.length; i++) {
    result[i] = (a[i] || 0) ^ (b[i] || 0);
  }
  return result;
}

/**
 * Add operation with carry for Uint8Arrays
 */
export function addBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(Math.max(a.length, b.length));
  let carry = 0;
  for (let i = 0; i < result.length; i++) {
    const sum = (a[i] || 0) + (b[i] || 0) + carry;
    result[i] = sum & 0xff;
    carry = sum >>> 8;
  }
  return result;
}

/**
 * Generate random bytes
 */
export function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Generate secure random salt
 */
export function generateSalt(length = 16): Uint8Array {
  return randomBytes(length);
}

/**
 * Constant-time comparison
 */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}