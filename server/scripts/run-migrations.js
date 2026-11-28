const { Client } = require('pg');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const localEnv = path.join(__dirname, '../.env');
const parentEnv = path.join(__dirname, '../../.env');
if (fs.existsSync(localEnv)) {
  require('dotenv').config({ path: localEnv });
} else if (fs.existsSync(parentEnv)) {
  require('dotenv').config({ path: parentEnv });
} else {
  require('dotenv').config();
}

function buildPgClient() {
  let host = process.env.POSTGRES_HOST || 'localhost';
  let port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  let user = process.env.POSTGRES_USER || 'postgres';
  let password = process.env.POSTGRES_PASSWORD || 'postgres';
  let database = process.env.POSTGRES_DB || 'cambium';

  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      if (parsed.hostname) host = parsed.hostname;
      if (parsed.port) port = parseInt(parsed.port, 10);
      if (parsed.username) user = decodeURIComponent(parsed.username);
      if (parsed.password) password = decodeURIComponent(parsed.password);
      if (parsed.pathname && parsed.pathname.length > 1) {
        database = parsed.pathname.replace(/^\//, '');
      }
    } catch {
      // Fallback to discrete parameters
    }
  }

  const isProd = process.env.NODE_ENV === 'production';
  const isSsl =
    process.env.DB_SSL === 'true' ||
    (isProd &&
      process.env.DB_SSL !== 'false' &&
      host !== 'localhost' &&
      host !== '127.0.0.1');

  return {
    database,
    client: new Client({
      host,
      port,
      user,
      password,
      database,
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
    }),
  };
}

function sha256(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

async function runMigrations() {
  const statusOnly = process.argv.includes('--status');
  const migrationsDir = path.join(__dirname, '../src/database/migrations');

  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found; nothing to apply.');
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const { client, database } = buildPgClient();
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        checksum TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const existing = await client.query(
      'SELECT version, checksum, applied_at FROM schema_migrations ORDER BY version ASC',
    );
    const appliedMap = new Map(existing.rows.map((r) => [r.version, r]));

    let appliedNow = 0;
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      const checksum = sha256(sql);
      const record = appliedMap.get(file);

      if (record) {
        if (record.checksum !== checksum) {
          throw new Error(
            `Migration drift detected for ${file}: recorded checksum ${record.checksum} != current ${checksum}`,
          );
        }
        console.log(`  [APPLIED] ${file}`);
        continue;
      }

      if (statusOnly) {
        console.log(`  [PENDING] ${file}`);
        continue;
      }

      console.log(`  [APPLYING] ${file}...`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)',
          [file, checksum],
        );
        await client.query('COMMIT');
        appliedNow += 1;
        console.log(`  [DONE] ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${file} failed and was rolled back: ${err.message}`);
      }
    }

    if (!statusOnly) {
      console.log(
        `✅ Migration run complete on '${database}' (${appliedNow} newly applied, ${files.length} total tracked).`,
      );
    }
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runMigrations().catch((err) => {
    console.error('❌ Migration execution failed:', err.message);
    process.exit(1);
  });
}

module.exports = runMigrations;
