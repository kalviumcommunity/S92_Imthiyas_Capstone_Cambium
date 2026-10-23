# 🏛️ Database Architecture Decisions (ADR Review)
## Architectural Decision Records: PostgreSQL 16, pgvector, Redis & Multi-Database Analysis
**Author & Lead Architect**: Shaik Mohamed Imthiyas T  
**Document ID**: `AUDIT-DB-ADR-2026-V1`

---

## 1. Architectural Decision Records Index

| ADR ID | Decision Title | Status | Primary Technology Selected |
| :---: | :--- | :---: | :--- |
| **ADR-001** | Primary Persistence & Relational 3NF Engine | `APPROVED` | PostgreSQL 16 (TypeORM 1.1) |
| **ADR-002** | High-Dimensional Vector Search Storage | `APPROVED` | pgvector v0.7.0 HNSW (vector 768) |
| **ADR-003** | Rejection of Separate Standalone Vector Database | `APPROVED` | In-Database pgvector over Pinecone/Milvus |
| **ADR-004** | Redis Multi-Role Integration | `APPROVED` | Redis 7.2 (Redlock, Token Blacklist, BullMQ) |
| **ADR-005** | Hybrid Retrieval Algorithm | `APPROVED` | Reciprocal Rank Fusion (RRF with $k=60$) |

---

## 2. Multi-Database Evaluation Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            MULTI-DATABASE EVALUATION MATRIX                                 │
├─────────────────────────┬──────────────────────┬──────────────────────┬─────────────────────┤
│ Evaluation Dimension    │ PostgreSQL + pgvector│ MongoDB Atlas Vector │ Standalone (Pinecone│
├─────────────────────────┼──────────────────────┼──────────────────────┼─────────────────────┤
│ ACID Financial Security │ Full Serializable    │ Document-Level Only  │ Disjoint / None     │
│ Relational Constraints  │ Foreign Key Cascades │ Manual Application   │ None                │
│ Hybrid Search (FTS+Vec) │ Native (HNSW + GIN)  │ Atlas Search Agg     │ Dual API Latency    │
│ Infrastructure Cost     │ $0 (Single Instance) │ $57–$200+/month      │ $70–$300+/month     │
│ Operational Simplicity  │ High (1 Database)    │ Medium               │ Low (Dual-Write Risk│
│ Cold Query Latency      │ < 18ms               │ ~35ms                │ 80–150ms HTTP hops  │
└─────────────────────────┴──────────────────────┴──────────────────────┴─────────────────────┘
```

### Strategic Verdict:
For an academic research operating system managing institutional grants and cryptographic audit logs, **PostgreSQL 16 + pgvector** satisfies 100% of functional and non-functional requirements without introducing unnecessary cloud billing or network failure domains.

---

<div align="center">
  <sub>Database Architecture Decisions · Document ID: AUDIT-DB-ADR-2026-V1 · Verified for Academic Year 2026</sub>
</div>
