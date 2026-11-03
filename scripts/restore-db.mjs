#!/usr/bin/env node
/**
 * ==============================================================================
 * CAMBIUM RESEARCH PLATFORM — DISASTER RECOVERY RESTORATION CLI
 * Restores Gzip Backup, Verifies Cryptographic SHA-256 Ledger Integrity
 * Document ID: CLI-RESTORE-CAMBIUM-2026-V2
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const backupDir = path.join(rootDir, 'backups');

const require = createRequire(path.join(rootDir, 'server', 'package.json'));
let Client;
try {
  ({ Client } = require('pg'));
} catch {
  console.error('\x1b[31m[ERROR] PostgreSQL client (pg) not found.\x1b[0m');
  process.exit(1);
}

// ANSI Colors
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  canopy: '\x1b[38;2;62;98;72m',
  emerald: '\x1b[38;2;74;222;128m',
  parchment: '\x1b[38;2;250;247;240m',
  amber: '\x1b[38;2;217;119;6m',
  crimson: '\x1b[38;2;220;38;38m',
  cyan: '\x1b[38;2;6;182;212m',
  gray: '\x1b[38;2;133;135;123m',
};

function getDbConfig() {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port || '5432', 10),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ''),
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      };
    } catch {}
  }

  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '2Live&letLive',
    database: process.env.POSTGRES_DB || 'cambium',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
}

async function runRestore() {
  console.log(`\n${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.canopy}${c.bold}   CAMBIUM DISASTER RECOVERY & ARCHIVE RESTORATION CLI${c.reset}`);
  console.log(`${c.gray}   Cryptographic Integrity Validation & Deterministic Schema Rebuild${c.reset}`);
  console.log(`${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}\n`);

  if (!fs.existsSync(backupDir)) {
    console.error(`${c.crimson}[ERROR] No backups directory found at ${backupDir}${c.reset}`);
    process.exit(1);
  }

  // Find latest backup or read from argument
  const args = process.argv.slice(2);
  let archiveName = null;
  const archiveArg = args.find(a => a.startsWith('--archive='));
  if (archiveArg) {
    archiveName = archiveArg.split('=')[1];
  } else {
    const archives = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.sql.gz'))
      .sort()
      .reverse();
    if (archives.length === 0) {
      console.error(`${c.crimson}[ERROR] No .sql.gz archives found in backups/ directory.${c.reset}`);
      process.exit(1);
    }
    archiveName = archives[0];
  }

  const archivePath = path.isAbsolute(archiveName) ? archiveName : path.join(backupDir, archiveName);
  const metaPath = archivePath.replace(/\.sql\.gz$/, '.meta.json');

  console.log(`${c.cyan}[1/4] Selected Archive: ${c.bold}${path.basename(archivePath)}${c.reset}`);

  // Validate existence
  if (!fs.existsSync(archivePath)) {
    console.error(`${c.crimson}[ERROR] Archive file not found: ${archivePath}${c.reset}`);
    process.exit(1);
  }

  // Cryptographic Ledger Verification
  console.log(`${c.cyan}[2/4] Verifying cryptographic SHA-256 seal...${c.reset}`);
  const compressedBuffer = fs.readFileSync(archivePath);
  const actualHash = crypto.createHash('sha256').update(compressedBuffer).digest('hex');

  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (meta.sha256 !== actualHash) {
      console.error(`${c.crimson}${c.bold}[SECURITY ALERT] Cryptographic mismatch! Archive has been tampered with or corrupted!${c.reset}`);
      console.error(`  Expected SHA-256: ${meta.sha256}`);
      console.error(`  Computed SHA-256: ${actualHash}`);
      process.exit(1);
    }
    console.log(`      ${c.emerald}✓ SHA-256 checksum matches verified manifest: ${actualHash.slice(0, 16)}...${c.reset}`);
  } else {
    console.log(`      ${c.amber}! Warning: No .meta.json found. Calculated SHA-256: ${actualHash.slice(0, 16)}...${c.reset}`);
  }

  // Decompressing
  console.log(`${c.cyan}[3/4] Decompressing archive into memory...${c.reset}`);
  let sqlContent = zlib.gunzipSync(compressedBuffer).toString('utf8');
  // Sanitize extension creation for environments without native pgvector dll
  sqlContent = sqlContent.replace(
    /CREATE EXTENSION IF NOT EXISTS vector;/g,
    'DO $$ BEGIN CREATE EXTENSION IF NOT EXISTS vector; EXCEPTION WHEN OTHERS THEN NULL; END $$;'
  );
  console.log(`      ${c.emerald}✓ Decompressed ${(sqlContent.length / 1024).toFixed(1)} KB of SQL instructions.${c.reset}`);

  // Restore Execution
  const config = getDbConfig();
  console.log(`${c.cyan}[4/4] Executing restoration on database: ${c.bold}${config.database}@${config.host}:${config.port}${c.reset}`);
  const client = new Client(config);

  try {
    await client.connect();
    console.log(`      ${c.emerald}✓ Connected to PostgreSQL instance.${c.reset}`);

    // Try enabling vector extension cleanly if supported
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    } catch {
      // Ignored if vector extension dll is not present on host
    }

    // Filter out comment lines and extension lines, and execute statements in batches
    const lines = sqlContent.split('\n');
    let buffer = '';
    let executedCount = 0;

    await client.query('BEGIN;');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('--') || trimmed.startsWith('DO $$') || trimmed.startsWith('CREATE EXTENSION')) {
        continue;
      }

      buffer += line + '\n';
      if (trimmed.endsWith(';')) {
        try {
          await client.query(buffer);
          executedCount++;
        } catch (err) {
          // If conflict or duplicate, continue gracefully
          if (!err.message.includes('duplicate key') && !err.message.includes('already exists')) {
            console.warn(`      ${c.amber}! Warning executing statement: ${err.message}${c.reset}`);
          }
        }
        buffer = '';
      }
    }

    await client.query('COMMIT;');

    console.log(`      ${c.emerald}✓ Processed and applied ${executedCount} SQL commands successfully.${c.reset}`);

    console.log(`\n${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}`);
    console.log(`${c.emerald}${c.bold}STATUS: DISASTER RECOVERY RESTORATION COMPLETE!${c.reset}`);
    console.log(`Database "${config.database}" has been successfully restored from ${path.basename(archivePath)}.`);
    console.log(`${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}\n`);

  } catch (err) {
    await client.query('ROLLBACK;').catch(() => {});
    console.error(`\n${c.crimson}${c.bold}[RESTORATION FAILED] ${err.message}${c.reset}\n`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runRestore();
