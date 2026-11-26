import { describe, it, expect, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {
  ADVISORY_LOCK_KEY,
  validateMigrationFiles,
  applyMigrationsWithClient,
} = require('../../../scripts/run-migrations.js');

describe('Sprint 2 Database Migration Validation & Lock Safety', () => {
  it('validates ordered NNN_*.sql migration files and non-destructive SQL integrity', () => {
    const result = validateMigrationFiles();
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.migrations.length).toBeGreaterThanOrEqual(1);
    expect(result.migrations[0].filename).toMatch(/^001_/);
  });

  it('acquires PostgreSQL advisory lock, skips matching checksums, and unlocks cleanly', async () => {
    const queries: string[] = [];
    const fakeMigrations = [
      { filename: '001_init.sql', sql: 'SELECT 1;', sha256: 'abc123' },
      { filename: '002_next.sql', sql: 'CREATE TABLE IF NOT EXISTS demo(id int);', sha256: 'def456' },
    ];

    const client = {
      query: vi.fn(async (sql: string) => {
        queries.push(sql.trim());
        if (sql.includes('FROM public.schema_migrations')) {
          return { rows: [{ filename: '001_init.sql', sha256: 'abc123' }] };
        }
        if (sql.includes("to_regclass('public.users')")) {
          return { rows: [{ users_table: 'users' }] };
        }
        return { rows: [] };
      }),
    };

    const res = await applyMigrationsWithClient(client, {
      migrations: fakeMigrations,
      bootstrapSchema: false,
    });

    expect(res.skipped).toEqual(['001_init.sql']);
    expect(res.newlyApplied).toEqual(['002_next.sql']);
    expect(queries[0]).toContain(`pg_advisory_lock`);
    expect(client.query).toHaveBeenCalledWith(`SELECT pg_advisory_lock($1);`, [ADVISORY_LOCK_KEY]);
    expect(client.query).toHaveBeenCalledWith(`SELECT pg_advisory_unlock($1);`, [ADVISORY_LOCK_KEY]);
  });

  it('aborts loudly when an applied migration checksum drifts on disk', async () => {
    const fakeMigrations = [{ filename: '001_init.sql', sql: 'SELECT 2;', sha256: 'new-hash' }];
    const client = {
      query: vi.fn(async (sql: string) => {
        if (sql.includes('FROM public.schema_migrations')) {
          return { rows: [{ filename: '001_init.sql', sha256: 'old-hash' }] };
        }
        return { rows: [] };
      }),
    };

    await expect(
      applyMigrationsWithClient(client, {
        migrations: fakeMigrations,
        bootstrapSchema: false,
      }),
    ).rejects.toThrow(/Migration checksum mismatch/);

    // Must still release advisory lock in finally
    expect(client.query).toHaveBeenCalledWith(`SELECT pg_advisory_unlock($1);`, [ADVISORY_LOCK_KEY]);
  });
});
