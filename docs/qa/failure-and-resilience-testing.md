# Cambium Research — Failure & Resilience QA Verification

## 1. Covered Failure Modes

1. **Duplicate Submit / Network Retry Safety (`IdempotencyInterceptor`)**:
   - Enforces mandatory `Idempotency-Key` headers on sensitive mutations (`400 Bad Request` when absent).
   - Replays cached `COMPLETED` response payloads without re-executing handlers.
   - Rejects concurrent in-flight `PROCESSING` collisions with `409 Conflict`.
   - Deletes transient locks in `catchError` when downstream execution fails so safe retries are unblocked.
2. **Upstream Timeout & Cascading Failure Prevention (`CircuitBreakerService`)**:
   - Opens circuits (`CLOSED -> OPEN`) when upstream APIs (OpenAlex / CrossRef / ORCID) exceed failure thresholds, routing callers directly to degraded fallbacks rather than exhausting threads.
   - Executes timed half-open canary probes after cooldown (`HALF_OPEN -> CLOSED`) when upstream health restores.
3. **Database Unavailability Readiness Isolation (`AppController`)**:
   - Separates HTTP process liveness (`200 UP`) from PostgreSQL readiness (`503 Service Unavailable`) while suppressing raw socket details (`ECONNREFUSED`).
