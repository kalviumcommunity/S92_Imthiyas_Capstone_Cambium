import { Logger } from '@nestjs/common';

export interface EnvValidationReport {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

const KNOWN_DEV_SECRETS = new Set([
  'cambium-super-secure-production-secret-key-2026',
  'cambium-dev-secret',
  'secret',
  'changeme',
]);

/**
 * Validates required backend configuration at startup.
 * Fails fast in production on missing/weak credentials; logs clear guidance in development.
 */
export function validateServerEnv(
  env: NodeJS.ProcessEnv = process.env,
): EnvValidationReport {
  const logger = new Logger('EnvValidator');
  const isProd = env.NODE_ENV === 'production';
  const warnings: string[] = [];
  const errors: string[] = [];

  const jwtSecret = env.JWT_SECRET?.trim() || '';
  if (!jwtSecret || KNOWN_DEV_SECRETS.has(jwtSecret) || jwtSecret.length < 16) {
    const msg =
      'JWT_SECRET must be at least 16 characters and must not match default development fallbacks.';
    if (isProd) errors.push(msg);
    else warnings.push(msg);
  }

  const hasDb = Boolean(env.DATABASE_URL?.trim() || env.POSTGRES_HOST?.trim());
  if (!hasDb) {
    const msg = 'Neither DATABASE_URL nor POSTGRES_HOST is set; PostgreSQL connection uses localhost defaults.';
    if (isProd) errors.push(msg);
    else warnings.push(msg);
  }

  if (isProd && !env.CORS_ORIGIN?.trim()) {
    warnings.push('CORS_ORIGIN is unset in production; relying on default Cambium allowlist.');
  }

  for (const w of warnings) logger.warn(w);
  for (const e of errors) logger.error(e);

  if (isProd && errors.length > 0) {
    throw new Error(`Cambium startup aborted due to configuration errors:\n- ${errors.join('\n- ')}`);
  }

  return { valid: errors.length === 0, warnings, errors };
}
