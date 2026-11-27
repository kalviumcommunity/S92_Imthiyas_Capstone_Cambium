# Operational Runbooks & Troubleshooting Guide (10 Core Scenarios)

**Status:** `VERIFIED` (every script and health check references existing repository tooling; rollback verification depends on hosting provider snapshot policy)

---

## 1. Frontend Deployment Fails (Vercel)
- **Symptoms:** Preview/production deploy fails on `next build` or serves stale cached shell.
- **Diagnostics:** Run `npm --prefix client run lint && npm --prefix client run build` locally; inspect `vercel.json` and `client/next.config.ts`.
- **Safe Recovery:** Clear `.next-dev`/`.next` if type validator caches drifted; revert offending UI commit or trigger Vercel Instant Rollback to previous green build.
- **Verification:** Confirm `HTTP 200` on `/` and `/sign-in`; bump `CACHE_NAME` in `client/public/sw.js` if browser clients hold stale SW shell.

## 2. Backend Becomes Unavailable (Render)
- **Symptoms:** `502`/`503` responses on API Gateway (`GET /health` fails).
- **Diagnostics:** Run `npm run health` or inspect Render service logs (`tsc` startup errors, unhandled env check, or OOM). Run `npm run verify:env -- --production`.
- **Safe Recovery:** Roll back to previous green Render deployment; restart service after correcting missing env secrets (`JWT_SECRET`, `DATABASE_URL`).
- **Verification:** Confirm `GET /health` returns `{ status: "ok", database: "connected" }` and run `npm run smoke`.

## 3. PostgreSQL Connections Exhausted
- **Symptoms:** Errors reporting `remaining connection slots are reserved` or `connectionTimeoutMillis` (`5000ms` timeout).
- **Diagnostics:** Inspect `DB_POOL_MAX` (default `20` in `database.config.ts`) and active background jobs (`QueueService` concurrency capped at `3`).
- **Safe Recovery:** Temporarily reduce `DB_POOL_MAX` if multiple API instances exceed Postgres limit, terminate stuck idle-in-transaction queries, or route via PgBouncer (`POSTGRES_PGBOUNCER_PORT`).
- **Verification:** `npm run verify:db` succeeds cleanly without timeout.

## 4. Schema Application or Migration Fails
- **Symptoms:** `npm run schema:apply` errors on boot or startup SQL conflict.
- **Diagnostics:** Inspect DDL idempotency (`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`) in `server/src/database/schema.sql` and `migrations/`.
- **Safe Recovery:** Never drop tables in production. Restore pre-change snapshot via `npm run restore:db` if partial incompatible DDL ran, then fix SQL migration script before re-applying.
- **Verification:** Re-run `npm run verify:db`.

## 5. Authentication Provider Unavailable (Google OAuth / SAML)
- **Symptoms:** Google OAuth login (`AuthService.googleLogin`) rejects tokens (`6s` `AbortSignal.timeout`) or SAML assertion errors.
- **Diagnostics:** Check `GOOGLE_CLIENT_ID`, `SAML_ENTRY_POINT`, `SAML_ISSUER`, and external Google `userinfo` endpoint status.
- **Safe Recovery:** Email/password JWT authentication remains independent of Google/SAML and continues operating; surface maintenance notice if institutional IdP is down.
- **Verification:** Confirm `POST /api/v1/auth/login` and `/api/v1/auth/refresh` remain operational.

## 6. AI Provider Unavailable (`GEMINI_API_KEY` / Upstream Timeout)
- **Symptoms:** Slow AI assistant replies hitting `10s` timeout or Gemini `429`/`5xx` warnings.
- **Diagnostics:** Inspect structured logs for `Gemini generation fallback`; verify `GEMINI_API_KEY` quota.
- **Safe Recovery:** Core search (`idx_opps_fts` GIN + deterministic SHA-256 vector fallback) and `AssistantService` citation fallback remain active automatically without crashing user requests.
- **Verification:** Execute `POST /api/v1/assistant/chat` and verify grounded opportunity citations return `200 OK`.

## 7. Document Processing / Background Queue Stuck
- **Symptoms:** Jobs remain in `RUNNING` or `QUEUED` state on `background_jobs`.
- **Diagnostics:** Inspect Redis connectivity (`REDIS_URL`) and `QueueService.getMetrics()`.
- **Safe Recovery:** `QueueService.recoverStaleRunningJobs(300_000)` automatically re-queues jobs stuck in `RUNNING` > 5 minutes. Inspect `last_error` on `DEAD` jobs before re-enqueueing.
- **Verification:** Confirm `queued`/`running` counts drain to `0`.

## 8. Unexpected Cloud / AI Spend Increase
- **Symptoms:** Higher Gemini API usage or DB compute hours.
- **Diagnostics:** Check rate-limit enforcement (`120 req/min` default in `NetworkRateLimiterGuard`) and high-volume `ingestion` / batch embedding schedules.
- **Safe Recovery:** Pause manual `/api/v1/ingestion/trigger` runs, tighten per-route rate limits, or unset/rotate leaked API keys cleanly.
- **Verification:** Inspect request/error metrics via `GET /api/telemetry/metrics` and `GET /api/v1/performance/metrics`.

## 9. Suspected Unauthorized Access / Cross-Tenant Anomaly
- **Symptoms:** Unusual `401`/`403` bursts, SAML assertion mismatch, or flagged audit ledger entries.
- **Diagnostics:** Query tamper-evident hash chain via `POST /api/v1/audit/verify` and `GET /api/v1/audit/logs`.
- **Safe Recovery:** Rotate `JWT_SECRET` / `JWT_REFRESH_SECRET` (invalidates active sessions globally), revoke compromised OAuth/API keys, and follow [`SECURITY.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/SECURITY.md) disclosure contact (`shaik.imthiyas.t@gmail.com`).
- **Verification:** Hash chain verification passes and old tokens return `401 Unauthorized`.

## 10. Database Backup & Restoration Required
- **Symptoms:** Accidental deletion or corruption requiring point-in-time recovery.
- **Safe Recovery & Verification:** Take backup snapshots with `npm run backup:db` (`scripts/backup-db.mjs`) and verify restore onto an **isolated staging database first** using `npm run restore:db` (`scripts/restore-db.mjs`) before promoting recovery into production. See [`DISASTER_RECOVERY_PLAYBOOK.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/DISASTER_RECOVERY_PLAYBOOK.md).
- **Escalation:** Lead Maintainer (`shaik.imthiyas.t@gmail.com`) + infrastructure hosting owner.
