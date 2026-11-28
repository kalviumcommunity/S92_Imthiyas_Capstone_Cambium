# Continuous Integration Pipeline Specification

**Document ID**: `REL-CI-2026-V1`  
**Workflow Source**: [`.github/workflows/ci.yml`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/.github/workflows/ci.yml)

## 1. Pipeline Jobs & Quality Gates

| Job ID | Name | Key Checks | Blocking? |
| :--- | :--- | :--- | :--- |
| `server-verification` | Backend API Verification | `npm ci`, `tsc` build, Vitest unit suite, adversarial security suite (with Redis 7 service) | Yes |
| `database-migration-verification` | Database Schema & Migration Gate | `pgvector/pgvector:pg16` service, `schema:apply`, `migrate:up` Pass 1 + Pass 2 idempotency + `migrate:status` | Yes |
| `client-verification` | Frontend UI Verification | `npm ci`, ESLint (`npm run lint`), `tsc --noEmit`, `next build` | Yes |
| `root-unit-tests` | Root Unit Tests | `npm ci`, `npm run test:jest` | Yes |
| `security-audit` | Dependency, Secret & Env Audit | Gitleaks full-history scan, `verify-client-bundle-secrets.mjs`, `verify-env.mjs --templates`, `npm audit --omit=dev` | Yes |
| `e2e-verification` | Playwright E2E & Accessibility | Headless Chromium Playwright E2E + Axe WCAG 2.2 AA checks | Yes |
| `container-verification` | Docker Multi-Stage Build | Validates `server/Dockerfile` & `client/Dockerfile` builds | Yes |

## 2. Supply-Chain & Security Controls

1. **Minimal Permissions**: Top-level `permissions: contents: read` prevents workflows from modifying repository state.
2. **SHA-Pinned Actions**: Third-party actions (`actions/checkout`, `actions/setup-node`, `gitleaks/gitleaks-action`, `actions/upload-artifact`, `docker/setup-buildx-action`, `docker/build-push-action`) are pinned to immutable commit SHAs.
3. **Deterministic Installs**: Every job uses `npm ci` against committed `package-lock.json` files.
4. **No Silent Skips**: Migration, test, and build failures exit non-zero and surface failure logs in `$GITHUB_STEP_SUMMARY`.
