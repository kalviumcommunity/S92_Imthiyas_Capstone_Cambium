# Search & Discovery Performance Engineering (Phase 5)

## Hybrid Search Pipeline (`HybridSearchService`)
- **Vector Semantic Path**: Uses parameterized `opp.embedding <=> :vectorLiteral::vector` over HNSW (`idx_opps_embedding_hnsw`) joined only with minimal creator summary columns (`id, fullName, organization`).
- **Lexical Full-Text Path**: Queries length `>= 3` execute PostgreSQL GIN `to_tsvector @@ plainto_tsquery` ranked via `ts_rank(...) DESC`; short queries (`< 3` chars) retain bounded `ILIKE`.
- **Reciprocal Rank Fusion & Caps**: `search()` clamps external `limit` (`1..50`) and caps `fallbackInMemorySemanticSearch()` at `.take(200)` rather than loading unbounded table vectors into Node.js memory.
- **Quality + Latency Preservation**: Retains `k=60` RRF fusion weighting both semantic proximity and exact lexical/tag matches.
