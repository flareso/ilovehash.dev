/**
 * Internal Merkle-Damgard hash utils.
 * @module
 */
import { abytes, aexists, aoutput, clean, createView, type Hash } from './utils';

/** Choice: a ? b : c */
export function Chi(a: number, b: number, c: number): number {
  return (a & b) ^ (~a & c);
}

/** Majority function, true if any two inputs is true. */
export function Maj(a: number, b: number, c: number): number {
  return (a & b) ^ (a & c) ^ (b & c);
}

/**
 * Merkle-Damgard hash construction base class.
 * Could be used to create MD5, RIPEMD, SHA1, SHA2.
 */
export abstract class HashMD<T extends HashMD<T>> implements Hash<T> {
  protected abstract process(buf: DataView, offset: number): void;
  protected abstract get(): number[];
  protected abstract set(...args: number[]): void;
  abstract destroy(): void;
  protected abstract roundClean(): void;

  readonly blockLen: number;
  readonly outputLen: number;
  readonly padOffset: number;
  readonly isLE: boolean;

  // For partial updates less than block size
  protected buffer: Uint8Array;
  protected view: DataView;
  protected finished = false;
  protected length = 0;
  protected pos = 0;
  protected destroyed = false;

  constructor(blockLen: number, outputLen: number, padOffset: number, isLE: boolean) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data: Uint8Array): T {
    aexists(this);
    abytes(data);
    const { view, buffer, blockLen } = this;
    data = data.slice();
    for (let pos = 0; pos < data.length; ) {
      const take = Math.min(blockLen - this.pos, data.length - pos);
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
        this.roundClean();
      }
    }
    this.length += data.length;
    return this as unknown as T;
  }
  digestInto(out: Uint8Array): void {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE } = this;
    let { pos } = this;
    // append the bit '1' to the message
    buffer[pos++] = 0b10000000;
    // if the length is currently above offset - 8, we need to fill with zeros then compress
    if (pos > blockLen - 8) {
      buffer.fill(0, pos);
      this.process(view, 0);
      pos = 0;
    }
    // Pad with zeros
    buffer.fill(0, pos);
    // Length in bits must be appended in big-endian
    const len = this.length * 8;
    if (isLE) {
      // LE: little-endian, but we need to write it in big-endian order
      for (let i = 0; i < 8; i++) {
        const byte = (len >>> (i * 8)) & 0xff;
        buffer[blockLen - 1 - i] = byte;
      }
    } else {
      // BE: write length in big-endian
      view.setUint32(blockLen - 8, Math.floor(len / 2 ** 32), false);
      view.setUint32(blockLen - 4, len & 0xffffffff, false);
    }
    this.process(view, 0);
    const s = this.get();
    for (let i = 0; i < s.length; i++) {
      out[i * 4] = (s[i] >>> 24) & 0xff;
      out[i * 4 + 1] = (s[i] >>> 16) & 0xff;
      out[i * 4 + 2] = (s[i] >>> 8) & 0xff;
      out[i * 4 + 3] = s[i] & 0xff;
    }
    this.destroy();
  }
  digest(): Uint8Array {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }

  _cloneInto(to?: T): T {
    to ||= new (this.constructor as any)() as T;
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    (to as any).destroyed = destroyed;
    (to as any).finished = finished;
    (to as any).length = length;
    (to as any).pos = pos;
    if (length % blockLen) (to as any).buffer.set(buffer);
    return to as unknown as T;
  }

  clone(): T {
    return this._cloneInto();
  }
}

// Constants for SHA224
export const SHA224_IV = /* @__PURE__ */ new Uint32Array([
  0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
  0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
]);

// Constants for SHA256
export const SHA256_IV = /* @__PURE__ */ new Uint32Array([
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);

// Constants for SHA384
export const SHA384_IV = /* @__PURE__ */ new Uint32Array([
  0xcbbb9d5d, 0x629a292a, 0x9159015a, 0x152fecd8,
  0x67332667, 0x8eb44a87, 0xdb0c2e0d, 0x47b5481d
]);

// Constants for SHA512
export const SHA512_IV = /* @__PURE__ */ new Uint32Array([
  0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b,
  0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1
]);