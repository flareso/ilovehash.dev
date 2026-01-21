import { defineConfig } from 'vite';
import { resolve } from 'path';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'crypto/index': resolve(__dirname, 'src/crypto/index.ts'),
        'checksum/index': resolve(__dirname, 'src/checksum/index.ts'),
        'non-crypto/index': resolve(__dirname, 'src/non-crypto/index.ts'),
        // Individual algorithms for granular tree-shaking
        'algorithms/sha2': resolve(__dirname, 'src/algorithms/sha2.ts'),
        'algorithms/sha3': resolve(__dirname, 'src/algorithms/sha3.ts'),
        'algorithms/blake3': resolve(__dirname, 'src/algorithms/blake3.ts'),
        'algorithms/argon2': resolve(__dirname, 'src/algorithms/argon2.ts'),
        'algorithms/xxhash': resolve(__dirname, 'src/algorithms/xxhash.ts'),
        'algorithms/crc': resolve(__dirname, 'src/algorithms/crc.ts'),
        'algorithms/fletcher': resolve(__dirname, 'src/algorithms/fletcher.ts'),
        'algorithms/murmurhash': resolve(__dirname, 'src/algorithms/murmurhash.ts'),
        'algorithms/fnv': resolve(__dirname, 'src/algorithms/fnv.ts'),
        'algorithms/legacy': resolve(__dirname, 'src/algorithms/legacy.ts'),
        'algorithms/blake2': resolve(__dirname, 'src/algorithms/blake2.ts'),
        'algorithms/hmac': resolve(__dirname, 'src/algorithms/hmac.ts'),
        'algorithms/hkdf': resolve(__dirname, 'src/algorithms/hkdf.ts'),
        'algorithms/pbkdf2': resolve(__dirname, 'src/algorithms/pbkdf2.ts'),
        'algorithms/scrypt': resolve(__dirname, 'src/algorithms/scrypt.ts'),
        'algorithms/blake1': resolve(__dirname, 'src/algorithms/blake1.ts'),
        'algorithms/blake1-224': resolve(__dirname, 'src/algorithms/blake1.ts'),
        'algorithms/blake1-256': resolve(__dirname, 'src/algorithms/blake1.ts'),
        'algorithms/blake1-384': resolve(__dirname, 'src/algorithms/blake1.ts'),
        'algorithms/blake1-512': resolve(__dirname, 'src/algorithms/blake1.ts'),
        'algorithms/sha3-addons': resolve(__dirname, 'src/algorithms/sha3-addons.ts'),
        'algorithms/cshake128': resolve(__dirname, 'src/algorithms/sha3-addons.ts'),
        'algorithms/cshake256': resolve(__dirname, 'src/algorithms/sha3-addons.ts'),
        'algorithms/kt128': resolve(__dirname, 'src/algorithms/sha3-addons.ts'),
        'algorithms/kt256': resolve(__dirname, 'src/algorithms/sha3-addons.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'mjs' : 'js';
        return `${entryName}.${ext}`;
      }
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src'
      },
      plugins: [
        typescript({
          declaration: true,
          declarationDir: 'dist',
          rootDir: 'src'
        })
      ]
    },
    sourcemap: true,
    minify: false // Keep readable for debugging
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});