import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExecutionComplianceService } from './execution-compliance.service';
import {
  CreateMilestoneDto,
  CreateComplianceProtocolDto,
  ReviewComplianceProtocolDto,
} from './dto/institution.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Project Execution & Research Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1')
export class ExecutionComplianceController {
  constructor(private readonly service: ExecutionComplianceService) {}

  @Get('milestones')
  @ApiOperation({ summary: 'List project milestones and deliverables' })
  listMilestones(@Query('projectId') projectId: string | undefined, @CurrentUser() user: AuthenticatedUser) {
    return this.service.listMilestones(projectId, user);
  }

  @Post('milestones')
  @ApiOperation({ summary: 'Create a trackable project milestone or deliverable' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createMilestone(@Body() dto: CreateMilestoneDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.createMilestone(user, dto);
  }

  @Put('milestones/:id/complete')
  @ApiOperation({ summary: 'Sign off milestone completion' })
  completeMilestone(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.completeMilestone(id, user);
  }

  @Get('risks')
  @ApiOperation({ summary: 'List project risk register entries' })
  listRisks(@Query('projectId') projectId: string) {
    return this.service.listRisks(projectId);
  }

  @Post('risks')
  @ApiOperation({ summary: 'Record a project risk and mitigation plan' })
  createRisk(
    @Body() body: { projectId: string; title: string; severity?: any; mitigationPlan?: string },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.createRisk(user, body);
  }

  @Get('compliance/protocols')
  @ApiOperation({ summary: 'List tenant-scoped IRB / IAEC / Biosafety / DMP / COI protocols' })
  listComplianceProtocols(@CurrentUser() user: AuthenticatedUser) {
    return this.service.listComplianceProtocols(user);
  }

  @Post('compliance/protocols')
  @ApiOperation({ summary: 'Submit ethics or compliance protocol with supporting evidence' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  submitComplianceProtocol(
    @Body() dto: CreateComplianceProtocolDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.submitComplianceProtocol(user, dto);
  }

  @Put('compliance/protocols/:id/review')
  @ApiOperation({ summary: 'Record authorized Compliance Officer review decision' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  reviewComplianceProtocol(
    @Param('id') id: string,
    @Body() dto: ReviewComplianceProtocolDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.reviewComplianceProtocol(id, user, dto);
  }
}
