# Cambium Research — Mentor Pilot Readiness Report

**Document ID**: `QUAL-PILOT-PRR-2026-V1`  
**Target Pilot Cohort**: 5–10 Technical Mentors (Controlled Pilot)  
**Program**: Program 14 — End-to-End Integration, Acceptance Testing & Mentor Pilot Readiness  

---

## 1. Executive Verdict

**Verdict**: **`READY WITH EXPLICIT RESTRICTIONS`**

Cambium Research has resolved all discovered P0/P1 integration, authentication, and cross-user isolation defects in repository source and verified end-to-end builds and test suites cleanly (`39/39` backend Vitest files / `186` tests, `10/10` root Jest suites / `87` tests, `57/57` Next.js production routes, `3/3` Playwright pilot journeys, and `8/8` Vercel + Render live smoke probes). The controlled mentor pilot may proceed under three explicit boundaries:
1. Self-service automated email password reset is **not implemented** (`NOT IMPLEMENTED`); credential resets during the pilot are coordinator-assisted (`/forgot-password` discloses this honestly).
2. Live Agentic AI endpoints (`/api/v1/assistant/*`) are gated by `SubscriptionGuard` (`@RequiresSubscription('pro')`); free-tier pilot mentors use grounded client synthesis (`rag-engine.ts`) and core discovery/workspace/graph workflows unless granted `pro` tier.
3. No confidential or unpublished human-subject research data should be uploaded during the pilot.

---

## 2. Architecture Integration Map

| Component | Producer | Consumer | Contract | Persistence | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth Lifecycle** | `AuthController` (`/api/auth/*`, `/api/v1/auth/*`) | `sign-in`, `sign-up`, `useAuthStore` | JWT + `HttpOnly` cookie (`credentials: "include"`) | PostgreSQL `users` + Redis blacklist | `PASS` (Vitest + E2E) |
| **Token Rotation** | `POST /auth/refresh` | `client/lib/http-client.ts` (`apiFetch`) | Cookie/body refresh token -> new access JWT | Redis token rotation | `PASS` (`http-resilience.spec.ts` + `apiFetch`) |
| **Discovery & Bookmarks** | `OpportunitiesController`, `BookmarksController` | `client/lib/api.ts` | REST JSON + JWT + caller `user.id` scope | PostgreSQL `research_opportunities`, `bookmarks` | `PASS` (`pilot-acceptance.spec.ts` IDOR test) |
| **Collaborative Workspaces** | `ProjectsController`, `ProjectsService` | `/workspace` | CRUD + CRediT roster + `DELETE /members/:id` | PostgreSQL `group_projects`, `project_members`, Outbox | `PASS` (`projects.service.spec.ts`) |
| **Research Uploads** | `UploadController`, `UploadService` | `/workspace/upload` (`uploadArtifact`) | `multipart/form-data`, SHA-256, 50 MB + magic-byte check | Disk storage + ownership metadata | `PASS` (`upload.service.spec.ts` + `adversarial-security.spec.ts`) |
| **Agentic AI & Fallback** | `AssistantController`, `AiAutocompleteController` | `rag-engine.ts`, `/agent-reader` | `@RequiresSubscription('pro')` + offline grounded fallback | Stateless / contextual chunks | `PASS` (`pilot-acceptance.spec.ts` + Jest Suite 08) |

---

## 3. Pilot Acceptance Gates Summary

| Gate | Status | Supporting Evidence |
| :--- | :--- | :--- |
| **Gate A — Security & Isolation** | `PASS` | Fixed P0 bookmark IDOR (`bookmarks.controller.ts`), fixed `SubscriptionGuard` metadata bypass (`subscription.guard.ts`), passed `adversarial-security.spec.ts` (10 tests), `cross-tenant-isolation.spec.ts` (6 tests), and `pilot-acceptance.spec.ts` (3 tests). |
| **Gate B — Core Workflows** | `PASS` (with noted limits) | `AuthController.register` route hijack resolved; `apiFetch` with `credentials: "include"` wired across `api.ts`; upload rejection throws honest error instead of mocking success. |
| **Gate C — Data Integrity** | `PASS` | Duplicate bookmark/invite protections verified; failed uploads never write `"verified"` mock records; `logout()` invokes backend revocation alongside cookie clearing. |
| **Gate D — Reliability** | `PASS` | `apiFetch` retries idempotent `GET` with jittered backoff, circuit breakers tested (`circuit-breaker.service.spec.ts`), network auth failures surface clear retryable errors (`07-pilot-journeys.spec.ts`). |
| **Gate E — Mentor Usability** | `PASS` | Auth errors, `/forgot-password` pilot notice, and [mentor-pilot-onboarding-guide.md](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/quality/mentor-pilot-onboarding-guide.md) ready for self-service pilot usage. |
| **Gate F — Operational Readiness** | `PARTIAL` | Runbooks, live Vercel + Render `/health` telemetry (`gitSha`), feedback taxonomy, and incident SLAs documented in [mentor-pilot-operations-and-feedback.md](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/quality/mentor-pilot-operations-and-feedback.md); GitHub `main` branch protection and Supabase PITR dashboard toggle remain maintainer manual checks. |

---

## 4. Workflow Acceptance Matrix (Journeys 1–10)

| # | Journey | Test Scope | Status | Evidence / Known Limitation |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Researcher onboarding | Register, login, profile persistence | `PASS` | Fixed `@Post('register')` bug; `auth.service.spec.ts` & `pilot-acceptance.spec.ts`. |
| 2 | Research discovery | Search, filters, bookmark & ownership | `PASS` | Cross-user bookmark delete blocked with `403 Forbidden`. |
| 3 | Research workspace | Create, edit metadata, persist | `PASS` | `projects.service.spec.ts` (15 tests). |
| 4 | Document lifecycle | Upload allowed vs disallowed/failed files | `PASS` | `upload.service.spec.ts` (13 tests); client no longer fakes `"verified"` on rejection. |
| 5 | AI research assistance | Entitlement, retrieval, offline fallback | `PARTIAL` | `/v1/assistant/*` requires `pro` subscription tier; offline RAG passes `08-client-rag-engine.spec.ts`. |
| 6 | Collaboration | Invite, accept, role update, revoke | `PASS` | `projects.service.spec.ts` verifies owner-only removal & audit outbox. |
| 7 | Privacy & isolation | Multi-actor BOLA/IDOR matrix | `PASS` | `adversarial-security.spec.ts`, `cross-tenant-isolation.spec.ts`, `pilot-acceptance.spec.ts`. |
| 8 | Account lifecycle | Sign out, sign in, session expiry, reset | `PARTIAL` | Logout revokes tokens; self-service email password reset `NOT IMPLEMENTED` (coordinator-assisted). |
| 9 | Failure recovery | Network outage / offline error feedback | `PASS` | `07-pilot-journeys.spec.ts` (3/3 Playwright tests passing). |
| 10 | Institutional workflows | Org admin isolation boundaries | `PASS` | `cross-tenant-isolation.spec.ts` (6/6 tests passing). |

---

## 5. Defect Register (Discovered & Remediated in Program 14)

| ID | Severity | Component | Root Cause & Fix Applied | Verification |
| :--- | :--- | :--- | :--- | :--- |
| `BUG-P14-01` | **P0** | [`auth.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/auth/auth.controller.ts#L48-L60) | Stray `@Post('register')` decorators on `private sanitizeAuthResponse` hijacked registration endpoint. Removed stray decorators so `register()` serves requests. | `pilot-acceptance.spec.ts` (`PASS`) |
| `BUG-P14-02` | **P1** | [`client/lib/api.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/lib/api.ts#L168-L259) | Raw `fetch()` calls lacked `credentials: "include"` and `apiFetch` `401` refresh handling. Wired `credentials: "include"` + `apiFetch` across auth, bookmarks, opportunities, assistant, and CRUD helpers; `logout()` now calls `/auth/logout`. | `client build` & `tsc` (`PASS`) |
| `BUG-P14-03` | **P1** | [`sign-in/page.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/app/%28auth%29/sign-in/page.tsx), [`sign-up/page.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/app/%28auth%29/sign-up/page.tsx) | Silent `"demo-token-..."` issuance on `Failed to fetch` masked outages. Replaced with honest error banners and retry prompts. | `07-pilot-journeys.spec.ts` (`PASS`) |
| `BUG-P14-04` | **P1** | [`forgot-password/page.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/app/%28auth%29/forgot-password/page.tsx) | Fake 900ms timeout claimed reset email was sent despite zero backend reset endpoints. Replaced with honest Coordinator-assisted reset notice (`NOT IMPLEMENTED`). | `07-pilot-journeys.spec.ts` (`PASS`) |
| `BUG-P14-05` | **P0** | [`bookmarks.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/bookmarks/bookmarks.controller.ts), [`bookmarks.service.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/bookmarks/bookmarks.service.ts) | `DELETE /bookmarks/:id` did not check caller ownership (`user.id`). Enforced ownership verification throwing `ForbiddenException`. | `pilot-acceptance.spec.ts` (`PASS`) |
| `BUG-P14-06` | **P0** | [`subscription.guard.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/auth/guards/subscription.guard.ts) | `RequiresSubscription` used `Reflect.metadata` instead of NestJS `SetMetadata`, causing `reflector.get` to return `undefined` and silently bypass `@RequiresSubscription('pro')`. Replaced with `SetMetadata`. | `pilot-acceptance.spec.ts` (`PASS`) |
| `BUG-P14-07` | **P1** | [`client/lib/api.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/lib/api.ts) (`uploadArtifact`) | Rejected/failed uploads fell back to saving a fake `"verified"` mock in `localStorage`. Fixed to throw explicit HTTP/upload errors cleanly. | `client build` (`PASS`) |

---

## 6. Executed Verification Evidence (Latest Run)
- **Server TypeScript Build (`npm --prefix server run build`)**: `PASS` (`tsc` exit `0`)
- **Server Unit, Security & Integration Suite (`npm --prefix server run test`)**: `PASS` (`39/39` files, `186/186` tests)
- **Root Jest Suite (`npm run test:jest`)**: `PASS` (`10/10` suites, `87/87` tests)
- **Client Lint (`npm --prefix client run lint`)**: `PASS` (`0` errors, `3` pre-existing warnings)
- **Client Production Build (`npm --prefix client run build`)**: `PASS` (`57/57` static routes compiled)
- **Playwright Pilot Honesty Suite (`npx playwright test tests/e2e/07-pilot-journeys.spec.ts`)**: `PASS` (`3/3` tests in `16.9s`)
- **Post-Deploy Live Smoke Check**: Re-verified after pushing final commits to `main` across Vercel & Render.
