import { Controller, Get, Param, UseGuards, ParseUUIDPipe, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RelationshipsService } from './relationships.service';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Relationships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/relationships')
export class RelationshipsController {
  constructor(private readonly relService: RelationshipsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get authenticated scholar profile with populated entity relationships' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User relationships (sanitized)' })
  async getUserRelationships(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() caller: AuthenticatedUser,
  ) {
    if (caller.id !== userId && caller.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Access denied: cannot enumerate another user relationships');
    }
    return this.relService.getUserRelationships(userId);
  }

  @Get('opportunity/:opportunityId')
  @ApiOperation({ summary: 'Get opportunity creator & aggregate bookmark count (no user PII leak)' })
  @ApiParam({ name: 'opportunityId', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity relationships' })
  async getOpportunityRelationships(
    @Param('opportunityId', ParseUUIDPipe) opportunityId: string,
  ) {
    return this.relService.getOpportunityRelationships(opportunityId);
  }

  @Get('overview')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPLIANCE_OFFICER)
  @ApiOperation({ summary: 'Get overview of all database entity relationships and foreign keys (Admin/Compliance)' })
  @ApiResponse({ status: 200, description: 'Relationship overview' })
  async getRelationshipOverview() {
    return this.relService.getRelationshipOverview();
  }
}
