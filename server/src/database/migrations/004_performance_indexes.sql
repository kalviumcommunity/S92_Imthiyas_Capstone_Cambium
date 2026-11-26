-- ==============================================================================
-- CAMBIUM PERFORMANCE ENGINEERING
-- MIGRATION 004: KEYSET PAGINATION, PARTIAL & FULL-TEXT GIN INDEXES
-- Safe, additive, idempotent DDL verified against schema.sql tables
-- ==============================================================================

-- 1. Keyset / Cursor Seek Index for paginated Opportunities listing
CREATE INDEX IF NOT EXISTS idx_opps_created_id_desc
  ON public.research_opportunities (created_at DESC, id DESC);

-- 2. Partial B-Tree Index for Upcoming Deadlines endpoint
CREATE INDEX IF NOT EXISTS idx_opps_deadline_active
  ON public.research_opportunities (deadline ASC)
  WHERE deadline IS NOT NULL;

-- 3. Combined Title + Organization + Description English GIN FTS Index
CREATE INDEX IF NOT EXISTS idx_opps_fts_full
  ON public.research_opportunities
  USING gin (
    to_tsvector(
      'english',
      COALESCE(title, '') || ' ' || COALESCE(organization, '') || ' ' || COALESCE(description, '')
    )
  );

-- 4. Composite Timeline Indexes eliminating filesorts on hot collaborative reads
CREATE INDEX IF NOT EXISTS idx_wc_project_created
  ON public.workspace_comments (project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pal_project_created
  ON public.project_activity_logs (project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_room_created
  ON public.chat_messages (room_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ap_type_created
  ON public.academic_posts (type, created_at DESC);
