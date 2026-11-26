import { describe, it, expect } from 'vitest';
import { validateEnvironmentConfig, assertValidProductionEnv } from './env.validation';

describe('Sprint 1 Environment Startup Validation', () => {
  it('allows local development & test environments without production secrets', () => {
    const devReport = validateEnvironmentConfig({ NODE_ENV: 'development' });
    expect(devReport.valid).toBe(true);

    const testReport = validateEnvironmentConfig({ NODE_ENV: 'test' });
    expect(testReport.valid).toBe(true);
  });

  it('fails fast in production when JWT secrets, DB config, or DB_SYNCHRONIZE are unsafe', () => {
    const invalid = validateEnvironmentConfig({
      NODE_ENV: 'production',
      JWT_SECRET: 'cambium_jwt_secret_key_2026_change_in_production',
      JWT_REFRESH_SECRET: 'short',
      CORS_ORIGIN: '*',
      DB_SYNCHRONIZE: 'true',
    });

    expect(invalid.valid).toBe(false);
    expect(invalid.errors.some((e) => e.includes('JWT_SECRET'))).toBe(true);
    expect(invalid.errors.some((e) => e.includes('JWT_REFRESH_SECRET'))).toBe(true);
    expect(invalid.errors.some((e) => e.includes('Database configuration'))).toBe(true);
    expect(invalid.errors.some((e) => e.includes('CORS_ORIGIN'))).toBe(true);
    expect(invalid.errors.some((e) => e.includes('DB_SYNCHRONIZE'))).toBe(true);

    expect(() => assertValidProductionEnv({ NODE_ENV: 'production' })).toThrow(
      /Startup environment validation failed/,
    );
  });

  it('rejects identical access and refresh JWT secrets in production', () => {
    const sameSecret = 'a_very_long_distinct_random_cryptographic_secret_value_1';
    const report = validateEnvironmentConfig({
      NODE_ENV: 'production',
      JWT_SECRET: sameSecret,
      JWT_REFRESH_SECRET: sameSecret,
      DATABASE_URL: 'postgresql://user:pass@db.internal:5432/cambium',
      CORS_ORIGIN: 'https://cambium-research.vercel.app',
    });

    expect(report.valid).toBe(false);
    expect(report.errors.some((e) => e.includes('distinct'))).toBe(true);
  });

  it('passes valid production environment configuration cleanly', () => {
    const validReport = validateEnvironmentConfig({
      NODE_ENV: 'production',
      JWT_SECRET: 'prod_access_secret_9a8f7b6c5d4e3f2a1b0c9d8e',
      JWT_REFRESH_SECRET: 'prod_refresh_secret_1z2y3x4w5v6u7t8s9r0q1p2o',
      DATABASE_URL: 'postgresql://user:pass@db.supabase.co:6543/postgres',
      CORS_ORIGIN: 'https://cambium-research.vercel.app',
      DB_SYNCHRONIZE: 'false',
    });

    expect(validReport.valid).toBe(true);
    expect(validReport.errors).toHaveLength(0);
  });
});
