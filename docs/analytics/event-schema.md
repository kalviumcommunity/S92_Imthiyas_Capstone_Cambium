# Cambium Research — Canonical Event Schema & Integrity Contract

## 1. Schema Structure (`AnalyticsEvent`)

| Field | Type | Validation / Constraint | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key (`gen_random_uuid()`) | Stable immutable identifier |
| `eventName` | `varchar(80)` | Strict regex `/^[a-z0-9_]+\.[a-z0-9_]+\.[a-z0-9_]+$/` + allowlist | Rejects arbitrary free-form names |
| `schemaVersion` | `varchar(16)` | Semver e.g. `'1.0.0'` | Evolves cleanly without corrupting historical aggregations |
| `idempotencyKey` | `varchar(160)` | Unique partial index (`WHERE idempotency_key IS NOT NULL`) | Retried network/outbox calls do not double-count completions |
| `actorId` | `uuid` (nullable) | Indexed caller UUID | `null` for anonymous guest errors |
| `actorKind` | `varchar(16)` | Enum `'HUMAN' | 'SYSTEM' | 'TEST'` | Enables deterministic exclusion of synthetic test accounts (`TEST`) and internal workers (`SYSTEM`) from genuine metrics |
| `organizationId` | `uuid` (nullable) | Indexed institutional scope | Drives tenant-isolated institutional aggregations |
| `workspaceId` | `uuid` (nullable) | Indexed project scope | Tracks organization/collaboration workflows |
| `source` | `varchar(16)` | `'backend' | 'client'` | Prevents client-only spoofed claims from inflating backend counts |
| `outcome` | `varchar(16)` | `'SUCCESS' | 'FAILURE'` | Separates attempted retries from completed value |
| `properties` | `jsonb` | Explicit sensitive-key strip + max cardinality cap | Strips `password`, `token`, `documentSnippet`, `messages`, `email`, `rawPrompt` |
| `occurredAt` | `timestamptz` | Client/domain UTC timestamp | Preserves ordering |
| `ingestedAt` | `timestamptz` | Server DB commit UTC timestamp | Audit clock truth |

## 2. Fail-Safe Ingestion Rule
All product analytics writes execute inside guarded error-isolated helpers so analytics or PostgreSQL slowness **never** fails core registration, discovery, workspace, upload, or AI workflows.
