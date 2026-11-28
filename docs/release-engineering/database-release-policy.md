# Database Migration Release Policy

**Document ID**: `REL-DB-2026-V1`

## 1. Migration Tooling & Tracking

- **Base Schema**: `server/src/database/schema.sql` (`npm --prefix server run schema:apply`)
- **Versioned Migrations**: `server/src/database/migrations/*.sql` (`npm --prefix server run migrate:up`, status via `migrate:status`)
- **Ledger Table**: `schema_migrations (version TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`
- **Production Constraint**: `DB_SYNCHRONIZE=false` is enforced by `validateStartupEnvironment()` in production.

## 2. Rules for Schema Changes

1. **Append-Only History**: Never edit or delete an already-applied migration file. Checksum verification in `run-migrations.js` aborts deployment if drift is detected.
2. **Transactional Execution**: Every migration runs inside `BEGIN ... COMMIT` with automatic `ROLLBACK` on SQL failure.
3. **Fail-Loudly Startup**: `render.yaml` executes `npm run schema:apply && npm run migrate:up && npm run start:prod` without `|| true`, halting boot if migration fails.
4. **Expand-and-Contract Pattern** for breaking changes:
   - **Expand**: Add nullable column / new table / dual-write trigger in Release N.
   - **Migrate**: Backfill existing rows safely in batches.
   - **Switch**: Deploy application code reading/writing the new schema in Release N+1.
   - **Contract**: Drop deprecated column/table only after verifying zero active references in Release N+2.

## 3. Pre-Migration Backup Requirement

Before running destructive or data-altering production migrations:
- Verify a fresh backup via `npm run backup:db` (or Supabase PITR / daily snapshot).
- Confirm rollback/forward-fix plan in the Pull Request description.
