# Cambium Research Platform — Backend Deployment Verification
## Kalvium Milestone 2.16 Proof of Work: Deployed Backend Server

---

### 1. Deployment Metadata
- **Student Name**: Shaik Mohamed Imthiyas T
- **Squad**: Squad 92 (S92)
- **Concept**: Deployed backend server
- **Lesson ID**: `2.16 Backend Deployment`
- **Cloud Hosting Provider**: Render (Node.js Web Service)
- **Service Name**: `cambium-api`
- **Service ID**: `srv-dbql7sajnfac7391m4h0`
- **Region**: Oregon (US West) / Free Tier ($0/month)
- **Status**: 🟢 **LIVE / OPERATIONAL**

---

### 2. Live Production Endpoints
| Component | Endpoint URL | Status | Verification Protocol |
| :--- | :--- | :--- | :--- |
| **API Base URL** | `https://cambium-api-ufj3.onrender.com` | `200 OK` | Root API Health Check |
| **Distributed Health Probe** | `https://cambium-api-ufj3.onrender.com/health` | `200 OK` | Liveness & Database Readiness |
| **Interactive OpenAPI / Swagger** | `https://cambium-api-ufj3.onrender.com/api/docs` | `200 OK` | Swagger UI 3.0 Interactive Docs |
| **Connected Frontend Client** | `https://cambium-research.vercel.app` | `200 OK` | Next.js 15 Presentation Layer |

---

### 3. Server Build & Runtime Configuration
- **Repository**: `kalviumcommunity/S92_Imthiyas_Capstone_Cambium`
- **Branch**: `main`
- **Root Directory**: `server`
- **Language / Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Port**: `5000`

---

### 4. Database & Infrastructure Topology
- **Database Engine**: PostgreSQL 17 + `pgvector` extension
- **Hosting**: Supabase Managed Instance (`aws-1-ap-southeast-2.pooler.supabase.com:5432`)
- **Schema & Seeding**:
  - All 18 normalized 3NF relational schemas initialized
  - 500 research opportunities populated with 768-dimensional AI vector embeddings
  - Default scholars and research identity profiles synchronized

---

### 5. Production Environment Variables Configured on Render
- `NODE_ENV`: `production`
- `PORT`: `5000`
- `DATABASE_URL`: `postgresql://postgres.wcgqomcpoalqvsyukaba:2Live%26letLive@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`
- `DB_SSL`: `true`
- `DB_SYNCHRONIZE`: `false`
- `JWT_SECRET`: `cambium-enterprise-jwt-super-secret-key-2026-v2`
- `JWT_REFRESH_SECRET`: `cambium-enterprise-refresh-secret-key-2026-v2`
- `CORS_ORIGIN`: `https://cambium-research.vercel.app,http://localhost:3000`
- `COOKIE_SAME_SITE`: `none`

---

### 6. Health Probe Response Evidence
```json
{
  "status": "ok",
  "service": "Cambium Core Platform API",
  "version": "2.0.0",
  "uptime": 4518.29,
  "timestamp": "2026-11-12T14:40:00.000Z",
  "database": "connected",
  "redis": "degraded",
  "environment": "production"
}
```
