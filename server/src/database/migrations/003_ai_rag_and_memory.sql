-- ==============================================================================
-- CAMBIUM ENTERPRISE RESEARCH OPERATING SYSTEM
-- MIGRATION 003: DOCUMENT CHUNK PGVECTOR STORE, AI MEMORY & AI TELEMETRY
-- Document ID: CAMBIUM-SQL-AI-003
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE EXTENSION IF NOT EXISTS vector;
EXCEPTION
    WHEN OTHERS THEN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') THEN
            CREATE DOMAIN vector AS text;
        END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 1. Authorized Document Chunks (RAG Vector + FTS Retrieval Store)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id VARCHAR(120) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES group_projects(id) ON DELETE CASCADE,
    organization_id UUID,
    visibility VARCHAR(20) NOT NULL DEFAULT 'PRIVATE',
    title VARCHAR(255) NOT NULL,
    section_header VARCHAR(160) NOT NULL DEFAULT 'General',
    page_number INT NOT NULL DEFAULT 1,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    embedding vector(768),
    embedding_model VARCHAR(80) NOT NULL DEFAULT 'gemini-embedding-001',
    embedding_version VARCHAR(40) NOT NULL DEFAULT 'v1-768d',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_doc_chunk_idx UNIQUE (document_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_doc_chunks_acl
  ON document_chunks(visibility, owner_id, workspace_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_doc_hash
  ON document_chunks(document_id, content_hash);

DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_doc_chunks_embedding_hnsw
      ON document_chunks USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_doc_chunks_fts
  ON document_chunks USING gin(to_tsvector('english', title || ' ' || section_header || ' ' || content));

-- ------------------------------------------------------------------------------
-- 2. AI Conversation & Message Persistence (User & Workspace Isolated)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES group_projects(id) ON DELETE SET NULL,
    persona VARCHAR(60) NOT NULL DEFAULT 'General Assistant',
    title VARCHAR(255) NOT NULL DEFAULT 'Research Session',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conv_user ON ai_conversations(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    citations JSONB NOT NULL DEFAULT '[]'::jsonb,
    prompt_version VARCHAR(60),
    model_used VARCHAR(80),
    abstained BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_msg_conv ON ai_messages(conversation_id, created_at ASC);

-- ------------------------------------------------------------------------------
-- 3. AI Request Observability & Cost Attribution Ledger
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_request_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(64) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    task_type VARCHAR(50) NOT NULL,
    model_used VARCHAR(80) NOT NULL,
    prompt_version VARCHAR(60),
    estimated_input_tokens INT NOT NULL DEFAULT 0,
    estimated_output_tokens INT NOT NULL DEFAULT 0,
    estimated_cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
    latency_ms INT NOT NULL DEFAULT 0,
    retrieved_count INT NOT NULL DEFAULT 0,
    abstained BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'OK',
    error_code VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_telemetry_user_date
  ON ai_request_telemetry(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. Row-Level Security Policies (Compatible with Migration 001 Helpers)
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS document_chunks FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_conversations FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_messages FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_request_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_request_telemetry FORCE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON document_chunks, ai_conversations, ai_messages, ai_request_telemetry FROM anon;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'cambium_actor_uuid') THEN
    DROP POLICY IF EXISTS document_chunks_acl_select ON document_chunks;
    CREATE POLICY document_chunks_acl_select ON document_chunks
      FOR SELECT USING (
        visibility = 'PUBLIC'
        OR owner_id = public.cambium_actor_uuid()
        OR (
          workspace_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = document_chunks.workspace_id
              AND pm.user_id = public.cambium_actor_uuid()
              AND pm.status = 'ACCEPTED'
          )
        )
        OR (
          visibility = 'ORGANIZATION'
          AND organization_id IS NOT NULL
          AND organization_id = public.cambium_actor_org_uuid()
        )
      );

    DROP POLICY IF EXISTS document_chunks_owner_write ON document_chunks;
    CREATE POLICY document_chunks_owner_write ON document_chunks
      FOR ALL USING (owner_id = public.cambium_actor_uuid())
      WITH CHECK (owner_id = public.cambium_actor_uuid());

    DROP POLICY IF EXISTS ai_conversations_owner ON ai_conversations;
    CREATE POLICY ai_conversations_owner ON ai_conversations
      FOR ALL USING (user_id = public.cambium_actor_uuid())
      WITH CHECK (user_id = public.cambium_actor_uuid());

    DROP POLICY IF EXISTS ai_messages_owner ON ai_messages;
    CREATE POLICY ai_messages_owner ON ai_messages
      FOR ALL USING (user_id = public.cambium_actor_uuid())
      WITH CHECK (user_id = public.cambium_actor_uuid());

    DROP POLICY IF EXISTS ai_telemetry_owner ON ai_request_telemetry;
    CREATE POLICY ai_telemetry_owner ON ai_request_telemetry
      FOR SELECT USING (user_id = public.cambium_actor_uuid());
  END IF;
END $$;
