# API Security & Perimeter Controls (`05`)

**Program**: Cambium Research Security Hardening Program  
**Baseline**: OWASP API Security Top 10 (API1–API10), OWASP ASVS V4/V13

---

## 1. Input Validation & Mass Assignment Defence (`server/src/main.ts`)
- Global `ValidationPipe` configured with `{ whitelist: true, transform: true, forbidNonWhitelisted: true }`.
- Unwhitelisted fields such as `role`, `organizationId`, `isAdmin`, `ownerId`, and `uploaderId` are stripped or rejected with HTTP `400 Bad Request`.
- Request body parser size bounded (`2mb`).

## 2. Route Authentication & Role Matrix Enforcement
- **User Directory & Profiles (`UsersController`)**: Protected by `@UseGuards(JwtAuthGuard, RolesGuard)`; directory listing restricted to `SuperAdmin` / `ComplianceOfficer`; `POST` provisioning restricted to `SuperAdmin`; `GET/PUT/DELETE/:id` and `interests` protected by `ParseUUIDPipe` + `assertSelfOrAdmin()`.
- **Relationship Graph (`RelationshipsController`)**: Protected by `@UseGuards(JwtAuthGuard, RolesGuard)`; `user/:userId` requires self or `SuperAdmin`; `overview` restricted to `SuperAdmin` / `ComplianceOfficer`; strips `passwordHash` and user PII.
- **Operational & Telemetry Routes**:
  - `EmailController` (`/api/v1/email/*`): `JwtAuthGuard + RolesGuard`, `@Roles(UserRole.SUPER_ADMIN)`
  - `IngestionController` (`/api/v1/ingestion/*`): `JwtAuthGuard + RolesGuard`, `@Roles(UserRole.SUPER_ADMIN)`
  - `PerformanceController` (`/api/v1/performance/*`): `JwtAuthGuard + RolesGuard`, `@Roles(UserRole.SUPER_ADMIN)`
  - `NetworkDiagnosticsController`: `/diagnostics` gated behind `SuperAdmin`/`ComplianceOfficer` + `NetworkRateLimiterGuard`; `/ping` remains lightweight public health probe.
- **API Docs (`Swagger`)**: Disabled in `NODE_ENV=production` unless `ENABLE_SWAGGER=true`.

## 3. Proxy & Rate Limiting Integrity
- Express `trust proxy` set to `1` and `x-powered-by` disabled in `server/src/main.ts`.
- `NetworkRateLimiterGuard` keys exclusively on verified `req.user.id` or `req.ip` rather than trusting client-controlled `x-user-id` or raw multi-hop `x-forwarded-for` strings.
