# Cambium Research Platform
## Master Environment Variables Specification

---

### Document Information
- **Classification**: Configuration Reference
- **Document ID**: `CAMBIUM-ENV-2026-V1`
- **Applicable Services**: Next.js 15 Client & NestJS 10 Enterprise Server

---

## 1. Backend Server Environment Variables (`server/.env`)

| Variable Name | Sensitivity | Default / Example Value | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | `INTERNAL` | `production` | Node execution environment (`production`, `development`, `test`). |
| `PORT` | `INTERNAL` | `4000` | Port on which the NestJS HTTP listener binds. |
| `DATABASE_URL` | `SECRET` | `postgres://user:pass@localhost:5432/cambium` | Full PostgreSQL 16 connection URI. |
| `DB_HOST` | `INTERNAL` | `localhost` | Database host (if `DATABASE_URL` is omitted). |
| `DB_PORT` | `INTERNAL` | `5432` | Database TCP port. |
| `DB_USERNAME` | `INTERNAL` | `postgres` | Database authentication username. |
| `DB_PASSWORD` | `SECRET` | `[SECURE_PASSWORD]` | Database user password. |
| `DB_NAME` | `INTERNAL` | `cambium` | Target database catalog name. |
| `DB_SSL` | `INTERNAL` | `false` | Enable TLS/SSL for database transport (required for RDS/Cloud SQL). |
| `REDIS_HOST` | `INTERNAL` | `localhost` | Redis server hostname. |
| `REDIS_PORT` | `INTERNAL` | `6379` | Redis TCP port. |
| `REDIS_PASSWORD` | `SECRET` | `""` | Redis auth token (optional for local, required for prod). |
| `JWT_SECRET` | `SECRET` | `cambium-ultra-secure-jwt-key` | HMAC SHA-256 secret for signing scholar bearer tokens. |
| `JWT_EXPIRES_IN`| `INTERNAL` | `7d` | Access token lifespan (standard ISO 8601 duration). |
| `GEMINI_API_KEY`| `SECRET` | `AIzaSy...` | Google Cloud API key for Gemini `text-embedding-004`. |
| `RESEND_API_KEY`| `SECRET` | `re_...` | Resend API key for live transactional scholarly email dispatch. |
| `SAML_ENTRY_POINT`| `INTERNAL`| `https://idp.university.edu/idp/profile/SAML2/Redirect/SSO` | InCommon / Shibboleth IdP SSO login endpoint. |
| `SAML_ISSUER` | `INTERNAL` | `https://cambium.edu/auth/saml/metadata` | EntityID registered with the institutional identity provider. |
| `SAML_CERT` | `SECRET` | `MIID...` | PEM-encoded public X.509 certificate of the IdP. |
| `AUDIT_HMAC_SECRET`| `SECRET`| `cambium-audit-ledger-hmac-key` | Key used for generating cryptographic proof signatures. |

---

## 2. Frontend Client Environment Variables (`client/.env.local`)

| Variable Name | Sensitivity | Default / Example Value | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `PUBLIC` | `http://localhost:4000` | Base URL of the NestJS REST API endpoints. |
| `NEXT_PUBLIC_WS_URL` | `PUBLIC` | `ws://localhost:4000` | WebSocket gateway URL for real-time chat and alerts. |
| `NEXT_PUBLIC_APP_URL` | `PUBLIC` | `http://localhost:3000` | Canonical public origin URL of the Next.js web application. |
| `NEXT_PUBLIC_ENVIRONMENT`| `PUBLIC`| `production` | Deployment environment label displayed in diagnostics. |

---

## 3. Secret Rotation & Security Policy

1. **JWT & HMAC Keys**: Must be rotated at least every 90 days or immediately upon credential exposure.
2. **Zero Plaintext Secrets in Git**: Enforced via `.gitignore` and pre-commit secret scanners.
3. **Container Injection**: In Kubernetes or Docker Swarm, all `SECRET` variables must be injected using Secret stores (HashiCorp Vault, AWS Secrets Manager, or Doppler).
