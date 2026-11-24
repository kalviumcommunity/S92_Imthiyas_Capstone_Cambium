import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FundingService } from './funding.service';
import { CreateFundingAccountDto, CreateExpenseRequestDto } from './dto/institution.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FinancialState } from './entities/funding-account.entity';

@ApiTags('Research Funding & Financial Governance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/funding')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  @Get('accounts')
  @ApiOperation({ summary: 'List department/project-scoped funding accounts and line-item budgets' })
  listAccounts(@CurrentUser() user: AuthenticatedUser) {
    return this.fundingService.listAccounts(user);
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Register a sanctioned funding account with category line allocations' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createAccount(@Body() dto: CreateFundingAccountDto, @CurrentUser() user: AuthenticatedUser) {
    return this.fundingService.createAccount(user, dto);
  }

  @Patch('accounts/:id/state')
  @ApiOperation({ summary: 'Transition grant financial state (REQUESTED/APPROVED/SANCTIONED/RECEIVED/CLOSED)' })
  updateState(
    @Param('id') id: string,
    @Body('financialState') financialState: FinancialState,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.fundingService.updateFinancialState(id, user, financialState);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'List purchase & expense requests within tenant scope' })
  listExpenses(@CurrentUser() user: AuthenticatedUser) {
    return this.fundingService.listExpenses(user);
  }

  @Post('expenses')
  @ApiOperation({ summary: 'Submit purchase request committing available grant funds atomically' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createExpense(@Body() dto: CreateExpenseRequestDto, @CurrentUser() user: AuthenticatedUser) {
    return this.fundingService.createExpenseRequest(user, dto);
  }

  @Post('expenses/:id/approve')
  @ApiOperation({ summary: 'Approve committed expense request (Finance Officer / R&D Director)' })
  approveExpense(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.fundingService.settleExpense(id, user, true);
  }

  @Post('expenses/:id/reject')
  @ApiOperation({ summary: 'Reject committed expense request and release funds back to available pool' })
  rejectExpense(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.fundingService.settleExpense(id, user, false, reason);
  }
}
