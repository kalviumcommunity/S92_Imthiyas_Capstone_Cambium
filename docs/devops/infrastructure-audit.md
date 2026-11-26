# Cambium Research — Infrastructure Audit (Phase 0)

**Document ID**: `DEVOPS-CAMBIUM-AUDIT-2026`  
**Audit Date**: 2026-11-26  
**Baseline Branch**: `main` (`f15662d`)  
**Status**: `COMPLETED RECONNAISSANCE`

---

## 1. Live Production Snapshot & Deployment Parity

Direct non-destructive probes executed against deployed endpoints on `2026-11-26`:

| Target Endpoint | HTTP Status | Observed Behavior | Diagnostic Verdict |
| :--- | :---: | :--- | :--- |
| `https://cambium-research.vercel.app` | `200` | Served `523,341` bytes (`Server: Vercel`, `X-Vercel-Cache: HIT`), includes landing welcome intro | **PASS** |
| `https://cambium-research.vercel.app/welcome` | `200` | Route resolves and serves rendered welcome page | **PASS** |
| `https://cambium-api-ufj3.onrender.com/api/v1/health/liveness` | `200` | Returned `{"status":"UP","service":"Cambium Core Platform API","uptimeSeconds":17}` after initial cold-start wake | **PARTIAL** (17s+ cold start spin-up) |
| `https://cambium-api-ufj3.onrender.com/api/v1/health/readiness` | `200` | Returned `"database":"connected"`, `"redis":"degraded"`, `"environment":"production"` once warm (timed out at 25s on initial wake hit) | **PARTIAL** (`redis` degraded; `/health` timeout during spin-up) |
| `https://cambium-api-ufj3.onrender.com/api/v1/auth/me` | `401` | Unauthenticated request blocked cleanly | **PASS** |
| `https://cambium-api-ufj3.onrender.com/api/v1/assistant/chat` | `401` | Guard enforces JWT before controller handler | **PASS** |
| `https://cambium-api-ufj3.onrender.com/api/v1/opportunities` | **`500`** | **Live production HTTP 500 Internal Server Error** | **FAIL (P0 Defect)** |
| `https://cambium-api-ufj3.onrender.com/api/v1/assistant/conversations` | `404` | Route absent from deployed production build | **EXPECTED DRIFT** (feature PRs not yet merged to `main`) |

---

## 2. Deployed Code Parity vs GitHub Pull Requests

Only commits up to `main` (`f15662d — security: implement comprehensive defense-in-depth hardening program (Sprints 0-5)`) are live on Vercel/Render. Unmerged engineering programs reside on stacked PR branches:
- `feat/backend-db-engineering` (Backend/DB hardening)
- `feat/frontend-engineering` (Frontend architecture & cache scoping)
- `feat/ai-sprint-0-assessment` through `feat/ai-sprint-5-eval-and-docs` (AI registry, PGVector chunk retrieval, citation verification, evaluation harness)

---

## 3. Infrastructure Inventory (Observed Repository Configuration)

- **Frontend (`client/`)**: Next.js 16.4.6 App Router (`output: "standalone"`), [`client/vercel.json`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/vercel.json) configures `buildCommand: "node scripts/sync-logos.mjs && next build"` and security response headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`). [`client/next.config.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/next.config.ts) enforces restrictive production CSP.
- **Backend (`server/`)**: NestJS API bound to `0.0.0.0:${PORT || 5000}` ([`server/src/main.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/main.ts)), using TypeORM (`DB_SYNCHRONIZE` controlled via env) + `pg` + `ioredis` (graceful fallback when unavailable).
- **Deployment Manifest ([`render.yaml`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/render.yaml))**:
  - Uses `startCommand: (npm run schema:apply || true) && npm run start:prod` (**RISK**: `|| true` silently masks schema/migration failures).
  - Sets `healthCheckPath: /health` (which queries PostgreSQL readiness instead of fast process liveness).
  - Lists stale Render origin `https://cambium.onrender.com` in `CORS_ORIGIN` while live API runs at `https://cambium-api-ufj3.onrender.com`.
- **Database (`server/src/database/`, `server/scripts/`)**:
  - Consolidated DDL in `schema.sql` plus `migrations/001_supabase_rls_lockdown.sql`.
  - No database-backed migration history table (`schema_migrations`) or advisory lock preventing concurrent boot races.
- **CI/CD ([`.github/workflows/ci.yml`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/.github/workflows/ci.yml))**:
  - Runs 6 jobs: `server-verification`, `client-verification`, `root-unit-tests`, `security-audit` (`gitleaks` + `npm audit --omit=dev`), `e2e-verification` (Playwright), and `container-verification` (Docker buildx).
  - Lacks an actual PostgreSQL 16 + `pgvector` service job validating `schema.sql` and ordered `migrations/*.sql`.
- **Operational Scripts (`scripts/`)**:
  - Includes `verify-env.mjs`, `verify-db.mjs`, `smoke-test.mjs`, `backup-db.{mjs,ps1,sh}`, and `restore-db.{mjs,ps1,sh}`.
  - **CRITICAL SECRET HYGIENE FINDING**: Hardcoded non-placeholder local PostgreSQL fallback password discovered in 7 operational/helper scripts (`scripts/backup-db.*`, `scripts/restore-db.*`, `server/scripts/test-query.js`). Credential values are redacted per policy and queued for immediate remediation.

---

## 4. Prioritized Risks & Remediation Plan

| ID | Severity | Finding | Target Remediation Sprint |
| :--- | :---: | :--- | :--- |
| `OPS-01` | **P0** | Live `/api/v1/opportunities` returns HTTP `500` and `render.yaml` masks DDL failures with `\|\| true` | Sprints 2 & 3 (Migration ledger + strict startup + Render log inspection) |
| `OPS-02` | **P1** | Hardcoded non-placeholder database password fallback in 7 backup/restore/test scripts | Sprint 1 (Fail-fast env requirement) |
| `OPS-03` | **P1** | No `schema_migrations` version table, checksum validation, or PostgreSQL advisory lock | Sprint 2 (`run-migrations.js`) |
| `OPS-04` | **P1** | No `SIGTERM`/`SIGINT` HTTP/DB connection draining hooks or strict production secret validation in `main.ts` | Sprint 1 (`env.validation.ts` + shutdown hooks) |
| `OPS-05` | **P2** | Render `healthCheckPath` hits DB readiness (`/health`) instead of `/api/v1/health/liveness`; 17s cold-start times out `smoke-test.mjs` (5s) | Sprints 3, 4 & 5 |
| `OPS-06` | **P2** | CI pipeline omits live PostgreSQL 16 + `pgvector` migration verification | Sprint 3 (`ci.yml`) |
