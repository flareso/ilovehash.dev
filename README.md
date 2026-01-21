<p align="center">
  <a href="https://ilovehash.dev" target="_blank">
  <img width="400" src="public/logo.png" alt="ilovehash.dev logo">
  </a>
</p>

<h1 align="center">ilovehash.dev</h1>

<p align="center">
  A comprehensive collection of cryptographic and non-cryptographic hash algorithms and tools
</p>

<p align="center">
  <i>Compute, verify, and explore hash functions • No data stored • Instant results</i>
</p>

<p align="center">
  <a href="https://ilovehash.dev/" target="_blank">
    <img src="https://img.shields.io/badge/Try%20it%20now-000000?style=for-the-badge&logo=hashnode&logoColor=white" alt="Try it now">
  </a>
</p>

## Hash Algorithm Categories

### Cryptographic Hash Functions

| Algorithm | Description |
|-----------|-------------|
| **SHA-2 Family** | Industry standard cryptographic hashes |
| SHA-256 | 256-bit secure hash algorithm |
| SHA-384 | 384-bit secure hash algorithm |
| SHA-512 | 512-bit secure hash algorithm |
| **SHA-3 Family** | Next-generation cryptographic hashes |
| SHA3-256 | Keccak-based 256-bit hash |
| SHA3-384 | Keccak-based 384-bit hash |
| SHA3-512 | Keccak-based 512-bit hash |
| **Legacy Cryptographic** ⚠️ | Older algorithms (use with caution) |
| MD5 | 128-bit hash (cryptographically broken) |
| SHA-1 | 160-bit hash (cryptographically broken) |
| RIPEMD-160 | 160-bit hash function |
| **BLAKE2 Family** | High-performance cryptographic hashes |
| BLAKE2b | Optimized for 64-bit platforms |
| BLAKE2s | Optimized for 32-bit platforms |
| **Other Cryptographic** | Specialized cryptographic algorithms |
| Whirlpool | 512-bit hash function |
| Tiger | 192-bit hash function |

### Non-Cryptographic Hash Functions

| Algorithm | Description | Use Case |
|-----------|-------------|----------|
| **Fast Hashing** | High-speed non-cryptographic hashes | General purpose |
| MurmurHash | Fast, general-purpose hash | Data structures |
| DJB2 | Simple string hash | Basic hashing |
| SDBM | Simple hash function | Basic hashing |
| **Checksum Algorithms** | Error detection and validation | Data integrity |
| CRC-32 | Cyclic redundancy check | File integrity |
| Adler-32 | Adler checksum | Fast checksums |
| Fletcher | Fletcher checksum variants | Data validation |
| **FNV Family** | Fowler-Noll-Vo hash functions | Hash tables |
| FNV-1 | Non-cryptographic hash | Hash tables |
| FNV-1a | Improved FNV variant | Hash tables |

### Password Hashing

| Algorithm | Description | Security |
|-----------|-------------|----------|
| **Modern Password Hashing** | Memory-hard functions | High |
| PBKDF2 | Password-Based Key Derivation Function 2 | ✅ Recommended |
| bcrypt | Adaptive password hashing | ✅ Recommended |
| **Legacy Password Hashing** ⚠️ | Older methods | Low |
| scrypt | Memory-hard password hashing | ⚠️ Limited |

### Specialized Hash Functions

| Algorithm | Description | Purpose |
|-----------|-------------|----------|
| **Similarity & LSH** | Locality-sensitive hashing | Similarity detection |
| SimHash | Similarity detection | Duplicate finding |
| MinHash | Jaccard similarity | Large datasets |
| **Block Hashes** | Perceptual hashing | Image/content similarity |
| BlockHash | Image perceptual hash | Content identification |
| **Other Specialized** | Domain-specific algorithms | Various |
| Universal Hash | Universal hashing | Cryptographic constructions |
| Zobrist | Zobrist hashing | Game theory, boards |
| Tabulation | Tabulation hashing | Fast lookups |

## Features

- **Comprehensive Coverage**: 100+ hash algorithms across multiple categories
- **Interactive Tools**: Test and compute hashes with real-time results
- **Verification Mode**: Compare computed hashes against expected values
- **Server-Side Processing**: All computations happen server-side for security
- **No Data Storage**: Your input text is never stored or logged
- **Fast & Responsive**: Optimized algorithms with instant results
- **Modern UI**: Built with Next.js, TypeScript, and shadcn/ui

## Algorithm Categories

### Cryptographic
Secure hash functions for digital signatures, certificates, and security applications.

### Non-Cryptographic
Fast hash functions for data structures, checksums, and general-purpose use.

### Password Hashing
Specialized functions designed for password storage and verification.

### Similarity Detection
Locality-sensitive hashing for finding similar content and duplicates.

### Checksum
Error-detection algorithms for data integrity verification.

### Specialized
Domain-specific hash functions for particular use cases.

## Security Notice

⚠️ **Legacy Algorithms**: Some algorithms (MD5, SHA-1) are cryptographically broken and should not be used for security purposes. They are included for compatibility and educational purposes only.

🛡️ **Best Practices**:
- Use SHA-256 or higher for new cryptographic applications
- Prefer bcrypt/scrypt for password hashing
- Regularly update your cryptographic implementations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Deployment**: Vercel

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/flareso/ilovehash.dev.git
   cd ilovehash.dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/hash/          # Hash computation API
│   ├── hashes/            # Hash algorithm pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── item-card.tsx      # Hash algorithm cards
│   ├── item-grid.tsx      # Grid layout for cards
│   └── ui/               # shadcn/ui components
├── lib/                   # Core utilities
│   ├── hash-utils.ts      # Hash algorithm definitions
│   ├── external-hashes.ts # Custom hash implementations
│   └── hash-catalog.ts    # Data aggregation
└── hooks/                 # React hooks
    └── use-readme.ts      # Data fetching
```

## Contributing

We welcome contributions! Here's how to get started:

### Adding New Hash Algorithms

1. **Add algorithm configuration** in `src/lib/hash-utils.ts`:
   ```typescript
   "algorithm-name": {
     name: "Display Name",
     description: "Algorithm description",
     category: "CategoryName",
     outputLength: 32, // bytes
     legacy: false,    // optional
   }
   ```

2. **Implement the algorithm** in `src/lib/external-hashes.ts`:
   ```typescript
   function computeAlgorithmName(input: string, format: "hex" | "base64"): string {
     // Implementation here
   }
   ```

3. **Add to the switch statement** in `computeExternalHash()`.

### Categories

Algorithms are organized into these categories:
- **Cryptographic**: Secure hash functions
- **Non-cryptographic**: Fast hashing for general use
- **Password Hashing**: Specialized password security
- **Checksum**: Error detection algorithms
- **Similarity Detection**: LSH and similarity algorithms

## Security & Privacy

- **Server-side processing**: All hash computations happen on the server
- **No data storage**: Input text is never stored or logged
- **Privacy first**: Your data remains yours

## License

[MIT](LICENSE)
