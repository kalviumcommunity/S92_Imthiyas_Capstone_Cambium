# Secrets & Configuration Security (Phase 6)

## 1. Credential Boundaries & Containment Rules
- **Browser Bundle Boundary**: Never expose `JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, or `GEMINI_API_KEY` through `NEXT_PUBLIC_*` environment variables.
- **No Committed Credentials**: `.env`, `.env.local`, `.env.production` remain git-ignored; [`ci.yml`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/.github/workflows/ci.yml) runs `gitleaks/gitleaks-action@v2` with `fetch-depth: 0` across full git history.
- **Script Remediation**: Hardcoded fallback database passwords previously present in `scripts/backup-db.*`, `scripts/restore-db.*`, and `server/scripts/test-query.js` have been removed so all CLI utilities require `DATABASE_URL` or `POSTGRES_PASSWORD` from runtime environment variables.

## 2. Rotation Procedure
1. Generate a new 32+ byte cryptographic secret (`openssl rand -hex 32`) or rotate DB/Gemini API key in provider console.
2. Update the secret inside Render Environment Groups / Vercel Project Settings / GitHub Secrets.
3. Trigger controlled redeploy (`npm run verify:env:prod` followed by health probes).
4. Revoke previous API/DB credential after verifying active sessions stabilize.
5. Note that rotating `JWT_SECRET` / `JWT_REFRESH_SECRET` invalidates existing bearer/refresh sessions immediately (plan maintenance communication accordingly).
