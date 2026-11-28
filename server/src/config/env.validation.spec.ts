import { describe, it, expect } from 'vitest';
import { validateStartupEnvironment } from './env.validation';

describe('validateStartupEnvironment', () => {
  it('passes in development with warnings when secrets are omitted', () => {
    const result = validateStartupEnvironment({ NODE_ENV: 'development' });
    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('fails fast in production when JWT secrets or DATABASE_URL are missing', () => {
    expect(() =>
      validateStartupEnvironment({
        NODE_ENV: 'production',
      }),
    ).toThrow(/Missing required production environment variable: JWT_SECRET/);
  });

  it('fails in production if DB_SYNCHRONIZE=true or wildcard CORS_ORIGIN is set', () => {
    expect(() =>
      validateStartupEnvironment({
        NODE_ENV: 'production',
        JWT_SECRET: 'a'.repeat(64),
        JWT_REFRESH_SECRET: 'b'.repeat(64),
        DATABASE_URL: 'postgresql://user:pass@db.example.com:5432/cambium',
        DB_SYNCHRONIZE: 'true',
        CORS_ORIGIN: '*',
      }),
    ).toThrow(/DB_SYNCHRONIZE=true is forbidden in production/);
  });

  it('passes in production when valid secrets and explicit CORS_ORIGIN are provided', () => {
    const result = validateStartupEnvironment({
      NODE_ENV: 'production',
      JWT_SECRET: 'a'.repeat(64),
      JWT_REFRESH_SECRET: 'b'.repeat(64),
      DATABASE_URL: 'postgresql://user:pass@db.example.com:5432/cambium',
      DB_SYNCHRONIZE: 'false',
      CORS_ORIGIN: 'https://cambium-research.vercel.app',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
