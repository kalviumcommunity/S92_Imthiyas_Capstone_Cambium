# Sprint 05: Performance Engineering & Optimization

## Executive Summary & Architecture Blueprint
**Sprint ID**: `SPRINT-05-PERFORMANCE-ENGINEERING`  
**Status**: `COMPLETED`  
**Budget**: `₹0 (Zero Paid Services, L1 In-Memory Map LRU + L2 Redis + Keyset Pagination + HNSW pgvector)`  
**Authors**: Cambium Research Platform Core Engineering  

Sprint 05 delivers high-throughput optimizations, sub-millisecond multi-tier caching, constant-time keyset/cursor pagination, and client-side query caching optimizations.

---

## 1. Multi-Tier High-Performance Caching Architecture

```
                 [ Incoming Read Requests (e.g. /opportunities/stats) ]
                                          |
                                          v
                 +----------------------------------------------------+
                 |               MultiTierCacheService                |
                 |                                                    |
                 |   1. L1 Memory Cache (Map + LRU Eviction + TTL)    |
                 |      Latency: < 0.05 ms | Size: 1,000 hot keys     |
                 |                                                    |
                 |   2. L2 Redis Distributed Cache                    |
                 |      Latency: ~ 1-2 ms | Key namespace: cambium:   |
                 |      (Graceful in-memory fallback if detached)     |
                 +------------------------+---------------------------+
                                          |
                                    Cache Miss
                                          v
                 +----------------------------------------------------+
                 |               PostgreSQL 16 Database               |
                 |  - HNSW Indexing on 768-dim embeddings (pgvector)  |
                 |  - Keyset / Cursor Pagination O(1) Index Seeks     |
                 +----------------------------------------------------+
```

---

## 2. Deterministic Keyset / Cursor Pagination (`CursorPaginationUtil`)

Traditional `OFFSET` pagination exhibits $O(N)$ execution degradation as pagination deepens, forcing PostgreSQL to scan and discard discarded records. Cambium's keyset seek replaces offset traversal with index-seek lookups:

```sql
-- Keyset seek filter (deterministic O(1) seek execution)
WHERE (opp.createdAt < :cursorSort OR (opp.createdAt = :cursorSort AND opp.id < :cursorId))
ORDER BY opp.createdAt DESC, opp.id DESC
LIMIT :limit + 1;
```

- **Opaque Cursor**: URL-safe base64 string encoding `{ s: sortVal, i: idVal }`.
- **HasMore Probing**: Queries `LIMIT + 1` to verify remaining entries without executing expensive separate `COUNT(*)` table scans.

---

## 3. Telemetry & Observability Endpoints

1. **`GET /api/v1/performance/metrics`**:
   - Live cache telemetry: `hits`, `misses`, `hitRatio`, `l1Entries`, and `l2Status`.
   - Node memory consumption (`rssMb`, `heapUsedMb`, `externalMb`).
   - Active database indexing strategy report.
2. **`POST /api/v1/performance/cache/purge`**:
   - Atomic cache eviction by key prefix or full L1 memory flush.

---

## 4. Client-Side Query Optimization (`QueryProvider`)
- **Stale Time Window**: Configured to 5 minutes (`300,000ms`), preventing redundant background network re-fetches when scholars switch browser tabs.
- **Garbage Collection Window**: 30 minutes in-memory retention for instant navigation across previously visited routes.
- **Window Focus Refetch**: Disabled for stable read states, eliminating spurious micro-bursts on focus.
- **Reconnect Recovery**: Enabled (`refetchOnReconnect: true`) with exponential retry backoff.

---

## 5. Verification & Quality Gates
- **Zero Paid Dependencies**: Native memory mapping and standard algorithms.
- **Unit Test Coverage**: Full pass rate across `multi-tier-cache.service.spec.ts` and `cursor-pagination.util.spec.ts`.
