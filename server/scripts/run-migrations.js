const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ADVISORY_LOCK_KEY = 8842019;

function loadEnv() {
  const localEnv = path.join(__dirname, '../.env');
  const parentEnv = path.join(__dirname, '../../.env');
  if (fs.existsSync(localEnv)) {
    require('dotenv').config({ path: localEnv });
  } else if (fs.existsSync(parentEnv)) {
    require('dotenv').config({ path: parentEnv });
  } else {
    require('dotenv').config();
  }
}

function getMigrationsDir(customDir) {
  return customDir || path.join(__dirname, '../src/database/migrations');
}

function getSchemaPath() {
  return path.join(__dirname, '../src/database/schema.sql');
}

function computeMigrationSha256(content) {
  return crypto
    .createHash('sha256')
    .update(String(content).replace(/\r\n/g, '\n'), 'utf8')
    .digest('hex');
}

function listOrderedMigrations(migrationsDir = getMigrationsDir()) {
  if (!fs.existsSync(migrationsDir)) return [];
  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .map((filename) => {
      const fullPath = path.join(migrationsDir, filename);
      const sql = fs.readFileSync(fullPath, 'utf8');
      return {
        filename,
        fullPath,
        sql,
        sha256: computeMigrationSha256(sql),
      };
    });
}

function validateMigrationFiles(migrationsDir = getMigrationsDir()) {
  const schemaPath = getSchemaPath();
  const errors = [];
  if (!fs.existsSync(schemaPath)) {
    errors.push(`Authoritative schema.sql not found at ${schemaPath}`);
  }

  const migrations = listOrderedMigrations(migrationsDir);
  if (migrations.length === 0) {
    errors.push(`No *.sql files found inside ${migrationsDir}`);
  }

  const seenPrefixes = new Set();
  for (const m of migrations) {
    const prefixMatch = m.filename.match(/^(\d{3})_[a-z0-9_]+\.sql$/);
    if (!prefixMatch) {
      errors.push(`Invalid migration filename format "${m.filename}" (expected NNN_snake_case.sql)`);
    } else if (seenPrefixes.has(prefixMatch[1])) {
      errors.push(`Duplicate migration sequence prefix "${prefixMatch[1]}" in ${m.filename}`);
    } else {
      seenPrefixes.add(prefixMatch[1]);
    }

    if (!m.sql.trim()) {
      errors.push(`Migration file "${m.filename}" is empty.`);
    }

    if (/\bDROP\s+DATABASE\b/i.test(m.sql)) {
      errors.push(`Forbidden DROP DATABASE statement detected in "${m.filename}".`);
    }
  }

  return {
    valid: errors.length === 0,
    migrations,
    errors,
  };
}

function resolveDbConnectionConfig(env = process.env) {
  let host = env.POSTGRES_HOST || 'localhost';
  let port = parseInt(env.POSTGRES_PORT || '5432', 10);
  let user = env.POSTGRES_USER || 'postgres';
  let password = env.POSTGRES_PASSWORD;
  let database = env.POSTGRES_DB || 'cambium';

  if (env.DATABASE_URL) {
    try {
      const parsed = new URL(env.DATABASE_URL);
      if (parsed.hostname) host = parsed.hostname;
      if (parsed.port) port = parseInt(parsed.port, 10);
      if (parsed.username) user = decodeURIComponent(parsed.username);
      if (parsed.password) password = decodeURIComponent(parsed.password);
      if (parsed.pathname && parsed.pathname.length > 1) {
        database = parsed.pathname.replace(/^\//, '');
      }
    } catch {
      // Fallback to discrete vars
    }
  }

  if (!env.DATABASE_URL && !password) {
    throw new Error('DATABASE_URL or POSTGRES_PASSWORD must be provided to run migrations.');
  }

  const isProd = env.NODE_ENV === 'production';
  const isSsl =
    env.DB_SSL === 'true' ||
    (isProd && env.DB_SSL !== 'false' && host !== 'localhost' && host !== '127.0.0.1');

  const rejectUnauthorized = env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
  return {
    host,
    port,
    user,
    password: password || 'postgres',
    database,
    ssl: isSsl ? { rejectUnauthorized } : undefined,
  };
}

async function applyMigrationsWithClient(client, options = {}) {
  const migrations = options.migrations || listOrderedMigrations(options.migrationsDir);
  const schemaPath = options.schemaPath || getSchemaPath();
  const statusOnly = Boolean(options.statusOnly);

  await client.query(`SELECT pg_advisory_lock($1);`, [ADVISORY_LOCK_KEY]);
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.schema_migrations (
        filename VARCHAR(255) PRIMARY KEY,
        sha256 VARCHAR(64) NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const appliedRes = await client.query(
      `SELECT filename, sha256, applied_at FROM public.schema_migrations ORDER BY filename ASC;`,
    );
    const appliedMap = new Map(appliedRes.rows.map((r) => [r.filename, r]));

    if (statusOnly) {
      return {
        applied: appliedRes.rows,
        pending: migrations.filter((m) => !appliedMap.has(m.filename)).map((m) => m.filename),
      };
    }

    // Bootstrap baseline schema.sql if database has no users table yet
    if (options.bootstrapSchema !== false && fs.existsSync(schemaPath)) {
      const tableCheck = await client.query(
        `SELECT to_regclass('public.users') AS users_table;`,
      );
      if (!tableCheck.rows[0]?.users_table) {
        const baselineSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query('BEGIN;');
        try {
          await client.query(baselineSql);
          await client.query(
            `INSERT INTO public.schema_migrations (filename, sha256) VALUES ($1, $2) ON CONFLICT (filename) DO NOTHING;`,
            ['000_schema_baseline.sql', computeMigrationSha256(baselineSql)],
          );
          await client.query('COMMIT;');
        } catch (err) {
          await client.query('ROLLBACK;');
          throw err;
        }
      }
    }

    const newlyApplied = [];
    const skipped = [];

    for (const mig of migrations) {
      const existing = appliedMap.get(mig.filename);
      if (existing) {
        if (existing.sha256 !== mig.sha256) {
          throw new Error(
            `Migration checksum mismatch for ${mig.filename} (DB: ${existing.sha256}, Disk: ${mig.sha256}). Refusing unsafe execution.`,
          );
        }
        skipped.push(mig.filename);
        continue;
      }

      await client.query('BEGIN;');
      try {
        await client.query(mig.sql);
        await client.query(
          `INSERT INTO public.schema_migrations (filename, sha256) VALUES ($1, $2);`,
          [mig.filename, mig.sha256],
        );
        await client.query('COMMIT;');
        newlyApplied.push(mig.filename);
      } catch (err) {
        await client.query('ROLLBACK;');
        throw err;
      }
    }

    return { newlyApplied, skipped };
  } finally {
    await client.query(`SELECT pg_advisory_unlock($1);`, [ADVISORY_LOCK_KEY]);
  }
}

async function main() {
  loadEnv();
  const args = process.argv.slice(2);
  const verifyOnly = args.includes('--verify-only');
  const statusOnly = args.includes('--status');

  const validation = validateMigrationFiles();
  if (!validation.valid) {
    console.error('[Cambium Migrations FAIL]', validation.errors.join('\n'));
    process.exit(1);
  }

  console.log(
    `[Cambium Migrations] Validated ${validation.migrations.length} migration file(s): ${validation.migrations.map((m) => m.filename).join(', ')}`,
  );

  if (verifyOnly) {
    for (const m of validation.migrations) {
      console.log(`  - ${m.filename} (sha256:${m.sha256.slice(0, 12)})`);
    }
    return;
  }

  const client = new Client(resolveDbConnectionConfig(process.env));
  await client.connect();
  try {
    const result = await applyMigrationsWithClient(client, { statusOnly });
    if (statusOnly) {
      console.log('Applied:', result.applied.map((r) => r.filename));
      console.log('Pending:', result.pending);
    } else {
      console.log(
        `[Cambium Migrations PASS] Newly applied: ${result.newlyApplied.length}, Skipped (already applied): ${result.skipped.length}`,
      );
    }
  } finally {
    await client.end();
  }
}

module.exports = {
  ADVISORY_LOCK_KEY,
  computeMigrationSha256,
  listOrderedMigrations,
  validateMigrationFiles,
  resolveDbConnectionConfig,
  applyMigrationsWithClient,
};

if (require.main === module) {
  main().catch((err) => {
    console.error('[Cambium Migrations ERROR]', err.message);
    process.exit(1);
  });
}
