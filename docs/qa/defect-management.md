# Cambium Research — QA Defect Ledger & Triage Workflow

## 1. Severity Classification

- **P0 (Critical / Blocker)**: Authentication bypass, cross-tenant/IDOR leak, corrupted/partial DB writes, unhandled runtime crash on primary workflow.
- **P1 (High)**: Validation bypass allowing bad input or mass-assignment fields, broken primary journey redirect, WCAG critical violation.
- **P2 (Medium)**: Non-blocking visual overlap at specific viewports, flaky timing/hydration race, minor accessibility warning.

## 2. Defects Discovered & Resolved During Program 08 QA

| ID | Severity | Component | Root Cause Discovered by QA | Resolution Verified |
| :--- | :--- | :--- | :--- | :--- |
| `QA-DEF-001` | P0 | `server/src/modules/auth/auth.controller.ts` | Stray `@Post('register')` decorator on `private sanitizeAuthResponse()` caused Express to route `POST /api/v1/auth/register` to the helper, bypassing `ValidationPipe` and `AuthService.register()` | Removed duplicate decorator; verified `400` mass-assignment block & `201` real registration via live HTTP wire test |
| `QA-DEF-002` | P1 | `client/middleware.ts` | `sanitizeInternalRedirect` permitted `\r`/`\n` header-injection sequences in redirect targets | Added `/[\r\n\0]/` rejection; verified in `tests/unit/11-frontend-qa-contracts.spec.ts` |
| `QA-DEF-003` | P1 | `client/app/(protected)/portfolio/page.tsx` & `EvidenceBasedContributions.tsx` | Unchecked `.metrics.` / `.impact.` / `.monthlyTotals.` / `.githubIntegration.` / `for (const it of items)` dereferences caused runtime `TypeError` when `/contributions` returned sparse JSON | Added safe array/optional chaining guards; verified zero `[Cambium Protected Route Exception]` errors during smoke probes |
| `QA-DEF-004` | P1 | `tests/e2e/` (`01`, `02`, `03`, `04`, `05`, `06`) | Protected-route Playwright suites ran unauthenticated and hit middleware redirects, while `01` swallowed failed `/dashboard` redirects in a `try/catch` | Added `tests/e2e/helpers/auth-session.ts`, removed silent bypass in `01`, and proved guest redirects explicitly in `07` |
| `QA-DEF-005` | P2 | `/sign-in` at `1280x720` | Fixed `CookieConsentBanner` overlaps bottom submit button when Identity Provider card expands on laptop viewport | Dismissed consent banner cleanly in `01` flow and tracked fixed-banner spacing for future layout polish |
