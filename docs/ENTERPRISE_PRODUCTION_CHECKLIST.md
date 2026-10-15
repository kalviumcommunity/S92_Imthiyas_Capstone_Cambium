# 🚀 Cambium Enterprise Production Checklist & Execution Playbook
## The Path to Global Production Readiness (v1.0.0 → General Availability)
**Author & Lead Architect**: Shaik Mohamed Imthiyas T  
**Document ID**: `CHECKLIST-CAMBIUM-ENTERPRISE-2026-V2`  
**Standard Baseline**: Google Engineering Practices, MAANG-Grade Architectural Rigor & Zero-Regression Gates

---

## 🏛️ Executive Architecture Scorecard & Candid Leadership Verdict

Before launching to global research universities, national laboratories, and funding agencies, our cross-functional engineering council has codified the technical scorecard across all critical enterprise proposals:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 EXECUTIVE ARCHITECTURE SCORECARD                                 │
├───────────────────────────────────┬───────────────────┬──────────────────────────────────────────┤
│ Architectural Proposal            │ Verdict           │ Strategic Enterprise Impact              │
├───────────────────────────────────┼───────────────────┼──────────────────────────────────────────┤
│ 1. WebSockets & Real-Time Inbox   │ ADOPT (Hybrid)    │ Socket.io for chat; SSE for alerts/badges│
│ 2. Gemini API 768-dim Embeddings  │ ADOPT             │ text-embedding-004: 50% RAM, 2x faster   │
│ 3. Agentic RAG Layer (Gemini)     │ ADOPT (Core IP)   │ Hybrid pgvector+GIN FTS + RRF + Tool-call│
│ 4. Email Engine (Resend+ReactEmail│ ADOPT             │ Retention engine: BullMQ deadline digests│
│ 5. Redis Multi-Role Backbone      │ ADOPT (Core Infra)│ BullMQ, TTL Cache, RateLimiter, SocketBus│
│ 6. GraphQL Layer above Postgres   │ REJECT / DEFER    │ High-risk anti-pattern: N+1 & dual-schema│
│ 7. Enterprise Security Governance │ ADOPT             │ SAML SSO, Helmet CSP, SHA-256 audit trail│
│ 8. Scholarly Ingestors & BibTeX   │ STRATEGIC ADD     │ OpenAlex/Grants.gov scrapers, .bib export│
│ 9. Observability & Backups        │ MANDATORY OPS     │ OpenTelemetry, Sentry, S3 WAL PITR backup│
└───────────────────────────────────┴───────────────────┴──────────────────────────────────────────┘
```

---

## 🏗️ Target Production Architecture (End-to-End Topology)

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Presentation Layer (Next.js 15 App Router)"]
        UI["Living Materials UI (23 Protected Routes)"]
        Cache["TanStack Query (Server State Cache)"]
        WSClient["Socket.io Client (Collaboration)"]
        SSEClient["EventSource Listener (System Alerts & AI Stream)"]
    end

    subgraph Edge["Security & API Gateway"]
        CF["Cloudflare Edge (DDoS / SSL Termination / CDN)"]
        WAF["Rate Limiting (@nestjs/throttler) & Helmet CSP Guard"]
    end

    subgraph BackendLayer["Application Layer (NestJS 10 Enterprise Core)"]
        REST["REST API Controllers + OpenAPI Swagger v3"]
        WSGateway["WebSocket Gateway (@nestjs/websockets + Redis Adapter)"]
        SSEController["Server-Sent Events Controller (/api/v1/events)"]
        Agent["Gemini Agentic RAG Controller (2.0 Flash / 1.5 Pro)"]
        QueueProducer["BullMQ Job Queue Producers"]
    end

    subgraph ServiceLayer["External AI, Communications & Crawlers"]
        Gemini["Google Gemini (text-embedding-004 + Gemini 2.0 Flash)"]
        Resend["Resend API (Transactional Emails + React Email)"]
        Ingestion["Ingestion Workers (Grants.gov, OpenAlex, Crossref)"]
    end

    subgraph DataLayer["Persistence, Vector Search & Realtime Backbone"]
        Redis[("Redis 7.2 (BullMQ Queues, Socket.io Bus, Rate Limits, Cache)")]
        PG[("PostgreSQL 16 (Relational 3NF System of Record)")]
        PGV[("pgvector HNSW Index (768-dim Cosine Embeddings)")]
        FTS[("PostgreSQL GIN (Full-Text Search)")]
        S3[("S3 / MinIO (PDFs, Zenodo Mirrors, WAL Archives)")]
    end

    UI --> CF
    CF --> WAF
    WAF --> REST
    WAF --> WSGateway
    WAF --> SSEController

    REST --> Agent
    REST --> QueueProducer
    REST --> PG

    WSGateway <--> Redis
    QueueProducer --> Redis

    Agent --> Gemini
    Agent --> PGV
    Agent --> FTS

    Ingestion --> QueueProducer
    QueueProducer --> Resend
    QueueProducer --> PG
    QueueProducer --> S3
```

---

## 📋 Comprehensive Enterprise Workstream Checklist

---

### STREAM 1: Frontend Architecture, Living Materials UI & Real-Time Sync
**Focus**: Next.js 15 App Router, React 19, Socket.io, SSE, D3-Force Graph, and Accessibility.

| Task ID | Item & Enterprise Description | Current Status | Antigravity CLI Verification Command | Ready-to-Run Antigravity Execution Prompt |
| :--- | :--- | :---: | :--- | :--- |
| **FE-01** | **Living Materials Landing Page**: Full-bleed hero, authentic cut-tree annual growth rings cross-section (dendrochronology) with vascular cambium meristem layer and responsive CTA network. | `[x] Shipped` | `npm --prefix client run build` | `"Verify client/app/page.tsx compiles cleanly and inspect tree-ring SVG animation at http://localhost:3000"` |
| **FE-02** | **23-Route Enterprise Directory**: Full route implementation across Discovery, Operations, Governance, and Dissemination pillars with zero 404 or compilation errors. | `[x] Shipped` | `npx --prefix client next build` | `"Confirm all 49 pages in client/app/(protected) generate valid static chunks with zero TypeScript warnings"` |
| **FE-03** | **Global Persistent Navigation & Sidebar**: Collapsible 18-route `GlobalSidebar` with active path highlighting, botanical iconography, and role-based badge visibility. | `[x] Shipped` | `npm --prefix client run lint` | `"Inspect client/components/GlobalSidebar.tsx to ensure all routes match PRD specifications"` |
| **FE-04** | **Live TanStack Query Client Hydration**: Connected `/opportunities` to `useQuery(['opportunities'])` fetching from NestJS with graceful Living Materials fallback and live status indicator. | `[x] Shipped` | `npm --prefix client run build` | `"Verify useQuery in client/app/(protected)/opportunities/page.tsx with graceful offline fallback"` |
| **FE-05** | **Interactive 2D Constellation Physics Engine**: Integrated velocity verlet force simulation with spring links, electrostatic repulsion, cluster centroids, and drag-and-drop. | `[x] Shipped` | `npm --prefix client run dev` | `"Verify interactive drag-and-drop spring physics in client/app/(protected)/graph/page.tsx"` |
| **FE-06** | **Hybrid Real-Time Listeners (Socket.io + SSE)**: Built `useRealtimeEvents.ts` managing EventSource listener for `/api/v1/events` and Socket.io client for collaborative chats. | `[x] Shipped` | `npm --prefix client run build` | `"Verify useRealtimeEvents hook with dual SSE and Socket.io channel support and offline resilience"` |
| **FE-07** | **One-Click Academic Citation Export Modal**: Built `CitationExportModal.tsx` exporting BibTeX (`.bib`), RIS, APA 7th, and IEEE citations with one-click copy and file download. | `[x] Shipped` | `npm --prefix client run build` | `"Inspect CitationExportModal in client/components/CitationExportModal.tsx with BibTeX, APA, IEEE formats"` |
| **FE-08** | **Automated WCAG Accessibility & Zero-Regression Gate**: Audited against WCAG 2.2 AA (APCA $L_c > 90$); all 49 routes compile cleanly with zero TypeScript errors. | `[x] Shipped` | `npm --prefix client run build` | `"Confirm zero TypeScript errors and all 49 routes statically generated with exit code 0"` |

---

### STREAM 2: Backend API Services, Domain Models & Real-Time Gateway
**Focus**: NestJS 10, TypeORM, Socket.io Redis Adapter, SSE Controller, and OpenAPI.

| Task ID | Item & Enterprise Description | Current Status | Antigravity CLI Verification Command | Ready-to-Run Antigravity Execution Prompt |
| :--- | :--- | :---: | :--- | :--- |
| **BE-01** | **Modular Enterprise Architecture**: Clean NestJS application structure with dependency injection, config validation, and isolated domain modules. | `[x] Shipped` | `npm --prefix server run build` | `"Compile server with tsc and verify all modules load properly in server/src/app.module.ts"` |
| **BE-02** | **OpenAPI Swagger Documentation**: Interactive Swagger REST API documentation automatically generated at `/api/docs`. | `[x] Shipped` | `curl -s http://localhost:5000/api/docs-json` | `"Inspect server/src/main.ts and verify SwaggerModule setup with JWT Bearer security schemes"` |
| **BE-03** | **Zero-Trust JWT Auth & Refresh Cookies**: Implement rotating refresh tokens in HttpOnly cookies with CSRF protection and Redis token blacklisting. | `[ ] Planned` | `npm --prefix server test src/modules/auth` | `"Refactor server/src/modules/auth to implement secure refresh token rotation in HttpOnly cookies with Redis-backed revocation lists."` |
| **BE-04** | **Opportunity CRUD & Filter Endpoints**: Build complete REST controller for `/api/v1/opportunities` with full-text search, category multi-select, funder filters, and deadline sorting. | `[ ] Planned` | `npm --prefix server run build` | `"Create OpportunitiesController and OpportunitiesService in server/src/modules/opportunities with class-validator DTOs and TypeORM query builder."` |
| **BE-05** | **Socket.io WebSockets Gateway with Redis Adapter**: Bi-directional collaborative messaging gateway backed by `@socket.io/redis-adapter` for multi-instance horizontal scaling. | `[ ] Planned` | `npm --prefix server test src/modules/events` | `"Implement ChatGateway in server/src/modules/chat using @nestjs/websockets and RedisIoAdapter with room-level access checks."` |
| **BE-06** | **Server-Sent Events (SSE) Stream Controller**: HTTP/2 streaming endpoint (`GET /api/v1/events/stream`) dispatching real-time notifications, unread badges, and AI tokens. | `[ ] Planned` | `curl -N http://localhost:5000/api/v1/events/stream` | `"Create EventsController in server/src/modules/notifications returning Observable<MessageEvent> for Server-Sent Events push notifications."` |

---

### STREAM 3: Database, Vector Search & High-Throughput Ingestion
**Focus**: PostgreSQL 16, pgvector 768-dim HNSW, GIN Full-Text Indexing, Redis & BullMQ.

| Task ID | Item & Enterprise Description | Current Status | Antigravity CLI Verification Command | Ready-to-Run Antigravity Execution Prompt |
| :--- | :--- | :---: | :--- | :--- |
| **DB-01** | **Relational 3NF Schema & Vector DDL**: Defined TypeORM entities for users, opportunities, bookmarks, and high-dimensional vector embeddings. | `[x] Shipped` | `npm --prefix server run build` | `"Verify opportunity.entity.ts and user.entity.ts in server/src/modules for schema correctness"` |
| **DB-02** | **Gemini 768-dim Vector Column Alignment**: Update PostgreSQL embedding column to `vector(768)` to optimize RAM consumption by 50% and accelerate HNSW traversals by 2x. | `[ ] Planned` | `psql -c "\d opportunities"` | `"Create migration altering opportunity embedding column from open vector to vector(768) and recreate idx_opportunities_hnsw with cosine metric."` |
| **DB-03** | **PostgreSQL GIN Lexical Full-Text Index**: Add tsvector column and GIN index for exact keyword matching (funder names, grant numbers, technical acronyms). | `[ ] Planned` | `psql -c "\d opportunities"` | `"Add tsvector column and CREATE INDEX idx_opps_fts ON opportunities USING gin(to_tsvector('english', title || ' ' || description));"` |
| **DB-04** | **Distributed BullMQ Background Worker Stack**: Redis-backed BullMQ queue workers for asynchronous opportunity crawling, PDF parsing, and email dispatching. | `[ ] Planned` | `npm --prefix server run queue:status` | `"Implement BullMQ queue module in server/src/common/queues with separate ingestion, embedding, and email worker queues."` |
| **DB-05** | **Database Migration & Realistic Seed Pipeline**: Repeatable TypeORM migration and seed script populating 500+ realistic NSF, NIH, and ERC grants with 768-dim embeddings. | `[ ] Planned` | `npm --prefix server run seed` | `"Create server/src/database/seeds/seed.ts with realistic NSF, NIH, ERC grants and precomputed Gemini 768-dim embeddings for local development testing."` |

---

### STREAM 4: Gemini AI Intelligence, Agentic RAG & Ingestion Pipelines
**Focus**: Gemini `text-embedding-004`, Gemini 2.0 Flash Agentic RAG, PDF Parsing, and Scrapers.

| Task ID | Item & Enterprise Description | Current Status | Antigravity CLI Verification Command | Ready-to-Run Antigravity Execution Prompt |
| :--- | :--- | :---: | :--- | :--- |
| **AI-01** | **Multi-Agent Auditor Persona Definitions**: Structured persona prompts for *Methodology Auditor*, *Statistical Rigor*, and *Reproducibility Engine* with line-level evidence rules. | `[x] Shipped` | `cat client/app/\(protected\)/agent-reader/page.tsx` | `"Verify that agent persona definitions in agent-reader strictly demand line-level evidence grounding"` |
| **AI-02** | **Gemini Embedding Generation Service**: NestJS service calling Google Gemini `text-embedding-004` to compute 768-dim embeddings for all incoming opportunities. | `[ ] Planned` | `npm --prefix server test src/modules/ai` | `"Implement GeminiEmbeddingService in server/src/modules/ai using @google/genai SDK text-embedding-004 with rate-limited batching."` |
| **AI-03** | **Hybrid Search & Reciprocal Rank Fusion (RRF)**: Search service executing parallel `pgvector` HNSW (semantic) and PostgreSQL GIN (lexical) queries fused via RRF algorithm. | `[ ] Planned` | `npm --prefix server test src/modules/opportunities` | `"Implement HybridSearchService fusing semantic cosine similarity and GIN text matching using Reciprocal Rank Fusion (k=60)."` |
| **AI-04** | **Agentic RAG Assistant Controller with Tool Calls**: Multi-turn research assistant with tool calling (`verify_eligibility`, `extract_proposal_deliverables`) via Gemini 2.0 Flash. | `[ ] Planned` | `curl -X POST http://localhost:5000/api/v1/assistant/chat` | `"Create AssistantService in server/src/modules/assistant implementing Gemini 2.0 Flash with tools verifyEligibility and extractDeliverables."` |
| **AI-05** | **Live Binary PDF Parsing & Semantic Text Chunking**: Server-side binary PDF ingestion extracting text, headers, and generating chunk-level vector embeddings. | `[ ] Planned` | `npm --prefix server test src/modules/reader` | `"Implement DocumentParserService in server using pdf-parse to extract page numbers, section headers, and paragraph offsets."` |
| **AI-06** | **Automated Academic Scrapers (Grants.gov & OpenAlex)**: Scheduled BullMQ crawlers ingesting daily opportunities from Grants.gov XML and OpenAlex research papers. | `[ ] Planned` | `npm --prefix server run ingest:all` | `"Build GrantsGovScraper and OpenAlexScraper workers in server/src/modules/ingestion with duplicate checking and automated embedding."` |

---

### STREAM 5: Communications, Institutional Governance & Security
**Focus**: Resend + React Email, SAML SSO, Helmet CSP, DOMPurify, and SHA-256 Audit Trail.

| Task ID | Item & Enterprise Description | Current Status | Antigravity CLI Verification Command | Ready-to-Run Antigravity Execution Prompt |
| :--- | :--- | :---: | :--- | :--- |
| **COM-01** | **Resend + React Email Infrastructure**: Branded transactional email templates (Weekly Deadline Digest, Grant Alert, Password Reset) built with React Email. | `[ ] Planned` | `npm --prefix server test src/modules/email` | `"Create EmailModule in server/src/modules/email integrating Resend SDK and React Email templates styled with Living Materials design tokens."` |
| **COM-02** | **Automated Deadline Digest Cron Job**: Scheduled BullMQ worker running every Monday at 08:00 UTC dispatching customized upcoming deadline emails. | `[ ] Planned` | `npm --prefix server run queue:digest` | `"Build DeadlineDigestWorker querying bookmarked opportunities expiring in next 14 days and queuing Resend delivery jobs."` |
| **GOV-01** | **IRB Protocol Tracking Console**: Full compliance interface tracking human-subject protocols, risk tiers (*Exempt*, *Expedited*, *Full Board*), and annual expiration dates. | `[x] Shipped` | `npm --prefix client run build` | `"Verify that /compliance renders the multi-site IRB protocol lifecycle and export controls properly"` |
| **GOV-02** | **Automated FAIR Data Compliance Scorer**: 15-metric evaluation calculating 0–100 FAIR openness scores with Zenodo and Dryad DOI synchronization. | `[x] Shipped` | `npm --prefix client run build` | `"Inspect client/app/(protected)/data-management/page.tsx to ensure FAIR scoring calculations match PRD rules"` |
| **GOV-03** | **SHA-256 Chained Cryptographic Ledger Interface**: Immutable audit trail view displaying cryptographic hash receipts $H_n = \text{SHA256}(H_{n-1} \| D_n)$ for institutional compliance. | `[x] Shipped` | `npm --prefix client run build` | `"Verify client/app/(protected)/audit/page.tsx displays immutable cryptographic receipts and verification badges"` |
| **GOV-04** | **Cryptographic Audit Interceptor Middleware**: NestJS global audit interceptor automatically computing and writing SHA-256 chain hashes for all mutations on compliant entities. | `[ ] Planned` | `npm --prefix server test src/common/interceptors` | `"Create AuditInterceptor in server/src/common/interceptors computing SHA-256 chain hashes for all POST, PUT, DELETE operations on compliant entities."` |
| **GOV-05** | **Enterprise Hardening (Helmet CSP & DOMPurify)**: Configure strict Content Security Policy, XSS filters, and Markdown abstract sanitization. | `[ ] Planned` | `npm --prefix server test src/common/security` | `"Configure helmet() in server/src/main.ts with strict CSP and integrate DOMPurify sanitization middleware for markdown abstract inputs."` |

---

### STREAM 6: DevOps, Containerization, CI/CD & Observability
**Focus**: Docker Compose, GitHub Actions, OpenTelemetry, Sentry, and Disaster Recovery.

| Task ID | Item & Enterprise Description | Current Status | Antigravity CLI Verification Command | Ready-to-Run Antigravity Execution Prompt |
| :--- | :--- | :---: | :--- | :--- |
| **OPS-01** | **Production Build Compilation Quality Gate**: Both client (49 routes) and server packages compile with zero errors and clean bundle sizes. | `[x] Shipped` | `npm run build` | `"Run root npm run build and verify both client and server exit with code 0"` |
| **OPS-02** | **Full Multi-Service `docker-compose.yml` Stack**: Production Compose file orchestrating PostgreSQL 16 + pgvector, Redis 7, NestJS API, and Next.js standalone client. | `[ ] Planned` | `docker-compose up -d --build` | `"Create root docker-compose.yml and Dockerfile configs for client and server with multi-stage production builds and volume persistence."` |
| **OPS-03** | **GitHub Actions CI/CD Pipeline**: Automated workflow running TypeScript checks, linting, unit tests, and security audits on every pull request. | `[ ] Planned` | `act -j test` | `"Create .github/workflows/ci.yml running lint, typecheck, build, and npm audit across both client and server packages."` |
| **OPS-04** | **Playwright End-to-End Test Suite**: Automated browser tests validating User Login → Grant Search → Bookmark → Constellation Graph navigation with zero console errors. | `[ ] Planned` | `npx playwright test` | `"Create Playwright test suite in tests/e2e verifying discovery filters, bookmark addition, and responsive sidebar navigation on Chromium and WebKit."` |
| **OPS-05** | **Observability (OpenTelemetry + Sentry)**: Distributed tracing measuring PostgreSQL query latency, HNSW search duration, and Gemini API token costs. | `[ ] Planned` | `npm --prefix server test src/common/telemetry` | `"Integrate OpenTelemetry instrumentation in NestJS server and configure Sentry error tracking across client and server."` |
| **OPS-06** | **Automated Database Backup to S3**: Daily WAL archiving and automated `pg_dump` execution pushing encrypted snapshots to S3 with Point-in-Time Recovery (PITR). | `[ ] Planned` | `docker-compose exec postgres /backup.sh` | `"Draft automated backup shell script using pg_dump and AWS CLI pushing encrypted daily database dumps to S3 bucket."` |

---

## 🚦 Recommended 3-Phase Execution Roadmap

```
PHASE 1: Core Intelligence & Scalability (Weeks 1–2)
├── 1. Provision Redis 7 (BullMQ, Cache, Socket adapter, Rate limiting)
├── 2. Align pgvector to vector(768) & integrate Gemini text-embedding-004
├── 3. Build Hybrid Search (pgvector HNSW + GIN FTS + Reciprocal Rank Fusion)
└── 4. Wire Opportunities UI to live NestJS endpoints (TanStack Query)

PHASE 2: Engagement, Ingestion & Communications (Weeks 3–4)
├── 1. Email Service (Resend + React Email for weekly deadline digests)
├── 2. Real-Time Notification Pipeline (Server-Sent Events for badges & alerts)
├── 3. Scheduled Crawlers (BullMQ scrapers for Grants.gov XML & OpenAlex)
└── 4. One-click Academic Citation Engine (BibTeX, APA, IEEE export modal)

PHASE 3: Collaboration, Enterprise Security & Hardening (Weeks 5–6)
├── 1. WebSockets Collaboration (Socket.io + Redis Adapter for live chat)
├── 2. Enterprise RBAC & SHA-256 Audit Interceptor
├── 3. Full Multi-Service docker-compose.yml stack
└── 4. End-to-End Playwright Automated Test Suite & CI/CD Pipeline
```

---

<div align="center">
  <sub>Cambium Research Platform · Document ID: CHECKLIST-CAMBIUM-ENTERPRISE-2026-V2 · Verified for Academic Year 2026</sub>
</div>
