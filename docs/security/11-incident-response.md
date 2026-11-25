# Incident Response & Security Operations Runbook (`11`)

**Program**: Cambium Research Security Hardening Program

---

## 1. Severity Classification
- **SEV-1 (Critical)**: Confirmed cross-tenant data exposure, unauthenticated admin access, leaked database/JWT signing keys, or active RCE. Immediate response (< 15 min).
- **SEV-2 (High)**: Single-account compromise, XSS, SSRF attempt, or high-severity dependency CVE. Response (< 2 hours).
- **SEV-3 (Medium/Low)**: Blocked probe spikes, expired config drift, minor policy hardening. Next sprint window.

## 2. Containment & Eradication Steps
1. **Session Invalidation**: Rotate `JWT_SECRET` (invalidates active sessions globally) or revoke affected user refresh tokens in Redis (`jwt:*` / user blacklist).
2. **Audit Log Preservation**: Export immutable SHA-256 hash-chained records from `audit_logs` via `SuperAdmin`/`ComplianceOfficer` audit endpoint before pruning or remediation.
3. **Database & API Containment**: Temporarily tighten `CORS_ORIGIN` or pause compromised cron/ingestion triggers while deploying hotfix.
4. **Post-Incident Review**: Record root cause in `12-security-remediation-register.md` and add a reproducing test case to `adversarial-security.spec.ts`.
