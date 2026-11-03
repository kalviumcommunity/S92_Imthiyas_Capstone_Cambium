-- ==============================================================================
-- CAMBIUM ENTERPRISE RESEARCH OPERATING SYSTEM (v2.0.0 GA)
-- MASTER POSTGRESQL 16 + PGVECTOR RELATIONAL DATABASE SCHEMA (3NF SSOT)
-- Document ID: CAMBIUM-SQL-SCHEMA-2026-V2
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & DOMAIN FALLBACKS
-- ------------------------------------------------------------------------------
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
-- 2. ENUMERATED TYPES
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE opportunity_type_enum AS ENUM ('Grant', 'CFP', 'Journal', 'Paper');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 3. CORE IDENTITY: USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    institution VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'Researcher',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ------------------------------------------------------------------------------
-- 4. TAXONOMY: RESEARCH INTERESTS & USER MAPPING
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interests_slug ON research_interests(slug);

CREATE TABLE IF NOT EXISTS user_interests (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES research_interests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, interest_id)
);

CREATE INDEX IF NOT EXISTS idx_ui_user ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_ui_interest ON user_interests(interest_id);

-- ------------------------------------------------------------------------------
-- 5. NORMALIZED TAXONOMY TAGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- ------------------------------------------------------------------------------
-- 6. RESEARCH OPPORTUNITIES CATALOG (PGVECTOR HNSW + GIN SEARCH)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type opportunity_type_enum NOT NULL,
    organization VARCHAR(255) NOT NULL,
    deadline TIMESTAMPTZ,
    description TEXT,
    link VARCHAR(1000),
    created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    embedding vector(768), -- pgvector 768-dim normalized embedding (Google Gemini text-embedding-004)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opps_type ON research_opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opps_deadline ON research_opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opps_created_by ON research_opportunities(created_by_id);

-- HNSW Vector Cosine Distance Index for pgvector Semantic Search
DO $$ BEGIN
    CREATE INDEX idx_opps_embedding_hnsw
    ON research_opportunities USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- Full-Text Search (GIN) Index for Hybrid Keyword + Semantic Search
CREATE INDEX IF NOT EXISTS idx_opps_fts
ON research_opportunities USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Opportunity <-> Tags Junction Table
CREATE TABLE IF NOT EXISTS opportunity_tags (
    opportunity_id UUID NOT NULL REFERENCES research_opportunities(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (opportunity_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_ot_opp ON opportunity_tags(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_ot_tag ON opportunity_tags(tag_id);

-- ------------------------------------------------------------------------------
-- 7. SCHOLAR BOOKMARKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES research_opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_opportunity_bookmark UNIQUE (user_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_bm_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bm_opp ON bookmarks(opportunity_id);

-- ------------------------------------------------------------------------------
-- 8. SCHOLAR NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES research_opportunities(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON notifications(created_at DESC);

-- ------------------------------------------------------------------------------
-- 9. TRANSACTIONAL OUTBOX PATTERN (DISTRIBUTED EVENT CONSISTENCY)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    retry_count INT NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_outbox_status_created ON outbox_events(status, created_at ASC);

-- ------------------------------------------------------------------------------
-- 10. IMMUTABLE CRYPTOGRAPHIC AUDIT LEDGER (SHA-256 MERKLE CHAIN)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL, -- H_n = SHA256(H_n-1 || payload || timestamp)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_hash ON audit_logs(current_hash);

-- ------------------------------------------------------------------------------
-- 11. COLLABORATIVE WORKSPACES & GROUP PROJECTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS group_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    visibility VARCHAR(50) NOT NULL DEFAULT 'PUBLIC',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    target_grant_id UUID,
    linked_dois JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_owner ON group_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON group_projects(status);

CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES group_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credit_role VARCHAR(50) NOT NULL DEFAULT 'Co-Author',
    status VARCHAR(50) NOT NULL DEFAULT 'ACCEPTED',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_user_member UNIQUE (project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_pm_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_pm_user ON project_members(user_id);

CREATE TABLE IF NOT EXISTS project_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES group_projects(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pal_project ON project_activity_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_pal_actor ON project_activity_logs(actor_id);

-- ------------------------------------------------------------------------------
-- 12. ACADEMIC COMMUNITY & DISCOURSE NETWORK
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'scientific_inquiry',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    doi_reference VARCHAR(255),
    opportunity_id UUID,
    collaboration_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    metrics JSONB NOT NULL DEFAULT '{"comments": 0, "saves": 0, "shares": 0, "likes": 0}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ap_author ON academic_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_ap_type ON academic_posts(type);
CREATE INDEX IF NOT EXISTS idx_ap_created_at ON academic_posts(created_at DESC);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES academic_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);

CREATE TABLE IF NOT EXISTS post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES academic_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(50) NOT NULL DEFAULT 'ENDORSE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_post_user_reaction UNIQUE (post_id, user_id, reaction_type)
);

CREATE INDEX IF NOT EXISTS idx_reactions_post ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON post_reactions(user_id);

-- ------------------------------------------------------------------------------
-- 13. SCHOLAR CONNECTIONS & COLLABORATION MESH
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scholar_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    academic_context VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_scholar_connection UNIQUE (requester_id, addressee_id)
);

CREATE INDEX IF NOT EXISTS idx_sc_requester ON scholar_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_sc_addressee ON scholar_connections(addressee_id);

CREATE TABLE IF NOT EXISTS scholar_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_scholar_follow UNIQUE (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_sf_follower ON scholar_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_sf_following ON scholar_follows(following_id);

-- ------------------------------------------------------------------------------
-- 14. EVIDENCE-BASED RESEARCH CONTRIBUTIONS & ATTRIBUTION LEDGER
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES group_projects(id) ON DELETE SET NULL,
    output_ref VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'CAMBIUM',
    external_id VARCHAR(255),
    evidence_url VARCHAR(1000),
    verification_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
    visibility VARCHAR(50) NOT NULL DEFAULT 'PUBLIC',
    credit_roles JSONB DEFAULT '[]'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contrib_actor_date ON research_contributions(actor_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_contrib_actor_type ON research_contributions(actor_id, event_type);
CREATE INDEX IF NOT EXISTS idx_contrib_actor_output ON research_contributions(actor_id, output_ref);
CREATE INDEX IF NOT EXISTS idx_contrib_actor_source_ext ON research_contributions(actor_id, source, external_id);
