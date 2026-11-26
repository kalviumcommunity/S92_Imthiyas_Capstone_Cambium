# Service Health & Reliability Architecture (Phase 8)

## 1. Liveness vs Readiness Semantics
- **Liveness (`/api/v1/health/liveness`)**: Returns HTTP `200 { status: "UP", uptimeSeconds }` without querying external dependencies. Render checks this path so slow cold DB handshakes never trigger restart loops.
- **Readiness (`/api/v1/health/readiness`, `/api/v1/health`)**: Verifies live PostgreSQL connectivity (`SELECT 1`). Returns `503 ServiceUnavailableException` if PostgreSQL is unreachable; reports Redis (`connected` | `degraded`) and AI provider (`configured` | `degraded_offline`) without crashing core endpoints.
- **Production Root Scrubbing**: In `NODE_ENV=production`, `GET /` suppresses internal DB names, schema names, and Swagger paths.

## 2. Graceful Degradation & Shutdown Boundaries
- **Graceful Shutdown**: `registerGracefulShutdown()` enables Nest shutdown hooks on `SIGTERM`/`SIGINT` with a 10s drain window before exit.
- **Dependency Resilience**: Unavailable Redis degrades Socket.io/throttling to process-local memory; unavailable Gemini triggers deterministic/offline synthesis or abstention rather than failing core authentication, bookmarks, or discovery.
- **Timeouts**: Server keep-alive (`65s`), headers (`66s`), HTTP request timeout (`30s`), PostgreSQL `connectionTimeoutMillis` (`5s`), `statement_timeout` (`15s`).
