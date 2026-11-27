# Cambium Research — Three-Layer Analytics & Observability Architecture

## 1. System Diagram

```mermaid
flowchart LR
    Next["Next.js 15 Client (Error Boundaries + Role Dashboards)"] -->|"Sanitized Beacons & Role Queries"| Nest["NestJS 10 API"]
    Nest --> Telemetry["TelemetryModule (W3C Trace + p50/p95/p99 + OTLP)"]
    Nest --> Logger["StructuredLoggerService (JSON + Secret Scrubbing)"]
    Nest --> Analytics["AnalyticsModule (Funnels + Cohorts + AI Obs + Alerts)"]
    Nest --> Queues["QueueService (BullMQ / Postgres Jobs Depth & Age)"]
    Nest --> DBDiag["DatabaseDiagnosticService (pg_stat_activity + Locks)"]
    Analytics --> PG[("PostgreSQL: analytics_events, ai_telemetry_events, client_error_events")]
```

## 2. Trust Boundaries & Operational Isolation

1. **Free-First Self-Contained Storage**: All telemetry & analytics persist directly inside PostgreSQL (`analytics_events`, `ai_telemetry_events`, `client_error_events`) and process memory (`TelemetryService`), introducing `$0` recurring vendor SaaS fees and zero third-party subprocessor sharing.
2. **Role-Gated Intelligence Access**: Metrics and dashboard routes (`/api/telemetry/*`, `/api/v1/analytics/dashboards/*`) are guarded strictly by `JwtAuthGuard` + `RolesGuard` (`SuperAdmin`, `RDDirector`, `UniversityLeadership`, `ComplianceOfficer`, with institutional dashboards strictly tenant-scoped by `organizationId` and `>= 3` cohort minimums).
3. **Resilience Guarantee**: Every domain emitter catches storage failures locally and logs a warning via `StructuredLoggerService`, preventing telemetry degradation from causing HTTP `500` errors on scholarly endpoints.
