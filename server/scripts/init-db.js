const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

const localEnv = path.join(__dirname, '../.env');
const parentEnv = path.join(__dirname, '../../.env');
if (fs.existsSync(localEnv)) {
  require('dotenv').config({ path: localEnv });
} else if (fs.existsSync(parentEnv)) {
  require('dotenv').config({ path: parentEnv });
} else {
  require('dotenv').config();
}

async function initDatabase() {
  let host = process.env.POSTGRES_HOST || 'localhost';
  let port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  let user = process.env.POSTGRES_USER || 'postgres';
  let password = process.env.POSTGRES_PASSWORD || 'postgres';
  let targetDb = process.env.POSTGRES_DB || 'cambium';

  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      if (parsed.hostname) host = parsed.hostname;
      if (parsed.port) port = parseInt(parsed.port, 10);
      if (parsed.username) user = decodeURIComponent(parsed.username);
      if (parsed.password) password = decodeURIComponent(parsed.password);
      if (parsed.pathname && parsed.pathname.length > 1) {
        targetDb = parsed.pathname.replace(/^\//, '');
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

  console.log(`Connecting to maintenance database 'postgres' at ${host}:${port} as user '${user}'...`);

  const maintenanceClient = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
    ssl: sslOption,
  });

  try {
    await maintenanceClient.connect();
    console.log('✅ Connected to maintenance database.');

    const res = await maintenanceClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDb]
    );

    if (res.rowCount === 0) {
      console.log(`Creating target database '${targetDb}'...`);
      await maintenanceClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`✅ Database '${targetDb}' created successfully!`);
    } else {
      console.log(`✅ Database '${targetDb}' already exists.`);
    }
  } catch (err) {
    console.error('Database creation/maintenance error:', err.message);
    // On managed databases like Supabase/Neon, creating database via maintenance client might not be permitted
    console.log('ℹ️ Proceeding to connect to target database directly...');
  } finally {
    try {
      await maintenanceClient.end();
    } catch {}
  }

  // Connect to targetDb to check extensions and apply schema
  const dbClient = new Client({
    host,
    port,
    user,
    password,
    database: targetDb,
    ssl: sslOption,
  });

  try {
    await dbClient.connect();
    await dbClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('✅ Extension uuid-ossp enabled.');
    try {
      await dbClient.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('✅ Extension pgvector enabled.');
    } catch (vErr) {
      console.log('ℹ️ Note on vector extension:', vErr.message);
    }

    const schemaPath = path.join(__dirname, '../src/database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('⚙️ Applying initial schema definitions from schema.sql...');
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await dbClient.query(sql);
      console.log('✅ Initial database schema and pgvector indexes applied.');
    }
  } finally {
    await dbClient.end();
  }
}

if (require.main === module) {
  initDatabase().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = initDatabase;
