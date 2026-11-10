# REST API Specification & Developer Guide (api-guide.md)
## Cambium — AI-Powered Research Opportunity Discovery & Intelligence Platform
**The Enterprise Research Operating System**

---

### Metadata
- **Document ID**: `API-CAMBIUM-2026-V2`
- **Product Name**: Cambium Research Platform
- **Lead API Architect**: Shaik Mohamed Imthiyas T
- **Status**: `ENFORCED REST SPECIFICATION`
- **Current Version**: `2.0.0`
- **Protocol**: HTTP/1.1 and HTTP/2 over TLS 1.3
- **Base URLs**:
  - **Local Development**: `http://localhost:5000/api`
  - **Frontend Proxy**: `http://localhost:3000/api`
  - **Production Edge**: `https://api.cambium.research/api`
- **Bruno Collection**: Available at [`bruno/`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/bruno/)

---

## 1. Authentication & Request Conventions

### 1.1 Headers
All requests communicating with protected endpoints must pass either a Bearer JWT token in the `Authorization` header or include the `cambium_access_token` session cookie.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
```

### 1.2 Standard Response Envelopes
Successful responses return standard JSON envelopes with status `200 OK` or `201 Created`.

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-11-10T09:00:00.000Z"
}
```

### 1.3 Standard Error Codes
When an error occurs, the server responds with an RFC 7807 compliant JSON structure:

```json
{
  "statusCode": 400,
  "message": "Validation failed for field 'deadline': must be an ISO 8601 date string",
  "error": "Bad Request",
  "timestamp": "2026-11-10T09:00:00.000Z"
}
```

| HTTP Status | Meaning | Typical Scenario |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | Data retrieved or resource updated |
| `201 Created` | Resource created | Opportunity or user successfully created |
| `400 Bad Request` | Validation failure | Missing required fields or malformed payload |
| `401 Unauthorized` | Missing/invalid token | Unauthenticated request to protected endpoint |
| `403 Forbidden` | Insufficient role | Student fellow trying to execute PI compliance action |
| `404 Not Found` | Entity missing | Requested opportunity, post, or user does not exist |
| `429 Too Many Requests` | Rate limit exceeded | Exceeded 60 req/min threshold on public endpoint |
| `500 Server Error` | Unhandled exception | Sanitized internal error; logged to audit trail |

---

## 2. API Route Inventory by Domain

### 2.1 Authentication (`/api/auth`)
*Controller: [`server/src/modules/auth/auth.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/auth/auth.controller.ts)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new scholar account (`email`, `password`, `name`, `institution`). |
| `POST` | `/api/auth/login` | Public | Authenticate with credentials; returns JWT and sets `HttpOnly` refresh cookie. |
| `POST` | `/api/auth/refresh` | Public | Exchange refresh token for fresh 15-minute access token. |
| `POST` | `/api/auth/logout` | Authenticated | Revoke refresh token and clear session cookies. |
| `GET` | `/api/auth/profile` | Authenticated | Retrieve profile details of currently logged-in user. |
| `GET` | `/api/auth/google` | Public | Initiate Google OAuth 2.0 institutional login redirect. |
| `GET` | `/api/auth/saml/login` | Public | Initiate SAML 2.0 Single Sign-On for participating universities. |
| `POST` | `/api/auth/saml/callback` | Public | SAML assertion consumer endpoint verifying signed XML tokens. |

---

### 2.2 Users & Scholar Profiles (`/api/users`)
*Controller: [`server/src/modules/users/users.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/users/users.controller.ts)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Public | List scholars with pagination and discipline filtering. |
| `GET` | `/api/users/:id` | Public | Get complete scholar profile including publications and lab affiliation. |
| `PUT` | `/api/users/:id` | Own User / Admin | Update profile metadata (`name`, `bio`, `headline`, `department`, `orcid`). |
| `POST` | `/api/users/:id/interests` | Own User | Update scholar's normalized research interest taxonomy. |
| `PATCH` | `/api/users/:id/role` | Admin / Compliance | Upgrade or adjust role permissions (`fellow` ➔ `researcher` ➔ `pi`). |

---

### 2.3 Research Opportunities & Grants (`/api/opportunities`)
*Controller: [`server/src/modules/opportunities/opportunities.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/opportunities/opportunities.controller.ts)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/opportunities` | Public | Query opportunities with query parameters: `search`, `type`, `funder`, `page`, `limit`. |
| `GET` | `/api/opportunities/:id` | Public | Get single opportunity specifications and eligibility constraints. |
| `POST` | `/api/opportunities` | PI / Admin | Create a new funding opportunity or Call for Papers. |
| `PUT` | `/api/opportunities/:id` | PI / Admin | Update existing opportunity details or deadline extension. |
| `DELETE`| `/api/opportunities/:id` | Admin | Archive or remove an opportunity from the live catalog. |
| `GET` | `/api/opportunities/tags` | Public | List all active opportunity tags with aggregate counts. |
| `GET` | `/api/opportunities/search` | Public | Hybrid semantic search combining text search and cosine vector similarity. |

---

### 2.4 AI Autocomplete & Assistant (`/api/ai`, `/api/assistant`)
*Controllers: [`server/src/modules/ai/ai-autocomplete.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/ai/ai-autocomplete.controller.ts), [`server/src/modules/assistant/assistant.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/assistant/assistant.controller.ts)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/autocomplete` | Public | Real-time LLM ghost-text and query completion. Returns `{ ghostText, suggestions, source, latencyMs }`. |
| `POST` | `/api/assistant/chat` | Authenticated | Multi-turn conversational research assistant grounded in indexed papers. |

---

### 2.5 Research Contributions & CRediT Taxonomy (`/api/contributions`)
*Controller: [`server/src/modules/contributions/contributions.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/contributions/contributions.controller.ts)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/contributions` | Public | Filter scholarly contributions by author ID, DOI, or CRediT role. |
| `POST` | `/api/contributions` | Authenticated | Claim a structured scholarly contribution for a publication or dataset. |
| `POST` | `/api/contributions/:id/endorse` | Authenticated | Co-author peer endorsement verifying CRediT role attribution. |

---

### 2.6 Academic Community & Connections (`/api/community`, `/api/connections`)
*Controllers: [`server/src/modules/community/community.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/community/community.controller.ts), [`server/src/modules/connections/connections.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/connections/connections.controller.ts)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/community/posts` | Public | Paginated feed of academic discussions, hypotheses, and reviews. |
| `POST` | `/api/community/posts` | Authenticated | Publish a new academic post or preprint discussion. |
| `POST` | `/api/community/posts/:id/comments` | Authenticated | Add a threaded peer reply to an academic post. |
| `POST` | `/api/community/posts/:id/react` | Authenticated | Toggle reaction (`endorse`, `question`, `bookmark`) on a post. |
| `POST` | `/api/connections/request` | Authenticated | Send a collaboration/connection invitation to another researcher. |
| `PATCH`| `/api/connections/:id/respond` | Authenticated | Accept or decline a pending connection invitation. |

---

### 2.7 Collaborative Projects & Workspaces (`/api/projects`)
*Controller: [`server/src/modules/projects/projects.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/projects/projects.controller.ts)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Authenticated | List lab group projects where the current user is a collaborator or PI. |
| `POST` | `/api/projects` | Authenticated | Provision a new collaborative research workspace. |
| `POST` | `/api/projects/:id/members` | Lab PI / Owner | Invite a collaborator with specific project permissions. |
| `GET` | `/api/projects/:id/activities` | Authenticated | Fetch timestamped workspace activity log. |

---

### 2.8 Ingestion & Data Crawlers (`/api/ingestion`)
*Controller: [`server/src/modules/ingestion/ingestion.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/ingestion/ingestion.controller.ts)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ingestion/trigger` | Admin / Worker | Dispatch crawler job for: `arxiv`, `crossref`, `doaj`, `openalex`, `grants_gov`, or `all`. |

---

### 2.9 Cryptographic Audit Ledger & System Telemetry (`/api/audit`, `/api/health`)
*Controllers: [`server/src/modules/audit/audit.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/audit/audit.controller.ts), [`server/src/app.controller.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/app.controller.ts)*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/audit/logs` | Compliance / Admin | Query tamper-evident audit logs with actor and date filters. |
| `POST` | `/api/audit/verify` | Compliance / Admin | Cryptographically verify SHA-256 blockchain-style hash chain integrity. |
| `GET` | `/api/health` | Public | Liveness and readiness health probe returning database and Redis statuses. |
| `GET` | `/api/telemetry/metrics` | Internal / Admin | Prometheus metrics export (HTTP latencies, crawler queue size). |

---

## 3. Bruno API Collection Quickstart

The repository includes a ready-to-use **Bruno API Collection** under [`bruno/`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/bruno/):

1. Download and open [Bruno](https://www.usebruno.com/).
2. Click **Open Collection** and select the [`bruno/`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/bruno/) folder in the repository root.
3. Select the `Local Development` environment (`baseUrl: http://localhost:5000/api`).
4. Execute the `Auth / Login` request to auto-populate the bearer token across all subsequent requests.

