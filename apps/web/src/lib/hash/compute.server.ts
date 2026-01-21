import "server-only";

import { createHash } from "crypto";
import { HASH_ALGORITHMS } from "../hash-metadata";
import * as sdk from "@ilovehash/sdk";

export async function computeHash(
  algorithm: string,
  input: string,
  format: "hex" | "base64" = "hex",
): Promise<string> {
  const algoConfig = HASH_ALGORITHMS[algorithm];
  if (!algoConfig) {
    throw new Error(`Unknown algorithm: ${algorithm}`);
  }

  // Use Node.js crypto for built-in algorithms
  if (algoConfig.nodeCryptoName) {
    // For SHAKE algorithms, we need special handling as they take output length
    if (algorithm.startsWith("shake")) {
      const hash = createHash(algoConfig.nodeCryptoName, {
        outputLength: algoConfig.outputLength,
      });
      hash.update(input, "utf8");
      return hash.digest(format);
    }

    const hash = createHash(algoConfig.nodeCryptoName);
    hash.update(input, "utf8");
    return hash.digest(format);
  }

  // Use SDK implementations for algorithms not supported by Node crypto
  return await computeSDKHash(algorithm, input, format);
}

async function computeSDKHash(algorithm: string, input: string, format: "hex" | "base64"): Promise<string> {
  const data = Buffer.from(input, "utf8");


  switch (algorithm) {
    // SHA-2 family
    case "sha224": return sdk.sha224(data);
    case "sha256": return sdk.sha256(data);
    case "sha384": return sdk.sha384(data);
    case "sha512": return sdk.sha512(data);
    case "sha512-224": return sdk.sha512_224(data);
    case "sha512-256": return sdk.sha512_256(data);

    // SHA-3 family
    case "sha3-224": return sdk.sha3_224(data);
    case "sha3-256": return sdk.sha3_256(data);
    case "sha3-384": return sdk.sha3_384(data);
    case "sha3-512": return sdk.sha3_512(data);
    case "shake128": return sdk.shake128(data, 256); // Default 32 bytes output
    case "shake256": return sdk.shake256(data, 256); // Default 32 bytes output

    // SHA-3 addon functions (return Uint8Array, convert to hex)
    case "cshake128": return Buffer.from(sdk.cshake128(data, { dkLen: 32 })).toString('hex');
    case "cshake256": return Buffer.from(sdk.cshake256(data, { dkLen: 32 })).toString('hex');
    case "turboshake128": return Buffer.from(sdk.turboshake128(data, { dkLen: 32 })).toString('hex');
    case "turboshake256": return Buffer.from(sdk.turboshake256(data, { dkLen: 32 })).toString('hex');
    case "tuplehash256": return Buffer.from(sdk.tuplehash256([data], { dkLen: 32 })).toString('hex');
    case "parallelhash256": return Buffer.from(sdk.parallelhash256(data, { dkLen: 32 })).toString('hex');
    case "kt128": return Buffer.from(sdk.kt128(data, { dkLen: 16 })).toString('hex');
    case "kt256": return Buffer.from(sdk.kt256(data, { dkLen: 32 })).toString('hex');

    // Keccak
    case "keccak-224": return sdk.keccak_224(data);
    case "keccak-256": return sdk.keccak_256(data);
    case "keccak-384": return sdk.keccak_384(data);
    case "keccak-512": return sdk.keccak_512(data);

    // BLAKE2
    case "blake2b512": return sdk.blake2b(data);
    case "blake2s256": return sdk.blake2s(data);

    // BLAKE3
    case "blake3": return sdk.blake3(data);

    // MAC and KDF functions (simplified - these would need proper keys/parameters in real usage)
    case "hmac": return sdk.hmacSha256("key12345678901234567890123456789012", data);
    case "hkdf": return sdk.hkdfSha256("ikm12345678901234567890123456789012", "salt12345678901234567890123456789012", "info", 32);

    // BLAKE1 (legacy)
    case "blake1-224": return sdk.blake224(data);
    case "blake1-256": return sdk.blake256(data);
    case "blake1-384": return sdk.blake384(data);
    case "blake1-512": return sdk.blake512(data);

    // Legacy hashes
    case "md5": return sdk.md5(data);
    case "sha1": return sdk.sha1(data);
    case "ripemd160": return sdk.ripemd160(data);

    // CRC and checksums
    case "crc-32": return sdk.crc32(data);
    case "crc-16": return sdk.crc16(data);
    case "crc-8": return sdk.crc8(data);
    case "crc-64": return sdk.crc64(data);
    case "internet-checksum": return sdk.internetChecksum(data);
    case "fletcher-4": return sdk.fletcher4(data);
    case "fletcher-8": return sdk.fletcher8(data);
    case "fletcher-16": return sdk.fletcher16(data);
    case "fletcher-32": return sdk.fletcher32(data);

    // Non-crypto hashes
    case "murmurhash": return sdk.murmurhash32(data);
    case "murmurhash-128": return sdk.murmurhash128(data);
    case "fnv-1": return sdk.fnv1(data);
    case "fnv-1a": return sdk.fnv1a(data);
    case "fnv-1-64": return sdk.fnv1_64(data);
    case "fnv-1a-64": return sdk.fnv1a_64(data);
    case "xxhash32": return sdk.xxhash32(data);
    case "xxhash64": return sdk.xxhash64(data);
    case "xxhash128": return sdk.xxhash128(data);

    // Password hashing (simplified - these would need parameters in real usage)
    case "argon2i": return sdk.argon2i(input, { salt: "salt12345678901234567890123456789012", iterations: 2, memory: 65536, parallelism: 1 });
    case "argon2d": return sdk.argon2d(input, { salt: "salt12345678901234567890123456789012", iterations: 2, memory: 65536, parallelism: 1 });
    case "argon2id": return sdk.argon2id(input, { salt: "salt12345678901234567890123456789012", iterations: 2, memory: 65536, parallelism: 1 });
    case "scrypt": return sdk.scrypt.scrypt(input, "salt12345678901234567890123456789012", 16384, 8, 1, 64);
    case "pbkdf2": return sdk.pbkdf2Sha256(input, "salt12345678901234567890123456789012", 10000, 32);

    // Similarity hashes
    case "simhash": return sdk.simhash(data);
    case "minhash": return sdk.minhash(data);
    case "bbitminhash": return sdk.bbitMinhash(data);
    case "superminhash": return sdk.superminhash(data);
    case "nilsimsa": return sdk.nilsimsa(data);
    case "imatch": return sdk.imatch(data, { lexicon: ["test", "words", "for", "demo"] });

    // For algorithms not yet mapped or not available in SDK, throw error
    default:
      throw new Error(`Algorithm ${algorithm} not yet implemented in SDK`);
  }
}

