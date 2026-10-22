const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runSchema() {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '2Live&letLive',
    database: process.env.POSTGRES_DB || 'cambium',
  });

  await client.connect();
  console.log('✅ Connected to cambium database.');

  const schemaPath = path.join(__dirname, '../src/database/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  try {
    await client.query(sql);
    console.log('✅ schema.sql executed successfully!');
  } catch (err) {
    console.error('Error executing schema:', err.message);
  } finally {
    await client.end();
  }
}

runSchema();
