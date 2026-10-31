import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConnectionsService } from './connections.service';

@ApiTags('Scholar Network & Connections')
@Controller(['connections', 'api/connections'])
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all academic connections (accepted or pending)' })
  async getConnections(@Query('status') status: string, @Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.connectionsService.getConnections(userId, status);
  }

  @Get('network')
  @ApiOperation({ summary: 'Retrieve network overview metrics (followers, connections)' })
  async getNetworkOverview(@Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.connectionsService.getNetworkOverview(userId);
  }

  @Post('request')
  @ApiOperation({ summary: 'Send 2-way academic connection request' })
  async requestConnection(
    @Body('addresseeId') addresseeId: string,
    @Body('academicContext') academicContext: string,
    @Req() req: any,
  ) {
    const requesterId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.connectionsService.requestConnection(requesterId, addresseeId, academicContext);
  }

  @Patch(':id/respond')
  @ApiOperation({ summary: 'Accept or decline connection request' })
  async respond(
    @Param('id') connectionId: string,
    @Body('accept') accept: boolean,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.connectionsService.respondToConnection(connectionId, userId, accept);
  }

  @Post('follow/:targetId')
  @ApiOperation({ summary: 'Toggle 1-way follow on a researcher' })
  async toggleFollow(@Param('targetId') targetId: string, @Req() req: any) {
    const followerId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.connectionsService.toggleFollow(followerId, targetId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an existing connection or cancel pending request' })
  async removeConnection(@Param('id') connectionId: string, @Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.connectionsService.removeConnection(connectionId, userId);
  }
}
