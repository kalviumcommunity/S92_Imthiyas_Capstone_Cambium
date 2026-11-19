import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SubscriptionGuard, RequiresSubscription } from '../auth/guards/subscription.guard';

@ApiTags('Collaborative Project Workspaces')
@Controller(['projects', 'api/projects'])
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List user projects and research collaborations' })
  async getUserProjects(@Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.getUserProjects(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve project repository details with CRediT roster and activity' })
  async getProjectDetails(@Param('id') id: string, @Req() req: any) {
    const requesterId = req.user?.id || req.headers?.['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.getProjectDetails(id, requesterId);
  }

  @Post()
  @UseGuards(SubscriptionGuard)
  @RequiresSubscription('team')
  @ApiOperation({ summary: 'Initialize new collaborative research project workspace (Team Tier Required)' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createProject(@Body() dto: CreateProjectDto, @Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.createProject(userId, dto);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Invite collaborator with CRediT authorship role' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async inviteMember(
    @Param('id') projectId: string,
    @Body() dto: InviteMemberDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.inviteMember(projectId, userId, dto);
  }

  @Post(':id/link-doi')
  @ApiOperation({ summary: 'Link OpenAlex / PubMed DOI to project literature vault' })
  async linkDoi(
    @Param('id') projectId: string,
    @Body('doi') doi: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.linkDoi(projectId, userId, doi);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update research workspace metadata with optimistic concurrency control' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateProject(
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.updateProject(projectId, userId, dto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'List threaded comments and methodology critiques for workspace' })
  async getProjectComments(@Param('id') projectId: string, @Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.getProjectComments(projectId, userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add section comment or peer review critique to workspace' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async addComment(
    @Param('id') projectId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.addComment(projectId, userId, dto);
  }

  @Put(':id/comments/:commentId/resolve')
  @ApiOperation({ summary: 'Resolve threaded peer review comment' })
  async resolveComment(
    @Param('id') projectId: string,
    @Param('commentId') commentId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.resolveComment(projectId, commentId, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete or archive research workspace (Owner only)' })
  async deleteProject(
    @Param('id') projectId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.deleteProject(projectId, userId);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove collaborator from workspace roster' })
  async removeMember(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.removeMember(projectId, userId, memberId);
  }
}
