# Observability, Error Handling & Startup Reliability (`10`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Request Correlation & Telemetry (`TelemetryInterceptor`, `TelemetryService`)
- Propagates or generates `X-Request-Id`, `x-trace-id`, `x-span-id`, and W3C `traceparent` headers on every HTTP response.
- Records per-route latency percentiles (`p50`, `p95`, `p99`) and error rates surfaced cleanly to admin diagnostics (`GET /api/database/diagnostics`, `GET /api/v1/performance/metrics`).
- Structured slow/5xx log emitter logs metadata without printing user passwords or bearer tokens.

## 2. Global Exception Normalization & Graceful Lifecycle
- **`AllExceptionsFilter` (`server/src/common/filters/all-exceptions.filter.ts`)**: Normalizes HTTP exceptions, malformed JSON (`400 MALFORMED_JSON_BODY`), and PostgreSQL driver SQLSTATE errors (`23505` -> `409`, `23503` -> `400`, `23514` -> `400`, `22P02` -> `400`) without exposing internal queries or stack traces.
- **`validateServerEnv()` (`server/src/config/env-validator.ts`)**: Fails fast at startup in `production` when `JWT_SECRET` is missing, shorter than 16 chars, or matches dev fallbacks, or when Postgres host/URL configuration is omitted.
- **Shutdown & Health (`server/src/main.ts`, `AppController`)**: `app.enableShutdownHooks()`, bounded Express server timeouts (`keepAliveTimeout: 65s`, `headersTimeout: 66s`, `requestTimeout: 30s`), public `/health` & `/health/liveness` probes, and `SuperAdmin`/`ComplianceOfficer`-protected `/api/database/diagnostics`.
