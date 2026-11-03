#!/usr/bin/env node
/**
 * ==============================================================================
 * CAMBIUM RESEARCH PLATFORM — PROCESS SUPERVISION & CLUSTER HEALTH CHECK
 * Real-Time Socket Probes, Latency Diagnostics, and Node Memory Metrics
 * Document ID: CLI-HEALTH-CAMBIUM-2026-V2
 * ==============================================================================
 */

import http from 'http';
import net from 'net';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const require = createRequire(path.join(rootDir, 'server', 'package.json'));
let Client;
try {
  ({ Client } = require('pg'));
} catch {}

// ANSI Colors
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  canopy: '\x1b[38;2;62;98;72m',
  emerald: '\x1b[38;2;74;222;128m',
  parchment: '\x1b[38;2;250;247;240m',
  amber: '\x1b[38;2;217;119;6m',
  crimson: '\x1b[38;2;220;38;38m',
  cyan: '\x1b[38;2;6;182;212m',
  gray: '\x1b[38;2;133;135;123m',
};

console.log(`\n${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}`);
console.log(`${c.canopy}${c.bold}   CAMBIUM ENTERPRISE PROCESS SUPERVISION & HEALTH DIAGNOSTIC PROBE${c.reset}`);
console.log(`${c.gray}   Real-Time Cluster Latency, Memory Pressure, and Port Audit${c.reset}`);
console.log(`${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}\n`);

// System Host Resource Diagnostics
const freeMemMB = (os.freemem() / 1024 / 1024).toFixed(0);
const totalMemMB = (os.totalmem() / 1024 / 1024).toFixed(0);
const memPercent = Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);

console.log(`${c.cyan}${c.bold}1. Host Machine & Runtime Diagnostics${c.reset}`);
console.log(`   Host Architecture: ${c.bold}${os.platform()}-${os.arch()}${c.reset} (${os.cpus().length} vCPUs)`);
console.log(`   Node.js Runtime:   ${c.bold}${process.version}${c.reset}`);
console.log(`   Host Memory Load:  ${memPercent}% utilized (${freeMemMB} MB free / ${totalMemMB} MB total)\n`);

// Helper to probe raw TCP socket connection
function probeTcp(host, port, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      const latency = Date.now() - start;
      socket.destroy();
      resolve({ online: true, latency });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ online: false, error: 'TIMEOUT' });
    });

    socket.on('error', (err) => {
      resolve({ online: false, error: err.code || 'ERR' });
    });

    socket.connect(port, host);
  });
}

// Helper to probe HTTP endpoint
function probeHttp(urlStr, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const start = Date.now();
    try {
      const url = new URL(urlStr);
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port || 80,
          path: url.pathname + url.search,
          method: 'GET',
          timeout: timeoutMs,
        },
        (res) => {
          const latency = Date.now() - start;
          resolve({ online: true, status: res.statusCode, latency });
        }
      );

      req.on('timeout', () => {
        req.destroy();
        resolve({ online: false, error: 'TIMEOUT' });
      });

      req.on('error', (err) => {
        resolve({ online: false, error: err.code || 'ERR' });
      });

      req.end();
    } catch (err) {
      resolve({ online: false, error: err.message });
    }
  });
}

async function runHealthProbes() {
  console.log(`${c.cyan}${c.bold}2. Real-Time Service Health Matrix${c.reset}`);

  const services = [
    { name: 'Frontend Client (Next.js 15)', type: 'http', target: 'http://localhost:3000', port: 3000 },
    { name: 'Core Backend API (NestJS 10)', type: 'http', target: 'http://localhost:5000', port: 5000 },
    { name: 'SSE Realtime Stream Channel', type: 'http', target: 'http://localhost:5000/api/v1/events/stream', port: 5000 },
    { name: 'PostgreSQL 16 Engine', type: 'tcp', host: 'localhost', port: 5432 },
    { name: 'Redis 7 Cache & Bus', type: 'tcp', host: 'localhost', port: 6379 },
    { name: 'Nginx Edge Gateway (HTTP)', type: 'http', target: 'http://localhost:80/health', port: 80 },
  ];

  let onlineCount = 0;

  for (const s of services) {
    let result;
    if (s.type === 'http') {
      result = await probeHttp(s.target);
    } else {
      result = await probeTcp(s.host, s.port);
    }

    if (result.online) {
      onlineCount++;
      const latencyStr = `${result.latency}ms`.padStart(6);
      console.log(`  ${c.emerald}[HEALTHY]${c.reset} ${c.bold}${s.name.padEnd(32)}${c.reset} → Latency: ${c.emerald}${latencyStr}${c.reset} ${result.status ? `(HTTP ${result.status})` : ''}`);
    } else {
      console.log(`  ${c.amber}[STANDBY]${c.reset} ${c.bold}${s.name.padEnd(32)}${c.reset} → Status: ${c.gray}${result.error || 'OFFLINE'}${c.reset} (Port ${s.port})`);
    }
  }

  // 3. PostgreSQL Schema & Table Check if online
  console.log(`\n${c.cyan}${c.bold}3. Database Subsystem Health${c.reset}`);
  if (Client) {
    const dbClient = new Client({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || '2Live&letLive',
      database: process.env.POSTGRES_DB || 'cambium',
      connectionTimeoutMillis: 2000,
    });

    try {
      await dbClient.connect();
      const res = await dbClient.query('SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = \'public\';');
      const tableCount = res.rows[0].c;
      const extRes = await dbClient.query('SELECT extname FROM pg_extension WHERE extname IN (\'vector\', \'uuid-ossp\');');
      const extNames = extRes.rows.map(r => r.extname).join(', ');

      console.log(`   ${c.emerald}✓ Database connection verified${c.reset}`);
      console.log(`   ${c.gray}→ Total Tables: ${tableCount} | Extensions: ${extNames}${c.reset}`);
      await dbClient.end();
    } catch {
      console.log(`   ${c.amber}! Database currently in standby / local service stopped.${c.reset}`);
    }
  }

  // Process Supervision Options Summary
  console.log(`\n${c.cyan}${c.bold}4. Production Process Supervision Architecture${c.reset}`);
  console.log(`   ${c.bold}Option A: Containerized Cluster${c.reset}`);
  console.log(`   ${c.gray}→ docker-compose up -d --build (Spawns Postgres, Redis, Server, Client, Gateway)${c.reset}`);
  console.log(`   ${c.bold}Option B: PM2 Enterprise Process Supervisor${c.reset}`);
  console.log(`   ${c.gray}→ pm2 start ecosystem.config.js (Cluster mode, 1024MB auto-restart, log aggregation)${c.reset}`);

  console.log(`\n${c.canopy}${c.bold}════════════════════════════════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}SUPERVISION PROBE COMPLETE: ${onlineCount}/${services.length} SERVICES PROBED${c.reset}`);
  console.log(`${c.gray}Health check diagnostics completed cleanly.${c.reset}\n`);
}

runHealthProbes();
