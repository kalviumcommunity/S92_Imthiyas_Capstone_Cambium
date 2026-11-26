# Cambium Research — Performance Reconnaissance & Bottleneck Audit (Phase 0)

**Document ID**: `PERF-CAMBIUM-AUDIT-2026`  
**Audit Date**: `2026-11-26`  
**Baseline Branch**: `main` (`f15662d`)  
**Scope**: Frontend (`Next.js 16`), Backend API (`NestJS 10`), Database (`PostgreSQL 16 + pgvector`), AI & Background Queues (`BullMQ / Postgres Fallback`).

---

## 1. Existing Performance Assets Already in Codebase
- [`MultiTierCacheService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/performance/multi-tier-cache.service.ts): L1 process-local Map + L2 Redis wrapper (`opp:stats:global` cached 120s).
- [`CursorPaginationUtil`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/performance/cursor-pagination.util.ts): Keyset seek helper (`LIMIT + 1` eliminating `COUNT(*)`), currently under-adopted across hot modules.
- [`EdgeCacheInterceptor`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/common/interceptors/edge-cache.interceptor.ts): RFC 9111 cache headers + MD5 ETag `304 Not Modified` short-circuiting.
- [`schema.sql`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/database/schema.sql): `idx_opps_embedding_hnsw` (`vector_cosine_ops`) + `idx_opps_fts` (GIN English FTS).

---

## 2. Verified Bottlenecks Uncovered

| Area | Location | Bottleneck Detail | Classification |
| :--- | :--- | :--- | :---: |
| **Unbounded List Endpoints** | `opportunities.service.ts#L37-L65,L122-L135` | `findAll()` & `getUpcomingDeadlines()` omit `.take()`/`.skip()`/cursor caps and eagerly join full `opp.createdBy` columns | **P0** |
| **N+1 Sequential Writes** | `opportunities.service.ts#L204-L246,L329-L348` | `resolveTags()` runs sequential `findOne` + `save` per tag; `bulkCreate()` repeats sequentially inside open DB transaction | **P1** |
| **Cartesian Feed Join** | `community.service.ts#L32-L56` | `getFeed()` joins `comments` + `commentAuthor` eagerly on 20 posts, multiplying returned SQL rows | **P1** |
| **Unbounded Vector Fallback** | `hybrid-search.service.ts#L177-L221` | `fallbackInMemorySemanticSearch()` runs `qb.getMany()` without `.take()` and parses JSON embeddings across all rows; primary vector literal lacks param bind on `main` | **P0** |
| **Cache Stampede & Auth Boundary** | `edge-cache.interceptor.ts#L32-L60`, `multi-tier-cache.service.ts` | `EdgeCacheInterceptor` lacks `Authorization`/cookie bypass & `Vary: Authorization`; `wrap()` lacks singleflight coalescing & true LRU promotion | **P1** |
| **Missing Composite/Keyset Indexes** | `schema.sql` | No `(created_at DESC, id DESC)` on `research_opportunities`, no `(project_id, created_at DESC)` on workspace/activity tables, no `organization` FTS GIN coverage | **P1** |
| **Frontend Monolith Bundles** | `client/app/(protected)/opportunities/page.tsx` (`2,008` lines), `graph/page.tsx` (`1,106` lines) | Static imports of canvas network visualizations and heavy modals bundled directly in route chunks | **P2** |
| **Unbounded Embedding Concurrency** | `QueueService`, `GeminiEmbeddingService` | No explicit single-process concurrency semaphore / batch size cap & no load benchmark harness | **P2** |
