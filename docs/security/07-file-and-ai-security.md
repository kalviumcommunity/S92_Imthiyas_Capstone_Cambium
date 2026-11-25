# File Upload, AI/RAG Isolation & SSRF Defence (`07`)

**Program**: Cambium Research Security Hardening Program  
**Baseline**: OWASP ASVS V5/V12, OWASP LLM Top 10, OWASP API10:2023 (SSRF)

---

## 1. File Upload Security (`server/src/modules/upload/`)
- **Authenticated Ownership**: `UploadController` enforces `JwtAuthGuard`, `ParseUUIDPipe`, and `uploaderId` ownership verification across artifact listing, metadata retrieval, binary download, OCR extraction, and deletion.
- **Strict Magic-Byte Validation (`UploadService.validateMagicBytes`)**:
  - Removed permissive `application/octet-stream` fallback.
  - Explicitly blocks Windows PE (`MZ`), Linux ELF (`\x7fELF`), shebang scripts (`#!`), and active HTML/JS payloads (`<script`).
  - Enforces header signatures matching declared types (`%PDF-` for PDF, `PK\x03\x04` for DOCX, valid JSON parse for `.json`).
- **Safe Serving Headers**: Sets `X-Content-Type-Options: nosniff`, `Cache-Control: private, no-store`, and RFC 5987 sanitized `Content-Disposition`.

## 2. AI & RAG Security (`server/src/modules/assistant/`, `server/src/modules/ai/`)
- **Authentication & Abuse Guard Ordering**: `AssistantController` applies `JwtAuthGuard` **before** `SubscriptionGuard` so unauthenticated callers cannot reach subscription checks or LLM orchestration. `AiAutocompleteController` enforces `JwtAuthGuard` and `NetworkRateLimiterGuard`.
- **Prompt Injection Containment**: `AssistantService` encloses untrusted source documents and user excerpts in explicit `<untrusted_source_data>` XML delimiters paired with a system instruction prohibiting execution of embedded instructions from retrieved content.

## 3. SSRF Prevention (`server/src/common/security/ssrf-validator.ts`)
- `validateSafeExternalUrl()` enforces `https:` scheme only, rejects embedded URL credentials, blocks internal hostnames (`.local`, `.internal`, `metadata.google.internal`), rejects loopback/RFC1918/CGNAT/link-local/ULA IPs directly and post-DNS resolution.
