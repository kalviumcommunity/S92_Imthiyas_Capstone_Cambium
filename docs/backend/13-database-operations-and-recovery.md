# Database Operations, Migrations & Disaster Recovery (`13`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Version-Controlled Schema & Migrations
- **Base Schema**: [`server/src/database/schema.sql`](../../server/src/database/schema.sql)
- **Migration `001` (Security / RLS)**: [`server/src/database/migrations/001_supabase_rls_lockdown.sql`](../../server/src/database/migrations/001_supabase_rls_lockdown.sql)
- **Migration `002` (Integrity & Indexes)**: [`server/src/database/migrations/002_backend_integrity_and_indexes.sql`](../../server/src/database/migrations/002_backend_integrity_and_indexes.sql)
- `synchronize` is explicitly disabled in production (`shouldSynchronize = !isProd && process.env.DB_SYNCHRONIZE === 'true'`).

## 2. Backup & Recovery Verification Status
- Cron backup scripts exist in `scripts/cron/` and disaster-recovery verification specs exist in `server/src/database/disaster-recovery.spec.ts`.
- **Important Honesty Note**: An automated end-to-end backup restoration test against a live Supabase/PostgreSQL instance was **not executed** in this workspace session. Before claiming verified RPO/RTO compliance in production, execute a manual restore rehearsal onto a scratch staging database from the active `pg_dump`/Supabase PITR snapshot and validate migrations `001` + `002`.
