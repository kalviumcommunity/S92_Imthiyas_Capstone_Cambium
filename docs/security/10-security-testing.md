# Security Testing & Adversarial Verification Strategy (`10`)

**Program**: Cambium Research Security Hardening Program  
**Baseline**: OWASP ASVS 5.0.0 Verification Model

---

## 1. Multi-Actor Adversarial Security Matrix
Implemented in [`server/src/security/adversarial-security.spec.ts`](../../server/src/security/adversarial-security.spec.ts).

The suite verifies seven synthetic trust contexts (`Anonymous`, `User A`, `User B`, `Workspace Member`, `Workspace Admin`, `Institution Admin`, `SuperAdmin`) across 10 core scenarios:
1. Cross-workspace IDOR containment (`ProjectsService` / workspace isolation).
2. Privilege self-escalation rejection (`ValidationPipe` rejecting `role`, `isAdmin`, `organizationId`).
3. Unauthenticated Google login bypass & forged/unsigned/`alg=none`/expired JWT rejection.
4. Cross-user BOLA protection on `UsersController` and `RelationshipsController`.
5. Private artifact access denial & malicious magic-byte upload blocking (`UploadController` / `UploadService`).
6. Supabase/PostgreSQL RLS lockdown script assertions (`FORCE ROW LEVEL SECURITY`, `anon` revocation across sensitive tables).
7. AI prompt-injection XML boundary containment & `JwtAuthGuard` ordering before `SubscriptionGuard`.
8. SSRF protection against loopback, RFC1918, cloud metadata (`169.254.169.254`), and non-HTTPS URIs.
9. Mass assignment blocking (`ownerId`, `uploaderId`, `organizationId`).
10. Frontend open-redirect sanitization (`sanitizeInternalRedirect` blocking `//`, `/\`, `https://`).
