import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
  FilterOpportunityDto,
  RecommendationQueryDto,
} from './dto/opportunity.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Research Opportunities')
@Controller('api/research-opportunities')
export class OpportunitiesController {
  constructor(private readonly oppService: OpportunitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all opportunities with optional filtering, tag search, and full-text search' })
  @ApiResponse({ status: 200, description: 'List of research opportunities' })
  async getOpportunities(@Query() filters: FilterOpportunityDto) {
    return this.oppService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get aggregate opportunity statistics using single-query relational aggregation' })
  @ApiResponse({ status: 200, description: 'Opportunity metrics and counts by type' })
  async getStats() {
    return this.oppService.getOpportunityStats();
  }

  @Get('upcoming-deadlines')
  @ApiOperation({ summary: 'Get opportunities with upcoming deadlines sorted chronologically' })
  @ApiResponse({ status: 200, description: 'Upcoming opportunities' })
  async getUpcomingDeadlines() {
    return this.oppService.getUpcomingDeadlines();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single research opportunity by ID with joined tags and creator' })
  @ApiParam({ name: 'id', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity details' })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  async getOpportunityById(@Param('id') id: string) {
    return this.oppService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new research opportunity' })
  @ApiResponse({ status: 201, description: 'Opportunity created successfully' })
  async createOpportunity(
    @Body() dto: CreateOpportunityDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.oppService.create(dto, user?.id);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bulk create research opportunities with transactional integrity' })
  @ApiResponse({ status: 201, description: 'Bulk opportunities created' })
  async createMultipleOpportunities(
    @Body() body: any,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const list = Array.isArray(body) ? body : body.opportunities;
    return this.oppService.bulkCreate(list, user?.id);
  }

  @Post('recommendations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve personalized opportunity recommendations via pgvector or tags' })
  @ApiResponse({ status: 200, description: 'Recommended opportunities' })
  async getRecommendations(@Body() dto: RecommendationQueryDto) {
    return this.oppService.getRecommendations(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing research opportunity' })
  @ApiParam({ name: 'id', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity updated successfully' })
  async updateOpportunity(
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.oppService.update(id, dto);
  }

  @Put(':id/tags')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add or update tags on a research opportunity' })
  @ApiParam({ name: 'id', description: 'Opportunity UUID' })
  async updateOpportunityTags(
    @Param('id') id: string,
    @Body('tags') tags: string[] | string,
  ) {
    const tagsArray = Array.isArray(tags) ? tags : [tags];
    return this.oppService.updateTags(id, tagsArray);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a research opportunity' })
  @ApiParam({ name: 'id', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity deleted successfully' })
  async deleteOpportunity(@Param('id') id: string) {
    return this.oppService.remove(id);
  }
}
