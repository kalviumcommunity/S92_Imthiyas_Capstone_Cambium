# Cambium Research — Phase 0 Architecture & Performance Risk Map

**Baseline Commit Anchor:** `main` (`f44db68`)  
**Stack Baseline:** Next.js 16 + React 19 (Vercel) · NestJS 12 + TypeORM (Render Starter) · PostgreSQL 16 + pgvector HNSW (Render / Supabase)

---

## 1. Current Execution Architecture

```
Browser (React 19 + TanStack Query v5)
  ├── Public/Landing Routes (mostly "use client", monolithic client/app/page.tsx)
  ├── Static Assets (images.unoptimized: true in next.config.ts)
  └── API Calls (apiFetch w/ retry & X-Request-Id)
        └── NestJS 12 API (Render Starter, Express 2MB limit, 120 req/min guard)
              ├── MultiTierCacheService (L1 Map <=1000 keys + optional L2 Redis)
              ├── QueueService (BullMQ if Redis configured, else PG BackgroundJob worker pool=3)
              └── PostgreSQL 16 + pgvector (Pool max=20, stmt_timeout=15000ms)
```

---

## 2. Ranked Bottleneck & Risk Inventory (Observed in Code)

| Rank | Location | Measured / Code Evidence | Risk Under Load |
| :--- | :--- | :--- | :--- |
| **P0** | [`hybrid-search.service.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/opportunities/hybrid-search.service.ts#L155-L265) | Lexical search uses `ILIKE '%query%'` bypassing `idx_opps_fts` GIN index; semantic query interpolates `${vectorLiteral}` instead of bound params; in-memory fallback calls `.getMany()` across entire table without `.take()` and parses JSON strings synchronously on the Node event loop. | Sequential scans, high CPU/heap spikes, and SQL plan thrashing as opportunity count grows. |
| **P0** | [`opportunities.service.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/opportunities/opportunities.service.ts#L37-L65), [`bookmarks.service.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/bookmarks/bookmarks.service.ts#L21-L32) | `findAll()` & `getUpcomingDeadlines()` run unbounded `.getManyAndCount()` / `.getMany()` queries and eagerly join full `user` entities without column projection. | Linear payload bloat (`MBs` of JSON), slow serialization, high GC pressure. |
| **P1** | [`assistant.service.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/assistant/assistant.service.ts#L210), [`gemini-embedding.service.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/ai/gemini-embedding.service.ts#L42), [`auth.service.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/auth/auth.service.ts#L216) | Outbound `fetch(...)` calls lack `AbortSignal.timeout(...)` and HTTP routes lack a global non-streaming timeout interceptor. | Hanging Gemini/Google OAuth sockets hold Node HTTP workers open indefinitely. |
| **P1** | [`client/app/page.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/app/page.tsx), [`client/next.config.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/next.config.ts#L18) | `3,904`-line landing page bundles below-the-fold graph/collage/hex widgets eagerly; `images.unoptimized: true` disables Vercel image resizing; `/backgrounds/*` lacks immutable `Cache-Control`; zero Web Vitals (`LCP`, `INP`, `CLS`) instrumentation. | Elevated client JS hydration cost and repeat image byte transfer on mobile/slow networks. |
| **P2** | [`notifications.service.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/notifications/notifications.service.ts#L42-L53) | `findByUserId` performs sequential `findAndCount` + `count({ isRead: false })`. Missing composite indexes `(type, created_at DESC)`, `(deadline)`, and `(department_id, status)`. | Redundant DB round-trips per inbox poll and sort work on filtered catalog pages. |

---

## 3. Infrastructure Constraints

- **Render Starter (`render.yaml`)**: Single Node API instance, limited RAM/CPU; single PostgreSQL 16 instance (`DB_POOL_MAX=20` keeps headroom below typical managed PG limits when combined with background pollers).
- **Vercel (`vercel.json`)**: Edge CDN for static bundles and image optimization when not in `standalone` Docker mode.
- **No Premature Infra**: Keep existing NestJS monolith + PostgreSQL 16 + `MultiTierCacheService` (L1 + optional Redis) cleanly tuned rather than introducing microservices, Kafka, or Elasticsearch.
