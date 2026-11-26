# Authorization-First Hybrid Retrieval Architecture (`05`)

**Program**: Cambium Research Principal AI Engineering Program

---

## 1. Security Fix in Catalog Vector Search (`HybridSearchService`)
- Replaced string-interpolated `'${vectorLiteral}'::vector` in [`hybrid-search.service.ts`](../../server/src/modules/opportunities/hybrid-search.service.ts) with bound TypeORM parameter `:vectorLiteral::vector`.
- Bounded `fallbackInMemorySemanticSearch()` with `.take(200)` to prevent loading unbounded catalog tables into Node memory on degraded PG paths.

## 2. Pre-Ranking Authorization Filtering (`DocumentRetrievalService`)
Implemented in [`document-retrieval.service.ts`](../../server/src/modules/ai/document-retrieval.service.ts):
- Applies SQL ACL filters (`visibility = 'PUBLIC'`, `ownerId = :callerId`, `(visibility = 'WORKSPACE' AND workspaceId IN (:...wsIds))`, `(visibility = 'ORGANIZATION' AND organizationId = :orgId)`) **inside the TypeORM QueryBuilder before HNSW cosine ranking or lexical scoring**.
- Eliminates duplicate chunks by `contentHash`, supports `maxCosineDistance` cutoffs, and combines vector + lexical ranks via Reciprocal Rank Fusion (`RRF_K = 60`).
