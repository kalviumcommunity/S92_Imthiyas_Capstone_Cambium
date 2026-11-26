# Load, Stress, Spike & Soak Testing Strategy (Phases 9–10)

## Safety Guardrail & Isolation
- [`scripts/load-benchmark.mjs`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/scripts/load-benchmark.mjs) enforces an automatic block against production domains (`*.onrender.com`, `*.vercel.app`, `*.supabase.co`) unless explicitly overridden in an isolated test sandbox.
- All automated scenarios execute either against an in-process synthetic Node HTTP harness (`--mode=synthetic`) or mocked TypeORM/cache services ([`load-benchmark.spec.ts`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/performance/load-benchmark.spec.ts)).

## Scenario Matrix (Scenarios A–F + Spike/Soak)
- **A / B (Read-Heavy & Mixed Discovery)**: Paginated opportunities (`limit=25`), search keyword filtering, and health liveness bursts across 25–50 concurrent workers.
- **C / D (Write Batch & Deep Pagination)**: 50-item `bulkCreate()` tag-batching and keyset seek cursor encoding (`LIMIT + 1`).
- **E / F (Cache Stampede & AI Batch)**: 50 concurrent cold-miss stampede bursts coalesced via singleflight (`MultiTierCacheService`) + 150 warm read hits + bounded AI batch embeddings (`concurrency <= 6`).
