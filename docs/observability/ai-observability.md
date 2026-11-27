# AI & RAG Observability Specification

**Runtime Service:** [`AiObservabilityService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/analytics/ai-observability.service.ts)  
**Offline Eval Dataset:** [`ai-eval-dataset.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/analytics/ai-eval-dataset.ts)

## 1. Captured AI Telemetry (`ai_telemetry_events`)

Every `AssistantService.chat` and `GeminiEmbeddingService.generateEmbedding` execution records:
- `provider` (`gemini` vs `local-fallback`), `model`, `requestType` (`chat` \| `embedding`)
- `inputTokensEst` & `outputTokensEst` (`Math.ceil(chars / 4)`)
- `estimatedCostUsd` (billed at `$0.00` for offline/deterministic fallbacks; public reference rates for live Gemini calls)
- `latencyMs`, `retrievalDurationMs`, `chunksRetrieved`, `citationCount`
- `toolSuccessCount`, `toolFailureCount`, `outcome` (`SUCCESS` \| `FALLBACK` \| `FAILURE`)
- `aiPrivacyMode` (zero prompt text, snippets, or completion bodies stored)

## 2. Versioned Retrieval Quality Benchmark (`2026-11.v1`)

`runDeterministicRagEvaluation()` scores 5 reproducible scholarly test cases (including an unrelated off-topic abstention check) on **Recall@3**, **Precision@3**, **Citation Completeness**, and **Abstention Accuracy** with zero live LLM token expenditure during CI.
