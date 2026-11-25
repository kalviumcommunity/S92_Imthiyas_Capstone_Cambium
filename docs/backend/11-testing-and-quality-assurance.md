# Automated Backend & Database Testing Strategy (`11`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Test Pyramid Inventory
| Layer | Suite(s) | Coverage Focus |
| :--- | :--- | :--- |
| **Backend & DB Engineering** | [`server/src/backend-engineering.spec.ts`](../../server/src/backend-engineering.spec.ts) | `AllExceptionsFilter` PG SQLSTATE/JSON mapping, `validateServerEnv`, `User.passwordHash` `select: false`, `OpportunitiesService` pagination/bulk tx/ownership, `BookmarksService` `23505` race handling, `FundingService` N+1 removal & `pessimistic_write` lock assertions, `ProposalsService` workflow transitions, `IngestionService` `Promise.allSettled`, `BillingService` atomic transaction + DTO whitelisting, Migration 002 verification. |
| **Adversarial Security** | [`server/src/security/adversarial-security.spec.ts`](../../server/src/security/adversarial-security.spec.ts) | 10-scenario multi-actor BOLA/IDOR, RBAC, token/SAML bypass, upload magic-bytes, RLS contract, AI prompt boundary, SSRF, mass assignment, open redirect. |
| **Domain & Resilience Specs** | `server/src/**/*.spec.ts` | Projects, Community, Connections, Contributions, Opportunities, Upload, OCR, Auth, SAML, Redlock, OutboxRelay, CircuitBreaker, Telemetry, ETag, Idempotency, Redis, Queue, CrossTenantIsolation, DisasterRecovery. |
| **Monorepo Contract & Utils** | `tests/unit/*.spec.ts` | 10 Jest suites covering Citations, Boolean Query AST, Tokens/Contrast, RAG Search, Audit Merkle Chain, SSE Backpressure, Contributions Ledger, HTTP Resilience. |
