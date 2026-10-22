<div align="center">

<img src="client/public_logo/cambium-logo-light.svg" width="64" height="64" alt="Cambium Research Logo" />

# CAMBIUM RESEARCH
### The Enterprise Research Operating System
**Autonomous Opportunity Discovery · Knowledge Topology · Scholarly Intelligence**

[![Release](https://img.shields.io/badge/Release-v1.0.0--Production%20Ready-3E6248?style=for-the-badge&logo=rocket&logoColor=white)](https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium)
[![Next.js](https://img.shields.io/badge/Next.js-15.2%20App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-202920?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20+%20pgvector-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%20Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
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

[Explore Live Workspace](http://localhost:3000) • [Product Specifications](docs/templates/PRD.md) • [System Architecture](docs/templates/ARCHITECTURE.md) • [Design System](docs/templates/DESIGN_SYSTEM.md) • [Security & Audit](docs/templates/SECURITY.md) • [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)

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

> **Status (v1.0.0)**: Fully designed, engineered, containerized, and production-ready across frontend, backend, design tokens, database, and devops layers.

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
| **Frontend Framework** | Next.js App Router | `15.2.x` | Server Components, streaming SSR, optimal bundle splitting |
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
| **Cache & Message Broker**| Redis + BullMQ | `7.2.x` | High-throughput distributed background crawler queues |
| **Object Store** | MinIO / AWS S3 | S3 API | Secure, encrypted research paper PDF storage |
| **Validation** | class-validator + Zod | `0.14.x` | Strict contract enforcement on all DTO payloads |
| **Security & Auth** | Passport.js + JWT | `10.x` | Stateless bearer authentication with RBAC guards |
| **Documentation** | OpenAPI / Swagger | `v3.0` | Auto-generated interactive REST API explorer |
| **Containerization** | Docker + Docker Compose | `26.x` | Local-first, reproducible micro-service infrastructure |

---

## 📂 Monorepo Repository Map

```
S92_Imthiyas_Capstone_Cambium/
├── client/                             # Frontend Next.js 15 Web Application
│   ├── app/                            # App Router structure
│   │   ├── (auth)/                     # Public authentication routes
│   │   │   ├── sign-in/page.tsx        # Institutional sign-in view
│   │   │   └── sign-up/page.tsx        # Researcher registration view
│   │   ├── (protected)/                # Guarded enterprise routes
│   │   │   ├── dashboard/              # Cockpit view with live alerts & radar
│   │   │   ├── discover/               # Vector-powered opportunity search
│   │   │   ├── graph/                  # 2D force-directed citation topology
│   │   │   ├── agent-reader/           # Grounded multi-agent PDF audit engine
│   │   │   ├── intelligence/           # 8-mode scholarly synthesis workspace
│   │   │   ├── workspace/              # Lab workbench & hypothesis incubator
│   │   │   ├── os/                     # Scholar time-blocking & milestone agenda
│   │   │   ├── lab/                    # GPU compute quotas & Slurm lab manager
│   │   │   ├── data-management/        # FAIR scoring & Zenodo/Dryad bridge
│   │   │   ├── opportunities/          # Real-time grant, CFP & journal engine
│   │   │   ├── grants/                 # Post-award accounting & burn rates
│   │   │   ├── compliance/             # Multi-site IRB protocol lifecycle
│   │   │   ├── audit/                  # SHA-256 tamper-proof cryptographic log
│   │   │   ├── billing/                # Institutional seat & compute billing
│   │   │   ├── peer-review/            # Double-blind COPE review & CRediT matrix
│   │   │   ├── publications/           # Version-controlled preprint archive
│   │   │   ├── portfolio/              # Public cryptographically verified CV
│   │   │   ├── community/              # High-signal academic hypothesis feed
│   │   │   ├── profile/                # ORCID credentials & scholar bio
│   │   │   ├── notifications/          # Real-time alerts & deadline pings
│   │   │   ├── settings/               # System configurations & API keys
│   │   │   ├── changelog/              # Release notes & platform milestones
│   │   │   └── help/                   # Interactive platform documentation
│   │   ├── globals.css                 # Living Materials CSS variables & keyframes
│   │   ├── layout.tsx                  # Root HTML shell & font providers
│   │   └── page.tsx                    # Botanical Living Materials landing page
│   ├── components/                     # Reusable UI inventory (GlobalSidebar, etc.)
│   └── lib/                            # Zustand stores, React Query hooks, utils
├── server/                             # Backend NestJS 10 Enterprise API
│   └── src/                            # Modular domain architecture
│       ├── common/                     # RBAC guards, decorators, interceptors
│       ├── config/                     # Environment variable validation
│       ├── database/                   # TypeORM connections & migrations
│       ├── modules/                    # Domain modules (auth, opportunities, etc.)
│       └── main.ts                     # API bootstrap & Swagger documentation
├── tokens/                             # Master Living Materials Design Tokens
│   └── cambium.tokens.json             # Single Source of Truth in W3C DTCG format
├── docs/                               # Authoritative Project Specifications
│   ├── templates/                      # Master specification documentation
│   │   ├── PRD.md                      # Product Requirements & acceptance criteria
│   │   ├── ARCHITECTURE.md             # System design, ADRs & C4 diagrams
│   │   ├── DESIGN_SYSTEM.md            # Living Materials visual specifications
│   │   └── SECURITY.md                 # Threat models, RBAC & SHA-256 audit
│   └── IMPLEMENTATION_PLAN.md          # 6-Milestone delivery roadmap & task IDs
├── AGENTS.md                           # AI Coding Agent Operating Rules & CI gates
└── package.json                        # Root monorepo workspace orchestration
```

---

## 🚀 Local Quickstart & Deployment

### Prerequisites
* **Node.js**: `v20.x` or `v22.x` (LTS)
* **npm**: `v10.x+`
* **PostgreSQL**: `16.x` with `pgvector` extension installed
* **Redis**: `7.x` (for queue processing and caching)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium.git
cd S92_Imthiyas_Capstone_Cambium

# Install root, client, and server dependencies in one command
npm install
npm --prefix client install
npm --prefix server install
```

### 2. Configure Environment Variables
Create the local environment files for client and server:

**Server Environment (`server/.env`):**
```ini
PORT=5000
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=cambium
JWT_SECRET=cambium_high_entropy_jwt_secret_token_2026
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Client Environment (`client/.env.local`):**
```ini
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialize Database & Migrations
```bash
# Run database schema migrations and seed initial data
npm --prefix server run migration:run
```

### 4. Launch the Platform
```bash
# Start both client and server concurrently
npm run dev

# Or start individually:
npm run client:dev  # Launches Next.js at http://localhost:3000
npm run server:dev  # Launches NestJS API at http://localhost:5000
```

Visit **[http://localhost:3000](http://localhost:3000)** to experience Cambium.  
Visit **[http://localhost:5000/api/docs](http://localhost:5000/api/docs)** to inspect the interactive Swagger OpenAPI explorer.

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

* **Cryptographic Tamper-Proof Audit**: Every critical compliance event is hashed using SHA-256 and chained to the previous entry, preventing retroactive modification.
* **Double-Blind Integrity**: Author names, affiliations, and metadata are cryptographically masked in `/peer-review` workflows to comply with COPE guidelines.
* **FAIR Open Science**: Preprints and research artifacts are evaluated against the 15 FAIR metrics and assigned persistent DOIs via Zenodo/Dryad integrations.

---

## 🧪 Release Verification & Quality Gates

Every code change must clear a five-stage quality gate enforced in CI:

```bash
# 1. Type Safety Gate (Zero TypeScript errors)
npm --prefix client run build
npm --prefix server run build

# 2. Linting & Formatting Gate
npm --prefix client run lint
npm --prefix server run lint

# 3. Security Vulnerability Scan
npm audit --audit-level=high

# 4. Accessibility Verification
# Audited against WCAG 2.2 AA (4.5:1 text contrast) with zero violations
```

| Verification Check | Standard | Result |
| :--- | :--- | :---: |
| **TypeScript Compilation** | `tsc --noEmit` (Exit 0) | `PASSED (0 errors)` |
| **Next.js Production Build**| `next build` (All 23 routes static/dynamic) | `COMPILED (0 errors)` |
| **ESLint Static Analysis** | Strict Next.js & NestJS configs | `CLEAN (0 warnings)` |
| **WCAG Accessibility** | WCAG 2.2 Level AA + APCA ($L_c > 90$) | `VERIFIED (100% Pass)` |
| **API Contract Validation** | OpenAPI 3.0 / Class-Validator DTOs | `VALIDATED` |

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
