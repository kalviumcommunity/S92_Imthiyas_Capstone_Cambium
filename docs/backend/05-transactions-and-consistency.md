# Transactions, Concurrency & State Consistency (`05`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Concurrency Controls Implemented
| Workflow | Hazard Prevented | Implementation |
| :--- | :--- | :--- |
| **Grant Expense Commitment (`FundingService.createExpenseRequest`)** | Lost update / double-commit exceeding `sanctionedAmount` under concurrent submissions | Moved account & line-item reads inside `DataSource.transaction()` with PostgreSQL row lock `{ lock: { mode: 'pessimistic_write' } }` and atomic outbox emission. |
| **Expense Settlement (`FundingService.settleExpense`)** | Concurrent double-approval or double-refund of `committedAmount` -> `spentAmount` | Acquires `pessimistic_write` lock on both `ExpenseRequest` and parent `FundingAccount` (and `BudgetLineItem`) inside a single transaction. |
| **Bulk Opportunity Creation (`OpportunitiesService.bulkCreate`)** | Partial taxonomy writes outside transaction context | Resolves `Tag` entities via `queryRunner.manager.getRepository(Tag)` inside the same `QueryRunner` transaction and caps batch size at `100`. |
| **Subscription + Invoice Billing (`BillingService.createOrUpdateSubscription`)** | Dangling active subscription without matching invoice receipt | Wrapped `Subscription` upsert and cryptographic `Invoice` creation inside `DataSource.transaction()`. |
| **Duplicate Bookmarks (`BookmarksService.create`)** | Race between duplicate check and `INSERT` raising HTTP `500` | Catches PostgreSQL SQLSTATE `23505` inside `BookmarksService` and maps to `409 ConflictException` (backed by `AllExceptionsFilter`). |
| **Proposal Revisions & Outbox (`ProposalsService`, `OutboxRelayService`)** | Stale draft overwrites & multi-replica double-dispatch | Enforces explicit `@VersionColumn` optimistic concurrency on proposals/projects and PostgreSQL `FOR UPDATE SKIP LOCKED` on outbox event claims. |

## 2. Explicit Domain State Machines (`ProposalsService`)
- `submitForReview`: Transitions permitted **only** from `DRAFTING` or `REVISION_REQUESTED` into `SUPERVISOR_REVIEW` or `INTERNAL_REVIEW`.
- `recordReviewDecision`: Rejects review decisions on unsubmitted `DRAFTING` or finalized `APPROVED` / `REJECTED` proposals.
