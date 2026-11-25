# Defense-in-Depth Security Architecture (`14`)

**Program**: Cambium Research Security Hardening Program

---

```
Browser (Next.js 16 + Strict CSP)
   │  HTTPS + HttpOnly Refresh Cookie + Bearer Access JWT
   ▼
Edge Middleware (client/middleware.ts)
   │  Structural JWT expiry check + sanitizeInternalRedirect()
   ▼
NestJS 10 API Perimeter (server/src/main.ts)
   │  CORS Allowlist + trust proxy(1) + Global ValidationPipe (forbidNonWhitelisted)
   ▼
Route Security Layers
   ├── JwtAuthGuard (HS256 pinned, Redis blacklist check)
   ├── RolesGuard (10-role UserRole enum verification)
   ├── NetworkRateLimiterGuard (verified user.id / req.ip key)
   └── Service-Level Object Ownership (assertSelfOrAdmin, uploaderId, member check)
   ▼
PostgreSQL 16 + Supabase RLS (001_supabase_rls_lockdown.sql)
   └── FORCE ROW LEVEL SECURITY across all 33 tables + anon revocation
```
