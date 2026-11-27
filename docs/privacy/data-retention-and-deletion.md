# Cambium Research — Data Retention & Cascading Deletion Engineering

## 1. Category Retention Schedule

| Data Category | Retention Trigger & Rule | Erasure Mechanism | Backup & Exception Reality |
| :--- | :--- | :--- | :--- |
| **User Profile & Auth Session (`users`, Redis)** | Active while account open | Hard delete row (`userRepo.remove`) + Redis `blacklistJti` | PostgreSQL automated backups age out per host retention cycle |
| **Privacy Preferences (`user_privacy_preferences`)** | Active while account open | Deleted via cascade / `prefRepo.delete` on erasure | None beyond database snapshot cycle |
| **Uploaded Research Artifacts (`uploads/artifacts/`)** | Retained until owner deletes or account erasure | Synchronous `fs.promises.unlink` + `metadataStore.delete` (`UploadService.deleteArtifactsByOwner`) | Not synced externally by backend code unless host filesystem snapshots exist |
| **Consent History (`consent_records`)** | Compliance evidence window | **Retained** as append-only legal proof (`[LEGAL_REVIEW_REQUIRED]` retention duration) | Disclosed in `retentionExceptionReason` |
| **Cryptographic Audit Logs (`audit_logs`)** | Security & tamper-evidence window | **Preserved** (SHA-256 hash chain cannot be broken by row deletion; bodies sanitized in `AuditInterceptor`) | Explicitly disclosed in `PrivacyRequestStatus.PARTIALLY_COMPLETED` |
| **Application & Telemetry Spans (`TelemetryService`)** | Rolling in-memory ring (`maxBufferSize = 500`) | Evicted continuously from RAM; no raw user document payloads stored | Ephemeral process memory only |

## 2. Deletion Workflow State Machine (`PrivacyRequest`)

Implemented in `PrivacyService.executeAccountErasure` (`POST /api/v1/privacy/erasure`):
1. Validates exact `"DELETE"` confirmation and authenticated JWT identity (`IDENTITY_VERIFIED`).
2. Transitions request to `DELETION_IN_PROGRESS`.
3. Deletes uploaded disk/memory artifacts, bookmarks, notifications, preferences, and user profile; blacklists active token `jti` and clears user cache prefixes (`MultiTierCacheService.invalidateByPrefix`).
4. Finalizes request as **`PARTIALLY_COMPLETED`** when database records & files are wiped while immutable `audit_logs` hash chain and host disaster-recovery backups remain under retention policy.
