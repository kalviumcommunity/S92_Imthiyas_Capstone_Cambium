# Database Performance & Query Optimization (`04`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. High-Impact Query Optimizations Implemented
1. **Eliminated Unbounded Catalog Loads (`OpportunitiesService.findAll`, `getUpcomingDeadlines`)**:
   - Bounded `findAll` with `page` (`>= 1`) and `limit` (`[1..100]`, default `50`) and `.take()`/`.skip()`.
   - Bounded `getUpcomingDeadlines` to max `100` upcoming records ordered chronologically.
   - Bounded `HybridSearchService.search` and `CommunityController.getFeed` limits (`[1..100]` / `[1..50]`).
2. **Eliminated N+1 Queries (`FundingService.listAccounts`)**:
   - Replaced `Promise.all(accounts.map(acc => lineItemRepo.find(...)))` with a single `In(accountIds)` batched query indexed via an in-memory `Map<string, BudgetLineItem[]>`.
3. **Credential Projection Hygiene (`User.passwordHash`)**:
   - Marked `passwordHash` as `select: false` so relational joins across feeds, opportunities, and workspaces omit password hashes from `SELECT` lists automatically.
4. **Composite & GIN Index Coverage ([`002_backend_integrity_and_indexes.sql`](../../server/src/database/migrations/002_backend_integrity_and_indexes.sql))**:
   - Added `idx_opps_type_deadline`, `idx_prop_org_status_updated`, `idx_fa_org_state`, `idx_er_fa_status`, and `idx_ap_tags_gin`.
   - Complements existing HNSW vector (`idx_opps_embedding_hnsw`) and full-text GIN (`idx_opps_fts`) indexes in [`schema.sql`](../../server/src/database/schema.sql).

## 2. Connection Pool & Query Guardrails (`server/src/config/database.config.ts`)
- Pool size (`DB_POOL_MAX`, default `20`), `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 5000`, and `statement_timeout` (`DB_STATEMENT_TIMEOUT_MS`, default `15000`ms) protect Postgres / PgBouncer against runaway scans.
- Note: Live `EXPLAIN ANALYZE` against production row volumes is outside local offline test execution; verify query plans on staging/production data after applying migration `002`.
