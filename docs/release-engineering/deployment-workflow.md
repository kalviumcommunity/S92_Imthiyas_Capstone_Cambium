# Deployment Workflow (Vercel, Render & Supabase)

**Document ID**: `REL-DEPLOY-2026-V1`

## 1. Frontend Deployment (Vercel)

- **Root Directory**: `client`
- **Build Command**: `node scripts/sync-logos.mjs && next build` (configured in `client/vercel.json`)
- **Preview Deployments**: Automatically created on pull requests without production secrets.
- **Production Deployment**: Triggered when changes land on `main` (pushed to GitHub).
- **Security Headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and strict CSP in `client/next.config.ts`.

## 2. Backend Deployment (Render)

- **Manifest**: [`render.yaml`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/render.yaml) (`cambium-api`)
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run schema:apply && npm run migrate:up && npm run start:prod`
- **Startup Validation**: `validateStartupEnvironment()` checks required secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`/`POSTGRES_*`, `CORS_ORIGIN`, `DB_SYNCHRONIZE=false`) before binding HTTP port.
- **Health Check Path**: `/health` (returns HTTP 200 only when PostgreSQL responds to `SELECT 1`, along with `version` and `gitSha`).

## 3. Post-Deployment Verification (`release-verify.yml`)

After production deploys complete, trigger `.github/workflows/release-verify.yml` (automatically triggered on `v*` tags or manually via `workflow_dispatch`):
```bash
node scripts/smoke-test.mjs --strict --target=https://cambium-research.vercel.app --api=https://cambium-api-ufj3.onrender.com --require-api
```
