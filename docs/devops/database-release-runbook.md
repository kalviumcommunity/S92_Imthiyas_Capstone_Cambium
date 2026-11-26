# Database Release & Migration Operations Runbook (Phase 5)

## 1. Tracked Schema & Advisory Lock Engine (`run-migrations.js`)
Cambium enforces ordered, transaction-wrapped, SHA-256 checksum-verified SQL migrations through [`server/scripts/run-migrations.js`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/scripts/run-migrations.js):
- **Version Ledger**: Records `{ filename, sha256, applied_at }` in `public.schema_migrations`.
- **Concurrency Safety**: Acquires `pg_advisory_lock(8842019)` before schema inspection and unlocks cleanly in `finally`.
- **Checksum Immutability**: If an already-applied migration's file hash changes on disk, execution halts immediately rather than applying silent drift.
- **No Silent Error Masking**: Do not wrap migration execution in `|| true`. Failed migrations roll back inside `BEGIN ... ROLLBACK` and abort startup/deployment cleanly.

---

## 2. Expand-and-Contract Policy for Risky Schema Changes
1. **Expand**: Add nullable columns, new tables, or additive `CONCURRENTLY` indexes backward-compatible with currently deployed code.
2. **Deploy Code**: Release application versions capable of writing both old and new fields cleanly.
3. **Backfill**: Run idempotent, bounded batch updates safely outside HTTP request paths.
4. **Verify**: Run live API checks + `db:migrate:status`.
5. **Contract**: Drop deprecated columns or constraints only in a subsequent release once traffic on old app builds reaches zero.

---

## 3. Ownership, Pre-Checks & Recovery Rules
- **Authorization**: Production migrations run strictly under maintainer approval after taking an automated pre-release backup (`npm run backup:db` / Supabase snapshot).
- **Pre-Release Verification**: Run `npm run db:migrate:verify` in CI and `--status` against staging before production rollout.
- **Rollback vs Forward Recovery**: Reverting destructive `DROP` or data transforms is **unsafe** without backup restoration. Prefer forward-fix corrective migrations unless an additive release cleanly supports dropping a newly created object with zero data loss.
