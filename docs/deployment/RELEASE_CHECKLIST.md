# Cambium Research Platform
## Production Release & Deployment Smoke Checklist

---

### Release Metadata
- **Release Version**: `2.0.0-PROD-CANDIDATE`
- **Release Target**: Production Staging & General Availability
- **Sign-off Authority**: Lead Architect & Release Engineer

---

## 1. Pre-Deployment Stage (Zero-Downtime Gates)

- [x] **Git Cleanliness**: All feature branches merged to `main` with 0 uncommitted changes.
- [x] **Unit & Integration Test Suite**:
  - `npm run test:jest`: **61/61 PASSED** (100%)
  - `npm --prefix server test`: **93/93 PASSED** (100%)
- [x] **TypeScript Strict Compilation**:
  - `npm --prefix server run build`: `tsc` exit code 0, 0 type errors.
  - `npm --prefix client run build`: 50/50 static routes compiled into production bundles.
- [x] **Database Migrations Verified**:
  - TypeORM entities in sync with PostgreSQL 16 schema.
  - `vector(768)` extension active and HNSW indexes created.
- [x] **Secret Audit**:
  - No plain-text API keys, passwords, or JWT secrets present in git history.
  - `.env.production` files provisioned through secure vault injection.

---

## 2. In-Flight Deployment Stage

- [ ] **Database Connection Health**: Verify connection pool maintains $< 20\%$ utilization under load.
- [ ] **Redis Connection**: Confirm Redis cache connectivity (or resilient fallback logs clean).
- [ ] **PM2 / Container State**: Inspect process supervisor status (`pm2 status` or `docker compose ps`).
- [ ] **Zero 500 Errors on Startup**: Tail server logs for unhandled rejections during initialization:
  `pm2 logs cambium-server --lines 100`

---

## 3. Post-Deployment Smoke Probes (Live Verification)

- [ ] **Probe 1: Landing Page**: Visit `https://cambium.edu/` — confirm sub-100ms FCP, zero hydration errors.
- [ ] **Probe 2: Scholar Authentication**: Sign in via test scholar account; verify JWT bearer issuance.
- [ ] **Probe 3: Federated SAML 2.0**: Navigate to `/institution-sso` and execute SSO flow against IdP.
- [ ] **Probe 4: Opportunity Intelligence**: Load `/opportunities` and `/publications`; verify OpenAlex live ingestion.
- [ ] **Probe 5: iCalendar Export**: Click "Export to Calendar (.ICS)" on `/os`; verify standard RFC 5545 `.ics` file downloads.
- [ ] **Probe 6: Private Workspace ACL (IDOR Check)**: Attempt to access a private project URL with an unauthorized token; verify HTTP 403 Forbidden is returned.
- [ ] **Probe 7: Cryptographic Ledger**: Query `/api/v1/audit/export/signed`; confirm Merkle root and digital signature.
- [ ] **Probe 8: GDPR Article 20 Export**: Click "Download My Scholarly Dossier" on `/privacy`; verify valid Schema.org JSON-LD output.

---

## 4. Rollback Plan

If any critical smoke probe fails during deployment:
1. Revert reverse proxy traffic to previous blue/green PM2 cluster or container version:
   `pm2 restart cambium-server-previous && pm2 stop cambium-server`
2. If database schema was altered, apply down-migration or restore point-in-time snapshot.
3. Notify the engineering team and file an incident ticket.
