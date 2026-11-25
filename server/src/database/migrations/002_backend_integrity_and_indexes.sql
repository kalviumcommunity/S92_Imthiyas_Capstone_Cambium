-- ==============================================================================
-- CAMBIUM ENTERPRISE RESEARCH OPERATING SYSTEM
-- MIGRATION 002: BILLING TABLES, CHECK INVARIANTS & COMPOSITE QUERY INDEXES
-- Document ID: CAMBIUM-SQL-OPT-002
-- ==============================================================================
-- Safe additive migration: preserves all existing rows, uses IF NOT EXISTS and
-- NOT VALID constraints so controlled rollouts never lock or wipe data.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Align Billing Entities (`subscriptions`, `invoices`) with TypeORM Models
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL DEFAULT 'free',
    cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'Paid',
    plan_name VARCHAR(100) NOT NULL,
    payment_method VARCHAR(100) NOT NULL DEFAULT 'Card (Stripe Test)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id, created_at DESC);

-- Enable & Force RLS matching 001_supabase_rls_lockdown.sql when helper exists
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS invoices FORCE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON subscriptions, invoices FROM anon;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'cambium_actor_uuid') THEN
    DROP POLICY IF EXISTS subscriptions_owner ON subscriptions;
    CREATE POLICY subscriptions_owner ON subscriptions
      FOR ALL USING (user_id = public.cambium_actor_uuid())
      WITH CHECK (user_id = public.cambium_actor_uuid());

    DROP POLICY IF EXISTS invoices_owner ON invoices;
    CREATE POLICY invoices_owner ON invoices
      FOR SELECT USING (user_id = public.cambium_actor_uuid());
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Financial & Domain Invariant CHECK Constraints (Safe Additive)
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    ALTER TABLE funding_accounts
      ADD CONSTRAINT chk_fa_non_negative_balances
      CHECK (
        sanctioned_amount >= 0 AND
        committed_amount >= 0 AND
        spent_amount >= 0
      ) NOT VALID;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE budget_line_items
      ADD CONSTRAINT chk_bli_non_negative_balances
      CHECK (
        allocated_amount >= 0 AND
        committed_amount >= 0 AND
        spent_amount >= 0
      ) NOT VALID;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE expense_requests
      ADD CONSTRAINT chk_er_positive_amount
      CHECK (amount > 0) NOT VALID;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE project_milestones
      ADD CONSTRAINT chk_pm_progress_bounds
      CHECK (progress_percent >= 0 AND progress_percent <= 100) NOT VALID;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 3. Composite & GIN Indexes for High-Traffic Discovery & Governance Views
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_opps_type_deadline
  ON research_opportunities(type, deadline);

CREATE INDEX IF NOT EXISTS idx_prop_org_status_updated
  ON proposals(organization_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_fa_org_state
  ON funding_accounts(organization_id, financial_state);

CREATE INDEX IF NOT EXISTS idx_er_fa_status
  ON expense_requests(funding_account_id, status);

CREATE INDEX IF NOT EXISTS idx_ap_tags_gin
  ON academic_posts USING gin(tags);
