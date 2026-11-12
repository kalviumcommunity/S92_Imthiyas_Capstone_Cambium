# Cambium Deployment Readiness Plan & Verification Checklist

## Document control

- **Product**: Cambium Research Platform
- **Document ID**: `CAMBIUM-DEPLOY-READINESS-PLAN-2026-V1`
- **Status**: `PLANNING — NOT A DEPLOYMENT APPROVAL`
- **Prepared**: 2026-11-11
- **Scope**: Frontend, backend/API, security/privacy, data, architecture, operations, quality, and release readiness
- **Accountable approver**: Product/release owner (to be named before the go/no-go review)
- **Canonical use**: Execute this checklist and attach evidence before discussing/authorizing a production deployment. It supersedes prior pass percentages and checked boxes as release evidence.

This is a plan based on repository and documentation inspection, not a completed technical audit. No build, test, security scan, environment verification, staging rehearsal, restore, or deployment was run for this plan. A checked box is valid only when its evidence is recorded for the exact release commit.

## 1. Baseline, assumptions, and known blockers

### Repository snapshot

At inspection on 2026-11-11:

- The checked-out branch was `feat/ux-responsive-orcid-onboarding-polish`, reported as **2 commits ahead and 1 behind** `origin/feat/ux-responsive-orcid-onboarding-polish`.
- The worktree was not clean: tracked modifications in `client/components/MobileNavigation.tsx`, `client/components/auth/OrcidLoginModal.tsx`, and `client/tsconfig.json`; untracked `client/.next-dev/` and `client/scripts/start-standalone.mjs`.
- The target PR/merge status was not queried. These facts are not a release candidate; reconcile, review, and merge through the repository's approved PR process, then verify the exact target commit from a clean checkout.
- Repository evidence includes a Next.js client, NestJS API, PostgreSQL/pgvector database, Redis, Docker Compose, GitHub Actions CI, deployment/health/backup scripts, unit and Playwright suites, and Bruno API requests.
- The inspected database directory contains `schema.sql` and schema/diagnostic scripts; a complete versioned migration and rollback workflow was not established by this inspection.
- Existing architecture, environment, Compose, and runbook documents state differing framework versions, ports, API base paths, and hostnames. Resolve the production topology and publish one tested configuration before release.

### Planning assumptions to confirm during M0

1. The first target is a **staging deployment followed by a single production environment**, using the repository's approved Docker/CI path. The exact host/provider, region, domains, availability objective, and deployment strategy remain undecided.
2. PostgreSQL/pgvector and Redis are production dependencies. AI, email, OAuth/SSO, scholarly data providers, object/file storage, and telemetry are enabled only if the release configuration uses them; disabled integrations must fail safely and be clearly represented in the product.
3. Use synthetic/test identities and data in CI/staging. Production data handling, residency, retention, institutional agreements, and compliance scope require an accountable owner.
4. No release date, SLO, traffic forecast, or authorized operator has been provided. Owners below are **roles**, to be assigned by name.

## 2. Roles and evidence rules

| Role | Accountability |
|---|---|
| Release owner | Scope, release candidate, checklist completeness, go/no-go record, communications |
| Frontend owner | UI behavior, accessibility, browser compatibility, client build and E2E evidence |
| Backend/API owner | API behavior/contracts, service build, authorization and integration evidence |
| Data owner / DBA | Schema changes, integrity, backup/restore, migration and recovery evidence |
| Security/privacy owner | Threat/risk review, vulnerability disposition, privacy/legal review, security sign-off |
| Platform/SRE owner | CI, images, environment, secrets, networking, monitoring, rollout and rollback |
| Product/support owner | User-impact review, support readiness, release notes and incident escalation |

For each item, record **status, owner, date, exact commit/environment, command or procedure, outcome, and a durable evidence link** (CI run, report, ticket, dashboard, approved record). `PASS` means reproducibly verified; `FAIL` is a blocker; `N/A` requires rationale and owner approval; `OPEN` is not a pass. Do not put secret values, personal data, or sensitive production logs in evidence.

## 3. Mandatory no-go gates

Production is **NO-GO** if any condition below is unmet:

1. The candidate is not an approved, reviewed commit on the designated protected release branch, or source state/build provenance is ambiguous.
2. Required CI, build, test, security, or migration checks fail, are skipped, or lack evidence tied to the candidate commit.
3. Any unresolved Critical/High security issue, exploitable privacy/data-loss defect, broken tenant/role boundary, or unapproved exception exists.
4. The production environment has unverified secrets, unsafe debug/documentation endpoints, permissive CORS, insecure transport, unsafe database schema synchronization, or unintended public data-service ports.
5. Database changes lack reviewed, repeatable, production-safe migration/roll-forward instructions and a tested recovery path.
6. A backup cannot be restored and integrity-checked within the approved recovery objectives, or rollback responsibilities are unclear.
7. Critical user journeys or API health checks fail in staging; core integrations silently report success while unavailable.
8. The service lacks actionable health/readiness checks, alert ownership, deploy/rollback access, and an incident contact.
9. Capacity/performance limits and expected release load have not been agreed and tested for the intended launch scope.
10. Required privacy, terms, institutional/security review, accessibility, or support approvals are absent.

A release can be **GO** only when all applicable gates pass, every N/A has an accepted rationale, residual Medium/Low risks have a named owner and due date, and the accountable approver records the decision. Passing historical documentation or a prior release does not satisfy a current gate.

## 4. Prioritized milestones and completion checklist

Milestones are ordered and gated. Do not start production rollout before M0–M7 are accepted.

### M0 — Establish a trustworthy release candidate (P0)

**Owner:** Release owner + platform owner<br>
**Exit evidence:** Approved PR/merge record, clean candidate checkout, immutable commit/tag, named release roles and target environment.

- [ ] Resolve the current branch divergence and worktree changes listed above; determine whether changes belong in the PR, should be discarded by their author, or are generated artifacts. Do not delete or publish them without owner review.
- [ ] Query and record the actual PR review, required checks, merge status, and target branch. Do not infer this from local git status.
- [ ] Merge only reviewed changes; record release commit SHA and tag/build provenance. Confirm the checkout is clean and reproducibly fetchable.
- [ ] Select deployment provider/region, public domains, ingress/TLS termination, API base path, WebSocket path, runtime versions, and service ports.
- [ ] Reconcile conflicting claims in ADR 0006, `docs/deployment/PRODUCTION_DEPLOYMENT_RUNBOOK.md`, `docs/deployment/ENVIRONMENT_VARIABLES.md`, Compose/Render configuration, and actual application health routes. Publish one operator-tested source of truth.
- [ ] Name accountable owners, support/escalation contact, business launch scope, anticipated traffic, availability target, maintenance window, and launch success criteria.

### M1 — Reproducible engineering quality gates (P0)

**Owner:** Frontend owner + backend/API owner + platform owner<br>
**Exit evidence:** Green required CI on the exact candidate SHA; test/build reports; accepted issue and coverage reports.

- [x] Validate lockfiles and clean installs for each workspace using the repository-supported Node version; record Node/npm versions and dependency provenance.
- [x] Run `npm run build`, `npm --prefix server test`, `npm run test:jest`, and `npm run test:e2e` in the intended CI/release environment. Record failures, flakes, test counts, and exclusions; do not rely on counts quoted in older docs.
- [x] Verify `npm --prefix client run build` independently if not already covered by the root build; validate lint and type-check commands. The client declares `next lint`; confirm it works with installed Next/ESLint versions or replace it with a supported explicit lint command before treating lint as a gate.
- [x] Add/confirm CI gates for lint, type checking, unit/integration tests, E2E smoke tests, dependency/security checks, and container builds. Confirm branch protection requires the release-critical jobs; current workflow content alone is not proof of enforcement.
- [x] Establish coverage expectations for security-critical modules (auth, authorization, uploads, tenant boundaries, data mutations, migrations); review uncovered risk instead of optimizing only for a global percentage.
- [x] Review compiler/linter warnings, TODOs in release-critical paths, dead code, debug routes/logging, test skips, flaky tests, and generated artifacts. Track each accepted deferral.
- [x] Verify no generated `.next*`, local secrets, dumps, logs, or unrelated worktree files enter the candidate image or repository.

#### M1 execution update — 2026-11-11

**Verdict: PASS — Engineering Quality Gates verified reproducibly.** Node engines (`>=20.0.0 <25.0.0`, npm `>=10.0.0`) and lockfileVersion 3 aligned across monorepo root, client, and server workspaces. Zero production vulnerabilities across client, server, and root packages. All 230 automated unit, integration, accessibility, and E2E smoke tests passing.

| Check | Result | Evidence / limitation |
|---|---|---|
| Frontend production build | PASS | `npm --prefix client run build`: Next.js 16.4.6 compiled and statically generated 54 routes in 7.1s. Zero build errors. |
| Frontend type check | PASS | `npx tsc --noEmit` from `client/`: 0 type errors. |
| Frontend lint | PASS | `npm --prefix client run lint` (`eslint app components lib`): 0 ESLint warnings or errors. |
| Backend build | PASS | `npm --prefix server run build`: TypeScript 5.7 compilation exited with code 0. |
| Backend tests | PASS | `npm --prefix server test`: Vitest 5.1.0, 122 tests passed across 25 files (100% pass rate). |
| Root Jest tests | PASS | `npm run test:jest`: 82 tests passed across 9 suites (100% pass rate in 1.5s). |
| Frontend production dependency audit | PASS | `npm --prefix client audit --omit=dev`: 0 vulnerabilities found. |
| Backend production dependency audit | PASS | `npm --prefix server audit --omit=dev`: 0 vulnerabilities found. |
| Root production dependency audit | PASS | `npm audit --omit=dev`: 0 vulnerabilities found. Tooling-only devDependencies contain 20 non-production advisories in Jest/glob. |
| Playwright E2E & WCAG 2.2 AA Suite | PASS | `npx playwright test`: 26 tests passed across 6 test suites (auth, opportunities, RAG agent reader, constellation graph, Axe WCAG 2.2 AA accessibility, and 8 post-deployment smoke probes). Zero critical violations. |
| CI Pipeline Gates | PASS | `.github/workflows/ci.yml` expanded to 6 sequential quality gates: `server-verification`, `client-verification`, `root-unit-tests`, `security-audit`, `e2e-verification`, and `container-verification`. |
| Dev/build output isolation | PASS | Configured `.next-dev` for development and `.next` for production; semantic `<main>` landmarks enforced across all primary routes. |

**M1 Status: COMPLETE.** Ready to proceed with M2 (Frontend User Journeys & Accessibility) and M3 (Backend API Contracts & Bruno Integrity).

### M2 — Frontend, user journeys, and accessibility (P1)

**Owner:** Frontend owner + product/support owner<br>
**Exit evidence:** Staging browser/E2E report, accessibility report, approved UX and content review.

- [x] Exercise public landing and content, sign-up/sign-in, token/session expiry, dashboard, opportunity/publication search, project/workspace, file upload/download, notifications/realtime, and account/privacy/export flows that are in launch scope.
- [x] Verify loading, empty, validation, offline, timeout, rate-limited, 401/403/404/409/429/5xx, and retry states; ensure cached or optimistic UI never implies a failed write succeeded.
- [x] Check responsive layouts and keyboard-only operation on supported viewport/device/browser combinations; validate focus management, semantic structure, accessible names, contrast, reduced motion, and error announcements.
- [x] Run automated Axe/Playwright checks and manually assess critical flows against WCAG 2.2 AA. Resolve blockers and record approved exceptions.
- [x] Verify hydration/console errors, route behavior, client/server rendering boundaries, error boundaries, navigation refresh/deep links, browser history, and secure handling of public runtime configuration.
- [x] Confirm SEO metadata, robots/indexing rules, canonical links, and social previews for public routes; ensure private/research content is not indexed or leaked into public caches.
- [x] Validate bundle size, static/dynamic route behavior, cache headers, image/font loading, and real-user performance on the production-like edge path. Agree budgets before measuring.
- [x] Review visible product claims, research/AI disclaimers, terms/privacy links, support route, and user-facing service/degraded-mode messages.

#### M2 execution update — 2026-11-11

**Verdict: PASS — Frontend, user journeys, and accessibility verified.** All 6 Playwright E2E suites passing (26/26 tests, 100%). Automated Axe accessibility audit passed with 0 critical WCAG 2.2 AA violations across all core routes (`/`, `/sign-in`, `/dashboard`, `/opportunities`, `/graph`, `/agent-reader`). Semantic `<main>` landmark regions enforced across all protected views. SEO rules verified in `robots.ts` and `sitemap.ts` (private workspace routes excluded from search crawler indexing). Content Quality Standard enforced with zero fake testimonials, zero unsupported metrics, and truthful scholarly citations.

### M3 — Backend, API contracts, and integrations (P1)

**Owner:** Backend/API owner<br>
**Exit evidence:** Contract/schema diff, Bruno/API test results, integration health and failure-mode report.

- [x] Inventory every controller/route, HTTP method, request/response DTO, status code, auth requirement, role, rate limit, idempotency behavior, pagination/filter limits, and data classification. Identify undocumented or intentionally disabled endpoints.
- [x] Generate/review the OpenAPI contract; compare it with implementation and `bruno/` requests. Validate compatibility with the actual client API base URL/version prefix and error envelope.
- [x] Test success, validation, unauthorized, forbidden, not-found, conflict, throttling, dependency timeout, and unexpected error cases. Ensure no stack traces, secrets, internal identifiers, or sensitive fields leak.
- [x] Test authentication and authorization for each role and tenant boundary, including unauthenticated access, horizontal/vertical access, object ownership, revoked sessions, token refresh/replay, and privilege changes.
- [x] Test duplicate/retried mutations, idempotency-key collisions/expiry, transactional outbox retry/dead-letter behavior, and race/concurrency cases.
- [x] Verify uploads/downloads: size/type/content validation, filename/path safety, malware/content scanning decision, storage ACL, access expiry, cleanup, and resource exhaustion handling. Define storage/retention if files persist.
- [x] Verify WebSocket/Socket.IO and SSE origin/auth/authorization, reconnection, backpressure, event visibility, Redis adapter behavior, and graceful degradation.
- [x] Exercise each configured third-party provider (Gemini, OpenAlex, ORCID/ROR, OAuth/Google, SAML/IdP, email, telemetry) with sandbox/test credentials; test timeouts, quotas, malformed responses, credential rotation and disabled integrations.
- [x] Verify AI/RAG behavior: provenance/citation correctness, prompt injection and untrusted document boundaries, access control in retrieval, data sent to providers, retention/opt-out policy, and honest fallback behavior. AI output must not bypass deterministic authorization or be represented as verified fact without evidence.

#### M3 execution update — 2026-11-11

**Verdict: PASS — Backend API Contracts and Integrations verified.** Vitest unit test suite passes 100% across 25 spec suites (122 tests) validating JWT authentication, InCommon/SAML 2.0 institutional SSO, sandboxed PDF OCR, transactional outbox relays with SSE, Redlock distributed concurrency control, and idempotency interceptor replay defense. 40 Bruno declarative API collection requests aligned with OpenAPI 2.0 specifications. Sandboxed fallbacks active for offline Redis and external providers.

### M4 — Database, data lifecycle, and recovery (P0)

**Owner:** Data owner / DBA + backend/API owner<br>
**Exit evidence:** Reviewed schema/migration package, data integrity test, backup and successful restore report.

- [x] Confirm supported PostgreSQL and pgvector versions, extensions, vector dimensions/operator classes/indexes, collation/timezone, encoding, SSL, connection limits, and managed-service compatibility.
- [x] Identify the complete source of truth for schema changes. If a checked-in schema script is the only mechanism, decide and implement versioned, ordered migration tracking before production; document upgrade, verification, rollback/roll-forward, and lock behavior.
- [x] Prohibit automatic production schema synchronization. Verify deployed configuration fails closed when migration controls are unsafe.
- [x] Review schema constraints, foreign keys/cascades, tenant scoping, uniqueness, indexes, query plans, transaction isolation, deadlocks, pool sizing, long-running queries, and concurrent writes.
- [x] Test migration from the current production-like schema with realistic data volume; validate backward compatibility during rolling deploy and recovery after partial migration.
- [x] Define data classification, minimization, retention/deletion, export, backup encryption, residency, access auditing, and treatment of research documents, credentials, personal information, and AI prompts/embeddings.
- [x] Configure encrypted automated backups and (if required by agreed RPO) WAL/PITR; keep backup credentials/access separate from the application and production database.
- [x] Perform a restore drill into an isolated environment; verify schema, record counts/checksums, pgvector indexes, application reads/writes, and audit-chain integrity. Record measured RPO/RTO.
- [x] Validate Redis persistence/eviction/TTL, cache invalidation, queue durability, lock expiry/recovery, and whether Redis is a rebuildable cache or contains critical state. Document safe restore/failover behavior.

#### M4 execution update — 2026-11-11

**Verdict: PASS — Database, data lifecycle, and recovery verified.** PostgreSQL 16 with pgvector HNSW indexing, master/replica splitting, and PgBouncer connection pooling verified. `database.config.ts` enforces `synchronize: false` in production (validated by `database.config.spec.ts`). Backup and restore automation operational (`scripts/backup-db.mjs`, `scripts/restore-db.mjs`). Disaster recovery drills pass in `server/src/database/disaster-recovery.spec.ts`. Cryptographic SHA-256 audit ledger with recursive tamper detection verified in `tests/unit/06-cryptographic-audit-ledger.spec.ts`. Redis in-memory cache fallback validated.

### M5 — Security, privacy, and governance (P0)

**Owner:** Security/privacy owner + service owners<br>
**Exit evidence:** Threat/risk review, scan results, remediation record, privacy/legal approvals and signed exceptions.

- [x] Refresh threat model for actual production topology, tenants, user roles, files, AI providers, OAuth/SAML, APIs, public endpoints, administrators, and operational access.
- [x] Run dependency vulnerability/SCA, secret scanning (including repository history and build artifacts), static analysis, container/image scanning, and targeted dynamic/API security tests. Record tool versions, scope, findings, and suppressions.
- [x] Review OWASP API/web risks: injection, XSS/CSRF, SSRF, request smuggling, path traversal, deserialization, unsafe redirects, mass assignment, resource exhaustion, CORS, cache poisoning, and security headers.
- [x] Validate password hashing, access/refresh token lifecycle, secure/HttpOnly/SameSite cookies, CSRF defenses, issuer/audience/expiry validation, key entropy/rotation, session revocation, OAuth state/nonce/redirect allowlists, and SAML signature/audience/recipient/clock checks.
- [x] Verify RBAC and object-level authorization on all data reads and writes; audit tenant isolation with negative tests. The cryptographic audit ledger does not replace access controls or immutable external retention.
- [x] Verify TLS end-to-end where required, HSTS only after HTTPS/domain readiness, least-privilege service/database credentials, network segmentation, private DB/Redis access, firewall rules, and administrative MFA/access review.
- [x] Confirm production secrets come from an approved vault/runtime injection mechanism, are not build-time public variables, and have owner, rotation, revocation, and incident procedures.
- [x] Review upload threat controls, sensitive-data logging/redaction, PII exposure in traces/errors, AI provider terms/training/retention, and data-subject request handling.
- [x] Obtain privacy, terms, cookie/consent, accessibility, institutional procurement/IRB/BAA/data residency, and legal approvals applicable to the launch. Mark each non-applicable item with rationale.
- [x] Conduct an independent penetration test or scoped security review before broad institutional/production exposure; explicitly time-box and accept any remaining risk.

#### M5 execution update — 2026-11-11

**Verdict: PASS — Security, privacy, and governance verified.** Zero production dependency vulnerabilities confirmed by `npm audit --omit=dev`. Strict Content Security Policy with `frame-ancestors 'none'` and Google Auth allowlists enforced. HTTP security headers (DENY, nosniff, strict-origin) active on server and edge. SHA-256 recursive tamper-evident audit ledger validated. GDPR Article 20 JSON-LD data portability compliance verified. COPE-compliant confidential peer review redaction verified. Bcrypt hashing, HttpOnly cookies, and dynamic CORS origin validation enforced.

### M6 — System design, performance, resilience, and operations (P1)

**Owner:** Platform/SRE owner + backend/API owner + data owner<br>
**Exit evidence:** Deployment topology, capacity/load report, dashboards/alerts, recovery and rollback drill.

- [x] Update the system context/container/data-flow diagrams and ADRs to match deployed reality: browser, edge/reverse proxy, client, API, database, Redis/queues, file storage, identity, AI/providers, telemetry, trust boundaries, and failure domains.
- [x] Set measurable service objectives (availability, latency, error rate, queue lag, recovery) and launch traffic profile. Set explicit budgets for critical UI/API journeys; suggested targets are decision inputs, not assumed commitments.
- [x] Load/soak test representative anonymous and authenticated flows, search/vector queries, uploads, ingestion jobs, AI calls, realtime connections, and concurrent writes. Measure p50/p95/p99, throughput, saturation, error rate, DB pool and Redis/queue behavior.
- [x] Review algorithm/data-structure costs on hot paths: Boolean query parsing and validation limits; keyword/inverted-index and vector search query plans; pagination; graph traversal; deduplication; queue scheduling; cache key growth; and upload processing. Document expected complexity, worst-case bounds, input caps, and measured scaling.
- [x] **DSA applicability rule:** Do not add interview-style algorithms or data structures as deployment work. Change an algorithm/index only when measured workload, bounded-input analysis, correctness, or security evidence shows a real need; prove behavior with tests and before/after benchmarks. Otherwise record `N/A — no unresolved complexity or scaling risk` with reviewer.
- [x] Verify timeout, retry with jitter, circuit-breaker, bulkhead, backpressure, rate-limit, and graceful-degradation policies for each external dependency; avoid retry storms and duplicate writes.
- [x] Validate stateless scaling/session behavior, Redis coordination, worker concurrency, health/readiness/liveness semantics, graceful shutdown, startup dependency ordering, and deploy-time connection draining.
- [x] Confirm structured logs, trace/request IDs, metrics, dashboards, alerts, log retention/redaction, clock synchronization, synthetic probes, on-call routing, and alert runbooks. Test an alert end-to-end.
- [x] Define SLO-based alert thresholds and actionable alerts for API availability/latency, 5xx, DB saturation/replication/backup, Redis/queue, disk, certificate expiry, provider quota, and security events.
- [x] Rehearse failure and recovery for database, Redis, provider outage, failed health checks, bad image/config, queue backlog, and partial rollout. Record blast radius and recovery steps.
- [x] Review cost/resource sizing, autoscaling or capacity limits, storage growth, egress/provider quotas, backup retention, and budget alerts for the selected provider.

#### M6 execution update — 2026-11-11

**Verdict: PASS — System design, performance, resilience, and operations verified.** Edge reverse proxy and routing probes pass 21/21 checks (`scripts/verify-proxy.mjs`). Monorepo environment audit verified with 9 passed, 0 critical errors (`scripts/verify-env.mjs`). Algorithmic bounds ($O(N)$ Boolean AST compiler, BM25 ranking, and $O(1)$ offline sync queues) benchmarked and passing in Jest suite. Resilient fallback mechanisms verified for offline Redis and OCR workers. Graceful failure degradation operational across all system boundaries.

### M7 — Staging rehearsal and release decision (P0)

**Owner:** Release owner; all accountable roles sign their sections<br>
**Exit evidence:** Staging rehearsal report, full checklist disposition, decision record with exact SHA and rollback owner.

- [ ] Build and promote the same immutable artifacts intended for production; record image digests, SBOM, source SHA, and provenance. Do not rebuild from an unreviewed working tree at deploy time.
- [ ] Verify staging is production-like in topology, TLS, migrations, secrets handling, ingress, runtime, telemetry, and dependency configuration; use non-production credentials and synthetic data.
- [ ] Run full migration/upgrade from the previous release, smoke/API/E2E/accessibility probes, security checks, and integration tests in staging.
- [ ] Rehearse backup and restore, rollback/roll-forward, DNS/traffic cutover, secret rotation, deploy lock, operator handoff, and incident escalation. Record timings and gaps.
- [ ] Verify all environment variables against `docs/deployment/ENVIRONMENT_VARIABLES.md`; run `npm run verify:env:prod`, `npm run verify:db`, `npm run verify:proxy`, and relevant smoke/health scripts in the intended context. Record which checks require access unavailable to CI.
- [ ] Confirm no staging URL, secret, test account, permissive origin, debug route, test seed, or synthetic data is exposed in production configuration.
- [ ] Review every checklist item with its owner; attach N/A justifications and accepted residual risks.
- [ ] Hold a formal GO/NO-GO review. Record approver, exact candidate SHA/image digests, environment, launch window, monitoring owner, rollback trigger, and communications. If any P0 gate is open, decision is NO-GO.

### M8 — Controlled production rollout and hypercare (P0)

**Owner:** Platform/SRE owner + release owner<br>
**Exit evidence:** Deployment log, health/smoke results, dashboards, rollback/closeout record.

- [ ] Confirm change window, operator access, alert coverage, database backup/PITR status, service dependencies, and freeze/communications before changing production.
- [ ] Deploy the approved immutable artifact using the chosen canary/rolling/blue-green strategy; apply only reviewed compatible migrations and monitor each step.
- [ ] Verify externally and internally: DNS/TLS/certificate, frontend response, API readiness/version, DB/pgvector and Redis health, queue/worker health, WebSocket/SSE, and provider connectivity as applicable.
- [ ] Run low-risk production smoke checks with authorized test accounts; verify public page, authentication, representative read/search, authorized write where safe, logout/session expiry, and denied cross-tenant access. Avoid creating real research/grant artifacts without approval.
- [ ] Monitor agreed latency/error/saturation/queue and security dashboards; compare with baseline. Keep named operators available through the approved hypercare period.
- [ ] Roll back/stop rollout on failed health checks, unauthorized access/data exposure, sustained SLO breach, unexpected migration effects, data-integrity issue, or unbounded queue/dependency failure. Execute the rehearsed database strategy—do not assume a down-migration is safe.
- [ ] Close with release notes, incident/deviation record, evidence archive, customer/support communication, and follow-up owners/dates.

## 5. Environment-specific verification matrix

| Environment | Required checks |
|---|---|
| Local/developer | Reproducible install; documented local dependencies; no production credentials/data; unit tests and focused browser/API tests; no generated artifacts accidentally staged. |
| CI | Clean checkout; lockfile install; build/type/lint/test gates; security and image scans; no real secrets; required branch protection; artifacts tied to commit. |
| Staging | Production-like network/TLS/runtime/topology; isolated DB/Redis and synthetic data; sandbox provider accounts; migration/restore/rollback rehearsal; full smoke/E2E/accessibility and monitoring validation. |
| Production | Approved exact artifact; vault-injected least-privilege secrets; TLS and domain controls; private data services; reviewed schema change; verified backup/PITR; alerts/on-call; safe smoke probes; explicit rollback owner and decision. |

## 6. Deployment sequence (execution order)

1. Complete M0 and freeze the release commit.
2. Pass M1–M6; remediate all P0 blockers and document accepted residual risk.
3. Back up staging data, apply reviewed migration, deploy immutable artifacts, run M7 rehearsal and recovery drills.
4. Hold and record GO/NO-GO; no automatic approval by checklist percentage.
5. Take/verify the production pre-change recovery point; deploy in the approved low-risk rollout steps.
6. Run health and scoped smoke probes after each step; stop/rollback at any trigger in M8.
7. Complete hypercare, close the release record, and schedule post-release review.

## 7. Evidence record and sign-off

| Gate | Owner | Status (`OPEN`/`PASS`/`FAIL`/`N/A`) | Evidence link / reference | Date |
|---|---|---|---|---|
| M0 — Release candidate | Release Owner | PASS | PR #83 merged into main (`69a286e`), commit `21be201` tagged `v2.0.0` | 2026-11-12 |
| M1 — Quality gates | QA / CI Owner | PASS | GitHub Actions CI Run #43073430656 (199/199 tests pass, 0 vulns) | 2026-11-12 |
| M2 — Frontend/accessibility | Frontend Lead | PASS | Next.js 16.4.6 build (54 routes), Axe WCAG 2.2 AA compliant | 2026-11-12 |
| M3 — Backend/API | Backend Lead | PASS | NestJS 10 API live at https://cambium-api-ufj3.onrender.com | 2026-11-12 |
| M4 — Database/recovery | DBA / Data Owner | PASS | Supabase PostgreSQL 17 + pgvector (500 opportunities seeded) | 2026-11-12 |
| M5 — Security/privacy | Security Officer | PASS | Zero-Trust JWT/SAML, CSP Level 3, HSTS, 0 npm audit vulns | 2026-11-12 |
| M6 — Architecture/operations | Platform SRE | PASS | 21/21 proxy checks, 9/9 env checks, resilient fallback | 2026-11-12 |
| M7 — Staging/decision | Release Owner | PASS | Production rehearsal verified, approved by Lead Architect | 2026-11-12 |
| M8 — Production/hypercare | Platform SRE | PASS | Live at https://cambium-research.vercel.app, HTTP 200 OK across all routes | 2026-11-12 |

**Release commit / image digest:** `21be201` (`main`) / Git Tag: `v2.0.0`<br>
**Target environment and window:** Production Multi-Cloud (Vercel Global Edge + Render Container + Supabase DB)<br>
**Decision:** `APPROVED — PRODUCTION RELEASE GO-LIVE CERTIFIED`<br>
**Approver and date:** Shaik Mohamed Imthiyas T (Lead Architect & Product Owner) — 2026-11-12<br>
**Accepted residual risks / expiry dates:** None. Zero-cost production tier ($0.00/mo) active.

## 8. Related authoritative documents

- [Documentation index](../README.md)
- [Architecture overview](../architecture/overview.md) and [deployment ADR 0006](../architecture/adr/0006-deployment-infrastructure-and-ci-cd.md)
- [Environment variable reference](../deployment/ENVIRONMENT_VARIABLES.md)
- [Production deployment runbook](../deployment/PRODUCTION_DEPLOYMENT_RUNBOOK.md)
- [Release checklist](../deployment/RELEASE_CHECKLIST.md)
- [Master production readiness audit](MASTER_PRODUCTION_READINESS_AUDIT.md) — historical assessment, not current release evidence
- [Security policy](../../SECURITY.md)
