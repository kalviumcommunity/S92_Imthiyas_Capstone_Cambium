# Cambium Research — Database Integrity & Concurrency Testing

## 1. Scope (`server/src/qa/database-integrity.spec.ts`)

Cambium protects scholarly state against partial writes, duplicate registrations, schema drift, and concurrent ingestion races through explicit transactional boundaries, relational constraints, SQL RLS lockdown, and distributed locking.

## 2. Verified Persistence Guarantees

1. **Atomic Transaction Rollback (`OpportunitiesService.bulkCreate`)**:
   - Acquires a TypeORM `QueryRunner`, calls `startTransaction()`, persists each opportunity and tag inside the transaction manager, and invokes `rollbackTransaction()` + `release()` if any item throws mid-batch so zero partial records commit.
2. **Duplicate Identity / Unique Email Protection (`AuthService.register`)**:
   - Rejects duplicate email or case-insensitive username conflicts cleanly with `BadRequestException` without hashing an unnecessary password when the collision check trips first, and never echoes raw Postgres constraint internals.
3. **Migration & RLS Baseline Verification**:
   - Reads `server/src/database/schema.sql` and `server/src/database/migrations/001_supabase_rls_lockdown.sql` to assert `CREATE TABLE`, `pgvector` support, foreign key integrity, and `ENABLE ROW LEVEL SECURITY` / `FORCE ROW LEVEL SECURITY` coverage across critical tables.
4. **Distributed Lock Exclusion (`RedlockService`)**:
   - Verifies concurrent `acquire()` attempts on the same resource allow only one lock holder until explicit owner-matched `release()` (preventing cross-caller premature release when `lockId` differs).
