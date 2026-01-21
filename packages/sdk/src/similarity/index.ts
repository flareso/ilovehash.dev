/**
 * Similarity Hash Functions
 * Locality-sensitive hashing algorithms for similarity detection, duplicate finding, and nearest neighbor searches.
 */

// SimHash (Charikar-style fingerprint)
export { simhash, simhashHammingDistance, simhashSimilarity } from '../algorithms/simhash';

// MinHash (min-wise independent permutations)
export { minhash, minhashSignature, minhashJaccard } from '../algorithms/minhash';

// b-bit MinHash (space-efficient variant)
export {
  bbitMinhash,
  bbitMinhashSignature,
  bbitMinhashEqualFraction,
  bbitMinhashJaccardEstimate,
} from '../algorithms/bbit-minhash';

// SuperMinHash (Ertl 2017 - improved MinHash)
export { superminhash, superminhashSignature, superminhashJaccard } from '../algorithms/superminhash';

// Nilsimsa (locality-sensitive hash for text/spam detection)
export { nilsimsa, nilsimsaBytes, nilsimsaCompare } from '../algorithms/nilsimsa';

// I-Match (lexicon-based duplicate detection)
export { imatch } from '../algorithms/imatch';
