# Environment & Secret Management Policy

**Document ID**: `REL-ENV-2026-V1`

## 1. Environment Separation

| Tier | Frontend | Backend | Database | Secrets |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | `localhost:3000` | `localhost:5000` | Local Docker PG16 + pgvector | Local `.env` (gitignored), synthetic data |
| **Preview** | Vercel PR Preview URL | Ephemeral / Non-prod API | Non-prod / Test DB | Non-production credentials only; no prod DB access |
| **Production** | Vercel (`cambium-research.vercel.app`) | Render (`cambium-api`) | Supabase / Managed PG16 | Encrypted platform secrets; 256-bit HMAC/JWT keys |

> **Alternative Staging Constraint**: On starter Render/Supabase plans without a dedicated persistent staging cluster, PR previews + CI ephemeral PostgreSQL 16 (`pgvector/pgvector:pg16`) validate migrations and E2E flows prior to merging into `main`. Never connect preview or test environments to the production database.

## 2. Variable Classification

- **Public Frontend (`NEXT_PUBLIC_*`)**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Server-Only Secrets (Never Exposed to Browser)**: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `AUDIT_HMAC_SECRET`, `DATABASE_URL`, `POSTGRES_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `RESEND_API_KEY`, `REDIS_PASSWORD`.

## 3. Automated Guardrails

- **Startup Validation**: `server/src/config/env.validation.ts` (`validateStartupEnvironment`) fails fast in production if secrets are missing, short (`< 32` chars), placeholder-valued, `DB_SYNCHRONIZE=true`, or `CORS_ORIGIN=*`. Secret values are never logged.
- **Bundle & Template Hygiene**: `node scripts/verify-client-bundle-secrets.mjs` and `node scripts/verify-env.mjs --templates` run in CI (`security-audit`).
- **Rotation**: Rotate `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `AUDIT_HMAC_SECRET` independently in Vercel/Render vaults every 90 days or immediately upon suspected exposure.
