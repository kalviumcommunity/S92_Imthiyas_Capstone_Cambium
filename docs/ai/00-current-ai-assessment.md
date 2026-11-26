# Current AI System Reconnaissance & Assessment (`00`)

**Program**: Cambium Research Principal AI Engineering Program  
**Audit Scope**: Next.js 16 Client (`client/lib/ai/`, `client/components/ai/`) + NestJS 10 Backend (`server/src/modules/{ai,assistant,reader,opportunities}/`) + PostgreSQL 16 + `pgvector` (`server/src/database/schema.sql`).

---

## 1. Capability Classification Matrix

| Capability | Current Location | Observed State | Verdict / Priority |
| :--- | :--- | :--- | :--- |
| **Embedding Generation (`768`-dim)** | `server/src/modules/ai/gemini-embedding.service.ts` | Calls Gemini `gemini-embedding-001` with SHA-256 deterministic L2-normalized offline fallback. Lacks HTTP timeout (`AbortController`), central config, and embedding version metadata. | **Implemented but Unverified (P1)** |
| **Autocomplete & Copilot** | `server/src/modules/ai/llm-autocomplete.service.ts`, `ai-autocomplete.controller.ts` | Protected by `JwtAuthGuard + NetworkRateLimiterGuard`; `2000ms` timeout; hardcoded `gemini-1.5-flash` string; client `useAiAutocomplete.ts` omits `Authorization` header (triggers `401` -> fallback). | **Partially Implemented (P0)** |
| **Opportunity Hybrid Search** | `server/src/modules/opportunities/hybrid-search.service.ts` | Combines HNSW cosine `<=>` and `ILIKE` via RRF (`k=60`). **Defect**: interpolates `'${vectorLiteral}'::vector` directly in `addSelect(...)` and runs unbounded `getMany()` on fallback. | **Partially Implemented / Vulnerable SQL (P0)** |
| **Document Parsing & Chunking** | `server/src/modules/reader/document-parser.service.ts` | Chunks text by headings (~1200 chars) & calls batch embeddings in memory. **Defect**: zero PostgreSQL persistence (`document_chunks` missing) and no authorization metadata/RLS. | **Partially Implemented (P0)** |
| **RAG Assistant Chat & Streaming** | `server/src/modules/assistant/assistant.service.ts`, `client/lib/ai/rag-engine.ts`, `GlobalRagAssistant.tsx` | **Split-Brain**: `GlobalRagAssistant` ignores backend `/api/v1/assistant/chat`, querying a hardcoded 10-item client corpus and optionally using `NEXT_PUBLIC_GEMINI_API_KEY` from the browser. Backend `verifyEligibility` returns fake `0.94` confidence and `extractDeliverables` ignores input text. | **Mocked / Split-Brain (P0)** |
| **Citation Verification & Abstention** | None (`assistant.service.ts` attaches search results without verifying claim citations) | Missing server-side citation ID/URL/DOI allowlist validation and explicit insufficient-evidence abstention rules. | **Missing (P0)** |
| **Conversation Memory & AI Telemetry** | None | Zero `ai_conversations`, `ai_messages`, or `ai_request_telemetry` persistence in `schema.sql`. | **Missing (P1)** |
| **Executable AI Evaluation Harness** | None (`gemini-embedding.service.spec.ts`, `llm-autocomplete.service.spec.ts` only test mocks) | Missing golden dataset, retrieval metrics (`Recall@K`, `Precision@K`, `MRR`, `NDCG@K`), citation validation, cross-tenant leakage, and injection evaluation tests. | **Missing (P0)** |

---

## 2. Prioritized Remediation Roadmap
1. **Sprint 1**: Centralize `AiModelRegistry`, versioned `AiPromptRegistry`, and `GeminiProviderService` (timeouts, bounded retries, token/cost estimation).
2. **Sprint 2**: Author `003_ai_rag_and_memory.sql`, TypeORM entities (`DocumentChunk`, `AiConversation`, `AiMessage`, `AiRequestTelemetry`), SQL parameterization fix in `HybridSearchService`, and authorization-first `DocumentRetrievalService`.
3. **Sprint 3**: Implement `CitationVerifierService`, `AiToolRegistry` (bounded, real extraction tools replacing `0.94` mocks), conversation persistence, and abstention guarantees in `AssistantService`.
4. **Sprint 4**: Route `GlobalRagAssistant` and `useAiAutocomplete` cleanly through NestJS `apiFetch` endpoints without client-side Gemini keys.
5. **Sprint 5**: Build deterministic `ai-evaluation.harness.spec.ts`, golden dataset, full `docs/ai/00..15` series, and execute full verification gates.
