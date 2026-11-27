# Developer Setup & Extension Architecture Guide

**Status:** `VERIFIED` (every npm script and directory path below matches `package.json`, `server/package.json`, and `client/package.json`)

---

## 1. Prerequisites & Local Onboarding

- **Node.js:** `>=20.0.0 <25.0.0` and **npm:** `>=10.0.0` (verified on `v24.18.1`)
- **Database:** PostgreSQL `16+` with `pgvector` extension enabled (`CREATE EXTENSION IF NOT EXISTS vector;`)
- **Optional:** Redis `7+` (if omitted, `MultiTierCacheService` falls back cleanly to L1 memory and `QueueService` uses Postgres `background_jobs`).

### Reproducible Setup Steps
```bash
# 1. Install dependencies (root Playwright/Jest + client + server)
npm install
npm --prefix client install
npm --prefix server install

# 2. Copy safe environment templates (never commit .env files)
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# 3. Initialize database schema & seed sample scholarly data (requires local Postgres)
npm run schema:apply
npm run seed

# 4. Validate env & launch API (port 5000) + Next.js UI (port 3000) in one command
npm run verify:env
npm run dev
```

---

## 2. Frontend Architecture (`client/`)

- **App Router (`client/app/`):** Grouped under `(auth)/` (sign-in/sign-up/reset), `(protected)/` (authenticated views wrapped by `AuthGuard` + `GlobalSidebar`), and public marketing/legal routes (`/`, `/privacy`, `/terms`, `/disclaimer`, `/pricing`).
- **Rendering Rule:** Default to Server Components where interactive React state isn't needed; add `"use client"` strictly for stateful views and split heavy visualizations with `next/dynamic` (pattern: [`client/app/(protected)/graph/page.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/app/(protected)/graph/page.tsx)).
- **Data Fetching & State:** Server state via `@tanstack/react-query` (`staleTime: 5m`, `QueryProvider`), shared UI state in `client/lib/store/` (Zustand), HTTP retries & correlation IDs via [`apiFetch`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/lib/http-client.ts).
- **Design Tokens:** Use Living Materials variables from [`tokens/cambium.tokens.json`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tokens/cambium.tokens.json) (`#FAF7F0` Parchment, `#3E6248` Canopy, `#202920` Forest Ink) and `lucide-react` icons (`size={18|20}`).

---

## 3. Backend Architecture (`server/`)

- **Modular Monolith (`server/src/modules/`):** Feature domains (`auth`, `opportunities`, `bookmarks`, `projects`, `upload`, `community`, `institution`, `assistant`, `performance`, `network`, etc.) registered in [`app.module.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/app.module.ts).
- **Global Pipeline:** `ValidationPipe` (`whitelist: true`, `transform: true`, `forbidNonWhitelisted: true`) -> `NetworkRateLimiterGuard` -> `TelemetryInterceptor` / `IdempotencyInterceptor` / `AuditInterceptor` / `EtagInterceptor` / `GracefulDegradationInterceptor` / `RequestTimeoutInterceptor`.
- **Persistence:** TypeORM repositories registered in [`database.config.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/config/database.config.ts) with `statement_timeout = 15000ms` and `DB_POOL_MAX = 20`. Raw SQL string interpolation is prohibited.

---

## 4. How to Extend Cambium Safely

1. **Add a New Protected Page:** Create `client/app/(protected)/<route>/page.tsx` and add navigation metadata to `NAV_ITEMS` in [`GlobalSidebar.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/components/GlobalSidebar.tsx).
2. **Add a Reusable Component:** Place under `client/components/<domain>/`, enforce Living Materials tokens, avoid hardcoded mock API calls.
3. **Add a New API Endpoint & Business Operation:** Create a DTO with `class-validator` decorators, enforce `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(...)` + tenant/ownership checks inside the service, and document in [`docs/api-guide.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/api-guide.md).
4. **Add a Database Entity:** Create `<entity>.entity.ts`, add it to the `entities` list in [`database.config.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/config/database.config.ts), append idempotent SQL migration DDL to `server/src/database/migrations/`, and sync [`schema.sql`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/database/schema.sql).
5. **Add a Background Job:** Register a queue handler via `QueueService` and submit jobs with explicit `idempotencyKey` and bounded attempts (`QueueService.enqueueDurableJob`).
6. **Add an AI Capability:** Wrap untrusted document/user inputs inside `<untrusted_source_data>` tags (pattern: [`AssistantService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/assistant/assistant.service.ts)), attach `AbortSignal.timeout`, and preserve offline deterministic fallback.

---

## 5. Verification Commands

```bash
npm run test:jest              # Root Jest unit & contract suites
npm test                       # Backend Vitest suites (server/)
npm --prefix server run build  # Backend TypeScript compilation check
npm --prefix client run lint   # Frontend ESLint check
npm --prefix client run build  # Frontend production build check
npm run test:e2e               # Playwright Chromium smoke tests
```
