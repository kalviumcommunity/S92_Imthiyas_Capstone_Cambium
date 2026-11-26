# AI Performance, Latency & Cost Engineering (Phase 8)

## Cost & Latency Guardrails Enforced
1. **Bounded Outbound Timeouts**: [`GeminiEmbeddingService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/ai/gemini-embedding.service.ts) enforces an `8,000 ms` `AbortController` timeout per outbound embedding call and truncates inputs cleanly at `8,000` chars.
2. **Clamped Batch Concurrency**: `generateBatchEmbeddings()` clamps batch fan-out to `1..6` (default `4`), eliminating outbound RPM saturation bursts.
3. **Resilient Deterministic Fallback**: When external embedding calls time out or fail, deterministic 768-dim L2-normalized vectors keep local semantic pipelines functional without error cascades.
4. **Admin Telemetry Inspection**: [`PerformanceController`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/performance/performance.controller.ts) (`SUPER_ADMIN` only) reports cache hit ratios, heap RSS, and queue backlog depth alongside AI telemetry.
