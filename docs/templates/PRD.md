# Product Requirements Document (PRD)
## Cambium — AI-Powered Research Opportunity Discovery & Intelligence Platform
**The Enterprise Research Operating System**

---

### Metadata
- **Document ID**: `PRD-CAMBIUM-2026-V2`
- **Product Name**: Cambium Research Platform
- **Author**: Shaik Mohamed Imthiyas T
- **Status**: `APPROVED / PRODUCTION-BASELINE`
- **Current Version**: `2.0.0`
- **Target Audience**: Academic Researchers, Principal Investigators (PIs), Postdoctoral Fellows, Graduate Scholars, Lab Directors, University Research Offices, Compliance Officers.
- **Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Executive Summary & Problem Statement

### 1.1 Executive Summary
Cambium is an **AI-powered Research Opportunity Discovery and Intelligence Platform**—the "Enterprise Operating System for Modern Scholarship." Rather than treating research as isolated PDFs and static lists of papers, Cambium models scholarship as a living, interconnected biological network. Cambium aggregates global research opportunities (grants, Calls for Papers [CFPs], journal special issues, fellowships, awards), pairs them with deep semantic knowledge retrieval, and provides an end-to-end workspace spanning hypothesis incubation, ethics approval (IRB), FAIR data management, lab compute orchestration, blind peer review, and verified academic identity.

### 1.2 Problem Statement
Modern academic and industrial research suffers from extreme fragmentation, administrative friction, and high discovery overhead:
1. **Scattered Funding & Publishing Opportunities**: Millions of dollars in research funding and critical conference deadlines are dispersed across hundreds of government portals (Grants.gov, NSF, NIH, Wellcome, Horizon Europe), journal aggregators, and institutional mailing lists. Researchers spend up to **30% of their working hours** manually searching for opportunities and tracking deadlines.
2. **Superficial Literature Navigation**: Keyword-based search engines (e.g., Google Scholar, PubMed) retrieve papers based on lexical overlap, missing semantic bridges between distant fields and failing to surface unexplored "structural holes" in scientific knowledge.
3. **Severe Compliance & Governance Friction**: Compliance with Institutional Review Boards (IRB), ethical clearances, funder open-data mandates (FAIR: Findable, Accessible, Interoperable, Reusable), and CRediT contributor authorship is tracked in ad-hoc spreadsheets, leading to audit failures and retracted funding.
4. **Disjointed Lab Operations**: Laboratory PIs struggle to track grant allocations, compute cluster quotas (Slurm/GPUs), and student milestones across disparate systems.

Cambium resolves this by creating an authoritative, unified platform that links:
$$\text{Hypothesis} \longrightarrow \text{Funding} \longrightarrow \text{Ethics (IRB)} \longrightarrow \text{Experiment / Data (FAIR)} \longrightarrow \text{Peer Review} \longrightarrow \text{Verified Portfolio}$$

---

## 2. Target Users & User Personas

| Persona ID | Persona Name & Role | Core Jobs-to-be-Done (JTBD) | Pain Points & Needs |
| :--- | :--- | :--- | :--- |
| **P-01** | **Principal Investigator (PI)**<br>*(e.g., Prof. Aris Thorne, MIT CSAIL)* | • Secure multi-million dollar grants (NSF, NIH).<br>• Manage lab roster, compute quotas, and grant spend.<br>• Ensure multi-site IRB compliance and audit readiness. | • Grant reporting deadlines missed.<br>• Unclear visibility into lab GPU burn rate.<br>• Fear of audit non-compliance. |
| **P-02** | **Postdoctoral Fellow / Early Career Researcher**<br>*(e.g., Dr. Elena Rodriguez)* | • Find target CFPs, early-career awards, and fellowships.<br>• Synthesize large volumes of literature fast.<br>• Build a verified academic identity for tenure/hiring. | • Information overload.<br>• Hallucinated citations from generic LLMs.<br>• Lack of cross-disciplinary discoverability. |
| **P-03** | **Graduate Research Assistant (PhD/MS)**<br>*(e.g., Marcus Vance, ETH Zürich)* | • Conduct literature reviews and identify research gaps.<br>• Upload datasets compliant with FAIR standards.<br>• Track daily research cadence and experiment runs. | • Manual citation formatting.<br>• Complex repository submission requirements (Zenodo/Dryad). |
| **P-04** | **Institutional Compliance Officer / IRB Board**<br>*(e.g., University Ethics Panel)* | • Review and approve human/animal research protocols.<br>• Inspect audit logs for data security (HIPAA/GDPR).<br>• Verify funder open-data compliance. | • Untracked protocol amendments across multi-site trials.<br>• Unverifiable data export logs. |
| **P-05** | **Peer Reviewer / Journal Editor** | • Evaluate manuscript methodology and statistical rigor.<br>• Verify contributor taxonomy (CRediT roles).<br>• Maintain double-blind integrity and ethics (COPE). | • Authorship attribution disputes.<br>• Unchecked p-hacking and reproducibility failures. |

---

## 3. Goals, Non-Goals & Scope Boundaries

### 3.1 Product Goals
- **G-01**: Reduce time spent searching for grants and CFPs by **75%** through personalized vector-fit matching.
- **G-02**: Provide zero-hallucination paper audits by grounding AI answers to verified line numbers and proofs in source PDFs.
- **G-03**: Centralize institutional research compliance (IRB, FAIR, CRediT, SHA-256 audit logs) in a single unified dashboard.
- **G-04**: Deliver a W3C-compliant, WCAG 2.2 AA accessible "Living Materials" design system that feels authentic to natural scholarship.

### 3.2 Non-Goals (Scope Boundaries)
- **NG-01 (Not an Electronic Lab Notebook Hardware Interface)**: Cambium is not a hardware sensor logger or wet-lab IoT instrument controller. It integrates with data repositories via API, not physical bench sensors.
- **NG-02 (Not a Generic Social Network)**: Cambium is not Twitter/LinkedIn; discussion is restricted to verified scholars, hypotheses, and collaborative inquiries.
- **NG-03 (Not a Legal Contract System)**: Cambium does not execute binding financial bank wires for grant disbursements; it manages post-award ledgers, burn-rate tracking, and milestone accounting.

---

## 4. Functional Requirements (FR)

### 4.1 Authentication, Identity & RBAC (`FR-AUTH`)
- **FR-AUTH-01**: The system **SHALL** support email/password authentication with bcrypt hashing (work factor 12) and OAuth 2.0 / OIDC federation (Google, ORCID, Institutional SAML/Shibboleth).
- **FR-AUTH-02**: The system **SHALL** issue dual tokens: short-lived JWT Access Tokens (15 min) and rotating Refresh Tokens (7 days) with HTTP-only, Secure, SameSite cookies.
- **FR-AUTH-03**: The system **SHALL** enforce strict Role-Based Access Control (RBAC) across five roles: `PI`, `Researcher`, `Fellow`, `ComplianceOfficer`, and `ExternalReviewer`.
- **FR-AUTH-04**: The system **SHALL** allow scholars to claim and link their verified ORCID ID (`0000-000x-xxxx-xxxx`) and ROR institutional identifiers.

### 4.2 Opportunity Discovery & Recommendation Engine (`FR-OPP`)
- **FR-OPP-01**: The system **SHALL** aggregate and index opportunities across four categories: Grants, Conferences/CFPs, Journals, and Fellowships.
- **FR-OPP-02**: The system **SHALL** compute semantic fit scores (0–100%) between a scholar's research vectors and opportunity descriptions using `pgvector` cosine similarity.
- **FR-OPP-03**: The system **SHALL** allow multi-facet filtering by category, funder, deadline proximity, eligibility, and disciplinary domain.
- **FR-OPP-04**: The system **SHALL** enable scholars to bookmark opportunities, track submission deadlines, and generate ICS calendar subscriptions.

### 4.3 Knowledge Graph & Semantic Navigation (`FR-GRAPH`)
- **FR-GRAPH-01**: The system **SHALL** render an interactive 2D force-directed knowledge graph displaying papers, authors, grants, and semantic bridge nodes.
- **FR-GRAPH-02**: The system **SHALL** compute and visually flag "structural holes"—unconnected conceptual clusters ripe for cross-disciplinary breakthroughs.
- **FR-GRAPH-03**: The system **SHALL** support category-based node isolation, zoom/pan controls, and inspector drawer slideouts on node selection.

### 4.4 Agentic Reader & Research Intelligence (`FR-AGENT`)
- **FR-AGENT-01**: The system **SHALL** ingest research manuscripts (PDF/arXiv), extract structural text into chunked embeddings, and index them.
- **FR-AGENT-02**: The system **SHALL** provide three specialized AI agent personas:
  1. *Methodology Auditor*: Evaluates experimental setup, controls, and formal derivations.
  2. *Statistical Rigor*: Audits sample size power, p-values, and confidence intervals.
  3. *Reproducibility Engine*: Verifies code links, data availability, and dependency reproducibility.
- **FR-AGENT-03**: The system **SHALL** mandate that every agent claim be grounded with clickable line-level citations (`[p. X, §Y, L. Z]`).

### 4.5 Ethics, FAIR Data & Institutional Governance (`FR-GOV`)
- **FR-GOV-01 (IRB Compliance)**: The system **SHALL** manage Institutional Review Board protocols, classifying by risk level (*Exempt*, *Expedited*, *Full Board*) and tracking multi-site participating institutions and annual renewal expirations.
- **FR-GOV-02 (FAIR Data Bridge)**: The system **SHALL** evaluate datasets against FAIR metrics (Findable, Accessible, Interoperable, Reusable; 0–100 score) and interface with Zenodo, Dryad, and Figshare.
- **FR-GOV-03 (Security & Audit)**: The system **SHALL** record an append-only, SHA-256 cryptographically hashed audit log for all sensitive actions (data export, protocol amendment, SAML assertion).
- **FR-GOV-04 (Peer Review & CRediT)**: The system **SHALL** provide a double-blind peer review console with a 14-role CRediT authorship matrix (*Conceptualization*, *Methodology*, *Software*, *Supervision*, etc.).

### 4.6 Lab Workspace & Personal Operating System (`FR-LAB`)
- **FR-LAB-01**: The system **SHALL** allow PIs to manage laboratory rosters, track grant burn rates, and allocate compute cluster quotas (GPU hours / AWS credits).
- **FR-LAB-02**: The system **SHALL** provide a scholar "Personal OS" calendar view synchronizing lab meetings, paper reviews, grant deadlines, and experiment runs.

---

## 5. Non-Functional Requirements (NFR)

| NFR ID | Category | Target Metric / Requirement | Verification Method |
| :--- | :--- | :--- | :--- |
| **NFR-PERF-01** | Latency | Core search & filter queries **< 150ms** at p95. | Automated load testing (`k6`). |
| **NFR-PERF-02** | Vector Retrieval | `pgvector` approximate nearest neighbor (HNSW) search **< 50ms** across 100k embeddings. | Benchmark suite. |
| **NFR-PERF-03** | Core Web Vitals | LCP **< 1.8s**, FID **< 100ms**, CLS **< 0.05** on 4G connections. | Lighthouse CI. |
| **NFR-A11Y-01** | Accessibility | 100% compliance with **WCAG 2.2 Level AA** standards across light and dark themes. | Axe-core automated tests + screen reader audit. |
| **NFR-A11Y-02** | Contrast | Minimum **4.5:1** contrast ratio for normal text; **3.0:1** for UI components. | Token contrast validation suite. |
| **NFR-SEC-01** | Data Protection | AES-256 encryption at rest; TLS 1.3 in transit. | Infrastructure vulnerability audit. |
| **NFR-SEC-02** | OWASP Top 10 | Zero high/critical vulnerabilities; parameterized SQL via TypeORM; Zod input sanitization. | SAST scanning (SonarQube) + DAST. |
| **NFR-REL-01** | Uptime | **99.9%** availability for primary API and database. | Prometheus/Grafana SLA monitoring. |

---

## 6. User Journeys & Critical Paths

### 6.1 Journey 1: New Scholar Onboarding & Discovery
1. Scholar visits landing page `http://localhost:3000` $\rightarrow$ reviews tree growth animation and academic identity premise.
2. Clicks `Create your research identity` $\rightarrow$ authenticates via ORCID or Email.
3. System syncs recent publications, extracts vector embeddings, and builds initial research interest profile.
4. Scholar lands on `/dashboard` $\rightarrow$ immediately presented with tailored grants (e.g., *NSF CAREER Award, 94% fit*).
5. Scholar bookmarks grant $\rightarrow$ deadline automatically scheduled in `/os` personal calendar.

### 6.2 Journey 2: Paper Audit via Agentic Reader
1. Scholar opens `/agent-reader` $\rightarrow$ inputs paper identifier or drops manuscript PDF.
2. System indexes document into vector chunks.
3. Scholar selects *Methodology Auditor* $\rightarrow$ asks: *"Does the sample size support the theorem in §3?"*
4. Agent returns verified critique with clickable quote linking to `p. 14, L. 42–58`.

### 6.3 Journey 3: Funder Grant Audit & FAIR Data Archiving
1. PI navigates to `/data-management` $\rightarrow$ registers experimental dataset.
2. System computes FAIR compliance score (96/100: F=25, A=24, I=23, R=24).
3. System queries Zenodo REST API $\rightarrow$ mints verified DOI `10.5281/zenodo.10492810`.
4. Event is logged in `/audit` with actor signature, timestamp, and immutable SHA-256 hash.

---

## 7. Assumptions, Dependencies & Risks

### 7.1 Assumptions
- Scholars have access to either an institutional email (`.edu`, `.ac.uk`) or public ORCID profile.
- Scientific metadata is accessible through open APIs (arXiv, Crossref, OpenAlex, Semantic Scholar, Zenodo).

### 7.2 Dependencies
- **PostgreSQL 16 + pgvector**: Core vector retrieval.
- **Next.js 15 (App Router)**: Client-side rendering and SSR.
- **NestJS 10**: Enterprise backend application container.
- **Gemini / OpenAI API**: AI reasoning layer for synthesis agents.

### 7.3 Risk Mitigation Matrix
| Risk ID | Risk Description | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **R-01** | LLM hallucination in scientific claims | **High** | Mandatory grounded line-level citation enforcement; refusal to answer without PDF grounding. |
| **R-02** | Third-party grant API rate limits | **Medium** | Redis caching with BullMQ background ingestion workers and exponential backoff. |
| **R-03** | Data privacy breach for unreleased preprints | **Critical** | Tenant-isolated encryption keys; private workspace sandbox; immutable audit logs. |

---

## 8. Approval Status & Traceability

- **Sign-off Principal**: Shaik Mohamed Imthiyas T (Lead Architect & Product Owner)
- **Status**: `APPROVED`
- **Downstream Traceability**:
  - `docs/templates/ARCHITECTURE.md` (System design directly addresses Section 4 & 5)
  - `docs/templates/DESIGN_SYSTEM.md` (Design tokens implement Living Materials NFR-A11Y)
  - `docs/templates/SECURITY.md` (Security controls implement FR-AUTH & FR-GOV)
  - `AGENTS.md` (AI engineering rules enforce FR-AGENT line-level grounding)
  - `docs/IMPLEMENTATION_PLAN.md` (Milestones sequenced against FR delivery)
