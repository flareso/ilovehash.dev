export type FaqItem = {
  question: string;
  answer: string;
};

export type HashPageContent = {
  summary: string;
  exampleInput: string;
  exampleUse: string;
  whenToUse: string[];
  whenNotToUse: string[];
  faqs: FaqItem[];
};

const XXHASH_CONTENT: HashPageContent = {
  summary:
    "xxHash is a family of extremely fast non-cryptographic hash functions built for checksums, cache keys, deduplication, and high-throughput data pipelines. It is designed for speed and distribution, not for security.",
  exampleInput: "customer:4815162342:invoice:2026-07",
  exampleUse:
    "Hash stable strings or byte ranges when you need a compact fingerprint for partitioning, lookup, bucketing, or quick change detection.",
  whenToUse: [
    "Hash table keys, cache keys, bloom filters, or partitioning keys.",
    "Fast file or chunk fingerprinting where malicious collision attacks are not part of the threat model.",
    "Data engineering jobs that need high throughput and repeatable non-security hashes.",
  ],
  whenNotToUse: [
    "Password storage, API signatures, tokens, certificates, or security-sensitive integrity checks.",
    "Any place where an attacker can choose input and benefit from collisions.",
    "Regulated cryptographic workflows that require SHA-2, SHA-3, BLAKE2, or another approved primitive.",
  ],
  faqs: [
    {
      question: "Is xxHash cryptographically secure?",
      answer:
        "No. xxHash is intentionally non-cryptographic. Use it for speed, not for authentication, password hashing, or tamper-resistant integrity.",
    },
    {
      question: "Should I use xxHash32, xxHash64, or xxHash128?",
      answer:
        "Use xxHash64 as the practical default on modern systems. Use xxHash32 for legacy 32-bit compatibility and xxHash128 when you need a wider fingerprint for large-scale datasets.",
    },
    {
      question: "Is xxHash better than CRC-32?",
      answer:
        "For many software workloads, xxHash is faster and has better distribution. CRC-32 is still useful when protocol or file-format compatibility requires it.",
    },
  ],
};

export const HASH_PAGE_CONTENT: Record<string, HashPageContent> = {
  sha256: {
    summary:
      "SHA-256 is the most common SHA-2 hash function and a strong default for general-purpose cryptographic digests. It produces a 256-bit digest and is widely used for file integrity, signatures, certificates, blockchains, and security protocols.",
    exampleInput: "Hello, World!",
    exampleUse:
      "Compute a SHA-256 digest for a release artifact, message, or canonical string when you need a stable, collision-resistant fingerprint.",
    whenToUse: [
      "File integrity checks, release checksums, and reproducible build verification.",
      "Digital signature workflows and protocol designs that require a standard 256-bit hash.",
      "General security-sensitive hashing when password-specific slow hashing is not required.",
    ],
    whenNotToUse: [
      "Password storage. Use Argon2id, scrypt, bcrypt, or PBKDF2 with a salt and cost settings.",
      "Very high-speed non-security indexing where xxHash or another non-cryptographic hash is enough.",
      "Cases that require extendable output; use SHAKE128 or SHAKE256 instead.",
    ],
    faqs: [
      {
        question: "Is SHA-256 still secure?",
        answer:
          "Yes. SHA-256 remains a widely trusted cryptographic hash for collision resistance and preimage resistance.",
      },
      {
        question: "What is the SHA-256 output length?",
        answer:
          "SHA-256 outputs 256 bits, which is 32 bytes or 64 hexadecimal characters.",
      },
      {
        question: "Can SHA-256 be decrypted?",
        answer:
          "No. SHA-256 is a one-way hash, not encryption. You can compare hashes, but you cannot recover the original input from the digest.",
      },
    ],
  },
  md5: {
    summary:
      "MD5 is a legacy 128-bit hash function. It is fast and still appears in older systems, but it is broken for cryptographic security because practical collision attacks exist.",
    exampleInput: "legacy-file.bin",
    exampleUse:
      "Use MD5 only when you need compatibility with an existing checksum, API, database column, or old file manifest.",
    whenToUse: [
      "Legacy compatibility where another system already requires MD5.",
      "Non-security file identification in trusted internal workflows.",
      "Quick comparison against an existing MD5 checksum from old tooling.",
    ],
    whenNotToUse: [
      "Digital signatures, certificates, package verification, or tamper-resistant integrity.",
      "Password storage or password reset tokens.",
      "Any new security design. Prefer SHA-256, SHA-3, BLAKE2, or BLAKE3.",
    ],
    faqs: [
      {
        question: "Is MD5 secure?",
        answer:
          "No. MD5 is cryptographically broken and should not be used for security-sensitive integrity or signatures.",
      },
      {
        question: "Why do people still use MD5?",
        answer:
          "Mostly compatibility. Many older systems, databases, and manifests still store MD5 checksums.",
      },
      {
        question: "What should I use instead of MD5?",
        answer:
          "Use SHA-256 for broad compatibility, SHA-3 for a newer standard, or BLAKE3 for high-performance modern hashing.",
      },
    ],
  },
  sha1: {
    summary:
      "SHA-1 is a legacy 160-bit cryptographic hash that is now considered broken for collision resistance. It should be treated as a compatibility tool, not a safe choice for new security work.",
    exampleInput: "old-git-object-or-certificate",
    exampleUse:
      "Use SHA-1 only when checking or reproducing hashes from older protocols, archives, or systems that still expose SHA-1 values.",
    whenToUse: [
      "Compatibility with existing SHA-1 identifiers or legacy manifests.",
      "Historical data migration where SHA-1 values already exist.",
      "Non-adversarial lookup workflows where security is not required.",
    ],
    whenNotToUse: [
      "New digital signatures, certificates, or software supply-chain verification.",
      "Any workflow where an attacker could craft colliding inputs.",
      "Password hashing or token generation.",
    ],
    faqs: [
      {
        question: "Is SHA-1 broken?",
        answer:
          "Yes. Practical collision attacks exist, so SHA-1 should not be used for new security-sensitive designs.",
      },
      {
        question: "Is SHA-1 the same as SHA-256?",
        answer:
          "No. SHA-1 outputs 160 bits and is deprecated. SHA-256 is part of SHA-2, outputs 256 bits, and remains widely trusted.",
      },
      {
        question: "Can I use SHA-1 for file checksums?",
        answer:
          "Only for legacy compatibility or trusted internal checks. For public integrity checks, use SHA-256 or stronger.",
      },
    ],
  },
  sha512: {
    summary:
      "SHA-512 is a SHA-2 hash function with a 512-bit output. It is strong, standardized, and often fast on 64-bit CPUs, making it useful for high-security digests and large data.",
    exampleInput: "large-release-archive.tar.zst",
    exampleUse:
      "Use SHA-512 when you want a larger digest than SHA-256 or when your platform benefits from SHA-512 performance on 64-bit hardware.",
    whenToUse: [
      "High-security file integrity and signed metadata workflows.",
      "Systems that standardize on SHA-512 or need a 512-bit digest.",
      "64-bit environments where SHA-512 performance is strong.",
    ],
    whenNotToUse: [
      "Password storage without a slow, salted password hashing scheme.",
      "Compact identifiers where SHA-256 is already more than enough.",
      "Non-security hashing where speed and short fingerprints matter more than cryptographic strength.",
    ],
    faqs: [
      {
        question: "Is SHA-512 stronger than SHA-256?",
        answer:
          "SHA-512 has a larger output and higher security margins, but SHA-256 is already strong for most practical uses.",
      },
      {
        question: "How long is a SHA-512 hash?",
        answer:
          "SHA-512 outputs 512 bits, which is 64 bytes or 128 hexadecimal characters.",
      },
      {
        question: "Should I choose SHA-256 or SHA-512?",
        answer:
          "Choose SHA-256 for broad compatibility and shorter output. Choose SHA-512 when your protocol, policy, or platform benefits from the larger digest.",
      },
    ],
  },
  "sha3-256": {
    summary:
      "SHA3-256 is a 256-bit hash from the SHA-3 family, based on the Keccak sponge construction. It is a modern alternative to SHA-2 with a different internal design and strong security margins.",
    exampleInput: "protocol-message-v1",
    exampleUse:
      "Use SHA3-256 when you want a NIST-standard 256-bit digest that is independent from SHA-2 internals.",
    whenToUse: [
      "New cryptographic designs that explicitly prefer SHA-3.",
      "Systems that want diversity from SHA-2 while keeping a standardized hash.",
      "Blockchain, protocol, or research contexts that already use Keccak or SHA-3-family primitives.",
    ],
    whenNotToUse: [
      "Compatibility workflows that specifically require SHA-256.",
      "Variable-length output needs; use SHAKE128 or SHAKE256.",
      "Password hashing without memory-hard cost settings.",
    ],
    faqs: [
      {
        question: "Is SHA3-256 better than SHA-256?",
        answer:
          "It is not a direct upgrade for every case. SHA3-256 has a different design and strong margins, while SHA-256 has wider legacy compatibility.",
      },
      {
        question: "Is SHA3-256 the same as Keccak-256?",
        answer:
          "No. They are closely related, but SHA3-256 and Keccak-256 use different padding and produce different digests.",
      },
      {
        question: "How long is a SHA3-256 hash?",
        answer:
          "SHA3-256 outputs 256 bits, which is 32 bytes or 64 hexadecimal characters.",
      },
    ],
  },
  blake3: {
    summary:
      "BLAKE3 is a modern cryptographic hash designed for high performance, parallelism, and flexible output. It is commonly used when speed matters but a cryptographic hash is still required.",
    exampleInput: "video-segment-00042",
    exampleUse:
      "Use BLAKE3 to hash large files, chunks, or streams quickly while keeping cryptographic-strength digest properties.",
    whenToUse: [
      "High-throughput file hashing, chunking, and content-addressed storage.",
      "Applications that benefit from parallel hashing on modern CPUs.",
      "Modern systems where BLAKE3 support is available on both producer and consumer sides.",
    ],
    whenNotToUse: [
      "Protocols or audits that require SHA-2 or SHA-3 specifically.",
      "Password storage; use Argon2id or another password hashing algorithm.",
      "Legacy integrations that cannot consume BLAKE3 digests.",
    ],
    faqs: [
      {
        question: "Is BLAKE3 cryptographically secure?",
        answer:
          "BLAKE3 is designed as a cryptographic hash and is considered a strong modern choice, though some standards and compliance programs still require SHA-2 or SHA-3.",
      },
      {
        question: "Why is BLAKE3 fast?",
        answer:
          "BLAKE3 uses a tree structure and is built for parallelism, so it can use modern CPU resources efficiently.",
      },
      {
        question: "Can BLAKE3 output different lengths?",
        answer:
          "Yes. BLAKE3 supports extendable output, though many tools use a 256-bit output by default.",
      },
    ],
  },
  argon2id: {
    summary:
      "Argon2id is the recommended Argon2 variant for password hashing. It combines resistance to side-channel attacks and GPU cracking by using configurable memory, time, and parallelism costs.",
    exampleInput: "correct-horse-battery-staple",
    exampleUse:
      "Use Argon2id to derive a password hash with a unique salt and cost settings tuned for your server budget.",
    whenToUse: [
      "Password storage for user accounts.",
      "Key derivation from passphrases where memory hardness is important.",
      "New systems that can choose a modern password hashing default.",
    ],
    whenNotToUse: [
      "Fast checksums, file digests, or content identifiers.",
      "Client-side-only authentication flows without a careful threat model.",
      "Legacy systems that require bcrypt, scrypt, or PBKDF2 for compatibility.",
    ],
    faqs: [
      {
        question: "Is Argon2id better than bcrypt?",
        answer:
          "For new systems, Argon2id is usually preferred because it is memory-hard and tunable. bcrypt remains common for legacy compatibility.",
      },
      {
        question: "Do I need a salt with Argon2id?",
        answer:
          "Yes. Use a unique random salt for each password so identical passwords do not produce identical hashes.",
      },
      {
        question: "Should Argon2id be fast?",
        answer:
          "No. Password hashing should be intentionally expensive enough to slow offline guessing while staying acceptable for legitimate logins.",
      },
    ],
  },
  "crc-32": {
    summary:
      "CRC-32 is a 32-bit checksum used to detect accidental data corruption in files, archives, network frames, and storage systems. It is not a cryptographic hash.",
    exampleInput: "archive.zip",
    exampleUse:
      "Use CRC-32 when you need compatibility with formats or protocols that store CRC-32 checksums.",
    whenToUse: [
      "ZIP, gzip, PNG, Ethernet, and other formats or protocols that specify CRC-32.",
      "Detecting accidental corruption in trusted storage or transport paths.",
      "Quick checksum compatibility with existing tooling.",
    ],
    whenNotToUse: [
      "Security-sensitive integrity checks where an attacker can modify data.",
      "Password hashing, signatures, tokens, or authentication.",
      "Large untrusted datasets where collision resistance matters.",
    ],
    faqs: [
      {
        question: "Is CRC-32 a hash?",
        answer:
          "It is a checksum and can be treated as a simple non-cryptographic hash, but it is designed for error detection rather than security.",
      },
      {
        question: "Can CRC-32 detect all errors?",
        answer:
          "No checksum detects every possible error. CRC-32 is good at common accidental corruption patterns, not malicious tampering.",
      },
      {
        question: "Should I use CRC-32 or SHA-256?",
        answer:
          "Use CRC-32 for protocol compatibility and accidental error detection. Use SHA-256 for cryptographic integrity.",
      },
    ],
  },
  xxhash32: XXHASH_CONTENT,
  xxhash64: XXHASH_CONTENT,
  xxhash128: XXHASH_CONTENT,
};

export const COMPARE_PAGE_CONTENT = {
  summary:
    "Hash comparison helps you choose the right algorithm by looking at digest output, category, and relative runtime on the same input. The fastest algorithm is not always the safest one, so compare performance together with the intended use case.",
  whenToUse: [
    "Validate that two algorithms produce the expected digest shape for the same input.",
    "Compare cryptographic hashes against non-cryptographic hashes before choosing a tool.",
    "Benchmark rough browser-side performance for data sizes similar to your workload.",
  ],
  whenNotToUse: [
    "Do not treat browser timing as a final production benchmark.",
    "Do not choose MD5, SHA-1, CRC-32, or xxHash for security just because they are fast.",
    "Do not use fast hashes for password storage; use Argon2id, scrypt, bcrypt, or PBKDF2.",
  ],
  faqs: [
    {
      question: "Which hash algorithm should I choose?",
      answer:
        "Use SHA-256 for broad cryptographic compatibility, SHA3-256 for SHA-3 designs, BLAKE3 for modern high-performance hashing, Argon2id for passwords, CRC-32 for checksum compatibility, and xxHash for fast non-security fingerprints.",
    },
    {
      question: "Why are non-cryptographic hashes faster?",
      answer:
        "They skip security properties such as strong collision resistance and preimage resistance, so they can optimize for speed and distribution.",
    },
    {
      question: "Are these benchmark numbers exact?",
      answer:
        "No. Browser timing depends on CPU, tab state, input size, implementation, and runtime warmup. Use the numbers as a quick local comparison, not a formal benchmark.",
    },
  ],
};
