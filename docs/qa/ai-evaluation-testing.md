# Cambium Research — AI, RAG & Embedding Evaluation Testing

## 1. Existing Verification Suites Referenced

1. **Client Scholarly RAG & Persona Grounding (`tests/unit/08-client-rag-engine.spec.ts`)**:
   - Validates semantic retrieval alignment across scholarly grants/papers, grounded citation extraction, persona switching (Methodology Auditor, Statistical Rigor, Reproducibility Engine), and honest no-match fallbacks.
2. **Gemini Embedding Pipeline (`server/src/modules/ai/gemini-embedding.service.spec.ts`)**:
   - Validates 768-dimension vector normalization, batch behavior, and graceful degradation when API keys or network providers are absent.
3. **LLM Autocomplete (`server/src/modules/ai/llm-autocomplete.service.spec.ts`)**:
   - Validates structured suggestion constraints and prompt/response safety.

## 2. QA Quality Invariants

- All AI tests use deterministic local fixtures or mocked HTTP responses (`never` hitting live commercial LLM endpoints inside automated PR gates).
- Any AI feature exposing citations must degrade transparently when evidence chunks fall below similarity thresholds rather than inventing synthetic citations.
