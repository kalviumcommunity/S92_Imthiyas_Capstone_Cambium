# Cambium Production Release Checklist

**Document ID**: `REL-CHECKLIST-2026-V1`

## Pre-Release Gates (Before Merging to `main`)
- [ ] All CI jobs pass in `.github/workflows/ci.yml` (`server-verification`, `database-migration-verification`, `client-verification`, `root-unit-tests`, `security-audit`, `e2e-verification`, `container-verification`).
- [ ] `node scripts/verify-client-bundle-secrets.mjs` passes with `0` leaks.
- [ ] `node scripts/verify-env.mjs --templates` passes.
- [ ] Any new SQL migration in `server/src/database/migrations/` is idempotent, backward-compatible, and verified on PostgreSQL 16 + pgvector.
- [ ] `CHANGELOG.md` updated under `[Unreleased]` or target `vX.Y.Z` release heading.
- [ ] Rollback / forward-fix impact reviewed in the Pull Request.

## Release Execution
- [ ] Merge approved PR into `main` (or tag `git tag -a vX.Y.Z -m "Release vX.Y.Z"` and push `git push all main --tags`).
- [ ] Confirm Vercel production deployment succeeds for `client/`.
- [ ] Confirm Render `cambium-api` deployment succeeds (`schema:apply`, `migrate:up`, `/health` 200 OK).

## Post-Deployment Verification
- [ ] Run `node scripts/smoke-test.mjs --strict --target=https://cambium-research.vercel.app` (and `--api=<render-url> --require-api` when backend is live).
- [ ] Confirm `GET /health` returns expected `version` and `gitSha` and `database: "connected"`.
- [ ] Verify authentication flow, workspace isolation, and zero unexpected console/server errors.
- [ ] Monitor error rates and latency for 15 minutes post-release.
