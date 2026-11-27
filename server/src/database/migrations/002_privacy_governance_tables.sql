-- ==============================================================================
-- CAMBIUM ENTERPRISE RESEARCH OPERATING SYSTEM
-- MIGRATION 002: PRIVACY PREFERENCES, APPEND-ONLY CONSENT LEDGER & REQUESTS
-- Document ID: CAMBIUM-SQL-PRIVACY-002
-- ==============================================================================

CREATE TABLE IF NOT EXISTS user_privacy_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    profile_public BOOLEAN NOT NULL DEFAULT TRUE,
    show_institution BOOLEAN NOT NULL DEFAULT TRUE,
    show_publications BOOLEAN NOT NULL DEFAULT FALSE,
    allow_search BOOLEAN NOT NULL DEFAULT TRUE,
    ai_processing_consent BOOLEAN NOT NULL DEFAULT FALSE,
    optional_analytics_consent BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    purpose VARCHAR(64) NOT NULL,
    action VARCHAR(32) NOT NULL,
    notice_version VARCHAR(32) NOT NULL,
    notice_language VARCHAR(16) NOT NULL DEFAULT 'en',
    source_interface VARCHAR(64) NOT NULL DEFAULT 'settings_privacy',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consent_records_user ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_purpose ON consent_records(purpose);

CREATE TABLE IF NOT EXISTS privacy_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    request_type VARCHAR(32) NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'REQUESTED',
    details TEXT,
    resolution_summary TEXT,
    retention_exception_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_privacy_requests_user ON privacy_requests(user_id);

-- Enforce Row-Level Security & Append-Only Consent History
ALTER TABLE IF EXISTS user_privacy_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS privacy_requests ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS user_privacy_preferences FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS consent_records FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS privacy_requests FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS privacy_prefs_owner ON user_privacy_preferences;
CREATE POLICY privacy_prefs_owner ON user_privacy_preferences
  FOR ALL USING (user_id = public.cambium_actor_uuid())
  WITH CHECK (user_id = public.cambium_actor_uuid());

DROP POLICY IF EXISTS consent_records_owner_select ON consent_records;
CREATE POLICY consent_records_owner_select ON consent_records
  FOR SELECT USING (user_id = public.cambium_actor_uuid());

DROP POLICY IF EXISTS consent_records_owner_insert ON consent_records;
CREATE POLICY consent_records_owner_insert ON consent_records
  FOR INSERT WITH CHECK (user_id = public.cambium_actor_uuid());

DROP POLICY IF EXISTS privacy_requests_owner ON privacy_requests;
CREATE POLICY privacy_requests_owner ON privacy_requests
  FOR ALL USING (user_id = public.cambium_actor_uuid())
  WITH CHECK (user_id = public.cambium_actor_uuid());
