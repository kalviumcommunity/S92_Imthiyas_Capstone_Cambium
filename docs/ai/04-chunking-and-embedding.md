# Chunking & Embedding Strategy (`04`)

**Program**: Cambium Research Principal AI Engineering Program

---

## 1. Heading- & Token-Aware Overlapping Chunking
Implemented in [`DocumentParserService`](../../server/src/modules/reader/document-parser.service.ts):
- Detects academic headers (`Abstract`, `Introduction`, `Related Work`, `Methods`, `Results`, `Discussion`, `Conclusion`, `References`) and numbered section titles.
- Targets `1400` characters (~350 tokens) per chunk with `180`-character (~45 token) trailing sentence overlap when splitting long sections so claims crossing paragraph boundaries retain context.
- Rejects zero-dim/mismatched vectors and tracks `embeddingModel` (`gemini-embedding-001`) + `embeddingVersion` (`v1-768d`) per chunk row to prevent silently mixing incompatible vector spaces.
