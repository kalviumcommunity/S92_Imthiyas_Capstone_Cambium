# Technical Viva & Live Demonstration Script

## 1. Live Feature Walkthrough Order (Working Flows First)

1. **Landing & Design System (`/`):** Show SSR/client hybrid hydration, dynamic showcase splitting, Living Materials palette, and navigation anchors.
2. **Health & OpenAPI Proof (`/health`, `/api/docs`):** Demonstrate live readiness check and generated Swagger documentation directly from active NestJS controllers.
3. **Hybrid Grant Search (`/opportunities`):** Execute a query showcasing `GET /api/v1/research-opportunities/hybrid` fusing `pgvector` HNSW cosine distance + PostgreSQL `idx_opps_fts` GIN index via RRF (`k=60`), plus bounded pagination (`limit=25, max=100`).
4. **Authentication & Cross-User Isolation (`/sign-up` -> `/bookmarks` -> `/workspace`):** Show dual-token auth, persistent bookmarks, collaborative workspace creation, and verified `401`/`403` isolation between two accounts.
5. **Cryptographic Audit Ledger (`/audit`) & Resilience Fallbacks:** Demonstrate SHA-256 hash chain verification and explain graceful fallback when `GEMINI_API_KEY` or Redis is absent.

---

## 2. Evaluator Technical Q&A (Grounded in Actual Decisions)

| Question | Decision & Trade-Off Explanation | Scaling Threshold |
| :--- | :--- | :--- |
| **Why Next.js + NestJS monolith instead of microservices?** | TypeScript across client/server gives shared strict validation, fast iteration for a 1–N person capstone team, and avoids network serialization / orchestration overhead. | Extract a separate background worker service only when ingestion/OCR CPU contends with interactive API `p95`. |
| **Why PostgreSQL + `pgvector` instead of Pinecone/Elasticsearch?** | Single transactional ACID store joins vectors, relational grants, RBAC, and `outbox_events` together, eliminating sync drift and recurring external vector SaaS bills. | Consider dedicated search infrastructure or read replicas only if corpus scales well past millions of documents or sustained read CPU `> 70%`. |
| **How does AI avoid prompt injection & hanging requests?** | Untrusted document snippets are capped (`<= 3,500` chars) inside `<untrusted_source_data>` tags; Gemini `fetch` calls use `AbortSignal.timeout(8–10s)` and degrade to offline citation fallback. | Add token budget enforcement and dedicated queue workers as active concurrent AI volume increases. |
| **How are tests & quality enforced?** | Dual Jest (`tests/unit/`) + NestJS Vitest (`server/`) + Playwright E2E + `scripts/docs/verify-docs.mjs` verify logic, contracts, security guards, and docs without flaky claims. | Re-run full smoke/load benchmarks on staging prior to widening pilot cohorts above `50` active users. |
