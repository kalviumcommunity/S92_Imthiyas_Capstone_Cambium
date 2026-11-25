# Backup, Disaster Recovery & Secret Rotation (`09`)

**Program**: Cambium Research Security Hardening Program  
**Baseline**: OWASP ASVS V6/V14

---

## 1. Database Backup & Recovery Architecture
- Automated scripts under `scripts/cron/` and manifests under `backups/` govern scheduled logical dumps (`backups/.gitkeep` committed; dump files gitignored).
- PostgreSQL backups must remain encrypted at rest on provider storage (Supabase managed PITR + offsite encrypted archival).
- `001_supabase_rls_lockdown.sql` is stored alongside schema DDL in `server/src/database/migrations/` to preserve deterministic schema + RLS state during disaster recovery restores.

## 2. Credential & Key Rotation Playbook
| Credential | Storage Location | Rotation Trigger & Procedure |
| :--- | :--- | :--- |
| `JWT_SECRET` | Render / Vercel server env | Rotate on suspected exposure or 90-day cadence; invalidates existing access/refresh JWTs immediately. |
| `DATABASE_URL` / Supabase Service Key | Render server env only (never `NEXT_PUBLIC_*`) | Rotate in Supabase Dashboard, update Render env, restart backend instances. |
| `GOOGLE_CLIENT_ID` / Secret | Render + Vercel public client ID | Verify allowed redirect/JavaScript origins in Google Cloud Console match production domain. |
| `GEMINI_API_KEY` / SMTP Secrets | Render server env | Revoke old provider key immediately upon anomaly and redeploy backend worker. |
