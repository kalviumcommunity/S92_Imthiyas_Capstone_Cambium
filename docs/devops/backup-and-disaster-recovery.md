# Backup, Restoration & Disaster Recovery (Phase 10)

## 1. Proposed Recovery Objectives (Pending Stakeholder Sign-Off)
- **RPO (Recovery Point Objective)**: `<= 24 hours` on scheduled daily logical snapshots (`scripts/backup-db.*`) and managed daily provider backups; `<= 15 minutes` if Point-in-Time Recovery (PITR) add-on is enabled on managed PostgreSQL.
- **RTO (Recovery Time Objective)**: `<= 2 hours` to restore a clean PostgreSQL 16 + pgvector database from gzip snapshot and redeploy Vercel + Render services.

---

## 2. Backup & Restore Procedures
- **Create Encrypted-Ready Compressed Snapshot**:
  `DATABASE_URL=... node scripts/backup-db.mjs` -> writes gzip SQL archive + `.sha256` checksum + metadata ledger into `backups/` (gitignored).
- **Verify & Restore (Non-Production Isolated Target Only)**:
  `POSTGRES_PASSWORD=... ./scripts/restore-db.sh backups/<archive>.sql.gz` (or `.ps1` / `.mjs`). Verifies cryptographic SHA-256 checksum prior to executing restoration; aborts loudly on tampering or hash mismatch.

---

## 3. Executed Restoration Integrity Drill Record
- **Environment**: Isolated local verification harness (`server/src/database/disaster-recovery.spec.ts`) + offline migration verification (`npm run db:migrate:verify`).
- **Verified Checks**:
  1. Gzip compression & full lossless gunzip SQL round-trip verification (`PASS`).
  2. Deterministic 64-char SHA-256 checksum verification & single-byte bit-flip tamper rejection (`PASS`).
  3. 7-day retention pruning boundary verification (`PASS`).
- **Limitations**: Full remote cloud restoration against managed Supabase/Render snapshots requires dashboard/pg_restore credentials (`BLOCKED` from CLI); schedule a staging DB restore test before institutional launch.
