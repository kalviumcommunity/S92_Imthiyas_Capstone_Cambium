# Document Ingestion & Provenance Pipeline (`03`)

**Program**: Cambium Research Principal AI Engineering Program

---

## 1. Ingestion & Storage Schema (`document_chunks`)
Authored in [`003_ai_rag_and_memory.sql`](../../server/src/database/migrations/003_ai_rag_and_memory.sql) and modeled in [`document-chunk.entity.ts`](../../server/src/modules/ai/entities/document-chunk.entity.ts):
- Preserves `documentId`, `ownerId`, optional `workspaceId`, `organizationId`, and `visibility` (`PRIVATE` | `WORKSPACE` | `ORGANIZATION` | `PUBLIC`).
- Preserves provenance metadata: `title`, `sectionHeader`, `pageNumber`, `chunkIndex`, SHA-256 `contentHash`, `embeddingModel`, `embeddingVersion`, and `metadata` JSONB.

## 2. Idempotent Processing & Deletion Propagation
- `DocumentParserService.ingestDocumentChunks()` hashes chunk content (`contentHash`) and compares the sequence against existing rows for `documentId`: unchanged manuscripts skip redundant re-embedding (`skippedUnchanged`).
- `DocumentParserService.deleteDocumentChunks(documentId, ownerId)` removes indexed vectors strictly scoped by `ownerId` so deleted or revoked files vanish from retrieval immediately.
