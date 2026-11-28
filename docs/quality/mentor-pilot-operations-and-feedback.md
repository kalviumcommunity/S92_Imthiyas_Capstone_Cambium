# Cambium Mentor Pilot Operations, Feedback & Incident Guide

**Document ID**: `QUAL-PILOT-OPS-2026-V1`  
**Owner**: Technical Pilot Lead & Platform Engineering

## 1. Pilot Account Governance (5–10 Participants)
- **Provisioning**: Each mentor registers a distinct account (`/sign-up`) or receives a seeded synthetic mentor identity; zero shared accounts or shared admin credentials.
- **Role Assignment**: Mentors start as standard `RESEARCHER` accounts; institutional views are tested only with explicit `UNIVERSITY_LEADERSHIP` test accounts.
- **Account Reset / Revocation**:
  - Pilot Coordinator handles credential resets manually (`NOT IMPLEMENTED` self-service email reset).
  - Compromised or departing mentor sessions can be revoked cleanly via `/auth/logout` (JWT Redis blacklist + refresh cookie clear) or account deactivation by `SUPER_ADMIN`.
- **Post-Pilot Cleanup**: Synthetic workspaces, bookmarks, and uploaded artifacts created by pilot test accounts can be removed via standard user/project `DELETE` endpoints or account archive after pilot completion.

## 2. Structured Feedback Classification

Separate incoming mentor feedback into five explicit queues before engineering triage:
1. **P0/P1 Bugs**: Auth failures, persistence loss, 500 errors, broken workflows.
2. **Security / Privacy Concerns** *(Highest Escalation)*: Suspected cross-user data visibility, unauthorized workspace/document access, token/cookie leaks.
3. **Usability Friction**: Confusing flows, unclear error banners, empty-state ambiguity (routed into Program 15 Design Systems & UX consolidation).
4. **Performance Issues**: Slow cold starts or latency spikes (cross-referenced with `X-Request-Id`).
5. **Feature Requests**: Logged in backlog; not treated as immediate pilot blockers.

## 3. Pilot Support & Incident Response

| Severity | Example | Response Target | Immediate Action |
| :--- | :--- | :--- | :--- |
| **Sev-1 (Privacy / Isolation)** | Cross-user data access or credential leak | Immediate (< 15 min) | Pause pilot invites, revoke affected tokens/accounts, rollback or patch & verify via `pilot-acceptance.spec.ts`. |
| **Sev-2 (Core Workflow Down)** | Signup/login, discovery, or workspace save broken | < 1 hour | Check `https://cambium-api-ufj3.onrender.com/health`, inspect Render/Vercel logs, run `smoke-test.mjs --strict --require-api`, rollback if needed. |
| **Sev-3 (Degraded / External)** | Gemini or OpenAlex rate limit / timeout | Same day | Verify graceful fallback banner surfaces to user; log rate-limit telemetry. |
