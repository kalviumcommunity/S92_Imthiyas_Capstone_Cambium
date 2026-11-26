# Infrastructure Cost & Capacity Audit (Phase 13)

## 1. Current Component Footprint & Constraints

| Component | Tier / Plan | Observed Constraints | Account Usage Status |
| :--- | :--- | :--- | :--- |
| **Vercel Frontend** | Starter / Hobby or Pro (verify in dashboard) | Serverless bandwidth, static/SSR build minutes, edge function execution caps | `BLOCKED` (Dashboard billing inaccessible from CLI) |
| **Render API Service** | Starter/Free tier observed (`~17s` cold spin-up) | Single Node instance; idle sleep spin-down latency; monthly compute hour cap | `BLOCKED` (Dashboard billing inaccessible from CLI) |
| **PostgreSQL 16 (`pgvector`)** | Managed DB (single primary) | Storage GB limit, max concurrent connections (`DB_POOL_MAX=20` configured) | `BLOCKED` (Check Supabase/Render usage console manually) |
| **Redis** | Currently unset / in-memory fallback (`degraded`) | Zero current external Redis cost; limited to single-instance state | `PASS` (No extra cost incurred) |
| **Google Gemini API** | Pay-per-token / Free tier RPM quotas | Enforced pre-call input token limits (`AiModelRegistry`) + request telemetry (`ai_request_telemetry`) | `PASS` (Bounded in code; check Google AI Studio quota console) |

---

## 2. Cost Guardrails & Scaling Triggers
- **Avoid Premature Spend**: Retain single Render web process + single Vercel project + single PG16+pgvector instance with optional Redis until measurable pressure occurs.
- **Concrete Scaling Triggers**:
  1. Upgrade Render tier when elimination of 17s cold-start wake is required for real institutional SLAs or sustained CPU > 70%.
  2. Provision managed Redis (`REDIS_URL`) when multi-instance horizontal scaling or persistent cross-restart WebSocket/rate-limit synchronization is enabled.
  3. Enable managed PostgreSQL PITR + storage alerts when active user datasets approach 60% of disk quota.
