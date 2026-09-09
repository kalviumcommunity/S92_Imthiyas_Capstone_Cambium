const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDatabase() {
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const user = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || 'postgres';
  const targetDb = process.env.POSTGRES_DB || 'cambium';

  console.log(`Connecting to maintenance database 'postgres' as user '${user}'...`);

  const maintenanceClient = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
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
    console.error('Database creation error:', err.message);
    throw err;
  } finally {
    await maintenanceClient.end();
  }

  // Connect to targetDb to check extensions
  const dbClient = new Client({
    host,
    port,
    user,
    password,
    database: targetDb,
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
