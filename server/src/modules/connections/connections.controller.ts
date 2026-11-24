import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConnectionsService } from './connections.service';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Scholar Network & Connections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['connections', 'api/connections', 'api/v1/connections'])
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all academic connections (accepted or pending)' })
  async getConnections(
    @Query('status') status: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.connectionsService.getConnections(user.id, status);
  }

  @Get('network')
  @ApiOperation({ summary: 'Retrieve network overview metrics (followers, connections)' })
  async getNetworkOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.connectionsService.getNetworkOverview(user.id);
  }

  @Post('request')
  @ApiOperation({ summary: 'Send 2-way academic connection request' })
  async requestConnection(
    @Body('addresseeId') addresseeId: string,
    @Body('academicContext') academicContext: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.connectionsService.requestConnection(user.id, addresseeId, academicContext);
  }

  @Patch(':id/respond')
  @ApiOperation({ summary: 'Accept or decline connection request' })
  async respond(
    @Param('id') connectionId: string,
    @Body('accept') accept: boolean,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.connectionsService.respondToConnection(connectionId, user.id, accept);
  }

  @Post('follow/:targetId')
  @ApiOperation({ summary: 'Toggle 1-way follow on a researcher' })
  async toggleFollow(
    @Param('targetId') targetId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.connectionsService.toggleFollow(user.id, targetId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an existing connection or cancel pending request' })
  async removeConnection(
    @Param('id') connectionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.connectionsService.removeConnection(connectionId, user.id);
  }
}
