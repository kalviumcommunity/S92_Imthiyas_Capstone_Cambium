# Cambium Research — Performance & Caching Regression Testing

## 1. Verified Performance Controls

1. **Multi-Tier Cache (`server/src/modules/performance/multi-tier-cache.service.spec.ts`)**:
   - Verifies L1/L2 cache hit paths, TTL expiration, and scoped invalidation.
2. **Cursor Pagination Bounds (`server/src/modules/performance/cursor-pagination.util.spec.ts`)**:
   - Verifies opaque cursor encode/decode determinism and clamped page-size limits without unbounded `OFFSET` scans.
3. **Edge Cache & ETag Interceptors (`server/src/common/interceptors/edge-cache.interceptor.spec.ts`, `server/src/modules/network/etag.interceptor.spec.ts`)**:
   - Verifies `Cache-Control` / `stale-while-revalidate` headers and conditional `ETag` `304 Not Modified` semantics.
4. **Rate Limiter Guard (`server/src/modules/network/network-rate-limiter.guard.spec.ts`)**:
   - Verifies bounded request throttling behavior under burst traffic.
