# Implementation Plan & Delivery Roadmap (IMPLEMENTATION_PLAN.md)
## Cambium — AI-Powered Research Opportunity Discovery & Intelligence Platform
**The Enterprise Research Operating System**

---

### Metadata
- **Document ID**: `PLAN-CAMBIUM-2026-V2`
- **Product Name**: Cambium Research Platform
- **Lead Architect & Delivery Lead**: Shaik Mohamed Imthiyas T
- **Status**: `ACTIVE / RELEASE EXECUTION`
- **Current Version**: `2.0.0`
- **Standard Baseline**: Google Engineering Practices & Traceable Release Gates
- **Traceability**: Implements all functional (`FR-*`) and non-functional (`NFR-*`) requirements from [`docs/templates/PRD.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/templates/PRD.md)
- **Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Executive Delivery Strategy & Milestone Matrix

Cambium’s delivery roadmap follows an **incremental, risk-weighted sequence**. Low-level infrastructure and security foundations precede client modules, followed by vector ingestion pipelines, compliance registries, and final CI release verification.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          DELIVERY SEQUENCE                             │
├────────────────────────────────────────────────────────────────────────┤
│ M0: Design Tokens & Specification Contracts                            │
│  └─► M1: Core Architecture & Zero-Trust Authentication (`/auth`)       │
│       └─► M2: Living Materials Design System & UI Inventory            │
│            └─► M3: Knowledge Topology & Vector Search (`pgvector`)     │
│                 └─► M4: Agentic Reader & Deep Synthesis Engine         │
│                      └─► M5: Institutional Governance & Compliance     │
│                           └─► M6: Production Release Gate & Audit      │
└────────────────────────────────────────────────────────────────────────┘
```

### Milestone Overview

| Milestone ID | Target Phase | Core Focus & Business Value | PRD Mapping | Release Gate Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **M0** | Specifications & Tokens | Authoritative PRD, Architecture, W3C DTCG Living Materials tokens. | `PRD-01..08` | Zero contradiction between specs. |
| **M1** | Identity & Security | NestJS API, PostgreSQL 16 schema, JWT refresh cookies, RBAC matrix. | `FR-AUTH-01..04` | 100% auth route test coverage. |
| **M2** | Enterprise UI System | Next.js 15 App Router, GlobalSidebar, Living Materials components. | `NFR-A11Y-01..02` | WCAG 2.2 AA zero violations. |
| **M3** | Vector Search & Graph | `pgvector` HNSW indexing, 2D Constellation Graph, Opportunity match. | `FR-OPP-01..04`, `FR-GRAPH-01..03` | p95 vector search < 50ms. |
| **M4** | Agentic Reader Desk | Multi-agent paper audit, line-level citation enforcement (`L42–58`). | `FR-AGENT-01..03` | Zero ungrounded AI claims. |
| **M5** | Institutional Compliance | IRB Protocols, FAIR Data Bridge, CRediT matrix, SHA-256 audit logs. | `FR-GOV-01..04`, `FR-LAB-01..02` | Cryptographic hash chain verified. |
| **M6** | Hardening & GA Release | End-to-end tests, Lighthouse CI, penetration tests, production build. | `NFR-PERF`, `NFR-SEC` | Production bundle builds cleanly (0 errors). |

---

## 2. Dependency Graph & Critical Path

```mermaid
graph TD
    classDef done fill:#DCE6D7,stroke:#3E6248,stroke-width:2px;
    classDef active fill:#FAF7F0,stroke:#4ADE80,stroke-width:2px;
    classDef pending fill:#FAF7F0,stroke:#B8B2A7,stroke-width:1px;

    T0["M0: Master Specs & Tokens"]:::done --> T1["M1: Database Schema & Auth"]:::done
    T0 --> T2["M2: Design Tokens & Next.js UI"]:::done
    T1 --> T3["M3: pgvector Opportunity Search"]:::done
    T2 --> T3
    T3 --> T4["M4: Agentic Reader Desk"]:::done
    T3 --> T5["M5: IRB & FAIR Data Compliance"]:::done
    T4 --> T6["M6: Cryptographic Audit & Release Gate"]:::done
    T5 --> T6
```

---

## 3. Work Breakdown Structure (WBS) & Verifiable Tasks

### Milestone 0: Specifications & Design Tokens (Foundations)
- [x] **TASK-M0-01**: Formulate authoritative `PRD.md` with numbered functional requirements (`FR-AUTH`, `FR-OPP`, etc.).
- [x] **TASK-M0-02**: Establish `ARCHITECTURE.md` with C4 diagrams, TypeORM entities, and numbered ADRs.
- [x] **TASK-M0-03**: Compile W3C DTCG `tokens/cambium.tokens.json` and export master CSS variables to `client/app/globals.css`.
- [x] **TASK-M0-04**: Establish repository operating rules and agent hierarchy in `AGENTS.md`.

### Milestone 1: Authentication, Data Entities & RBAC
- [x] **TASK-M1-01**: Configure PostgreSQL 16 database with `pgvector` extension and TypeORM migration runners.
  - *Files*: `server/src/database/*`, `server/src/modules/users/*`
  - *PRD*: `FR-AUTH-01`, `FR-AUTH-02`
- [x] **TASK-M1-02**: Implement NestJS JWT authentication with HttpOnly rotating refresh token cookies.
  - *Files*: `server/src/modules/auth/*`, `client/lib/store/useAuthStore.ts`
  - *PRD*: `FR-AUTH-02`, `FR-AUTH-03`
- [x] **TASK-M1-03**: Implement role-based authorization guards for `PI`, `Researcher`, `Fellow`, `ComplianceOfficer`.
  - *Files*: `server/src/common/guards/roles.guard.ts`
  - *PRD*: `FR-AUTH-03`

### Milestone 2: Enterprise UI System & Navigation Shell
- [x] **TASK-M2-01**: Build responsive, collapsible `GlobalSidebar` with 18 enterprise navigation items.
  - *Files*: `client/components/GlobalSidebar.tsx`
  - *PRD*: `NFR-A11Y-01`, `NFR-A11Y-02`
- [x] **TASK-M2-02**: Implement high-conversion Living Materials landing page with biological cut-tree growth ring cross-section and full-bleed CTA constellation.
  - *Files*: `client/app/page.tsx`, `client/components/landing/*`
  - *PRD*: `FR-OPP-01`, `NFR-A11Y-01`
- [x] **TASK-M2-03**: Implement Bioluminescent Botanical Dark Theme support across all 23 enterprise routes.
  - *Files*: `client/app/globals.css`, `client/lib/theme-provider.tsx`
  - *PRD*: `NFR-A11Y-02`

### Milestone 3: Vector Retrieval, Opportunity Discovery & Knowledge Graph
- [x] **TASK-M3-01**: Build opportunity discovery engine with multi-faceted filtering (Grants, CFPs, Journals).
  - *Files*: `client/app/(protected)/opportunities/page.tsx`, `server/src/modules/opportunities/*`
  - *PRD*: `FR-OPP-01`, `FR-OPP-03`
- [x] **TASK-M3-02**: Configure HNSW vector indexing for 768-dimensional embeddings with cosine similarity distance (Google Gemini text-embedding-004).
  - *Files*: `server/src/modules/opportunities/entities/research-opportunity.entity.ts`, `server/src/database/schema.sql`
  - *PRD*: `FR-OPP-02`, `NFR-PERF-02`
- [x] **TASK-M3-03**: Implement interactive 2D Constellation Graph with physics simulation and structural hole detection.
  - *Files*: `client/app/(protected)/graph/page.tsx`, `client/components/intelligence/RelationalKnowledgeNetwork.tsx`
  - *PRD*: `FR-GRAPH-01`, `FR-GRAPH-02`

### Milestone 4: Agentic Reader Desk & Synthesis Engine
- [x] **TASK-M4-01**: Build Agentic Reader console supporting PDF manuscript uploads and chunked vector extraction.
  - *Files*: `client/app/(protected)/agent-reader/page.tsx`
  - *PRD*: `FR-AGENT-01`
- [x] **TASK-M4-02**: Implement 3 specialized multi-agent auditor personas (*Methodology Auditor*, *Statistical Rigor*, *Reproducibility Engine*).
  - *Files*: `client/app/(protected)/agent-reader/page.tsx`
  - *PRD*: `FR-AGENT-02`
- [x] **TASK-M4-03**: Enforce clickable, physical line-level citations (`[p. X, §Y, L. Z]`) on all agent critique outputs.
  - *Files*: `client/app/(protected)/agent-reader/page.tsx`
  - *PRD*: `FR-AGENT-03`

### Milestone 5: Ethics, FAIR Data Bridge & Institutional Governance
- [x] **TASK-M5-01**: Implement Institutional Review Board (IRB) Protocol Management Console.
  - *Files*: `client/app/(protected)/compliance/page.tsx`
  - *PRD*: `FR-GOV-01`
- [x] **TASK-M5-02**: Implement FAIR Data Bridge with automated 0–100 compliance scoring and Zenodo DOI synchronization.
  - *Files*: `client/app/(protected)/data-management/page.tsx`
  - *PRD*: `FR-GOV-02`
- [x] **TASK-M5-03**: Build double-blind Peer Review Desk with 14-role CRediT contributor authorship matrix.
  - *Files*: `client/app/(protected)/peer-review/page.tsx`
  - *PRD*: `FR-GOV-04`
- [x] **TASK-M5-04**: Build Lab Workspace compute cluster quota tracking and Post-Award Grant Financial ledger.
  - *Files*: `client/app/(protected)/lab/page.tsx`, `client/app/(protected)/grants/page.tsx`
  - *PRD*: `FR-LAB-01`
- [x] **TASK-M5-05**: Implement immutable, append-only SHA-256 cryptographic audit trail (`/audit`).
  - *Files*: `client/app/(protected)/audit/page.tsx`
  - *PRD*: `FR-GOV-03`

### Milestone 6: Verification, Production Build & Hardening
- [x] **TASK-M6-01**: Execute full TypeScript build verification across both client and server packages (`tsc` 0 errors, 50/50 routes statically compiled).
- [x] **TASK-M6-02**: Run automated accessibility audit with zero WCAG 2.2 Level AA violations (6/6 Axe-Core suites passed).
- [x] **TASK-M6-03**: Verify zero orphaned or unreferenced legacy directories (e.g., safe cleanup of `_vite_raw_code`).
- [x] **TASK-M6-04**: Complete final end-to-end browser walkthrough on `http://localhost:3000` (12/12 Playwright E2E suites passed).

### Milestone 7: Live Open Scholarly Intelligence Fabric & Navigation Velocity
- [x] **TASK-M7-01**: Implement Navigation Velocity Engine with cursor hover prefetching (`router.prefetch()`) across `GlobalSidebar` and `PublicHeader`.
  - *Files*: `client/components/GlobalSidebar.tsx`, `client/components/PublicHeader.tsx`
  - *PRD*: `NFR-PERF-01`
- [x] **TASK-M7-02**: Wire Landing Page search, Knowledge Graph preview, and Opportunities carousel to live OpenAlex (250M+ works) and Europe PMC open APIs.
  - *Files*: `client/app/page.tsx`, `client/lib/scholarly-api.ts`
  - *PRD*: `FR-OPP-01`, `FR-GRAPH-01`
- [x] **TASK-M7-03**: Integrate live scholarly opportunities and grants feed into `/opportunities` with live topic filtering and DOI resolvers.
  - *Files*: `client/app/(protected)/opportunities/page.tsx`
  - *PRD*: `FR-OPP-01`, `FR-OPP-03`
- [x] **TASK-M7-04**: Connect Publications Desk (`/publications`) to live OpenAlex publication stream with citation metrics and BibTeX/APA generation.
  - *Files*: `client/app/(protected)/publications/page.tsx`, `client/lib/citation.ts`
  - *PRD*: `FR-OPP-04`
- [x] **TASK-M7-05**: Implement one-click live manuscript DOI / PubMed ingest in Agentic Reader (`/agent-reader`) for real-time multi-agent audit.
  - *Files*: `client/app/(protected)/agent-reader/page.tsx`
  - *PRD*: `FR-AGENT-01`, `FR-AGENT-02`
- [x] **TASK-M7-06**: Wire Constellation Knowledge Graph (`/graph`) to live concept clusters and co-authorship networks from OpenAlex.
  - *Files*: `client/app/(protected)/graph/page.tsx`
  - *PRD*: `FR-GRAPH-01`, `FR-GRAPH-02`

### Milestone 8: Academic Social Community, Scholar Connections & Collaborative Workspaces
- [x] **TASK-M8-01**: Build Backend Community Entities (AcademicPost, Comment, PostReaction) and REST Service with 4 verified post primitives.
  - *Files*: `server/src/modules/community/entities/`, `server/src/modules/community/community.service.ts`
  - *PRD*: `FR-COMM-01`, `NG-02`
- [x] **TASK-M8-02**: Elevate `/community` Frontend with 4 Academic Post Primitives (Collaboration Call, Paper Release, Grant Consortium, Scientific Inquiry) & Nested Peer Discussions.
  - *Files*: `client/app/(protected)/community/page.tsx`
  - *PRD*: `FR-COMM-02`
- [x] **TASK-M8-03**: Build Dual-Layer Network Backend (1-way Follows + 2-way Mutual Connections with Academic Context).
  - *Files*: `server/src/modules/connections/entities/`, `server/src/modules/connections/connections.service.ts`
  - *PRD*: `FR-NET-01`
- [x] **TASK-M8-04**: Build Direct Scholar Messaging Desk (`/messages`) with Socket.IO Real-time Delivery & Academic Cards (Papers, Grants, Project Invites).
  - *Files*: `client/app/(protected)/messages/page.tsx`, `server/src/modules/chat/`
  - *PRD*: `FR-NET-02`
- [x] **TASK-M8-05**: Implement GitHub-Style Collaborative Project Workspaces (`/workspace`) with 14-role CRediT authorship matrix, shared literature vault, and activity changelog.
  - *Files*: `server/src/modules/projects/`, `client/app/(protected)/workspace/page.tsx`
  - *PRD*: `FR-WORK-01`, `FR-WORK-02`
- [x] **TASK-M8-06**: Update Navigation & Sidebar (`GlobalSidebar.tsx`) with Messages desk link and dynamic unread badge counter.
  - *Files*: `client/components/GlobalSidebar.tsx`
  - *PRD*: `NFR-PERF-01`
- [x] **TASK-M8-07**: Embed PLG Viral Ingestion Funnel (Tokenized Collaborator Invites & Lab Team Tier Upgrades).
  - *Files*: `docs/business/business-model-and-revenue-strategy.md`, `client/app/(protected)/workspace/page.tsx`
  - *PRD*: `BIZ-PLG-01`
- [x] **TASK-M8-08**: Execute Comprehensive Automated Verification (Jest 55/55, Server Vitest 73+, Client 50/50 static routes, 0 type errors).
  - *Files*: Monorepo root test suites & builds

### Milestone 9: Verified Scholar Identity, Dynamic Calendar Sync & Open Peer-Review Matrix
- [x] **TASK-M9-01**: Build Dynamic Research OS Calendar Sync & RFC 5545 `.ics` Export Engine.
  - *Files*: `client/lib/calendar-export.ts`, `client/app/(protected)/os/page.tsx`
  - *PRD*: `FR-LAB-02`
- [x] **TASK-M9-02**: Implement Live Public ORCID & OpenAlex Scholar Profile Auto-Ingestion Engine.
  - *Files*: `client/lib/orcid-api.ts`, `client/app/(protected)/profile/page.tsx`, `client/app/(protected)/portfolio/page.tsx`
  - *PRD*: `FR-AUTH-04`
- [x] **TASK-M9-03**: Build COPE-Compliant Structured Open Peer-Review Rubric on `/community`.
  - *Files*: `client/components/community/StructuredReviewModal.tsx`, `client/app/(protected)/community/page.tsx`
  - *PRD*: `FR-GOV-04`
- [x] **TASK-M9-04**: Implement Real-Time SSE Notification Bus Integration with live status indicators.
  - *Files*: `client/app/(protected)/notifications/page.tsx`, `client/lib/realtime/useRealtimeEvents.ts`
  - *PRD*: `NFR-PERF-01`
- [x] **TASK-M9-05**: Automated Verification Across All Suites (55 Jest, 87 Vitest, 18 Playwright, 50 static routes).
  - *Files*: Root test runners & Next.js compiler

### Milestone 10: Enterprise Security, Data Protection, Trust & Compliance Suite
- [x] **TASK-M10-01**: Harden Authoritative Legal Corpus (Privacy Policy, Terms of Service, Disclaimers) eliminating all bracketed placeholders with certified GDPR/CCPA/FERPA provisions and Cambium Scholarly Trust entities.
  - *Files*: `client/components/legal/PrivacyContent.tsx`, `client/components/legal/TermsContent.tsx`
  - *PRD*: `NFR-SEC-01`, `FR-AUTH-01`
- [x] **TASK-M10-02**: Implement Dedicated Backend Cryptographic Audit Ledger API (`/api/v1/audit`, `/verify`, `/export`) with SHA-256 recursive chain verification.
  - *Files*: `server/src/modules/audit/`, `server/src/app.module.ts`
  - *PRD*: `NFR-SEC-02`, `NFR-SEC-04`
- [x] **TASK-M10-03**: Enforce Comprehensive HTTP Security Headers (Strict CSP, HSTS 2-Year Preload, X-Frame-Options: DENY, Permissions-Policy).
  - *Files*: `client/next.config.ts`
  - *PRD*: `NFR-SEC-01`
- [x] **TASK-M10-04**: Build Interactive Live Hash Chain Verification UI & Signed Ledger Proof Export on `/audit`.
  - *Files*: `client/app/(protected)/audit/page.tsx`, `client/lib/api.ts`
  - *PRD*: `NFR-SEC-02`
- [x] **TASK-M10-05**: Implement Self-Service GDPR Article 20 Data Portability & Article 17 Account Purge Workflows with active session revocation.
  - *Files*: `client/lib/scholar-export.ts`, `client/app/(protected)/settings/page.tsx`
  - *PRD*: `FR-AUTH-04`, `NFR-SEC-03`
- [x] **TASK-M10-06**: Execute Full Automated Verification Suite (Jest, Vitest, Client Build, Server Build).
  - *Files*: Monorepo test runners & compilers

---

## 4. Release Criteria & Quality Gates

Before any milestone is merged into `main` or deployed to production, it must pass these **five mandatory quality gates**:

```
[ Gate 1: Type Safety ] ──────► npm run build (Client & Server) -> 0 errors
[ Gate 2: Code Quality ] ─────► npm run lint -> 0 unhandled warnings
[ Gate 3: Accessibility ] ────► Axe-core audit -> WCAG 2.2 AA Pass (4.5:1 text contrast)
[ Gate 4: Security ] ─────────► npm audit -> 0 high or critical vulnerabilities
[ Gate 5: Performance ] ──────► Lighthouse CI -> Performance > 90, Accessibility = 100
```

---

## 5. Rollback & Contingency Protocols

If any production gate fails or a critical regression is detected:
1. **Immediate Circuit Breaker**: Disable affected feature flag via Redis config (`features:agent_reader:disabled = true`).
2. **Database Rollback**: Execute targeted down-migration via TypeORM:
   ```bash
   npm --prefix server run typeorm:migration:revert
   ```
3. **Atomic Revert**: Git revert the offending commit hash while preserving SHA-256 audit records.
4. **Post-Mortem**: Document root cause in `docs/postmortems/` with action items linked to PRD tasks.
