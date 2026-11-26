# AI Testing Strategy

Cambium verifies AI reliability across four automated tiers:
1. **Model & Prompt Unit Tests (`ai-registry-provider.spec.ts`)**: Token truncation budgets, cost estimation, provider timeout/429 handling, and `<untrusted_source_data>` wrapping.
2. **PGVector & ACL Retrieval Tests (`document-retrieval.spec.ts`)**: Content-hash idempotent ingestion, SQL parameter binding (`:vectorLiteral::vector`), SHA-256 deduplication, and ACL `WHERE` ordering before similarity ranking.
3. **Grounding, Security & Memory Tests (`assistant-grounding.spec.ts`, `adversarial-security.spec.ts` Scenario 7)**: CitationVerifier hallucination stripping, bounded `AiToolRegistry` allowlist, real deliverable/eligibility extraction, cross-user conversation ownership enforcement, and guard ordering (`JwtAuthGuard -> SubscriptionGuard`).
4. **Client Boundary & Evaluation Harness (`12-client-ai-integration.spec.ts`, `08-client-rag-engine.spec.ts`, `ai-evaluation.harness.spec.ts`)**: Browser secret elimination, authenticated `/assistant/chat` routing, offline RAG personas, and repeatable golden-dataset IR/safety metrics.
