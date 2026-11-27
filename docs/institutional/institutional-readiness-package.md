# Cambium Research — Institutional Readiness Package

**Audience:** Faculty Mentors, Innovation Centres, R&D Directors, Institutional IT Reviewers  
**Status Disclosure:** Describes verified codebase controls alongside explicit boundaries and partial capabilities. This package does not constitute legal certification or formal SOC 2 / ISO 27001 attestation.

---

## A. Product & Value Proposition
Cambium consolidates research grant discovery, cross-disciplinary literature topology, collaborative project workspaces, document verification, and institutional proposal/compliance workflows inside a single PostgreSQL-backed platform.

## B. Technical Architecture & Deployment Model
- **Frontend:** Next.js 16 App Router + React 19 (deployed on Vercel; supports standalone Node/Docker).
- **Backend:** NestJS 12 modular monolith in TypeScript (deployed on Render; Docker Compose ready).
- **Database:** PostgreSQL 16 + `pgvector` (`768`-dim `gemini-embedding-001` HNSW + GIN full-text index), bounded `DB_POOL_MAX = 20`, `statement_timeout = 15000ms`.
- **Resilience:** Circuit breakers on external APIs, durable `background_jobs` queue fallback (`SKIP LOCKED`), and `AbortSignal.timeout` guards on external HTTP calls.

## C. Security, Privacy & AI Governance Boundaries
- **Implemented Safeguards (`VERIFIED`):** Dual JWT access + HttpOnly refresh cookies, 5-attempt / 15-minute login lockout, bcrypt (`salt=12`) password hashing, 10-role RBAC enforcement (`RolesGuard`), TypeORM parameterized queries, SHA-256 chained `audit_logs`, 50MB magic-byte upload validation, and `<untrusted_source_data>` prompt delimiting (`3,500` chars).
- **Known Limitations (`PARTIALLY VERIFIED` / Manual Today):** Local defaults simulate Resend email outbox (`RESEND_API_KEY` optional), SAML test IdPs (`SAML_CERT` required for production university IdP), and local disk artifact uploads (managed object storage recommended for multi-replica production). Full details: [`docs/audit/KNOWN_LIMITATIONS.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/audit/KNOWN_LIMITATIONS.md).

## D. Operational Readiness & Support
- **Health & Monitoring:** `GET /health`, `GET /api/telemetry/metrics` (p50/p90/p95/p99), `GET /api/v1/performance/metrics` (RSS, heap, event-loop lag, cache ratio).
- **Runbooks & DR:** Backups (`npm run backup:db`), staging-first restoration (`npm run restore:db`), and 10 documented incident response runbooks at [`docs/operations/operational-runbooks-and-troubleshooting.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/operations/operational-runbooks-and-troubleshooting.md).
- **Escalation & Security Disclosure:** [`SECURITY.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/SECURITY.md) (`shaik.imthiyas.t@gmail.com`).

## E. Mentor & Evaluator Verification Scenarios
Follow [`docs/release/mentor-quick-start.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/release/mentor-quick-start.md) to verify self-service signup, seeded grant hybrid search, bookmark persistence across reloads, collaborative workspaces, and cross-user isolation.

## F. Institutional Pilot Onboarding Checklist
1. Provision managed PostgreSQL 16 + `pgvector` and apply [`schema.sql`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/database/schema.sql).
2. Configure server secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`, `CORS_ORIGIN`, `RESEND_API_KEY`, `GEMINI_API_KEY`) using [`server/.env.example`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/.env.example) and run `npm run verify:env -- --production`.
3. Configure institutional `SAML_ENTRY_POINT` / `SAML_ISSUER` / certificate if federated university SSO is required.
4. Assign designated R&D administrator roles and run `npm run health` + `npm run smoke` before inviting pilot scholars (`5–10` initial users recommended).
