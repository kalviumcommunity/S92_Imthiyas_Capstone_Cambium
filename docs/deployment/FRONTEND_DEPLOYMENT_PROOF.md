# Cambium Research Platform — Frontend Deployment Verification
## Kalvium Milestone 2.17 Proof of Work: Deployed Frontend Server

---

### 1. Deployment Metadata
- **Student Name**: Shaik Mohamed Imthiyas T
- **Squad**: Squad 92 (S92)
- **Concept**: Deployed frontend server
- **Lesson ID**: `2.17 Frontend Deployment`
- **Primary Hosting Platform**: Vercel Global Edge Network
- **Alternative/Multi-Cloud Platform**: Netlify Edge (`netlify.toml` configured)
- **Production URL**: `https://cambium-research.vercel.app`
- **Status**: 🟢 **LIVE / OPERATIONAL (HTTP 200 OK across all routes)**

---

### 2. Live Frontend Verification Evidence
| Route | Production Endpoint | HTTP Status | Feature Scope |
| :--- | :--- | :--- | :--- |
| **Landing Page** | `https://cambium-research.vercel.app/` | `200 OK` | Living Materials UI, Hero Canvas, Preloader |
| **Discovery Engine** | `https://cambium-research.vercel.app/discover` | `200 OK` | 500 Opportunities, pgvector semantic search |
| **Scholar Onboarding** | `https://cambium-research.vercel.app/welcome` | `200 OK` | Multi-step interactive profile wizard |
| **Scholar Auth** | `https://cambium-research.vercel.app/sign-in` | `200 OK` | Google OAuth, ORCID, institutional SSO |
| **Public About** | `https://cambium-research.vercel.app/about` | `200 OK` | Mission, C4 architecture, compliance |
| **XML Sitemap** | `https://cambium-research.vercel.app/sitemap.xml` | `200 OK` | 15 Indexed Pages for Googlebot |
| **Robots Policy** | `https://cambium-research.vercel.app/robots.txt` | `200 OK` | Crawler directives & access controls |

---

### 3. Frontend Architecture & Build Specifications
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + W3C DTCG Living Materials Design Tokens
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Mode**: Optimized Edge / Serverless
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL` = `https://cambium-api-ufj3.onrender.com/api/v1`
  - `NEXT_PUBLIC_SOCKET_URL` = `https://cambium-api-ufj3.onrender.com`
  - `NEXT_PUBLIC_APP_URL` = `https://cambium-research.vercel.app`

---

### 4. Search Engine Indexing & Verification
- **Google Search Console**: Verified via meta tag (`8WczNCeJBLme0XokQUIsLUcB3ObTJg-E167D0HuR3sU`)
- **Live Test Status**: `URL is available to Google` & `Page can be indexed`
- **Sitemap Submission**: `/sitemap.xml` processed successfully with 15 discovered pages.
