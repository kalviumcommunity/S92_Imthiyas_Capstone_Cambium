# Cambium Research Platform
## Master Environment Variables & Production Vault Specification

---

### Document Information
- **Classification**: Authoritative Configuration Reference
- **Document ID**: `CAMBIUM-ENV-2026-V2`
- **Applicable Services**: Next.js 15 Client & NestJS 10 Enterprise Server
- **Release Version**: `2.0.0 General Availability`
- **Verification Tooling**: `npm run verify:env` (`scripts/verify-env.mjs`)

---

## 1. Backend Server Environment Variables (`server/.env.production.example`)

| Variable Name | Sensitivity | Default / Example Value | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | `INTERNAL` | `production` | Node execution environment (`production`, `development`, `test`). |
| `PORT` | `INTERNAL` | `5000` | Port on which the NestJS HTTP listener binds. |
| `CORS_ORIGIN` | `INTERNAL` | `https://cambium.edu,https://www.cambium.edu` | Strict comma-separated list of allowed HTTPS origins. Never use `*` with credentials in production. |
| `DATABASE_URL` | `SECRET` | `postgresql://cambium_admin:pass@db.cambium.internal:5432/cambium?sslmode=require` | Full PostgreSQL 16 connection URI. Automatically parsed by TypeORM if provided. |
| `POSTGRES_HOST` | `INTERNAL` | `db.cambium.internal` | Database host (fallback if `DATABASE_URL` is omitted). |
| `POSTGRES_PORT` | `INTERNAL` | `5432` | Database TCP port. |
| `POSTGRES_USER` | `INTERNAL` | `cambium_admin` | Database authentication username. |
| `POSTGRES_PASSWORD` | `SECRET` | `[SECURE_PASSWORD]` | Database user password. |
| `POSTGRES_DB` | `INTERNAL` | `cambium` | Target database catalog name. |
| `DB_SSL` | `INTERNAL` | `true` | Enable TLS/SSL for database transport (required for RDS/Supabase/Cloud SQL). |
| `DB_SYNCHRONIZE` | `INTERNAL` | `false` | Must be `false` in production to prevent unintended table dropping. Defaults to `!isProd`. |
| `DB_POOL_MAX` | `INTERNAL` | `50` | Maximum database connection pool clients per container/pod. |
| `DB_LOGGING` | `INTERNAL` | `error` | Database query logging level (`error`, `warn`, `true`, `false`). |
| `REDIS_URL` | `SECRET` | `rediss://default:pass@redis.cambium.internal:6379` | Full Redis connection URI with TLS (`rediss://`). |
| `REDIS_HOST` | `INTERNAL` | `redis.cambium.internal` | Redis server hostname. |
| `REDIS_PORT` | `INTERNAL` | `6379` | Redis TCP port. |
| `REDIS_PASSWORD` | `SECRET` | `[SECURE_REDIS_PASSWORD]` | Redis auth token (required for production). |
| `JWT_SECRET` | `SECRET` | `[64-hex-character-key]` | HMAC SHA-256 secret for signing scholar bearer access tokens ($\ge 256$ bits of entropy). |
| `JWT_EXPIRES_IN`| `INTERNAL` | `15m` | Access token lifespan (standard ISO duration, e.g. `15m`). |
| `JWT_REFRESH_SECRET` | `SECRET` | `[64-hex-character-key]` | Dedicated HMAC secret for rotating HttpOnly refresh tokens. Must differ from `JWT_SECRET`. |
| `JWT_REFRESH_EXPIRES_IN`| `INTERNAL`| `7d` | Refresh token lifespan (e.g. `7d`). |
| `AUDIT_HMAC_SECRET` | `SECRET` | `[64-hex-character-key]` | Key used for generating SHA-256 cryptographic audit ledger Merkle roots. |
| `GEMINI_API_KEY`| `SECRET` | `AIzaSy...` | Google Cloud API key for Gemini `text-embedding-004` (768-dim vector embeddings). Falls back to deterministic SHA-256 vector synthesis if omitted. |
| `RESEND_API_KEY`| `SECRET` | `re_live_...` | Resend API key for live transactional scholarly email dispatch. Falls back to simulated outbox log if omitted. |
| `EMAIL_FROM` | `INTERNAL` | `Cambium Intelligence <scholar@cambium.research>` | Sender envelope for transactional communications. |
| `OPENALEX_POLITE_EMAIL`| `INTERNAL`| `imthiyas@cambium.research` | Courtesy email unlocking OpenAlex polite pool rate limits (100 req/sec). |
| `GOOGLE_CLIENT_ID`| `INTERNAL` | `[ID].apps.googleusercontent.com` | Google Cloud OAuth 2.0 backend verification client ID. |
| `SAML_ENTRY_POINT`| `INTERNAL`| `https://idp.university.edu/idp/profile/SAML2/Redirect/SSO` | InCommon / Shibboleth IdP SSO login endpoint. |
| `SAML_ISSUER` | `INTERNAL` | `https://cambium.edu/saml/metadata` | EntityID registered with the institutional identity provider. |
| `SAML_CERT` | `SECRET` | `MIID...` | PEM-encoded public X.509 certificate of the IdP. |
| `SENTRY_DSN` | `SECRET` | `https://[KEY]@o[ORG].ingest.sentry.io/[PROJECT]` | Backend error tracing and APM. |
| `OTEL_EXPORTER_OTLP_ENDPOINT`| `INTERNAL`| `http://otel-collector.internal:4318` | OpenTelemetry OTLP tracing collector endpoint. |

---

## 2. Frontend Client Environment Variables (`client/.env.production.example`)

| Variable Name | Sensitivity | Default / Example Value | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `PUBLIC` | `https://api.cambium.edu/api/v1` | Base URL of the NestJS REST API endpoints. |
| `NEXT_PUBLIC_APP_URL` | `PUBLIC` | `https://cambium.edu` | Canonical public origin URL of the Next.js web application. |
| `NEXT_PUBLIC_WS_URL` | `PUBLIC` | `wss://api.cambium.edu` | WebSocket gateway URL for real-time collaboration. |
| `NEXT_PUBLIC_SOCKET_URL` | `PUBLIC` | `https://api.cambium.edu` | Socket.io server connection origin. |
| `NEXT_PUBLIC_ENVIRONMENT`| `PUBLIC`| `production` | Deployment environment label displayed in diagnostics. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`| `PUBLIC`| `[ID].apps.googleusercontent.com` | Google Cloud OAuth client ID for browser Google Sign-In. |
| `NEXT_PUBLIC_SENTRY_DSN` | `PUBLIC` | `https://[KEY]@o[ORG].ingest.sentry.io/[PROJECT]` | Client-side error tracking. |

---

## 3. Automated Verification & Pre-Deployment Audit

Cambium includes an automated environment verification script:

```bash
# Verify active environment and local configurations
npm run verify:env

# Audit production templates for specification completeness
node scripts/verify-env.mjs --templates

# Strict Production Audit (enforces high entropy, non-default credentials, and SSL)
npm run verify:env:prod
```

---

## 4. Secret Rotation & Security Policy

1. **Entropy Standard**: All `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `AUDIT_HMAC_SECRET` tokens must possess at least 256 bits of cryptographic entropy ($64$ hex characters).
2. **Zero Plaintext Secrets in Git**: Enforced via master `.gitignore` patterns:
   ```gitignore
   .env
   .env.*
   !*.example
   ```
3. **Container Injection**: In Kubernetes, AWS ECS, or Docker Swarm, all `SECRET` variables must be injected at runtime using cloud vault providers (AWS Secrets Manager, Doppler, or HashiCorp Vault).
