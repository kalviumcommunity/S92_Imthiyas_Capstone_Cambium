# Cambium Research — Release Acceptance Criteria

Before onboarding early researchers or cutting a production release tag, Cambium must satisfy every gate below with **zero silent skips**:

1. **Frontend Unit & Contract Verification**: `npm run test:jest` passes 100% (schemas, middleware redirect/JWT guards, HTTP retry/refresh, cryptographic audit chain, WCAG token math).
2. **Backend TypeScript & Unit/Integration Suite**: `cd server && npm run build && npm test` passes 100% with zero `tsc` errors (HTTP wire contracts, DB transaction rollbacks, Redlock exclusion, multi-actor workspace isolation, upload abuse defenses, circuit breaker recovery).
3. **Client Build & Lint Integrity**: `npm --prefix client run lint` exits `0` (zero errors) and `npm --prefix client run build` compiles cleanly.
4. **End-to-End Chromium & Accessibility Gate**: `npx playwright test` passes 100% across public/guest protection checks, authenticated scholar journeys, `@axe-core/playwright` WCAG 2.2 AA scans, and mobile/desktop viewport overflow checks.
5. **Known External / Environment Boundaries**: Features requiring live third-party OAuth/Google/ORCID/Gemini credentials or live Postgres/Redis sockets are tested deterministically via mocked transport layers in CI and must also pass live credentialed staging verification manually prior to public launch.
