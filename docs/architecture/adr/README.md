# Architecture Decision Records (ADR) Index
**Cambium — AI-Powered Research Opportunity Discovery & Intelligence Platform**  
**Repository**: `S92_Imthiyas_Capstone_Cambium`  
**Current Architecture Version**: `2.0.0`  
**Governance**: Lead Architect — Shaik Mohamed Imthiyas T  

---

## 1. Overview & Purpose
This directory contains the formal, binding **Architecture Decision Records (ADRs)** for the Cambium Research Platform. Each record documents a critical architectural choice, its context, evaluated alternatives, decision drivers, consequences, risks, and conditions for reconsideration.

All coding agents (Antigravity, Claude Code, GitHub Copilot) and human contributors **MUST** respect these records as binding constraints. Code changes contradicting these records are strictly prohibited without an approved superseded ADR.

---

## 2. Active Architecture Decision Records

| ADR ID | Decision Title | Status | Date Accepted | Primary Component | Key Rationale Summary |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **[ADR 0001](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0001-frontend-framework.md)** | **Frontend Framework & Rendering Architecture** | `ACCEPTED` | 2026-10-26 | `client/` (UI) | Selected **Next.js 15 (App Router)** + **React 19** + **Tailwind CSS** for hybrid SSR/CSR, public scholarly SEO, and isolated client workspaces. |
| **[ADR 0002](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0002-backend-architecture.md)** | **Backend Architecture & Service Boundary** | `ACCEPTED` | 2026-10-26 | `server/` (API) | Selected **NestJS 10 Modular Monolith** in TypeScript, avoiding unnecessary polyglot Python microservices while keeping AI embedding generation in-engine. |
| **[ADR 0003](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0003-primary-database-and-vector-retrieval.md)** | **Primary Database & Vector Retrieval Architecture** | `ACCEPTED` | 2026-10-26 | `database/` (Store) | Selected **PostgreSQL 16 + pgvector (HNSW Indexing)** as Single Source of Truth (SSOT), eliminating two-database split-brain and recurring vector SaaS costs. |
| **[ADR 0004](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0004-ai-and-rag-orchestration.md)** | **AI Intelligence & RAG Architecture** | `ACCEPTED` | 2026-10-26 | `modules/ai/` | Selected **Direct In-Engine Deterministic RAG** with Google Gemini embeddings & SHA-256 fallback, enforcing line-level citations over non-deterministic agent loops. |
| **[ADR 0005](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0005-authentication-authorization-and-rbac.md)** | **Authentication, Authorization & Cryptographic Auditing** | `ACCEPTED` | 2026-10-26 | `security/` (Auth) | Selected **Dual-Token JWT in HTTP-Only Cookies**, Google/ORCID OAuth federation, 5-tier RBAC matrix, and append-only SHA-256 audit logs. |
| **[ADR 0006](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0006-deployment-infrastructure-and-ci-cd.md)** | **Containerized Deployment Infrastructure & CI/CD Pipeline** | `ACCEPTED` | 2026-10-26 | `devops/` (Infra) | Selected **Multi-Stage Docker Compose** + **GitHub Actions CI/CD Quality Gates** ensuring zero cloud vendor lock-in and sovereign academic self-hosting. |

---

## 3. ADR Life-Cycle & Status Definitions
- `PROPOSED`: Under architectural review; not yet binding.
- `ACCEPTED`: Enforced architectural standard across the repository.
- `REJECTED`: Formally evaluated and rejected with documented justification.
- `SUPERSEDED`: Replaced by a subsequent, numbered ADR (e.g., ADR 0007 supersedes ADR 0002).
- `DEPRECATED`: Retained for historical record, but no longer actively enforced.

---

## 4. Master Architectural Reference
For the complete technical strategy, comparative scoring rubrics, real-world case studies (Notion, Vercel, Perplexity), and phased implementation roadmap, refer to the master document:
📖 **[`docs/architecture/technology-strategy-and-stack.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/technology-strategy-and-stack.md)**
