# RFC-002: Multi-Agent Autonomous Scholarly Consensus & Automated Peer-Review Arbitration
## Cambium Research Platform — Architectural RFC (Milestone 12)

---

### RFC Metadata
- **RFC ID**: `RFC-CAMBIUM-2026-002`
- **Title**: Multi-Agent Adversarial Debate & Automated Peer-Review Arbitration
- **Status**: **DRAFT / OPEN FOR ARCHITECTURAL DECISION**
- **Target Milestone**: Milestone 12
- **Author**: Cambium Principal AI & Knowledge Systems Board

---

## 1. Problem Statement & Motivation

Peer review in modern scholarship is strained by exponential submission volume, reviewer fatigue, and subtle methodological blind spots. In single-agent LLM systems, models suffer from confirmation bias—sycophantically agreeing with the author's claims when prompted to review an uploaded preprint.

Cambium proposes a **multi-agent adversarial debate graph** where four specialized, autonomous agent personas interrogate scientific manuscripts simultaneously, debating methodology, statistics, reproducibility, and ethics to formulate an unbiased, calibrated consensus score before human editorial review.

---

## 2. Multi-Agent Debate Topology

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CAMBIUM ADVERSARIAL REVIEW GRAPH                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│                     ┌────────────────────────────────────┐                             │
│                     │       Uploaded Preprint / CFP       │                             │
│                     └─────────────────┬──────────────────┘                             │
│                                       │                                                │
│                 ┌─────────────────────┴─────────────────────┐                          │
│                 ▼                                           ▼                          │
│   ┌───────────────────────────┐               ┌───────────────────────────┐            │
│   │   Primary Reviewer Agent  │               │ Statistical Skeptic Agent │            │
│   │   (Focus: Novelty & Lit)  │               │ (Focus: Power & p-hacking)│            │
│   └─────────────┬─────────────┘               └─────────────┬─────────────┘            │
│                 │                                           │                          │
│                 └─────────────────────┬─────────────────────┘                          │
│                                       ▼                                                │
│                     ┌───────────────────────────────────┐                              │
│                     │    3-Turn Adversarial Debate Round │                              │
│                     │  (Cross-examination of evidence)  │                              │
│                     └─────────────────┬─────────────────┘                              │
│                                       │                                                │
│                 ┌─────────────────────┴─────────────────────┐                          │
│                 ▼                                           ▼                          │
│   ┌───────────────────────────┐               ┌───────────────────────────┐            │
│   │ Reproducibility Auditor   │               │ Ethics & Safety Guardian  │            │
│   │ (Focus: Code/Data/Docker) │               │ (Focus: Dual-Use/IRB/COI) │            │
│   └─────────────┬─────────────┘               └─────────────┬─────────────┘            │
│                 │                                           │                          │
│                 └─────────────────────┬─────────────────────┘                          │
│                                       ▼                                                │
│                     ┌───────────────────────────────────┐                              │
│                     │  Synthesis Arbiter (Meta-Review)  │                              │
│                     │ Calibrated COPE Decision Matrix   │                              │
│                     └─────────────────┬─────────────────┘                              │
│                                       ▼                                                │
│                     ┌───────────────────────────────────┐                              │
│                     │ Verified Open Review on /community│                              │
│                     └───────────────────────────────────┘                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Critical Decisions Requiring Architectural Alignment

### Decision 1: Agent State Graph Runtime
- **Option A (BullMQ + Redis Streams)**: Build on Cambium's existing Redis infrastructure, coordinating agent turns as distributed jobs with retry logic and telemetry spans.
  - *Pros*: Zero new framework bloat; uses existing Redis cluster and monitoring.
  - *Cons*: State machine transitions must be hand-authored.
- **Option B (LangGraph / StateGraph Orchestration)**: Adopt an emerging agentic graph framework.
  - *Pros*: Built-in cyclical graph primitives and checkpointing.
  - *Cons*: Additional runtime dependency overhead.
- **Current Recommendation**: Option A (BullMQ + Redis Streams) preserves monolithic simplicity and zero-regression reliability.

### Decision 2: Cost Governance for 10-Turn Debate Cycles
- Imposing a ceiling of 25,000 tokens per manuscript evaluation cycle (~$0.05 per preprint evaluation using Gemini 1.5 Flash for intermediate turns and Gemini 1.5 Pro for Synthesis Arbiter).

---

## 4. Next Steps
1. Wire `ConsensusOrchestratorService` in `server/src/modules/ai/agents/`.
2. Connect output to `/community` structured peer-review rubric.
3. Expose real-time SSE stream of agent debate turns on `/peer-review`.
