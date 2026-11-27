# PostgreSQL Query Analysis & Index Engineering Audit

**Audit Tool:** [`scripts/perf/pg-explain-audit.mjs`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/scripts/perf/pg-explain-audit.mjs)  
**Migration:** [`004_performance_indexes.sql`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/database/migrations/004_performance_indexes.sql)

## 1. Local PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` Measurements

Observed against local `cambium` PostgreSQL (`localhost:5432`):

| Query | Plan Nodes Observed | Execution Time | Planning Time | Assessment |
| :--- | :--- | :--- | :--- | :--- |
| **GIN Full-Text Search (`idx_opps_fts`)** | `Limit -> Bitmap Heap Scan -> Bitmap Index Scan(idx_opps_fts)` | `2.217 ms` | `40.647 ms` (cold) | Confirmed index scan after switching from wildcard `ILIKE` to `websearch_to_tsquery` |
| **Upcoming Deadlines** | `Limit -> Index Scan(idx_opps_deadline)` | `0.065 ms` | `0.519 ms` | Direct index scan |
| **Filtered Catalog Sort** | `Limit -> Sort -> Seq Scan` (pre-004, small dev table) | `3.588 ms` | `34.117 ms` | Intentional seq scan on small tables; `idx_opps_type_created_at` accelerates when rows grow |
| **Notifications Inbox** | `Limit -> Sort -> Seq Scan` (pre-004, small dev table) | `0.315 ms` | `6.280 ms` | `idx_notif_user_created` eliminates sort spill at `>10k` notifications per user |

## 2. Documented Index Inventory (`004_performance_indexes.sql`)

| Index Name | Target Table & Columns | Query Accelerated | Write & Storage Trade-Off | Overlap Check |
| :--- | :--- | :--- | :--- | :--- |
| `idx_opps_type_created_at` | `research_opportunities(type, created_at DESC)` | `GET /api/v1/opportunities?type=Grant` sorted newest first | Minimal (~24 bytes/row B-tree; low write rate relative to reads) | Strictly extends single-col `idx_opps_type` to cover sort order |
| `idx_opps_upcoming_deadline` | `research_opportunities(deadline ASC) WHERE deadline IS NOT NULL` | `getUpcomingDeadlines()` partial deadline filter | Zero overhead for evergreen journals/papers with `deadline IS NULL` | Partial predicate reduces index size vs full `idx_opps_deadline` |
| `idx_proposals_dept_status` | `proposals(department_id, status)` | Department institutional review & status queues | Negligible overhead (low-frequency proposal state changes) | Covers `(department_id, status)` composite predicate |
| `idx_notif_user_created` | `notifications(user_id, created_at DESC)` | `NotificationsService.findByUserId` | Small B-tree append per notification | Paired with `idx_notif_user_unread` for unread count |

## 3. Connection Pool & pgvector Safety

- **Pool Bounds (`database.config.ts`)**: `max = 20`, `idleTimeoutMillis = 30000`, `connectionTimeoutMillis = 5000`, `statement_timeout = 15000`.
- **pgvector Query Fix (`HybridSearchService`)**: Parameterized `opp.embedding <=> :vectorLiteral::vector` via `.setParameter('vectorLiteral', vectorLiteral)` and capped fallback in-memory vector scan at `.take(250)`.
