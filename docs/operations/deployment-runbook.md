# Cambium Production Deployment Runbook
## `docs/operations/`

This runbook documents the multi-environment deployment architecture, container orchestration, environment variable management, and continuous operation runbooks for Cambium.

### Supported Deployment Targets

| Target | Architecture | Configuration Manifest |
| :--- | :--- | :--- |
| **Strategy A (Decoupled Best-of-Breed)** | Vercel (Next.js Edge) + Render (NestJS API) + Supabase (PostgreSQL 16 + pgvector) | `render.yaml` & Vercel project settings |
| **Strategy B (Multi-Container Docker)** | PostgreSQL 16 + pgvector, Redis 7, Server, Client, Nginx Gateway | `docker-compose.yml`, `Dockerfile` |
| **Strategy C (Single-Server VPS / Bare-Metal)** | PM2 cluster mode supervision (`cambium-server`, `cambium-client`) + Caddy auto-HTTPS reverse proxy | `ecosystem.config.js`, `Caddyfile` |

### Key Operations Documents
- [Production Deployment Runbook](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/deployment/PRODUCTION_DEPLOYMENT_RUNBOOK.md)
- [Environment Variables Vault Specification](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/deployment/ENVIRONMENT_VARIABLES.md)
- [Release Process & Versioning Protocol](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/operations/release-process.md)
- [Disaster Recovery Playbook](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/DISASTER_RECOVERY_PLAYBOOK.md)
- [Docker Deployment Guide](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/DOCKER_DEPLOYMENT_GUIDE.md)
- [Deployment Verdict & Execution Plan](file:///C:/Users/shaik/.gemini/antigravity/brain/a353e018-efe7-417e-8e2c-cd279f726423/deployment_verdict_and_execution_plan.md)

