const { Client } = require('pg');
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

async function runSchema() {
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
    } catch (e) {
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
  const sslOption = isSsl ? { rejectUnauthorized: false } : undefined;

  console.log(`Connecting to '${database}' at ${host}:${port} as '${user}'...`);

  const client = new Client({
    host,
    port,
    user,
    password,
    database,
    ssl: sslOption,
  });

  try {
    await client.connect();
    console.log(`✅ Connected to database '${database}'.`);

    const schemaPath = path.join(__dirname, '../src/database/schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }

    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('⚙️  Applying authoritative schema.sql (3NF Normalized Tables + pgvector HNSW)...');

    await client.query(sql);
    console.log('✅ schema.sql executed successfully! All 18 relational tables and pgvector indexes synchronized.');
  } catch (err) {
    console.error('❌ Error executing schema:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runSchema().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = runSchema;
