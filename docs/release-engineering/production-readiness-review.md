# Production Readiness Review & Risk Register

**Document ID**: `REL-PRR-2026-V1`  
**Program**: Program 13 — Release Engineering, CI/CD & Production Readiness

## 1. Readiness Assessment Matrix

| Control Area | Status | Evidence / Verification Scope |
| :--- | :--- | :--- |
| **Startup Env & Secret Validation** | `PASS` | `server/src/config/env.validation.ts` + Vitest unit tests (`env.validation.spec.ts`); invoked in `server/src/main.ts`. |
| **Client Bundle Secret Hygiene** | `PASS` | `scripts/verify-client-bundle-secrets.mjs` executed locally & wired into CI `security-audit`. |
| **Versioned SQL Migration Runner** | `PASS` (Local/CI) | `server/scripts/run-migrations.js` tracks `schema_migrations` with SHA-256 checksums + rollback; `render.yaml` `\|\| true` removed; PG16+pgvector job added to `.github/workflows/ci.yml`. |
| **CI Supply-Chain Hardening** | `PASS` | All GitHub Actions in `ci.yml` and `release-verify.yml` pinned to verified commit SHAs; `permissions: contents: read`. |
| **Post-Deploy Strict Smoke Suite** | `PASS` | `scripts/smoke-test.mjs --strict --require-api` verified `8/8` live Vercel probes + live Render `https://cambium-api-ufj3.onrender.com/health` (`database: connected`); `.github/workflows/release-verify.yml` added. |
| **Release Documentation & Changelog** | `PASS` | `CHANGELOG.md` + 9 documents in `docs/release-engineering/`. |
| **GitHub Branch Protection (`main`)** | `PARTIAL` | Documented in `branching-strategy.md`; requires maintainer toggle in GitHub repository settings. |
| **Render Live API & Supabase Connection** | `PASS` (Health) / `PARTIAL` (PITR) | `https://cambium-api-ufj3.onrender.com/health` verified `HTTP 200 OK` (`database: "connected"`, live `gitSha`); Supabase PITR backup schedule requires dashboard confirmation. |

## 2. Production Risk Register

| ID | Risk | Severity | Likelihood | Owner | Mitigation / Remediation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `RISK-REL-01` | Direct pushes to `main` bypassing PR CI gates | High | Medium | Repo Admin | Enable GitHub branch protection on `main` requiring `ci.yml` status checks and 1 review. |
| `RISK-REL-02` | Frontend & backend schema/API version skew during deploy | Medium | Medium | Release Eng | Enforce expand-and-contract migrations and backward-compatible API contracts (`database-release-policy.md`). |
| `RISK-REL-03` | Single-tier hosting without persistent staging DB | Medium | High | Platform Ops | Use CI ephemeral `pgvector/pgvector:pg16` for migration verification + Vercel PR previews; never point previews at prod DB. |
| `RISK-REL-04` | Render free/starter cold-start timeouts during `/health` | Low | Medium | Platform Ops | `/health` keeps fast `SELECT 1`; smoke tests allow configurable timeout and explicit `--require-api` flag. |
