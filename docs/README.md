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
| **[`architecture.md`](architecture.md)** | System Architecture | C4 Container diagrams, Next.js 15 App Router frontend, NestJS 10 backend, PostgreSQL 16 + pgvector, BullMQ crawler queues. |
| **[`templates/DESIGN_SYSTEM.md`](templates/DESIGN_SYSTEM.md)** | Living Materials Design System | W3C DTCG Living Materials tokens, Parchment canvas, Canopy green, APCA contrast ratings, and component inventory. |
| **[`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md)** | Engineering Milestones | Phase 1 to Phase 6 engineering milestones, verification gates, and feature traceability. |

---

## 2. Security, Compliance & Governance

| Document | Primary Focus | Key Coverage |
| :--- | :--- | :--- |
| **[`security.md`](security.md)** | Security Policy & Model | STRIDE threat matrix, JWT HttpOnly cookie lifecycle, SAML 2.0 institutional SSO, and SHA-256 cryptographic audit ledger. |
| **[`SECURITY_AND_RBAC_MATRIX.md`](SECURITY_AND_RBAC_MATRIX.md)** | RBAC Access Control | Method-level role permission matrix across Fellow, Researcher, PI, Compliance Officer, and Admin. |
| **[`SECURITY_AUDIT.md`](SECURITY_AUDIT.md)** | Penetration Testing & Audit | OWASP ASVS Level 2 verification, SQL injection immunity, Helmet security headers, and rate limiting validation. |

---

## 3. Engineering & Developer Guides

| Document | Primary Focus | Key Coverage |
| :--- | :--- | :--- |
| **[`code-style.md`](code-style.md)** | Code Quality Standards | Strict TypeScript standards, Next.js App Router rules, React 19 conventions, NestJS dependency injection, and Anti-AI-slop rules. |
| **[`database.md`](database.md)** | PostgreSQL & pgvector Schema | Complete ERD with all 17 TypeORM entities, 1536-dim vector indexing (HNSW), transactional outbox pattern, and migrations. |
| **[`api-guide.md`](api-guide.md)** | REST API Reference | Complete endpoint catalog across Auth, Users, Opportunities, AI Autocomplete, Contributions, Community, Projects, and Ingestion. |
| **[`testing.md`](testing.md)** | Testing & Verification | Vitest test suite breakdown (24 files / 117 tests passed), Playwright E2E smoke harness, and CI/CD quality gates. |
| **[`deployment.md`](deployment.md)** | Production Deployment | Docker Compose multi-container stack, cloud deployment runbooks for Render, Vercel, and Supabase, and health checks. |
| **[`DISASTER_RECOVERY_PLAYBOOK.md`](DISASTER_RECOVERY_PLAYBOOK.md)** | Reliability & Recovery | Continuous WAL archiving, failover procedures, cold-start recovery, and data integrity verification. |

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

# Run Vitest test suite (117 unit tests)
npm --prefix server test

# Execute Playwright E2E smoke tests
npm run test:e2e
```
