# Performance Regression Prevention Policy (Phase 13)

## Non-Flaky Automated Regression Gates
Cambium separates deterministic unit structural regressions (CI-blocking) from noisy machine timing benchmarks (informational):
1. **CI-Blocking Structural Performance Checks (`performance-regression.spec.ts` & `load-benchmark.spec.ts`)**:
   - Asserts bounded `.take(<= 100)` pagination and safe `creator` column projections.
   - Asserts `bulkCreate()` uses batched tag resolution (`<= 2` tag queries).
   - Asserts `HybridSearchService` enforces parameterized vector queries, GIN FTS ranking, and bounded fallback `.take(<= 200)`.
   - Asserts singleflight cache coalescing (`1` factory call per stampede) and auth cache-leak isolation (`EdgeCacheInterceptor`).
   - Asserts `004_performance_indexes.sql` maintains additive `IF NOT EXISTS` index definitions.
2. **Pre-Release Build & Benchmark Verification (Informational / Staging)**:
   - Inspect Next.js route build compilation output (`npm --prefix client run build`).
   - Run `node scripts/load-benchmark.mjs --mode=synthetic` locally and compare `p95`, `errorRate`, and `heapDeltaMb`.
