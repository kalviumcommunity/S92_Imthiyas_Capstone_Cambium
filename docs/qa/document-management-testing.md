# Cambium Research — Document Upload & Artifact Integrity Testing

## 1. Abuse & Polyglot Defenses Verified

`UploadService` (`server/src/modules/upload/upload.service.ts`) enforces strict defense-in-depth before persisting artifacts:

1. **Extension & MIME Allowlist**: Permits only `.pdf`, `.docx`, `.csv`, `.xlsx`, `.bib`, `.tex`, and `.json`.
2. **File Size Bounds**: Rejects zero-byte uploads (`400 Bad Request`) and payloads exceeding `50MB` (`413 Payload Too Large`).
3. **Magic-Byte Signature Inspection**: Rejects Windows `MZ` executables, Linux `\x7fELF` binaries, `#!` scripts, `<script` polyglots, non-`%PDF-` PDFs, and non-OOXML `.docx`/`.xlsx` files.
4. **Filename Sanitization**: Strips traversal segments (`../`, `..\`), null bytes, and leading dots before prefixing with a server-generated UUID.
5. **SHA-256 Digest & Owner-Scoped Access**: Computes SHA-256 checksums, strips absolute disk paths from API responses (`filePath: undefined`), and restricts downloads/deletions to the uploading researcher or `SuperAdmin`.
