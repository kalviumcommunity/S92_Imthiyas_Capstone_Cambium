import { INestApplication } from '@nestjs/common';

const DISALLOWED_PLACEHOLDERS = [
  'change_in_production',
  'your_jwt',
  'cambium_jwt_secret_key',
  'super_secure',
  'dev_secret',
  'default_secret',
];

export interface EnvValidationReport {
  valid: boolean;
  mode: string;
  errors: string[];
  warnings: string[];
}

export function validateEnvironmentConfig(
  env: NodeJS.ProcessEnv = process.env,
): EnvValidationReport {
  const mode = env.NODE_ENV || 'development';
  const isProd = mode === 'production';
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isProd) {
    return { valid: true, mode, errors, warnings };
  }

  const jwtSecret = (env.JWT_SECRET || '').trim();
  const refreshSecret = (env.JWT_REFRESH_SECRET || '').trim();

  if (!jwtSecret || jwtSecret.length < 24) {
    errors.push('JWT_SECRET must be set and at least 24 characters in production.');
  } else if (DISALLOWED_PLACEHOLDERS.some((p) => jwtSecret.toLowerCase().includes(p))) {
    errors.push('JWT_SECRET contains an insecure template placeholder in production.');
  }

  if (!refreshSecret || refreshSecret.length < 24) {
    errors.push('JWT_REFRESH_SECRET must be set and at least 24 characters in production.');
  } else if (DISALLOWED_PLACEHOLDERS.some((p) => refreshSecret.toLowerCase().includes(p))) {
    errors.push('JWT_REFRESH_SECRET contains an insecure template placeholder in production.');
  } else if (jwtSecret && refreshSecret === jwtSecret) {
    errors.push('JWT_REFRESH_SECRET must be distinct from JWT_SECRET in production.');
  }

  const hasDatabaseUrl = Boolean(env.DATABASE_URL && env.DATABASE_URL.trim().length > 10);
  const hasDiscreteDb = Boolean(
    env.POSTGRES_HOST && env.POSTGRES_USER && env.POSTGRES_PASSWORD && env.POSTGRES_DB,
  );
  if (!hasDatabaseUrl && !hasDiscreteDb) {
    errors.push(
      'Database configuration missing in production: supply DATABASE_URL or POSTGRES_HOST/USER/PASSWORD/DB.',
    );
  }

  const corsOrigin = (env.CORS_ORIGIN || '').trim();
  if (corsOrigin === '*') {
    errors.push('CORS_ORIGIN wildcard "*" is prohibited when credentialed cookies/JWTs are enabled.');
  } else if (!corsOrigin) {
    warnings.push('CORS_ORIGIN is unset; falling back to built-in production origin allowlist.');
  }

  if (env.DB_SYNCHRONIZE === 'true') {
    errors.push('DB_SYNCHRONIZE=true is strictly forbidden in production; apply tracked migrations instead.');
  }

  return {
    valid: errors.length === 0,
    mode,
    errors,
    warnings,
  };
}

export function assertValidProductionEnv(env: NodeJS.ProcessEnv = process.env): void {
  const report = validateEnvironmentConfig(env);
  for (const w of report.warnings) {
    console.warn(`[Cambium Env Warning] ${w}`);
  }
  if (!report.valid) {
    throw new Error(`Startup environment validation failed:\n - ${report.errors.join('\n - ')}`);
  }
}

export function registerGracefulShutdown(
  app: INestApplication,
  httpServer?: { close?: (cb?: () => void) => void },
): void {
  let shuttingDown = false;
  app.enableShutdownHooks();

  const handleSignal = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[Cambium API] Received ${signal}. Draining HTTP & database connections...`);

    const forceTimer = setTimeout(() => {
      console.error('[Cambium API] Graceful shutdown timed out after 10s; forcing exit.');
      process.exit(1);
    }, 10_000);
    forceTimer.unref();

    try {
      if (httpServer && typeof httpServer.close === 'function') {
        await new Promise<void>((resolve) => httpServer.close?.(() => resolve()));
      }
      await app.close();
      clearTimeout(forceTimer);
      process.exit(0);
    } catch (err: any) {
      clearTimeout(forceTimer);
      console.error('[Cambium API] Shutdown error:', err?.message || err);
      process.exit(1);
    }
  };

  process.once('SIGTERM', () => void handleSignal('SIGTERM'));
  process.once('SIGINT', () => void handleSignal('SIGINT'));
}
