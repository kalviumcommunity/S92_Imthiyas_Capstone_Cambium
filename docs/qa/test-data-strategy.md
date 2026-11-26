# Deterministic Test Data & Environment Isolation Strategy (Phase 2)

## 1. Synthetic Multi-Actor Identity Matrix ([`synthetic-actors.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tests/fixtures/synthetic-actors.ts))
All synthetic tests reuse `.invalid` reserved test domains and deterministic UUIDs so real accounts are never touched:
- `RESEARCHER_A` (`Stanford Synthetic Lab`, tier `pro`)
- `RESEARCHER_B` (`MIT Synthetic Institute`, tier `free`) — cross-tenant & cross-workspace negative actor
- `PI_STANFORD` (`Stanford Synthetic Lab`, role `PI`, tier `institutional`)
- `INSTITUTION_ADMIN` (`Stanford Synthetic Lab`, role `UNIVERSITY_LEADERSHIP`)
- `READ_ONLY_REVIEWER` (`Oxford Synthetic College`, role `REVIEWER`)
- `SUPER_ADMIN` (`Cambium QA Harness`, role `SUPER_ADMIN`)

## 2. Parallel & Order Independence Rules
- Ephemeral HTTP servers bind to OS-assigned port `0` (`127.0.0.1:0`) to prevent port collisions.
- Every suite resets in-memory fixture state in `beforeEach` and clears `vi.restoreAllMocks()` / timers in `afterEach`.
- Zero Playwright tests read or mutate live production Vercel/Render databases; browser tests intercept backend endpoints or run against isolated local Next.js servers cleanly.
