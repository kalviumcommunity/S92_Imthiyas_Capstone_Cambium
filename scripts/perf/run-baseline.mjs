#!/usr/bin/env node
/**
 * Reproducible Local Performance Baseline Runner (Zero external dependencies).
 * Safely blocks accidental execution against remote production hostnames.
 *
 * Usage:
 *   node scripts/perf/run-baseline.mjs --api http://localhost:5000 --web http://localhost:3000 --concurrency 10 --requests 60
 */

import { performance, monitorEventLoopDelay } from 'node:perf_hooks';

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}

const API_BASE = getArg('--api', process.env.PERF_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const WEB_BASE = getArg('--web', process.env.PERF_WEB_URL || 'http://localhost:3000').replace(/\/$/, '');
const CONCURRENCY = Math.max(1, Math.min(100, Number(getArg('--concurrency', '10'))));
const TOTAL_REQUESTS = Math.max(CONCURRENCY, Math.min(2000, Number(getArg('--requests', '60'))));
const WARMUP = Math.max(0, Number(getArg('--warmup', '5')));

function assertLocalTarget(urlStr, label) {
  const host = new URL(urlStr).hostname;
  if (!['localhost', '127.0.0.1', '::1'].includes(host) && process.env.ALLOW_NONLOCAL_BENCH !== 'true') {
    throw new Error(`Safety guard: refusing benchmark against non-local ${label} (${host}). Set ALLOW_NONLOCAL_BENCH=true only for authorized staging.`);
  }
}

assertLocalTarget(API_BASE, 'API');
assertLocalTarget(WEB_BASE, 'WEB');

function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return Number(sorted[idx].toFixed(2));
}

async function isReachable(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

async function benchEndpoint(name, url, concurrency, total) {
  for (let i = 0; i < WARMUP; i++) {
    await fetch(url, { signal: AbortSignal.timeout(5000) }).catch(() => null);
  }

  const durations = [];
  let errors = 0;
  let nextIdx = 0;
  const startAll = performance.now();

  async function worker() {
    while (true) {
      const myIdx = nextIdx++;
      if (myIdx >= total) break;
      const t0 = performance.now();
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        await res.arrayBuffer();
        if (!res.ok) errors++;
      } catch {
        errors++;
      } finally {
        durations.push(performance.now() - t0);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const elapsedSec = Math.max(0.001, (performance.now() - startAll) / 1000);
  const sorted = durations.slice().sort((a, b) => a - b);

  return {
    name,
    url,
    concurrency,
    requests: total,
    errors,
    errorRatePct: Number(((errors / total) * 100).toFixed(2)),
    throughputReqPerSec: Number((total / elapsedSec).toFixed(2)),
    p50Ms: percentile(sorted, 50),
    p95Ms: percentile(sorted, 95),
    p99Ms: percentile(sorted, 99),
    maxMs: sorted.length ? Number(sorted[sorted.length - 1].toFixed(2)) : 0,
  };
}

async function main() {
  const loopMonitor = monitorEventLoopDelay({ resolution: 10 });
  loopMonitor.enable();

  const webUp = await isReachable(`${WEB_BASE}/`);
  const apiUp = await isReachable(`${API_BASE}/health`);

  const targets = [];
  if (webUp) {
    targets.push(['Next.js Landing (GET /)', `${WEB_BASE}/`]);
    targets.push(['Next.js Forest Canopy Img', `${WEB_BASE}/backgrounds/cambium-connections-canopy.jpg`]);
  }
  if (apiUp) {
    targets.push(['NestJS Health Probe', `${API_BASE}/health`]);
    targets.push(['Opportunities List', `${API_BASE}/api/v1/opportunities`]);
    targets.push(['Opportunities Stats', `${API_BASE}/api/v1/opportunities/stats`]);
    targets.push(['Hybrid Search (AI/GIN)', `${API_BASE}/api/v1/opportunities/hybrid?q=climate&limit=10`]);
  }

  const results = [];
  for (const [name, url] of targets) {
    results.push(await benchEndpoint(name, url, CONCURRENCY, TOTAL_REQUESTS));
  }

  loopMonitor.disable();
  const mem = process.memoryUsage();
  const report = {
    recordedAt: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      webReachable: webUp,
      apiReachable: apiUp,
      concurrency: CONCURRENCY,
      requestsPerEndpoint: TOTAL_REQUESTS,
      warmup: WARMUP,
    },
    runnerResources: {
      rssMb: Math.round(mem.rss / 1048576),
      heapUsedMb: Math.round(mem.heapUsed / 1048576),
      eventLoopDelayP95Ms: Number((loopMonitor.percentile(95) / 1e6).toFixed(2)),
    },
    results,
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
