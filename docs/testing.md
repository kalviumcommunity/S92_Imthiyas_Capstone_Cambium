# Automated Testing & Verification Guide (testing.md)
## Cambium — AI-Powered Research Opportunity Discovery & Intelligence Platform
**The Enterprise Research Operating System**

---

### Metadata
- **Document ID**: `TEST-CAMBIUM-2026-V2`
- **Product Name**: Cambium Research Platform
- **Lead Quality Engineer**: Shaik Mohamed Imthiyas T
- **Status**: `ENFORCED QUALITY GATE`
- **Current Version**: `2.0.0`
- **Frameworks**: Vitest 5.x (Backend Unit & Integration) · Playwright (Frontend E2E Smoke Tests)
- **Results**: 24/24 Test Suites Passed · 117/117 Unit Tests Passed · 0 Errors
- **Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Testing Philosophy & Test Pyramid

Cambium utilizes a three-tier test automation pyramid designed for deterministic CI/CD execution:

1. **Unit & Isolation Tests (Vitest)**: Mock-isolated unit tests testing business logic, cryptographic hashing, RBAC guards, and DTO validations.
2. **Integration Tests (NestJS TestingModule)**: Tests verifying TypeORM queries, Redis Redlock mutual exclusion, and transactional outbox relay mechanics.
3. **End-to-End Smoke Probes (Playwright)**: Browser-level DOM validation testing authentication, search bar seamless pill styling, autocomplete interaction, and responsiveness.

```
                  ┌───────────────────────┐
                  │ Playwright E2E Smoke  │  8 Critical Probes
                  └───────────┬───────────┘
                              │
                  ┌───────────┴───────────┐
                  │ NestJS Integration    │  TypeORM / Redis / Outbox
                  └───────────┬───────────┘
                              │
            ┌─────────────────┴─────────────────┐
            │       Vitest Unit Tests           │  117 Tests across 24 Suites
            └───────────────────────────────────┘
```

---

## 2. Unit & Integration Test Suite (Vitest)

### 2.1 Execution Command
```bash
npm --prefix server test
```

### 2.2 Test Suite Breakdown (24 Suites / 117 Tests)

| Domain / Suite | Test File | Test Count | Key Invariants Verified |
| :--- | :--- | :---: | :--- |
| **Authentication & SAML** | `auth.service.spec.ts`<br>`saml.service.spec.ts` | 10 | Bcrypt password hashing, JWT issue/refresh, InCommon SAML XML assertion parsing. |
| **Upload & OCR Service** | `upload.service.spec.ts`<br>`pdf-ocr.service.spec.ts` | 16 | SHA-256 file deduplication, S3 upload fallback, sandboxed OCR text extraction. |
| **CRediT Contributions** | `contributions.service.spec.ts` | 10 | 14-role CRediT taxonomy validation, peer co-author endorsement increment. |
| **Community & Social** | `community.service.spec.ts`<br>`connections.service.spec.ts` | 15 | Post publishing, threaded comments, scholar follow/connect mutual states. |
| **Projects & Workspaces** | `projects.service.spec.ts` | 10 | Lab member role escalation prevention, workspace activity stream logging. |
| **AI & Embeddings** | `gemini-embedding.service.spec.ts`<br>`llm-autocomplete.service.spec.ts` | 7 | Cosine vector generation, ghost-text debounce, RAG cache fallback. |
| **Transactional Outbox** | `outbox-relay.service.spec.ts` | 3 | Guaranteed message dispatch, retry exponential backoff, SSE status transitions. |
| **Redis & Concurrency** | `redis.service.spec.ts`<br>`redlock.service.spec.ts` | 8 | Distributed mutex locking, conflict exception on concurrent resource write. |
| **Audit & Telemetry** | `audit.service.spec.ts`<br>`telemetry.service.spec.ts` | 9 | SHA-256 blockchain hash chaining, tamper detection, Prometheus metric counters. |
| **Edge Cache & Interceptors**| `edge-cache.interceptor.spec.ts`<br>`idempotency.interceptor.spec.ts` | 7 | Cache-control headers, duplicate request rejection within 10s window. |
| **Realtime Chat & Events** | `chat.gateway.spec.ts`<br>`events.service.spec.ts` | 7 | WebSocket room join/leave security, scholar presence broadcasting. |
| **Database Diagnostics** | `disaster-recovery.spec.ts`<br>`database-diagnostic.service.spec.ts` | 8 | Backup archive integrity, connection pool health check, cold start recovery. |
| **Opportunities & App** | `opportunities.service.spec.ts`<br>`app.controller.spec.ts`<br>`email.service.spec.ts` | 7 | Grant filtering, health check response, digest email queue simulation. |

---

## 3. Playwright End-to-End Smoke Tests

### 3.1 Execution Command
```bash
# Ensure client and server are running locally:
npm run test:e2e
```

### 3.2 Key Verified User Journeys
1. **Public Landing Page (`/`)**: Confirms Living Materials CSS variables (`--color-parchment`, `--color-canopy`) and hero CTA rendering.
2. **Discover Feed (`/discover`)**: Verifies the `.scholarly-search-pill` element has zero inner box borders, loads live scholarly publications from OpenAlex/arXiv, and auto-completes with Gemini/RAG.
3. **Scholar Onboarding (`/welcome`)**: Validates research interest selection, profile calibration, and dynamic greeting updates without hardcoded identities.
4. **Research Workspace (`/workspace`)**: Confirms tab switching (Literature, Notes, Experiments) and state persistence.
5. **Security & Audit (`/audit`)**: Verifies that tamper-evident audit logs render for compliance officers.

---

## 4. Continuous Integration (CI) Quality Gates

All pull requests trigger the GitHub Actions workflow [`.github/workflows/ci.yml`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/.github/workflows/ci.yml) which executes:
1. `npm --prefix client run lint` & `npm --prefix server run lint`
2. `npm --prefix client run build` (Ensures zero Next.js type or prerender errors)
3. `npm --prefix server run build` (Ensures zero TypeScript compilation errors)
4. `npm --prefix server test` (Ensures all 117 unit tests pass with exit code 0)

