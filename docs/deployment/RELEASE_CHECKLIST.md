# Cambium Research Platform
## Production Release Execution Checklist

---

### Release Metadata
- **Release Version / Tag**: `TBD`
- **Release Commit / Image Digest**: `TBD`
- **Release Target**: `TBD`
- **Release Owner / Approver**: `TBD`
- **Decision**: `NOT REVIEWED — NO DEPLOYMENT APPROVAL`

> This is a per-release execution record, not a standing certification. Complete the canonical [Deployment Readiness Plan](../audit/PRODUCTION_READINESS_CHECKLIST.md) first. Previous checkmarks, test counts, and release labels are not evidence for the current candidate.

---

## 1. Pre-deployment gates

- [ ] M0 release candidate and PR approved; exact clean commit/tag and image provenance recorded.
- [ ] M1 CI/build/type/lint/unit/integration/E2E/security gates pass for the exact candidate SHA.
- [ ] M2 frontend critical journeys and accessibility evidence accepted.
- [ ] M3 API contract, authorization, integrations, and failure behavior accepted.
- [ ] M4 migration, backup/restore, and recovery evidence accepted.
- [ ] M5 security/privacy/legal approvals complete; no unresolved Critical/High findings.
- [ ] M6 capacity, observability, incident response, and rollback rehearsal complete.
- [ ] M7 staging rehearsal and formal GO decision recorded in the readiness plan.

## 2. Deployment-stage checks

- [ ] Confirm pre-change recovery point and migration status.
- [ ] Verify container/process readiness, application version, database, Redis, worker/queue, and configured provider health.
- [ ] Confirm no startup crash loops, unhandled exceptions, or unexpected 5xx in startup logs/telemetry.
- [ ] Verify health and readiness endpoints against the actual deployed route and ingress; do not assume example URLs in older runbooks match production.
- [ ] Record rollout steps, timestamps, operator, image digests, and any deviations.

## 3. Post-deployment smoke and monitoring

- [ ] Landing/public content and API readiness succeed through public ingress/TLS.
- [ ] Authorized test account can authenticate, access permitted resources, and sign out; unauthorized cross-tenant access is denied.
- [ ] Representative launch-scope search/read/write flows pass without creating unapproved real-world data.
- [ ] SSO, uploads, AI, email, realtime, audit export, and data export probes run only when enabled and approved for the release.
- [ ] Monitor agreed latency, error, saturation, database, Redis/queue, provider, and security signals for the hypercare period; record the comparison and anomalies.

## 4. Rollback and closeout

- [ ] If a defined rollback trigger occurs, stop rollout and follow the rehearsed, environment-specific procedure in the readiness plan/runbook. Do not assume a schema down-migration is safe.
- [ ] Record incident/deviation, recovery point, data integrity result, communications, and follow-up owner.
- [ ] Close release only after hypercare and monitoring review; archive evidence without secrets or unnecessary personal data.

**Outcome / notes:** <br>
**Rollback required:** `TBD`
**Approver / date:** `TBD`
