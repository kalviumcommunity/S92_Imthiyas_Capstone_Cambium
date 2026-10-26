# Cambium Research: Business Strategy & Go-to-Market Documentation System
**The Enterprise Operating System for Modern Scholarship**  
**Document ID**: `BIZ-CAMBIUM-INDEX-2026-V1`  
**Author**: Shaik Mohamed Imthiyas T & Founding Strategy Team  
**Status**: `ACTIVE / EVIDENCE-BACKED COMMERCIAL SPECIFICATION`  
**Current Version**: `1.0.0`  
**Last-Reviewed Date**: `October 26, 2026`  
**Repository**: `S92_Imthiyas_Capstone_Cambium`  

---

## 1. Executive Purpose & Governance

This directory contains the authoritative commercial, market intelligence, customer discovery, pricing, and go-to-market strategy for the **Cambium Research Platform**. 

While [`docs/architecture/technology-strategy-and-stack.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/architecture/technology-strategy-and-stack.md) specifies **HOW** the system is engineered, this business documentation specifies **WHO** experiences the problem, **WHY** they will pay to solve it, **HOW** we acquire them, and **WHAT** evidence is required before allocating capital or engineering resources.

### Operating Standards & Epistemic Boundaries:
Every assertion across these documents is strictly classified into one of seven epistemic categories:
- `[VERIFIED FACT]`: Backed by current physical codebase inspection, running tests, or authoritative public documentation.
- `[PUBLISHED ESTIMATE]`: Sourced from audited industry reports, university statistics, or competitor pricing rate cards.
- `[CALCULATED ESTIMATE]`: Mathematically derived using explicit bottom-up unit economics and transparent formulas.
- `[ANALYTICAL JUDGMENT]`: Professional synthesis of market forces, competitive trade-offs, and operational realities.
- `[BUSINESS HYPOTHESIS]`: Commercial assumption requiring empirical validation through customer discovery interviews or experiments.
- `[FOUNDER DECISION]`: Binding strategic direction established by the leadership team.
- `[UNKNOWN / REQUIRES VALIDATION]`: Identified blind spot explicitly earmarked for testing before committing resources.

---

## 2. Directory Navigation & Documentation Map

| Document | File Path | Scope & Core Strategic Question Answered |
| :--- | :--- | :--- |
| **Master Business Strategy** | [`business-and-go-to-market-strategy.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/business/business-and-go-to-market-strategy.md) | **The Master Document**: Synthesizes the entire commercial architecture, repository audit, ICP beachhead, competitive defense, pricing, and 30/60/90-day execution plan. |
| **Business Model & Revenue** | [`business-model-and-revenue-strategy.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/business/business-model-and-revenue-strategy.md) | B2B vs B2C vs B2B2C evaluation, scoring matrix, and selection of the primary hybrid PLG-to-Lab-SaaS business model. |
| **Market & Competitor Intelligence** | [`market-and-competitive-intelligence.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/business/market-and-competitive-intelligence.md) | Deep analysis of Elicit, Consensus, Scite, Pivot-RP, Dimensions, and bottom-up TAM/SAM/SOM market sizing. |
| **ICPs & Customer Discovery** | [`ideal-customer-profiles-and-customer-discovery.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/business/ideal-customer-profiles-and-customer-discovery.md) | Detailed personas (Postdoc/Junior PI beachhead), economic buyer mapping, JTBD, and 15-question discovery interview guide. |
| **Positioning & Messaging** | [`positioning-and-messaging.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/business/positioning-and-messaging.md) | Category definition ("Research Opportunity Intelligence System"), value propositions, and battle-tested copy for homepage and outreach. |
| **Marketing & Growth Playbook** | [`marketing-and-growth-playbook.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/business/marketing-and-growth-playbook.md) | Top 3 acquisition channels (academic community outreach, high-intent grant SEO, preprint utilities), content calendar, and launch phases. |
| **Pricing & Unit Economics** | [`pricing-and-unit-economics.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/business/pricing-and-unit-economics.md) | Packaging tiers (Free, Pro, Lab, Institutional), AI token COGS, gross margin sensitivity, and CAC/LTV modeling. |
| **Validation Experiments & Metrics** | [`validation-experiments-and-metrics.md`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/business/validation-experiments-and-metrics.md) | 10 prioritized validation experiments, North Star Metric, metrics tree, and comprehensive pre-mortem failure analysis. |

---

## 3. Product Maturity & Commercial Truth Summary

An empirical audit of the physical repository establishes Cambium's current baseline:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         CAMBIUM PRODUCT MATURITY AUDIT                           │
├─────────────────────┬───────────────────┬────────────────────────────────────────┤
│ Capability Domain   │ Maturity Status   │ Commercial Reality & Evidence          │
├─────────────────────┼───────────────────┼────────────────────────────────────────┤
│ UI & Web Design     │ PRODUCTION-READY  │ 49 Next.js 15 routes, W3C tokens, A11y │
│ Relational Database │ PRODUCTION-READY  │ PostgreSQL 16 3NF, TypeORM, HNSW index │
│ Vector Retrieval    │ FUNCTIONAL        │ 768-dim Gemini embeddings + fallback   │
│ Citation Formatting │ VERIFIED          │ BibTeX, APA 7, IEEE generators (Jest)  │
│ Boolean AST Engine  │ VERIFIED          │ Parameterized SQL query compiler       │
│ Live Payment Billing│ MOCKED / UI-ONLY  │ Invoices hardcoded; no Stripe backend  │
│ External Crawlers   │ IN-PROGRESS       │ Crawlers drafted; manual seeding active│
│ Multi-Site IRB Sync │ UI / MOCKED       │ Forms render; no external API sync     │
└─────────────────────┴───────────────────┴────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Founding Directives**:
> 1. Do not pitch Cambium to enterprise university procurement offices until the core Opportunity Discovery & Agentic Reader workflows demonstrate measurable retention with individual researchers.
> 2. Do not spend money on paid ads or mass email automation. Focus 100% of Phase 0 on founder-led customer discovery interviews and qualitative prototype observation.
