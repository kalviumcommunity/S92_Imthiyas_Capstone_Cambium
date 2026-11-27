# Cambium Observability Dashboards Guide (`/observability`)

Access to `/observability` and `GET /api/v1/analytics/dashboards/*` requires JWT authentication and an authorized governance role (`SUPER_ADMIN`, `RD_DIRECTOR`, `UNIVERSITY_LEADERSHIP`, `COMPLIANCE_OFFICER`, plus `DEPARTMENT_HEAD` on the institutional view).

## Tabs & Data Provenance

| Tab | Endpoint | Primary Audience | Key Indicators |
| :--- | :--- | :--- | :--- |
| **Product Intelligence** | `GET /api/v1/analytics/dashboards/product` | Product & Leadership | DAU/WAU/MAU, stickiness, 14-day activation rate, discovery-to-collaboration funnel, D1/D7/D30 cohorts, failure counts |
| **Engineering Health** | `GET /api/v1/analytics/dashboards/engineering` | SRE & Backend Engineering | API p50/p90/p95/p99 latency, HTTP error rate, PostgreSQL active connections/locks/slow queries, Queue mode/dead jobs/oldest age, Circuit breakers, Active alerts (`RB-OBS-*`), Client errors |
| **AI & RAG Quality** | `GET /api/v1/analytics/dashboards/ai` | AI & Platform Engineering | 24h live vs fallback/failure counts, p95 latency, estimated tokens & USD spend per workflow, deterministic RAG benchmark (`EVAL_DATASET_VERSION`) Recall@3, Precision@3, Citation Completeness, Abstention Accuracy |
| **Institutional Usage** | `GET /api/v1/analytics/dashboards/institution` | University Leadership & Dept Heads | Organization-isolated counts gated behind `k >= 3` active member suppression |

Zero values represent empty telemetry windows (`0` events recorded) — the UI never substitutes placeholder baselines for missing measurements.
