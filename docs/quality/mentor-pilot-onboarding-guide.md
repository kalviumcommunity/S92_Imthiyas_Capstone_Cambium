# Cambium Research — Mentor Pilot Onboarding Guide

**Pilot Target**: 5–10 Technical Mentors  
**Frontend URL**: `https://cambium-research.vercel.app`  
**Backend API**: `https://cambium-api-ufj3.onrender.com`  

> [!CAUTION]
> **Pilot Data Handling Rule**: Do **NOT** upload confidential unpublished manuscripts, NDA-restricted partner grants, personally identifiable human-subject data, or sensitive institutional secrets during the pilot. Use public preprints or synthetic documents only.

---

## 1. Account Registration & Sign-In
1. Open [https://cambium-research.vercel.app/sign-up](https://cambium-research.vercel.app/sign-up).
2. Register using an individual email address and a strong password (minimum 8 characters), or sign in via Google OAuth / ORCID.
3. Never share credentials across multiple participants—each mentor must operate an isolated account so permissions and workspaces stay separated.
4. Complete the onboarding step at `/welcome` to arrive at `/dashboard`.

> **Password Recovery Note**: Self-service email password reset is intentionally disabled during the controlled pilot (`/forgot-password`). If you lose access to a test account, contact the Pilot Coordinator via the support channel.

## 2. Core Research Workflows to Evaluate
1. **Opportunity Discovery (`/opportunities`)**: Search grants/CFPs/papers by keyword, filter categories, open detail drawers, bookmark items, refresh the browser, and confirm saved items persist in `/bookmarks`.
2. **Research Workspaces (`/workspace`)**: Create a workspace, update project metadata, link literature DOIs, and refresh to verify server persistence.
3. **Collaboration Roster (`/workspace`)**: Invite another mentor's account by email/username, have the second account accept, confirm shared access, and test collaborator removal (`DELETE /projects/:id/members/:memberId`).
4. **Document Uploads (`/workspace/upload`)**: Upload allowed research artifacts (`PDF`, `CSV`, `BibTeX`, `LaTeX` under 50 MB). Rejected file types or failed uploads will surface an error and are not marked saved.
5. **Knowledge Graph & Portfolio (`/graph`, `/portfolio`)**: Inspect cross-discipline connections and 12-month research contribution activity.
6. **AI Features (`/agent-reader`, `/assistant`)**: Note that `/api/v1/assistant/chat` is gated to `pro`-tier accounts; free pilot accounts have access to discovery, workspaces, graphs, and grounded offline RAG reader previews unless upgraded for pilot evaluation.

## 3. Reporting Issues During the Pilot
Report bugs or friction points via GitHub Issues (Bug Report template) or directly to the Pilot Lead with:
- Route URL and timestamp
- Account email used (never send passwords)
- Exact error banner or browser console message
- Expected vs. actual result
