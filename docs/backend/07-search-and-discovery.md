# Search & Discovery Architecture (`07`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Hybrid Lexical + Semantic Retrieval (`OpportunitiesModule`)
- **Vector Retrieval**: PostgreSQL `pgvector` `vector(768)` embeddings generated via Gemini embedding service with an `HNSW` cosine distance index (`idx_opps_embedding_hnsw` in `schema.sql`).
- **Lexical Retrieval**: PostgreSQL English `to_tsvector` `GIN` index (`idx_opps_fts`) alongside `ILIKE` / normalized `tags` filters.
- **Fusion**: Reciprocal Rank Fusion (`RRF_K = 60`) implemented in [`HybridSearchService`](../../server/src/modules/opportunities/hybrid-search.service.ts).

## 2. Hardening Applied
- Bounded `HybridSearchService.search` (`limit` clamped `[1..100]`), `OpportunitiesService.findAll` (`page` + `limit` `[1..100]`), `getUpcomingDeadlines` (`<= 100`), and `getRecommendations` (`[1..50]`).
- Added `FilterOpportunityDto` `@Type(() => Number) @IsInt() @Min(1) @Max(100)` validation.
- Added composite index `idx_opps_type_deadline` (`research_opportunities(type, deadline)`) and GIN index `idx_ap_tags_gin` (`academic_posts(tags)`).
- Remaining Limitation: Retrieval precision/recall (`nDCG`) benchmarking requires an annotated scholarly relevance dataset on live pgvector rows and was not executed offline.
