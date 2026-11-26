# Frontend Performance Engineering (Phase 2)

## 1. Bundle Splitting & Lazy Island Architecture
- **Protected Shell Overlays ([`protected-overlays.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/components/ui/protected-overlays.tsx))**: Defer `CommandPalette`, `ShortcutsModal`, and `GlobalRagAssistant` out of the initial synchronous `(protected)/layout.tsx` hydration graph via `next/dynamic(..., { ssr: false })`.
- **Knowledge Graph Visualizations ([`graph/page.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/app/(protected)/graph/page.tsx))**: Split `RelationalKnowledgeNetwork` and `ResearchLandscapeExplorer` dynamically so inactive tabs avoid parsing/hydrating unmounted graph trees.
- **Opportunities Catalog & Modals ([`opportunities/page.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/app/(protected)/opportunities/page.tsx))**: Converted `CitationExportModal` and `GrantEligibilityCheckerModal` to lazy dynamic chunks mounted strictly when opened, and scoped live backend queries cleanly with `limit=25&page=1`.

## 2. Query Caching & Font Display Optimizations
- [`QueryProvider`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/lib/query-provider.tsx) enforces `staleTime: 5m`, `gcTime: 30m`, `refetchOnWindowFocus: false`, and exponential backoff retries (`max 2`).
- [`app/layout.tsx`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/client/app/layout.tsx) enforces `display: "swap"` across font subsets to prevent FOIT blocking.
