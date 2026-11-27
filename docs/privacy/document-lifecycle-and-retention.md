# Cambium Research — Research Document & Artifact Lifecycle

## 1. Stage-by-Stage Controls

| Stage | Implementing Component | Access & Classification Control | Deletion & Failure Behavior |
| :--- | :--- | :--- | :--- |
| **1. Upload & Validation** | `UploadController`, `UploadService` | Checks extension/MIME allowlist, 50MB max, magic bytes (`MZ`/`ELF`/`<script` rejected), path-traversal filename sanitization | Rejects malformed input before disk write (`400`/`413`) |
| **2. Classification & Storage** | `UploadService.saveArtifact` | Assigns `dataClassification` (default `CONFIDENTIAL`), optional `workspaceId`, and `aiProcessingAllowed` (`false` for `RESTRICTED`), plus SHA-256 checksum | Stored outside web root (`uploads/artifacts/`); server filesystem path stripped from API listings |
| **3. OCR & Parsing** | `PdfOcrService`, `DocumentParserService` | Owner-checked in `UploadController.extractTablesFromArtifact` (`403` for non-owner unless `SuperAdmin`) | Runs in sandboxed worker fallback without transmitting binary bytes externally |
| **4. Embeddings & Retrieval** | `GeminiEmbeddingService`, `HybridSearchService` | Source permissions must pass before `artifactId`/`workspaceId` context enters `AssistantService` | Derived embeddings must not bypass workspace/owner ACLs |
| **5. External AI Dispatch** | `AssistantService` | Requires `aiProcessingConsent === true` AND non-`RESTRICTED` artifact flag | Falls back to local synthesis (`local_only_no_external_dispatch`) if unauthorized or unconsented |
| **6. Deletion & Propagation** | `UploadService.deleteArtifact`, `deleteArtifactsByOwner`, `PrivacyService.executeAccountErasure` | Owner-only or erasure flow unlinks disk file, deletes metadata entry, invalidates user L1/L2 cache prefixes (`user:{id}`) | Cryptographic audit chain & scheduled Postgres backups remain under documented retention exceptions |
