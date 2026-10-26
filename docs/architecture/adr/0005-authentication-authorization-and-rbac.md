# ADR 0005: Authentication, Authorization & Cryptographic Auditing
**Document ID**: `ADR-CAMBIUM-0005`  
**Status**: `ACCEPTED`  
**Date**: `2026-10-26`  
**Author**: Shaik Mohamed Imthiyas T  
**Component**: Security, Identity & Compliance (`server/src/modules/auth/`, `server/src/database/entities/audit-log.entity.ts`)  

---

## 1. Context & Problem Statement
Academic institutions, university ethics review boards (IRBs), and funding bodies operate under stringent compliance mandates (FERPA, GDPR, HIPAA, and federal research security standards). Cambium Research must provide:
1. Seamless scholar authentication via email/password and federated academic identities (Google OAuth, ORCID).
2. Defense against session hijacking and XSS token theft.
3. Strict Role-Based Access Control (RBAC) across five institutional roles.
4. Cryptographically verifiable, non-repudiable audit logs for data exports, IRB protocol changes, and grant allocations.

We must decide on our token architecture, session management strategy, and audit logging mechanism.

---

## 2. Decision Drivers
- **OWASP ASVS Level 2 Compliance**: Preventing token storage in browser `localStorage` where XSS can exfiltrate credentials.
- **Academic Identity Interoperability**: Support for verified ORCID iDs (`0000-000x-xxxx-xxxx`) and Google academic accounts.
- **Granular RBAC Enforcement**: Controller-level guards enforcing role constraints before database interaction occurs.
- **Tamper-Evident Governance**: Compliance officers must be able to verify that audit records have not been altered or deleted by rogue administrators.

---

## 3. Options Considered
1. **Dual-Token JWT (HTTP-Only Cookies) + 5-Tier RBAC + SHA-256 Audit Log** *(Selected)*
2. **Third-Party Identity SaaS (Clerk / Auth0)**
3. **Traditional Server-Side Session IDs in Redis**
4. **Single Indefinite JWT in LocalStorage**

---

## 4. Evaluation & Comparison Matrix

| Evaluation Criterion (Weight) | Dual JWT + HTTP-Only Cookies | Third-Party Auth0 / Clerk | Redis Session IDs | Single JWT LocalStorage |
| :--- | :---: | :---: | :---: | :---: |
| **Security & XSS Immunity (30%)** | 5/5 (HTTP-only, Secure) | 5/5 | 5/5 | 1/5 (Vulnerable to XSS) |
| **Cost & User-Scale Limits (20%)** | 5/5 (Zero cost) | 1.5/5 ($$$ per MAU) | 4/5 | 5/5 |
| **Academic ORCID Integration (20%)** | 5/5 (Direct OAuth) | 3/5 (Custom Enterprise) | 4.5/5 | 3/5 |
| **Audit Log Tamper-Evidence (15%)** | 5/5 (SHA-256 Merkle link) | 2/5 (Vendor black box) | 3/5 | 1/5 |
| **Stateless API Verification (15%)** | 4.5/5 (Cryptographic check) | 4/5 | 2.5/5 (DB hit per req) | 5/5 |
| **Weighted Score** | **4.93 / 5.0** | **3.33 / 5.0** | **4.08 / 5.0** | **2.65 / 5.0** |

---

## 5. Decision & Rationale
We selected a **Self-Contained Dual-Token JWT Architecture** with **HTTP-Only Cookies**, **Google/ORCID OAuth federation**, **5-tier RBAC Guards**, and an **Append-Only SHA-256 Audit Log Entity**.

### 5.1 Token Life-Cycle & Cookie Flags
- **Access Token**: Short-lived (15 minutes), signed with HMAC-SHA256, carrying user ID and assigned role.
- **Refresh Token**: Long-lived (7 days), stored in an encrypted database table with automatic rotation upon use.
- **Cookie Security Configuration**:
  ```typescript
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/',
  });
  ```
  This eliminates XSS token exfiltration, as JavaScript running in the browser cannot read HTTP-only cookies.

### 5.2 Five-Tier Role-Based Access Control (RBAC)
Enforced in [`server/src/modules/auth/guards/roles.guard.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/auth/):
1. `PI` (Principal Investigator): Full authority over lab rosters, budget burn rates, grant applications, and IRB submissions.
2. `Researcher`: Literature discovery, paper reading, dataset uploads, and collaborative bookmarks.
3. `Fellow`: Postdoctoral grant discovery, early-career awards, and peer review submissions.
4. `ComplianceOfficer`: Read/audit access to all IRB protocols, consent documents, and immutable audit logs.
5. `ExternalReviewer`: Blinded access to assigned manuscripts and CRediT authorship evaluation.

### 5.3 Cryptographic SHA-256 Audit Log
Implemented in [`server/src/database/entities/audit-log.entity.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/database/entities/audit-log.entity.ts). Every sensitive administrative event writes:
```typescript
hash = SHA256(`${previousHash}:${timestamp}:${userId}:${action}:${resourceId}:${JSON.stringify(payload)}`);
```
This forms an unbroken cryptographic chain. Any manual tampering with a database record alters subsequent hashes and triggers immediate alerts during automated compliance verification.

---

## 6. What Was Rejected & Why
- **Clerk / Auth0 SaaS**: Rejected due to restrictive free tiers (often capping at 10,000 MAUs) and enterprise-paywalling for SAML/Shibboleth university identity federation.
- **LocalStorage JWT Storage**: Categorically rejected per OWASP ASVS guidelines due to severe XSS vulnerability.

---

## 7. Authoritative References
- OWASP ASVS v4.0.3 (Session Management & Token Handling): [https://owasp.org/www-project-application-security-verification-standard/](https://owasp.org/www-project-application-security-verification-standard/)
- RFC 7519: JSON Web Token (JWT) Standard: [https://datatracker.ietf.org/doc/html/rfc7519](https://datatracker.ietf.org/doc/html/rfc7519)
- ORCID API v3.0 Documentation: [https://info.orcid.org/documentation/api-tutorials/](https://info.orcid.org/documentation/api-tutorials/)
