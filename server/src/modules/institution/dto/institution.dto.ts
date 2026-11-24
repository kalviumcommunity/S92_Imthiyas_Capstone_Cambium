import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsArray,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDepartmentDto {
  @IsUUID()
  @IsOptional()
  organizationId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  code: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  annualBudgetCap?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;
}

export class CreateProposalDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  opportunityId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  funder?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  program?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  requestedAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsString()
  aims?: string;

  @IsOptional()
  @IsString()
  significance?: string;

  @IsOptional()
  @IsString()
  methodology?: string;

  @IsOptional()
  @IsString()
  timelineSummary?: string;

  @IsOptional()
  @IsString()
  budgetBreakdownText?: string;

  @IsOptional()
  @IsArray()
  keywords?: string[];
}

export class UpdateProposalDto extends CreateProposalDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  version?: number;

  @IsOptional()
  @IsString()
  summaryOfChanges?: string;
}

export class CreateProposalReviewDto {
  @IsIn(['SUPERVISOR', 'INTERNAL', 'EXTERNAL'])
  stage: 'SUPERVISOR' | 'INTERNAL' | 'EXTERNAL';

  @IsIn(['APPROVED', 'REVISION_REQUESTED', 'REJECTED'])
  decision: 'APPROVED' | 'REVISION_REQUESTED' | 'REJECTED';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  rubricScore?: number;

  @IsString()
  @IsNotEmpty()
  comments: string;
}

export class CreateFundingAccountDto {
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  proposalId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  grantNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  funderName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sanctionedAmount: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  requestedAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  receivedAmount?: number;

  @IsOptional()
  @IsArray()
  lineItems?: Array<{ category: string; allocatedAmount: number }>;
}

export class CreateExpenseRequestDto {
  @IsUUID()
  fundingAccountId: string;

  @IsOptional()
  @IsUUID()
  budgetLineItemId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  vendorName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  invoiceRef?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount: number;
}

export class CreateMilestoneDto {
  @IsUUID()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  deliverable?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsIn(['PLANNED', 'IN_PROGRESS', 'AT_RISK', 'COMPLETED'])
  status?: 'PLANNED' | 'IN_PROGRESS' | 'AT_RISK' | 'COMPLETED';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent?: number;
}

export class CreateComplianceProtocolDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  protocolNumber: string;

  @IsOptional()
  @IsIn(['IRB', 'IAEC', 'BIOSAFETY', 'DMP', 'COI'])
  committeeType?: 'IRB' | 'IAEC' | 'BIOSAFETY' | 'DMP' | 'COI';

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  boardName: string;

  @IsOptional()
  @IsIn(['Exempt', 'Expedited', 'Full Board Review'])
  riskCategory?: 'Exempt' | 'Expedited' | 'Full Board Review';

  @IsOptional()
  @IsString()
  expirationDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  participatingSitesCount?: number;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;
}

export class ReviewComplianceProtocolDto {
  @IsIn(['UNDER_REVIEW', 'APPROVED', 'AMENDMENT_REQUIRED', 'REJECTED', 'EXPIRED'])
  status: 'UNDER_REVIEW' | 'APPROVED' | 'AMENDMENT_REQUIRED' | 'REJECTED' | 'EXPIRED';

  @IsOptional()
  @IsString()
  reviewNotes?: string;
}
