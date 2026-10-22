import { SetMetadata } from '@nestjs/common';

export interface IdempotentOptions {
  required?: boolean;
  ttlSeconds?: number;
}

export const IDEMPOTENT_METADATA_KEY = 'IDEMPOTENT_METADATA_KEY';

/**
 * Decorator to enforce or enable Idempotency-Key handling on mutations
 * Prevents accidental duplicate grant applications, submission requests, or financial records
 */
export const Idempotent = (options: IdempotentOptions = { required: true, ttlSeconds: 86400 }) =>
  SetMetadata(IDEMPOTENT_METADATA_KEY, options);
