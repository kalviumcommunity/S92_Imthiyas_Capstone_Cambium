# PostgreSQL Performance Engineering (Phase 4)

## 1. Staged Additive Indexes (`004_performance_indexes.sql`)
- `idx_opps_created_id_desc` on `research_opportunities (created_at DESC, id DESC)`: supports zero-offset `CursorPaginationUtil` seek queries without sorting full table pages.
- `idx_opps_deadline_active` partial index (`WHERE deadline IS NOT NULL`): keeps deadline-sorted index small for active grant calls.
- `idx_opps_fts_full` (`USING gin(to_tsvector('english', COALESCE(title,'') || ' ' || COALESCE(organization,'') || ' ' || COALESCE(description,'')))`): extends GIN full-text index coverage to `organization` so sponsor lookups avoid sequential scans.
- `idx_wc_project_created`, `idx_pal_project_created`, `idx_chat_room_created`, `idx_ap_type_created`: eliminate sort spills on collaborative room timelines and filtered community feeds.

## 2. Connection Pool & Query Safety
- `database.config.ts` bounds TypeORM pool connections at `DB_POOL_MAX=20`, `connectionTimeoutMillis=5000`, `idleTimeoutMillis=30000`, and `statement_timeout=15000` (configured safely for starter/PgBouncer tiers).
- Verify query plans cleanly on staging/local PostgreSQL via:
  `EXPLAIN (ANALYZE, BUFFERS) SELECT id, title, organization FROM research_opportunities ORDER BY created_at DESC, id DESC LIMIT 25;`
