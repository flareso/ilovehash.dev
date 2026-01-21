/**
 * Utilities for hex, bytes, CSPRNG.
 * @module
 */
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
export function isBytes(a: unknown): a is Uint8Array {
  return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array');
}

/** Asserts something is positive integer. */
export function anumber(n: number, title: string = ''): void {
  if (!Number.isSafeInteger(n) || n < 0) {
    const prefix = title && `"${title}" `;
    throw new Error(`${prefix}expected integer >= 0, got ${n}`);
  }
}

/** Asserts something is Uint8Array. */
export function abytes(value: Uint8Array, length?: number, title: string = ''): Uint8Array {
  const bytes = isBytes(value);
  const len = value?.length;
  const needsLen = length !== undefined;
  if (!bytes || (needsLen && len !== length)) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : '';
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + 'expected Uint8Array' + ofLen + ', got ' + got);
  }
  return value;
}

/** Asserts a hash instance has not been destroyed / finished */
export function aexists(instance: any, checkFinished = true): void {
  if (instance.destroyed) throw new Error('Hash instance has been destroyed');
  if (checkFinished && instance.finished) throw new Error('Hash#digest() has already been called');
}

/** Asserts output is properly-sized byte array */
export function aoutput(out: any, instance: any): void {
  abytes(out, undefined, 'digestInto() output');
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error('"digestInto() output" expected to be of length >=' + min);
  }
}

/** Generic type encompassing 8/16/32-byte arrays - but not 64-byte. */
// prettier-ignore
export type TypedArray = Int8Array | Uint8ClampedArray | Uint8Array |
  Uint16Array | Int16Array | Uint32Array | Int32Array;

/** Cast u8 / u16 / u32 to u8. */
export function u8(arr: TypedArray): Uint8Array {
  return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}

/** Cast u8 / u16 / u32 to u32. */
export function u32(arr: TypedArray): Uint32Array {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}

/** Zeroize a byte array. Warning: JS provides no guarantees. */
export function clean(...arrays: TypedArray[]): void {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}

/** Create DataView of an array for easy byte-level manipulation. */
export function createView(arr: TypedArray): DataView {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}

/** The rotate right (circular right shift) operation for uint32 */
export function rotr(word: number, shift: number): number {
  return (word << (32 - shift)) | (word >>> shift);
}

/** The rotate left (circular left shift) operation for uint32 */
export function rotl(word: number, shift: number): number {
  return (word << shift) | ((word >>> (32 - shift)) >>> 0);
}

/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
export const isLE: boolean = /* @__PURE__ */ (() =>
  new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44)();

/** The byte swap operation for uint32 */
export function byteSwap(word: number): number {
  return (
    ((word << 24) & 0xff000000) |
    ((word << 8) & 0x00ff0000) |
    ((word >>> 8) & 0x0000ff00) |
    ((word >>> 24) & 0x000000ff)
  );
}

/** Convert u32 array to hex string */
export function u32ArrToHex(arr: Uint32Array): string {
  const hex: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    hex.push(arr[i].toString(16).padStart(8, '0'));
  }
  return hex.join('');
}

/** Convert hex string to u32 array */
export function hexToU32Arr(hex: string): Uint32Array {
  if (hex.length % 8 !== 0) throw new Error('Invalid hex length');
  const arr = new Uint32Array(hex.length / 8);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.slice(i * 8, (i + 1) * 8), 16);
  }
  return arr;
}

/** Hash interface */
export interface Hash<T> {
  update(data: Uint8Array): T;
  digestInto(out: Uint8Array): void;
  digest(): Uint8Array;
  clone(): T;
  destroy(): void;
  readonly blockLen: number;
  readonly outputLen: number;
}

/** CHash interface */
export interface CHash<T, O = {}> {
  (message: Uint8Array, opts?: O): Uint8Array;
  create(opts?: O): T;
  outputLen: number;
  blockLen: number;
}

/** Create hasher function */
export function createHasher<T extends Hash<T>, O = {}>(
  hashCons: (opts?: O) => T
): CHash<T, O> {
  const hash = (message: Uint8Array, opts?: O): Uint8Array => hashCons(opts).update(message).digest();
  const create = (opts?: O): T => hashCons(opts);
  hash.create = create;
  hash.blockLen = hashCons().blockLen;
  hash.outputLen = hashCons().outputLen;
  return hash;
}