# AI Observability & Telemetry

## Correlation & Telemetry Ledger (`ai_request_telemetry`)
Defined in `server/src/database/migrations/003_ai_rag_and_memory.sql` and `AiRequestTelemetry` entity:
- Records `request_id` (`X-Request-Id` propagation from frontend `apiFetch` -> NestJS controller -> `AssistantService`), `user_id`, `task_type`, `model_used`, `prompt_version`, `estimated_input_tokens`, `estimated_output_tokens`, `estimated_cost_usd`, `latency_ms`, `retrieved_count`, `abstained`, `status`, and `error_code`.
- Enables inspection of abstention rates, degraded fallback frequency (`DEGRADED_FALLBACK` / `OFFLINE_SYNTHESIS` / `ABSTAINED_NO_EVIDENCE`), and per-model cost attribution without logging sensitive raw PDF text or API secrets.
