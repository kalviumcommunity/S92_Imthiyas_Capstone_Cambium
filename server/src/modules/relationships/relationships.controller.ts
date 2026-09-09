import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RelationshipsService } from './relationships.service';

@ApiTags('Relationships')
@Controller('api/relationships')
export class RelationshipsController {
  constructor(private readonly relService: RelationshipsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user profile with fully populated entity relationships' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User relationships' })
  async getUserRelationships(@Param('userId') userId: string) {
    return this.relService.getUserRelationships(userId);
  }

  @Get('opportunity/:opportunityId')
  @ApiOperation({ summary: 'Get opportunity with creator and bookmarked users' })
  @ApiParam({ name: 'opportunityId', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity relationships' })
  async getOpportunityRelationships(@Param('opportunityId') opportunityId: string) {
    return this.relService.getOpportunityRelationships(opportunityId);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get overview of all database entity relationships and foreign keys' })
  @ApiResponse({ status: 200, description: 'Relationship overview' })
  async getRelationshipOverview() {
    return this.relService.getRelationshipOverview();
  }
}
