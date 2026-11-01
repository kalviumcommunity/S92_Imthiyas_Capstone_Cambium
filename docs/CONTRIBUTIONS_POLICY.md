# Cambium Research Platform: Evidence-Based Research Contributions Policy
**The Enterprise Standard for Verifiable Scholarly Momentum & Attribution**

---

### Document Control
- **Document ID**: `CAMBIUM-POLICY-CONTRIB-2026-V1`
- **Classification**: Enterprise Scholarly Attribution Specification
- **Author**: Cambium Core Architecture Team
- **Audience**: Scholars, Principal Investigators, Institutional Audit Committees, Funding Agencies, Reviewers
- **Status**: Enforced Specification & System Single Source of Truth (SSOT)

---

## 1. Executive Summary & Core Philosophy

Modern academia has long suffered from two flawed extremes: vanity metric gaming (e.g., commit counts, artificial daily streaks, superficial social actions) and opaque, unverified claims.

Cambium replaces synthetic activity streaks with an **evidence-based, cryptographic research contributions ledger**. Our system is anchored on four cardinal principles:

1. **Attribution Requires Evidence**: Every recorded contribution must have a verifiable timestamp, a verified academic actor, and persistent external evidence (e.g., DOI, arXiv ID, Zenodo accession, signed OSF protocol, or journal referee confirmation).
2. **Quality Is Not Volume**: A higher event count does not signify superior research. Cambium never computes composite "momentum scores" or gamified velocity rankings.
3. **Decoupling Temporal Cadence from Scholarly Impact**: Citations, h-index, and community replication metrics are displayed in an independent impact card and are strictly forbidden from being blended into contribution counts.
4. **Transparent Integrity**: In the absence of third-party credentials (such as GitHub OAuth or ORCID webhooks), Cambium displays a truthful disconnected state rather than generating simulated activity.

---

## 2. The Four Metric Pillars

Cambium structures researcher portfolios around four distinct, unblended pillars:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CAMBIUM ATTRIBUTION FRAMEWORK                         │
├─────────────────────┬─────────────────────┬───────────────────┬─────────────┤
│      PILLAR 1       │      PILLAR 2       │     PILLAR 3      │  PILLAR 4   │
│ Eligible Milestones │ Active Cadence Days │ Distinct Outputs  │   Impact    │
├─────────────────────┼─────────────────────┼───────────────────┼─────────────┤
│ Attributable, dated │ Calendar days with  │ Unique scientific │ Citations & │
│ research actions    │ ≥ 1 eligible event. │ artifacts/works.  │ h-index in  │
│ with supporting     │ Multiple events on  │ Multi-phase paper │ dedicated   │
│ external evidence.  │ 1 date = 1 day.     │ = 1 output.       │ card only.  │
└─────────────────────┴─────────────────────┴───────────────────┴─────────────┘
```

### Pillar 1: Eligible Research Contributions
A discrete, verifiable scholarly milestone completed on a specific UTC timestamp by a recognized researcher.

### Pillar 2: Active Research Days
A calendar day (standardized to UTC or the scholar's chosen institutional timezone) containing at least one eligible research contribution.
$$\mathbf{Active\ Days} = \left| \{ \text{date}(e) \mid e \in \text{EligibleEvents} \} \right|$$
*Constraint*: Completing 5 experiment milestones on a single day counts as **1 Active Day**.

### Pillar 3: Distinct Research Outputs
The count of unique scholarly artifacts and works produced by the researcher, tracked via persistent work identifiers (`outputRef`):
$$\mathbf{Distinct\ Outputs} = \left| \{ \text{outputRef}(e) \mid e \in \text{EligibleEvents} \} \right|$$
*Example*: If a researcher posts an arXiv preprint in November 2025 and publishes the final peer-reviewed paper in *Cell Systems* in March 2026, both milestones share the canonical DOI/work identifier. This produces **2 Contribution Events** across **2 Active Days**, but precisely **1 Distinct Scientific Output**.

### Pillar 4: Scholarly Impact
Measures external adoption and academic citation influence (e.g., Google Scholar citation total, h-index, i10-index). This pillar is displayed in a dedicated block and is **never** added to, multiplied by, or blended with temporal activity counts.

---

## 3. Explicit Eligibility Matrix

### 3.1 Eligible Contributions (`COUNTED`)

| Event Category (`eventType`) | Description | Required Evidence (`evidenceUrl` / `externalId`) |
| :--- | :--- | :--- |
| `MANUSCRIPT_PUBLISHED` | Peer-reviewed journal or conference proceedings publication | Valid DOI (e.g., `10.1016/j.cels.2026...`) |
| `PREPRINT_RELEASE` | Public release of research paper on an indexed preprint server | arXiv ID, bioRxiv DOI, or OSF preprints link |
| `DATASET_RELEASE` | Formal publication of research data in an open repository | Zenodo, Dryad, or Figshare DOI |
| `SOFTWARE_RELEASE` | Tagged release of research code, model weights, or toolkit | Git release tag URL or Zenodo software archive |
| `EXPERIMENT_MILESTONE` | Substantive experimental checkpoint or completed benchmark | Project workspace milestone + reproducible params |
| `METHOD_STEP` | Verified methodology development or analysis pipeline step | Protocol link or signed lab notebook reference |
| `PEER_REVIEW_CONFIRMED` | Completed, authenticated referee review for a journal/venue | ORCID peer-review receipt or journal confirmation hash |
| `GRANT_AWARD` | Confirmed competitive research grant or fellowship award | Funder award number (e.g., NIH, NSF, ERC) |
| `GRANT_SUBMISSION` | Formal submission of institutional funding proposal | Institutional proposal ID or agency confirmation |
| `PROTOCOL_APPROVAL` | Pre-registered trial, systematic review, or animal/IRB protocol | OSF Registry, ClinicalTrials.gov NCT, or PROSPERO ID |

### 3.2 Strictly Excluded Actions (`PROHIBITED`)

Under no circumstances may the following activities be counted or displayed as research contributions:

| Excluded Activity | Why It Is Excluded |
| :--- | :--- |
| **Logins & Session Refreshes** | Administrative access is not intellectual scholarship. |
| **Profile or Bio Edits** | Metadata maintenance does not generate scholarly knowledge. |
| **Bookmarking Opportunities** | Reading or saving grants is discovery, not a completed contribution. |
| **Creating Workspaces / Inviting Users** | Administrative project coordination is tracked in audit logs, not the research ledger. |
| **Draft Autosaves** | Unfinished keystroke updates are transient drafts. |
| **AI Assistant Chats & Prompts** | Querying an LLM or RAG system is an exploratory interaction, not an attributable output. |
| **CRediT Role Assignments Alone** | CRediT roles describe *how* a researcher contributed to an artifact; the assignment itself is not a separate event. |
| **Coding Challenges / LeetCode** | External algorithmic puzzles do not represent academic research. |
| **Synthetic / Sine-Wave Simulations** | Generative or random activity models undermine scholarly trust. |

---

## 4. CRediT Authorship Taxonomy Integration

Cambium adheres to the **Contributor Roles Taxonomy (CRediT)** standard (ISO 20147). For every recorded milestone, scholars may specify the precise intellectual roles fulfilled:

- *Conceptualization*
- *Data curation*
- *Formal analysis*
- *Funding acquisition*
- *Investigation*
- *Methodology*
- *Project administration*
- *Resources*
- *Software*
- *Supervision*
- *Validation*
- *Visualization*
- *Writing - original draft*
- *Writing - review & editing*

**Enforcement Rule**: CRediT roles provide qualitative richness and descriptive attribution to an existing milestone. They are never tallied as additive standalone event points.

---

## 5. Peer Review Confidentiality & COPE Safeguards

Peer review is an indispensable scholarly contribution, yet reviewing is governed by strict confidentiality (COPE Ethical Guidelines for Peer Reviewers).

To honor both attribution and confidentiality:
1. **Public View**: External visitors inspecting a scholar's portfolio see only:
   - Event category: `Confirmed Peer Review`
   - Verified venue: `Journal of Molecular Biology` (or publisher)
   - Certified confirmation date
   - Cryptographic verification badge
2. **Confidential Masking**: The manuscript title, author identities, review body, and internal journal deep-links are strictly redacted and hidden from external viewers.
3. **Scholar Private View**: Only the authenticated reviewer themselves can see their private notes, manuscript reference, and submission receipt.

---

## 6. Timezone & Temporal Standardization

- **Storage Standard**: All timestamps are persisted in PostgreSQL as `TIMESTAMPTZ` normalized to **Coordinated Universal Time (UTC)** in ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Cadence Aggregation**: When constructing the daily activity matrix, timestamps are projected to calendar days based on the user's selected institutional timezone (defaulting to UTC).
- **No Future Dates**: The system rejects any milestone with `occurredAt > NOW()` with HTTP `400 Bad Request`.

---

## 7. External Integrations Policy (GitHub & ORCID)

1. **Honest Connection State**: If GitHub OAuth or API tokens are unconfigured, Cambium displays a clear `Disconnected` badge with an instruction to connect in Settings. It is strictly forbidden to fall back to hardcoded mock repositories.
2. **ORCID & Crossref Sync**: Public publications and confirmed peer reviews imported from ORCID or Crossref retain their persistent identifiers and are marked `VERIFIED`.
3. **Idempotency**: Importing or re-syncing from external sources uses deterministic compound keys `(actorId, source, externalId)` to prevent duplicate milestone creation.

