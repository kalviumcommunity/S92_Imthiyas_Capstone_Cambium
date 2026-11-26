# Release Management Protocol (Phase 11)

## Mandatory 10-Point Production Release Gate
Before merging any PR into `main` (which triggers Vercel and Render deployments):
1. Record target commit SHA and SemVer changelog delta.
2. Confirm GitHub Actions CI passes all 7 gates (`server-verification`, `client-verification`, `root-unit-tests`, `security-audit`, `e2e-verification`, `database-migration-check`, `container-verification`).
3. Verify offline migration sequence (`npm run db:migrate:verify`) and review backward compatibility (`expand-and-contract`).
4. Confirm environment variable parity on Vercel & Render dashboards prior to boot.
5. Take a pre-release PostgreSQL backup snapshot if schema changes are present.
6. Merge approved PR cleanly (`main` never auto-cancels in CI).
7. Monitor Render build + startup logs (`npm run db:migrate && npm run start:prod`) and liveness `/api/v1/health/liveness`.
8. Execute live non-destructive smoke probes (`node scripts/smoke-test.mjs --target=https://cambium-research.vercel.app --api=https://cambium-api-ufj3.onrender.com --timeout=30000 --strict`).
9. Record any known non-blocking caveats (e.g. `redis: degraded` on Redis-less free plan).
10. Keep previous known-good Vercel deployment URL & Render commit SHA ready for immediate rollback if smoke probes fail.
