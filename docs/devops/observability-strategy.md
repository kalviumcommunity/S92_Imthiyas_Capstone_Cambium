# Observability & Correlation Strategy (Phase 9)

## 1. End-to-End Request Correlation (`X-Request-Id`)
- Client [`apiFetch`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/lib/http-client.ts) attaches a UUID `X-Request-Id` on every outbound request.
- NestJS exposes `X-Request-Id`, `X-Trace-Id`, and `Traceparent` via CORS `exposedHeaders` and links request trace IDs across backend telemetry and AI telemetry (`ai_request_telemetry`).

## 2. Telemetry Surfaces (Without Tool Overlap)
- **Frontend**: Vercel deployment logs + Next.js error boundaries + client console/network trace IDs. Optional `NEXT_PUBLIC_SENTRY_DSN` supported when provisioned.
- **Backend**: Render structured NestJS logger + `/api/v1/health/circuit-breakers` + `/api/database/diagnostics` (`SUPER_ADMIN` / `COMPLIANCE_OFFICER` only).
- **Database**: `pg_stat_activity` / slow query visibility via `DatabaseDiagnosticService` and connection pool bounds (`DB_POOL_MAX=20`).
- **Sensitive Data Exclusion**: Logs exclude `Authorization` headers, cookies, DB credentials, raw API keys, and unredacted private user payloads.
