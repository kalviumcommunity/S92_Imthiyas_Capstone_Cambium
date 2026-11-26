# API & Backend Performance Optimization (Phase 3)

## 1. Bounded Query & Serialization Hardening
- **Pagination Caps (`FilterOpportunityDto` + `OpportunitiesService.findAll`)**:
  - Added validated `page`, `limit` (`1..100`, default `25`), and `cursor` parameters.
  - Supports O(1) keyset seek pagination (`CursorPaginationUtil.paginate`) when `cursor` is provided, avoiding deep SQL `OFFSET` scans.
  - Projects only minimal creator summary fields (`creator.id`, `creator.fullName`, `creator.organization`) rather than joining all user profile/security columns.
- **Deadline Endpoint Bound**: `getUpcomingDeadlines(limit = 50)` enforces `.take(safeLimit)` (max `100`).
- **Batch Tag Resolution (`OpportunitiesService.resolveTags` & `bulkCreate`)**:
  - Replaced sequential `N * findOne + save` tag queries inside transactions with batch `In(uniqueNames)` lookup + single batch insert (`<= 2` tag queries regardless of opportunity batch size).
- **Cartesian Feed Join Elimination (`CommunityService.getFeed`)**:
  - Removed nested `comments` + `commentAuthor` `LEFT JOIN` from feed post queries; bounded post limit (`<= 50`) and batch-fetches top comments per post via `IN (:...postIds)`.
