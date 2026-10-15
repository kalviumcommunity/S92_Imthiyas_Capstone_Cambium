# Security Engineering & Threat Model (SECURITY.md)
## Cambium — AI-Powered Research Opportunity Discovery & Intelligence Platform
**OWASP ASVS 4.0 · NIST SP 800-53 · Cryptographic Audit Ledger · Zero-Trust RBAC**

---

### Metadata
- **Document ID**: `SEC-CAMBIUM-2026-V2`
- **Product Name**: Cambium Research Platform
- **Security Lead & Architect**: Shaik Mohamed Imthiyas T
- **Status**: `APPROVED / SECURITY BASELINE`
- **Current Version**: `2.0.0`
- **Standard Baseline**: OWASP Application Security Verification Standard (ASVS) Level 2
- **Traceability**: Implements security requirements from [`docs/templates/PRD.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/templates/PRD.md) and [`docs/templates/ARCHITECTURE.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/templates/ARCHITECTURE.md)
- **Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Security Architecture & Threat Model Overview

Cambium handles mission-critical scholarly assets: **unreleased preprints, proprietary grant budgets, multi-site human-subject ethics protocols (IRB), and verified academic identity credentials.** 

Our security architecture enforces **Defense-in-Depth** across every tier:
1. **Zero-Trust Perimeter**: Every request is authenticated; no internal service trusts another implicitly.
2. **Cryptographic Non-Repudiation**: Sensitive operations (protocol amendment approvals, export of clinical datasets) generate immutable, SHA-256 chained audit logs.
3. **Data Isolation**: Multi-tenant institutional boundaries prevent cross-lab data leaks.

```
                          ┌────────────────────────┐
                          │   Public Internet      │
                          └───────────┬────────────┘
                                      │ TLS 1.3 / WAF Rate Limiting
                                      ▼
                      ┌────────────────────────────────┐
                      │  NestJS API Gateway & Guards   │
                      │  • Zod Input Sanitization      │
                      │  • JWT + Refresh Cookie Check  │
                      │  • RBAC & Resource ACL Guard   │
                      └───────────────┬────────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
   ┌───────────────────────────┐             ┌───────────────────────────┐
   │ PostgreSQL + pgvector     │             │ Redis Job & Session Store │
   │ • Row-Level Security (RLS)│             │ • Auth Token Blacklist    │
   │ • AES-256 Disk Encryption │             │ • Rate-Limit Token Bucket │
   │ • Parameterized Queries   │             │ • Encrypted BullMQ Jobs   │
   └───────────────────────────┘             └───────────────────────────┘
```

---

## 2. Threat Analysis (STRIDE Model)

| Threat Category | Potential Attack Scenario | Impact | Implemented Mitigation & Safeguards |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Attacker impersonates a PI to authorize an unapproved human trial or claim grant funds. | **Critical** | Cryptographic session verification; rotating JWTs with HTTP-only cookies; optional TOTP MFA; ORCID / SAML institutional federation. |
| **Tampering** | Malicious insider alters grant allocation numbers or tampers with IRB approval dates. | **High** | Append-only, SHA-256 chained audit ledger (`/audit`); database constraints; TypeORM immutable date triggers. |
| **Repudiation** | Co-author denies signing off on manuscript data or author role in CRediT matrix. | **Medium** | Immutable timestamped signature stored in PostgreSQL with actor user ID, client IP, and cryptographic hash. |
| **Information Disclosure** | Competitor scrapes unreleased draft preprints or embargoed grant applications. | **Critical** | Resource-level Access Control Lists (ACL); AES-256 at rest; pre-signed S3 URLs with 15-minute expirations; zero indexing of draft vectors in public search. |
| **Denial of Service** | Botnet floods the semantic search endpoint with massive vector calculation queries. | **High** | Redis token-bucket rate limiting (60 req/min per IP; 120 req/min per verified user); vector query caching. |
| **Elevation of Privilege** | Student researcher modifies lab GPU compute quotas or grants themselves PI privileges. | **Critical** | Strict NestJS `@Roles()` decorator guards; server-side role validation extracted directly from signed JWT claims. |

---

## 3. Authentication & Authorization Matrix

### 3.1 Token Lifecycle & Session Management
- **Access Tokens**: Short-lived (15 minutes), signed using RSA-256 (RS256) or HMAC-SHA256 with high-entropy secret (`JWT_SECRET`).
- **Refresh Tokens**: Long-lived (7 days), stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie (`__Host-cambium_rf`).
- **Token Invalidation**: Refresh token rotation is mandatory; whenever a refresh token is used, a new one is issued and the old token is added to a Redis revocation blacklist.

### 3.2 Role-Based Access Control (RBAC) Matrix

| Platform Resource / Action | `Public` | `Fellow` (Student) | `Researcher` (Postdoc) | `PI` (Lab Director) | `ComplianceOfficer` (IRB/Auditor) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Public Landing & /discover** | Read | Read | Read | Read | Read |
| **Personal OS & Bookmarks** | ❌ | Read / Write (Own) | Read / Write (Own) | Read / Write (Own) | Read (Own) |
| **Agentic Reader (PDF Upload)** | ❌ | Read / Write (Own) | Read / Write (Own) | Read / Write (Own) | Read / Write (Own) |
| **Workspace & Projects** | ❌ | Read / Contributor | Read / Write | Admin (Own Lab) | Read-Only (Audit) |
| **FAIR Dataset DOI Minting** | ❌ | ❌ | Request Mint | **Approve & Mint** | Verify & Flag |
| **IRB Protocol Submission** | ❌ | ❌ | Draft Protocol | **Submit & Sign** | **Approve / Reject** |
| **Grant Budget & Quota Edit** | ❌ | ❌ | ❌ | **Full Control** | Audit Read |
| **Security Audit Logs (`/audit`)**| ❌ | ❌ | Read Own Logs | Read Lab Logs | **Full Global Audit** |

---

## 4. Input Validation & Injection Prevention

### 4.1 SQL Injection Defense
- **Zero Raw String Concatenation**: All database interactions use TypeORM parameter binding (`queryBuilder.where("user.id = :id", { id })`).
- **Vector Sanitization**: High-dimensional vector inputs for `pgvector` are strictly validated as 1536-element float arrays matching `^\[(-?\d+(\.\d+)?,?)+\]$` before executing distance queries.

### 4.2 Cross-Site Scripting (XSS) & Content Security Policy (CSP)
- Next.js auto-escapes all JSX outputs.
- HTTP response headers enforced in Next.js middleware and NestJS helmet:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' http://localhost:3000 http://localhost:5000 wss:; frame-ancestors 'none';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### 4.3 Schema Validation
Every API payload is validated at the controller boundary using NestJS `ValidationPipe` with `class-validator` and Zod schemas:
- Strips unknown fields (`whitelist: true`).
- Forbids non-whitelisted properties (`forbidNonWhitelisted: true`).

---

## 5. Data Classification & Privacy Lifecycle

| Data Classification Tier | Examples | Encryption & Storage Policy | Retention & Deletion |
| :--- | :--- | :--- | :--- |
| **Tier 1: Public Open-Science** | Published paper titles, abstracts, open conference CFPs. | Public read; cached in Redis and PostgreSQL. | Permanent public archive. |
| **Tier 2: Scholar Private** | Workspace notes, unreleased preprints, bookmarks, personal calendar events. | AES-256 encrypted at rest; restricted to authenticated user. | Soft-deleted; permanent purge within 30 days of account deletion request. |
| **Tier 3: Institutional Confidential** | Grant budgets, pending patent claims, lab GPU allocations. | Restricted by Lab ACL; TLS 1.3 in transit; AES-256 GCM on disk. | Retained for institutional grant audit period (7 years funder requirement). |
| **Tier 4: Restricted Ethics & Compliance** | Human-subject IRB protocols, patient de-identification records, audit hashes. | Dedicated isolated schema; restricted to PIs and Compliance Officers; immutable append-only. | Indefinite retention per federal research regulations (45 CFR 46). |

---

## 6. Cryptographic Audit Ledger (`/audit`)

To prevent insider fraud and guarantee institutional compliance, critical mutations produce a signed audit record:

```typescript
interface CryptographicAuditRecord {
  id: string;               // UUID v4
  timestamp: string;        // ISO 8601 UTC
  actor: {
    userId: string;
    email: string;
    role: string;
    institutionRor: string;
  };
  action: string;           // e.g., "IRB.Protocol.Approve", "FAIR.Data.Export"
  targetResourceId: string;
  clientIp: string;
  userAgent: string;
  previousRecordHash: string; // Blockchain-style SHA-256 chain
  sha256Hash: string;       // SHA-256(previousHash + timestamp + actor + action + target)
}
```

Any modification to historical audit records invalidates the cryptographic hash chain, triggering an instant security alert.

---

## 7. Secrets Management & Environment Security

1. **No Secrets in Source Control**: `.env` and `.env.local` are explicitly listed in `.gitignore`. Production credentials use Docker Secrets or AWS Secrets Manager.
2. **Key Rotation Schedule**:
   - `JWT_SECRET`: Rotated every 90 days.
   - Database credentials: Rotated every 180 days with zero downtime via dual-user rotation.
   - AI API Keys (Gemini / OpenAI): Managed via institutional vault with per-service usage quotas.
3. **Dependency Vulnerability Scanning**:
   - Automated `npm audit --audit-level=high` runs in CI on every push.
   - Dependabot enabled for automated security patch PRs.

---

## 8. Incident Response & Security Vulnerability Reporting

### 8.1 Reporting Security Vulnerabilities
If you discover a security vulnerability in Cambium Research:
- **Do NOT file a public GitHub issue.**
- Email the security team directly at: `security@cambium.mit.edu` or `imthiyas@cambium.mit.edu`.
- We acknowledge reports within **24 hours** and provide a patch timeline within **72 hours**.

### 8.2 Incident Severity & SLA Matrix
- **Critical (P0)** (Data breach of unreleased manuscripts or ethics protocols): Mitigation deployed within **4 hours**.
- **High (P1)** (Privilege escalation or authentication bypass): Mitigation deployed within **12 hours**.
- **Medium (P2)** (Denial of Service on non-critical endpoints): Mitigation deployed within **48 hours**.
