export interface HashOptions {
  encoding?: 'hex' | 'base64' | 'binary';
  outputLength?: number;
}

export interface PasswordHashOptions extends HashOptions {
  salt?: string | Uint8Array;
  iterations?: number;
  memory?: number;
  parallelism?: number;
  keyLength?: number;
}

export interface HashAlgorithm {
  name: string;
  description: string;
  category: string;
  outputLength: number;
  isSlow?: boolean;
  legacy?: boolean;
  demo?: boolean;
}

export interface HashFunction {
  (input: string | Uint8Array, options?: HashOptions): Promise<string> | string;
  sync?: (input: string | Uint8Array, options?: HashOptions) => string;
}

export interface PasswordHashFunction {
  (password: string, options?: PasswordHashOptions): Promise<string>;
  verify?: (password: string, hash: string) => Promise<boolean>;
}

export type Encoding = 'hex' | 'base64' | 'binary';

export interface HashResult {
  hash: string;
  algorithm: string;
  encoding: Encoding;
  inputLength: number;
  time: number; // in milliseconds
}