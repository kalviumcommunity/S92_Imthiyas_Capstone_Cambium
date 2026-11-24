import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContributionsService } from './contributions.service';
import { GetContributionsQueryDto } from './dto/get-contributions-query.dto';
import { CreateManualContributionDto } from './dto/create-manual-contribution.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

const DEFAULT_SCHOLAR_ID = '00000000-0000-0000-0000-000000000001';

@ApiTags('Research Contributions & Attribution Ledger')
@Controller(['contributions', 'api/contributions', 'api/v1/contributions'])
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve attributable, evidence-based research contributions for a scholar',
  })
  @ApiResponse({ status: 200, description: 'List of verified research contribution events' })
  async getContributions(@Query() query: GetContributionsQueryDto, @Req() req: any) {
    const viewerId = req.user?.id;
    const actorId = query.actorId || viewerId || DEFAULT_SCHOLAR_ID;
    return this.contributionsService.getContributions(actorId, query, viewerId);
  }

  @Get('summary')
  @ApiOperation({
    summary:
      'Retrieve 4-pillar research metrics summary: eligible events, active days, distinct outputs, and impact',
  })
  @ApiResponse({
    status: 200,
    description: 'Heatmap matrix and 4-pillar research metrics breakdown',
  })
  async getSummary(@Query() query: GetContributionsQueryDto, @Req() req: any) {
    const viewerId = req.user?.id;
    const actorId = query.actorId || viewerId || DEFAULT_SCHOLAR_ID;
    return this.contributionsService.getSummary(actorId, query, viewerId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Record a manual verified/confirmed research milestone with supporting evidence',
  })
  @ApiResponse({ status: 201, description: 'Research contribution recorded successfully' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createManualContribution(
    @Body() dto: CreateManualContributionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contributionsService.createManualContribution(user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a research contribution event' })
  @ApiResponse({ status: 200, description: 'Contribution removed successfully' })
  async deleteContribution(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.contributionsService.deleteContribution(user.id, id);
  }
}
