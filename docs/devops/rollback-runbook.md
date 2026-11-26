# Rollback & Forward-Recovery Runbook (Phase 11)

## 1. Frontend Rollback (Vercel)
- Open Vercel -> Deployments -> Promote previous verified deployment (< 60s traffic cutover).

## 2. Backend Rollback (Render)
- Safe **only when schema remains backward-compatible** with the prior backend commit.
- Trigger manual deploy of previous green commit SHA from Render dashboard, then re-run `scripts/smoke-test.mjs --strict`.

## 3. Configuration & Secret Rollback
- Revert faulty env var override in Vercel/Render dashboard and trigger service restart; clear corrupted CDN cache if public client values changed.

## 4. Database Rollback vs Forward Recovery
- **NEVER run destructive down-migrations in production blindly.**
- If an additive migration broke an API contract while data remains intact, revert the application release first (`Render`).
- If a migration corrupted schema state or partially failed mid-transaction, restore the PostgreSQL `BEGIN ... ROLLBACK` trace or apply a reviewed **forward-fix SQL migration** (`NNN+1_*.sql`); only restore from snapshot if irreversible data loss occurred.
