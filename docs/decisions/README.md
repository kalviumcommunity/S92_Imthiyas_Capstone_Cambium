# Architecture Decision Records (ADRs)
## `docs/decisions/`

This directory documents the key architectural choices, evaluation matrices, trade-offs, and accepted constraints for Cambium.

### Active ADR Directory

All active ADRs are preserved in their authoritative location at [`docs/architecture/adr/`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/README.md):

| ADR ID | Title | Status | Decided Technology |
| :--- | :--- | :--- | :--- |
| **[`ADR 0001`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0001-frontend-framework.md)** | Frontend Framework Architecture | `ACCEPTED` | Next.js 15 App Router + React 19 + TypeScript |
| **[`ADR 0002`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0002-backend-architecture.md)** | Backend API Architecture | `ACCEPTED` | NestJS 10 Modular Monolith (Express/TypeScript) |
| **[`ADR 0003`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0003-primary-database-and-vector-retrieval.md)** | Primary Database & Vector Retrieval | `ACCEPTED` | PostgreSQL 16 + pgvector (1536-dim HNSW Cosine) |
| **[`ADR 0004`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0004-ai-and-rag-orchestration.md)** | AI & Agentic RAG Orchestration | `ACCEPTED` | Hybrid BM25 Inverted Index + Gemini Embeddings |
| **[`ADR 0005`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0005-authentication-authorization-and-rbac.md)** | Authentication, Authorization & RBAC | `ACCEPTED` | JWT HttpOnly Cookies + InCommon SAML 2.0 SSO |
| **[`ADR 0006`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/adr/0006-deployment-infrastructure-and-ci-cd.md)** | Deployment Infrastructure & CI/CD | `ACCEPTED` | Multi-container Docker + Cloud Edge (Render/Vercel) |

### Format & Governance
Every ADR follows the Michael Nygard template: Context, Decision Drivers, Considered Options, Decision Outcome, and Consequences.

