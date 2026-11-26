# Cambium Performance, Scalability & Capacity Engineering — Final Report (Phase 14)

## A. Executive Summary
Across Sprints 0–5, Cambium eliminated major avoidable latency and scalability bottlenecks without introducing cloud infrastructure bloat:
- Bounded pagination & minimal field projection added to `OpportunitiesService.findAll()` (`max 100`, `CursorPaginationUtil` seek support) and `getUpcomingDeadlines()` (`max 100`).
- Eliminated N+1 tag lookups inside `bulkCreate()` transactions and eliminated Cartesian `comments` join multiplication inside `CommunityService.getFeed()`.
- Hardened `MultiTierCacheService` with singleflight cold-stampede coalescing, true LRU promotion, and cursor `SCAN`, and sealed cross-user CDN cache leakage in `EdgeCacheInterceptor`.
- Added staged `004_performance_indexes.sql` composite/partial/GIN indexes, parameterized/bounded `HybridSearchService` queries, Next.js `next/dynamic` splitting across protected shells & graph/modal modules, bounded queue/AI worker concurrency, and an executable synthetic load benchmark harness.

---

## B. Before-and-After Comparison

| Metric / Property | Baseline (`main`) | Optimized (Sprint 5) | Target | Status |
| :--- | :--- | :--- | :--- | :---: |
| **`OpportunitiesService.findAll()` cap** | Unbounded (full table + full `User` entity) | Capped `limit <= 100` (default `25`) + `cursor` seek + minimal `creator` summary | `<= 100` rows/req | **PASS** |
| **`bulkCreate` tag query complexity** | `O(N * T)` sequential tag lookups | `O(1)` batch `In(...)` lookup + batch insert | Batch queries only | **PASS** |
| **`HybridSearchService` vector fallback** | Unbounded `qb.getMany()` across all rows | `.take(<= 200)` + parameterized vector literal + GIN FTS `ts_rank` | Bounded `<= 200` | **PASS** |
| **Cache cold-miss stampede (`50` concurrent)** | `50` duplicate executions | **`1` execution (`singleflight`)** + `EdgeCacheInterceptor` auth `no-store` isolation | `1` execution / burst | **PASS** |
| **Synthetic HTTP Mixed Load (`25` VUs / `600` reqs)** | No benchmark tool (`BLOCKED`) | **`2,272.9 RPS`**, `p50: 8.39ms`, `p95: 26.67ms`, `0%` errors | `0%` error rate | **PARTIAL** (local HTTP synthetic; remote staging PG load `BLOCKED`) |
| **Frontend heavy shell & graph/modals** | Synchronously bundled in initial route graph | Lazy `next/dynamic(..., { ssr: false })` islands + `?limit=25` fetch | Split chunks & clean build | **PASS** (`57/57` routes compiled) |
| **Monorepo Automated Suites** | Pre-sprint suite | **Server Vitest: `39 files / 190 tests PASS`**, **Client ESLint: `0 errors`**, **Jest: `10 suites / 87 tests PASS`** | `100%` pass | **PASS** |

---

## C. Remaining Prioritized Work
- **P0**: Resolve live Render API `503`/`500` state (flagged in DevOps Program) and apply staged migrations (`001`–`004`) sequentially in a controlled maintenance window.
- **P1**: Run `scripts/load-benchmark.mjs --mode=staging` against an isolated staging Render + Postgres instance once active to establish remote network + disk `EXPLAIN ANALYZE` baselines.
- **P2**: Upgrade Render starter instance when idle sleep spin-up (~17s) conflicts with institutional availability SLAs.

---

## D. Final 10-Point Engineering Verdict
1. **Which user journeys were slowed by code structure?** Large opportunity lists, feed posts with comments, unindexed sponsor searches, and synchronous protected overlay/graph loading.
2. **Which endpoints were most expensive?** Unpaginated `/opportunities` + `/upcoming-deadlines`, sequential tag resolution in `bulkCreate`, and unbounded semantic fallback scans.
3. **Which database bottlenecks were addressed?** Keyset pagination index, partial deadline index, combined organization FTS GIN index, and composite room/project timeline indexes (`004_performance_indexes.sql`).
4. **Is pagination implemented consistently?** Yes on core opportunity discovery (`page`/`limit`/`cursor` capped at `100`) and community feeds (`<= 50`).
5. **Can multiple users work concurrently?** Yes for isolated cache/auth keys, bounded PG pools (`20`), `SKIP LOCKED` jobs, and singleflight reads; live Render/PG staging load remains to be measured remotely (`PARTIAL`).
6. **Are AI workloads bounded?** Yes: batch embedding concurrency clamped `1..6`, 8s abort timeouts, 8k input cap, and BullMQ worker concurrency `4`.
7. **Does the system degrade gracefully?** Yes: Redis misses fall back to L1/PG jobs; Gemini timeouts fall back to deterministic mathematical vectors.
8. **What is the measured capacity?** Local synthetic HTTP transport sustained `2,272.9 RPS` (`25` VUs) and `4,585.9 RPS` (`50`-VU spike) at `0%` errors; real remote DB capacity awaits isolated staging load execution.
9. **What infra upgrade is justified now?** Keep Vercel + Render + PostgreSQL 16; only non-sleeping Render tier is justified if avoiding 17s cold wakes.
10. **What remains before institutional scale?** Apply staged SQL migrations safely, verify live Render API health, and run `EXPLAIN ANALYZE` on seeded staging volume.
