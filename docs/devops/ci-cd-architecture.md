# CI/CD Architecture (Phase 3)

Authoritative pipeline defined in [`.github/workflows/ci.yml`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/.github/workflows/ci.yml) using `permissions: contents: read` and `npm ci` lockfile determinism.

| Job | Trigger & Scope | Enforced Gates | Failure Behaviour |
| :--- | :--- | :--- | :--- |
| `server-verification` | Push / PR | `npm ci`, `tsc` build, full `vitest` suite, `adversarial-security.spec.ts` | Blocks merge immediately |
| `client-verification` | Push / PR | `npm ci`, `eslint`, `tsc --noEmit`, `next build` (`NEXT_PUBLIC_API_URL` build isolated) | Publishes error log to GitHub Step Summary |
| `root-unit-tests` | Push / PR | Root `npm ci`, `npm run test:jest` | Blocks merge immediately |
| `security-audit` | Push / PR | `gitleaks/gitleaks-action@v2` (`fetch-depth: 0`), `npm audit --omit=dev` (client/server/root) | Blocks PR if leaks or High/Critical vulns exist |
| `e2e-verification` | After client build | Headless Chromium Playwright E2E + Axe WCAG AA smoke harness | Uploads Playwright report artifact on failure |
| `database-migration-check` | Push / PR | Ephemeral `pgvector/pgvector:pg16` container running `db:migrate:verify` + two consecutive `db:migrate` idempotency passes | Catches broken SQL DDL and non-idempotent migrations prior to merge |
| `container-verification` | All 6 gates green | Docker multi-stage build validation (`server/Dockerfile`, `client/Dockerfile`) | Prevents broken container releases |

- Feature branches cancel redundant in-progress runs automatically; `main` builds never auto-cancel (`cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}`).
- Deployment to Vercel and Render remains natively triggered upon approved merge into `main`, avoiding duplicate competing deployment runners.
