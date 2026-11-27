#!/usr/bin/env node
/**
 * Load, Stress Ramp, and Soak Testing Driver (Pure Node 20+ ESM, zero k6 dependency).
 * Strict safety guard prevents accidental stress against non-local production hosts.
 *
 * Usage:
 *   node scripts/perf/load-stress-soak.mjs --api http://127.0.0.1:5000 --web http://127.0.0.1:3000 --mode quick
 */
import { performance, monitorEventLoopDelay } from 'node:perf_hooks';

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

const API_BASE = getArg('--api', 'http://127.0.0.1:5000').replace(/\/$/, '');
const WEB_BASE = getArg('--web', 'http://127.0.0.1:3000').replace(/\/$/, '');
const MODE = getArg('--mode', 'quick'); // quick | full

function assertLocal(urlStr, label) {
  const host = new URL(urlStr).hostname;
  if (!['localhost', '127.0.0.1', '::1'].includes(host) && process.env.ALLOW_NONLOCAL_BENCH !== 'true') {
    throw new Error(`Safety guard blocked remote target ${label}: ${host}`);
  }
}
assertLocal(API_BASE, 'API');
assertLocal(WEB_BASE, 'WEB');

function pct(sorted, p) {
  if (!sorted.length) return 0;
  return Number(sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1))].toFixed(2));
}

async function probe(url) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
    return r.status < 500;
  } catch {
    return false;
  }
}

async function runStage({ name, urls, concurrency, durationMs }) {
  const loop = monitorEventLoopDelay({ resolution: 10 });
  loop.enable();
  const latencies = [];
  let total = 0;
  let errors = 0;
  const deadline = performance.now() + durationMs;

  async function worker(workerIdx) {
    let i = workerIdx;
    while (performance.now() < deadline) {
      const target = urls[i % urls.length];
      i++;
      const t0 = performance.now();
      total++;
      try {
        const res = await fetch(target, { signal: AbortSignal.timeout(8000) });
        await res.arrayBuffer();
        if (!res.ok) errors++;
      } catch {
        errors++;
      } finally {
        latencies.push(performance.now() - t0);
      }
    }
  }

  const start = performance.now();
  await Promise.all(Array.from({ length: concurrency }, (_, idx) => worker(idx)));
  const elapsedSec = Math.max(0.001, (performance.now() - start) / 1000);
  loop.disable();

  const sorted = latencies.slice().sort((a, b) => a - b);
  const mem = process.memoryUsage();
  return {
    stage: name,
    concurrency,
    durationSec: Number(elapsedSec.toFixed(2)),
    totalRequests: total,
    errors,
    errorRatePct: total > 0 ? Number(((errors / total) * 100).toFixed(2)) : 0,
    throughputReqPerSec: Number((total / elapsedSec).toFixed(2)),
    p50Ms: pct(sorted, 50),
    p95Ms: pct(sorted, 95),
    p99Ms: pct(sorted, 99),
    runnerRssMb: Math.round(mem.rss / 1048576),
    runnerHeapMb: Math.round(mem.heapUsed / 1048576),
    eventLoopDelayP95Ms: Number((loop.percentile(95) / 1e6).toFixed(2)),
  };
}

async function main() {
  const webUp = await probe(`${WEB_BASE}/`);
  const apiUp = await probe(`${API_BASE}/health`);

  const journeyUrls = [];
  if (apiUp) {
    journeyUrls.push(
      `${API_BASE}/health`,
      `${API_BASE}/api/v1/opportunities?limit=25`,
      `${API_BASE}/api/v1/opportunities/stats`,
      `${API_BASE}/api/v1/opportunities/hybrid?q=climate&limit=10`,
    );
  }
  if (webUp) {
    journeyUrls.push(
      `${WEB_BASE}/backgrounds/cambium-connections-canopy.jpg`,
      `${WEB_BASE}/robots.txt`,
    );
  }

  if (journeyUrls.length === 0) {
    console.log(JSON.stringify({ reachable: false, webUp, apiUp, stages: [] }, null, 2));
    return;
  }

  const unitMs = MODE === 'full' ? 12000 : 2500;
  const soakMs = MODE === 'full' ? 30000 : 4000;
  const scenarios = [
    { name: 'Scenario A: Mentor Eval (10 VU)', concurrency: 10, durationMs: unitMs },
    { name: 'Scenario B: Moderate Load (25 VU)', concurrency: 25, durationMs: unitMs },
    { name: 'Scenario C: Stress Ramp (50 VU)', concurrency: 50, durationMs: unitMs },
    { name: 'Scenario D: Sustained Soak (15 VU)', concurrency: 15, durationMs: soakMs },
  ];

  const stages = [];
  for (const s of scenarios) {
    const result = await runStage({ ...s, urls: journeyUrls });
    stages.push(result);
    if (result.errorRatePct > 25) {
      stages.push({ stage: 'STOPPED_AT_SATURATION', reason: `Error rate ${result.errorRatePct}% exceeded 25%` });
      break;
    }
  }

  console.log(JSON.stringify({ recordedAt: new Date().toISOString(), mode: MODE, webUp, apiUp, journeyUrls, stages }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
