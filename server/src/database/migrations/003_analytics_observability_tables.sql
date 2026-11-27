-- ==============================================================================
-- CAMBIUM ENTERPRISE RESEARCH OPERATING SYSTEM
-- MIGRATION 003: PRODUCT ANALYTICS, AI OBSERVABILITY & CLIENT ERROR BEACONS
-- Document ID: CAMBIUM-SQL-ANALYTICS-003
-- ==============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(80) NOT NULL,
    schema_version VARCHAR(16) NOT NULL DEFAULT '1.0.0',
    idempotency_key VARCHAR(160),
    actor_id UUID,
    actor_kind VARCHAR(16) NOT NULL DEFAULT 'HUMAN',
    organization_id UUID,
    workspace_id UUID,
    source VARCHAR(16) NOT NULL DEFAULT 'backend',
    outcome VARCHAR(16) NOT NULL DEFAULT 'SUCCESS',
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_actor ON analytics_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_org ON analytics_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred ON analytics_events(occurred_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_events_idempotency
  ON analytics_events(idempotency_key) WHERE idempotency_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS ai_telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(64) NOT NULL,
    actor_id UUID,
    provider VARCHAR(32) NOT NULL,
    model VARCHAR(64) NOT NULL,
    request_type VARCHAR(32) NOT NULL,
    input_tokens_est INT NOT NULL DEFAULT 0,
    output_tokens_est INT NOT NULL DEFAULT 0,
    estimated_cost_usd DOUBLE PRECISION NOT NULL DEFAULT 0,
    latency_ms INT NOT NULL DEFAULT 0,
    retrieval_duration_ms INT NOT NULL DEFAULT 0,
    chunks_retrieved INT NOT NULL DEFAULT 0,
    citation_count INT NOT NULL DEFAULT 0,
    tool_success_count INT NOT NULL DEFAULT 0,
    tool_failure_count INT NOT NULL DEFAULT 0,
    outcome VARCHAR(16) NOT NULL DEFAULT 'SUCCESS',
    failure_category VARCHAR(64),
    ai_privacy_mode VARCHAR(64) NOT NULL DEFAULT 'local_only',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_telemetry_req ON ai_telemetry_events(request_id);
CREATE INDEX IF NOT EXISTS idx_ai_telemetry_actor ON ai_telemetry_events(actor_id);

CREATE TABLE IF NOT EXISTS client_error_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route VARCHAR(120) NOT NULL,
    error_name VARCHAR(80) NOT NULL,
    error_digest VARCHAR(64),
    sanitized_message VARCHAR(240) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_errors_route ON client_error_events(route);

ALTER TABLE IF EXISTS analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS client_error_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS analytics_events FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_telemetry_events FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS client_error_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS analytics_actor_read ON analytics_events;
CREATE POLICY analytics_actor_read ON analytics_events
  FOR SELECT USING (actor_id = public.cambium_actor_uuid());

DROP POLICY IF EXISTS ai_telemetry_actor_read ON ai_telemetry_events;
CREATE POLICY ai_telemetry_actor_read ON ai_telemetry_events
  FOR SELECT USING (actor_id = public.cambium_actor_uuid());
