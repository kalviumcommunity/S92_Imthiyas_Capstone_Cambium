# Cambium Research Platform — Mentor Evaluation Quick-Start Guide
## Technical Evaluation Protocol for Reviewers & Faculty Mentors

Welcome, Evaluators! This guide is designed for the technical evaluation panel to independently test, inspect, and evaluate the live **Cambium Enterprise Research Operating System**.

---

### 🌐 Live Production Access
- **Primary Web Application**: [https://cambium-research.vercel.app](https://cambium-research.vercel.app)
- **Live Enterprise API Backend**: [https://cambium-api-ufj3.onrender.com](https://cambium-api-ufj3.onrender.com)
- **Interactive OpenAPI 3.0 / Swagger**: [https://cambium-api-ufj3.onrender.com/api/docs](https://cambium-api-ufj3.onrender.com/api/docs)
- **System Health & Liveness Probe**: [https://cambium-api-ufj3.onrender.com/health](https://cambium-api-ufj3.onrender.com/health)
- **Database Diagnostic Engine**: [https://cambium-api-ufj3.onrender.com/api/database/diagnostics](https://cambium-api-ufj3.onrender.com/api/database/diagnostics)

---

### 🧪 Step-by-Step Independent Testing Journey

#### 1. Self-Service Account Registration
1. Navigate to [https://cambium-research.vercel.app/sign-up](https://cambium-research.vercel.app/sign-up).
2. Enter your name, institutional email (e.g. `mentor@university.edu`), and a password ($\ge 8$ characters).
3. Click **"Create Scholar Identity"**.
4. **Result**: Your account is persisted in the PostgreSQL database (`users` table), issuing a JWT access token and HttpOnly refresh cookie.
5. You are redirected to the **Scholar Onboarding Wizard** (`/welcome`).

#### 2. Profile Setup & ORCID Verification
1. On the onboarding page, select your primary research disciplines (e.g. *Artificial Intelligence*, *Quantum Computing*, *Bioinformatics*).
2. Complete onboarding and land directly in your authenticated **Scholar Dashboard** (`/dashboard`).
3. Notice your profile information, activity timeline, and persistent identity.

#### 3. Real-Data Research Opportunity Discovery
1. Navigate to **Research Opportunities** (`/opportunities` or `/discover`).
2. Search across seeded & ingested database opportunities with real-time PostgreSQL GIN full-text search (`idx_opps_fts`) and `pgvector` semantic embeddings fused via RRF.
3. Test filter pills: *Grants*, *CFPs*, *Journals*, *Research Proposals*.
4. Open any opportunity card to view detailed funding agencies (NIH, NSF, Simons Foundation, DARPA), deadlines, eligibility criteria, and award budgets.

#### 4. Opportunity Bookmarking & Persistence Test
1. Click the **Bookmark** icon on 2–3 different research opportunities.
2. Refresh your browser ($F5$ or $\text{Ctrl}+R$).
3. Navigate to **Bookmarks** (`/bookmarks`).
4. **Notice**: Your saved bookmarks remain intact—persisted in Supabase table `bookmarks` and tied to your user UUID.

#### 5. Real-Time Collaborative Workspace
1. Navigate to **Workspaces** (`/workspace`).
2. Open or create a research collaboration proposal (e.g., *Quantum Algorithms Grant Proposal*).
3. Notice the live network connectivity indicator in the sidebar (**🟢 System Live / Latency: XXms**).
4. Experience real-time presence indicators, section locks, threaded comments, and activity audit trails.

#### 6. Cross-User Isolation & Security Verification
1. Log out via the profile menu.
2. Register a second account (e.g., `mentor_b@stanford.edu`).
3. Verify that User B cannot see or manipulate User A's private bookmarks, workspace drafts, or audit records.
4. Log back in as User A: all previous data is fully preserved.

---

### 🏛️ Pre-Configured Demo Evaluator Credentials (Optional)
If you prefer not to create a new account, you may use this pre-seeded evaluation account:
- **Email**: `evaluator@cambium.edu`
- **Password**: `Cambium2026!Exam`
- **Role**: `PI / Principal Investigator`

---

### 📊 Technical Architecture Highlights for Mentors
- **Frontend**: Next.js 16 App Router + React 19 + Living Materials Design Tokens (`WCAG` guidelines targeted; full accessibility sweep scheduled in Program 14).
- **Backend**: NestJS 12 Modular Monolith with TypeORM (`DB_POOL_MAX = 20`) and Redlock / optional Redis adapters.
- **Database**: PostgreSQL 16 + `pgvector` HNSW vector cosine search over `768`-dimensional text embeddings (`gemini-embedding-001`) + GIN full-text index.
- **Resilience**: SRE Circuit Breakers (`CLOSED`/`OPEN`/`HALF_OPEN`), `AbortSignal.timeout` on external fetches, and graceful degradation.
- **Performance**: Keyset cursor pagination and L1/optional-Redis caching (`MultiTierCacheService`).
- **Further Evaluation Reading**: [`docs/institutional/institutional-readiness-package.md`](../institutional/institutional-readiness-package.md) & [`docs/institutional/technical-viva-and-demo-script.md`](../institutional/technical-viva-and-demo-script.md).
