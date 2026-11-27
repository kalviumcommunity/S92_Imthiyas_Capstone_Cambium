-- ==============================================================================
-- Migration 004: Targeted Composite & Partial Performance Indexes
-- Zero-downtime idempotent index additions for hot query paths.
-- ==============================================================================

-- 1. Accelerates filtered opportunity catalog queries (WHERE type = ? ORDER BY created_at DESC)
CREATE INDEX IF NOT EXISTS idx_opps_type_created_at
  ON research_opportunities(type, created_at DESC);

-- 2. Partial index for upcoming grant/CFP deadlines (skips null deadlines to minimize write & storage cost)
CREATE INDEX IF NOT EXISTS idx_opps_upcoming_deadline
  ON research_opportunities(deadline ASC)
  WHERE deadline IS NOT NULL;

-- 3. Composite index for departmental proposal & governance dashboards (department isolation + workflow filter)
CREATE INDEX IF NOT EXISTS idx_proposals_dept_status
  ON proposals(department_id, status);

-- 4. Composite inbox sort index for scholar notification feeds
CREATE INDEX IF NOT EXISTS idx_notif_user_created
  ON notifications(user_id, created_at DESC);
