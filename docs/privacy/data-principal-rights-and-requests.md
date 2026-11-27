# Cambium Research — Data Principal Rights & Privacy Request Workflow

## 1. Supported Request Types (`PrivacyRequestType`)

Exposed via `GET / POST /api/v1/privacy/requests`, `/export`, and `/erasure` (all guarded by `JwtAuthGuard`):
- `ACCESS` / `EXPORT`: Self-service personal export (`GET /api/v1/privacy/export`) or logged formal request.
- `CORRECTION`: Profile correction (`PUT /api/v1/users/:id` self-scoped via `assertSelfOrAdmin`) or request submission.
- `WITHDRAWAL`: Immediate withdrawal via `POST /api/v1/privacy/consents` or `PUT /api/v1/privacy/preferences`.
- `ERASURE`: Cascading deletion (`POST /api/v1/privacy/erasure` requiring explicit `"DELETE"` confirmation).
- `GRIEVANCE`: Tracked complaint/grievance record (`POST /api/v1/privacy/requests` with `requestType: 'GRIEVANCE'`).

## 2. Identity Verification & Exception Handling

- **Verification**: Authenticated self-service routes bind operations strictly to `@CurrentUser().id` extracted from cryptographically verified HS256 JWTs (`JwtAuthGuard`), preventing cross-user requests.
- **Unauthenticated / Third-Party Requests**: Must route to `[PRIVACY_CONTACT_EMAIL]` / `[GRIEVANCE_OFFICER_EMAIL]` with manual identity verification before manual review.
- **Exceptions**: Requests affecting institutional grant compliance records, active peer-review ethics records, or immutable security `audit_logs` are logged with explicit `retentionExceptionReason` rather than promising unconditional deletion.
