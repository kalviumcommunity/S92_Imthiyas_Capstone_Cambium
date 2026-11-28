# Changelog

All notable changes to the Cambium Research Platform are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Release Engineering & CI/CD (Program 13)**:
  - Fail-fast startup environment validator (`server/src/config/env.validation.ts`) enforcing non-placeholder secrets, explicit CORS allowlists, and `DB_SYNCHRONIZE=false` in production without logging secret values.
  - Idempotent, checksum-verified SQL migration runner (`server/scripts/run-migrations.js`) tracking applied migrations in `schema_migrations`.
  - PostgreSQL 16 + `pgvector` migration verification job in `.github/workflows/ci.yml` (`database-migration-verification`) and SHA-pinned GitHub Actions.
  - Client bundle & `.env` secret-leakage guard (`scripts/verify-client-bundle-secrets.mjs`).
  - Strict `--strict` / `--require-api` live smoke test mode (`scripts/smoke-test.mjs`) and `.github/workflows/release-verify.yml`.
  - Release metadata (`gitSha`) on `GET /health` in `server/src/app.controller.ts`.
  - Complete `docs/release-engineering/` governance, rollback, migration, and production-readiness documentation suite.
- **Landing Experience**:
  - Updated `#knowledge-network` ("Make the connections visible.") backdrop and added `ScrollReveal` (`pop-scale`) scroll animation.

### Changed
- Removed silent failure suppression (`|| true`) from `render.yaml` startup command so schema/migration failures halt startup instead of serving broken schemas.

## [2.0.0] - 2026-11-27

### Added
- Program 09 — Product Analytics & Observability instrumentation, telemetry governance, and health/metrics endpoints.
- Program 10 — Performance Engineering & Scalability baselines, caching/idempotency layers, and load verification.
- Program 12 — Documentation, Developer Experience & Institutional Readiness guides.
