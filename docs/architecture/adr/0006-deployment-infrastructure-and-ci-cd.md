# ADR 0006: Containerized Deployment Infrastructure & CI/CD Pipeline
**Document ID**: `ADR-CAMBIUM-0006`  
**Status**: `ACCEPTED`  
**Date**: `2026-10-26`  
**Author**: Shaik Mohamed Imthiyas T  
**Component**: DevOps, Deployment & Infrastructure (`Dockerfile`, `docker-compose.yml`, `.github/workflows/`)  

---

## 1. Context & Problem Statement
Cambium Research is an enterprise academic platform that must run seamlessly across diverse operational contexts:
1. **Local Developer Evaluation**: Fast cold boot on developer laptops with zero external cloud dependencies.
2. **Automated CI/CD Quality Gates**: Headless regression testing, static type verification, unit test execution, and container build validation on every git push.
3. **Institutional On-Premises & Private Cloud Deployment**: Academic institutions often mandate that research data, student identities, and grant drafts remain within sovereign university private clouds (OpenStack, Docker Swarm, Kubernetes, or dedicated Linux VPS) rather than commercial public clouds.

We must choose an infrastructure strategy that balances developer velocity with absolute deployment portability.

---

## 2. Decision Drivers
- **Zero Cloud Vendor Lock-In**: Complete freedom to host on AWS, Hetzner, DigitalOcean, university on-premise compute clusters, or Vercel.
- **Reproducible Multi-Tier Environment**: Deterministic orchestration of PostgreSQL 16 + pgvector, Redis 7, NestJS API, and Next.js frontend.
- **Lightweight Production Artifacts**: Multi-stage Docker builds minimizing attack surface and image size (Node Alpine base images).
- **Automated Continuous Integration Gates**: Fast, reliable pipeline (< 3 minutes) preventing broken merges to `main`.

---

## 3. Options Considered
1. **Standardized Multi-Stage Docker Containers + Docker Compose + GitHub Actions** *(Selected)*
2. **Proprietary PaaS Multi-Vendor Setup (Vercel Frontend + Render Backend + Supabase)**
3. **Full Kubernetes (K8s) Cluster Orchestration**
4. **Bare-Metal Manual PM2 & Systemd Deployment**

---

## 4. Evaluation & Comparison Matrix

| Evaluation Criterion (Weight) | Docker Compose + GitHub Actions | PaaS (Vercel + Render + Supabase) | Kubernetes (K8s) | Bare-Metal PM2 |
| :--- | :---: | :---: | :---: | :---: |
| **Portability & Sovereignty (25%)** | 5/5 (Runs anywhere) | 1.5/5 (Vendor lock-in) | 5/5 | 3/5 |
| **Operational Complexity (20%)** | 4.5/5 (Simple compose) | 5/5 (Zero ops initially) | 1/5 (Overkill for early stage) | 2.5/5 |
| **Cost Predictability (20%)** | 5/5 (Fixed $5–$20 VPS) | 2/5 (Usage-tier spikes) | 2.5/5 (High idle cost) | 5/5 |
| **CI/CD Integration Speed (20%)** | 5/5 (GitHub Actions) | 4.5/5 | 3/5 (Complex manifests) | 2/5 |
| **Disaster Recovery (15%)** | 5/5 (Scripted volume dumps) | 3/5 (Separate consoles) | 4/5 | 2/5 |
| **Weighted Score** | **4.88 / 5.0** | **3.08 / 5.0** | **3.08 / 5.0** | **2.95 / 5.0** |

---

## 5. Decision & Rationale
We selected a **Standardized Multi-Stage Docker Architecture** orchestrated via **Docker Compose** for local and production deployment, validated by a **Three-Stage GitHub Actions CI Pipeline**.

### 5.1 Multi-Stage Container Architecture
Both [`client/Dockerfile`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/Dockerfile) and [`server/Dockerfile`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/Dockerfile) implement lean multi-stage patterns:
- Stage 1 (`deps`): Installs production and build dependencies with layer caching.
- Stage 2 (`builder`): Compiles TypeScript and runs Next.js `standalone` optimization.
- Stage 3 (`runner`): Strips build tooling, runs as an unprivileged non-root user (`USER node`), and copies only minimal runtime artifacts.
- **Resulting Image Sizes**: Server ~180MB, Client ~140MB.

### 5.2 Multi-Container Mesh (`docker-compose.yml`)
Connects all 4 services on an isolated internal bridge network (`cambium_mesh`):
- `cambium_postgres`: `pgvector/pgvector:pg16` with persistent volume `cambium_pgdata` and healthcheck (`pg_isready`).
- `cambium_redis`: `redis:7-alpine` with persistent append-only storage and healthcheck (`redis-cli ping`).
- `cambium_server`: NestJS 10 daemon mapped to port 5000 with dependent healthcheck gating.
- `cambium_client`: Next.js 15 standalone server mapped to port 3000.

### 5.3 Automated GitHub Actions CI Pipeline (`.github/workflows/ci.yml`)
Enforces 3 mandatory parallel release gates on every push and pull request:
1. **Backend API Verification**: Installs dependencies, runs TypeScript compilation (`tsc`), boots Redis service container, and executes Vitest unit tests.
2. **Frontend UI Verification**: Runs Next.js 15 static production chunk compilation across all 49 routes.
3. **Docker Multi-Stage Build Quality Gate**: Validates that Dockerfiles build without syntax or layer failures.

---

## 6. What Was Rejected & Why
- **Proprietary PaaS (Vercel + Supabase)**: Rejected as mandatory architecture because university data governance frequently forbids hosting human-subjects research (IRB protocols) on commercial multi-tenant clouds without signed Business Associate Agreements (BAAs).
- **Kubernetes (K8s)**: Rejected for current stage. K8s introduces severe cognitive overhead, manifest sprawl, and high idle cloud compute costs ($70+/month for managed control planes) that offer no performance advantage for early to mid-stage traffic.

---

## 7. Authoritative References
- Docker Multi-Stage Build Documentation: [https://docs.docker.com/build/building/multi-stage/](https://docs.docker.com/build/building/multi-stage/)
- GitHub Actions Documentation: [https://docs.github.com/actions](https://docs.github.com/actions)
- Cambium Docker Deployment Guide: [`docs/DOCKER_DEPLOYMENT_GUIDE.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/DOCKER_DEPLOYMENT_GUIDE.md)
