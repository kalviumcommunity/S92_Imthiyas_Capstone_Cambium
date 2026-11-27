# AI Coding Agent & RAG Development Guide

## 1. Instruction Precedence & Scope

All human and AI contributors operating in this repository follow [`AGENTS.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/AGENTS.md) as the canonical repository rulebook with this specification hierarchy:

$$\mathbf{PRD.md} \succ \mathbf{ARCHITECTURE.md} \succ \mathbf{DESIGN\_SYSTEM.md} \succ \mathbf{SECURITY.md} \succ \mathbf{Existing\ Code}$$

- Never disable tests, bypass RBAC/ownership checks, hardcode mock data inside production API controllers, or ship unapproved marketing copy/metrics.

---

## 2. AI & RAG Orchestration Safeguards

| Concern | Enforced Implementation Pattern | Source Reference |
| :--- | :--- | :--- |
| **Model & Embedding Routing** | Chat uses `gemini-2.0-flash` -> `gemini-1.5-flash`; embeddings use `gemini-embedding-001` (`768`-dim) | [`AssistantService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/assistant/assistant.service.ts), [`GeminiEmbeddingService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/ai/gemini-embedding.service.ts) |
| **Prompt Injection Defense** | Untrusted snippets bounded to `3,500` chars inside `<untrusted_source_data>...</untrusted_source_data>` | [`AssistantService.chat`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/assistant/assistant.service.ts) |
| **Timeout & Failure Isolation** | External Gemini HTTP calls attach `AbortSignal.timeout(8–10s)` and degrade into deterministic citation fallback rather than failing core workflows | [`AssistantService.chat`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/assistant/assistant.service.ts) |
| **Hybrid Retrieval & Auth** | `pgvector` HNSW cosine distance + `idx_opps_fts` GIN index fused via RRF (`k=60`); parameterized SQL only | [`HybridSearchService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/opportunities/hybrid-search.service.ts) |
