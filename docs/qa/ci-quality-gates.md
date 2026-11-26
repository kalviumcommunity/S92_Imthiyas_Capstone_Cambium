# Cambium Research — CI Quality Gates

## 1. Automated Gate Matrix (`.github/workflows/ci.yml`)

| Job | Required Checks | Release Blocking |
| :--- | :--- | :--- |
| `server-verification` | `npm run build` (`tsc`), `npm test` (Vitest + Redis service), explicit security & QA suites (`src/security/`, `src/qa/`) | Yes |
| `client-verification` | `npm run lint`, `tsc --noEmit`, `npm run build` | Yes |
| `root-unit-tests` | `npm run test:jest` (`tests/unit/*.spec.ts` including schema/middleware/HTTP contracts) | Yes |
| `security-audit` | Gitleaks secret history scan + `npm audit --omit=dev` across root, client, server | Yes |
| `e2e-verification` | Headless Chromium Playwright suite (`tests/e2e/01`–`07`, WCAG 2.2 AA Axe checks, mobile + desktop responsive checks) | Yes |
| `container-verification` | Docker multi-stage build validation for `server/Dockerfile` and `client/Dockerfile` | Yes |

## 2. Local Unified Pre-Release Verification

```bash
npm run test:all
```
