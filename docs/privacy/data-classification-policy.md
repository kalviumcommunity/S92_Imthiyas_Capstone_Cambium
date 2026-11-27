# Cambium Research — Internal Data Classification Policy

> **Scope**: Internal engineering risk-management classification guiding encryption, logging, sharing, retention, and AI-boundary decisions. Not an automated statutory sensitivity classification.

## 1. Classification Levels

| Class | Label | Research & System Examples | Mandatory Technical Controls |
| :--- | :--- | :--- | :--- |
| **CLASS 1** | `PUBLIC` | Published research opportunities (`Grant`, `CFP`, `Journal`), OpenAlex/arXiv metadata, landing pages, public system status (`/api/v1/health/liveness`) | Source attribution, edge cache headers (`public`), no private scholar correlation |
| **CLASS 2** | `INTERNAL` | Application configs, OpenTelemetry timing metrics (`p50`–`p99`), redacted HTTP trace spans (`method`, `route`, `requestId`), outbox state metadata | Authenticated operational access (`SuperAdmin` / `ComplianceOfficer` diagnostics), strip raw PII/bodies from logs |
| **CLASS 3** | `CONFIDENTIAL` | Researcher email & profile settings, `PRIVATE` / `LAB_ONLY` workspaces, draft grant proposals, bookmarks, AI reading snippets, default uploaded research artifacts | `JwtAuthGuard`, owner/member RBAC & RLS isolation, explicit sharing scope, blocked from unconsented external AI calls |
| **CLASS 4** | `RESTRICTED` | Credentials (`passwordHash`, JWT signing secrets, `GEMINI_API_KEY`), confidential IRB/compliance protocols, financial expense records, specially restricted research artifacts (`RESTRICTED`), privacy & consent ledgers | Strict least-privilege ownership / role guards, non-exportable secrets, encryption in transit/at rest per hosting config, immutable hash-chained audit metadata without secret values, mandatory block on external AI transmission |

## 2. Classification Propagation Rules

1. **Derived Data Inheritance**: Extracted OCR tables, text chunks (`DocumentParserService`), cached summaries, and vector embeddings **inherit** the classification and owner/workspace ACL of their source artifact.
2. **Default Safe Posture**: Uploaded artifacts default to `CONFIDENTIAL` (with `RESTRICTED` option) and never default to `PUBLIC`.
