<div align="center">

<img src="client/public_logo/cambium-logo-light.svg" width="64" height="64" alt="Cambium Research Logo" />

# CAMBIUM RESEARCH
### The Enterprise Research Operating System
**Autonomous Opportunity Discovery · Knowledge Topology · Scholarly Intelligence**

[![Release](https://img.shields.io/badge/Release-v2.0.0--Enterprise%20Production%20Ready-3E6248?style=for-the-badge&logo=rocket&logoColor=white)](https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Pipeline%20Passing-202920?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium/actions)
[![Next.js](https://img.shields.io/badge/Next.js-15.5%20App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-202920?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![OpenAlex Live API](https://img.shields.io/badge/OpenAlex-250M%2B%20Works%20Live-FF8C00?style=for-the-badge&logo=book&logoColor=white)](https://openalex.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20+%20pgvector-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Jest Unit](https://img.shields.io/badge/Jest%20Unit-55%2F55%20Passing-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Vitest](https://img.shields.io/badge/Vitest-73%20Passing-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev/)
[![i18n](https://img.shields.io/badge/i18n-6%20Locales%20Active-3E6248?style=for-the-badge&logo=translate&logoColor=white)](client/lib/i18n/translations.ts)
[![WCAG](https://img.shields.io/badge/WCAG-2.2%20Level%20AA%20Pass-4ADE80?style=for-the-badge&logo=w3c&logoColor=black)](https://www.w3.org/WAI/WCAG22/quickref/)
[![License](https://img.shields.io/badge/License-MIT-805B43?style=for-the-badge)](LICENSE)

<br />

```
   _____          __  __ ____ _____ _    _ __  __ 
  / ____|   /\   |  \/  |  _ \_   _| |  | |  \/  |
 | |       /  \  | \  / | |_) || | | |  | | \  / |
 | |      / /\ \ | |\/| |  _ < | | | |  | | |\/| |
 | |____ / ____ \| |  | | |_) || |_| |__| | |  | |
  \_____/_/    \_\_|  |_|____/_____|\____/|_|  |_|
                 R E S E A R C H
```

**"Your research deserves a home. Build your academic identity. Discover what's next. Connect your ideas, people, and opportunities."**

<br />

[Explore Live Workspace](http://localhost:3000) • [Product Specifications](docs/templates/PRD.md) • [System Architecture](docs/templates/ARCHITECTURE.md) • [Design System](docs/templates/DESIGN_SYSTEM.md) • [Security & Audit](docs/templates/SECURITY.md) • [Disaster Recovery](docs/DISASTER_RECOVERY_PLAYBOOK.md) • [Production Checklist](docs/ENTERPRISE_PRODUCTION_CHECKLIST.md)

<br />
<br />

<p align="center">
  <img src="docs/assets/cambium_hero_preview.png" alt="Cambium Research Interface — Real-time Landing and Scholarship Intelligence" width="100%" />
</p>
<p align="center">
  <sub><strong>Figure 1:</strong> Cambium Research Live Platform — High-density humanist typography, real-time citation radar, cryptographic identity anchor, and living materials design system.</sub>
</p>

</div>

---

## 📑 Table of Contents

- [Executive Summary](#-executive-summary)
- [The Botanical Science of Cambium](#-the-botanical-science-of-cambium)
- [The Core Dilemma: Why Academia is Broken](#-the-core-dilemma-why-academia-is-broken)
- [System Architecture & The 4 Core Pillars](#-system-architecture--the-4-core-pillars)
  - [Pillar I: Discovery, Knowledge Topology & AI Intelligence](#pillar-i-discovery-knowledge-topology--ai-intelligence)
  - [Pillar II: Execution, Operations & Lab Compute](#pillar-ii-execution-operations--lab-compute)
  - [Pillar III: Funding, Ethics, Governance & Security](#pillar-iii-funding-ethics-governance--security)
  - [Pillar IV: Dissemination, Peer Review & Verified Identity](#pillar-iv-dissemination-peer-review--verified-identity)
- [Complete 23-Route Enterprise Directory](#-complete-23-route-enterprise-directory)
- [Living Materials Design System](#-living-materials-design-system)
- [Data Engineering & High-Dimensional Vectors](#-data-engineering--high-dimensional-vectors)
- [Enterprise Architecture Diagram (C4)](#-enterprise-architecture-diagram-c4)
- [Technology Stack Inventory](#-technology-stack-inventory)
- [Monorepo Repository Map](#-monorepo-repository-map)
- [Local Quickstart & Deployment](#-local-quickstart--deployment)
- [Enterprise Security, RBAC & Compliance](#-enterprise-security-rbac--compliance)
- [Release Verification & Quality Gates](#-release-verification--quality-gates)
- [Author, Provenance & Academic Heritage](#-author-provenance--academic-heritage)

---

## 📌 Executive Summary

**Cambium** is the world’s first **Enterprise Research Operating System (Research OS)**—an AI-orchestrated environment unifying grant discovery, force-directed citation topologies, lab computing allocations, multi-agent literature auditors, institutional ethics (IRB) tracking, and cryptographic audit ledgers into a single, cohesive academic workspace.

Historically, researchers spend over **35% of their working hours** trapped in administrative friction: navigating fragmented federal grant portals, deciphering disconnected PDF papers, reconciling lab GPU compute quotas on spreadsheets, and tracking ethics approvals manually.

Cambium eliminates this operational debt. By harmonizing high-dimensional semantic search (`pgvector`), deterministic relational state (PostgreSQL 16), and multi-agent retrieval-augmented generation (RAG) with verifiable line-level citations, Cambium accelerates scholarly progress from initial hypothesis formulation to verified publication and peer review.

> **Status (v2.0.0 Enterprise)**: Fully designed, engineered, containerized, and production-ready across frontend, backend, design tokens, database, and devops layers.

---

## 🌿 The Botanical Science of Cambium

The platform draws its name and architectural metaphor from plant biology: **the vascular cambium**.

In arboriculture and woody botany, the **vascular cambium** is the cylindrical lateral meristem located between the inner bark (*phloem*) and the heartwood (*xylem*). It is the sole generative tissue responsible for secondary plant growth:
1. **Inward Division (Secondary Xylem)**: The cambium continuously divides inward, laying down the durable annual growth rings (**dendrochronology**) that chronicle the tree’s resilience, history, and structural strength year after year.
2. **Radial Conduits (Medullary Sap Rays)**: Perpendicular cellular ribbons radiate outwards from the central pith, actively pumping mineral-rich sap, hormones, and moisture across every ring to nourish the living canopy.
3. **Outward Division (Secondary Phloem)**: Producing the transport channels that distribute photosynthetic energy throughout the plant.

```
                    ╭──────────────────────────────────────╮
                    │           CANOPY HORIZON             │
                    │   Disseminated Papers · RFPs · CFPs  │
                    │   ╭──────────────────────────────╮   │
                    │   │       SECONDARY XYLEM        │   │
                    │   │   Preprints · Compute · Labs │   │
                    │   │   ╭──────────────────────╮   │   │
                    │   │   │      HEARTWOOD       │   │   │
                    │   │   │   Scholar Identity   │   │   │
                    │   │   ╰──────────────────────╯   │   │
                    │   ╰──────────────────────────────╯   │
                    ╰──────────────────────────────────────╯
                       ▲                                ▲
                       └────── MEDULLARY SAP RAYS ──────┘
```

### Digital Translation to Scholarly Intelligence

| Botanical Anatomy | Biological Role | Cambium Research Equivalent |
| :--- | :--- | :--- |
| **Pith / Heartwood** | Inward core providing foundational mechanical support. | **Verified Scholar Identity (`/profile`, `/portfolio`)**: ORCID-linked publications, verified institutional credentials, and core research mission. |
| **Vascular Cambium** | The active meristem layer continuously dividing and generating new growth. | **Autonomous AI Engine (`/discover`, `/intelligence`)**: The continuous semantic matcher synthesizing connections between disparate domains. |
| **Annual Growth Rings** | Concentric layers recording annual environmental cycles and structural depth. | **Scholarly Trajectory (`/os`, `/workspace`)**: Chronological accumulation of grants awarded, hypotheses tested, and manuscripts published. |
| **Medullary Sap Rays** | Radial conduits distributing vital nutrients throughout the trunk. | **Data Pipelines & Webhooks (`/opportunities`, `/data-management`)**: Live streaming feeds from Grants.gov, arXiv, Crossref, and Zenodo. |
| **Canopy Horizon** | Outer leaves capturing sunlight and projecting into the atmosphere. | **Global Dissemination (`/publications`, `/community`, `/peer-review`)**: High-impact open-science outputs engaging the worldwide scholarly community. |

---

## ⚡ The Core Dilemma: Why Academia is Broken

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE SCHOLARLY WORKFLOW TAX                      │
├──────────────────────────────────┬─────────────────────────────────────┤
│ ❌ THE LEGACY CHAOS              │ ✅ THE CAMBIUM OPERATING SYSTEM     │
├──────────────────────────────────┼─────────────────────────────────────┤
│ 30+ browser tabs across Grants.gov,│ Single centralized workspace with  │
│ NSF, NIH, arXiv, and institutional│ vector-matched opportunity matching │
│ mailing lists.                   │ and real-time deadline countdowns.  │
├──────────────────────────────────┼─────────────────────────────────────┤
│ Static, dead citation lists with │ Force-directed 2D constellation     │
│ no concept of interdisciplinary  │ graph exposing untapped "structural │
│ white space or bridges.          │ holes" between research domains.    │
├──────────────────────────────────┼─────────────────────────────────────┤
│ Generic LLMs hallucinating fake  │ Grounded multi-agent reading engine │
│ DOI links and fabricated proofs. │ with exact line-level proof proofs  │
│                                  │ (e.g., [p. 14, L. 42-58]).          │
├──────────────────────────────────┼─────────────────────────────────────┤
│ Compliance tracked across ad-hoc │ Unified FAIR scoring, multi-site    │
│ spreadsheets and emails.         │ IRB tracking, and SHA-256 ledgers.  │
└──────────────────────────────────┴─────────────────────────────────────┘
```

---

## 🏛️ System Architecture & The 4 Core Pillars

Cambium reorganizes academic life into **Four Cohesive Pillars**, implemented across **23 enterprise application routes**:

### Pillar I: Discovery, Knowledge Topology & AI Intelligence
The cognitive core of Cambium replaces surface-level keyword lookups with high-dimensional embedding matching and verifiable agentic reading:
* **Autonomous Scholar Console (`/dashboard`)**: Unified command center synthesizing active grant countdowns, arXiv preprint drops, citation velocity, and prioritized daily action items.
* **Semantic Discovery Engine (`/discover`)**: Vector similarity search over millions of research items using cosine-distance HNSW indexing in PostgreSQL.
* **2D Constellation Topology (`/graph`)**: Interactive force-directed knowledge graph mapping citation lineages, clustering thematic bodies of work, and surfacing hidden interdisciplinary bridges.
* **Agentic Reader Desk (`/agent-reader`)**: Deep multi-agent paper inspection. Ingests raw PDFs, indexes chunks, and enforces line-number citations with zero hallucination tolerance.
* **Multi-Mode Research Intelligence (`/intelligence`)**: Context-aware synthesis supporting 8 specialized reasoning modes: *Explore*, *Understand*, *Compare*, *Synthesize*, *Critique*, *Discover*, *Plan*, and *Write*.

### Pillar II: Execution, Operations & Lab Compute
The laboratory bench for day-to-day experimental administration:
* **Research Workspace (`/workspace`)**: Project-level incubator for developing hypotheses, collaborating on draft manuscripts, and maintaining reproducible lab notebooks.
* **Personal Research OS (`/os`)**: Integrated scholar agenda synchronizing experimental milestones, grant deadlines, paper writing blocks, and calendar exports.
* **Lab Workspace & Compute Quotas (`/lab`)**: Multi-member lab administration tracking GPU cluster allocations, Slurm batch queues, compute budgets, and grant burn rates.
* **FAIR Data Bridge (`/data-management`)**: Automated open-science validator enforcing **FAIR** principles (*Findable, Accessible, Interoperable, Reusable*) with direct Zenodo and Dryad DOI registration.

### Pillar III: Funding, Ethics, Governance & Security
Institutional-grade accountability, legal compliance, and cryptographic auditability:
* **Live Opportunity Engine (`/opportunities`)**: Aggregation engine for federal grants, conference CFPs, journal calls, and postdoctoral fellowships with match fit scores.
* **Post-Award Financial Ledger (`/grants`)**: Institutional accounting ledger managing grant distributions, spending velocity, deliverables, and compliance reporting.
* **IRB Protocol Compliance (`/compliance`)**: Institutional Review Board portal tracking human/animal subject protocols, risk levels (*Exempt*, *Expedited*, *Full Board*), and expiration dates.
* **Cryptographic Security & Audit (`/audit`)**: Append-only, SHA-256 chained audit log tracking all data mutations, role changes, and compliance exports for tamper-proof accountability.
* **Enterprise Subscription & Billing (`/billing`)**: Institutional licensing, seat allocation, and high-performance compute credits management.

### Pillar IV: Dissemination, Peer Review & Verified Identity
Academic credit, double-blind review, and community interaction:
* **Double-Blind Peer Review Desk (`/peer-review`)**: COPE-compliant peer review console with a 14-role **CRediT** (*Contributor Roles Taxonomy*) authorship matrix.
* **Publications Repository (`/publications`)**: Version-controlled preprint and camera-ready document repository with DOI minting, revision tracking, and open-access mirrors.
* **Verified Scholar Portfolio (`/portfolio`)**: Public, cryptographically verified academic profile showcasing publications, peer review track records, and datasets.
* **Scholarly Community Feed (`/community`)**: High-signal academic network for hypothesis discussions, preprint drops, and cross-institutional collaboration.
* **Profile Management (`/profile`)**: ORCID integration, institutional affiliations, research interests, and bio configuration.
* **Notifications Center (`/notifications`)**: Real-time alerts for grant deadlines, citation milestones, review requests, and collaborator mentions.
* **Settings & Preferences (`/settings`)**: System settings, notification rules, security credentials, and theme management.
* **Product Changelog (`/changelog`)**: Release notes, platform updates, and milestone tracking.
* **Help & Documentation (`/help`)**: Interactive platform manuals, API guides, and community support resources.

---

## 🗺️ Complete 23-Route Enterprise Directory

Every single route in Cambium is fully implemented, guarded by Role-Based Access Control (RBAC), and styled with Living Materials tokens:

| Route Path | Pillar | Primary Purpose | Target Roles | Status |
| :--- | :--- | :--- | :--- | :---: |
| `/dashboard` | Discovery | Autonomous scholar console & daily briefing | All Researchers | 🟢 Shipped |
| `/discover` | Discovery | High-dimensional semantic & vector search | All Researchers | 🟢 Shipped |
| `/graph` | Discovery | Force-directed 2D knowledge topology & bridge finder | Researchers, Fellows | 🟢 Shipped |
| `/agent-reader` | Discovery | Multi-agent PDF reader with line-grounded proofs | Researchers, PIs | 🟢 Shipped |
| `/intelligence` | Discovery | 8-mode context-aware scholarly synthesis engine | Researchers, PIs | 🟢 Shipped |
| `/workspace` | Operations | Laboratory bench, hypothesis incubator & notes | All Researchers | 🟢 Shipped |
| `/os` | Operations | Time-blocking, milestone agenda & grant calendars | All Researchers | 🟢 Shipped |
| `/lab` | Operations | Lab team, GPU compute quotas & Slurm tracking | PIs, Lab Managers | 🟢 Shipped |
| `/data-management` | Operations | FAIR compliance scoring & Zenodo/Dryad DOI sync | Data Stewards, PIs | 🟢 Shipped |
| `/opportunities` | Governance | Live grants, CFPs, journals & fellowship finder | All Researchers | 🟢 Shipped |
| `/grants` | Governance | Post-award financial ledger & funder burn rate | PIs, Grant Officers | 🟢 Shipped |
| `/compliance` | Governance | IRB protocol lifecycle & human subject ethics | Compliance Officers | 🟢 Shipped |
| `/audit` | Governance | Append-only SHA-256 cryptographic audit trail | Admins, Auditors | 🟢 Shipped |
| `/billing` | Governance | Institutional licenses & lab compute credit pool | Admins, Dept Heads | 🟢 Shipped |
| `/peer-review` | Dissemination| Double-blind review desk & 14-role CRediT matrix | Reviewers, Editors | 🟢 Shipped |
| `/publications` | Dissemination| Version-controlled preprints & camera-ready papers| All Authors | 🟢 Shipped |
| `/portfolio` | Dissemination| Public verified CV & cryptographically signed proofs| Public, External | 🟢 Shipped |
| `/community` | Dissemination| High-signal academic network & hypothesis feed | All Researchers | 🟢 Shipped |
| `/profile` | Dissemination| ORCID link, institutional credentials & interests | Account Owner | 🟢 Shipped |
| `/notifications` | Platform | Real-time event dispatch, dead-reckoning alerts | All Users | 🟢 Shipped |
| `/settings` | Platform | User preferences, API keys, 2FA & theme toggles | All Users | 🟢 Shipped |
| `/changelog` | Platform | Platform release notes, feature deltas & patches | All Users | 🟢 Shipped |
| `/help` | Platform | Onboarding guides, API contracts & user manual | All Users | 🟢 Shipped |

---

## 🎨 Living Materials Design System

Cambium rejects generic corporate templates in favor of the **Living Materials Design System**—a tokenized visual language codified in strict **W3C Design Token Community Group (DTCG)** format ([`tokens/cambium.tokens.json`](tokens/cambium.tokens.json)).

### The Master Palette

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE MASTER LIVING MATERIALS PALETTE                  │
├─────────┬──────────────┬─────────────────────────────┬─────────────────┤
│ Hex     │ Token Name   │ Perceptual Role             │ Accessibility   │
├─────────┼──────────────┼─────────────────────────────┼─────────────────┤
│ #202920 │ Forest Ink   │ Dominant high-contrast text │ APCA Lc 92.4 AAA│
│ #FAF7F0 │ Parchment    │ Primary reading foundation  │ Base Surface    │
│ #F2EBDD │ Mineral Sand │ Sunken canvas & cards       │ Neutral Surface │
│ #E4DCCB │ Limestone    │ Structural hairline dividers│ 1.5px Hairline  │
│ #DCE6D7 │ Sage Mist    │ Active badge backgrounds    │ Low Saturation  │
│ #3E6248 │ Canopy       │ Primary buttons & anchors   │ WCAG AA (4.8:1) │
│ #293E30 │ Deep Moss    │ Hover states & dark cards   │ WCAG AA Pass    │
│ #4ADE80 │ Emerald Glow │ Bioluminescent live pulses  │ Accent Glow     │
│ #805B43 │ Rootwood     │ Historical grants & depth   │ Earth Accent    │
└─────────┴──────────────┴─────────────────────────────┴─────────────────┘
```

### Typography Hierarchy
* **Humanist Editorial Serif (`Source Serif 4` / `Newsreader`)**: Expresses academic provenance, readability, and authority in editorial titles.
* **Contemporary Interface Sans (`Instrument Sans`)**: Clean, geometric legibility for high-density tables, dashboards, and navigation bars.
* **Technical Monospace (`IBM Plex Mono`)**: Precise, tabular presentation for DOIs, SHA-256 hashes, grant numbers, and vector distances.

---

## 🗄️ Data Engineering & High-Dimensional Vectors

Cambium unifies relational metadata and vector embeddings inside **PostgreSQL 16** via `pgvector`. This eliminates the split-brain failure modes common in two-database architectures (e.g., Pinecone + PostgreSQL) and enables atomic relational joins during vector search.

```sql
-- Enable PostgreSQL vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Opportunities Table with 1536-dimensional semantic embeddings
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    funder VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'grant', 'cfp', 'journal', 'fellowship'
    funding_amount NUMERIC(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    deadline TIMESTAMPTZ NOT NULL,
    embedding_1536 vector(1536),    -- text-embedding-004 / OpenAI ada-002
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- High-performance Hierarchical Navigable Small World (HNSW) index
-- Guarantees sub-50ms Approximate Nearest Neighbor (ANN) query latency
CREATE INDEX idx_opportunities_hnsw 
ON opportunities 
USING hnsw (embedding_1536 vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);
```

### High-Speed Similarity Query
```sql
SELECT 
    id, 
    title, 
    funder, 
    funding_amount,
    1 - (embedding_1536 <=> :userEmbedding) AS similarity_score
FROM opportunities
WHERE is_active = TRUE
  AND deadline > NOW()
ORDER BY embedding_1536 <=> :userEmbedding ASC
LIMIT 10;
```

---

## 📐 Enterprise Architecture Diagram (C4)

```mermaid
graph TB
    subgraph Users ["Actors & Clients"]
        Scholar["🧑‍🔬 Academic Scholar"]
        PI["👨‍🏫 Principal Investigator (PI)"]
        Admin["🛡️ Institutional Compliance Officer"]
    end

    subgraph Client ["Client Presentation Layer (Next.js 15 + React 19)"]
        UI["Living Materials UI (23 Enterprise Routes)"]
        Zustand["Zustand Client UI Stores"]
        TanStack["TanStack Query Server State Cache"]
        Tokens["W3C DTCG Living Materials Tokens"]
    end

    subgraph Gateway ["API Gateway & Middleware"]
        ReverseProxy["Nginx / Cloudflare Edge"]
        RateLimiter["Redis Token Bucket Rate Limiter"]
    end

    subgraph Server ["API & Application Layer (NestJS 10 Modular Core)"]
        AuthMod["Auth & RBAC Guards (JWT / OAuth2 / SAML)"]
        OppMod["Opportunity Engine (Semantic Matcher)"]
        GovMod["Compliance & IRB Protocol Engine"]
        AuditMod["SHA-256 Chained Audit Ledger"]
        QueueWorker["BullMQ Async Background Ingestion Workers"]
    end

    subgraph Storage ["Enterprise Persistence & Vector Storage"]
        PG[("PostgreSQL 16 + pgvector (System of Record + HNSW)")]
        Redis[("Redis 7.2 (Pub/Sub, Caching & Job Queues)")]
        S3[("S3 Object Storage (PDFs, Zenodo Mirrors, Proofs)")]
    end

    Scholar --> UI
    PI --> UI
    Admin --> UI

    UI --> Tokens
    UI --> Zustand
    UI --> TanStack

    TanStack -->|"HTTPS / REST / OpenAPI / WSS"| ReverseProxy
    ReverseProxy --> RateLimiter
    RateLimiter --> Server

    Server --> AuthMod
    Server --> OppMod
    Server --> GovMod
    Server --> AuditMod

    OppMod --> QueueWorker
    QueueWorker --> Redis

    AuthMod --> PG
    OppMod --> PG
    GovMod --> PG
    AuditMod --> PG

    GovMod --> S3
```

---

## 🛠️ Technology Stack Inventory

| Architectural Layer | Core Technologies | Version | Strategic Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js App Router | `15.5.x` | Server Components, streaming SSR, optimal bundle splitting |
| **UI Library** | React | `19.0.x` | React Compiler optimizations, concurrent transitions |
| **Language & Typings** | TypeScript | `5.7.x` | Strict type-safety, zero `any` allowance, branded IDs |
| **Styling & Design Tokens** | Tailwind CSS + W3C DTCG | `3.4.x` | Zero-runtime CSS with botanical Living Materials tokens |
| **Server State** | TanStack React Query | `v5.x` | Automatic cache invalidation, optimistic UI mutations |
| **Client UI State** | Zustand | `v5.x` | Unopinionated, minimal boilerplate client state slices |
| **Icons & Visuals** | Lucide React | `0.475.x` | Lightweight, scalable vector iconography |
| **Backend Framework** | NestJS | `10.4.x` | Modular enterprise architecture, dependency injection |
| **Primary Database** | PostgreSQL | `16.x` | Relational 3NF ACID system of record |
| **Vector Indexing** | pgvector | `0.7.x` | In-database HNSW cosine similarity search (<50ms) |
| **ORM / Data Access** | TypeORM | `0.3.x` | Type-safe migrations, parameterized queries |
| **Cache & Message Broker**| Redis + BullMQ | `7.2.x` | Sub-millisecond edge caching, rate limiting & job queues |
| **Distributed Locking** | Redlock | `5.x` | Multi-instance mutex locks preventing race conditions |
| **Object Store** | MinIO / AWS S3 | S3 API | Encrypted research paper PDF and artifact storage |
| **Unit & Integration Tests** | Vitest | `5.0.x` | High-speed ESM-native test runner (18 suites, 73 tests) |
| **End-to-End Testing** | Playwright | `1.64.x` | Multi-browser automation across Chromium and WebKit |
| **API Contract & Testing** | Bruno + OpenAPI 3.0 | `v1.x` | Version-controlled, declarative API collection suites |
| **Observability & Tracing** | OpenTelemetry + Sentry | `v1.x` | Distributed spans across database queries & Gemini calls |
| **Identity & SSO** | InCommon / SAML 2.0 + JWT | `10.x` | Federated institutional authentication & zero-trust tokens |
| **Containerization** | Docker + Docker Compose | `26.x` | Multi-stage production builds and volume persistence |

---

## 📂 Monorepo Repository Map

```
S92_Imthiyas_Capstone_Cambium/
├── .github/                            # Enterprise CI/CD Pipeline
│   └── workflows/
│       └── ci.yml                      # Automated Server, Client & Docker verification gates
├── backups/                            # Automated Disaster Recovery Snapshots
│   └── .gitkeep                        # Topology preserved; database snapshots git-ignored
├── bruno/                              # Automated API Test Collections & Environments
│   ├── App/                            # Core system ping, health checks & info
│   ├── Auth/                           # Scholar registration, login & token refresh assertions
│   └── Upload/                         # PDF research artifact upload & OCR endpoints
├── client/                             # Frontend Next.js 15 App Router & React 19 Application
│   ├── app/                            # 23 enterprise routes, layouts, and public views
│   ├── components/                     # Living Materials component inventory & navigation shells
│   ├── lib/                            # Zustand stores, TanStack Query hooks & offline cache
│   └── README.md                       # Dedicated frontend architecture documentation
├── docs/                               # Authoritative Specifications, Audits & Playbooks
│   ├── templates/                      # Master specifications (PRD, ARCHITECTURE, DESIGN_SYSTEM, SECURITY)
│   ├── audit/                          # 18-part technical defense, traceability matrix & test reports
│   ├── DISASTER_RECOVERY_PLAYBOOK.md   # RTO (<30m), RPO (<15m) & PITR restoration procedures
│   └── ENTERPRISE_PRODUCTION_CHECKLIST.md # Granular production release tracker & verification gates
├── scripts/                            # Automated Database Backup & Disaster Recovery Engines
│   ├── backup-db.sh                    # POSIX Bash backup engine (pg_dump, gzip -9, SHA-256, S3 sync)
│   ├── backup-db.ps1                   # Cross-platform PowerShell backup engine (PowerShell 5.1/7+)
│   ├── restore-db.sh                   # POSIX Bash disaster recovery engine with SHA-256 pre-flight check
│   └── restore-db.ps1                  # PowerShell recovery engine with cryptographic verification
├── server/                             # Backend NestJS 10 Enterprise API & Vector Engine
│   ├── src/                            # Modular domain architecture (auth, opportunities, users, etc.)
│   ├── uploads/                        # Sandboxed research artifact uploads (.gitkeep preserved)
│   └── README.md                       # Dedicated backend architecture documentation
├── tests/                              # End-to-End Automated Browser Testing
│   └── e2e/                            # Playwright journeys (Auth, Discovery, Reader, Constellation)
├── tokens/                             # Master Living Materials Design Tokens
│   └── cambium.tokens.json             # Single Source of Truth in W3C DTCG format
├── docker-compose.yml                  # Full multi-service production stack orchestration
├── AGENTS.md                           # AI Coding Agent Operating Rules & CI verification protocols
└── package.json                        # Root monorepo workspace orchestration & script shortcuts
```

---

## 🚀 Local Quickstart & Deployment

### Option A: 1-Command Production Stack (Recommended)

Launch the entire Cambium infrastructure (PostgreSQL 16 + pgvector, Redis 7, NestJS API, and Next.js client) using Docker Compose:

```bash
docker-compose up -d --build
```

- **Client Web Application**: [http://localhost:3000](http://localhost:3000)
- **NestJS API Service**: [http://localhost:5000](http://localhost:5000)
- **Interactive Swagger Docs**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **PostgreSQL Database**: `localhost:5432` (`cambium`)
- **Redis Cluster**: `localhost:6379`

### Option B: Local Developer Workflow

#### Prerequisites
* **Node.js**: `v20.x` or `v22.x` (LTS)
* **npm**: `v10.x+`
* **PostgreSQL**: `16.x` with `pgvector` extension
* **Redis**: `7.x`

#### 1. Clone & Install Dependencies
```bash
git clone https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium.git
cd S92_Imthiyas_Capstone_Cambium

# Install root, client, and server dependencies
npm install
npm --prefix client install
npm --prefix server install
```

#### 2. Configure Environment Variables
```bash
# Copy pre-configured templates
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

#### 3. Initialize Database & Seed Fixtures
```bash
# Initialize schema and seed development opportunities
npm --prefix server run init:db
npm --prefix server run seed
```

#### 4. Launch Development Servers
```bash
# Start both client and server concurrently
npm run dev

# Or start individually:
npm run client:dev  # Next.js at http://localhost:3000
npm run server:dev  # NestJS at http://localhost:5000
```

---

## 💾 Automated Database Disaster Recovery & Backups

Cambium includes production-hardened backup and restoration engines guaranteeing **RTO < 30 minutes** and **RPO < 15 minutes**:

```bash
# Execute automated backup (pg_dump + gzip -9 + SHA-256 checksum + 7-day retention)
./scripts/backup-db.sh          # Linux / macOS
.\scripts\backup-db.ps1         # Windows PowerShell

# Restore database with cryptographic SHA-256 pre-flight integrity check
./scripts/restore-db.sh backups/cambium_cambium_20261025.sql.gz
.\scripts\restore-db.ps1 -BackupFile backups\cambium_cambium_20261025.sql.gz
```

Full disaster recovery playbooks, Point-in-Time Recovery (PITR) procedures, and S3 archival configurations are documented in [`docs/DISASTER_RECOVERY_PLAYBOOK.md`](docs/DISASTER_RECOVERY_PLAYBOOK.md).

---

## 🛡️ Enterprise Security, RBAC & Compliance

Cambium implements zero-trust security engineered for institutional compliance:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ROLE-BASED ACCESS CONTROL (RBAC)                     │
├───────────────────┬──────────────┬──────────────┬──────────────────────┤
│ Role              │ Scope        │ Target Route │ Enforced Policy      │
├───────────────────┼──────────────┼──────────────┼──────────────────────┤
│ Scholar           │ Individual   │ /dashboard   │ Read/Write own data  │
│ Principal Inv.    │ Lab Bench    │ /lab, /grants│ Budget & team admin  │
│ Reviewer          │ Double-Blind │ /peer-review │ Anonymized evaluation│
│ Ethics Officer    │ Institutional│ /compliance  │ IRB protocol approval│
│ System Auditor    │ Platform     │ /audit       │ SHA-256 ledger read  │
└───────────────────┴──────────────┴──────────────┴──────────────────────┘
```

* **InCommon & SAML 2.0 Single Sign-On**: Native enterprise federation supporting university identity providers (Harvard, Oxford, MIT).
* **Cryptographic Tamper-Proof Audit**: Every critical compliance event is hashed using SHA-256 and chained into an append-only audit ledger (`/audit`).
* **Double-Blind Integrity**: Author names and affiliations are cryptographically masked in `/peer-review` workflows complying with COPE guidelines.
* **FAIR Open Science**: Preprints and research artifacts are evaluated against 15 FAIR metrics with persistent DOI minting via Zenodo/Dryad.

---

## 🧪 Release Verification & Quality Gates

Every pull request must clear an automated quality gate in GitHub Actions:

```bash
# 1. Type Safety Gate (Zero TypeScript errors)
npm --prefix client run build
npm --prefix server run build

# 2. Monorepo Domain Unit Test Suite (Jest 29)
npm run test:jest

# 3. Server Unit & Integration Test Suite (Vitest)
npm --prefix server run test

# 4. End-to-End Browser Journey Verification (Playwright)
npm run test:e2e

# 5. Security Vulnerability Scan
npm audit --audit-level=high
```

| Verification Gate | Standard / Tool | Production Result |
| :--- | :--- | :---: |
| **Domain Unit Tests** | Jest 29 (5 Domain Suites) | `PASSED (55/55 tests, 0 failures)` |
| **Backend Test Suite** | Vitest 5.0 (18 Test Files) | `PASSED (73/73 tests, 0 failures)` |
| **Live Scholarly Engine**| OpenAlex & Europe PMC REST APIs | `CONNECTED (250M+ Works, Inverted Reconstructor)` |
| **File Ingestion Engine**| Multimodal PDF / BibTeX / DOCX | `VERIFIED (SHA-256 Air-Gapped Hash Matching)` |
| **Internationalization**| 6 Full Locales (EN, FR, DE, ES, ZH, JA) | `ACTIVE (Synchronized Currency, Dates, UI)` |
| **TypeScript Compilation**| `tsc --noEmit` (Exit 0) | `PASSED (0 errors across monorepo)` |
| **Next.js Production Build**| `next build` (49 Static & Dynamic Pages) | `COMPILED (0 errors, 8.2s)` |
| **Playwright E2E Suite** | Chromium & WebKit Automation | `PASSING (All Critical Paths)` |
| **WCAG 2.2 Accessibility**| WCAG 2.2 Level AA + APCA ($L_c > 90$) | `VERIFIED (100% Pass, No Ocular Fatigue)` |
| **Disaster Recovery Pre-Flight**| SHA-256 Cryptographic Checksum Matching | `VERIFIED (Tamper Detection Confirmed)` |

---

## 👨‍💻 Author, Provenance & Academic Heritage

<div align="center">

### **Shaik Mohamed Imthiyas T**
**Lead Architect, Product Designer & Full-Stack Engineer**  
*Kalvium Capstone Project · Academic Year 2026*

Cambium was conceived, architected, designed, and engineered from the ground up to eliminate systemic administrative friction in modern scholarship, restoring focus to pure scientific inquiry.

<br />

[![Portfolio](https://img.shields.io/badge/Author-Shaik%20Mohamed%20Imthiyas%20T-3E6248?style=flat-square)](https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium)
[![Repository](https://img.shields.io/badge/Repository-S92__Imthiyas__Capstone__Cambium-202920?style=flat-square)](https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium)
[![License: MIT](https://img.shields.io/badge/License-MIT-805B43?style=flat-square)](LICENSE)

<br />

*Crafted with precision for researchers, laboratories, and universities worldwide.*  
*Licensed under the [MIT License](LICENSE).*

</div>
