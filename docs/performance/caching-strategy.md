# Multi-Tier & Edge Caching Strategy (Phase 6)

## 1. Singleflight Stampede Prevention & LRU L1 (`MultiTierCacheService`)
- **Singleflight Coalescing**: `wrap(key, factory, ttlSeconds)` tracks `inflightFactories` so simultaneous misses on expired hot keys execute the underlying DB query exactly once.
- **LRU Promotion**: `get(key)` refreshes key order in `Map` so active hot keys stay resident while cold entries evict at `maxL1Entries = 1000`.
- **Non-Blocking Invalidations**: `invalidateByPrefix()` uses cursor-based Redis `SCAN` (`COUNT 100`) instead of `KEYS *` so key invalidations do not block the Redis event loop.

## 2. Authorization-Isolated HTTP / CDN Caching (`EdgeCacheInterceptor`)
- Sets `Vary: Authorization, Accept-Encoding` on cached read responses.
- Any request containing `Authorization` headers or cookies automatically bypasses public CDN caching and receives `Cache-Control: private, no-store`, `CDN-Cache-Control: no-store`, and `Cloudflare-CDN-Cache-Control: no-store` to prevent cross-user data leakage.
- Unauthenticated public catalog hits receive `Cache-Control: public, max-age=..., s-maxage=..., stale-while-revalidate=...` + strong ETag (`304 Not Modified`).
