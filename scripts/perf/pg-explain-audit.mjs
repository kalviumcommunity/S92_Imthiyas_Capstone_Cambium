#!/usr/bin/env node
/**
 * PostgreSQL EXPLAIN (ANALYZE, BUFFERS) Query Plan Inspector.
 * Safely verifies index utilization across core Cambium queries on local/CI PostgreSQL.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.join(process.cwd(), 'server', 'package.json'));
const { Client } = require('pg');
const dotenv = require('dotenv');

const serverEnv = path.join(process.cwd(), 'server', '.env');
if (fs.existsSync(serverEnv)) dotenv.config({ path: serverEnv });

const host = process.env.POSTGRES_HOST || 'localhost';
if (!['localhost', '127.0.0.1', '::1'].includes(host) && process.env.ALLOW_NONLOCAL_BENCH !== 'true') {
  throw new Error(`Safety guard: refusing EXPLAIN audit against remote DB host (${host})`);
}

const QUERIES = [
  {
    name: 'Opportunities filtered catalog sort (type + created_at)',
    sql: `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
          SELECT id, title, type, organization, created_at
          FROM research_opportunities
          WHERE type = 'Grant'
          ORDER BY created_at DESC LIMIT 25`,
  },
  {
    name: 'Opportunities GIN full-text search (idx_opps_fts)',
    sql: `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
          SELECT id, title, organization
          FROM research_opportunities
          WHERE to_tsvector('english', title || ' ' || COALESCE(description, ''))
                @@ websearch_to_tsquery('english', 'climate')
          LIMIT 20`,
  },
  {
    name: 'Upcoming deadlines partial index scan',
    sql: `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
          SELECT id, title, deadline
          FROM research_opportunities
          WHERE deadline >= NOW()
          ORDER BY deadline ASC LIMIT 50`,
  },
  {
    name: 'User notifications inbox sort (idx_notif_user_created)',
    sql: `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
          SELECT id, title, is_read, created_at
          FROM notifications
          ORDER BY created_at DESC LIMIT 25`,
  },
];

function collectNodes(node, out = []) {
  if (!node) return out;
  out.push(node['Node Type'] + (node['Index Name'] ? `(${node['Index Name']})` : ''));
  for (const child of node.Plans || []) collectNodes(child, out);
  return out;
}

async function main() {
  const client = new Client({
    host,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'cambium',
    connectionTimeoutMillis: 3000,
  });

  try {
    await client.connect();
    const results = [];
    for (const q of QUERIES) {
      try {
        const res = await client.query(q.sql);
        const plan = res.rows[0]?.['QUERY PLAN']?.[0];
        results.push({
          name: q.name,
          status: 'EXPLAINED',
          executionTimeMs: plan?.['Execution Time'] ?? null,
          planningTimeMs: plan?.['Planning Time'] ?? null,
          planNodes: collectNodes(plan?.Plan),
        });
      } catch (err) {
        results.push({ name: q.name, status: 'SKIPPED_OR_MISSING_SCHEMA', error: err.message });
      }
    }
    console.log(JSON.stringify({ database: process.env.POSTGRES_DB || 'cambium', host, results }, null, 2));
  } catch (err) {
    console.log(JSON.stringify({ connected: false, host, reason: err.message }, null, 2));
  } finally {
    await client.end().catch(() => {});
  }
}

main();
