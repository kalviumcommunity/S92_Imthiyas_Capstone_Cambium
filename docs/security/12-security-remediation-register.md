# Security Remediation Register (`12`)

**Program**: Cambium Research Security Hardening Program  
**Branch**: `feat/security-hardening-program`

| ID | Severity | Finding | Remediation Applied | Status |
| :--- | :--- | :--- | :--- | :--- |
| SEC-01 | Critical (P0) | `googleLogin` email-only & unsigned `jwt.decode` auth bypass | Removed bypass; requires verified `userinfo` or cryptographic `verifyIdToken` (`GOOGLE_CLIENT_ID`). | Fixed |
| SEC-02 | Critical (P0) | `UsersController` & `RelationshipsController` missing auth guards (BOLA/PII) | Enforced `JwtAuthGuard`, `RolesGuard`, `ParseUUIDPipe`, `assertSelfOrAdmin`, and `sanitizeUser()`. | Fixed |
| SEC-03 | High (P1) | `UploadController` unauthenticated & permissive `octet-stream` | Enforced `JwtAuthGuard`, `uploaderId` ownership, magic-byte validation, `nosniff` + private caching headers. | Fixed |
| SEC-04 | High (P1) | Refresh token leaked in JSON body & `localStorage` | Stripped `refreshToken` from HTTP JSON body; removed `localStorage` refresh persistence. | Fixed |
| SEC-05 | High (P1) | `EmailController`, `IngestionController`, `PerformanceController`, `/network/diagnostics` unauthenticated | Guarded behind `JwtAuthGuard`, `RolesGuard`, and `UserRole.SUPER_ADMIN` / `COMPLIANCE_OFFICER`. | Fixed |
| SEC-06 | High (P1) | Unbounded Supabase client roles missing DB-layer RLS | Staged `001_supabase_rls_lockdown.sql` across all 33 tables (`FORCE RLS`, `anon` revocations). | Staged (SQL Apply Required) |
| SEC-07 | Medium (P2) | Production CSP included `'unsafe-eval'`, `http://localhost:*`, wildcard `https:` | Scoped production CSP directives in `client/next.config.ts`; added `object-src 'none'`, `base-uri 'self'`. | Fixed |
| SEC-08 | Medium (P2) | `AssistantController` & `AiAutocompleteController` guard gaps + unframed RAG chunks | Enforced `JwtAuthGuard` first, rate limiting, and `<untrusted_source_data>` delimiters. | Fixed |
| SEC-09 | Medium (P2) | Unconditional public `/api/docs` Swagger & missing `trust proxy` | Disabled Swagger in `production` by default; set `trust proxy = 1`; disabled `x-powered-by`. | Fixed |
| SEC-10 | Medium (P2) | Client middleware open-redirect risk & untyped JWT check | Enforced `sanitizeInternalRedirect` & structural JWT expiration check in `client/middleware.ts`. | Fixed |
| SEC-11 | Critical (P0) | SAML `mock-idp` minting live JWTs & unsigned XML assertion acceptance | Blocked `mock-idp` in `production`; required `SAML_IDP_CERT` + `<ds:Signature>` on ACS in `production`; stripped `refreshToken` from JSON body. | Fixed |
| SEC-12 | High (P1) | Unauthenticated PostgreSQL/PgBouncer telemetry at `GET /api/database/diagnostics` | Guarded with `JwtAuthGuard`, `RolesGuard`, and `@Roles(UserRole.SUPER_ADMIN, UserRole.COMPLIANCE_OFFICER)`. | Fixed |
