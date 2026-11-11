# RFC-003: Federated Cross-University Knowledge Mesh & Semantic Graph Federation
## Cambium Research Platform — Architectural RFC (Milestone 13)

---

### RFC Metadata
- **RFC ID**: `RFC-CAMBIUM-2026-003`
- **Title**: Federated Scholarly Knowledge Mesh & Subgraph Routing
- **Status**: **DRAFT / OPEN FOR ARCHITECTURAL DECISION**
- **Target Milestone**: Milestone 13
- **Author**: Cambium Principal Infrastructure & Data Architecture Board

---

## 1. Problem Statement & Motivation

Today, each research university operates an isolated silo of scholar profiles, equipment registries, and grant portfolios. Cross-institutional discoveries (e.g. an MIT bioengineer needing access to a specific Cryo-EM instrument at Harvard, or a Cambridge statistician matching with an Oxford clinical trial) rely on informal email chains or disconnected third-party scrapers.

Cambium proposes a **Federated Scholarly Knowledge Mesh**: an open, privacy-preserving interconnection protocol allowing university nodes to federate their public research entities into a unified global discovery graph while keeping internal laboratory finances, private projects, and student data strictly air-gapped within the local PostgreSQL instance.

---

## 2. Federated Knowledge Mesh Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CAMBIUM FEDERATED KNOWLEDGE MESH                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│     [ HARVARD NODE ]                    [ MIT NODE ]                 [ OXFORD NODE ]   │
│   ┌──────────────────┐               ┌──────────────────┐          ┌─────────────────┐ │
│   │ Local Postg. 16  │               │ Local Postg. 16  │          │ Local Postg. 16 │ │
│   │ + pgvector       │               │ + pgvector       │          │ + pgvector      │ │
│   └────────┬─────────┘               └────────┬─────────┘          └────────┬────────┘ │
│            │                                  │                             │          │
│            ▼                                  ▼                             ▼          │
│   ┌──────────────────┐               ┌──────────────────┐          ┌─────────────────┐ │
│   │ Mesh Subgraph GW │               │ Mesh Subgraph GW │          │ Mesh Subgraph GW│ │
│   │ (gRPC / GraphQL) │               │ (gRPC / GraphQL) │          │ (gRPC / GraphQL)│ │
│   └────────┬─────────┘               └────────┬─────────┘          └────────┬────────┘ │
│            │                                  │                             │          │
│            └──────────────────────────┬───────┴─────────────────────────────┘          │
│                                       ▼                                                │
│                     ┌───────────────────────────────────┐                              │
│                     │  Cambium Global Federation Router │                              │
│                     │  (Distributed Query Planner &     │                              │
│                     │   Provenance Attribution Engine)  │                              │
│                     └─────────────────┬─────────────────┘                              │
│                                       ▼                                                │
│                     ┌───────────────────────────────────┐                              │
│                     │  Scholars on /graph & /discover   │                              │
│                     │  Multi-Institution Discovery Feed │                              │
│                     └───────────────────────────────────┘                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Critical Decisions Requiring Architectural Alignment

### Decision 1: Query Protocol & Schema Definition
- **Option A (Apollo Federation v2 / GraphQL Subgraphs)**:
  - *Pros*: Expressive declarative `@key` directives, rich ecosystem, type-safe schema composition.
  - *Cons*: Additional gateway router hop latency (~15-30ms).
- **Option B (gRPC over HTTP/2 with Protocol Buffers)**:
  - *Pros*: Sub-5ms serialization latency, multiplexed streaming, lower CPU consumption.
  - *Cons*: Rigid contract negotiation across independent university IT administrators.
- **Current Recommendation**: Option A (GraphQL Federation v2) for external university edge routers; Option B for high-throughput node-to-node telemetry.

### Decision 2: Access Control & Data Governance Boundaries
- Public Entities Federable: Scholar Bio, ROR Affiliation, Open Publications, Active Public CFPs, Shared Core Facility Instruments.
- Air-Gapped Entities: Private Lab Workspaces, Unfunded Draft Proposals, IRB Notes, Financial Ledger Records.

---

## 4. Next Steps
1. Author Protocol Buffer definitions in `proto/scholarly_mesh.proto`.
2. Implement federation resolver gateway in `server/src/modules/mesh/`.
3. Enhance `/graph` UI with cross-institutional cluster nodes.
