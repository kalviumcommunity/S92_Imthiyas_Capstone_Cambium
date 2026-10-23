# 🛠️ Audit Remediation Plan & Backlog
## Prioritized Action Items, Technical Debt Elimination & Engineering Milestones
**Author & Lead Architect**: Shaik Mohamed Imthiyas T  
**Document ID**: `AUDIT-REMED-CAMBIUM-2026-V1`  
**Classification**: P0 (Immediate) → P3 (Future Optimization)

---

## 1. Remediation Status Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          REMEDIATION COMPLETION SUMMARY                     │
├──────────┬─────────────────────────────┬──────────┬─────────────────────────┤
│ Priority │ Category                    │ Status   │ Resolution Details      │
├──────────┼─────────────────────────────┼──────────┼─────────────────────────┤
│ **P0**   │ M2.14 File Upload Engine    │ RESOLVED │ UploadService & Tests   │
│ **P0**   │ M2.15 Bruno API Suite       │ RESOLVED │ 37 .bru files created   │
│ **P1**   │ Static Client 49 Pages      │ RESOLVED │ 100% prerendered clean  │
│ **P1**   │ Multi-Stage Dockerfile      │ BACKLOG  │ Production container    │
│ **P2**   │ GitHub Actions CI Workflow  │ BACKLOG  │ Automated pull request  │
│ **P2**   │ OpenTelemetry & Sentry      │ BACKLOG  │ Distributed APM tracing │
│ **P3**   │ Automated S3 Backup Scripts │ BACKLOG  │ Encrypted WAL archiving │
└──────────┴─────────────────────────────┴──────────┴─────────────────────────┘
```

---

## 2. Completed Remediations (During Audit Cycle)

### [RESOLVED] P0: Research Artifact Upload Engine (`M2.14`)
- **Issue**: Client `/workspace/upload` lacked a dedicated backend multipart file upload engine, with potential path traversal vulnerabilities if raw filenames were passed directly to the filesystem.
- **Root Cause**: Backend modules focused on metadata CRUD and vector embeddings; file storage controller had not been finalized.
- **Fix Implemented**:
  - Created `UploadService`, `UploadController`, and `UploadModule` in `server/src/modules/upload/`.
  - Implemented multi-tier path traversal protection:
    ```typescript
    const sanitized = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    ```
  - Added 50MB payload limits, extension whitelisting (`.pdf`, `.docx`, `.bib`, `.csv`, `.tex`), and SHA-256 binary hashing.
  - Implemented 12 unit tests in `upload.service.spec.ts` testing security boundaries and disk unlinking.
  - Updated client `client/app/(protected)/workspace/upload/page.tsx` with real `FormData` POST and resilient offline fallback.

### [RESOLVED] P0: Complete Bruno API Collection (`M2.15`)
- **Issue**: Only a partial collection existed in `bruno/`, missing auth, upload, and health endpoints.
- **Fix Implemented**:
  - Authored 37 `.bru` files in `bruno/` covering `Auth/`, `App/`, `Bookmarks/`, `Notifications/`, `Relationships/`, `Research Opportunities/`, `Upload/`, and `Users/`.
  - Configured `bruno/environments/Local.bru` with `baseUrl: http://localhost:3001` and automated Chai assertions.

---

## 3. Prioritized Engineering Backlog for General Availability (GA)

### P1: Multi-Stage Production Docker Containers
- **Goal**: Package Next.js 15 client (`standalone` mode) and NestJS server into optimized Alpine Docker images under 150MB each.
- **Action Items**:
  1. Create `client/Dockerfile` using Node 20-alpine with multi-stage build (`builder` -> `runner`).
  2. Create `server/Dockerfile` compiling TypeScript to `dist/` and trimming devDependencies.
  3. Orchestrate with `docker-compose.yml` linking Postgres 16 (pgvector) and Redis 7.2.

### P2: Automated GitHub Actions CI/CD Pipeline
- **Goal**: Block broken pull requests before merging into `main`.
- **Action Items**:
  1. Author `.github/workflows/ci.yml` running:
     - `npm --prefix client run lint && npm --prefix client run build`
     - `npm --prefix server run lint && npm --prefix server run test && npm --prefix server run build`

### P2: Distributed Tracing & Observability
- **Goal**: Monitor real-time latency of Gemini embeddings and pgvector queries.
- **Action Items**:
  1. Integrate OpenTelemetry SDK into `server/src/main.ts`.
  2. Instrument TypeORM query duration and Redis lock wait times.

---

<div align="center">
  <sub>Remediation Plan & Backlog · Document ID: AUDIT-REMED-CAMBIUM-2026-V1 · Verified for Academic Year 2026</sub>
</div>
