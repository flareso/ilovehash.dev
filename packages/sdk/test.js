// Quick test to verify the SDK builds and exports work
import { sha256, sha3_256, keccak_256, blake3, crc32, xxhash32, sha1, md5, ripemd160 } from './dist/index.mjs';
import { hmac } from './dist/algorithms/hmac.mjs';
import { hkdf } from './dist/algorithms/hkdf.mjs';
import { pbkdf2 } from './dist/algorithms/pbkdf2.mjs';

console.log('Testing @ilovehash/sdk...');

// Test SHA-256
const sha256Result = sha256('hello world');
console.log('SHA-256:', sha256Result);

// Test SHA-3
const sha3Result = sha3_256('hello world');
console.log('SHA-3-256:', sha3Result);

// Test Keccak
const keccakResult = keccak_256('hello world');
console.log('Keccak-256:', keccakResult);

// Test BLAKE3
const blake3Result = blake3('hello world');
console.log('BLAKE3:', blake3Result);

// Test CRC32
const crcResult = crc32('hello world');
console.log('CRC32:', crcResult);

// Test xxHash
const xxhashResult = xxhash32('hello world');
console.log('xxHash32:', xxhashResult);

// Test legacy hashes
const sha1Result = sha1('hello world');
console.log('SHA-1:', sha1Result);

const md5Result = md5('hello world');
console.log('MD5:', md5Result);

const ripemd160Result = ripemd160('hello world');
console.log('RIPEMD160:', ripemd160Result);

// Test HMAC
const hmacResult = hmac(sha256, 'key', 'message');
console.log('HMAC-SHA256:', hmacResult);

// Test HKDF
const hkdfResult = hkdf(sha256, 'password', 'salt', 'info', 32);
console.log('HKDF:', hkdfResult);

// Test PBKDF2
const pbkdf2Result = pbkdf2(sha256, 'password', 'salt', { c: 1000, dkLen: 32 });
console.log('PBKDF2:', pbkdf2Result);

console.log('All tests passed! 🎉');