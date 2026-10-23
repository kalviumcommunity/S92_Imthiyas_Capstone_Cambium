# 📡 Enterprise API Inventory & Controller Catalog
## REST, WebSocket & Server-Sent Events Endpoint Specifications
**Author & Lead Architect**: Shaik Mohamed Imthiyas T  
**Document ID**: `AUDIT-API-CAMBIUM-2026-V1`  
**Base URL**: `http://localhost:5000/api` | **OpenAPI Spec**: `GET /api/docs-json`

---

## 1. Authentication & Identity Management (`/api/auth`)

| Method | Endpoint | Auth | Request DTO / Body | Response Schema | Bruno Test File |
| :---: | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | None | `{ username, email, password, fullName, institution, researchInterests }` | `{ accessToken, refreshToken, user }` | `bruno/Auth/Register.bru` |
| `POST` | `/api/auth/login` | None | `{ email, password }` | `{ accessToken, refreshToken, user }` | `bruno/Auth/Login.bru` |
| `POST` | `/api/auth/refresh` | None | `{ refreshToken }` | `{ accessToken, refreshToken }` | `bruno/Auth/Refresh Token.bru` |
| `POST` | `/api/auth/logout` | Bearer | `{ refreshToken }` | `{ success: true, message: "Logged out" }` | `bruno/Auth/Logout.bru` |
| `POST` | `/api/auth/google` | None | `{ idToken }` | `{ accessToken, refreshToken, user }` | `bruno/Auth/Google Login.bru` |

---

## 2. Research Opportunity Engine (`/api/opportunities`)

| Method | Endpoint | Auth | Request / Query Parameters | Response Schema | Bruno Test File |
| :---: | :--- | :---: | :--- | :--- | :--- |
| `GET` | `/api/opportunities` | None | `?search=&category=&page=1&limit=20` | `{ items: Opportunity[], total, page, limit }` | `bruno/Research Opportunities/Get All.bru` |
| `GET` | `/api/opportunities/:id` | None | URL Param `:id` | `Opportunity` entity with tags and vector distance | `bruno/Research Opportunities/Get by ID.bru` |
| `POST` | `/api/opportunities` | Bearer | `{ title, description, funder, amount, deadline, tags }` | Created `Opportunity` entity | `bruno/Research Opportunities/Create Opportunity.bru` |
| `PUT` | `/api/opportunities/:id` | Bearer | `{ title?, description?, amount?, deadline? }` | Updated `Opportunity` entity | `bruno/Research Opportunities/Update Opportunity.bru` |
| `DELETE` | `/api/opportunities/:id`| Admin | URL Param `:id` | `{ success: true }` | `bruno/Research Opportunities/Delete Opportunity.bru` |
| `POST` | `/api/opportunities/bulk`| Admin | `{ opportunities: CreateOpportunityDto[] }` | `{ createdCount: number }` | `bruno/Research Opportunities/Create Bulk.bru` |
| `GET` | `/api/opportunities/stats`| None | None | `{ totalGrants, totalFunding, activeFunders }` | `bruno/Research Opportunities/Get Stats.bru` |
| `GET` | `/api/opportunities/deadlines`| None | `?days=30` | `Opportunity[]` sorted by nearest deadline | `bruno/Research Opportunities/Get Upcoming Deadlines.bru` |

---

## 3. Research Artifact Upload & Storage (`/api/upload`)

| Method | Endpoint | Auth | Request Content-Type | Response Schema | Bruno Test File |
| :---: | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/api/upload` | Bearer | `multipart/form-data` (`file`) | `UploadedArtifactMetadata` (`{ id, originalName, sanitizedName, sizeBytes, mimeType, sha256Hash, createdAt }`) | `bruno/Upload/Upload Research Artifact.bru` |
| `POST` | `/api/upload/batch` | Bearer | `multipart/form-data` (`files[]`) | `UploadedArtifactMetadata[]` | — |
| `GET` | `/api/upload` | Bearer | None | `UploadedArtifactMetadata[]` (internal paths sanitized) | `bruno/Upload/List Uploaded Artifacts.bru` |
| `GET` | `/api/upload/:id` | Bearer | URL Param `:id` | `UploadedArtifactMetadata` | `bruno/Upload/Get Artifact Metadata.bru` |
| `DELETE` | `/api/upload/:id` | Bearer | URL Param `:id` | `{ success: true, id: string }` | — |

---

## 4. Bookmarks & Scholar Library (`/api/bookmarks`)

| Method | Endpoint | Auth | Parameters | Response Schema | Bruno Test File |
| :---: | :--- | :---: | :--- | :--- | :--- |
| `GET` | `/api/bookmarks/my` | Bearer | None | `Bookmark[]` populated with opportunity details | `bruno/Bookmarks/Get My List.bru` |
| `POST` | `/api/bookmarks` | Bearer | `{ opportunityId, notes, collectionName }` | Created `Bookmark` entity | `bruno/Bookmarks/Get All.bru` |
| `DELETE` | `/api/bookmarks/:id` | Bearer | URL Param `:id` | `{ success: true }` | `bruno/Bookmarks/Delete Bookmark.bru` |
| `GET` | `/api/bookmarks/user/:id` | Admin | URL Param `:id` | `Bookmark[]` | `bruno/Bookmarks/Get by User ID.bru` |

---

## 5. Scholar User Management (`/api/users`)

| Method | Endpoint | Auth | Parameters | Response Schema | Bruno Test File |
| :---: | :--- | :---: | :--- | :--- | :--- |
| `GET` | `/api/users` | Admin | `?page=1&limit=50` | `User[]` | `bruno/Users/Get All Users.bru` |
| `GET` | `/api/users/:id` | Bearer | URL Param `:id` | `User` profile (excluding passwordHash) | `bruno/Users/Get User by ID.bru` |
| `PUT` | `/api/users/:id` | Bearer | `{ fullName?, institution?, bio? }` | Updated `User` profile | `bruno/Users/Update User.bru` |
| `PUT` | `/api/users/:id/interests`| Bearer | `{ researchInterests: string[] }` | Updated `User` profile | `bruno/Users/Update User Interests.bru` |

---

## 6. Real-Time WebSocket & Server-Sent Events

### 6.1 WebSocket Gateway (`/chat`)
- **Protocol**: `ws://localhost:5000` via Socket.io v4
- **Channel / Events**:
  - `join_room` (`{ roomId: string, scholarId: string }`): Authenticates scholar in research grant discussion room.
  - `send_message` (`{ roomId: string, message: string, sender: string }`): Emits message to all scholars subscribed in the room.
  - `leave_room` (`{ roomId: string, scholarId: string }`): Cleans up presence.

### 6.2 Server-Sent Events Stream (`/api/v1/events`)
- **Protocol**: `text/event-stream` (HTTP/2 keep-alive streaming)
- **Endpoint**: `GET /api/v1/events/stream`
- **Payload Format**:
  ```json
  event: notification
  data: {"id": "evt-491", "type": "GRANT_MATCH", "title": "NIH R01 Matching Grant", "timestamp": "2026-10-22T18:30:00Z"}
  ```

---

<div align="center">
  <sub>API Inventory & Controller Catalog · Document ID: AUDIT-API-CAMBIUM-2026-V1 · Verified for Academic Year 2026</sub>
</div>
