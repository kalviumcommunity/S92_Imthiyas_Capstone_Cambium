# Cambium Research — Privacy Auditability & Accountability

## 1. Auditable Events & Controls

| Event Category | Storage Mechanism | Logged Attributes | Sensitive Content Excluded |
| :--- | :--- | :--- | :--- |
| **Consent Grants & Withdrawals** | PostgreSQL `consent_records` (`FORCE RLS`, insert-only user policy) | `id`, `userId`, `purpose`, `action`, `noticeVersion`, `noticeLanguage`, `sourceInterface`, `recordedAt` | None required |
| **Rights, Export & Erasure Requests** | PostgreSQL `privacy_requests` | `id`, `userId`, `requestType`, `status`, sanitized `details`, `resolutionSummary`, `retentionExceptionReason`, timestamps | Secrets, uploaded payloads |
| **API State Mutations** | PostgreSQL `audit_logs` (`AuditInterceptor`) | `entityName`, `entityId`, `action`, `userId`, sanitized `fieldKeys`, `redactedFieldCount`, `payloadSha256`, `previousHash`, `currentHash` | `password`, `token`, `documentSnippet`, `messages`, `content`, `abstract`, `text`, `email` |
| **Workspace Membership Changes** | PostgreSQL `project_activity_logs` & `outbox_events` | `projectId`, `actorId`, `action`, `creditRole`, timestamps | Private workspace attachments |

## 2. Anti-Surveillance Boundary
Audit and telemetry mechanisms capture accountability proofs and aggregate latency health (`TelemetryService`), **never** fine-grained keystroke monitoring or passive scraping of private research drafts.
