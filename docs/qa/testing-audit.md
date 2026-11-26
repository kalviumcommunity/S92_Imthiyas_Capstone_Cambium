# Cambium Research — Testing Reconnaissance & Quality Audit (Phase 0)

**Document ID**: `QA-CAMBIUM-AUDIT-2026`  
**Audit Baseline**: `main` (`f15662d`)  
**Inspect Scope**: Root `tests/`, `server/src/**/*.spec.ts`, `client/`, `playwright.config.ts`, `.github/workflows/ci.yml`.

---

## 1. Existing Testing Inventory Baseline
- **Monorepo Unit Tests (`Jest` + `ts-jest`)**: `10` suites in `tests/unit/` covering domain engines (citation formatting, boolean AST query parser, token contrast, formatters, offline queue, cryptographic audit ledger, BM25 index, client RAG engine, evidence contributions, HTTP retry resilience).
- **Backend Unit Tests (`Vitest --pool=threads`)**: `35` suites across `server/src/**/*.spec.ts` (including `adversarial-security.spec.ts`, `cross-tenant-isolation.spec.ts`, `auth.service.spec.ts`, `projects.service.spec.ts`, `upload.service.spec.ts`, `disaster-recovery.spec.ts`).
- **End-to-End Browser (`Playwright` + `@axe-core/playwright`)**: `6` spec files in `tests/e2e/`.

---

## 2. Critical Quality & Verification Gaps Uncovered

| Gap ID | Severity | Component | Evidence Observed | Remediation Target |
| :--- | :---: | :--- | :--- | :--- |
| `QA-01` | **SEV-1** | `tests/e2e/05-accessibility-audit.spec.ts`, `06-post-deployment-smoke-probes.spec.ts` | Protected routes (`/dashboard`, `/opportunities`, `/graph`, `/workspace/upload`, `/audit`, `/settings`) visited **unauthenticated**; Edge [`middleware.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/middleware.ts) issues `307` redirect to `/sign-in?notice=auth_required` | Sprint 4 (`auth-session.ts` fixture + explicit guest redirect check + authenticated page audits) |
| `QA-02` | **SEV-2** | `tests/e2e/01-auth-and-dashboard.spec.ts#L35-L40` | Silent `try { waitForURL } catch { goto("/dashboard") }` bypasses broken login transitions; arbitrary `waitForTimeout(300..500)` delays in specs `02` & `03` | Sprint 4 (Strict assertions & Playwright auto-wait) |
| `QA-03` | **SEV-2** | Backend HTTP Integration (`server/src/`) | `@nestjs/testing` & `supertest` omitted; all backend specs call service classes in-process without exercising real HTTP `ValidationPipe`, `ParseUUIDPipe`, guard ordering, or error HTTP codes | Sprint 2 (`http-contracts.integration.spec.ts` via native `NestFactory.create()`) |
| `QA-04` | **SEV-2** | Frontend Forms & Middleware (`client/`) | Zero automated tests verifying Zod `loginSchema` / `registerSchema`, `middleware.ts` JWT/open-redirect protection, or client error handling | Sprint 1 (`tests/unit/11-frontend-qa-contracts.spec.ts`) |
| `QA-05` | **SEV-2** | End-to-End Workspace Isolation & Upload | Zero Playwright journeys verifying cross-user workspace denial, upload rejection UI, logout clearing, and mobile (`375px`) horizontal overflow boundaries | Sprint 4 (`07-journeys-isolation-and-responsive.spec.ts`) |
| `QA-06` | **SEV-3** | Live Render Deployment (`Program 06` finding) | Remote `https://cambium-api-ufj3.onrender.com/api/v1/opportunities` returned `500` / `503` live | Tracked in Defect Register (`DEF-2026-001`) |
