# Cambium Performance Targets & Baselines (Phase 1)

## 1. Realistic Target SLOs (Managed Vercel + Render Starter + PostgreSQL 16)

| Workload Tier | Target Metric | SLO Target | Measurement Boundary |
| :--- | :--- | :--- | :--- |
| **Frontend Critical Routes (`/`, `/opportunities`, `/graph`)** | Route compile & JS payload hygiene | Code-split heavy canvas/modal modules (`next/dynamic`); `0` duplicate mount queries | Local Next.js 16 production build telemetry |
| **Core Read API (`/api/v1/opportunities`, `/community/feed`)** | Warm `p95` response latency | `<= 150 ms` (local benchmark harness), bounded payload `<= 100` items/page | Isolated benchmark + Vitest service regression |
| **Hybrid Search (`/opportunities/search`)** | Warm `p95` search latency | `<= 250 ms` (primary PGVector HNSW + GIN FTS), capped `<= 200` rows on degraded fallback | Synthetic corpus benchmark (`n = 500` items) |
| **Cache Layer (`MultiTierCacheService`)** | Stampede coalescing & hit ratio | Concurrent duplicate misses execute factory `= 1` time (`singleflight`); hit >= `85%` on repeated read burst | Concurrent Promise stress unit tests |
| **AI Workflows (Embedding & Grounded RAG)** | Bounded concurrency & latency | Max `4` concurrent outbound batch operations; pre-call input budget truncation verified | Isolated mock provider timing & budget suite |

---

## 2. Pre-Optimization Baseline Observations (`main` at `f15662d`)
- **`OpportunitiesService.findAll()`**: Unbounded row count + full `createdBy` entity join (`0` `.take()` limit enforced).
- **`OpportunitiesService.bulkCreate(50 items x 4 tags)`**: Executes up to `~400+` sequential SQL statements per call inside a single open transaction.
- **`HybridSearchService.fallbackInMemorySemanticSearch()`**: Unbounded `qb.getMany()` across entire `research_opportunities` table when SQL `<=>` falls back.
- **`CommunityService.getFeed()`**: Eager `leftJoinAndSelect` on full `comments` + `commentAuthor` tree per feed page.
- **`Client Monolith Files`**: `opportunities/page.tsx` (`2,008` lines) and `graph/page.tsx` (`1,106` lines) synchronously bundle canvas graphs and heavy export/eligibility modals.
- **Load Benchmark Tooling**: No concurrent load/stress/soak script existed prior to Program 07 (`BLOCKED` until Sprint 5 builds `scripts/load-benchmark.mjs`).
