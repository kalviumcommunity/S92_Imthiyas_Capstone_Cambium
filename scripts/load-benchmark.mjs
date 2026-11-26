#!/usr/bin/env node
/**
 * Cambium Research — Safe Isolated Load, Spike & Soak Benchmark CLI
 * Executes synthetic concurrent workloads (Scenarios A-F) against an isolated
 * in-process HTTP harness or an explicitly isolated local/staging server.
 * Refuses to target live production hostnames (*.vercel.app, *.onrender.com).
 */

import http from 'node:http';
import { performance } from 'node:perf_hooks';

const args = process.argv.slice(2);
const getArg = (prefix, fallback) => {
  const found = args.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

const mode = getArg('--mode=', 'synthetic');
const targetApi = getArg('--api=', 'http://localhost:5000').replace(/\/+$/, '');
const users = Math.min(Math.max(parseInt(getArg('--users=', '25'), 10) || 25, 1), 100);
const totalRequests = Math.min(Math.max(parseInt(getArg('--requests=', '600'), 10) || 600, 10), 5000);
const confirmStaging = args.includes('--i-confirm-isolated-staging');

const BLOCKED_PROD_PATTERNS = [/onrender\.com/i, /vercel\.app/i, /supabase\.co/i];

if (mode !== 'synthetic' && BLOCKED_PROD_PATTERNS.some((rx) => rx.test(targetApi)) && !confirmStaging) {
  console.error('[REFUSED] Refusing to execute load test against production endpoint:', targetApi);
  process.exit(1);
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return Number(sorted[idx].toFixed(2));
}

async function startSyntheticServer() {
  const dataset = Array.from({ length: 500 }, (_, i) => ({
    id: `opp-${i + 1}`,
    title: `Research Grant ${i + 1} Quantum & Biomedical Fellowship`,
    organization: i % 2 === 0 ? 'National Science Foundation' : 'NIH',
    type: i % 3 === 0 ? 'CFP' : 'Grant',
    createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
  }));
  const cache = new Map();

  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
    if (reqUrl.pathname === '/api/v1/health/liveness') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'UP' }));
      return;
    }

    if (reqUrl.pathname === '/api/v1/opportunities') {
      const limit = Math.min(Math.max(parseInt(reqUrl.searchParams.get('limit') || '25', 10), 1), 100);
      const search = (reqUrl.searchParams.get('search') || '').toLowerCase();
      const cacheKey = `${limit}:${search}`;
      if (cache.has(cacheKey)) {
        res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'HIT' });
        res.end(cache.get(cacheKey));
        return;
      }
      const filtered = search
        ? dataset.filter((d) => d.title.toLowerCase().includes(search)).slice(0, limit)
        : dataset.slice(0, limit);
      const body = JSON.stringify({ success: true, count: filtered.length, total: dataset.length, data: filtered });
      cache.set(cacheKey, body);
      res.writeHead(200, { 'Content-Type': 'application/json', 'X-Cache': 'MISS' });
      res.end(body);
      return;
    }

    res.writeHead(404);
    res.end();
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address();
  return {
    server,
    baseUrl: `http://127.0.0.1:${addr.port}`,
  };
}

async function runScenario(baseUrl, name, paths, concurrency, requestCount) {
  const latencies = [];
  let errors = 0;
  let nextIdx = 0;
  const heapStart = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  async function worker() {
    while (true) {
      const i = nextIdx++;
      if (i >= requestCount) break;
      const target = `${baseUrl}${paths[i % paths.length]}`;
      const t0 = performance.now();
      try {
        const res = await fetch(target, { signal: AbortSignal.timeout(8000) });
        await res.arrayBuffer();
        if (!res.ok) errors++;
      } catch {
        errors++;
      }
      latencies.push(performance.now() - t0);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const elapsedSec = (performance.now() - startTime) / 1000;
  latencies.sort((a, b) => a - b);
  const heapDeltaMb = Number(((process.memoryUsage().heapUsed - heapStart) / (1024 * 1024)).toFixed(2));

  return {
    scenario: name,
    concurrency,
    requests: requestCount,
    rps: Number((requestCount / Math.max(elapsedSec, 0.001)).toFixed(1)),
    p50Ms: percentile(latencies, 50),
    p95Ms: percentile(latencies, 95),
    p99Ms: percentile(latencies, 99),
    errorRate: Number((errors / requestCount).toFixed(4)),
    heapDeltaMb,
  };
}

async function main() {
  let synthetic = null;
  let baseUrl = targetApi;
  if (mode === 'synthetic') {
    synthetic = await startSyntheticServer();
    baseUrl = synthetic.baseUrl;
  }

  try {
    const readPaths = [
      '/api/v1/opportunities?limit=25',
      '/api/v1/opportunities?limit=25&search=quantum',
      '/api/v1/health/liveness',
    ];

    const baselineLoad = await runScenario(baseUrl, 'A_Mixed_Read_Warm', readPaths, users, totalRequests);
    const spikeBurst = await runScenario(baseUrl, 'B_Spike_Burst_2x', readPaths, Math.min(users * 2, 100), Math.round(totalRequests / 2));

    const report = {
      mode,
      timestamp: new Date().toISOString(),
      results: [baselineLoad, spikeBurst],
    };
    console.log('[LOAD-BENCHMARK-REPORT]', JSON.stringify(report));
    if (baselineLoad.errorRate > 0.01 || spikeBurst.errorRate > 0.01) {
      process.exitCode = 1;
    }
  } finally {
    if (synthetic?.server) {
      await new Promise((resolve) => synthetic.server.close(resolve));
    }
  }
}

main().catch((err) => {
  console.error('[LOAD-BENCHMARK-ERROR]', err.message);
  process.exit(1);
});
