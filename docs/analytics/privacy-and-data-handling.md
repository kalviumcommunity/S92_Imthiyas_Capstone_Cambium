# Privacy & Research Data Handling in Telemetry

## 1. Zero Confidential Research Data Rule

Analytics and observability stores MUST NEVER contain:
- Uploaded manuscript text, OCR table output, or grant proposal drafts (`documentSnippet`, `extractedText`)
- User AI prompts or raw completions (`messages`, `rawPrompt`, `content`)
- Emails, passwords, JWTs, OAuth tokens, API keys, or PostgreSQL DSN strings

Enforcement occurs in three layers:
1. **`StructuredLoggerService.scrubString` / `scrubObject`**: Regex redaction of `postgresql://...`, `Bearer ...`, `AIza...`, and email addresses, plus banned-key redaction (`[REDACTED]`).
2. **`ProductAnalyticsService.sanitizeProperties`**: Drops `BANNED_PROPERTY_KEYS` and truncates string attributes to `120` chars.
3. **`ClientErrorEvent` intake (`POST /api/v1/observability/client-errors`)**: Calls `sanitizeClientErrorPayload` on client and `recordClientError` on server so query strings, tokens, and email addresses are stripped before persistence.

## 2. Backend Authoritative Events vs. Consent-Gated Client Events

- Core product business transitions (`user.signup.completed`, `workspace.created`, `opportunity.saved`, `document.upload.completed`, `collaboration.invitation.*`) are emitted by backend NestJS services as operational integrity records and are **rejected** if submitted to `POST /api/v1/analytics/client-events`.
- Optional UI interaction events (`trackOptionalClientEvent`) check `hasOptionalAnalyticsConsent()` (`localStorage['cambium-cookie-consent']`) and require `x-cambium-analytics-consent: granted` before persisting.

## 3. Institutional Cohort Anonymity (`k >= 3`)

`GET /api/v1/analytics/dashboards/institution` locks scoping to the authenticated user's `organizationId` (unless `SUPER_ADMIN` audits a target org) and suppresses granular workflow counts (`privacySuppressed: true`, `summary: null`) whenever distinct active researchers `< 3`.
