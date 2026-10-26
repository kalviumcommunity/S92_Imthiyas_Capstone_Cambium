# ADR 0002: Backend Architecture & Service Boundary
**Document ID**: `ADR-CAMBIUM-0002`  
**Status**: `ACCEPTED`  
**Date**: `2026-10-26`  
**Author**: Shaik Mohamed Imthiyas T  
**Component**: Enterprise Application Server (`server/`)  

---

## 1. Context & Problem Statement
Cambium Research requires a robust, strictly typed, and auditable enterprise API. Responsibilities encompass:
1. Dual-token JWT authentication, OAuth 2.0 federation, and 5-tier Role-Based Access Control (RBAC).
2. Research opportunity ingestion, metadata validation, and PostgreSQL `pgvector` similarity queries.
3. Asynchronous BullMQ background worker orchestration for crawler feeds and deadline notifications.
4. Cryptographic SHA-256 append-only compliance logging (`AuditLog`) and Transactional Outbox event dispatching.
5. In-engine AI embedding generation and PDF document chunking.

We must decide whether to build a **modular TypeScript monolith in NestJS 10**, a **polyglot microservices setup (Next.js + FastAPI)**, or rely exclusively on **Next.js Route Handlers**.

---

## 2. Decision Drivers
- **Enterprise Modularity & Maintainability**: Strict dependency injection, controller-service-repository separation, and domain isolation.
- **Language Boundary & Type Safety**: End-to-end TypeScript preventing duplicate DTO definitions between frontend and backend.
- **Operational Overhead & Cost**: A single deployable container rather than orchestrating multi-language runtimes on a student budget.
- **WebSocket & Real-Time Performance**: High-throughput Socket.io clustering via Redis adapter for live lab collaboration.
- **Validation & Security**: Declarative class-validator / class-transformer DTO enforcement preventing SQL injection and parameter tampering.

---

## 3. Options Considered
1. **NestJS 10 Modular Monolith (TypeScript)** *(Selected)*
2. **Next.js Full-Stack Route Handlers (Serverless APIs)**
3. **Dedicated Python FastAPI Microservice + Next.js**
4. **Standalone Express.js Minimal API**

---

## 4. Evaluation & Comparison Matrix

| Evaluation Criterion (Weight) | NestJS 10 Monolith | Next.js Route Handlers | FastAPI + Next.js | Express Minimal |
| :--- | :---: | :---: | :---: | :---: |
| **Domain Modularity (25%)** | 5/5 | 2.5/5 | 4/5 | 2/5 |
| **Type Uniformity (20%)** | 5/5 | 5/5 | 2.5/5 (TS/Python) | 4/5 |
| **Long-Running Workers (15%)** | 5/5 (BullMQ native) | 1/5 (Serverless timeout) | 4.5/5 (Celery) | 4/5 |
| **Security & DTO Validation (15%)** | 5/5 | 3.5/5 | 5/5 (Pydantic) | 2.5/5 |
| **Operational Simplicity (15%)** | 4.5/5 (1 service) | 5/5 (0 extra service) | 2/5 (Dual deploys) | 4.5/5 |
| **WebSocket / SSE Support (10%)** | 5/5 | 2/5 | 4/5 | 4/5 |
| **Weighted Score** | **4.93 / 5.0** | **3.05 / 5.0** | **3.53 / 5.0** | **3.28 / 5.0** |

---

## 5. Decision & Rationale
We selected **NestJS 10 (with NestJS 12 enterprise core)** structured as a **modular monolith** in TypeScript.

### Rationale:
- **Zero Polyglot Overhead**: Implementing AI embedding generation (`GeminiEmbeddingService`), document chunking (`DocumentParserService`), and assistant synthesis directly in TypeScript using Google Generative AI APIs eliminates the operational burden, memory footprint, and network latency of maintaining a separate Python runtime.
- **Native Dependency Injection & Architecture Enforcement**: NestJS organizes the codebase into 14 explicit domain modules (`auth`, `users`, `opportunities`, `bookmarks`, `notifications`, `reader`, `assistant`, `ai`, `ingestion`, `chat`, `email`, `events`, `upload`, `relationships`).
- **Transactional Integrity**: TypeORM repositories run inside ACID transactions alongside cryptographic audit logs and transactional outbox events without distributed two-phase commit overhead.
- **Long-Running Job Queues**: Background ingestion tasks run indefinitely via BullMQ and Redis, impossible in serverless route handlers constrained by 10–30s execution timeouts.

---

## 6. What Was Rejected & Why
- **Polyglot FastAPI Service**: Rejected for current stage. While Python is standard in AI research, Cambium relies on managed foundation model APIs (Google Gemini, OpenAI) rather than hosting PyTorch or HuggingFace models locally. Introducing Python would double container count, CI pipeline duration, and dependency maintenance for zero functional gain.
- **Pure Serverless Route Handlers**: Rejected because academic feed crawling, persistent WebSocket connections, and scheduled deadline cron jobs require a persistent daemon process.

---

## 7. Reconsideration Triggers
A dedicated Python microservice will only be introduced if:
1. Cambium transitions to self-hosting custom open-source embedding models (e.g., BGE-M3 or BioBERT via vLLM / Triton).
2. Heavy scientific matrix operations or BioPython sequence manipulations cannot be efficiently handled via external APIs or WebAssembly.

---

## 8. Authoritative References
- NestJS Architecture Documentation: [https://docs.nestjs.com/](https://docs.nestjs.com/)
- BullMQ Redis Queue Processing: [https://docs.bullmq.io/](https://docs.bullmq.io/)
- Google Gemini Embedding API: [https://ai.google.dev/docs/embeddings_guide](https://ai.google.dev/docs/embeddings_guide)
