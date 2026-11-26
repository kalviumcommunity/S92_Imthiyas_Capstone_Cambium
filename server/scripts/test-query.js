const { Client } = require('pg');
require('dotenv').config({ path: __dirname + '/../.env' });

async function testQuery() {
  const password = process.env.POSTGRES_PASSWORD;
  if (!process.env.DATABASE_URL && !password) {
    throw new Error('Set DATABASE_URL or POSTGRES_PASSWORD in environment before running test-query.js');
  }

  const client = new Client(
    process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          host: process.env.POSTGRES_HOST || 'localhost',
          port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
          user: process.env.POSTGRES_USER || 'postgres',
          password,
          database: process.env.POSTGRES_DB || 'cambium',
        },
  );

  await client.connect();
  console.log('Connected to DB.');

  try {
    const res = await client.query('SELECT id, title, type, organization FROM research_opportunities LIMIT 2;');
    console.log('Result:', res.rows);
  } catch (err) {
    console.error('Query Error:', err);
  } finally {
    await client.end();
  }
}

testQuery();
