# Operational Health & Capacity Limits Summary

## Free-First Self-Contained Stack Architecture

Cambium achieves full product analytics, structured logging, database/queue telemetry, AI cost accounting, and privacy-preserving client error capture without paid third-party SaaS SDKs:
- **Persistence:** PostgreSQL 16 (`analytics_events`, `ai_telemetry_events`, `client_error_events`) protected by partial unique deduplication indexes and PostgreSQL Row-Level Security (`FORCE ROW LEVEL SECURITY`).
- **Telemetry Overhead:** All analytics & AI persistence runs non-blocking inside `try/catch` guards so database timeouts never abort scholarly user actions.
- **Consent & Governance:** Client UI tracking requires explicit opt-in consent, backend domain events enforce server-side authority, and institutional dashboards enforce `k >= 3` cohort anonymity suppression.
