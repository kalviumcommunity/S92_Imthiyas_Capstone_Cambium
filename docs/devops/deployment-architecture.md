# Deployment Engineering Architecture (Phase 4)

## 1. Frontend Deployment (Vercel — `client/`)
- **Config**: [`client/vercel.json`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/vercel.json) (`framework: "nextjs"`, `buildCommand: "node scripts/sync-logos.mjs && next build"`).
- **Security Headers**: Edge headers set `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, supplemented by CSP in [`client/next.config.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/next.config.ts).
- **Environment Boundary**: Public env vars contain only endpoint origins (`NEXT_PUBLIC_API_URL`); zero DB, JWT, or Gemini secrets enter client bundles.

## 2. Backend Deployment (Render — `server/`)
- **Blueprint**: [`render.yaml`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/render.yaml).
- **Build & Start**: `npm install && npm run build` followed by `npm run db:migrate && npm run start:prod` (failing cleanly if migrations cannot acquire lock or verify SQL).
- **Health Probe**: `healthCheckPath: /api/v1/health/liveness` avoids false boot failures caused by cold DB latency while `/api/v1/health/readiness` verifies live database readiness (`200` connected vs `503` unavailable).
- **Graceful Shutdown**: `registerGracefulShutdown()` handles `SIGTERM`/`SIGINT` cleanly for zero-drop restarts during deployments.

## 3. Managed PostgreSQL & PgBouncer Connection Strategy
- Pooling governed via `DB_POOL_MAX` (`20`), `connectionTimeoutMillis` (`5000`), and `statement_timeout` (`15000`) inside [`database.config.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/config/database.config.ts).
- `DB_SSL_REJECT_UNAUTHORIZED=true` supported whenever a CA certificate bundle is injected, while preserving TLS transport compatibility on managed starter tiers.
