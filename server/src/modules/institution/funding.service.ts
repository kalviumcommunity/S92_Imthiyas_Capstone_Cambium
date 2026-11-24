import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FundingAccount, FinancialState } from './entities/funding-account.entity';
import { BudgetLineItem } from './entities/budget-line-item.entity';
import { ExpenseRequest } from './entities/expense-request.entity';
import { CreateFundingAccountDto, CreateExpenseRequestDto } from './dto/institution.dto';
import { OutboxService } from '../../common/outbox/outbox.service';
import { assertTenantRecordAccess, isInstitutionWideRole } from './institution-access.util';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';

const DEFAULT_CATEGORIES = [
  'Equipment',
  'Research Materials',
  'Software & Infrastructure',
  'Research Assistance',
  'Travel & Publication',
  'Contingency',
];

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(FundingAccount)
    private readonly accountRepo: Repository<FundingAccount>,
    @InjectRepository(BudgetLineItem)
    private readonly lineItemRepo: Repository<BudgetLineItem>,
    @InjectRepository(ExpenseRequest)
    private readonly expenseRepo: Repository<ExpenseRequest>,
    @Optional() private readonly outboxService?: OutboxService,
    @Optional() private readonly dataSource?: DataSource,
  ) {}

  async listAccounts(user: AuthenticatedUser) {
    const qb = this.accountRepo.createQueryBuilder('fa').orderBy('fa.createdAt', 'DESC');

    if (user.organizationId) {
      qb.andWhere('(fa.organization_id = :orgId OR fa.organization_id IS NULL)', {
        orgId: user.organizationId,
      });
    }

    if (!isInstitutionWideRole(user.role)) {
      if (user.role === UserRole.DEPARTMENT_HEAD && user.departmentId) {
        qb.andWhere('fa.department_id = :deptId', { deptId: user.departmentId });
      } else {
        qb.andWhere('fa.pi_user_id = :uid', { uid: user.id });
      }
    }

    const accounts = await qb.getMany();
    const enriched = await Promise.all(
      accounts.map(async (acc) => {
        const lineItems = await this.lineItemRepo.find({ where: { fundingAccountId: acc.id } });
        const sanctioned = Number(acc.sanctionedAmount || 0);
        const committed = Number(acc.committedAmount || 0);
        const spent = Number(acc.spentAmount || 0);
        return {
          ...acc,
          availableBalance: Math.max(0, sanctioned - committed - spent),
          lineItems,
        };
      }),
    );

    return { success: true, count: enriched.length, data: enriched };
  }

  async createAccount(user: AuthenticatedUser, dto: CreateFundingAccountDto) {
    const creatorAllowed = new Set<string>([
      UserRole.SUPER_ADMIN,
      UserRole.UNIVERSITY_LEADERSHIP,
      UserRole.RD_DIRECTOR,
      UserRole.FINANCE_OFFICER,
      UserRole.DEPARTMENT_HEAD,
      UserRole.PI,
    ]);
    if (!user.role || !creatorAllowed.has(user.role)) {
      throw new ForbiddenException('Insufficient role to register a grant funding account.');
    }

    const saveAccount = async (
      aRepo: Repository<FundingAccount>,
      lRepo: Repository<BudgetLineItem>,
    ) => {
      const account = await aRepo.save(
        aRepo.create({
          organizationId: user.organizationId || null,
          departmentId: dto.departmentId || user.departmentId || null,
          projectId: dto.projectId || null,
          proposalId: dto.proposalId || null,
          piUserId: user.id,
          grantNumber: dto.grantNumber,
          funderName: dto.funderName,
          title: dto.title,
          currency: dto.currency || 'INR',
          financialState: 'SANCTIONED',
          requestedAmount: String(dto.requestedAmount ?? dto.sanctionedAmount),
          approvedAmount: String(dto.sanctionedAmount),
          sanctionedAmount: String(dto.sanctionedAmount),
          receivedAmount: String(dto.receivedAmount ?? dto.sanctionedAmount),
          committedAmount: '0',
          spentAmount: '0',
        }),
      );

      const itemsToCreate =
        dto.lineItems && dto.lineItems.length > 0
          ? dto.lineItems
          : DEFAULT_CATEGORIES.map((category, idx) => ({
              category,
              allocatedAmount:
                idx === 0
                  ? Math.round(dto.sanctionedAmount * 0.3)
                  : idx === 1 || idx === 3
                  ? Math.round(dto.sanctionedAmount * 0.2)
                  : Math.round(dto.sanctionedAmount * 0.1),
            }));

      const savedItems = await lRepo.save(
        itemsToCreate.map((li) =>
          lRepo.create({
            fundingAccountId: account.id,
            category: li.category,
            allocatedAmount: String(li.allocatedAmount),
            committedAmount: '0',
            spentAmount: '0',
          }),
        ),
      );

      return { ...account, lineItems: savedItems, availableBalance: dto.sanctionedAmount };
    };

    const result = this.dataSource
      ? await this.dataSource.transaction(async (m) => {
          const created = await saveAccount(
            m.getRepository(FundingAccount),
            m.getRepository(BudgetLineItem),
          );
          if (this.outboxService) {
            await this.outboxService.emitWithinTransaction(
              m,
              'funding_accounts',
              created.id,
              'FUNDING_SANCTIONED',
              {
                fundingAccountId: created.id,
                grantNumber: created.grantNumber,
                sanctionedAmount: created.sanctionedAmount,
                userId: user.id,
              },
            );
          }
          return created;
        })
      : await saveAccount(this.accountRepo, this.lineItemRepo);

    return { success: true, message: 'Funding governance account registered.', data: result };
  }

  async updateFinancialState(id: string, user: AuthenticatedUser, nextState: FinancialState) {
    if (
      ![UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER, UserRole.RD_DIRECTOR, UserRole.UNIVERSITY_LEADERSHIP].includes(
        user.role as UserRole,
      )
    ) {
      throw new ForbiddenException('Only Finance Officers or R&D Directors may change grant financial state.');
    }

    const account = await this.accountRepo.findOne({ where: { id } });
    if (!account) throw new NotFoundException(`Funding account ${id} not found.`);

    account.financialState = nextState;
    if (nextState === 'CLOSED') {
      account.closedAt = new Date();
    }
    const saved = await this.accountRepo.save(account);
    return { success: true, data: saved };
  }

  async listExpenses(user: AuthenticatedUser) {
    const qb = this.expenseRepo.createQueryBuilder('ex').orderBy('ex.createdAt', 'DESC');
    if (!isInstitutionWideRole(user.role)) {
      if (user.role === UserRole.DEPARTMENT_HEAD && user.departmentId) {
        qb.andWhere('ex.department_id = :deptId', { deptId: user.departmentId });
      } else {
        qb.andWhere('ex.requester_id = :uid', { uid: user.id });
      }
    }
    const data = await qb.getMany();
    return { success: true, count: data.length, data };
  }

  /**
   * Submit an expense / purchase commitment against a sanctioned funding account.
   * Atomically enforces budget invariant: committed + spent + amount <= sanctionedAmount.
   */
  async createExpenseRequest(user: AuthenticatedUser, dto: CreateExpenseRequestDto) {
    const account = await this.accountRepo.findOne({ where: { id: dto.fundingAccountId } });
    if (!account) throw new NotFoundException(`Funding account ${dto.fundingAccountId} not found.`);

    assertTenantRecordAccess(
      user,
      {
        organizationId: account.organizationId,
        departmentId: account.departmentId,
        ownerUserId: account.piUserId,
      },
      'funding account',
    );

    if (account.financialState === 'CLOSED') {
      throw new BadRequestException('Cannot submit expenses against a CLOSED funding account.');
    }

    const sanctioned = Number(account.sanctionedAmount || 0);
    const committed = Number(account.committedAmount || 0);
    const spent = Number(account.spentAmount || 0);
    const available = sanctioned - committed - spent;

    if (dto.amount > available) {
      throw new BadRequestException(
        `Insufficient available funds: requested ${dto.amount}, available ${Math.max(0, available)}.`,
      );
    }

    const executeCommit = async (
      aRepo: Repository<FundingAccount>,
      eRepo: Repository<ExpenseRequest>,
      lRepo: Repository<BudgetLineItem>,
    ) => {
      account.committedAmount = String(committed + dto.amount);
      await aRepo.save(account);

      if (dto.budgetLineItemId) {
        const line = await lRepo.findOne({ where: { id: dto.budgetLineItemId, fundingAccountId: account.id } });
        if (line) {
          line.committedAmount = String(Number(line.committedAmount || 0) + dto.amount);
          await lRepo.save(line);
        }
      }

      return eRepo.save(
        eRepo.create({
          fundingAccountId: account.id,
          budgetLineItemId: dto.budgetLineItemId || null,
          departmentId: account.departmentId,
          projectId: account.projectId,
          requesterId: user.id,
          title: dto.title,
          vendorName: dto.vendorName,
          invoiceRef: dto.invoiceRef,
          amount: String(dto.amount),
          status: 'COMMITTED',
        }),
      );
    };

    const expense = this.dataSource
      ? await this.dataSource.transaction(async (m) => {
          const saved = await executeCommit(
            m.getRepository(FundingAccount),
            m.getRepository(ExpenseRequest),
            m.getRepository(BudgetLineItem),
          );
          if (this.outboxService) {
            await this.outboxService.emitWithinTransaction(m, 'expense_requests', saved.id, 'EXPENSE_COMMITTED', {
              expenseId: saved.id,
              fundingAccountId: account.id,
              amount: saved.amount,
              userId: user.id,
            });
          }
          return saved;
        })
      : await executeCommit(this.accountRepo, this.expenseRepo, this.lineItemRepo);

    return { success: true, message: 'Purchase commitment recorded.', data: expense };
  }

  /**
   * Approve or reject a committed expense (Finance Officer / R&D Director / University Leadership only).
   * Approval transitions amount from committed -> spent; rejection releases committed funds back to available.
   */
  async settleExpense(
    expenseId: string,
    approver: AuthenticatedUser,
    approve: boolean,
    rejectionReason?: string,
  ) {
    if (
      ![UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER, UserRole.RD_DIRECTOR, UserRole.UNIVERSITY_LEADERSHIP].includes(
        approver.role as UserRole,
      )
    ) {
      throw new ForbiddenException('Only authorized Finance Officers or R&D Directors can approve expenses.');
    }

    const expense = await this.expenseRepo.findOne({ where: { id: expenseId } });
    if (!expense) throw new NotFoundException(`Expense request ${expenseId} not found.`);
    if (expense.status === 'APPROVED_PAID' || expense.status === 'REJECTED') {
      throw new BadRequestException(`Expense request is already finalized (${expense.status}).`);
    }

    const account = await this.accountRepo.findOne({ where: { id: expense.fundingAccountId } });
    if (!account) throw new NotFoundException('Parent funding account not found.');

    const amount = Number(expense.amount);
    const executeSettle = async (
      aRepo: Repository<FundingAccount>,
      eRepo: Repository<ExpenseRequest>,
      lRepo: Repository<BudgetLineItem>,
    ) => {
      const nextCommitted = Math.max(0, Number(account.committedAmount || 0) - amount);
      account.committedAmount = String(nextCommitted);
      if (approve) {
        account.spentAmount = String(Number(account.spentAmount || 0) + amount);
      }
      await aRepo.save(account);

      if (expense.budgetLineItemId) {
        const line = await lRepo.findOne({ where: { id: expense.budgetLineItemId } });
        if (line) {
          line.committedAmount = String(Math.max(0, Number(line.committedAmount || 0) - amount));
          if (approve) {
            line.spentAmount = String(Number(line.spentAmount || 0) + amount);
          }
          await lRepo.save(line);
        }
      }

      expense.status = approve ? 'APPROVED_PAID' : 'REJECTED';
      expense.approvedById = approver.id;
      expense.approvedAt = new Date();
      expense.rejectionReason = approve ? null : rejectionReason || 'Rejected during finance audit';
      return eRepo.save(expense);
    };

    const settled = this.dataSource
      ? await this.dataSource.transaction(async (m) => {
          const saved = await executeSettle(
            m.getRepository(FundingAccount),
            m.getRepository(ExpenseRequest),
            m.getRepository(BudgetLineItem),
          );
          if (this.outboxService) {
            await this.outboxService.emitWithinTransaction(
              m,
              'expense_requests',
              saved.id,
              approve ? 'EXPENSE_APPROVED_PAID' : 'EXPENSE_REJECTED',
              {
                expenseId: saved.id,
                fundingAccountId: account.id,
                userId: expense.requesterId,
                amount: saved.amount,
              },
            );
          }
          return saved;
        })
      : await executeSettle(this.accountRepo, this.expenseRepo, this.lineItemRepo);

    return { success: true, data: settled };
  }
}
