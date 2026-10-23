# 🛡️ Backend Engineering Security Audit
## Threat Modeling, Authentication Boundaries, OWASP Defenses & RBAC
**Author & Lead Architect**: Shaik Mohamed Imthiyas T  
**Document ID**: `AUDIT-BE-SEC-2026-V1`  
**Security Standard**: OWASP Top 10 (2021/2025) & Zero-Trust Architecture

---

## 1. Vulnerability Findings & Verified Remediation Matrix

| Finding ID | CWE / OWASP Category | Vulnerability Description | Remediation Implemented | Verification Evidence | Retest Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **SEC-01** | `CWE-22`: Path Traversal | Arbitrary file overwrite via manipulated filename (`../../etc/passwd`). | `UploadService.sanitizeFilename()` enforces basename extraction and strips all null bytes `\0`, `../`, and `..\`. | Unit tested in `upload.service.spec.ts` (4 tests) | `PASS` |
| **SEC-02** | `CWE-434`: File Upload | Execution of uploaded server-side scripts (`.exe`, `.sh`, `.php`, `.js`). | Whitelist validation rejecting script extensions and enforcing `.pdf`, `.docx`, `.bib`, `.csv`, `.tex`. | Unit tested in `upload.service.spec.ts` (4 tests) | `PASS` |
| **SEC-03** | `CWE-400`: DoS via Memory | Large uploaded payloads exhausting Node.js heap memory. | 50MB ceiling enforced in Multer pipe throwing `PayloadTooLargeException` prior to disk writing. | Unit tested in `upload.service.spec.ts` (1 test) | `PASS` |
| **SEC-04** | `CWE-384`: Session Fixation | Replay or hijacking of compromised refresh tokens. | Rotating refresh tokens stored in HttpOnly, SameSite=Strict cookies with Redis revocation blacklists. | Unit tested in `auth.service.spec.ts` (4 tests) | `PASS` |
| **SEC-05** | `CWE-362`: Race Condition | Concurrent submissions exceeding finite funding limits on research grants. | Redis Redlock distributed mutex combined with PostgreSQL `SELECT FOR UPDATE` inside serializable transactions. | Unit tested in `redlock.service.spec.ts` (5 tests) | `PASS` |
| **SEC-06** | `CWE-287`: SAML Expired Replay | Replaying captured SAML assertion tokens. | `SamlService.parseSamlAssertion()` validates `NotOnOrAfter` boundary condition and rejects stale assertions. | Unit tested in `saml.service.spec.ts` (6 tests) | `PASS` |
| **SEC-07** | `CWE-79`: Cross-Site Scripting | Injected script tags inside Markdown abstracts and user bio descriptions. | Helmet CSP headers set in `main.ts` + DOMPurify frontend sanitization. | Inspected HTTP headers (`nosniff`, `DENY`) | `PASS` |

---

## 2. Authentication vs. Authorization Boundaries

1. **Authentication (Who You Are)**:
   - Handled at edge by `JwtAuthGuard` or `SamlService`.
   - Validates Argon2id/Bcrypt password hash, Google OAuth ID Token, or SAML 2.0 XML Assertion.
   - Issues short-lived 15-minute access token and 7-day rotating refresh token.
2. **Authorization (What You Can Do)**:
   - Handled by `RolesGuard` checking `@Roles('SCHOLAR', 'REVIEWER', 'ADMIN')`.
   - Resource-level ownership checks: scholars cannot mutate proposals or bookmarks belonging to another scholar ID (defending against IDOR/BOLA).
   - Administrative endpoints (`POST /api/opportunities/bulk`, `DELETE /api/opportunities/:id`) restricted strictly to the `ADMIN` role.

---

<div align="center">
  <sub>Backend Security Audit · Document ID: AUDIT-BE-SEC-2026-V1 · Verified for Academic Year 2026</sub>
</div>
