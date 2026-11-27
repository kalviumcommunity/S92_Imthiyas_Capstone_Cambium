# Cambium Documentation Directory (docs/README.md)
## The Enterprise Research Operating System
**Authoritative Specifications, Architecture Guides, Security Protocols & API Reference**

---

### Metadata
- **Documentation Suite ID**: `DOCS-CAMBIUM-2026-V2`
- **Product Name**: Cambium Research Platform
- **Lead Architect & Author**: Shaik Mohamed Imthiyas T
- **Status**: `ENFORCED MASTER DOCUMENTATION INDEX`
- **Current Version**: `2.0.0`
- **Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Core System Specifications & Requirements

| Document | Primary Focus | Key Coverage |
| :--- | :--- | :--- |
| **[`templates/PRD.md`](templates/PRD.md)** | Product Requirements | 32 Functional Requirements (`FR-01` to `FR-32`), 8 Non-Functional Requirements, User Personas (PI, Postdoc, Student, Compliance). |
| **[`product/overview.md`](product/overview.md)** | Product Strategy & Scope | Product pillars, requirements traceability, and user persona mappings. |
| **[`overview/system-overview-and-context.md`](overview/system-overview-and-context.md)** | System Context & Verification Matrix | Capabilities matrix (`VERIFIED` / `PARTIALLY VERIFIED` / `PLANNED`), C4 & sequence diagrams. |
| **[`architecture.md`](architecture.md)** | System Architecture | C4 Container diagrams, Next.js 16 App Router frontend, NestJS 12 backend, PostgreSQL 16 + pgvector (`768`-dim), queue architecture. |
| **[`architecture/adr/README.md`](architecture/adr/README.md)** | Architecture Decisions (ADRs) | Canonical Single Source of Truth ADR index (`ADR 0001` to `ADR 0007`). |
| **[`templates/DESIGN_SYSTEM.md`](templates/DESIGN_SYSTEM.md)** | Living Materials Design System | W3C DTCG Living Materials tokens, Parchment canvas, Canopy green, APCA contrast ratings, and component inventory. |
| **[`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md)** | Engineering Milestones | Phase 1 to Phase 6 engineering milestones, verification gates, and feature traceability. |

---

## 2. Security, Compliance & Governance

| Document | Primary Focus | Key Coverage |
| :--- | :--- | :--- |
| **[`security.md`](security.md)** | Security Policy & Model | STRIDE threat matrix, JWT HttpOnly cookie lifecycle, SAML 2.0 institutional SSO, and SHA-256 cryptographic audit ledger. |
| **[`security/threat-model.md`](security/threat-model.md)** | Threat Model & Controls | STRIDE analysis, OWASP ASVS Level 2 compliance, and zero-trust credentials. |
| **[`audit/SECURITY_AND_RBAC_MATRIX.md`](audit/SECURITY_AND_RBAC_MATRIX.md)** | RBAC Access Control | Method-level role permission matrix across all 10 `UserRole` levels. |
| **[`audit/SECURITY_AUDIT.md`](audit/SECURITY_AUDIT.md)** | Penetration Testing & Audit | Security regression checks, SQL parameterization, Helmet/CSP headers, and rate limiting validation. |

---

## 3. Engineering, Operations & Developer Guides

| Document | Primary Focus | Key Coverage |
| :--- | :--- | :--- |
| **[`code-style.md`](code-style.md)** | Code Quality Standards | Strict TypeScript standards, Next.js App Router rules, React 19 conventions, NestJS dependency injection, and Anti-AI-slop rules. |
| **[`engineering/standards.md`](engineering/standards.md)** | Repository Conventions | Conventional Commits, branch naming discipline, DTO validation, and token adherence. |
| **[`engineering/branching-strategy.md`](engineering/branching-strategy.md)** | Branching Strategy | GitHub Flow specification, semantic branch naming (`feat/`, `fix/`, `docs/`), PR lifecycle, and merge standards. |
| **[`database.md`](database.md)** | PostgreSQL & pgvector Schema | Schema & TypeORM entities (`31` registered entities on `main`), `768`-dim HNSW vector index, GIN FTS, and migrations. |
| **[`api-guide.md`](api-guide.md)** | REST API Reference | Active controller endpoints across Auth, Users, Opportunities, Bookmarks, Community, Projects, Upload, Institution, Performance, and Ingestion. |
| **[`testing/test-strategy.md`](testing/test-strategy.md)** | Unified Test Pyramid | Jest unit suites (`npm run test:jest`), NestJS Vitest suites (`npm --prefix server test`), and Playwright E2E specs. |
| **[`performance/final-performance-report.md`](performance/final-performance-report.md)** | Performance & Capacity | Reproducible baselines, PG `EXPLAIN (ANALYZE, BUFFERS)` index audit, caching/job bounds, and scaling roadmap. |
| **[`audit/PRODUCTION_READINESS_CHECKLIST.md`](audit/PRODUCTION_READINESS_CHECKLIST.md)** | Deployment Readiness Plan | Canonical prioritized milestones, no-go gates, verification evidence, environment checks, and rollout sequence. |
| **[`operations/deployment-runbook.md`](operations/deployment-runbook.md)** | Operational Deployment | Multi-environment deployment runbooks and orchestration blueprints (Render, Vercel, Docker Compose). |
| **[`DISASTER_RECOVERY_PLAYBOOK.md`](DISASTER_RECOVERY_PLAYBOOK.md)** | Reliability & Recovery | Backup/restore scripts (`backup-db.mjs` / `restore-db.mjs`), failover procedures, and data integrity verification. |

---

## 4. Content Quality & Editorial Standards

| Document | Primary Focus | Key Coverage |
| :--- | :--- | :--- |
| **[`content/content-quality-standard.md`](content/content-quality-standard.md)** | Content Quality Standard | Prohibition of generic marketing hype, decorative buzzword badges, unsupported statistics, and fabricated quotes. |
| **[`CONTRIBUTIONS_POLICY.md`](CONTRIBUTIONS_POLICY.md)** | Contribution & Attribution | CRediT contributor taxonomy mapping, pull request guidelines, and authorship verification protocols. |

---

## 5. Verification Commands Quick Reference

```bash
# Frontend build & type check
npm --prefix client run build

# Backend compilation & type check
npm --prefix server run build

# Backend Vitest unit test suites
npm test

# Root Jest contract test suites
npm run test:jest

# Execute Playwright E2E smoke tests
npm run test:e2e
```
