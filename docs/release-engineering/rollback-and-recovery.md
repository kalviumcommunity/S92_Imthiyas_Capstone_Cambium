# Rollback & Recovery Procedures

**Document ID**: `REL-RECOVER-2026-V1`

## 1. Recovery Mode Distinction

| Recovery Type | Scope | When to Use | Reverses DB Data? |
| :--- | :--- | :--- | :--- |
| **Code Rollback** | Vercel / Render previous deployment | UI regression, API bug, backward-compatible schema | **No** |
| **Configuration Rollback** | Vercel / Render env var revert + redeploy | Bad feature flag, CORS typo, provider key issue | **No** |
| **Forward-Fix Deployment** | New hotfix PR (`hotfix/vX.Y.Z`) | Fast patch when rollback is blocked by schema changes | Optional (new migration) |
| **Database Backup Restoration** | Supabase / `npm run restore:db` | Accidental data loss, failed non-transactional change | **Yes (to RPO point)** |

> **Critical Rule**: Reverting application code on Vercel or Render does **not** reverse database schema or data mutations. Never assume a code rollback undoes a migration.

## 2. Component Playbooks

### A. Failed Frontend Deployment (Vercel)
1. Open Vercel Dashboard → **Deployments** → select last verified production deployment → **Instant Rollback**.
2. Verify `https://cambium-research.vercel.app` via `node scripts/smoke-test.mjs --strict --target=https://cambium-research.vercel.app`.
3. Open a `hotfix/` branch to fix the root cause before re-merging.

### B. Failed Backend Deployment (Render)
1. If startup failed during `validateStartupEnvironment()` or `migrate:up`, inspect Render deploy logs (old healthy instance remains live if pre-deploy/startup check fails before port bind).
2. If bad code went live, click **Manual Deploy → Rollback to previous commit** in Render Dashboard (only if database schema remains backward-compatible).
3. Verify `/health` returns `status: "ok"` and expected `gitSha`.

### C. Database Migration Failure or Data Incident
1. Because `run-migrations.js` wraps each migration in `BEGIN ... ROLLBACK`, failed SQL migrations leave `schema_migrations` clean. Fix the SQL in a new commit and re-deploy.
2. For data corruption, restore from latest verified dump (`npm run restore:db`) or Supabase Point-in-Time Recovery (PITR), then re-run `npm run verify:db` and `smoke-test.mjs --strict`.
