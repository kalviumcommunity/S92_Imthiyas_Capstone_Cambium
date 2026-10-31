# Cambium Research Platform
## Production Deployment Runbook & Operational Architecture

---

### Document Information
- **Classification**: Enterprise Operations & DevOps Runbook
- **Document ID**: `CAMBIUM-OPS-RUNBOOK-2026-V1`
- **Target Audience**: Site Reliability Engineers (SRE), DevSecOps, System Administrators

---

## 1. System Requirements & Prerequisites

### 1.1 Infrastructure Minimums (Per Node)
- **CPU**: 4 vCPU (x86_64 or ARM64 / Graviton)
- **Memory**: 8 GB RAM (16 GB recommended for high-volume PDF parsing)
- **Storage**: 50 GB NVMe SSD
- **OS**: Ubuntu 22.04 LTS / Debian 12 / Alpine Linux

### 1.2 Core Dependencies
- **Node.js**: v20.12.0 LTS or v22 LTS
- **PostgreSQL**: 16.2+ with `pgvector` extension enabled (`CREATE EXTENSION IF NOT EXISTS vector;`)
- **Redis**: 7.2+ (Standalone or AWS ElastiCache Cluster)
- **Reverse Proxy**: Nginx 1.24+ or Cloudflare Enterprise

---

## 2. Docker Compose Production Architecture

Deploy the entire stack with a single command using Docker Compose:

```yaml
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg16
    restart: always
    environment:
      POSTGRES_DB: cambium_production
      POSTGRES_USER: cambium_admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cambium_admin -d cambium_production"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redisdata:/data
    ports:
      - "6379:6379"

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: postgres://cambium_admin:${DB_PASSWORD}@postgres:5432/cambium_production
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "4000:4000"

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    restart: always
    depends_on:
      - server
    environment:
      NODE_ENV: production
      PORT: 3000
      NEXT_PUBLIC_API_URL: https://api.cambium.edu
    ports:
      - "3000:3000"

volumes:
  pgdata:
  redisdata:
```

---

## 3. Step-by-Step Bare Metal / VPS Deployment

### Step 1: Clone & Configure Environment
```bash
git clone https://github.com/kalviumcommunity/S92_Imthiyas_Capstone_Cambium.git /opt/cambium
cd /opt/cambium
cp server/.env.example server/.env.production
cp client/.env.example client/.env.production
# Edit .env.production with live credentials
```

### Step 2: Database Initialization & Vector Extension
```bash
sudo -u postgres psql -c "CREATE DATABASE cambium_production;"
sudo -u postgres psql -d cambium_production -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### Step 3: Install & Build
```bash
npm install
npm --prefix server run build
npm --prefix client run build
```

### Step 4: Process Management via PM2
```bash
pm2 start server/dist/main.js --name "cambium-server" -i max
pm2 start "npm --prefix client run start" --name "cambium-client"
pm2 save
pm2 startup
```

---

## 4. Verification & Health Check Endpoints

Execute these synthetic probes after any deployment:

1. **Server Health Probe**:
   ```bash
   curl -s -f http://localhost:4000/api/v1/health | jq .
   # Expected: { "status": "ok", "timestamp": "...", "database": "connected", "redis": "connected" }
   ```
2. **Audit Ledger Proof Verification**:
   ```bash
   curl -s -f http://localhost:4000/api/v1/audit/export/signed | jq .
   # Expected: { "merkleRoot": "...", "signature": "...", "totalBlocks": 4 }
   ```
3. **Client Production Bundle Check**:
   ```bash
   curl -s -I http://localhost:3000/ | grep "HTTP/1.1 200 OK"
   ```

---

## 5. Disaster Recovery & Backup Protocol

- **Daily Logical Snapshot**:
  `pg_dump -U cambium_admin -Fc cambium_production > /backups/cambium_$(date +%F).dump`
- **Continuous Archiving**: Enable WAL archiving to Amazon S3 via `wal-g` for Point-in-Time Recovery (PITR) up to the minute of failure.
- **RTO / RPO Target**:
  - Recovery Time Objective (RTO): $< 30$ minutes.
  - Recovery Point Objective (RPO): $< 5$ minutes of data loss.
