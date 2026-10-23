# 🗺️ Requirement Traceability Matrix (RTM)
## Comprehensive Audit of Curriculum Milestones & Architectural Gates
**Author & Lead Architect**: Shaik Mohamed Imthiyas T  
**Document ID**: `AUDIT-RTM-CAMBIUM-2026-V1`  
**Status**: 100% Compliant (`VERIFIED-PASS`)

---

## 1. Milestone 1: Frontend Architecture, Living Materials UI & UX

| Curriculum ID | Requirement Description | Implementation File(s) | Verification Command / Evidence | Status |
| :--- | :--- | :--- | :--- | :---: |
| **M1.1** | Project initialization, directory structure, and Git version control setup | `package.json`, `client/package.json`, `server/package.json`, `AGENTS.md` | `git status`, `git log -n 5` | `PASS` |
| **M1.2** | Living Materials Design System tokens, typography, CSS variables, and dark/light themes | `tokens/cambium.tokens.json`, `client/app/globals.css` | APCA contrast ratio check; CSS variables inspected in DOM | `PASS` |
| **M1.3** | High-conversion Dendrochronology landing page with interactive hero and meristem growth rings | `client/app/page.tsx`, `client/components/CambiumLogo.tsx` | `npm --prefix client run build`; static route generated | `PASS` |
| **M1.4** | Global persistent navigation, responsive sidebar, and role-aware navigation links | `client/components/GlobalSidebar.tsx`, `client/app/(protected)/layout.tsx` | 18 active navigation routes; collapsed/expanded mobile drawers | `PASS` |
| **M1.5** | Discovery & Opportunity Feed with category filters, funding range sliders, and live search | `client/app/(protected)/opportunities/page.tsx`, `client/app/(protected)/discover/page.tsx` | Reactive filter state, TanStack Query hydration with fallback | `PASS` |
| **M1.6** | Constellation Graph interactive physics visualization (Force-directed graph) | `client/app/(protected)/graph/page.tsx` | Canvas force simulation, drag-and-drop, cluster centroid physics | `PASS` |
| **M1.7** | Research Workspace, proposal editor, and file upload interface | `client/app/(protected)/workspace/page.tsx`, `client/app/(protected)/workspace/upload/page.tsx` | Multi-tab research canvas, drag-and-drop upload with status bar | `PASS` |
| **M1.8** | Institutional Compliance console, IRB protocol tracking, and FAIR data openness evaluator | `client/app/(protected)/compliance/page.tsx`, `client/app/(protected)/data-management/page.tsx` | 15-metric FAIR scoring engine, multi-tier IRB lifecycle manager | `PASS` |
| **M1.9** | Cryptographic Audit Ledger interface with SHA-256 hash receipts | `client/app/(protected)/audit/page.tsx` | Chained SHA-256 receipts display, exportable verification logs | `PASS` |
| **M1.10** | Error boundaries, accessible fallbacks, and standard HTTP error pages (403, 404, 429, 500) | `client/app/403/page.tsx`, `client/app/404/page.tsx`, `client/app/429/page.tsx`, `client/app/error-500/page.tsx` | All error pages statically prerendered with home recovery CTA | `PASS` |

---

## 2. Milestone 2: Backend Services, API, Persistence & Real-Time Gateway

| Curriculum ID | Requirement Description | Implementation File(s) | Verification Command / Evidence | Status |
| :--- | :--- | :--- | :--- | :---: |
| **M2.11** | Modular NestJS core architecture, environment validation, and dependency injection | `server/src/app.module.ts`, `server/src/main.ts` | `npm --prefix server run build` (tsc exit code 0) | `PASS` |
| **M2.12** | Relational 3NF database schema, TypeORM entities, and pgvector 768-dim embeddings | `server/src/modules/opportunities/opportunity.entity.ts`, `server/src/modules/users/user.entity.ts`, `server/schema.sql` | `server run build`, schema DDL with vector(768) HNSW index | `PASS` |
| **M2.13** | Authentication engine: Dual JWT (Access/Refresh), Argon2id/Bcrypt hashing, Role Guards | `server/src/modules/auth/auth.service.ts`, `server/src/modules/auth/auth.controller.ts`, `server/src/common/guards/roles.guard.ts` | `npm --prefix server test src/modules/auth` (4 tests passed) | `PASS` |
| **M2.14** | Research Artifact Upload Engine: Path traversal sanitization, 50MB limits, SHA-256 hashing | `server/src/modules/upload/upload.service.ts`, `server/src/modules/upload/upload.controller.ts`, `server/src/modules/upload/upload.module.ts` | `npm --prefix server test src/modules/upload` (12 tests passed) | `PASS` |
| **M2.15** | Comprehensive Bruno API Collection with environment variables and automated test assertions | `bruno/Auth/*.bru`, `bruno/App/*.bru`, `bruno/Upload/*.bru`, `bruno/Research Opportunities/*.bru` | 37 `.bru` test files spanning all controllers | `PASS` |
| **M2.16** | Opportunities CRUD, multi-criteria filtering, full-text search, and pagination | `server/src/modules/opportunities/opportunities.controller.ts`, `server/src/modules/opportunities/opportunities.service.ts` | `npm --prefix server test src/modules/opportunities` | `PASS` |
| **M2.17** | Real-Time Chat & Collaborative WebSockets Gateway with Redis Pub/Sub adapter | `server/src/modules/chat/chat.gateway.ts` | `npm --prefix server test src/modules/chat` (4 tests passed) | `PASS` |
| **M2.18** | Server-Sent Events (SSE) notification streaming controller | `server/src/modules/events/events.controller.ts`, `server/src/modules/events/events.service.ts` | `npm --prefix server test src/modules/events` (3 tests passed) | `PASS` |
| **M2.19** | Distributed Redis Redlock mutex locking for concurrent grant application submission | `server/src/common/redis/redlock.service.ts` | `npm --prefix server test src/common/redis/redlock` (5 tests passed) | `PASS` |
| **M2.20** | Transactional Outbox pattern relay service for zero-loss message delivery | `server/src/common/outbox/outbox-relay.service.ts` | `npm --prefix server test src/common/outbox` (3 tests passed) | `PASS` |
| **M2.21** | Gemini Embedding & Hybrid Search Service (pgvector HNSW + GIN FTS + Reciprocal Rank Fusion) | `server/src/modules/ai/gemini-embedding.service.ts`, `server/src/modules/ai/hybrid-search.service.ts` | `npm --prefix server test src/modules/ai` (3 tests passed) | `PASS` |

---

## 3. Cross-Cutting Production Rigor Audits

| Section | Audit Requirement | Implementation Details | Evidence / Test Suite | Status |
| :--- | :--- | :--- | :--- | :---: |
| **5.1** | Authentication & RBAC Integrity | Access tokens (15m expiry) + Rotating Refresh tokens; `@Roles('SCHOLAR', 'REVIEWER', 'ADMIN')` decorator | Unit tested in `auth.service.spec.ts` | `PASS` |
| **5.2** | Application Security & Traversal | Null byte stripping, regex path sanitizer, Helmet CSP, Throttler rate limiting (60 req/min) | Unit tested in `upload.service.spec.ts` | `PASS` |
| **5.3** | Error Handling & Structured Logging | NestJS global exception filter, custom JSON format, non-leaking database errors | Sanitized stack traces in HTTP responses | `PASS` |
| **5.4** | Automated Unit & Integration Testing | Vitest 5.0 test runner, 13 test suites, 49 tests with zero mocks for core validation | `13 passed (13), 49 passed (49)` | `PASS` |
| **5.5** | Documentation & Technical Defense | Interactive Swagger UI (`/api/docs`), OpenAPI JSON (`/api/docs-json`), Complete Bruno suite | Valid OpenAPI 3.0 specification generated | `PASS` |

---

<div align="center">
  <sub>Requirement Traceability Matrix · Document ID: AUDIT-RTM-CAMBIUM-2026-V1 · Verified for Academic Year 2026</sub>
</div>
