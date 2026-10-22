import { SetMetadata } from '@nestjs/common';

export interface EdgeCacheOptions {
  maxAge?: number; // Browser cache duration (seconds)
  sMaxAge?: number; // Cloudflare / CDN edge cache duration (seconds)
  staleWhileRevalidate?: number; // Serve stale while background revalidating (seconds)
  tags?: string[]; // Cloudflare Cache-Tag headers for targeted purging
  public?: boolean;
}

export const EDGE_CACHE_METADATA_KEY = 'EDGE_CACHE_METADATA_KEY';

/**
 * Enterprise Multi-Tier Edge Caching Decorator
 * Emits RFC-compliant Cache-Control and Cloudflare Enterprise CDN headers
 */
export const EdgeCache = (
  options: EdgeCacheOptions = {
    maxAge: 3600,
    sMaxAge: 86400,
    staleWhileRevalidate: 86400,
    tags: ['cambium-catalog'],
    public: true,
  },
) => SetMetadata(EDGE_CACHE_METADATA_KEY, options);
