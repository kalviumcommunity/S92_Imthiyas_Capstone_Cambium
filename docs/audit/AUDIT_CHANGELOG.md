# 📜 Audit Changelog & Version History
## Chronological Record of Technical Modifications, File Additions & Audit Gates
**Author & Lead Architect**: Shaik Mohamed Imthiyas T  
**Document ID**: `AUDIT-LOG-CAMBIUM-2026-V1`

---

## [2.1.0] — 2026-10-22

### Curriculum Remediation & Audit Completion
- **Added**:
  - `server/src/modules/upload/upload.service.ts`: Comprehensive multipart research artifact upload engine with path sanitization, extension checking, size capping, and SHA-256 calculation.
  - `server/src/modules/upload/upload.controller.ts`: Controller exposing `/api/upload` endpoints for single, batch, metadata retrieval, and deletion operations.
  - `server/src/modules/upload/upload.module.ts`: NestJS module bundling upload services.
  - `server/src/modules/upload/upload.service.spec.ts`: 12 automated unit tests validating path traversal rejection, extension security, and deletion lifecycles.
  - `server/uploads/artifacts/.gitkeep`: Initialized secure upload storage folder.
  - Complete Bruno API collection in `bruno/` with 37 `.bru` test files spanning `Auth`, `App`, `Bookmarks`, `Notifications`, `Relationships`, `Research Opportunities`, `Upload`, and `Users`.
  - 9-part comprehensive audit documentation suite in `docs/audit/`:
    - `docs/audit/EXECUTIVE_SUMMARY.md`
    - `docs/audit/REQUIREMENT_TRACEABILITY_MATRIX.md`
    - `docs/audit/TEST_RESULTS.md`
    - `docs/audit/API_INVENTORY.md`
    - `docs/audit/DATABASE_AND_ARCHITECTURE_AUDIT.md` (Including ADR-003)
    - `docs/audit/SECURITY_AUDIT.md`
    - `docs/audit/REMEDIATION_PLAN.md`
    - `docs/audit/TECHNICAL_DEFENSE_CHECKLIST.md`
    - `docs/audit/AUDIT_CHANGELOG.md`
- **Modified**:
  - `server/src/app.module.ts`: Registered `UploadModule` in NestJS root application imports.
  - `client/app/(protected)/workspace/upload/page.tsx`: Integrated real `POST /api/upload` multipart form submission with simulated fallback.
  - `.gitignore`: Added `server/uploads/artifacts/*` with exception for `.gitkeep`.
- **Verification**:
  - Backend Vitest test suite: `13 passed (13), 49 passed (49)` in 2.17s.
  - Backend TypeScript compilation: `PASSED (0 errors)`.
  - Frontend Next.js 15 build: `PASSED (49/49 static pages generated)`.

---

## [2.0.0] — 2026-10-15

### Frontend UI & Architecture Roadmap Stages 1–14
- Shipped 14 comprehensive release stages (`fbc1e54` through `b98277c`).
- Established Living Materials Design System and Dendrochronology landing page.
- Created 23 enterprise routes across Discovery, Operations, Governance, and Dissemination.
- Implemented force-directed physics graph in `/graph`.
- Integrated Socket.io real-time chat gateway and Server-Sent Events stream.

---

<div align="center">
  <sub>Audit Changelog · Document ID: AUDIT-LOG-CAMBIUM-2026-V1 · Verified for Academic Year 2026</sub>
</div>
