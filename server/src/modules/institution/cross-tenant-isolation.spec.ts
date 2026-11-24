import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { assertTenantRecordAccess } from './institution-access.util';
import { FundingService } from './funding.service';
import { ProposalsService } from './proposals.service';
import { ExecutionComplianceService } from './execution-compliance.service';
import { UserRole } from '../users/entities/user.entity';

describe('Institutional Tenant Isolation, Funding Invariants & Review Workflows', () => {
  const orgId = 'org-amet-1';
  const deptA = 'dept-aimc';
  const deptB = 'dept-bio';

  const headDeptA = {
    id: 'user-head-a',
    role: UserRole.DEPARTMENT_HEAD,
    organizationId: orgId,
    departmentId: deptA,
  };

  const headDeptB = {
    id: 'user-head-b',
    role: UserRole.DEPARTMENT_HEAD,
    organizationId: orgId,
    departmentId: deptB,
  };

  const financeOfficer = {
    id: 'user-fin-1',
    role: UserRole.FINANCE_OFFICER,
    organizationId: orgId,
    departmentId: null,
  };

  const complianceOfficer = {
    id: 'user-comp-1',
    role: UserRole.COMPLIANCE_OFFICER,
    organizationId: orgId,
    departmentId: null,
  };

  it('should strictly block Department A from accessing Department B confidential records', () => {
    expect(() =>
      assertTenantRecordAccess(
        headDeptA,
        { organizationId: orgId, departmentId: deptB, ownerUserId: 'user-b-pi' },
        'funding account',
      ),
    ).toThrow(ForbiddenException);

    // Same department passes
    expect(() =>
      assertTenantRecordAccess(
        headDeptB,
        { organizationId: orgId, departmentId: deptB, ownerUserId: 'user-b-pi' },
        'funding account',
      ),
    ).not.toThrow();

    // Cross-organization always rejected even for R&D Director
    expect(() =>
      assertTenantRecordAccess(
        { id: 'dir-1', role: UserRole.RD_DIRECTOR, organizationId: orgId },
        { organizationId: 'org-other-uni', departmentId: deptA },
        'funding account',
      ),
    ).toThrow(ForbiddenException);
  });

  describe('Funding Governance Invariants (₹10L Lifecycle)', () => {
    let fundingService: FundingService;
    let storedAccount: any;
    let storedExpense: any;

    beforeEach(() => {
      storedAccount = {
        id: 'fa-10l',
        organizationId: orgId,
        departmentId: deptA,
        piUserId: 'pi-1',
        grantNumber: 'AMET-2026-10L',
        sanctionedAmount: '1000000',
        committedAmount: '200000',
        spentAmount: '400000',
        financialState: 'SANCTIONED',
      };
      storedExpense = {
        id: 'exp-1',
        fundingAccountId: 'fa-10l',
        requesterId: 'pi-1',
        amount: '100000',
        status: 'COMMITTED',
      };

      const accountRepo: any = {
        findOne: vi.fn(async () => storedAccount),
        save: vi.fn(async (a) => {
          storedAccount = a;
          return a;
        }),
      };
      const lineRepo: any = {
        findOne: vi.fn(async () => null),
        save: vi.fn(async (l) => l),
      };
      const expenseRepo: any = {
        findOne: vi.fn(async () => storedExpense),
        create: vi.fn((d) => ({ id: 'exp-new', ...d })),
        save: vi.fn(async (e) => {
          storedExpense = e;
          return e;
        }),
      };

      fundingService = new FundingService(accountRepo, lineRepo, expenseRepo);
    });

    it('should reject expense requests exceeding remaining available balance (₹4L available)', async () => {
      await expect(
        fundingService.createExpenseRequest(headDeptA, {
          fundingAccountId: 'fa-10l',
          title: 'Over-budget Cluster Purchase',
          amount: 500000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should block Finance settlement by regular Researcher and allow FinanceOfficer to move committed -> spent', async () => {
      await expect(
        fundingService.settleExpense('exp-1', headDeptA, true),
      ).rejects.toThrow(ForbiddenException);

      const res = await fundingService.settleExpense('exp-1', financeOfficer, true);
      expect(res.data.status).toBe('APPROVED_PAID');
      expect(storedAccount.committedAmount).toBe('100000'); // 2L - 1L
      expect(storedAccount.spentAmount).toBe('500000'); // 4L + 1L
    });

    it('should release committed funds back to available pool upon expense rejection', async () => {
      const res = await fundingService.settleExpense('exp-1', financeOfficer, false, 'Missing vendor quote');
      expect(res.data.status).toBe('REJECTED');
      expect(storedAccount.committedAmount).toBe('100000');
      expect(storedAccount.spentAmount).toBe('400000');
    });
  });

  describe('Proposal Concurrency & Compliance Review Authority', () => {
    it('should throw ConflictException on stale proposal version save', async () => {
      const proposalRepo: any = {
        findOne: vi.fn(async () => ({
          id: 'prop-1',
          organizationId: orgId,
          departmentId: deptA,
          leadUserId: 'pi-1',
          version: 4,
        })),
      };
      const service = new ProposalsService(proposalRepo, {} as any, {} as any);

      await expect(
        service.updateProposal('prop-1', { id: 'pi-1', role: UserRole.PI }, {
          title: 'Stale Write',
          version: 2,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should never auto-approve submitted ethics protocols and restrict determination to ComplianceOfficer', async () => {
      let savedProto: any;
      const protoRepo: any = {
        create: vi.fn((d) => ({ id: 'cp-1', ...d })),
        save: vi.fn(async (d) => {
          savedProto = d;
          return d;
        }),
        findOne: vi.fn(async () => savedProto),
      };
      const service = new ExecutionComplianceService({} as any, {} as any, protoRepo);

      const submitted = await service.submitComplianceProtocol(headDeptA, {
        protocolNumber: 'IRB-2026-NEW',
        title: 'Water Telemetry Survey',
        boardName: 'AMET IEC',
      });
      expect(submitted.data.status).toBe('SUBMITTED');

      await expect(
        service.reviewComplianceProtocol('cp-1', headDeptA, { status: 'APPROVED' }),
      ).rejects.toThrow(ForbiddenException);

      const approved = await service.reviewComplianceProtocol('cp-1', complianceOfficer, {
        status: 'APPROVED',
        reviewNotes: 'Informed consent & sensor calibration verified.',
      });
      expect(approved.data.status).toBe('APPROVED');
      expect(approved.data.reviewedById).toBe('user-comp-1');
    });
  });
});
