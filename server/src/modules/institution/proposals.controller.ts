import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto, UpdateProposalDto, CreateProposalReviewDto } from './dto/institution.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Research Proposals & Review Workflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  @ApiOperation({ summary: 'List authorized research proposals' })
  listProposals(@CurrentUser() user: AuthenticatedUser) {
    return this.proposalsService.listProposals(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve proposal with revision history and peer reviews' })
  getProposal(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.proposalsService.getProposalDetails(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new persistent research proposal' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createProposal(@Body() dto: CreateProposalDto, @CurrentUser() user: AuthenticatedUser) {
    return this.proposalsService.createProposal(user, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update proposal sections with optimistic locking and version snapshot' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateProposal(
    @Param('id') id: string,
    @Body() dto: UpdateProposalDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.proposalsService.updateProposal(id, user, dto);
  }

  @Post(':id/submit-review')
  @ApiOperation({ summary: 'Advance proposal into supervisor/internal/external review' })
  submitForReview(
    @Param('id') id: string,
    @Body('stage') stage: any,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.proposalsService.submitForReview(id, user, stage || 'SUPERVISOR_REVIEW');
  }

  @Post(':id/reviews')
  @ApiOperation({ summary: 'Record supervisor/internal/external review decision' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  recordReview(
    @Param('id') id: string,
    @Body() dto: CreateProposalReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.proposalsService.recordReviewDecision(id, user, dto);
  }
}
