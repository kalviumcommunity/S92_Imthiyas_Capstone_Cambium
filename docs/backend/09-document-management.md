# File & Document Lifecycle (`09`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Upload, Ownership & Processing Architecture
- **Ingestion Endpoint (`UploadController`)**: Requires `JwtAuthGuard`, assigns `uploaderId = user.id` server-side, verifies file signatures via `UploadService.validateMagicBytes` (blocking PE `MZ`, ELF, `#!`, `<script>`, removing permissive `application/octet-stream`), and computes SHA-256 hashes.
- **Access & Download Controls**: Enforces `ParseUUIDPipe` and caller ownership checks (`uploaderId === user.id || SuperAdmin`) across metadata listing, binary streaming (`X-Content-Type-Options: nosniff`, `Cache-Control: private, no-store`, RFC 5987 filename), OCR table/text extraction, and deletion.
- **Alignment with Security Program**: Upload storage controls coordinate with Sprint 3 of `docs/security/07-file-and-ai-security.md` and `UploadService` unit tests.
