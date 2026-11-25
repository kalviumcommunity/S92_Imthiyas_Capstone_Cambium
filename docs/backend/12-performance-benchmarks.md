# Performance & Reliability Baselines (`12`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Verified Architectural Targets vs. Measurement Boundaries
| Metric / Surface | Verified Code Control | Live Load Measurement Status |
| :--- | :--- | :--- |
| **Catalog Pagination & Bounds** | `OpportunitiesService.findAll` capped at `100`/page (`50` default); `HybridSearch` capped `[1..100]`; `CommunityController` feed capped `[1..50]`. | **NOT BENCHMARKED LIVE** (no live load generator executed against Postgres/Render). |
| **N+1 Elimination** | `FundingService.listAccounts` uses 1 batched `IN (...)` query for `BudgetLineItem` rows instead of `N` per-account queries (verified by spy assertion in `backend-engineering.spec.ts`). | **PASS (Unit Spy Verified)** |
| **Database Timeouts & Pool** | `DB_POOL_MAX` (default `20`), `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 5000`, `statement_timeout: 15000ms` (`database.config.ts`). | **PARTIAL** (configured in code; production throughput requires Render/Supabase load testing). |
| **Multi-Tier & Edge Caching** | `MultiTierCacheService` (`L1/L2`) + `EdgeCacheInterceptor` + `EtagInterceptor`. | **PASS (Unit Tested)** |

> [!NOTE]
> Per engineering accuracy policy, synthetic throughput (`RPS`) or fabricated `p95`/`p99` production numbers are omitted until benchmarked against live staging infrastructure with realistic seed volumes.
