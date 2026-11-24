import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Department } from './entities/department.entity';
import { Proposal } from './entities/proposal.entity';
import { ProposalRevision } from './entities/proposal-revision.entity';
import { ProposalReview } from './entities/proposal-review.entity';
import { FundingAccount } from './entities/funding-account.entity';
import { BudgetLineItem } from './entities/budget-line-item.entity';
import { ExpenseRequest } from './entities/expense-request.entity';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { ProjectRisk } from './entities/project-risk.entity';
import { ComplianceProtocol } from './entities/compliance-protocol.entity';
import { GroupProject } from '../projects/entities/group-project.entity';
import { User } from '../users/entities/user.entity';
import { InstitutionService } from './institution.service';
import { ProposalsService } from './proposals.service';
import { FundingService } from './funding.service';
import { ExecutionComplianceService } from './execution-compliance.service';
import { InstitutionController } from './institution.controller';
import { ProposalsController } from './proposals.controller';
import { FundingController } from './funding.controller';
import { ExecutionComplianceController } from './execution-compliance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Department,
      Proposal,
      ProposalRevision,
      ProposalReview,
      FundingAccount,
      BudgetLineItem,
      ExpenseRequest,
      ProjectMilestone,
      ProjectRisk,
      ComplianceProtocol,
      GroupProject,
      User,
    ]),
  ],
  controllers: [
    InstitutionController,
    ProposalsController,
    FundingController,
    ExecutionComplianceController,
  ],
  providers: [
    InstitutionService,
    ProposalsService,
    FundingService,
    ExecutionComplianceService,
  ],
  exports: [
    InstitutionService,
    ProposalsService,
    FundingService,
    ExecutionComplianceService,
  ],
})
export class InstitutionModule {}
