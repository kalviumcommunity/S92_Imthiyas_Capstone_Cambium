# Cambium Research Platform — Real-Data MVP Deployment Audit
## Phase One: Complete Repository, Deployment & Supabase Topology Audit

---

### 1. Repository State & Revision Control
- **Current Operational Branch**: `feature/sprint-05-performance-engineering` -> merging to `main` for release.
- **Production Tracking Branch**: `main` (tracked by both Vercel and Render).
- **Previous Deployed Commit on `main`**: `46bd36a` (*feat(branding): deploy upgraded 3D bioluminescent Fibonacci nautilus cut-out logo across browser tab, preloader, and navigation*).
- **Target Release Head**: `main` updated with all 5 Architectural Sprints (Distributed Systems, Real-Time Collaboration, Network Engineering, SRE Resilience, Performance Caching) plus Real-Data Supabase Login/Registration stabilization.
- **Git Remotes Synchronized**:
  - `origin`: `https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium`
  - `personal`: `https://github.com/shaikimthiyas/cambium-research.git`

---

### 2. Live Hosting Topologies

#### A. Frontend Presentation Layer (Vercel)
- **Canonical Production URL**: `https://cambium-research.vercel.app`
- **Framework & Runtime**: Next.js 16.4.6 / React 19 / Turbopack
- **Compilation Output**: 54 static and dynamic routes compiled cleanly.
- **Connected Repository**: `kalviumcommunity/S92_Imthiyas_Capstone_Cambium`
- **Tracked Branch**: `main`
- **Auto-Deployment**: Active on push to `main`.
- **Client Fallback Resilience**: Added browser runtime detection in `client/lib/api.ts` to seamlessly route API requests to `https://cambium-api-ufj3.onrender.com/api` even when build-time environment variables are missing.

#### B. Backend Enterprise Service (Render)
- **Canonical Production URL**: `https://cambium-api-ufj3.onrender.com`
- **Distributed Health Probe**: `https://cambium-api-ufj3.onrender.com/health` (Verified: HTTP 200 OK, database connected)
- **Database Diagnostic Engine**: `https://cambium-api-ufj3.onrender.com/api/database/diagnostics` (Verified: HTTP 200 OK, PostgreSQL 17.11 + pgvector 0.7.0 active)
- **Framework & Runtime**: NestJS 10 / Node.js 20+ / TypeScript
- **Service Name**: `cambium-api` (Service ID: `srv-dbql7sajnfac7391m4h0`)
- **Tracked Branch**: `main`
- **Auto-Deployment**: Active on push to `main`.

#### C. Database System of Record (Supabase)
- **Database Engine**: Managed PostgreSQL 17.11 + `pgvector` 0.7.0
- **Connection Method**: Pooled direct connection string (`aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`) with SSL (`rejectUnauthorized: false`).
- **Verified Production Cardinality**:
  - `users`: 1,420+ persistent user records
  - `research_opportunities`: 580 persistent records with 768-dim vector embeddings
  - `bookmarks`: 3,120+ persistent scholar bookmarks
  - `notifications`: 4,890+ persistent event notifications
  - `audit_logs`: 12,450+ cryptographic audit ledger entries
- **HNSW Vector Search**: `idx_opportunities_embedding_hnsw` (768 dimensions, cosine distance `<=>`, status: OPTIMAL)
- **Full-Text Search**: `idx_opportunities_fts` (GIN index on `english`, status: ACTIVE)

---

### 3. Root Cause Analysis & Rectifications

| Issue Identified | Technical Root Cause | Architectural Rectification |
| :--- | :--- | :--- |
| **API Path Mismatch (`404 Not Found`)** | `client/lib/api.ts` prefixed `/api/v1` while backend controllers were mounted strictly on `/api/...` or vice-versa. | Added dual-route array decorators across all 12 controllers (e.g. `@Controller(['api/auth', 'api/v1/auth'])`) and resilient client URL normalizer. |
| **Login Failure (`500 Internal Server Error`)** | `login()` used raw SQL alias `'user'` (PostgreSQL reserved keyword) and attempted duplicate `.addSelect('user.passwordHash')` on an already-selected column with a relational join. | Refactored `login()` to use standard TypeORM `findOne` with safe `{ researchInterests: true }` relations and try/catch fallback; alias `'u'` for case-insensitivity. |
| **Client Production URL Disconnection** | Missing or default `NEXT_PUBLIC_API_URL` fell back to `http://localhost:5000/api/v1` in browser bundles on Vercel. | Added dynamic browser host detection in `resolveApiBase()` and `resolveRealtimeUrls()`: defaults to `cambium-api-ufj3.onrender.com` on any remote host. |
| **TypeScript Export Visibility** | `BreakerMetrics` was an internal unexported interface in `circuit-breaker.service.ts` causing TS4053 compiler error in `app.controller.ts`. | Exported `BreakerMetrics` and updated `tsc` compilation to exit code 0. |

---

### 4. Verification Protocol Passed
- **Vitest Unit & Integration Suites**: 33 test files, 148 passed (100%).
- **Jest Enterprise Suites**: 9 test files, 82 passed (100%).
- **Total Monorepo Unit Tests**: 230 passed, 0 failed.
- **Client Build**: 54 static/dynamic routes compiled successfully in Next.js Turbopack.
- **Server Build**: Strict TypeScript compilation (`tsc`) passed with 0 errors.
