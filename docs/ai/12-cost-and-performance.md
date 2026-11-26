# AI Cost, Latency & Token Budget Controls

## Centralized Model Specifications (`AiModelRegistry`)
Every AI operation maps to explicit token, timeout, retry, and cost bounds in `server/src/modules/ai/ai-model-registry.ts`:
- `chat_synthesis`: `gemini-2.0-flash` (fallback `gemini-1.5-flash`), `maxInputTokens: 12,000`, `maxOutputTokens: 1,536`, `timeoutMs: 12,000`, `maxRetries: 1`
- `structured_extraction`: `gemini-2.0-flash`, `temperature: 0.0`, `maxInputTokens: 10,000`, `timeoutMs: 10,000`
- `autocomplete`: `gemini-1.5-flash`, `maxInputTokens: 1,500`, `maxOutputTokens: 256`, `timeoutMs: 2,000`, `maxRetries: 0`
- `embedding`: `gemini-embedding-001` (`768` dimensions, `timeoutMs: 8,000`)

## Pre-Call Truncation & Fallback Cost Protection
- `AiModelRegistry.enforceInputBudget` caps oversized payloads before outbound HTTP dispatch, returning `wasTruncated`, bounded character slice, and estimated token counts (`Math.ceil(len / 4)`).
- `HybridSearchService.fallbackInMemorySemanticSearch` enforces `.take(200)` rather than loading unbounded opportunity rows into process memory.
- Client autocomplete debounces requests and cancels stale in-flight requests via `AbortController`.
