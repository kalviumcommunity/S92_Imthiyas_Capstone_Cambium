# Environment Management Strategy (Phase 2)

## 1. Environment Matrix

| Environment | Frontend URL | Backend URL | Database Target | Auth & Secrets Policy |
| :--- | :--- | :--- | :--- | :--- |
| **Local Dev** | `http://localhost:3000` | `http://localhost:5000` | Local PostgreSQL 16 + pgvector (`cambium`) | Local dev defaults permitted when `NODE_ENV=development` |
| **Automated Test / CI** | Headless Chromium (`localhost:3000`) | In-process Vitest / Jest / CI Postgres + Redis | Ephemeral CI service container | Dummy test secrets scoped exclusively to CI workflow |
| **Preview / PR Staging** | Vercel ephemeral preview domain | Optional preview API or isolated staging DB | Non-production branch/staging database only | **MUST NOT** connect to production database or storage |
| **Production** | `https://cambium-research.vercel.app` | `https://cambium-api-ufj3.onrender.com` | Managed PostgreSQL 16 + pgvector (TLS required) | Strict validation enforced by [`env.validation.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/config/env.validation.ts) |

---

## 2. Fail-Fast Startup & Separation Guarantees
- `assertValidProductionEnv()` runs before NestFactory boot in [`server/src/main.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/main.ts) and aborts boot cleanly if `NODE_ENV=production` lacks distinct high-entropy `JWT_SECRET` / `JWT_REFRESH_SECRET` values, lacks `DATABASE_URL` / discrete DB settings, specifies wildcard `CORS_ORIGIN=*`, or sets `DB_SYNCHRONIZE=true`.
- Local development requires zero production credentials (`env.validation.ts` permits dev defaults outside `NODE_ENV=production`).
- Frontend environment exposure uses `NEXT_PUBLIC_*` solely for public origin URLs (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_WS_URL`).
