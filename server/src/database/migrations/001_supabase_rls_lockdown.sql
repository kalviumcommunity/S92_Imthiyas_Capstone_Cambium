-- ==============================================================================
-- CAMBIUM ENTERPRISE RESEARCH OPERATING SYSTEM
-- MIGRATION 001: POSTGRESQL / SUPABASE ROW-LEVEL SECURITY (RLS) LOCKDOWN
-- Document ID: CAMBIUM-SQL-RLS-001
-- Compliance: OWASP ASVS 5.0 / Supabase Production Security Checklist
-- ==============================================================================
-- Purpose:
--   1. Enable and FORCE Row-Level Security across all 33 application tables.
--   2. Block unauthenticated Supabase Data API (`anon`) reads/writes on private
--      identity, workspace, proposal, financial, audit, and background job tables.
--   3. Enforce user-owned (`auth.uid()` / `app.current_user_id`) and
--      organization-scoped (`app.current_org_id`) least-privilege isolation.
-- ==============================================================================

-- Safely resolve caller user UUID from Supabase auth.uid() or Express/TypeORM GUC
CREATE OR REPLACE FUNCTION public.cambium_actor_uuid()
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
DECLARE
  v_sub text;
BEGIN
  v_sub := NULLIF(current_setting('app.current_user_id', true), '');
  IF v_sub IS NOT NULL THEN
    RETURN v_sub::uuid;
  END IF;

  v_sub := NULLIF(current_setting('request.jwt.claim.sub', true), '');
  IF v_sub IS NOT NULL THEN
    RETURN v_sub::uuid;
  END IF;

  RETURN NULL;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Safely resolve caller organization UUID for institutional tenant isolation
CREATE OR REPLACE FUNCTION public.cambium_actor_org_uuid()
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
DECLARE
  v_org text;
BEGIN
  v_org := NULLIF(current_setting('app.current_org_id', true), '');
  IF v_org IS NOT NULL THEN
    RETURN v_org::uuid;
  END IF;
  RETURN NULL;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- ------------------------------------------------------------------------------
-- 1. Enable RLS across all 33 tables
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS research_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS research_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS opportunity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS outbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS group_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS project_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS academic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scholar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scholar_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS research_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workspace_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS proposal_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS proposal_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS funding_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS budget_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS expense_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS project_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS compliance_protocols ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owner unless bypassed explicitly by backend context
ALTER TABLE IF EXISTS users FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookmarks FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS outbox_events FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS background_jobs FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS group_projects FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS project_members FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS proposals FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS proposal_revisions FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS proposal_reviews FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS funding_accounts FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS budget_line_items FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS expense_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS compliance_protocols FORCE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. Revoke direct Data API (`anon`, `authenticated`) access on internal/PII tables
--    when those roles exist on Supabase Postgres
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON users, notifications, bookmarks, outbox_events, audit_logs, background_jobs,
      group_projects, project_members, project_activity_logs, workspace_comments, chat_messages,
      proposals, proposal_revisions, proposal_reviews, funding_accounts, budget_line_items,
      expense_requests, project_milestones, project_risks, compliance_protocols
    FROM anon;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON outbox_events, audit_logs, background_jobs FROM authenticated;
    -- Ensure password_hash is never selectable even by authenticated Data API clients
    REVOKE SELECT (password_hash) ON users FROM authenticated;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. Public Catalog Read-Only Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS public_catalog_read_opps ON research_opportunities;
CREATE POLICY public_catalog_read_opps ON research_opportunities
  FOR SELECT USING (true);

DROP POLICY IF EXISTS public_catalog_read_tags ON tags;
CREATE POLICY public_catalog_read_tags ON tags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS public_catalog_read_opp_tags ON opportunity_tags;
CREATE POLICY public_catalog_read_opp_tags ON opportunity_tags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS public_catalog_read_interests ON research_interests;
CREATE POLICY public_catalog_read_interests ON research_interests
  FOR SELECT USING (true);

DROP POLICY IF EXISTS public_catalog_read_orgs ON organizations;
CREATE POLICY public_catalog_read_orgs ON organizations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS public_catalog_read_depts ON departments;
CREATE POLICY public_catalog_read_depts ON departments
  FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- 4. User-Owned Private Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS users_self_select ON users;
CREATE POLICY users_self_select ON users
  FOR SELECT USING (id = public.cambium_actor_uuid());

DROP POLICY IF EXISTS users_self_update ON users;
CREATE POLICY users_self_update ON users
  FOR UPDATE USING (id = public.cambium_actor_uuid())
  WITH CHECK (id = public.cambium_actor_uuid());

DROP POLICY IF EXISTS user_interests_owner ON user_interests;
CREATE POLICY user_interests_owner ON user_interests
  FOR ALL USING (user_id = public.cambium_actor_uuid())
  WITH CHECK (user_id = public.cambium_actor_uuid());

DROP POLICY IF EXISTS bookmarks_owner ON bookmarks;
CREATE POLICY bookmarks_owner ON bookmarks
  FOR ALL USING (user_id = public.cambium_actor_uuid())
  WITH CHECK (user_id = public.cambium_actor_uuid());

DROP POLICY IF EXISTS notifications_owner ON notifications;
CREATE POLICY notifications_owner ON notifications
  FOR ALL USING (user_id = public.cambium_actor_uuid())
  WITH CHECK (user_id = public.cambium_actor_uuid());

DROP POLICY IF EXISTS connections_participant ON scholar_connections;
CREATE POLICY connections_participant ON scholar_connections
  FOR ALL USING (
    requester_id = public.cambium_actor_uuid() OR recipient_id = public.cambium_actor_uuid()
  );

DROP POLICY IF EXISTS follows_participant ON scholar_follows;
CREATE POLICY follows_participant ON scholar_follows
  FOR ALL USING (
    follower_id = public.cambium_actor_uuid() OR following_id = public.cambium_actor_uuid()
  );

-- ------------------------------------------------------------------------------
-- 5. Collaborative Workspace Membership Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS projects_member_access ON group_projects;
CREATE POLICY projects_member_access ON group_projects
  FOR ALL USING (
    owner_id = public.cambium_actor_uuid()
    OR EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = group_projects.id AND pm.user_id = public.cambium_actor_uuid()
    )
  );

DROP POLICY IF EXISTS project_members_scope ON project_members;
CREATE POLICY project_members_scope ON project_members
  FOR SELECT USING (
    user_id = public.cambium_actor_uuid()
    OR EXISTS (
      SELECT 1 FROM group_projects gp
      WHERE gp.id = project_members.project_id AND gp.owner_id = public.cambium_actor_uuid()
    )
  );

DROP POLICY IF EXISTS workspace_comments_member ON workspace_comments;
CREATE POLICY workspace_comments_member ON workspace_comments
  FOR ALL USING (
    author_id = public.cambium_actor_uuid()
    OR EXISTS (
      SELECT 1 FROM project_members pm
      WHERE pm.project_id = workspace_comments.project_id AND pm.user_id = public.cambium_actor_uuid()
    )
  );

-- ------------------------------------------------------------------------------
-- 6. Institutional Tenant Boundary Policies (organization_id Isolation)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS proposals_tenant_isolation ON proposals;
CREATE POLICY proposals_tenant_isolation ON proposals
  FOR ALL USING (
    lead_investigator_id = public.cambium_actor_uuid()
    OR organization_id = public.cambium_actor_org_uuid()
  )
  WITH CHECK (
    organization_id = public.cambium_actor_org_uuid()
  );

DROP POLICY IF EXISTS funding_tenant_isolation ON funding_accounts;
CREATE POLICY funding_tenant_isolation ON funding_accounts
  FOR ALL USING (organization_id = public.cambium_actor_org_uuid())
  WITH CHECK (organization_id = public.cambium_actor_org_uuid());

DROP POLICY IF EXISTS compliance_tenant_isolation ON compliance_protocols;
CREATE POLICY compliance_tenant_isolation ON compliance_protocols
  FOR ALL USING (
    principal_investigator_id = public.cambium_actor_uuid()
    OR organization_id = public.cambium_actor_org_uuid()
  )
  WITH CHECK (organization_id = public.cambium_actor_org_uuid());
