# Cambium Research — Security Regression Test Inventory

## 1. Automated Security Verification Matrix

| Security Surface | Verification Suite | Assertions |
| :--- | :--- | :--- |
| **Middleware Open-Redirect & CRLF** | `tests/unit/11-frontend-qa-contracts.spec.ts` | Blocks `//evil`, `https://`, `\r`/`\n` injection, expired/malformed JWT cookies |
| **Auth DTO & Mass Assignment** | `server/src/qa/http-contracts.integration.spec.ts` | Global `ValidationPipe` strips/rejects injected `role` fields (`400`) & strips `refreshToken` from JSON body |
| **SSRF, SAML, Admin RBAC & Secrets** | `server/src/security/adversarial-security.spec.ts` | Blocks loopback/metadata IPs, unauthenticated SAML/admin endpoints, weak JWT fallbacks |
| **Cross-Tenant Institutional Isolation** | `server/src/modules/institution/cross-tenant-isolation.spec.ts` | Verifies tenant boundary scoping across organizations |
| **Multi-Actor Workspace Authz & Uploads** | `server/src/qa/authz-upload-resilience.spec.ts` | Verifies invite/accept/revoke IDOR lockdown and MZ/ELF/`<script` upload rejection |
| **Hash-Chained Audit Ledger** | `tests/unit/06-cryptographic-audit-ledger.spec.ts` | Verifies SHA-256 hash chain tamper detection & GDPR JSON-LD structure |
