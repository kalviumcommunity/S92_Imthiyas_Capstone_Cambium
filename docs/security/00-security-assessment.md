# Cambium Research — Phase Zero Security Assessment
**Document ID**: `CAMBIUM-SEC-00-BASELINE`
**Standard Baselines**: OWASP ASVS 5.0.0-informed controls, OWASP Top 10:2025, OWASP API Security Top 10, Supabase Production Security Checklist

---

## 1. System Architecture & Trust Boundaries

Cambium operates across four distinct trust zones:
1. **Browser Origin (`client/`, Vercel)**: Next.js 16 + React 19 UI rendering `Plus Jakarta Sans` / `Newsreader`. Completely untrusted execution environment; client route checks in `client/middleware.ts` are UX routing conveniences only.
2. **Backend API Boundary (`server/`, Render)**: NestJS 10 + TypeORM + Express (`main.ts`) behind TLS reverse proxy, Redis (`RedisService` / Redlock / BullMQ), Swagger docs (`/api/docs`), WebSocket gateway (`/chat`), and SSE stream (`/api/v1/events/stream`).
3. **Database Tier (`PostgreSQL 16 + pgvector`, Supabase Hosting)**: Houses core identity (`users`), opportunities (`research_opportunities`), collaborative projects (`projects`), institutional funding/proposals/compliance, notifications, outbox events, background jobs, and audit logs.
4. **External Integrations**: Google OAuth2, OpenAlex / Crossref / arXiv / PubMed scholarly APIs, Gemini LLM endpoints, and Resend transactional email.

---

## 2. Phase Zero Baseline Audit Inventory (Pre-Remediation Snapshot)

| ID | Risk | Status (Initial) | Location | Evidence & Attack Vector | Target Gate |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-00** | **P0** | **FAIL** | `server/src/modules/auth/auth.service.ts` | `googleLogin()` accepted unverified client-supplied `email` payloads (Branch 3) and fell back to unsigned `jwt.decode(token)` if `GOOGLE_CLIENT_ID` was unset — enabling arbitrary account takeover without OAuth verification. | Gate 1 |
| **SEC-01** | **P0** | **FAIL** | `server/src/modules/upload/upload.controller.ts` | Entire `UploadController` (`POST`, `POST /batch`, `GET`, `GET :id`, `POST :id/ocr`, `DELETE :id`) lacked `JwtAuthGuard` and caller `uploaderId` checks, exposing arbitrary upload, artifact listing, download, OCR, and deletion. | Gate 3 |
| **SEC-02** | **P0** | **FAIL** | `server/src/modules/users/users.controller.ts` & `users.service.ts` | `GET /api/users`, `GET :id`, `POST /` had no auth guard and returned `User` entities with `passwordHash`; `PUT :id`, `DELETE :id`, `POST :id/interests` lacked `@CurrentUser()` ownership check (**cross-user IDOR**). | Gate 2 |
| **SEC-03** | **P0** | **FAIL** | `server/src/database/schema.sql` | Zero `ENABLE ROW LEVEL SECURITY` / `CREATE POLICY` rules across private tables, leaving Supabase `anon` / `authenticated` PostgREST roles unrestricted if Data API is active. | Gate 2 |
| **SEC-04** | **P1** | **FAIL** | `server/src/modules/assistant/assistant.controller.ts` | Applied `@UseGuards(SubscriptionGuard)` without `JwtAuthGuard`, leaving `request.user` unpopulated on HTTP route execution. | Gate 3 |
| **SEC-05** | **P1** | **FAIL** | `email.controller.ts`, `ingestion.controller.ts`, `performance.controller.ts`, `relationships.controller.ts`, `ai-autocomplete.controller.ts` | Operational, admin, LLM, and user-graph endpoints lacked `JwtAuthGuard` and/or `RolesGuard` (`SuperAdmin` / cron secret). | Gate 3 / Gate 4 |
| **SEC-06** | **P1** | **PARTIAL** | `server/src/modules/upload/upload.service.ts` | Allowed `application/octet-stream` MIME type without magic-byte file inspection or `X-Content-Type-Options: nosniff` on download stream. | Gate 3 |
| **SEC-07** | **P1** | **PARTIAL** | `auth.dto.ts`, `client/lib/http-client.ts`, `client/middleware.ts` | Min password length 6 without 128-char upper bound; account enumeration messages in `register`; `localStorage` persistence of `cambium_refresh_token`; `middleware.ts` lacked JWT structural expiry check and open-redirect path sanitization. | Gate 1 |
| **SEC-08** | **P2** | **PARTIAL** | `server/src/main.ts`, `client/next.config.ts`, `.github/workflows/ci.yml` | Swagger `/api/docs` exposed unconditionally in production; `trust proxy` not pinned; broad `connect-src https:` & `'unsafe-eval'` in CSP; CI missing Gitleaks & security regression gate. | Gate 4 |

---

## 3. Maintained Cross-References
- [STRIDE Threat Model](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/security/01-threat-model.md)
- [RBAC & Institutional Authorization Matrix](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/security/03-authorization-and-rbac.md)
