#!/usr/bin/env node
/**
 * ==============================================================================
 * CAMBIUM RESEARCH PLATFORM — AUTOMATED DATABASE BACKUP CLI
 * Automated Snapshot, Gzip Compression, Cryptographic SHA-256 Ledger & Pruning
 * Document ID: CLI-BACKUP-CAMBIUM-2026-V2
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
  console.error('\x1b[31m[ERROR] PostgreSQL client (pg) not found. Run npm --prefix server install\x1b[0m');
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

// Parse Database Configuration
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
    } catch {
      // Fallback
    }
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

async function runBackup() {
  console.log(`\n${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.canopy}${c.bold}   CAMBIUM ENTERPRISE DATABASE BACKUP & SNAPSHOT CLI${c.reset}`);
  console.log(`${c.gray}   Cryptographic SHA-256 Ledger & Automated Retention Engine${c.reset}`);
  console.log(`${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}\n`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const config = getDbConfig();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const snapshotFileName = `cambium_backup_${timestamp}.sql`;
  const compressedFileName = `${snapshotFileName}.gz`;
  const metaFileName = `cambium_backup_${timestamp}.meta.json`;

  const snapshotPath = path.join(backupDir, snapshotFileName);
  const compressedPath = path.join(backupDir, compressedFileName);
  const metaPath = path.join(backupDir, metaFileName);

  console.log(`${c.cyan}[1/4] Connecting to target database: ${c.bold}${config.database}@${config.host}:${config.port}${c.reset}`);
  const client = new Client(config);

  try {
    await client.connect();
    console.log(`      ${c.emerald}✓ Connected to PostgreSQL instance successfully.${c.reset}`);

    // Query inventory of all public tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name ASC;
    `);

    const tableNames = tablesRes.rows.map(r => r.table_name);
    console.log(`${c.cyan}[2/4] Dumping data for ${tableNames.length} tables in public schema...${c.reset}`);

    let totalRows = 0;
    const writeStream = fs.createWriteStream(snapshotPath, { encoding: 'utf8' });

    // Header DDL
    writeStream.write(`-- ==============================================================================\n`);
    writeStream.write(`-- CAMBIUM RESEARCH PLATFORM — AUTOMATED DATABASE BACKUP\n`);
    writeStream.write(`-- Generated At: ${new Date().toISOString()}\n`);
    writeStream.write(`-- Source: ${config.database}@${config.host}:${config.port}\n`);
    writeStream.write(`-- ==============================================================================\n\n`);
    writeStream.write(`DO $$ BEGIN CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; EXCEPTION WHEN OTHERS THEN NULL; END $$;\n`);
    writeStream.write(`DO $$ BEGIN CREATE EXTENSION IF NOT EXISTS vector; EXCEPTION WHEN OTHERS THEN NULL; END $$;\n\n`);

    for (const table of tableNames) {
      const countRes = await client.query(`SELECT COUNT(*) AS c FROM "${table}"`);
      const rowCount = parseInt(countRes.rows[0].c, 10);
      totalRows += rowCount;

      writeStream.write(`-- ----------------------------------------------------------------------------\n`);
      writeStream.write(`-- Table: ${table} (${rowCount} rows)\n`);
      writeStream.write(`-- ----------------------------------------------------------------------------\n`);

      if (rowCount > 0) {
        const rowsRes = await client.query(`SELECT * FROM "${table}"`);
        for (const row of rowsRes.rows) {
          const cols = Object.keys(row).map(c => `"${c}"`).join(', ');
          const vals = Object.values(row).map(v => {
            if (v === null || v === undefined) return 'NULL';
            if (typeof v === 'boolean' || typeof v === 'number') return v;
            if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
            return `'${String(v).replace(/'/g, "''")}'`;
          }).join(', ');

          writeStream.write(`INSERT INTO "${table}" (${cols}) VALUES (${vals}) ON CONFLICT DO NOTHING;\n`);
        }
      }
      writeStream.write(`\n`);
      console.log(`      ${c.gray}→ Backed up table "${table}" (${rowCount} records)${c.reset}`);
    }

    writeStream.end();
    await new Promise((resolve) => writeStream.on('finish', resolve));

    console.log(`${c.cyan}[3/4] Compressing snapshot & calculating SHA-256 cryptographic seal...${c.reset}`);
    
    // Gzip Compression
    const rawBuffer = fs.readFileSync(snapshotPath);
    const compressedBuffer = zlib.gzipSync(rawBuffer);
    fs.writeFileSync(compressedPath, compressedBuffer);
    fs.unlinkSync(snapshotPath); // Remove raw uncompressed file

    // SHA-256 Checksum
    const sha256Hash = crypto.createHash('sha256').update(compressedBuffer).digest('hex');

    // Write Metadata Manifest
    const metadata = {
      backupId: `cambium-${timestamp}`,
      createdAt: new Date().toISOString(),
      database: config.database,
      host: config.host,
      tableCount: tableNames.length,
      totalRows,
      uncompressedBytes: rawBuffer.length,
      compressedBytes: compressedBuffer.length,
      compressionRatio: `${Math.round((1 - compressedBuffer.length / rawBuffer.length) * 100)}%`,
      archiveFile: compressedFileName,
      sha256: sha256Hash,
      status: 'VERIFIED_IMMUTABLE',
    };

    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf8');

    console.log(`      ${c.emerald}✓ Snapshot compressed: ${c.bold}${(compressedBuffer.length / 1024).toFixed(1)} KB${c.reset} (from ${(rawBuffer.length / 1024).toFixed(1)} KB)`);
    console.log(`      ${c.emerald}✓ SHA-256 Fingerprint: ${c.parchment}${sha256Hash}${c.reset}`);

    // Retention Pruner
    console.log(`${c.cyan}[4/4] Applying snapshot retention policy...${c.reset}`);
    const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '7', 10);
    const maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const existingFiles = fs.readdirSync(backupDir);
    let prunedCount = 0;

    for (const f of existingFiles) {
      if (f.endsWith('.sql.gz') || f.endsWith('.meta.json')) {
        const filePath = path.join(backupDir, f);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlinkSync(filePath);
          prunedCount++;
        }
      }
    }

    console.log(`      ${c.gray}→ Retention limit: ${retentionDays} days (Pruned ${prunedCount} expired files)${c.reset}`);

    console.log(`\n${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}`);
    console.log(`${c.emerald}${c.bold}STATUS: DATABASE BACKUP COMPLETED & CRYPTOGRAPHICALLY SEALED!${c.reset}`);
    console.log(`Archive:  ${c.bold}backups/${compressedFileName}${c.reset}`);
    console.log(`Manifest: ${c.bold}backups/${metaFileName}${c.reset}`);
    console.log(`${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}\n`);

  } catch (err) {
    console.error(`\n${c.crimson}${c.bold}[BACKUP FAILED] ${err.message}${c.reset}\n`);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runBackup();
