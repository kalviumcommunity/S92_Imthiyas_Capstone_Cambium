# Cambium Target AI, RAG & Agent Architecture (`01`)

**Program**: Cambium Research Principal AI Engineering Program

---

## 1. Layered Architectural Boundaries
- **Frontend Layer (`Next.js 16`, `client/`)**: Thin presentation and authenticated transport (`apiFetch`) calling NestJS `/api/v1/assistant/*` and `/api/v1/ai/*`. Zero provider secrets (`NEXT_PUBLIC_GEMINI_API_KEY` deprecated) and zero direct browser calls to LLM vendor endpoints.
- **Orchestration & Security Layer (`NestJS 10`, `server/`)**: Enforces `JwtAuthGuard`, `SubscriptionGuard`, `NetworkRateLimiterGuard`, tool allowlists (`AiToolRegistry`), token/cost budgets (`AiModelRegistry`), versioned system prompts (`AiPromptRegistry`), and post-generation verification (`CitationVerifierService`).
- **Authorized Retrieval Layer (`PostgreSQL 16 + pgvector`)**: Enforces caller ACL predicates (`visibility = 'PUBLIC'` OR `owner_id` OR accepted workspace membership OR tenant `organization_id`) inside SQL **prior** to HNSW cosine similarity / lexical GIN scoring.
- **Provider Adapter (`GeminiProviderService`)**: Encapsulates external HTTP calls (`generateContent`, `embedContent`) with strict `AbortController` timeouts, exponential backoff retries (`429`/`5xx`), normalized error states, and deterministic offline fallbacks that never fabricate citations.

## 2. Synchronous vs. Asynchronous Boundaries
- **Synchronous**: Interactive autocomplete (`<= 2000ms` budget), query embedding + authorized top-K hybrid retrieval, grounded assistant synthesis, conversation history read/delete.
- **Asynchronous**: Catalog ingestion (`GrantsGov`, `OpenAlex`, `arXiv`, `Crossref`, `DOAJ`), batch document re-embedding, and background OCR extraction via `PdfOcrService` / `QueueService`.
