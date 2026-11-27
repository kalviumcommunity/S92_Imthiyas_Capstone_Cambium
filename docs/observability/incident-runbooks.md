# Cambium Incident Response Runbooks (`RB-OBS-01` .. `RB-OBS-06`)

## `RB-OBS-01`: API HTTP Error Rate High
1. Inspect `GET /api/v1/analytics/dashboards/engineering` (`telemetry`, `clientErrors.recent`).
2. Check `/api/health` readiness probe (`PostgreSQL` connectivity).
3. Inspect recent structured logs (`severity: "ERROR"`, group by `operation` and `errorCategory`).
4. Roll back recent deployment if errors correlate with a schema mismatch or missing env variable.

## `RB-OBS-02`: API p95 Latency Elevated
1. Compare `database.slowQueriesCount` and `queues.summary.oldestPendingAgeSeconds`.
2. Inspect `/api/telemetry/traces` for long spans across `HybridSearchService` or external grant APIs.
3. Verify Redis cache hit state via `GET /api/v1/telemetry/diagnostics` (falls back gracefully to L1 memory if Redis disconnects).

## `RB-OBS-03`: PostgreSQL Pool Saturation or Lock Contention
1. Inspect `pg_stat_activity` for blocked `wait_event_type = 'Lock'` queries or idle-in-transaction sessions.
2. Confirm `DB_POOL_MAX` aligns with PgBouncer / PostgreSQL `max_connections`.
3. Terminate long-running runaway maintenance transactions only after verifying write safety.

## `RB-OBS-04`: Background Queue Backlog / Dead-Letter Spike
1. Inspect `background_jobs` rows with `status IN ('QUEUED', 'DEAD')` sorted by `created_at ASC`.
2. Confirm Redis connectivity (`REDIS_URL` / `REDIS_HOST`); when Redis is unavailable, `QueueService` switches to `postgres-durable-queue` polling up to 3 concurrent workers.
3. Requeue recoverable `DEAD` jobs after fixing underlying transient handler faults.

## `RB-OBS-05`: External Circuit Breaker OPEN
1. Identify affected service name in `circuitBreakers` (`orcid_api`, `crossref_api`, `gemini`, etc.).
2. Expect degraded/fallback mode while cooldown timer (`30s` default) elapses before `HALF_OPEN` canary probe.
3. Check upstream API status or rate-limit headers before increasing concurrency.

## `RB-OBS-06`: AI Fallback / Failure Rate Spike
1. Verify `GEMINI_API_KEY` configuration and upstream quota health on Google Generative Language API.
2. Inspect `GET /api/v1/analytics/dashboards/ai` for `failureCategory` (`offline_mode` vs `upstream_unavailable`).
3. Confirm deterministic local fallback responses remain active so scholars experience zero unhandled HTTP 500 crashes.
