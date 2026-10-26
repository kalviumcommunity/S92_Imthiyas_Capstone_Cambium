# 🐳 Cambium Dockerized Application Deployment Guide

---

### Metadata
- **Document ID**: `DOCS-DOCKER-DEPLOYMENT-2026-V2`
- **Milestone Reference**: `Kalvium LU 2.19 — Dockerized Application Deployment`
- **Lead Architect**: Shaik Mohamed Imthiyas T
- **Status**: `ENFORCED / PRODUCTION ACTIVE`
- **Target Audience**: DevOps Engineers, Course Evaluators, Academic Defense Panel

---

## 1. Containerization Architecture Overview

Cambium utilizes a **production-hardened, multi-stage Docker container architecture** based on `node:20-alpine`. This approach minimizes image size, enhances security, and separates build-time dependencies from production execution.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BUILDER STAGE (node:20-alpine)                  │
│  - Install full devDependencies (npm ci)                               │
│  - Compile TypeScript / Next.js standalone assets                      │
│  - Prune devDependencies (npm prune --production)                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Extracted Built Artifacts Only
┌───────────────────────────────────▼────────────────────────────────────┐
│                        RUNNER STAGE (node:20-alpine)                   │
│  - Zero devDependencies / Minimal attack surface                       │
│  - Unprivileged user execution (USER node)                             │
│  - Built-in HTTP healthchecks (wget spider)                            │
│  - Output size reduced by ~85% (~120MB final footprint)                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Container Inventory & Topology

| Service | Container Name | Base Image | Port | Healthcheck | Purpose |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Frontend UI** | `cambium_client` | `node:20-alpine` | `3000` | `wget :3000/` | Next.js 15 App Router & Living Materials UI |
| **Backend API** | `cambium_server` | `node:20-alpine` | `5000` | `wget :5000/` | NestJS 10 REST, WebSockets, & Vector Search |
| **Vector DB** | `cambium_postgres` | `pgvector/pgvector:pg16` | `5432` | `pg_isready` | PostgreSQL 16 + pgvector (768d HNSW index) |
| **Cache & Queue**| `cambium_redis` | `redis:7-alpine` | `6379` | `redis-cli ping`| BullMQ background workers, Redlock, Caching |

---

## 3. Quickstart & Deployment Commands

### Option A: Launch Full Multi-Service Stack (Recommended)
```bash
# 1. Build and boot all containers in detached mode
docker-compose up -d --build

# 2. Check running container status and health
docker-compose ps

# 3. Stream real-time logs across all services
docker-compose logs -f

# 4. Gracefully stop all containers and preserve volumes
docker-compose down
```

### Option B: Build Individual Service Containers
```bash
# Build Backend Server container
docker build -t cambium/server:v2.0 -f server/Dockerfile ./server

# Build Frontend Client container
docker build -t cambium/client:v2.0 -f client/Dockerfile ./client

# Build using Root Monorepo Multi-Target Dockerfile
docker build --target server -t cambium-server .
docker build --target client -t cambium-client .
```

---

## 4. Key Security & Performance Hardening

1. **Non-Root Execution (`USER node`)**:
   Neither container runs as `root`. The runner stage explicitly switches to the unprivileged `node` user, mitigating container breakout risks.
2. **Context Minimization (`.dockerignore`)**:
   Comprehensive `.dockerignore` files prevent local `node_modules`, test caches, `.env` secrets, and git metadata from entering build contexts.
3. **Automated Healthchecks**:
   Both client and server include active Docker healthchecks with retry logic, enabling orchestrators to detect and restart unhealthy pods automatically.
4. **Volume Persistence**:
   Relational data (`cambium_pgdata`) and Redis state (`cambium_redisdata`) are persisted across container teardowns in dedicated Docker volumes.

---

## 🎥 5. 3-Minute Video Recording Walkthrough Script (LU 2.19 Submission)

Use this structured script when recording your Google Meet video:

### ⏱️ Minute 1: Introduction & Architecture (0:00 – 1:00)
- **Visual**: Show your camera on, sharing your entire screen with VS Code open.
- **Talking Points**:
  - *"Hello! In this milestone (LU 2.19), I have implemented production Dockerfile support and containerized the Cambium Research Platform."*
  - *"Cambium is an Enterprise Research Operating System composed of a Next.js 15 App Router frontend, a NestJS 10 backend API, PostgreSQL 16 with pgvector for high-dimensional semantic search, and Redis 7 for distributed caching."*
  - *"To ensure high performance and strict security, I engineered multi-stage Dockerfiles with unprivileged non-root execution (`USER node`) and alpine base images, reducing final image footprint by over 80%."*

### ⏱️ Minute 2: Code Walkthrough — Dockerfiles & Docker Compose (1:00 – 2:00)
- **Visual**: Open and highlight `client/Dockerfile`, `server/Dockerfile`, `docker-compose.yml`, and `.dockerignore`.
- **Talking Points**:
  - *"Here in `client/Dockerfile`, we have Stage 1: builder, which runs `npm ci`, copies our Living Materials design tokens, and builds the Next.js standalone application. Stage 2 is the minimal runner that only copies the standalone bundle and static assets."*
  - *"Similarly, in `server/Dockerfile`, we compile TypeScript, prune devDependencies, create the upload directories with proper non-root permissions, and start the NestJS runtime."*
  - *"In `docker-compose.yml`, we orchestrate the four core services connected through an isolated bridge network (`cambium_mesh`) with healthchecks and volume persistence."*

### ⏱️ Minute 3: Demonstration & GitHub Pull Request (2:00 – 3:30)
- **Visual**: Open terminal / browser showing `docker-compose ps` (or `npm run build`), the live web application on `http://localhost:3000`, and GitHub PR.
- **Talking Points**:
  - *"Now, let's look at the running application. Our frontend is served on port 3000, connected to our backend on port 5000."*
  - *"All automated quality gates—including TypeScript compilation, Vitest unit tests, and GitHub Actions Docker multi-stage build checks—have passed cleanly."*
  - *"I've created the pull request from branch `feature/dockerfile-support` into `main`, requested the AI review using `@CodiumAI-Agent /review`, and verified all checks."*
  - *"Thank you!"*
