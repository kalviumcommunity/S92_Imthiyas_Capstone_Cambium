# Supabase & PostgreSQL Security Architecture (`04`)

**Program**: Cambium Research Security Hardening Program  
**Baseline**: Supabase Production Security Checklist, OWASP ASVS V8/V6

---

## 1. Row-Level Security (RLS) Lockdown Migration
Migration file: [`server/src/database/migrations/001_supabase_rls_lockdown.sql`](../../server/src/database/migrations/001_supabase_rls_lockdown.sql)

### Key Enforcements Across All 33 Schema Tables
1. **Force RLS on Every Table**: Enables `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY` across user, workspace, institutional, chat, billing, notification, audit, and reference catalog tables.
2. **Helper Context Resolvers**: Defines `public.cambium_actor_uuid()` (resolves `auth.uid()` or backend `app.current_user_id` session setting) and `public.cambium_actor_org_uuid()` for deterministic tenant isolation.
3. **Anonymous Role Revocation (`anon`)**: Revokes table privileges from `anon` across 20 private user, workspace, chat, proposal, financial, audit, and background job tables (`users`, `group_projects`, `chat_messages`, `proposals`, `audit_logs`, etc.), leaving public read-only policies (`research_opportunities`, `research_interests`, `tags`, `academic_posts`).
4. **Column-Level Credential Protection**: Revokes `SELECT(password_hash)` from `authenticated` and `anon` on `users`.

## 2. Deployment Governance (Pre-Production Release Gate)
> [!IMPORTANT]
> `001_supabase_rls_lockdown.sql` is staged in version control and **has not been executed automatically against live Supabase** to prevent unreviewed lockouts in active environments. Apply via controlled Supabase SQL Editor / migration runner after verifying NestJS database connection role (`service_role` / table owner) and `app.current_user_id` transaction context.
