# Networking, Domains, CORS & TLS Policy (Phase 7)

## 1. Production Domain & Exposure Map
- **Primary Frontend**: `https://cambium-research.vercel.app` (Vercel managed TLS + automatic HTTP->HTTPS redirect).
- **Primary Backend API**: `https://cambium-api-ufj3.onrender.com` (Render managed TLS proxy; NestJS configures `expressApp.set('trust proxy', 1)` and omits `x-powered-by`).
- **Private Infrastructure**: PostgreSQL 16 (`pgvector`) and Redis (if provisioned) are private credentialed dependencies; Supabase `anon` access to application tables is blocked by RLS migration `001`.

## 2. CORS, Cookies & Security Headers
- Strict origin allowlist in [`server/src/main.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/main.ts) (`CORS_ORIGIN` validated at boot to forbid `*` when `credentials: true` is active).
- Production HTTP responses append `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`.
- Refresh cookies enforce `HttpOnly`, `SameSite` (`COOKIE_SAME_SITE=none` across separate `vercel.app` and `onrender.com` origins with `Secure: true`).
- Global NestJS `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`) rejects unexpected fields, and backend exceptions omit internal DB stack traces.
