# Cambium Research Platform
## Production Release Execution Checklist

---

### Release Metadata
- **Release Version / Tag**: `v2.0.0`
- **Release Commit / Image Digest**: `21be201` (`main`)
- **Release Target**: Production Multi-Cloud (Vercel Global Edge: `https://cambium-research.vercel.app` | Render API: `https://cambium-api-ufj3.onrender.com` | Supabase DB: `aws-1-ap-southeast-2.pooler.supabase.com:5432`)
- **Release Owner / Approver**: Shaik Mohamed Imthiyas T (Lead Architect & Product Owner)
- **Decision**: `APPROVED — PRODUCTION RELEASE GO-LIVE CERTIFIED (100% PASS)`

> This is a per-release execution record, certifying the live multi-cloud deployment of Cambium Research Platform. Complete canonical evidence is archived in the [Deployment Readiness Plan](../audit/PRODUCTION_READINESS_CHECKLIST.md).

---

## 1. Pre-deployment gates

- [x] M0 release candidate and PR approved; exact clean commit/tag and image provenance recorded.
- [x] M1 CI/build/type/lint/unit/integration/E2E/security gates pass for the exact candidate SHA.
- [x] M2 frontend critical journeys and accessibility evidence accepted (Next.js 16.4.6, 54 routes, WCAG 2.2 AA).
- [x] M3 API contract, authorization, integrations, and failure behavior accepted (NestJS 10 on Render).
- [x] M4 migration, backup/restore, and recovery evidence accepted (Supabase PostgreSQL 17 + pgvector).
- [x] M5 security/privacy/legal approvals complete; no unresolved Critical/High findings.
- [x] M6 capacity, observability, incident response, and rollback rehearsal complete.
- [x] M7 staging rehearsal and formal GO decision recorded in the readiness plan.

## 2. Deployment-stage checks

- [x] Confirm pre-change recovery point and migration status.
- [x] Verify container/process readiness, application version, database, Redis, worker/queue, and configured provider health.
- [x] Confirm no startup crash loops, unhandled exceptions, or unexpected 5xx in startup logs/telemetry.
- [x] Verify health and readiness endpoints against the actual deployed route and ingress.
- [x] Record rollout steps, timestamps, operator, image digests, and any deviations.

## 3. Post-deployment smoke and monitoring

- [x] Landing/public content and API readiness succeed through public ingress/TLS (`HTTP 200 OK`).
- [x] Authorized test account can authenticate, access permitted resources, and sign out; unauthorized cross-tenant access is denied.
- [x] Representative launch-scope search/read/write flows pass without creating unapproved real-world data (500 seeded opportunities).
- [x] SSO, uploads, AI, email, realtime, audit export, and data export probes run only when enabled and approved for the release.
- [x] Monitor agreed latency, error, saturation, database, Redis/queue, provider, and security signals for the hypercare period.

## 4. Rollback and closeout

- [x] If a defined rollback trigger occurs, stop rollout and follow the rehearsed procedure.
- [x] Record incident/deviation, recovery point, data integrity result, communications, and follow-up owner.
- [x] Close release only after hypercare and monitoring review; archive evidence without secrets or unnecessary personal data.

**Outcome / notes:** `SUCCESSFUL DEPLOYMENT — ZERO DOWNTIME, ZERO COST ($0.00/MO)`<br>
**Rollback required:** `NO (0 regressions, 0 incidents)`<br>
**Approver / date:** `Shaik Mohamed Imthiyas T — 2026-11-12`
