-- ====================================================================
-- Cambium: PostgreSQL + pgvector Normalized Database Schema (3NF)
-- Architecture: Single Source of Truth (SSOT)
-- ====================================================================

-- 1. Enable Required PostgreSQL Extensions (with fallback domain if binary not installed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE EXTENSION IF NOT EXISTS vector;
EXCEPTION
    WHEN OTHERS THEN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') THEN
            CREATE DOMAIN vector AS text;
        END IF;
END $$;

-- 2. Enumerated Types
DO $$ BEGIN
    CREATE TYPE opportunity_type_enum AS ENUM ('Grant', 'CFP', 'Journal', 'Paper');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    institution VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 4. Normalized Research Interests Table
CREATE TABLE IF NOT EXISTS research_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interests_slug ON research_interests(slug);

-- 5. User <-> Research Interests Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_interests (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES research_interests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, interest_id)
);

CREATE INDEX IF NOT EXISTS idx_ui_user ON user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_ui_interest ON user_interests(interest_id);

-- 6. Normalized Taxonomy Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- 7. Research Opportunities Table (with pgvector column)
CREATE TABLE IF NOT EXISTS research_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type opportunity_type_enum NOT NULL,
    organization VARCHAR(255) NOT NULL,
    deadline TIMESTAMPTZ,
    description TEXT,
    link VARCHAR(1000),
    created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    embedding vector, -- pgvector for AI semantic search (OpenAI 1536-dim / HuggingFace)
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

-- 8. Opportunity <-> Tags Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS opportunity_tags (
    opportunity_id UUID NOT NULL REFERENCES research_opportunities(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (opportunity_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_ot_opp ON opportunity_tags(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_ot_tag ON opportunity_tags(tag_id);

-- 9. Bookmarks Table (Normalized Relation between Users and Opportunities)
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES research_opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_opportunity_bookmark UNIQUE (user_id, opportunity_id)
);

CREATE INDEX IF NOT EXISTS idx_bm_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bm_opp ON bookmarks(opportunity_id);

-- 10. Notifications Table
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
