# Measured Load Benchmark & Concurrency Results (Phase 9–10)

## 1. Synthetic HTTP Concurrent & Spike Run (`scripts/load-benchmark.mjs`)
Executed locally on Windows (Node.js runtime, in-process synthetic HTTP server with `n = 500` seeded opportunity records, zero DB network roundtrip — **representative of HTTP + cache + serialization transport bounds, not remote Postgres disk I/O**):

| Scenario | Concurrency | Total Requests | Measured RPS | p50 (ms) | p95 (ms) | p99 (ms) | Error Rate | Heap Delta | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A_Mixed_Read_Warm` | 25 | 600 | `2,272.9` | `8.39` | `26.67` | `46.75` | `0.00%` | `+11.51 MB` | **PASS** (HTTP transport) |
| `B_Spike_Burst_2x` | 50 | 300 | `4,585.9` | `9.84` | `21.12` | `21.84` | `0.00%` | `+8.76 MB` | **PASS** (HTTP transport) |

## 2. Service-Layer Concurrent Stress (`load-benchmark.spec.ts`)
- **Singleflight Cold Stampede + Warm Reads (`n = 200` calls)**: 50 simultaneous misses executed underlying query `1` time; 150 subsequent reads resolved from L1 cache (`hitRatio = 0.75` total across 50 initial misses + 150 hits, elapsed `< 250ms`) -> **PASS**.
- **50-Item Batched `bulkCreate` (`150` total tag entries)**: Completed in `< 200ms` with `1` batch `tagRepo.find` + `1` batch `tagRepo.save` (`O(1)` tag roundtrips instead of sequential N+1 loop) -> **PASS**.
- **Remote Cloud PostgreSQL + Live Render Soak**: **`BLOCKED`** — production load generation prohibited per rules; run against dedicated staging environment before institutional rollout.
