# Structured Application Logging Standard

**Service:** `StructuredLoggerService` (`server/src/common/logging/structured-logger.service.ts`)

## JSON Envelope Schema

Every operational log emitted by Cambium analytics, AI telemetry, and client-error boundaries conforms to structured JSON fields:

```json
{
  "timestamp": "2026-11-27T10:30:00.000Z",
  "severity": "INFO | WARN | ERROR | DEBUG",
  "service": "cambium-api",
  "env": "production | development | test",
  "operation": "ai.chat | client.route_error | analytics.record_failed",
  "requestId": "uuid",
  "traceId": "hex",
  "safeActorHash": "16-char sha256 prefix",
  "durationMs": 42,
  "errorCategory": "optional error class",
  "message": "scrubbed string <= 500 chars",
  "context": { "...": "recursively scrubbed <= depth 3" }
}
```

## Redaction & Pseudonymization Rules

- **`actorId`** is hashed via `SHA-256('cambium-actor:' + actorId).slice(0, 16)` into `safeActorHash` so engineers can correlate single-session faults without storing raw user UUIDs or emails in log streams.
- **Secret patterns** (`postgresql://...`, `Bearer ...`, `AIza...`, email addresses) and sensitive keys (`password`, `token`, `secret`, `documentSnippet`, `rawPrompt`, `content`, `abstract`) are automatically masked.
