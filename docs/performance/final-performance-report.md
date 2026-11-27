# Program 10 — Performance Engineering & Scalability Final Report

**Repository Baseline:** `main` (`f44db68`) -> Stacked Branches `feat/perf10-sprint-0-baseline` .. `feat/perf10-sprint-5-verification`  
**Core Rule Enforced:** Zero fabricated results; local, lab CI, PostgreSQL, and remote observations are strictly separated.

---

## 1. Phase-by-Phase Program Status Matrix

| Phase | Domain | Status | Evidence & Notes |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Reconnaissance & Risk Map | `PASS` | [`architecture-baseline-map.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/performance/architecture-baseline-map.md) |
| **Phase 1** | Reproducible Baseline | `PASS` | `run-baseline.mjs` recorded baseline (`GET /` dev `p50=1836.39ms, p95=2375.92ms`, image `p50=14.58ms, 613.3 req/s`) |
| **Phase 2** | Frontend Optimization & CWV | `PASS` | Code-split `PlatformCollageSection`, `HexContributionGraph`, `RelationalKnowledgeNetwork`, `ResearchLandscapeExplorer`; dynamic `VERCEL` image opt; `/backgrounds/*` `immutable` cache headers; `WebVitalsReporter` |
| **Phase 3** | Backend API Optimization | `PASS` | Bounded pagination (`limit <= 100`) on `OpportunitiesService`, `BookmarksService`, `CommunityService`, `NotificationsService`; creator projection trimming; `RequestTimeoutInterceptor` (`20s`) |
| **Phase 4** | PostgreSQL Query Plans & Indexes | `PASS` | `pg-explain-audit.mjs` confirmed `Bitmap Index Scan(idx_opps_fts)` (`2.217 ms`) and `Index Scan(idx_opps_deadline)` (`0.065 ms`); added [`004_performance_indexes.sql`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/database/migrations/004_performance_indexes.sql) |
| **Phase 5** | Search & pgvector Tuning | `PASS` | Parameterized `:vectorLiteral::vector`, GIN FTS `websearch_to_tsquery`, fallback scan bounded `.take(250)` |
| **Phase 6** | Caching Safety & Isolation | `PASS` | `MultiTierCacheService.wrapScoped` enforces `public:`/`user:{id}:`/`org:{id}:` isolation & `256 KB` payload cap; tag/prefix invalidation on opportunity writes |
| **Phase 7** | Background Jobs & Concurrency | `PASS` | `QueueService`: `SKIP LOCKED`, `maxConcurrentPgJobs=3`, exponential backoff, `recoverStaleRunningJobs(300_000)` |
| **Phase 8** | External API Timeouts | `PASS` | `AbortSignal.timeout(6–10s)` added across Gemini chat, Gemini embeddings, and Google OAuth `userinfo` |
| **Phase 9** | File Processing Controls | `PARTIAL` | Existing 50MB limit, magic-byte validation, and worker-thread OCR fallback preserved; dedicated multi-hundred-MB chunked S3 streaming outside single-node scope |
| **Phase 10** | Load, Stress & Soak Testing | `PASS` | Local `load-stress-soak.mjs` (`10/25/50` VU ramp + soak) against `127.0.0.1:3000`: `0%` errors, `114.02–128.75 req/s`, event loop delay `p95 = 17.42–19.6ms` |
| **Phase 11** | Capacity Planning (`10`..`1,000`) | `PASS` | [`capacity-and-cost-model.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/performance/capacity-and-cost-model.md) |
| **Phase 12** | Cost & Resource Model | `PASS` | Cost-per-MAU & AI cost-per-workflow formulas wired without fabricated vendor quotes |
| **Phase 13** | Security & Correctness Parity | `PASS` | Auth/RBAC guards, cross-tenant `wrapScoped` isolation, SQL parameterization preserved across 38 Vitest files (`185` tests) |
| **Phase 14** | Regression Automation | `PASS` | `performance-regression.spec.ts` (Vitest), `11-performance-budgets.spec.ts` (Jest), `07-performance-cwv-smoke.spec.ts` (Playwright) |
| **Phase 15** | Architectural Scaling Roadmap | `PASS` | [`scaling-decision-roadmap.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/performance/scaling-decision-roadmap.md) (no premature microservices/Kafka/Elasticsearch) |
| **Phase 16** | Final Performance Report | `PASS` | This document |

---

## 2. Before-vs-After Evidence Summary

| Surface / Optimization | Before | After | Scope & Conditions |
| :--- | :--- | :--- | :--- |
| **`OpportunitiesService.findAll`** | Unbounded `getManyAndCount()` + full `createdBy` entity hydration | Bounded `limit` (`25` default, `100` max), `leftJoin` + `addSelect(['id','username','fullName'])`, L1/L2 public slice caching with prefix invalidation | Verified in [`performance-regression.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/performance/performance-regression.spec.ts) |
| **`HybridSearchService` Lexical** | Unindexed wildcard `ILIKE` across 4 columns | `idx_opps_fts` `GIN` index (`to_tsvector` `@@ websearch_to_tsquery`) (`2.217 ms` `Bitmap Index Scan` observed locally) + parameterized `:vectorLiteral::vector` + `.take(250)` fallback cap | Observed against localhost PG 16 (`cambium`) + mocked TypeORM regression check |
| **`NotificationsService.findByUserId`** | Sequential `findAndCount` + `count` | `Promise.all([...])` parallel query execution (`limit <= 100`) | Verified in `performance-regression.spec.ts` |
| **External HTTP Fetch Safety** | Unbounded `fetch()` on Gemini & Google OAuth | `AbortSignal.timeout(6000..10000)` + global `RequestTimeoutInterceptor` (`20s`) | Verified via unit specs & `tsc` |
| **Landing & Graph Client Hydration** | Static eager imports on `page.tsx` & `graph/page.tsx`; `images.unoptimized: true`; no `/backgrounds/*` immutable header | `next/dynamic` code splitting w/ fixed-height skeletons; `VERCEL`-gated image opt; `max-age=31536000, immutable` on `/backgrounds/*`; `WebVitalsReporter` | Verified via `next build` (`57/57` routes), Jest (`11/11` suites), Playwright Chromium (`cls <= 0.15`, `0` errors) |
| **Local Web Load (`127.0.0.1:3000`)** | No load/soak harness existed | `Scenario A (10 VU): 114.02 req/s, p95=138.81ms` · `Scenario C (50 VU): 118.08 req/s, p95=769.97ms` · `Scenario D Soak (15 VU): 128.75 req/s, p95=178.3ms, 0% errors` | Local Next.js dev process on Windows (`mode=quick`) |

---

## 3. Verified Monorepo Suite Results

- **`npm run test:jest`**: `11 passed, 11 total` suites (`89 passed, 89 total` tests)
- **`cd server; npm run build`**: `tsc` exited `0` (`0` errors)
- **`cd server; npm test`**: `38 passed (38)` files (`185 passed (185)` tests)
- **`cd client; npm run lint`**: `0` ESLint errors (`3` pre-existing warnings)
- **`cd client; npm run build`**: `57/57` routes built cleanly
- **`npx playwright test tests/e2e/07-performance-cwv-smoke.spec.ts --reporter=list`**: `1 passed` in Chromium (`6.6s`)

---

## 4. Remaining Limitations & Recommended Next Steps

1. Run [`004_performance_indexes.sql`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/database/migrations/004_performance_indexes.sql) against managed Render/Supabase PostgreSQL during deployment (`CREATE INDEX CONCURRENTLY` if live traffic is active) and re-run `pg-explain-audit.mjs` on staging seeded with realistic row counts (`>= 5,000` opportunities).
2. Measure live NestJS API throughput with both local API (`port 5000`) and local PG active under `node scripts/perf/load-stress-soak.mjs --mode full` before onboarding cohorts `> 50` concurrent researchers.
