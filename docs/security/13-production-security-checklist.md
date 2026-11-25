# Production Security Launch Checklist (`13`)

**Program**: Cambium Research Security Hardening Program

## Infrastructure & Secrets (Manual Production Verification)
- [ ] Apply [`server/src/database/migrations/001_supabase_rls_lockdown.sql`](../../server/src/database/migrations/001_supabase_rls_lockdown.sql) in Supabase SQL Editor after backing up schema.
- [ ] Confirm `JWT_SECRET` on Render is >= 32 cryptographically random bytes and differs from dev defaults.
- [ ] Confirm `GOOGLE_CLIENT_ID` is configured on Render so `verifyIdToken` cryptographic validation operates cleanly.
- [ ] Confirm `CORS_ORIGIN` on Render lists exact Vercel production domain(s) (no `*` wildcard).
- [ ] Confirm `ENABLE_SWAGGER` is unset / `false` in production Render environment.
- [ ] Confirm Supabase `anon` and `service_role` keys: `service_role` exists **only** in backend env vars, never in `NEXT_PUBLIC_*`.

## Code & Automated CI Gates
- [x] `server` TypeScript compilation (`npm run build`) and Vitest suite including `adversarial-security.spec.ts`.
- [x] `client` ESLint + Next.js production build with environment-aware CSP.
- [x] GitHub Actions `.github/workflows/ci.yml` configured with `permissions: contents: read` and Gitleaks secret scanning.
