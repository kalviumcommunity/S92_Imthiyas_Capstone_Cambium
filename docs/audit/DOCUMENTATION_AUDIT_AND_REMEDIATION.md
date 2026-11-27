# Documentation Audit & Remediation Registry (Program 12)

**Audit Anchor:** `main` (`f44db68`)  
**Scope:** Existing root governance files, `docs/` hierarchy, `.env*.example` templates, developer onboarding guides, API/DB specifications, operational runbooks, and institutional evaluation materials.

---

## 1. Documentation Audit Inventory & Status Classifications

| Artifact / Group | Current Status | Findings & Drift Observed | Planned Remediation |
| :--- | :--- | :--- | :--- |
| [`README.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/README.md) | `PARTIALLY VERIFIED` | Lists outdated stack badges (`Next.js 15.5`, `NestJS 10.4`, `Unit Tests 204/204 Passing`) vs verified `Next.js 16.4.6`, `NestJS 12.0.1`, `89` Jest + `179+` Vitest tests. | Update stack badges, live test command pointers, and governance links in Sprint 1. |
| [`docs/README.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/README.md) | `PARTIALLY VERIFIED` | Broken relative links to `SECURITY_AND_RBAC_MATRIX.md` & `SECURITY_AUDIT.md` (live under `docs/audit/`); cites `17` entities / `1536`-dim vectors vs `31` entities / `768`-dim (`gemini-embedding-001`). | Repair links, sync architecture metrics, and link DevEx/Ops/Institutional guides in Sprint 1. |
| `docs/api-guilde.md` | `DEPRECATED` | Accidental spelling typo stub (`195` bytes) duplicating [`docs/api-guide.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/api-guide.md). | Delete typo file cleanly in Sprint 0. |
| [`docs/architecture/adr/`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/README.md) & [`docs/decisions/README.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/decisions/README.md) | `PARTIALLY VERIFIED` | Duplicate ADR index tables with `Next.js 15`, `NestJS 10`, `1536-dim HNSW` drift; lacks caching/durable queue ADR. | Unify single source under `docs/architecture/adr/`, update stack versions, add `ADR-0007` in Sprint 1. |
| `.env.example`, `server/.env.example`, `client/.env.example` | `PARTIALLY VERIFIED` | Reference unused `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`, cite `text-embedding-004` (`gemini-embedding-001` used in code), omit `RESEND_API_KEY`, `DB_POOL_MAX`, `COOKIE_SAME_SITE`, `DB_SSL`, `DB_SYNCHRONIZE`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`. | Synchronize all templates cleanly without secrets in Sprint 2. |
| [`docs/audit/KNOWN_LIMITATIONS.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/audit/KNOWN_LIMITATIONS.md) | `PARTIALLY VERIFIED` | States `100` concurrent PG pool connections (`database.config.ts` defaults `DB_POOL_MAX = 20`); duplicate word `"scanned scanned"`. | Fix factual pool limit and typo in Sprint 1. |
| [`CONTRIBUTING.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/CONTRIBUTING.md) & `.github/` PR/Issue Templates | `NOT IMPLEMENTED` | Missing root contribution guidelines, PR checklist, and issue templates on `main`. | Author root governance & `.github` templates in Sprint 2. |
| `docs/development/` Onboarding & AI Guides | `NOT IMPLEMENTED` | No unified "How to add page/component/endpoint/entity/job/AI tool" guide or multi-file agent precedence matrix. | Author in Sprint 2. |
| `docs/operations/` 10-Scenario Runbooks | `PARTIALLY VERIFIED` | `deployment-runbook.md` & `DISASTER_RECOVERY_PLAYBOOK.md` exist, but concise triage runbooks for Gemini outage, stuck OCR jobs, OAuth failure, and connection exhaustion are missing. | Author `operational-runbooks-and-troubleshooting.md` in Sprint 3. |
| `docs/institutional/` Evaluation & Pilot Package | `NOT IMPLEMENTED` | Only brief `mentor-quick-start.md` (with stale copy/claims) exists. | Author complete Researcher/Admin User Guide, Institutional Readiness Package & Viva Script in Sprint 4. |
| Automated Doc Integrity Verification | `NOT IMPLEMENTED` | No link, Mermaid syntax, `.env.example`, or npm script parity gate exists. | Implement `scripts/docs/verify-docs.mjs` + Jest suite in Sprint 5. |

---

## 2. Change-Trigger Maintenance Rules

| Change Area | Mandatory Documentation Update Trigger |
| :--- | :--- |
| NestJS Controllers / DTOs (`server/src/modules/**`) | Update [`docs/api-guide.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/api-guide.md) |
| TypeORM Entities / SQL Schema (`server/src/database/**`) | Update [`docs/database.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/database.md) |
| Env Vars (`process.env.*` / `verify-env.mjs`) | Update `.env.example`, `server/.env.example`, `client/.env.example` |
| Auth / RBAC / File / AI Guards | Update [`docs/security.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/security.md) & `docs/institutional/` |
| Render / Vercel / Docker Deployment Config | Update [`docs/operations/operational-runbooks-and-troubleshooting.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/operations/operational-runbooks-and-troubleshooting.md) |
