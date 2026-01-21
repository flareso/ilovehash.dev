/**
 * Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
 * @todo re-check https://issues.chromium.org/issues/42212588
 * @module
 */
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);

function fromBig(
  n: bigint,
  le = false
): {
  h: number;
  l: number;
} {
  if (le) return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
  return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}

function split(lst: bigint[], le = false): Uint32Array[] {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}

const toBig = (h: number, l: number): bigint => (BigInt(h >>> 0) << _32n) | BigInt(l >>> 0);
// for Shift in [0, 32)
const shrSH = (h: number, _l: number, s: number): number => h >>> s;
const shrSL = (h: number, l: number, s: number): number => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in [1, 32)
const rotrSH = (h: number, l: number, s: number): number => (h >>> s) | (l << (32 - s));
const rotrSL = (h: number, l: number, s: number): number => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH = (h: number, l: number, s: number): number => (h << (64 - s)) | (l >>> (s - 32));
const rotrBL = (h: number, l: number, s: number): number => (h >>> (s - 32)) | (l << (64 - s));
// Right rotate for shift===32 (just swaps l&h)
const rotr32H = (_h: number, l: number): number => l;
const rotr32L = (h: number, _l: number): number => h;
// Left rotate for Shift in [1, 32)
const rotlSH = (h: number, l: number, s: number): number => (h << s) | (l >>> (32 - s));
const rotlSL = (h: number, l: number, s: number): number => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h: number, l: number, s: number): number => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h: number, l: number, s: number): number => (h << (s - 32)) | (l >>> (64 - s));

// Addition
const add = (ah: number, al: number, bh: number, bl: number): { h: number; l: number } => {
  const l = (al + bl) | 0;
  const h = (ah + bh + ((al + bl) >>> 32)) | 0;
  return { h, l };
};

const add3L = (al: number, bl: number, cl: number): number => (al + bl + cl) | 0;
const add3H = (ll: number, ah: number, bh: number, ch: number): number =>
  (ah + bh + ch + (ll >>> 32)) | 0;

const add4L = (al: number, bl: number, cl: number, dl: number): number => (al + bl + cl + dl) | 0;
const add4H = (ll: number, lh: number, ah: number, bh: number, ch: number, dh: number): number =>
  (ah + bh + ch + dh + (ll >>> 32) + ((lh + ll) >>> 32)) | 0;

// Modular multiplication
const mul = (x: number, y: number): { h: number; l: number } => {
  const xh = x >>> 16;
  const xl = x & 0xffff;
  const yh = y >>> 16;
  const yl = y & 0xffff;
  const xy_ll = xl * yl;
  const xy_lh = (xy_ll >>> 16) + xl * yh;
  const xy_hl = xy_lh >>> 16;
  const xy_hh = xh * yh + xy_hl;
  return {
    h: xy_hh >>> 0,
    l: ((xy_lh << 16) | (xy_ll & 0xffff)) >>> 0,
  };
};

export { fromBig, split, toBig, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, rotr32H, rotr32L, rotlSH, rotlSL, rotlBH, rotlBL, add, add3L, add3H, add4L, add4H, mul };