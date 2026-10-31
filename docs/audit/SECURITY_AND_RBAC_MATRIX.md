# Cambium Research Platform
## Enterprise Security Architecture & RBAC Permission Matrix

---

### Document Information
- **Classification**: Enterprise Security Standard
- **Document ID**: `CAMBIUM-SEC-RBAC-2026-V1`
- **Applicable Standards**: NIST SP 800-53 Rev. 5, OWASP Top 10 (2025/2026), GDPR Articles 15 & 20

---

## 1. Five-Tier Role-Based Access Control (RBAC) Matrix

Cambium enforces a 5-tier role hierarchy via `@Roles()` decorators and NestJS `RolesGuard`.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          CAMBIUM RBAC ACCESS CONTROL MATRIX                            │
├─────────────────────────┬───────┬─────────┬──────────────────────┬─────────┬───────────┤
│ Capability / Resource   │ GUEST │ SCHOLAR │ PRINCIPAL_INVESTIG.  │ INST_ADM│ COMPLIANCE│
├─────────────────────────┼───────┼─────────┼──────────────────────┼─────────┼───────────┤
│ Browse Opportunities    │  YES  │   YES   │         YES          │   YES   │    YES    │
│ Bookmark Opportunities  │   NO  │   YES   │         YES          │   YES   │    YES    │
│ Export RFC 5545 iCal    │   NO  │   YES   │         YES          │   YES   │    YES    │
│ Create Research Space   │   NO  │   YES   │         YES          │   YES   │    NO     │
│ Invite Lab Collaborator │   NO  │   NO*   │         YES          │   YES   │    NO     │
│ Assign CRediT Roles     │   NO  │   NO*   │         YES          │   YES   │    NO     │
│ Submit Open Peer Review │   NO  │   YES   │         YES          │   YES   │    YES    │
│ Upload Proposal PDF     │   NO  │   YES   │         YES          │   YES   │    NO     │
│ Access Audit Trail      │   NO  │   NO    │          NO          │   YES   │    YES    │
│ Verify Cryptographic Proof│ NO  │   NO    │          NO          │   YES   │    YES    │
│ Manage Institution SSO  │   NO  │   NO    │          NO          │   YES   │    NO     │
│ Export GDPR Art. 20 Data│   NO  │   YES   │         YES          │   YES   │    YES    │
└─────────────────────────┴───────┴─────────┴──────────────────────┴─────────┴───────────┘
* Note: Scholars can invite collaborators only if they are the designated Owner of that specific workspace.
```

---

## 2. Multi-Tenant Workspace Isolation & IDOR Protection

### 2.1 Threat Model
In multi-tenant scholarly environments, an unauthorized researcher possessing a project UUID must never inspect, download, or tamper with an ongoing confidential grant proposal or proprietary preprint draft.

### 2.2 Enforced Security Controls
In `server/src/modules/projects/projects.service.ts`:
```typescript
// Zero-Trust Private Workspace Access Control Check
if (project.visibility === 'PRIVATE') {
  if (!requesterId) {
    throw new ForbiddenException('Authentication required to access private research workspace.');
  }

  const isOwner = project.ownerId === requesterId;
  const isAcceptedMember = project.members?.some(
    (m) => m.userId === requesterId && m.status === 'ACCEPTED',
  );

  if (!isOwner && !isAcceptedMember) {
    throw new ForbiddenException(
      'Access to private research workspace denied. You are not an authorized member.',
    );
  }
}
```

---

## 3. Cryptographic Hash Chain Audit Ledger

### 3.1 Tamper-Evident Recursive Hash Specification
Each security-critical transaction (login, file upload, permission change, peer review, data export) generates an immutable ledger entry:

$$\text{currentHash} = \text{SHA-256}(\text{index} \parallel \text{previousHash} \parallel \text{timestamp} \parallel \text{action} \parallel \text{actorId} \parallel \text{resourceId} \parallel \text{payloadHash})$$

- **Genesis Anchor**: `0000000000000000000000000000000000000000000000000000000000000000` (64 zeros).
- **Validation**: Every block verifies that its stored `previousHash` matches the cryptographic digest of block $N-1$. Any retroactive payload mutation causes immediate chain break detection.
- **Export Endpoint**: `GET /api/v1/audit/export/signed` delivers an RSA-PSS signed cryptographic proof payload for institutional inspection.

---

## 4. Input Sanitization & SQL Injection Defense

- **Raw SQL Elimination**: All queries utilize TypeORM parameterized builders (`:id`, `:title`, `:userId`). Zero raw string interpolation is permitted in the codebase.
- **DTO Validation**: Every incoming request payload undergoes strict NestJS `ValidationPipe` filtering with `{ transform: true, whitelist: true }`, automatically discarding undeclared attributes.
- **XSS Sanitization**: User-generated markdown in peer reviews and abstracts is sanitized using DOMPurify before rendering in Next.js React components.

