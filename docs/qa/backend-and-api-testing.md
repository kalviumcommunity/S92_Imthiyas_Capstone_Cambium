# Cambium Research — Backend & HTTP API Integration Testing

## 1. Integration Strategy Without Test-Only Packages

Rather than introducing duplicate mocking frameworks, Cambium exercises real HTTP serialization, routing, DTO transformation (`class-transformer` + `class-validator`), parameter pipes, JWT guards, RBAC checks, and controller responses over loopback HTTP (`127.0.0.1:0`) using NestJS's Express adapter and standard `fetch()`.

## 2. Verified Controller & Middleware Contracts (`server/src/qa/http-contracts.integration.spec.ts`)

- **Auth Routes (`/api/v1/auth/register`, `/api/v1/auth/login`)**:
  - Rejects weak passwords (< 8 chars), invalid emails, and disallowed username characters with `400 Bad Request`.
  - Rejects mass-assignment / privilege-escalation properties (`role`, `isVerified`) under global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`.
- **Protected Workspaces (`/api/v1/projects`)**:
  - Unauthenticated requests fail closed with `401 Unauthorized`.
  - Cross-actor reads on `PRIVATE` workspaces fail with `403 Forbidden` (IDOR guard), while workspace owner / accepted members receive `200 OK`.
- **Health Liveness & Readiness (`/api/v1/health/liveness`, `/api/v1/health/readiness`)**:
  - Liveness remains `200 UP` whenever the Node event loop is responsive.
  - Readiness returns `503 Service Unavailable` immediately when `SELECT 1` fails against PostgreSQL, without leaking raw SQL errors or stack traces.
- **Opportunities Routes (`/api/v1/opportunities`)**:
  - Query filtering passes validated `FilterOpportunityDto` enums and returns `400` on invalid enum values.

## 3. Execution

```bash
cd server && npm run build && npm test
```
