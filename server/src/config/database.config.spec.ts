import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getDatabaseConfig } from './database.config';

const originalEnvironment = {
  NODE_ENV: process.env.NODE_ENV,
  DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
};

describe('getDatabaseConfig schema synchronization', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    delete process.env.DB_SYNCHRONIZE;
  });

  afterEach(() => {
    if (originalEnvironment.NODE_ENV === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalEnvironment.NODE_ENV;
    }

    if (originalEnvironment.DB_SYNCHRONIZE === undefined) {
      delete process.env.DB_SYNCHRONIZE;
    } else {
      process.env.DB_SYNCHRONIZE = originalEnvironment.DB_SYNCHRONIZE;
    }
  });

  it('disables synchronization by default in development', () => {
    expect(getDatabaseConfig().synchronize).toBe(false);
  });

  it('allows explicit synchronization in development', () => {
    process.env.DB_SYNCHRONIZE = 'true';
    expect(getDatabaseConfig().synchronize).toBe(true);
  });

  it('never synchronizes the production schema, even when explicitly enabled', () => {
    process.env.NODE_ENV = 'production';
    process.env.DB_SYNCHRONIZE = 'true';
    expect(getDatabaseConfig().synchronize).toBe(false);
  });
});
