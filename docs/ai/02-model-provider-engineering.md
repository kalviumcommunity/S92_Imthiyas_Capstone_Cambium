# Model & Provider Engineering Specification (`02`)

**Program**: Cambium Research Principal AI Engineering Program

---

## 1. Centralized Model Registry (`server/src/modules/ai/ai-model-registry.ts`)
| Task | Primary Model | Fallback Model | Version Tag | Max Input Tokens | Max Output | Timeout |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `chat_synthesis` | `gemini-2.0-flash` | `gemini-1.5-flash` | `2026-04-chat-v1` | `12,000` | `1,536` | `12,000ms` |
| `structured_extraction` | `gemini-2.0-flash` | `gemini-1.5-flash` | `2026-04-extract-v1` | `10,000` | `1,024` | `10,000ms` |
| `research_classification` | `gemini-1.5-flash` | — | `2026-04-classify-v1` | `4,000` | `256` | `5,000ms` |
| `autocomplete` | `gemini-1.5-flash` | Deterministic corpus | `2026-04-autocomplete-v1` | `1,500` | `256` | `2,000ms` |
| `embedding` | `gemini-embedding-001` | SHA-256 `768`-d L2 | `v1-768d` | `2,048` | `N/A` | `6,000ms` |
| `rerank` | `gemini-1.5-flash` | — | `2026-04-rerank-v1` | `6,000` | `512` | `5,000ms` |

## 2. Prompt Lifecycle & Provider Adapter
- **Versioned Prompts (`server/src/modules/ai/ai-prompt-registry.ts`)**: All system instructions and RAG templates live in `AiPromptRegistry` (`grounded_rag_qa@1.1.0`, `autocomplete_copilot@1.0.0`, `autocomplete_search@1.0.0`) enforcing `<untrusted_source_data>` XML delimiters and explicit abstention rules.
- **Provider Client (`server/src/modules/ai/gemini-provider.service.ts`)**: Enforces `AbortController` timeouts, retriable status handling (`429`, `502`, `503`, `504`), fallback routing, token/cost estimation (`estimateCostUsd`), and redacted error codes (`API_KEY_UNCONFIGURED`, `PROVIDER_TIMEOUT`, `PROVIDER_RATE_LIMIT`, `PROVIDER_ERROR`).
