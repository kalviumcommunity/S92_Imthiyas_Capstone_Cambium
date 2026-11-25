# PostgreSQL Database Architecture Audit (`03`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Schema Structure & Normalization Review
- **Canonical Script**: [`server/src/database/schema.sql`](../../server/src/database/schema.sql) defines 33 relational tables in 3NF with explicit foreign keys, `TIMESTAMPTZ` columns (`DEFAULT NOW()`), junction tables (`user_interests`, `opportunity_tags`), and `pgvector` `vector(768)` + `HNSW` + `GIN` search indexes.
- **Identified Schema Drift & Gaps**:
  1. `BillingModule` defines TypeORM entities `Subscription` (`subscriptions`) and `Invoice` (`invoices`), which were omitted from `schema.sql` and `getDatabaseConfig().entities`.
  2. `funding_accounts`, `budget_line_items`, `expense_requests`, and `project_milestones` lacked DB-level `CHECK` constraints guarding against negative balances or invalid `progress_percent` ranges.
  3. High-frequency filtered views (`proposals` by `organization_id, status`, `funding_accounts` by `organization_id, financial_state`, `expense_requests` by `funding_account_id, status`, `research_opportunities` by `type, deadline`) lacked composite indexes.

## 2. Planned Additive Migration (`002_backend_integrity_and_indexes.sql`)
1. Create `subscriptions` and `invoices` tables idempotently (`CREATE TABLE IF NOT EXISTS`) with foreign keys to `users(id) ON DELETE CASCADE` and indexes matching TypeORM entities.
2. Add safe `NOT VALID` / idempotent `CHECK` constraints on non-negative financial columns and `progress_percent BETWEEN 0 AND 100`.
3. Add targeted composite indexes (`idx_opps_type_deadline`, `idx_prop_org_status_updated`, `idx_fa_org_state`, `idx_er_fa_status`, `idx_ap_tags_gin`) to avoid full sequential scans on dashboard/filter queries.
4. Preserve all existing data (strictly additive DDL; zero `DROP TABLE` / `TRUNCATE` operations).
