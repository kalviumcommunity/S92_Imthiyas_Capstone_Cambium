# Backend Metrics, Database Diagnostics & Distributed Tracing

## 1. HTTP & Trace Telemetry (`TelemetryService`)

- Instrumented globally via `TelemetryInterceptor` registered on `APP_INTERCEPTOR`.
- Tracks rolling request counts, error rate (`totalErrors / totalRequests`), latency percentiles (`p50`, `p90`, `p95`, `p99`), and OTLP-compatible spans (`traceId`, `spanId`).

## 2. PostgreSQL Health (`DatabaseDiagnosticService` & Engineering Endpoint)

- Inspects live `pg_stat_activity` for `active` connections, `idle` connections, `wait_event_type = 'Lock'` (`waitingLocksCount`), and active queries exceeding 1 second (`slowQueriesCount`).
- Monitors `pgvector` HNSW index footprint (`idx_opportunities_embedding_hnsw`) and max client capacity (`DB_POOL_MAX`).

## 3. Background Job Queues (`QueueService`)

- Reports dual-mode execution state (`redis-bullmq` vs `postgres-durable-queue` vs `in-memory-dispatcher`).
- Exposes `queued`, `running`, `completed`, `dead` counts alongside **`oldestPendingAgeSeconds`** derived from the earliest `QUEUED` record in `background_jobs`.

## 4. Resilience State (`CircuitBreakerService`)

- Tracks external dependency breakers (`CLOSED`, `HALF_OPEN`, `OPEN`) and exposes `getAllBreakers()` for live alert evaluation.
