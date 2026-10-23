# 🧪 Test Execution Results & Automated Verification Report
## Vitest Backend Test Suites & Next.js Static Compilation Quality Gates
**Author & Lead Architect**: Shaik Mohamed Imthiyas T  
**Document ID**: `AUDIT-TESTS-CAMBIUM-2026-V1`  
**Execution Timestamp**: October 22, 2026 | **Pass Rate**: 100% (49/49 Backend Tests | 49/49 Client Pages)

---

## 1. Backend Automated Unit & Integration Tests (Vitest 5.0)

### 1.1 Summary Execution Metrics
- **Test Runner**: Vitest v5.0.0 (Node.js runtime)
- **Total Test Files**: 13
- **Passed Test Files**: 13 (100%)
- **Failed Test Files**: 0 (0%)
- **Total Unit & Integration Tests**: 49
- **Passed Tests**: 49 (100%)
- **Failed Tests**: 0 (0%)
- **Total Duration**: 2.17s

### 1.2 Test Suite Breakdown

| Suite # | Test Suite Path | Tests | Status | Duration | Key Coverage Areas |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **01** | `src/modules/upload/upload.service.spec.ts` | 12 | `PASSED` | 61ms | Path traversal (`../../`), null bytes, 50MB caps, SHA-256 calculation, deletion lifecycle |
| **02** | `src/modules/ai/gemini-embedding.service.spec.ts` | 3 | `PASSED` | 18ms | 768-dim embeddings, L2 unit normalization, deterministic SHA-256 fallback |
| **03** | `src/common/redis/redlock.service.spec.ts` | 5 | `PASSED` | 859ms | Distributed mutex acquisition, TTL expiration, lock release, concurrency conflict |
| **04** | `src/modules/auth/auth.service.spec.ts` | 4 | `PASSED` | 91ms | Password hashing, dual JWT issuance, refresh token rotation, invalid credentials |
| **05** | `src/common/redis/redis.service.spec.ts` | 3 | `PASSED` | 20ms | Redis client connection, cache get/set with TTL, in-memory resilient fallback |
| **06** | `src/common/interceptors/idempotency.interceptor.spec.ts` | 4 | `PASSED` | 14ms | Idempotency key tracking, cached response replay, conflict handling |
| **07** | `src/common/interceptors/edge-cache.interceptor.spec.ts` | 3 | `PASSED` | 12ms | HTTP Cache-Control headers, stale-while-revalidate, conditional requests |
| **08** | `src/modules/chat/chat.gateway.spec.ts` | 4 | `PASSED` | 8ms | WebSocket room join/leave, collaborative message broadcast, scholar presence |
| **09** | `src/common/outbox/outbox-relay.service.spec.ts` | 3 | `PASSED` | 8ms | Outbox event enqueueing, polling relay, dead-letter retry logic |
| **10** | `src/modules/events/events.service.spec.ts` | 3 | `PASSED` | 11ms | Server-Sent Events (SSE) observable stream, broadcast filtering |
| **11** | `src/modules/opportunities/opportunities.service.spec.ts` | 2 | `PASSED` | 8ms | Opportunity query filters, pagination, category search |
| **12** | `src/modules/email/email.service.spec.ts` | 2 | `PASSED` | 5ms | Resend API template dispatch, simulated outbox logging |
| **13** | `src/app.controller.spec.ts` | 1 | `PASSED` | 4ms | Root health probe endpoint (`GET /api/health`) |

### 1.3 Console Output Verbatim Log
```
 RUN  v5.0.0 D:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server

[Nest] 14216  - LOG [UploadService] Artifact saved successfully [ID: 7488f2b6-8800-433b-bf3c-4fd409822ef0] (sample_proposal.pdf, 79 bytes)
 ✓ src/modules/ai/gemini-embedding.service.spec.ts (3 tests) 18ms
[Nest] 14216  - LOG [UploadService] Artifact saved successfully [ID: 971decf2-3ebd-46f0-a88b-ce6fda4012a8] (to_delete.pdf, 79 bytes)
[Nest] 14216  - LOG [UploadService] Artifact removed [ID: 971decf2-3ebd-46f0-a88b-ce6fda4012a8]
 ✓ src/modules/upload/upload.service.spec.ts (12 tests) 61ms
 ✓ src/common/redis/redis.service.spec.ts (3 tests) 20ms
 ✓ src/modules/events/events.service.spec.ts (3 tests) 11ms
 ✓ src/common/interceptors/edge-cache.interceptor.spec.ts (3 tests) 12ms
[Nest] 27656  - LOG [IdempotencyInterceptor] Idempotency HIT for key "grant-sub-101" on POST /api/grants
 ✓ src/common/interceptors/idempotency.interceptor.spec.ts (4 tests) 14ms
[Nest] 21984  - LOG [ChatGateway] Scholar Dr. Jane joined research room: room:genomics-grant-42
[Nest] 21984  - LOG [ChatGateway] Scholar user-1 departed research room: room:genomics-grant-42
 ✓ src/modules/chat/chat.gateway.spec.ts (4 tests) 8ms
 ✓ src/modules/opportunities/opportunities.service.spec.ts (2 tests) 8ms
[Nest] 26256  - DEBUG [OutboxRelayService]  Outbox event [outbox-uuid-1] dispatched to streams and marked PUBLISHED
 ✓ src/common/outbox/outbox-relay.service.spec.ts (3 tests) 8ms
 ✓ src/modules/auth/auth.service.spec.ts (4 tests) 91ms
[Nest] 27212  - LOG [EmailService] 📧 [EMAIL DISPATCH SIMULATION]
[Nest] 27212  - LOG [EmailService]    To: scholar@oxford.ac.uk
[Nest] 27212  - LOG [EmailService]    Subject: Cambium Weekly Digest: 1 Grants Expiring in 14 Days
 ✓ src/modules/email/email.service.spec.ts (2 tests) 5ms
 ✓ src/common/redis/redlock.service.spec.ts (5 tests) 859ms
 ✓ src/app.controller.spec.ts (1 test) 4ms

 Test Files  13 passed (13)
      Tests  49 passed (49)
   Start at  18:31:41
   Duration  2.17s (import 79%, transform 10%, tests 9%, worker 1%)
```

---

## 2. Frontend Static Generation & Zero-Regression Verification

### 2.1 Next.js 15 App Router Build Output
- **Compiler**: Next.js 15.5.25 (Webpack / Turbopack with SWC minification)
- **TypeScript Errors**: 0 (`tsc` pass)
- **Total Routes Generated**: 49 static pages
- **Compilation Time**: 24.4s

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    35.8 kB         145 kB
├ ○ /_not-found                            212 B         103 kB
├ ○ /403                                 4.01 kB         110 kB
├ ○ /404                                   253 B         109 kB
├ ○ /429                                 4.15 kB         110 kB
├ ○ /about                               8.41 kB         120 kB
├ ○ /agent-reader                        7.27 kB         113 kB
├ ○ /audit                               15.6 kB         118 kB
├ ○ /auth                                  29 kB         135 kB
├ ○ /billing                             5.32 kB         108 kB
├ ○ /bookmarks                           7.36 kB         131 kB
├ ○ /careers                             7.59 kB         119 kB
├ ○ /changelog                           5.83 kB         112 kB
├ ○ /community                           20.2 kB         126 kB
├ ○ /compliance                          6.54 kB         121 kB
├ ○ /contact                             7.03 kB         119 kB
├ ○ /dashboard                           8.52 kB         114 kB
├ ○ /data-management                     5.01 kB         107 kB
├ ○ /disclaimer                            129 B         130 kB
├ ○ /discover                            11.9 kB         118 kB
├ ○ /error-500                           2.29 kB         108 kB
├ ○ /forgot-password                     1.81 kB         108 kB
├ ○ /grants                              4.76 kB         110 kB
├ ○ /graph                               12.1 kB         118 kB
├ ○ /help                                6.94 kB         118 kB
├ ○ /icon.svg                                0 B            0 B
├ ○ /institution-sso                      5.3 kB         111 kB
├ ○ /intelligence                        8.33 kB         114 kB
├ ○ /lab                                 5.94 kB         124 kB
├ ○ /notifications                       7.77 kB         119 kB
├ ○ /opportunities                         16 kB         131 kB
├ ○ /os                                  12.4 kB         118 kB
├ ○ /peer-review                         5.03 kB         111 kB
├ ○ /portfolio                           11.3 kB         117 kB
├ ○ /pricing                             4.99 kB         117 kB
├ ○ /privacy                               129 B         130 kB
├ ○ /profile                             10.2 kB         128 kB
├ ƒ /public_logo/[...slug]                 212 B         103 kB
├ ○ /publications                        7.67 kB         110 kB
├ ○ /reader                              11.2 kB         159 kB
├ ○ /reset-password                      1.56 kB         107 kB
├ ○ /settings                            18.8 kB         136 kB
├ ○ /sign-in                             10.4 kB         116 kB
├ ○ /sign-up                             5.39 kB         111 kB
├ ○ /status                              3.98 kB         110 kB
├ ○ /terms                                 129 B         130 kB
├ ○ /welcome                             10.9 kB         159 kB
├ ○ /workspace                           25.9 kB         132 kB
└ ○ /workspace/upload                    5.75 kB         120 kB
+ First Load JS shared by all             102 kB
```

---

<div align="center">
  <sub>Automated Test Results · Document ID: AUDIT-TESTS-CAMBIUM-2026-V1 · Verified for Academic Year 2026</sub>
</div>
