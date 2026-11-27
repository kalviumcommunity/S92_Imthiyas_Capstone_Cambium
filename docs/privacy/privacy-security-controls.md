# Cambium Research — Privacy-Centric Application Security Controls

## 1. Access, Storage & Exposure Defenses

- **Database Row-Level Security (`001_supabase_rls_lockdown.sql` + `002_privacy_governance_tables.sql`)**: Enables `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY` on user identities, projects, institutional proposals, `user_privacy_preferences`, `consent_records`, and `privacy_requests`.
- **RBAC & Admin Separation**: `SuperAdmin` / `ComplianceOfficer` roles guard diagnostic and user-listing endpoints (`/api/database/diagnostics`, `/api/v1/users`). Operational telemetry spans (`TelemetryService`) record HTTP method/route and trace IDs without capturing document bodies.
- **Upload Storage Isolation**: `UploadController` enforces `JwtAuthGuard`, `ParseUUIDPipe`, magic-byte verification, `filePath` stripping from listings, and `X-Content-Type-Options: nosniff` + `Cache-Control: private, no-store` on downloads.
- **Audit Log Sanitization**: `AuditInterceptor` redacts confidential text/prompt/PII fields prior to SHA-256 hash chaining.
- **Account Decommissioning Revocation**: `PrivacyService.executeAccountErasure` blacklists active JWT `jti` values via Redis and clears user-prefixed multi-tier cache entries.
