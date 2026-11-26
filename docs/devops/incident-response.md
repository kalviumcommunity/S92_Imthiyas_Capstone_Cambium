# Incident Response Runbook (Phase 12)

## 1. Severity Classification
- **SEV-1**: Complete production outage, active secret compromise, cross-tenant data leak, or major unrecoverable DB failure.
- **SEV-2**: Core workflow unavailable (e.g. `/api/v1/opportunities` returning `HTTP 500`, auth failing).
- **SEV-3**: Degraded auxiliary feature (`redis: degraded`, Gemini quota exceeded -> deterministic fallback active).
- **SEV-4**: Non-blocking cosmetic or documentation defect.

## 2. Scenario Playbooks (Detect -> Contain -> Recover -> Verify)
- **Backend / Frontend Outage**: Check Vercel status & Render logs; verify `/api/v1/health/liveness`; rollback recent deployment if startup fails after valid build.
- **Database Outage / Connection Saturation**: Inspect `/api/v1/health/readiness` (`503`); verify Supabase/Render DB status, connection pool count (`DB_POOL_MAX`), and run `db:migrate:status`.
- **Route Returning HTTP 500 (e.g. `/api/v1/opportunities`)**: Inspect Render runtime exception log with correlation ID (`X-Request-Id`), verify schema columns match TypeORM entities, apply missing SQL migration under backup protection.
- **Auth Outage**: Verify `JWT_SECRET`, Google OAuth client ID, CORS allowlist, and clock skew.
- **Secret Exposure**: Immediately revoke/rotate affected key, audit access logs, purge exposed env/history via `gitleaks` check, and record incident.
- **AI Provider Outage / Cost Spike**: Verify `aiProvider: degraded_offline` fallback continuity, disable `GEMINI_API_KEY` cleanly to force deterministic abstention without breaking workspace UX.
- **Storage Failure / Suspicious Access**: Restrict write permissions, inspect SHA-256 `audit_logs`, revoke compromised tokens.
