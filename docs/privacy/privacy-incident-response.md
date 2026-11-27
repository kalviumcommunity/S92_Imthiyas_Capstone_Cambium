# Cambium Research — Privacy Incident & Personal Data Breach Response Procedure

## 1. Trigger Scenarios
- Cross-workspace or cross-user leakage (`403` bypass in workspaces, artifacts, or AI retrieval).
- Unauthorized transmission of `RESTRICTED` or unconsented research documents to Gemini API.
- Misconfigured database RLS policies or unintended storage bucket exposure.
- Improper or incomplete erasure / credential leak (`GEMINI_API_KEY`, `JWT_SECRET`, user passwords).

## 2. Six-Step Operational Response

1. **Detect & Classify**: Triage alert from `audit_logs`, `TelemetryService`, `CircuitBreakerService`, or user grievance submission (`/api/v1/privacy/requests`).
2. **Contain**: Revoke compromised tokens (`RedisService.blacklistJti`), rotate exposed API keys/secrets, disable affected AI or upload feature flag, and isolate misconfigured endpoints.
3. **Preserve Evidence**: Export immutable `audit_logs` slice and verify hash-chain integrity (`AuditService.verifyLedgerChainIntegrity`) without mutating logs.
4. **Scope Affected Data & Stakeholders**: Identify affected user IDs, workspace IDs, institutional organizations, and whether external providers (`Google Gemini`, `Render`, `Supabase`) received payload segments.
5. **Notification Assessment (`[LEGAL_REVIEW_REQUIRED]`)**: Do **not** assume statutory notification timelines without qualified legal counsel; verify commenced obligations under India DPDP Act 2023 / DPDP Rules 2025 (including Data Protection Board / Data Principal rules once in effect) and institutional contractual notice clauses.
6. **Remediate & Document**: Log root cause and corrective verification test in `privacy-incident-register-template.md`.
