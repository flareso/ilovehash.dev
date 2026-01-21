# @ilovehash/sdk

A comprehensive, tree-shaking friendly hashing SDK with support for cryptographic and non-cryptographic algorithms.

## Features

- 🚀 **Tree-shaking friendly** - Only import what you need
- 🔒 **Cryptographic algorithms** - SHA-2/3, BLAKE2/3, Argon2, Keccak
- 🔐 **MAC & KDF** - HMAC, HKDF, PBKDF2, Scrypt
- ⚡ **High-performance hashes** - xxHash, MurmurHash, FNV
- ✅ **Checksum algorithms** - CRC, Fletcher
- 📜 **Legacy support** - SHA-1, MD5, RIPEMD160
- 🎯 **TypeScript support** - Full type definitions
- 📦 **Multiple formats** - ESM and CommonJS
- 🏗️ **Vite optimized** - Perfect for modern bundlers

## Installation

```bash
npm install @ilovehash/sdk
```

## Quick Start

### Basic Usage

```typescript
import { sha256, sha3_256, blake3, crc32, xxhash32 } from '@ilovehash/sdk';

// Cryptographic hashes
const hash1 = sha256('hello world');
const hash2 = sha3_256('hello world');
const hash3 = blake3('hello world');

// Checksums and non-crypto
const checksum = crc32('hello world');
const fastHash = xxhash32('hello world');
```

### Tree-shaking (recommended)

```typescript
// Import individual algorithms
import { sha256 } from '@ilovehash/sdk/algorithms/sha2';
import { blake3 } from '@ilovehash/sdk/algorithms/blake3';
import { crc32 } from '@ilovehash/sdk/algorithms/crc';

// Import by category
import { sha256, sha3_256 } from '@ilovehash/sdk/crypto';
import { xxhash32, murmurhash } from '@ilovehash/sdk/non-crypto';
import { crc32, fletcher16 } from '@ilovehash/sdk/checksum';

// MAC and KDF functions
import { hmac } from '@ilovehash/sdk/algorithms/hmac';
import { hkdf } from '@ilovehash/sdk/algorithms/hkdf';
import { pbkdf2 } from '@ilovehash/sdk/algorithms/pbkdf2';
import { scrypt } from '@ilovehash/sdk/algorithms/scrypt';
```

## API

### Cryptographic Algorithms

#### SHA-2 Family
```typescript
import { sha224, sha256, sha384, sha512, sha512_224, sha512_256 } from '@ilovehash/sdk';

sha256('data'); // SHA-256
sha512('data'); // SHA-512
```

#### SHA-3 & Keccak Family
```typescript
import { sha3_224, sha3_256, sha3_384, sha3_512, shake128, shake256 } from '@ilovehash/sdk';
import { keccak_224, keccak_256, keccak_384, keccak_512 } from '@ilovehash/sdk';

sha3_256('data'); // SHA-3-256
keccak_256('data'); // Keccak-256 (different from SHA-3)
shake256('data', 64); // Extendable output
```

#### BLAKE2 & BLAKE3
```typescript
import { blake2b, blake2s } from '@ilovehash/sdk';
import { blake3, blake3_keyed, blake3_derive_key } from '@ilovehash/sdk';

blake2b('data'); // BLAKE2b
blake3('data'); // BLAKE3
blake3_keyed(key, 'data'); // Keyed BLAKE3
```

#### Argon2 (Password Hashing)
```typescript
import { argon2d, argon2i, argon2id } from '@ilovehash/sdk';

const hash = await argon2id('password', {
  salt: new Uint8Array(16),
  iterations: 3,
  memory: 65536,
  parallelism: 4
});
```

### MAC & KDF Functions

#### HMAC (Message Authentication Code)
```typescript
import { hmac } from '@ilovehash/sdk/algorithms/hmac';

const mac = hmac(sha256, 'key', 'message');
```

#### HKDF (HMAC-based Key Derivation)
```typescript
import { hkdf } from '@ilovehash/sdk/algorithms/hkdf';

const key = hkdf(sha256, 'password', 'salt', 'info', 32);
```

#### PBKDF2 (Password-Based Key Derivation)
```typescript
import { pbkdf2 } from '@ilovehash/sdk/algorithms/pbkdf2';

const key = pbkdf2(sha256, 'password', 'salt', { c: 1000, dkLen: 32 });
```

#### Scrypt (Memory-hard KDF)
```typescript
import { scrypt } from '@ilovehash/sdk/algorithms/scrypt';

const key = scrypt('password', 'salt', { N: 16384, r: 8, p: 1, dkLen: 64 });
```

### Checksum Algorithms

#### CRC Family
```typescript
import { crc32, crc16, crc8, crc64, internetChecksum } from '@ilovehash/sdk';

crc32('data'); // CRC-32
crc16('data'); // CRC-16
crc8('data'); // CRC-8
crc64('data'); // CRC-64
internetChecksum('data'); // RFC 1071
```

#### Fletcher Family
```typescript
import { fletcher16, fletcher32, fletcher64 } from '@ilovehash/sdk';

fletcher16('data'); // Fletcher-16
fletcher32('data'); // Fletcher-32
fletcher64('data'); // Fletcher-64
```

### Non-Cryptographic Algorithms

#### xxHash Family
```typescript
import { xxhash32, xxhash64, xxhash128 } from '@ilovehash/sdk';

xxhash32('data'); // xxHash32
xxhash64('data'); // xxHash64
xxhash128('data'); // xxHash128
```

#### MurmurHash
```typescript
import { murmurhash, murmurhash128 } from '@ilovehash/sdk';

murmurhash('data'); // MurmurHash3 x86 32-bit
murmurhash128('data'); // MurmurHash3 x86 128-bit
```

#### FNV
```typescript
import { fnv1, fnv1a, fnv1_64, fnv1a_64 } from '@ilovehash/sdk';

fnv1('data'); // FNV-1 32-bit
fnv1a('data'); // FNV-1a 32-bit (recommended)
fnv1_64('data'); // FNV-1 64-bit
fnv1a_64('data'); // FNV-1a 64-bit
```

## Options

All hash functions accept an options object:

```typescript
interface HashOptions {
  encoding?: 'hex' | 'base64' | 'binary';
  outputLength?: number;
}
```

## Performance

The SDK is optimized for tree-shaking, ensuring minimal bundle sizes:

- Individual algorithms: `~1-12KB` per algorithm
- Cryptographic category: `~25KB`
- All algorithms: `~100KB` total

## Security

- ✅ **Audited implementations** - Based on noble-hashes security standards
- 🔒 **RFC compliant** - SHA-2, SHA-3, HMAC, HKDF, PBKDF2, Scrypt follow official specs
- 🛡️ **Memory-safe** - No external dependencies, pure TypeScript/JavaScript
- ⚠️ **Legacy warnings** - SHA-1, MD5 marked as deprecated for security

## Implemented Algorithms (Complete noble-hashes coverage)

### ✅ **Cryptographic Hashes**
- **SHA-2**: sha224, sha256, sha384, sha512, sha512_224, sha512_256
- **SHA-3**: sha3_224, sha3_256, sha3_384, sha3_512, shake128, shake256
- **Keccak**: keccak_224, keccak_256, keccak_384, keccak_512
- **BLAKE**: blake2b, blake2s, blake3, blake3_keyed, blake3_derive_key
- **Argon2**: argon2d, argon2i, argon2id (with verification)

### ✅ **MAC & KDF**
- **HMAC**: hmac (with sha256, sha3, blake2b variants)
- **HKDF**: hkdf, hkdf_extract, hkdf_expand
- **PBKDF2**: pbkdf2, pbkdf2_async
- **Scrypt**: scrypt, scrypt_async

### ✅ **Non-Cryptographic**
- **xxHash**: xxhash32, xxhash64, xxhash128
- **MurmurHash**: murmurhash, murmurhash128
- **FNV**: fnv1, fnv1a, fnv1_64, fnv1a_64

### ✅ **Checksums**
- **CRC**: crc32, crc16, crc8, crc64, internet_checksum
- **Fletcher**: fletcher4, fletcher8, fletcher16, fletcher32, fletcher64

### ✅ **Legacy** (⚠️ deprecated)
- **SHA-1**: sha1
- **MD5**: md5
- **RIPEMD160**: ripemd160

## License

MIT

## Contributing

This SDK implements algorithms compatible with noble-hashes. All implementations are pure TypeScript/JavaScript for maximum compatibility and tree-shaking support.

## Related Projects

- [noble-hashes](https://github.com/paulmillr/noble-hashes) - Primary reference implementation
- [js-sha3](https://github.com/emn178/js-sha3) - SHA-3 reference
- [RFC 6234](https://tools.ietf.org/html/rfc6234) - SHA-2 specification
- [RFC 2104](https://tools.ietf.org/html/rfc2104) - HMAC specification
- [xxhashjs](https://github.com/pierrec/js-xxhash) - xxHash reference