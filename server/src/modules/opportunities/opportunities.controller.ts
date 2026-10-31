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
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';
import { HybridSearchService } from './hybrid-search.service';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
  FilterOpportunityDto,
  RecommendationQueryDto,
} from './dto/opportunity.dto';
import { OpportunityType } from './entities/research-opportunity.entity';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EdgeCache } from '../../common/decorators/edge-cache.decorator';
import { EdgeCacheInterceptor } from '../../common/interceptors/edge-cache.interceptor';
import { CloudflarePurgeService } from '../../common/services/cloudflare-purge.service';

@ApiTags('Research Opportunities')
@Controller(['api/research-opportunities', 'api/opportunities'])
export class OpportunitiesController {
  constructor(
    @Inject(OpportunitiesService)
    private readonly oppService: OpportunitiesService,
    @Inject(HybridSearchService)
    private readonly hybridSearchService: HybridSearchService,
    @Inject(CloudflarePurgeService)
    private readonly cloudflarePurge: CloudflarePurgeService,
  ) {}

  @Get('hybrid')
  @ApiOperation({
    summary: 'Hybrid Search: Fuses pgvector 768-dim HNSW cosine similarity & GIN text search via Reciprocal Rank Fusion (k=60)',
  })
  @ApiResponse({ status: 200, description: 'Ranked list of opportunities scored by RRF' })
  async hybridSearch(
    @Query('q') q: string = '',
    @Query('limit') limit?: number,
    @Query('type') type?: OpportunityType,
    @Query('funder') funder?: string,
  ) {
    return this.hybridSearchService.search({
      query: q,
      limit: limit ? Number(limit) : 20,
      type,
      funder,
    });
  }

  @Get()
  @UseInterceptors(EdgeCacheInterceptor)
  @EdgeCache({
    maxAge: 3600,
    sMaxAge: 86400,
    staleWhileRevalidate: 86400,
    tags: ['cambium-catalog', 'grants-list'],
    public: true,
  })
  @ApiOperation({ summary: 'Get all opportunities with Cloudflare Edge Caching (stale-while-revalidate=86400)' })
  @ApiResponse({ status: 200, description: 'List of research opportunities with Edge Cache-Control headers' })
  async getOpportunities(@Query() filters: FilterOpportunityDto) {
    return this.oppService.findAll(filters);
  }

  @Get('stats')
  @UseInterceptors(EdgeCacheInterceptor)
  @EdgeCache({
    maxAge: 1800,
    sMaxAge: 43200,
    staleWhileRevalidate: 86400,
    tags: ['cambium-catalog', 'grants-stats'],
    public: true,
  })
  @ApiOperation({ summary: 'Get aggregate opportunity statistics with edge caching' })
  @ApiResponse({ status: 200, description: 'Opportunity metrics and counts by type' })
  async getStats() {
    return this.oppService.getOpportunityStats();
  }

  @Get('upcoming-deadlines')
  @UseInterceptors(EdgeCacheInterceptor)
  @EdgeCache({
    maxAge: 1800,
    sMaxAge: 43200,
    staleWhileRevalidate: 86400,
    tags: ['cambium-catalog', 'grants-deadlines'],
    public: true,
  })
  @ApiOperation({ summary: 'Get opportunities with upcoming deadlines sorted chronologically' })
  @ApiResponse({ status: 200, description: 'Upcoming opportunities' })
  async getUpcomingDeadlines() {
    return this.oppService.getUpcomingDeadlines();
  }

  @Get(':id')
  @UseInterceptors(EdgeCacheInterceptor)
  @EdgeCache({
    maxAge: 3600,
    sMaxAge: 86400,
    staleWhileRevalidate: 86400,
    tags: ['cambium-catalog', 'grant-detail'],
    public: true,
  })
  @ApiOperation({ summary: 'Get a single research opportunity by ID with joined tags and creator' })
  @ApiParam({ name: 'id', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity details with ETag validation' })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  async getOpportunityById(@Param('id') id: string) {
    return this.oppService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new research opportunity and purge edge cache' })
  @ApiResponse({ status: 201, description: 'Opportunity created successfully' })
  async createOpportunity(
    @Body() dto: CreateOpportunityDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const created = await this.oppService.create(dto, user?.id);
    this.cloudflarePurge.purgeTags(['cambium-catalog', 'grants-list', 'grants-stats']).catch(() => {});
    return created;
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
    const result = await this.oppService.bulkCreate(list, user?.id);
    this.cloudflarePurge.purgeTags(['cambium-catalog', 'grants-list', 'grants-stats']).catch(() => {});
    return result;
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
  @ApiOperation({ summary: 'Update an existing research opportunity and purge edge cache' })
  @ApiParam({ name: 'id', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity updated successfully' })
  async updateOpportunity(
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    const updated = await this.oppService.update(id, dto);
    this.cloudflarePurge.purgeTags(['cambium-catalog', 'grants-list', 'grant-detail']).catch(() => {});
    return updated;
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
    const result = await this.oppService.updateTags(id, tagsArray);
    this.cloudflarePurge.purgeTags(['cambium-catalog', 'grants-list']).catch(() => {});
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a research opportunity and purge edge cache' })
  @ApiParam({ name: 'id', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity deleted successfully' })
  async deleteOpportunity(@Param('id') id: string) {
    const result = await this.oppService.remove(id);
    this.cloudflarePurge.purgeTags(['cambium-catalog', 'grants-list', 'grants-stats']).catch(() => {});
    return result;
  }
}
